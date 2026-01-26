export interface Expense {
  id: string
  period_id: string
  user_id: string
  amount_cents: number
  note: string
  timestamp: string
  category?: string // NEW: Optional for backward compatibility
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
