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

  return {
    weekDays,
    toggleDayComplete,
  }
}
