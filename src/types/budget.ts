export interface Expense {
  id: string
  period_id: string
  user_id: string
  amount_cents: number
  note: string
  timestamp: string
  category?: string // Optional for backward compatibility
  is_recurring?: boolean // True if auto-created from recurring item
}

export interface Period {
  id: string
  user_id: string
  start_date: string
  end_date: string
  budget_cents: number
  closed: boolean
  days_marked_done: string[]
  expenses?: Expense[]
  income_entries?: IncomeEntry[]
  total_income_cents?: number
  net_savings_cents?: number
}

export interface HistoricalPeriod extends Period {
  success?: boolean
  total_spent_cents?: number
}

export interface DayInfo {
  date: Date
  dayKey: string
  dayName: string
  dayNumber: number
  isComplete: boolean
  isToday: boolean
}

export interface Milestone {
  name: string
  weeks: number
  icon: string
}

export interface RecurringItem {
  id: string
  user_id: string
  item_type: 'income' | 'expense'
  category_name: string
  amount_cents: number
  description: string
  frequency: 'weekly' | 'biweekly' | 'monthly'
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface IncomeEntry {
  id: string
  period_id: string
  user_id: string
  amount_cents: number
  source: string
  income_type: 'salary' | 'bonus' | 'other'
  timestamp: string
  created_at?: string
}

export interface CategoryBreakdown {
  category_name: string
  budget_cents: number
  spent_cents: number
  remaining_cents: number
  is_discretionary: boolean
}

export interface SavingsData {
  total_income_cents: number
  total_expenses_cents: number
  net_savings_cents: number
  cumulative_savings_cents: number
  savings_rate: number
}
