import type { User as SupabaseUser } from '@supabase/supabase-js'

export type User = SupabaseUser

export interface AuthState {
  user: User | null
  isLoading: boolean
  isSyncing: boolean
  syncError: string | null
  lastSyncTime: Date | null
  pendingChanges: boolean
}
