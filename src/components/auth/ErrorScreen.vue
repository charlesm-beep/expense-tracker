<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-vue-next'
import { computed } from 'vue'

const authStore = useAuthStore()
const { retrySync, useOfflineMode } = useAuth()

const isTimeoutError = computed(() => {
  return authStore.syncError?.includes('timed out') || false
})

const isNetworkError = computed(() => {
  return (
    authStore.syncError?.includes('network') ||
    authStore.syncError?.includes('connection') ||
    false
  )
})

const showTroubleshootingTips = computed(() => {
  return isTimeoutError.value || isNetworkError.value
})

const handleRetry = async () => {
  await retrySync()
}

const handleOfflineMode = () => {
  useOfflineMode()
}
</script>

<template>
  <div class="error-screen">
    <div class="error-content">
      <!-- Error Icon -->
      <div class="error-icon-container">
        <AlertTriangle class="error-icon" :size="64" />
      </div>

      <!-- Error Alert -->
      <Alert variant="destructive" class="error-alert">
        <AlertTriangle class="h-4 w-4" />
        <AlertTitle>Sync Error</AlertTitle>
        <AlertDescription>
          {{ authStore.syncError }}
        </AlertDescription>
      </Alert>

      <!-- Troubleshooting Tips -->
      <div v-if="showTroubleshootingTips" class="troubleshooting">
        <div class="troubleshooting-header">
          <WifiOff :size="20" class="troubleshooting-icon" />
          <h3 class="troubleshooting-title">
            {{ isTimeoutError ? 'Connection is slow or unstable' : 'Cannot reach the server' }}
          </h3>
        </div>
        <div class="troubleshooting-content">
          <p class="troubleshooting-text">Try:</p>
          <ul class="troubleshooting-list">
            <li>Switching to offline mode (data stays on device)</li>
            <li>Checking your internet connection</li>
            <li>Trying again in a moment</li>
          </ul>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="error-actions">
        <Button
          variant="default"
          size="lg"
          class="action-button"
          @click="handleRetry"
        >
          <RefreshCw :size="18" class="mr-2" />
          Retry Connection
        </Button>

        <Button
          variant="outline"
          size="lg"
          class="action-button"
          @click="handleOfflineMode"
        >
          <WifiOff :size="18" class="mr-2" />
          Use Offline Mode
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #fef2f2 0%, #fee2e2 100%);
  padding: 1.5rem;
}

.error-content {
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.error-icon-container {
  width: 5rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.2);
}

.error-icon {
  color: #dc2626;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.error-alert {
  width: 100%;
  background: white;
  border: 2px solid #fca5a5;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.1);
}

.troubleshooting {
  width: 100%;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.troubleshooting-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.troubleshooting-icon {
  color: #64748b;
  flex-shrink: 0;
}

.troubleshooting-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}

.troubleshooting-content {
  margin-left: 2rem;
}

.troubleshooting-text {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.troubleshooting-list {
  list-style-type: disc;
  margin-left: 1.5rem;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
}

.troubleshooting-list li {
  margin-bottom: 0.25rem;
}

.error-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 640px) {
  .error-actions {
    flex-direction: row;
  }

  .action-button {
    width: auto;
    flex: 1;
  }
}
</style>
