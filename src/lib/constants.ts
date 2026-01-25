export const MILESTONES = [
  { name: 'First Win', weeks: 1, icon: '🎉' },
  { name: 'Getting Started', weeks: 2, icon: '🌱' },
  { name: 'Building Habits', weeks: 3, icon: '💪' },
  { name: 'One Month Strong', weeks: 4, icon: '📅' },
  { name: 'Consistent', weeks: 6, icon: '⭐' },
  { name: 'Impressive', weeks: 8, icon: '🔥' },
  { name: 'Unstoppable', weeks: 12, icon: '🚀' },
  { name: 'Half Year Hero', weeks: 26, icon: '👑' },
  { name: 'Legend', weeks: 52, icon: '🏆' },
] as const

export const EXPENSE_CATEGORIES = [
  { value: 'Groceries', label: '🛒 Groceries' },
  { value: 'Dining Out', label: '🍽️ Dining Out' },
  { value: 'Transportation', label: '🚗 Transportation' },
  { value: 'Entertainment', label: '🎬 Entertainment' },
  { value: 'Shopping', label: '🛍️ Shopping' },
  { value: 'Healthcare', label: '🏥 Healthcare' },
  { value: 'Personal Care', label: '💅 Personal Care' },
  { value: 'Coffee/Drinks', label: '☕ Coffee/Drinks' },
  { value: 'Subscriptions', label: '📱 Subscriptions' },
  { value: 'Other', label: '📦 Other' },
] as const

export const LOADING_TIMEOUT = 10000 // 10 seconds
export const SLOW_LOADING_THRESHOLD = 3000 // 3 seconds
export const SYNC_TIMEOUT = 10000 // 10 seconds
export const SESSION_TIMEOUT = 8000 // 8 seconds
export const SESSION_REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes

export const STORAGE_KEYS = {
  CURRENT_PERIOD: 'budget.currentPeriod',
  HISTORY: 'budget.history',
  LAST_BUDGET_CENTS: 'budget.lastBudgetCents',
  LONGEST_STREAK: 'budget.longestStreak',
} as const
