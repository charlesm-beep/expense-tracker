<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import AppHeader from './AppHeader.vue'
import BottomNav from './BottomNav.vue'
import UpdateBudgetDialog from '@/components/budget/UpdateBudgetDialog.vue'

const authStore = useAuthStore()
const uiStore = useUIStore()
</script>

<template>
  <div class="app-layout">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content Area -->
    <main class="main-content">
      <div class="content-container">
        <slot />
      </div>
    </main>

    <!-- Bottom Navigation -->
    <BottomNav v-if="authStore.user && !authStore.isLoading" />

    <!-- Update Budget Dialog -->
    <UpdateBudgetDialog v-model:open="uiStore.newPeriodDialogVisible" />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%);
}

.main-content {
  flex: 1;
  margin-top: 4rem;
  margin-bottom: 4rem;
  padding: 1rem;
  overflow-y: auto;
}

.content-container {
  max-width: 768px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 640px) {
  .main-content {
    margin-bottom: 3.5rem;
    padding: 0.75rem;
  }
}

@media (min-width: 768px) {
  .main-content {
    padding: 1.5rem;
  }

  .content-container {
    max-width: 896px;
  }
}

@media (min-width: 1024px) {
  .main-content {
    padding: 2rem;
  }

  .content-container {
    max-width: 1024px;
  }
}
</style>
