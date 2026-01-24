<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import UserMenu from './UserMenu.vue'
import { PiggyBank } from 'lucide-vue-next'

const authStore = useAuthStore()

const isOffline = computed(() => {
  return typeof navigator !== 'undefined' && navigator.onLine === false
})
</script>

<template>
  <div class="app-header">
    <div v-if="authStore.user" class="app-title-container">
      <div class="app-logo">
        <PiggyBank :size="28" class="logo-icon" />
      </div>
      <div class="app-title">Save It!</div>
    </div>
    <div class="header-right">
      <!-- Unsaved Changes Indicator -->
      <div
        v-if="authStore.pendingChanges && !authStore.isSyncing"
        class="status-indicator unsaved"
      >
        ● Unsaved Changes
      </div>

      <!-- Offline Indicator -->
      <div
        v-if="authStore.user && isOffline"
        class="status-indicator offline"
      >
        📡 Offline
      </div>

      <!-- Syncing Indicator -->
      <div v-if="authStore.isSyncing" class="status-indicator syncing">
        ⟳ Syncing...
      </div>

      <!-- Sync Error Indicator -->
      <div
        v-if="authStore.syncError"
        class="status-indicator error"
      >
        ⚠ Sync failed
      </div>

      <!-- User Menu Dropdown -->
      <UserMenu v-if="authStore.user" />
    </div>
  </div>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4rem;
  background: linear-gradient(135deg, #334155 0%, #475569 100%);
  color: white;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.app-title-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.app-logo {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.logo-icon {
  color: white;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-indicator {
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  background: rgba(255, 255, 255, 0.1);
}

.status-indicator.unsaved {
  color: #f59e0b;
}

.status-indicator.offline {
  color: #f59e0b;
}

.status-indicator.syncing {
  color: #10b981;
}

.status-indicator.error {
  color: #ef4444;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-avatar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
  border-color: rgba(255, 255, 255, 0.95);
}

@media (max-width: 640px) {
  .app-header {
    padding: 0 0.75rem;
  }

  .app-logo {
    width: 2rem;
    height: 2rem;
  }

  .logo-icon {
    width: 20px;
    height: 20px;
  }

  .app-title {
    font-size: 1.25rem;
  }

  .status-indicator {
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
  }

  .user-avatar {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 0.75rem;
  }
}
</style>
