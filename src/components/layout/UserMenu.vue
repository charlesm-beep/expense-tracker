<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { useAuth } from '@/composables/useAuth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { LogOut, Trash2, DollarSign } from 'lucide-vue-next'

const authStore = useAuthStore()
const uiStore = useUIStore()
const { signOut, getUserInitials } = useAuth()

const userInitials = computed(() => getUserInitials())

const handleSignOut = async () => {
  uiStore.closeUserMenu()
  await signOut()
}

const handleClearData = () => {
  uiStore.closeUserMenu()
  uiStore.openClearDataConfirm()
}

const handleUpdateBudget = () => {
  uiStore.closeUserMenu()
  uiStore.openNewPeriodDialog()
}
</script>

<template>
  <DropdownMenu v-model:open="uiStore.userMenuOpen">
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        class="user-avatar-trigger"
      >
        <div class="user-avatar">
          {{ userInitials }}
        </div>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="user-menu-content w-80">
      <div class="user-menu-header">
        <div class="user-avatar-large">
          {{ userInitials }}
        </div>
        <div class="user-menu-email">
          {{ authStore.user?.email }}
        </div>
      </div>

      <DropdownMenuSeparator />

      <DropdownMenuItem @click="handleUpdateBudget" class="user-menu-item">
        <DollarSign class="user-menu-icon" :size="20" />
        <span>Update Budget</span>
      </DropdownMenuItem>

      <DropdownMenuItem @click="handleClearData" class="user-menu-item destructive">
        <Trash2 class="user-menu-icon" :size="20" />
        <span>Clear All Data</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem @click="handleSignOut" class="user-menu-item">
        <LogOut class="user-menu-icon" :size="20" />
        <span>Sign Out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped>
.user-avatar-trigger {
  padding: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: visible;
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-avatar-trigger:hover {
  transform: translateY(-2px);
}

.user-avatar-trigger:active {
  transform: translateY(0) scale(0.95);
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-avatar-trigger:hover .user-avatar {
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
  border-color: rgba(255, 255, 255, 0.95);
}

.user-avatar-trigger:active .user-avatar {
  box-shadow: 0 1px 4px rgba(16, 185, 129, 0.3);
}

.user-menu-content {
  margin-top: 0.5rem;
  max-width: 320px;
}

.user-menu-header {
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, #f0f9f4 0%, #e8f5e9 100%);
}

.user-avatar-large {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  border: 3px solid white;
}

.user-menu-email {
  font-size: 0.875rem;
  color: #334155;
  text-align: center;
  word-break: break-word;
  font-weight: 500;
}

.user-menu-item {
  padding: 1rem 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
  position: relative;
}

.user-menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #10b981;
  transform: scaleY(0);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-menu-item:hover::before {
  transform: scaleY(1);
}

.user-menu-item:hover {
  background: #f9fafb;
  padding-left: 1.75rem;
}

.user-menu-item.destructive {
  color: #dc2626;
}

.user-menu-item.destructive::before {
  background: #dc2626;
}

.user-menu-icon {
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .user-menu-content {
    width: calc(100vw - 1rem);
    max-width: 100%;
  }

  .user-avatar-trigger {
    width: 2.25rem;
    height: 2.25rem;
  }

  .user-avatar {
    font-size: 0.75rem;
  }
}
</style>
