import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(true)
  const isSyncing = ref(false)
  const syncError = ref<string | null>(null)
  const lastSyncTime = ref<Date | null>(null)
  const pendingChanges = ref(false)
  const showSlowLoadingMessage = ref(false)
  const syncRetryAttempted = ref(false)
  const initialSyncComplete = ref(false)

  // Actions
  function setUser(newUser: User | null) {
    user.value = newUser
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setSyncing(syncing: boolean) {
    isSyncing.value = syncing
  }

  function setSyncError(error: string | null) {
    syncError.value = error
  }

  function setLastSyncTime(time: Date | null) {
    lastSyncTime.value = time
  }

  function setPendingChanges(pending: boolean) {
    pendingChanges.value = pending
  }

  function setShowSlowLoadingMessage(show: boolean) {
    showSlowLoadingMessage.value = show
  }

  function setSyncRetryAttempted(attempted: boolean) {
    syncRetryAttempted.value = attempted
  }

  function setInitialSyncComplete(complete: boolean) {
    console.log('[AuthStore] setInitialSyncComplete called with:', complete)
    initialSyncComplete.value = complete
  }

  function resetAuthState() {
    user.value = null
    isLoading.value = true
    isSyncing.value = false
    syncError.value = null
    lastSyncTime.value = null
    pendingChanges.value = false
    showSlowLoadingMessage.value = false
    syncRetryAttempted.value = false
    initialSyncComplete.value = false
  }

  return {
    // State
    user,
    isLoading,
    isSyncing,
    syncError,
    lastSyncTime,
    pendingChanges,
    showSlowLoadingMessage,
    syncRetryAttempted,
    initialSyncComplete,
    // Actions
    setUser,
    setLoading,
    setSyncing,
    setSyncError,
    setLastSyncTime,
    setPendingChanges,
    setShowSlowLoadingMessage,
    setSyncRetryAttempted,
    setInitialSyncComplete,
    resetAuthState,
  }
})
