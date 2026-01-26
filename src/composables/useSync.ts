import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { useBudgetStore } from '@/stores/budget'
import { useLocalStorage } from './useLocalStorage'
import { SYNC_TIMEOUT } from '@/lib/constants'
import type { Period, Expense } from '@/types'

export function useSync() {
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

  async function syncFromCloud(): Promise<void> {
    console.log('=== syncFromCloud: ENTRY ===')

    // Prevent duplicate syncs
    if (authStore.isSyncing) {
      console.log('syncFromCloud: Already syncing, skipping...')
      return
    }

    try {
      console.log('syncFromCloud: Starting sync...')
      authStore.setSyncing(true)
      authStore.setSyncError(null)

      // Verify we have a valid session before syncing
      console.log('syncFromCloud: About to verify session...')
      const {
        data: { session },
      } = await promiseWithTimeout(
        supabase.auth.getSession(),
        5000,
        'Session verification timed out'
      )
      console.log('syncFromCloud: Session check completed')

      if (!session || !session.user) {
        console.error('syncFromCloud: No valid session found')
        throw new Error('No valid session. Please sign in again.')
      }
      console.log('syncFromCloud: Session verified, user_id:', session.user.id)

      console.log('syncFromCloud: About to fetch periods...')

      const { data: periods, error } = await promiseWithTimeout(
        supabase
          .from('periods')
          .select(
            `
            *,
            expenses (*)
          `
          )
          .order('start_date', { ascending: false }),
        SYNC_TIMEOUT,
        'Network request timed out. Please check your connection.'
      )

      if (error) {
        console.error('syncFromCloud: Error fetching periods:', error)
        console.error('syncFromCloud: Error details:', JSON.stringify(error, null, 2))
        throw error
      }

      console.log('syncFromCloud: Periods fetched:', periods?.length || 0)

      const activePeriods = periods.filter((p) => !p.closed)
      const archivedPeriods = periods.filter((p) => p.closed)

      if (activePeriods.length > 0) {
        const period = activePeriods[0]
        const currentPeriod: Period = {
          id: period.id,
          user_id: period.user_id,
          start_date: period.start_date,
          end_date: period.end_date,
          budget_cents: period.budget_cents,
          closed: period.closed,
          days_marked_done: period.days_marked_done || [],
          expenses: period.expenses.map((e: any) => ({
            id: e.id,
            period_id: e.period_id,
            user_id: e.user_id,
            timestamp: e.timestamp,
            amount_cents: e.amount_cents,
            note: e.note || '',
            category: e.category || undefined,
          })),
        }
        budgetStore.setCurrentPeriod(currentPeriod)
      }

      const history = archivedPeriods.map((period) => ({
        id: period.id,
        user_id: period.user_id,
        start_date: period.start_date,
        end_date: period.end_date,
        budget_cents: period.budget_cents,
        total_spent_cents: period.total_spent_cents,
        closed: true,
        success: period.success,
        days_marked_done: period.days_marked_done || [],
        expenses: period.expenses.map((e: any) => ({
          id: e.id,
          period_id: e.period_id,
          user_id: e.user_id,
          timestamp: e.timestamp,
          amount_cents: e.amount_cents,
          note: e.note || '',
          category: e.category || undefined,
        })),
      }))

      budgetStore.setHistory(history)

      // Calculate longest streak from history (only closed periods)
      let maxStreak = 0
      let tempStreak = 0

      // Iterate from oldest to newest to find longest consecutive streak
      // Only count closed periods, not the current active period
      for (let i = budgetStore.history.length - 1; i >= 0; i--) {
        const period = budgetStore.history[i]
        const success =
          period.success ?? ((period.total_spent_cents ?? 0) <= period.budget_cents)

        if (success) {
          tempStreak++
          maxStreak = Math.max(maxStreak, tempStreak)
        } else {
          tempStreak = 0
        }
      }

      // longestStreak should only count completed periods
      // Don't include currentStreak since it may include the active period
      budgetStore.setLongestStreak(maxStreak)
      localStorage.saveLongestStreak(maxStreak)

      console.log('syncFromCloud: Saving data...')
      saveData()
      console.log('syncFromCloud: Sync complete!')

      // Track successful sync
      authStore.setLastSyncTime(new Date())
      authStore.setPendingChanges(false)
      localStorage.setItem('budget.lastSyncTime', new Date().toISOString())
    } catch (error: any) {
      console.error('=== syncFromCloud: CATCH BLOCK ENTERED ===')
      console.error('syncFromCloud: Sync error:', error)
      console.error('syncFromCloud: Error type:', error?.constructor?.name)
      console.error('syncFromCloud: Error message:', error?.message)
      authStore.setSyncError(error?.message)

      // Check if error is due to authentication issues
      const isAuthError =
        error?.message &&
        (error.message.includes('JWT') ||
          error.message.includes('expired') ||
          error.message.includes('invalid') ||
          error.message.includes('401') ||
          error.message.includes('unauthorized') ||
          error.code === 'PGRST301') // PostgREST JWT error

      if (isAuthError) {
        console.error('Authentication error detected, clearing session...')
        authStore.setSyncError('Session expired. Please sign in again.')
        // Clear the invalid session
        console.log('Calling signOut to clear invalid session...')
        await supabase.auth.signOut()
        console.log('SignOut complete, clearing user...')
        authStore.setUser(null)
        // Load local data as fallback
        const currentPeriod = localStorage.loadCurrentPeriod()
        const history = localStorage.loadHistory()
        const lastBudgetCents = localStorage.loadLastBudgetCents()
        const longestStreak = localStorage.loadLongestStreak()
        budgetStore.setCurrentPeriod(currentPeriod)
        budgetStore.setHistory(history)
        budgetStore.setLastBudgetCents(lastBudgetCents)
        budgetStore.setLongestStreak(longestStreak)
        console.log('LoadData complete, returning...')
        return
      }

      // Auto-retry once after 2 seconds for network errors
      if (
        !authStore.syncRetryAttempted &&
        (error?.message?.includes('timed out') || error?.message?.includes('network'))
      ) {
        console.log('Auto-retrying sync in 2 seconds...')
        authStore.setSyncRetryAttempted(true)
        setTimeout(async () => {
          if (authStore.syncError) {
            // Only retry if still showing error
            console.log('Attempting auto-retry...')
            authStore.setSyncing(false) // Reset sync flag before retry
            try {
              await syncFromCloud()
              authStore.setSyncError(null) // Clear error on success
            } catch (retryError) {
              console.error('Auto-retry failed:', retryError)
              // Don't overwrite syncError, keep showing original error
            }
          }
        }, 2000)
      }

      // Load local data as fallback
      const currentPeriod = localStorage.loadCurrentPeriod()
      const history = localStorage.loadHistory()
      const lastBudgetCents = localStorage.loadLastBudgetCents()
      const longestStreak = localStorage.loadLongestStreak()
      budgetStore.setCurrentPeriod(currentPeriod)
      budgetStore.setHistory(history)
      budgetStore.setLastBudgetCents(lastBudgetCents)
      budgetStore.setLongestStreak(longestStreak)
    } finally {
      console.log('=== syncFromCloud: FINALLY BLOCK ENTERED ===')
      console.log('syncFromCloud: Setting isSyncing to false')
      authStore.setSyncing(false)
      console.log('syncFromCloud: isSyncing set to FALSE')
    }
  }

  return {
    syncFromCloud,
  }
}
