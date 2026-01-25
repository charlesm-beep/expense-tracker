<script setup lang="ts">
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useBudgetStore } from '@/stores/budget'
import { useLocalStorage } from '@/composables/useLocalStorage'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const uiStore = useUIStore()
const budgetStore = useBudgetStore()
const localStorage = useLocalStorage()

const isOpen = computed({
  get: () => uiStore.showClearDataConfirm,
  set: (value: boolean) => {
    if (!value) {
      uiStore.closeClearDataConfirm()
    }
  }
})

const handleConfirm = () => {
  // Clear all localStorage
  localStorage.clearAllData()

  // Reset budget store state
  budgetStore.resetBudgetState()

  // Close dialog
  uiStore.closeClearDataConfirm()
}

const handleCancel = () => {
  uiStore.closeClearDataConfirm()
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle class="text-xl text-red-600">Clear All Data?</DialogTitle>
        <DialogDescription class="pt-4">
          This will permanently delete all your budgets, expenses, and history from this device.
          <strong class="text-red-600">This action cannot be undone.</strong>
          <br /><br />
          Your cloud data will remain safe if you're signed in.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="gap-2">
        <Button variant="outline" @click="handleCancel">Cancel</Button>
        <Button variant="destructive" @click="handleConfirm">
          Clear All Data
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

