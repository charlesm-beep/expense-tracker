import { STORAGE_KEYS } from '@/lib/constants'
import type { Period, HistoricalPeriod } from '@/types'

export function useLocalStorage() {
  function saveCurrentPeriod(period: Period | null): void {
    try {
      if (period) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_PERIOD, JSON.stringify(period))
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_PERIOD)
      }
    } catch (error) {
      console.error('Error saving current period to localStorage:', error)
    }
  }

  function loadCurrentPeriod(): Period | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_PERIOD)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('Error loading current period from localStorage:', error)
      return null
    }
  }

  function saveHistory(history: HistoricalPeriod[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history))
    } catch (error) {
      console.error('Error saving history to localStorage:', error)
    }
  }

  function loadHistory(): HistoricalPeriod[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading history from localStorage:', error)
      return []
    }
  }

  function saveLastBudgetCents(cents: number | null): void {
    try {
      if (cents !== null) {
        localStorage.setItem(STORAGE_KEYS.LAST_BUDGET_CENTS, cents.toString())
      } else {
        localStorage.removeItem(STORAGE_KEYS.LAST_BUDGET_CENTS)
      }
    } catch (error) {
      console.error('Error saving last budget cents to localStorage:', error)
    }
  }

  function loadLastBudgetCents(): number | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LAST_BUDGET_CENTS)
      return stored ? parseInt(stored, 10) : null
    } catch (error) {
      console.error('Error loading last budget cents from localStorage:', error)
      return null
    }
  }

  function saveLongestStreak(streak: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LONGEST_STREAK, streak.toString())
    } catch (error) {
      console.error('Error saving longest streak to localStorage:', error)
    }
  }

  function loadLongestStreak(): number {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LONGEST_STREAK)
      return stored ? parseInt(stored, 10) : 0
    } catch (error) {
      console.error('Error loading longest streak from localStorage:', error)
      return 0
    }
  }

  function clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }

  function getItem(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Error getting item from localStorage:', error)
      return null
    }
  }

  function setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('Error setting item in localStorage:', error)
    }
  }

  function removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing item from localStorage:', error)
    }
  }

  return {
    saveCurrentPeriod,
    loadCurrentPeriod,
    saveHistory,
    loadHistory,
    saveLastBudgetCents,
    loadLastBudgetCents,
    saveLongestStreak,
    loadLongestStreak,
    clearAllData,
    getItem,
    setItem,
    removeItem,
  }
}
