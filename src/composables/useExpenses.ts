import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { useBudgetStore } from '@/stores/budget'
import { useLocalStorage } from './useLocalStorage'
import { SYNC_TIMEOUT } from '@/lib/constants'
import type { Expense } from '@/types'

export function useExpenses() {
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

  function sanitizeInput(text: string): string {
    // Remove HTML tags and potentially dangerous characters
    if (!text) return ''
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[<>]/g, '') // Remove remaining < and >
      .trim()
  }

  async function addExpense(amountDollars: number, note: string, customTimestamp?: string): Promise<void> {
    if (!amountDollars || amountDollars < 0.01 || !note) {
      throw new Error('Invalid expense amount or note')
    }

    if (!budgetStore.currentPeriod) {
      throw new Error('No active period')
    }

    const amountCents = Math.round(amountDollars * 100)
    const sanitizedNote = sanitizeInput(note)
    const timestamp = customTimestamp || new Date().toISOString()

    try {
      if (authStore.user) {
        authStore.setSyncing(true)

        // Create expense in cloud
        const { data: newExpense, error } = await promiseWithTimeout(
          supabase
            .from('expenses')
            .insert({
              period_id: budgetStore.currentPeriod.id,
              user_id: authStore.user.id,
              amount_cents: amountCents,
              note: sanitizedNote,
              timestamp: timestamp,
            })
            .select()
            .single(),
          SYNC_TIMEOUT,
          'Failed to save expense. Please check your connection.'
        )

        if (error) throw error

        // Add to local state
        const expense: Expense = {
          id: newExpense.id,
          period_id: newExpense.period_id,
          user_id: newExpense.user_id,
          timestamp: newExpense.timestamp,
          amount_cents: newExpense.amount_cents,
          note: newExpense.note || '',
        }

        budgetStore.addExpense(expense)
      } else {
        // Local-only mode
        const expense: Expense = {
          id: generateId(),
          period_id: budgetStore.currentPeriod.id,
          user_id: 'local',
          timestamp: timestamp,
          amount_cents: amountCents,
          note: sanitizedNote,
        }

        budgetStore.addExpense(expense)
      }

      saveData()
    } catch (error: any) {
      console.error('Error adding expense:', error)

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

  async function deleteExpense(expenseId: string): Promise<void> {
    if (!expenseId) {
      throw new Error('Invalid expense ID')
    }

    try {
      if (authStore.user) {
        authStore.setSyncing(true)

        // Delete from cloud first
        const { error } = await promiseWithTimeout(
          supabase.from('expenses').delete().eq('id', expenseId),
          SYNC_TIMEOUT,
          'Failed to delete expense. Please check your connection.'
        )

        if (error) throw error

        // Only delete locally if cloud delete succeeded
        budgetStore.removeExpense(expenseId)
        saveData()
      } else {
        // Local-only mode - safe to delete immediately
        budgetStore.removeExpense(expenseId)
        saveData()
      }
    } catch (error: any) {
      console.error('Error deleting expense:', error)

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

  return {
    addExpense,
    deleteExpense,
  }
}
