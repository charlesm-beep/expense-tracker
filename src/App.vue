<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { useAuth } from '@/composables/useAuth'
import { useBudget } from '@/composables/useBudget'

// Auth components
import LoadingScreen from '@/components/auth/LoadingScreen.vue'
import ErrorScreen from '@/components/auth/ErrorScreen.vue'
import LoginScreen from '@/components/auth/LoginScreen.vue'

// Layout
import AppLayout from '@/components/layout/AppLayout.vue'

// Budget
import FirstBudgetDialog from '@/components/budget/FirstBudgetDialog.vue'

// Settings
import ClearDataDialog from '@/components/settings/ClearDataDialog.vue'

// Daily Logging
import StreakCelebrationDialog from '@/components/daily-logging/StreakCelebrationDialog.vue'

// Views
import DashboardView from '@/views/DashboardView.vue'
import FinancesView from '@/views/FinancesView.vue'
import GoalsView from '@/views/GoalsView.vue'
import HistoryView from '@/views/HistoryView.vue'
import DebugView from '@/views/DebugView.vue'

const authStore = useAuthStore()
const uiStore = useUIStore()
const { checkAuth } = useAuth()
const { checkAndRolloverPeriod } = useBudget()

// Import budget store to check hasInitialLoad
import { useBudgetStore } from '@/stores/budget'
const budgetStore = useBudgetStore()

// Check if debug mode is enabled via URL parameter
const debugMode = ref(false)

// Computed properties for app state
const isLoading = computed(() => authStore.isLoading)
const hasError = computed(() => authStore.syncError !== null)
const isAuthenticated = computed(() => authStore.user !== null)
const activeTab = computed(() => uiStore.activeTab)

// Current view based on active tab
const currentView = computed(() => {
  switch (activeTab.value) {
    case 'finances':
      return FinancesView
    case 'goals':
      return GoalsView
    case 'history':
      return HistoryView
    case 'dashboard':
    default:
      return DashboardView
  }
})

onMounted(async () => {
  // Check for debug mode
  const urlParams = new URLSearchParams(window.location.search)
  debugMode.value = urlParams.get('debug') === 'true'

  if (!debugMode.value) {
    console.log('App.vue mounted, starting checkAuth...')
    await checkAuth()

    // After auth check, check for period rollover
    if (authStore.user) {
      console.log('User authenticated, checking for period rollover...')
      await checkAndRolloverPeriod()
    }
  }
})
</script>

<template>
  <!-- Debug Mode -->
  <DebugView v-if="debugMode" />

  <!-- Loading State -->
  <LoadingScreen v-else-if="isLoading" />

  <!-- Error State -->
  <ErrorScreen v-else-if="hasError" />

  <!-- Login Screen (Not Authenticated) -->
  <LoginScreen v-else-if="!isAuthenticated" />

  <!-- Main Application (Authenticated) -->
  <AppLayout v-else>
    <component :is="currentView" />
    <!-- First Budget Dialog (Shows when no current period) -->
    <!-- Debug: hasInitialLoad = {{ budgetStore.hasInitialLoad }}, initialSyncComplete = {{ authStore.initialSyncComplete }} -->
    <FirstBudgetDialog v-if="budgetStore.hasInitialLoad && authStore.initialSyncComplete" />
    <!-- Clear Data Confirmation Dialog -->
    <ClearDataDialog />
    <!-- Streak Celebration Dialog -->
    <StreakCelebrationDialog />
  </AppLayout>
</template>
