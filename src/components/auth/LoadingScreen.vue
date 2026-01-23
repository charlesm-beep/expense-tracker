<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle } from 'lucide-vue-next'

const authStore = useAuthStore()
const { useOfflineMode, forceSignOut } = useAuth()

const handleSkipToOffline = () => {
  useOfflineMode()
}

const handleForceSignOut = async () => {
  await forceSignOut()
}
</script>

<template>
  <div class="loading-screen">
    <div class="loading-content">
      <!-- Loading Spinner -->
      <div class="loading-spinner">
        <Loader2 class="spinner-icon" :size="48" />
      </div>

      <!-- Loading Text -->
      <div class="loading-text">
        Loading...
      </div>

      <!-- Slow Loading Message -->
      <Alert
        v-if="authStore.showSlowLoadingMessage"
        variant="default"
        class="slow-loading-alert"
      >
        <AlertCircle class="h-4 w-4" />
        <AlertTitle>Taking longer than expected...</AlertTitle>
        <AlertDescription class="alert-description">
          <p class="mb-4">
            Your connection may be slow or the server may be temporarily unavailable.
          </p>
          <div class="alert-actions">
            <Button
              variant="secondary"
              size="sm"
              @click="handleSkipToOffline"
            >
              Skip to Offline Mode
            </Button>
            <Button
              v-if="authStore.user"
              variant="outline"
              size="sm"
              @click="handleForceSignOut"
            >
              Sign Out
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  </div>
</template>

<style scoped>
.loading-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%);
  padding: 1.5rem;
}

.loading-content {
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.loading-spinner {
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.spinner-icon {
  color: #10b981;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: #334155;
  text-align: center;
}

.slow-loading-alert {
  width: 100%;
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.alert-description {
  margin-top: 0.75rem;
}

.alert-description p {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
}

.alert-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .alert-actions {
    flex-direction: row;
  }
}
</style>
