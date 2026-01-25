import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { useBudgetStore } from '@/stores/budget'
import { useLocalStorage } from './useLocalStorage'
import { useSync } from './useSync'
import { SESSION_TIMEOUT } from '@/lib/constants'

export function useAuth() {
  const authStore = useAuthStore()
  const budgetStore = useBudgetStore()
  const localStorageService = useLocalStorage()
  const { syncFromCloud } = useSync()

  function promiseWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    timeoutMessage: string
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
      ),
    ])
  }

  async function signInWithGoogle(): Promise<void> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })
      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error('Error signing in:', error)
      alert('Error signing in: ' + (error?.message || 'Unknown error'))
    }
  }

  async function signOut(): Promise<void> {
    try {
      const { error } = await promiseWithTimeout(
        supabase.auth.signOut(),
        5000,
        'Sign out timed out. Signing out locally.'
      )
      if (error) {
        console.error('Error signing out:', error)
      }
    } catch (error) {
      console.error('Sign out timeout:', error)
    } finally {
      authStore.setUser(null)
      budgetStore.resetBudgetState()
      localStorageService.clearAllData()
    }
  }

  async function forceSignOut(): Promise<void> {
    authStore.setLoading(false)
    authStore.setSyncing(false)
    await signOut()
  }

  function loadLocalData(): void {
    console.log('Loading data from localStorage...')
    const currentPeriod = localStorageService.loadCurrentPeriod()
    const history = localStorageService.loadHistory()
    const lastBudgetCents = localStorageService.loadLastBudgetCents()
    const longestStreak = localStorageService.loadLongestStreak()

    budgetStore.setCurrentPeriod(currentPeriod)
    budgetStore.setHistory(history)
    budgetStore.setLastBudgetCents(lastBudgetCents)
    budgetStore.setLongestStreak(longestStreak)
  }

  async function checkAuth(): Promise<void> {
    const maxLoadingTimeout = setTimeout(() => {
      console.error('Force exiting loading state after 15 seconds')
      authStore.setLoading(false)
      authStore.setSyncing(false)
      authStore.setSyncError('Loading timed out. Please refresh or use offline mode.')
    }, 15000)

    try {
      console.log('Starting checkAuth...')
      authStore.setLoading(true)
      authStore.setShowSlowLoadingMessage(false)

      const loadingTimeoutId = setTimeout(() => {
        authStore.setShowSlowLoadingMessage(true)
      }, 5000)

      console.log('Getting session...')
      const {
        data: { session },
        error: sessionError,
      } = await promiseWithTimeout(
        supabase.auth.getSession(),
        SESSION_TIMEOUT,
        'Session check timed out. Please check your connection.'
      )

      if (sessionError) {
        console.error('Session error:', sessionError)
        throw sessionError
      }

      // Check if session is expired or about to expire
      if (session && session.expires_at) {
        const expiresAt = session.expires_at * 1000
        const now = Date.now()
        const timeUntilExpiry = expiresAt - now

        console.log('Session expires at:', new Date(expiresAt).toISOString())
        console.log('Time until expiry (minutes):', Math.round(timeUntilExpiry / 60000))

        // If session is expired or expires in less than 5 minutes, refresh it
        if (timeUntilExpiry < 5 * 60 * 1000) {
          console.log('Session is expired or expiring soon, refreshing...')
          try {
            const { data: refreshData, error: refreshError } = await promiseWithTimeout(
              supabase.auth.refreshSession(),
              8000,
              'Session refresh timed out.'
            )

            if (refreshError) {
              console.error('Failed to refresh session:', refreshError)
              console.log('Clearing invalid session and starting fresh...')
              await supabase.auth.signOut()
              authStore.setUser(null)
              loadLocalData()
              return
            }

            console.log('Session refreshed successfully')
            authStore.setUser(refreshData.session?.user || null)
          } catch (refreshErr) {
            console.error('Session refresh failed:', refreshErr)
            console.log('Clearing invalid session and starting fresh...')
            await supabase.auth.signOut()
            authStore.setUser(null)
            loadLocalData()
            return
          }
        } else {
          authStore.setUser(session?.user || null)
        }
      } else {
        authStore.setUser(session?.user || null)
      }

      console.log('User:', authStore.user ? 'Logged in' : 'Not logged in')

      if (authStore.user) {
        // Load cached data first for instant display
        console.log('Loading cached data from localStorage...')
        loadLocalData()

        // Sync from cloud in background (non-blocking)
        console.log('Starting background sync from cloud...')
        syncFromCloud().catch((err) => {
          console.error('Background sync failed:', err)
        })
      } else {
        console.log('Loading from localStorage...')
        loadLocalData()
      }

      console.log('checkAuth complete!')
      clearTimeout(loadingTimeoutId)
    } catch (error: any) {
      console.error('Error during auth check:', error)
      authStore.setSyncError(error?.message || 'Failed to load. Please try again.')
      loadLocalData()
    } finally {
      clearTimeout(maxLoadingTimeout)
      authStore.setShowSlowLoadingMessage(false)
      console.log('Setting isLoading to false')
      authStore.setLoading(false)
    }
  }

  async function retrySync(): Promise<void> {
    authStore.setSyncError(null)
    authStore.setSyncing(false)
    await checkAuth()
  }

  function useOfflineMode(): void {
    console.log('Using offline mode...')
    authStore.setSyncError(null)
    loadLocalData()
  }

  function getUserInitials(): string {
    if (!authStore.user) return '?'

    // Try to get name from Google auth metadata
    const fullName =
      authStore.user.user_metadata?.full_name || authStore.user.user_metadata?.name

    if (fullName) {
      const nameParts = fullName.trim().split(/\s+/)
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      } else if (nameParts.length === 1) {
        return nameParts[0].substring(0, 2).toUpperCase()
      }
    }

    // Fallback to email
    if (authStore.user.email) {
      const emailName = authStore.user.email.split('@')[0]
      const parts = emailName.split(/[._-]/)
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
      }
      return emailName.substring(0, 2).toUpperCase()
    }

    return '??'
  }

  return {
    signInWithGoogle,
    signOut,
    forceSignOut,
    checkAuth,
    retrySync,
    useOfflineMode,
    getUserInitials,
    loadLocalData,
  }
}
