import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Period, Expense, HistoricalPeriod } from '@/types'

// Budget store with initial load tracking
export const useBudgetStore = defineStore('budget', () => {
  // State
  const currentPeriod = ref<Period | null>(null)
  const history = ref<HistoricalPeriod[]>([])
  const lastBudgetCents = ref<number | null>(null)
  const longestStreak = ref(0)
  const hasInitialLoad = ref(false)

  // Getters
  const totalSpentCents = computed(() => {
    if (!currentPeriod.value) return 0
    return currentPeriod.value.expenses?.reduce((sum, exp) => sum + exp.amount_cents, 0) || 0
  })

  const remainingCents = computed(() => {
    if (!currentPeriod.value) return 0
    return currentPeriod.value.budget_cents - totalSpentCents.value
  })

  const remainingColorClass = computed(() => {
    if (!currentPeriod.value) return ''
    const remaining = remainingCents.value
    const budget = currentPeriod.value.budget_cents

    if (remaining <= 0) return 'danger'
    if (remaining <= budget * 0.4) return 'warning'
    return ''
  })

  const daysLeft = computed(() => {
    if (!currentPeriod.value) return 0
    const now = new Date()
    const end = new Date(currentPeriod.value.end_date)
    const diffMs = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    return diffDays
  })

  const isPeriodOverdue = computed(() => {
    return daysLeft.value < 0
  })

  const sortedExpenses = computed(() => {
    if (!currentPeriod.value || !currentPeriod.value.expenses) return []
    return [...currentPeriod.value.expenses].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  })

  const isProRatedWeek = computed(() => {
    if (!currentPeriod.value || !lastBudgetCents.value) return false
    return currentPeriod.value.budget_cents < lastBudgetCents.value
  })

  const currentStreak = computed(() => {
    if (!history.value.length) return 0
    let streak = 0
    for (const period of history.value) {
      const success = period.success ?? ((period.total_spent_cents ?? 0) <= period.budget_cents)
      if (success) streak++
      else break
    }
    return streak
  })

  const hasExpensesToday = computed(() => {
    if (!currentPeriod.value || !currentPeriod.value.expenses) return false

    const today = new Date().toISOString().split('T')[0]
    return currentPeriod.value.expenses.some((exp) => {
      const expDate = new Date(exp.timestamp).toISOString().split('T')[0]
      return expDate === today
    })
  })

  const successRate = computed(() => {
    if (!history.value.length) return 0
    const successfulWeeks = history.value.filter((period) => {
      const success = period.success ?? (period.total_spent_cents! <= period.budget_cents)
      return success
    }).length
    return Math.round((successfulWeeks / history.value.length) * 100)
  })

  const totalHistoricalSpending = computed(() => {
    if (!history.value.length) return 0
    return history.value.reduce((sum, period) => sum + (period.total_spent_cents || 0), 0)
  })

  const totalHistoricalSavings = computed(() => {
    if (!history.value.length) return 0
    return history.value.reduce((sum, period) => {
      const savings = period.budget_cents - (period.total_spent_cents || 0)
      return sum + savings
    }, 0)
  })

  const avgSpendingPerWeek = computed(() => {
    if (!history.value.length) return 0
    return Math.round(totalHistoricalSpending.value / history.value.length)
  })

  // Actions
  function setCurrentPeriod(period: Period | null) {
    currentPeriod.value = period
  }

  function setHistory(newHistory: HistoricalPeriod[]) {
    history.value = newHistory
  }

  function setLastBudgetCents(amount: number | null) {
    lastBudgetCents.value = amount
  }

  function setLongestStreak(streak: number) {
    longestStreak.value = streak
  }

  function addExpense(expense: Expense) {
    if (currentPeriod.value) {
      if (!currentPeriod.value.expenses) {
        currentPeriod.value.expenses = []
      }
      currentPeriod.value.expenses.push(expense)
    }
  }

  function removeExpense(expenseId: string) {
    if (currentPeriod.value && currentPeriod.value.expenses) {
      currentPeriod.value.expenses = currentPeriod.value.expenses.filter(
        (exp) => exp.id !== expenseId
      )
    }
  }

  function updatePeriodBudget(budgetCents: number) {
    if (currentPeriod.value) {
      currentPeriod.value.budget_cents = budgetCents
    }
  }

  function toggleDayMarkedDone(dayKey: string) {
    if (!currentPeriod.value) return

    const currentDays = currentPeriod.value.days_marked_done
    const index = currentDays.indexOf(dayKey)

    if (index > -1) {
      // Remove the day - create new array to ensure reactivity
      currentPeriod.value.days_marked_done = currentDays.filter((d) => d !== dayKey)
    } else {
      // Add the day - create new array to ensure reactivity
      currentPeriod.value.days_marked_done = [...currentDays, dayKey]
    }
  }

  function setHasInitialLoad(loaded: boolean) {
    console.log('[BudgetStore] setHasInitialLoad called with:', loaded)
    hasInitialLoad.value = loaded
  }

  function resetBudgetState() {
    currentPeriod.value = null
    history.value = []
    lastBudgetCents.value = null
    longestStreak.value = 0
    hasInitialLoad.value = false
  }

  return {
    // State
    currentPeriod,
    history,
    lastBudgetCents,
    longestStreak,
    hasInitialLoad,
    // Getters
    totalSpentCents,
    remainingCents,
    remainingColorClass,
    daysLeft,
    isPeriodOverdue,
    sortedExpenses,
    isProRatedWeek,
    currentStreak,
    hasExpensesToday,
    successRate,
    totalHistoricalSpending,
    totalHistoricalSavings,
    avgSpendingPerWeek,
    // Actions
    setCurrentPeriod,
    setHistory,
    setLastBudgetCents,
    setLongestStreak,
    setHasInitialLoad,
    addExpense,
    removeExpense,
    updatePeriodBudget,
    toggleDayMarkedDone,
    resetBudgetState,
  }
})
