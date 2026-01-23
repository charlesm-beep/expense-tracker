import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { useBudgetStore } from '@/stores/budget'
import { useLocalStorage } from './useLocalStorage'
import { SYNC_TIMEOUT } from '@/lib/constants'
import type { Period } from '@/types'

export function useBudget() {
  const authStore = useAuthStore()
  const budgetStore = useBudgetStore()
  const localStorage = useLocalStorage()

  function promiseWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    errorMessage: string
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
      ),
    ])
  }

  function saveData(): void {
    localStorage.saveCurrentPeriod(budgetStore.currentPeriod)
    localStorage.saveHistory(budgetStore.history)
    localStorage.saveLastBudgetCents(budgetStore.lastBudgetCents)
  }

  function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  function getWeekStart(date: Date = new Date()): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = day === 0 ? -6 : 1 - day // Adjust to Monday
    d.setDate(d.getDate() + diff)
    d.setHours(0, 0, 0, 0)
    return d
  }

  function getWeekEnd(weekStart: Date): Date {
    const end = new Date(weekStart)
    end.setDate(end.getDate() + 6)
    end.setHours(23, 59, 59, 999)
    return end
  }

  async function createNewPeriod(budgetAmount: number): Promise<void> {
    if (!budgetAmount || budgetAmount < 0.01) return

    const start = getWeekStart()
    const end = getWeekEnd(start)
    const weeklyBudgetCents = Math.round(budgetAmount * 100)

    // Calculate days in period for pro-rating
    const now = new Date()
    const daysInPeriod = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    // Pro-rate budget if partial week (less than 7 days)
    const budgetCents =
      daysInPeriod < 7
        ? Math.round(weeklyBudgetCents * (daysInPeriod / 7))
        : weeklyBudgetCents

    try {
      if (authStore.user) {
        authStore.setSyncing(true)

        // Archive current period if exists
        if (budgetStore.currentPeriod) {
          await promiseWithTimeout(
            supabase
              .from('periods')
              .update({ closed: true })
              .eq('id', budgetStore.currentPeriod.id),
            SYNC_TIMEOUT,
            'Failed to archive current period. Please check your connection.'
          )
        }

        // Create new period in cloud
        const { data: newPeriod, error } = await promiseWithTimeout(
          supabase
            .from('periods')
            .insert({
              user_id: authStore.user.id,
              start_date: start.toISOString(),
              end_date: end.toISOString(),
              budget_cents: budgetCents,
              days_marked_done: [],
              closed: false,
            })
            .select()
            .single(),
          SYNC_TIMEOUT,
          'Failed to create new period. Please check your connection.'
        )

        if (error) throw error

        // Update local state
        if (budgetStore.currentPeriod) {
          budgetStore.history.unshift({
            ...budgetStore.currentPeriod,
            closed: true,
            total_spent_cents: budgetStore.totalSpentCents,
            success: budgetStore.totalSpentCents <= budgetStore.currentPeriod.budget_cents,
          })
        }

        const period: Period = {
          id: newPeriod.id,
          user_id: newPeriod.user_id,
          start_date: newPeriod.start_date,
          end_date: newPeriod.end_date,
          budget_cents: newPeriod.budget_cents,
          days_marked_done: [],
          expenses: [],
          closed: false,
        }

        budgetStore.setCurrentPeriod(period)
      } else {
        // Local-only mode
        if (budgetStore.currentPeriod) {
          budgetStore.history.unshift({
            ...budgetStore.currentPeriod,
            closed: true,
            total_spent_cents: budgetStore.totalSpentCents,
            success: budgetStore.totalSpentCents <= budgetStore.currentPeriod.budget_cents,
          })
        }

        const period: Period = {
          id: generateId(),
          user_id: 'local',
          start_date: start.toISOString(),
          end_date: end.toISOString(),
          budget_cents: budgetCents,
          days_marked_done: [],
          expenses: [],
          closed: false,
        }

        budgetStore.setCurrentPeriod(period)
      }

      budgetStore.setLastBudgetCents(weeklyBudgetCents)
      saveData()
    } catch (error: any) {
      console.error('Error creating new period:', error)

      // If sync failed but we're signed in, mark as pending changes
      if (authStore.user) {
        authStore.setPendingChanges(true)
      }

      throw error
    } finally {
      if (authStore.user) {
        authStore.setSyncing(false)
      }
    }
  }

  async function updateBudget(budgetAmount: number): Promise<void> {
    if (!budgetAmount || budgetAmount < 0.01) return

    const budgetCents = Math.round(budgetAmount * 100)

    try {
      if (authStore.user && budgetStore.currentPeriod) {
        authStore.setSyncing(true)

        // Update current period budget
        const { error } = await promiseWithTimeout(
          supabase
            .from('periods')
            .update({ budget_cents: budgetCents })
            .eq('id', budgetStore.currentPeriod.id),
          SYNC_TIMEOUT,
          'Failed to update budget. Please check your connection.'
        )

        if (error) throw error

        budgetStore.updatePeriodBudget(budgetCents)
      } else if (budgetStore.currentPeriod) {
        // Local-only mode
        budgetStore.updatePeriodBudget(budgetCents)
      }

      budgetStore.setLastBudgetCents(budgetCents)
      saveData()
    } catch (error: any) {
      console.error('Error updating budget:', error)

      // If sync failed but we're signed in, mark as pending changes
      if (authStore.user) {
        authStore.setPendingChanges(true)
      }

      throw error
    } finally {
      if (authStore.user) {
        authStore.setSyncing(false)
      }
    }
  }

  async function checkAndRolloverPeriod(): Promise<void> {
    if (!budgetStore.currentPeriod) return

    const now = new Date()
    const periodEnd = new Date(budgetStore.currentPeriod.end_date)

    // If period has ended, roll over to new week
    if (now > periodEnd) {
      // Use full weekly budget (not pro-rated) for new weeks
      const budgetCents =
        budgetStore.lastBudgetCents || budgetStore.currentPeriod.budget_cents

      try {
        if (authStore.user) {
          authStore.setSyncing(true)

          // Close expired period
          const wasSuccessful =
            budgetStore.totalSpentCents <= budgetStore.currentPeriod.budget_cents

          await supabase
            .from('periods')
            .update({
              closed: true,
              total_spent_cents: budgetStore.totalSpentCents,
              success: wasSuccessful,
            })
            .eq('id', budgetStore.currentPeriod.id)

          // Add to history
          budgetStore.history.unshift({
            ...budgetStore.currentPeriod,
            closed: true,
            total_spent_cents: budgetStore.totalSpentCents,
            success: wasSuccessful,
          })

          // Update longest streak if current streak is higher
          if (budgetStore.currentStreak > budgetStore.longestStreak) {
            budgetStore.setLongestStreak(budgetStore.currentStreak)
            localStorage.saveLongestStreak(budgetStore.currentStreak)
          }

          // Create new period for current week
          const start = getWeekStart()
          const end = getWeekEnd(start)

          const { data: newPeriod, error } = await supabase
            .from('periods')
            .insert({
              user_id: authStore.user.id,
              start_date: start.toISOString(),
              end_date: end.toISOString(),
              budget_cents: budgetCents,
              days_marked_done: [],
              closed: false,
            })
            .select()
            .single()

          if (error) throw error

          const period: Period = {
            id: newPeriod.id,
            user_id: newPeriod.user_id,
            start_date: newPeriod.start_date,
            end_date: newPeriod.end_date,
            budget_cents: newPeriod.budget_cents,
            days_marked_done: [],
            expenses: [],
            closed: false,
          }

          budgetStore.setCurrentPeriod(period)
        } else {
          // Local-only mode
          const wasSuccessful =
            budgetStore.totalSpentCents <= budgetStore.currentPeriod.budget_cents

          budgetStore.history.unshift({
            ...budgetStore.currentPeriod,
            closed: true,
            total_spent_cents: budgetStore.totalSpentCents,
            success: wasSuccessful,
          })

          // Update longest streak if current streak is higher
          if (budgetStore.currentStreak > budgetStore.longestStreak) {
            budgetStore.setLongestStreak(budgetStore.currentStreak)
            localStorage.saveLongestStreak(budgetStore.currentStreak)
          }

          // Create new period for current week
          const start = getWeekStart()
          const end = getWeekEnd(start)

          const period: Period = {
            id: generateId(),
            user_id: 'local',
            start_date: start.toISOString(),
            end_date: end.toISOString(),
            budget_cents: budgetCents,
            days_marked_done: [],
            expenses: [],
            closed: false,
          }

          budgetStore.setCurrentPeriod(period)
        }

        saveData()
      } catch (error) {
        console.error('Error rolling over period:', error)
      } finally {
        if (authStore.user) {
          authStore.setSyncing(false)
        }
      }
    }
  }

  return {
    createNewPeriod,
    updateBudget,
    checkAndRolloverPeriod,
    getWeekStart,
    getWeekEnd,
  }
}
