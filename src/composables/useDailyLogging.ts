import { computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { useBudgetStore } from '@/stores/budget'
import { useLocalStorage } from './useLocalStorage'
import type { DayInfo } from '@/types'

export function useDailyLogging() {
  const authStore = useAuthStore()
  const budgetStore = useBudgetStore()
  const localStorage = useLocalStorage()

  const weekDays = computed<DayInfo[]>(() => {
    if (!budgetStore.currentPeriod) return []

    const days: DayInfo[] = []
    const start = new Date(budgetStore.currentPeriod.start_date)

    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      const dayKey = day.toISOString().split('T')[0] // 'YYYY-MM-DD'

      // Day is complete only if it's in the daysMarkedDone array
      const isMarkedDone = budgetStore.currentPeriod.days_marked_done.includes(dayKey)

      days.push({
        date: day,
        dayKey,
        dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: day.getDate(),
        isComplete: isMarkedDone,
        isToday: dayKey === new Date().toISOString().split('T')[0],
      })
    }

    return days
  })

  async function toggleDayComplete(dayKey: string): Promise<void> {
    if (!budgetStore.currentPeriod) {
      return
    }

    // Toggle in store
    budgetStore.toggleDayMarkedDone(dayKey)

    // Save to localStorage
    localStorage.saveCurrentPeriod(budgetStore.currentPeriod)

    // Sync to Supabase if online
    if (authStore.user) {
      try {
        await supabase
          .from('periods')
          .update({
            days_marked_done: budgetStore.currentPeriod.days_marked_done
          })
          .eq('id', budgetStore.currentPeriod.id)
      } catch (error) {
        console.error('Failed to sync day completion:', error)
        authStore.setPendingChanges(true)
      }
    }
  }

  function getConsecutiveDays(daysMarkedDone: string[]): number {
    if (daysMarkedDone.length === 0) return 0

    // Sort days chronologically
    const sortedDays = [...daysMarkedDone].sort()
    let consecutive = 1

    // Count backwards from the most recent day
    for (let i = sortedDays.length - 1; i > 0; i--) {
      const current = new Date(sortedDays[i])
      const previous = new Date(sortedDays[i - 1])
      const diffDays = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        consecutive++
      } else {
        break
      }
    }

    return consecutive
  }

  return {
    weekDays,
    toggleDayComplete,
    getConsecutiveDays,
  }
}
