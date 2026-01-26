<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useBudgetStore } from '@/stores/budget'
import { useBudget } from '@/composables/useBudget'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const budgetStore = useBudgetStore()
const { createNewPeriod } = useBudget()

console.log('[FirstBudgetDialog] Component created', {
  currentPeriod: budgetStore.currentPeriod,
  hasInitialLoad: budgetStore.hasInitialLoad
})

onMounted(() => {
  console.log('[FirstBudgetDialog] Component mounted', {
    currentPeriod: budgetStore.currentPeriod,
    hasInitialLoad: budgetStore.hasInitialLoad
  })
})

const isOpen = computed(() => !budgetStore.currentPeriod)

// Debug logging
watch(isOpen, (newVal) => {
  console.log('[FirstBudgetDialog] isOpen changed to:', newVal, {
    currentPeriod: budgetStore.currentPeriod,
    hasInitialLoad: budgetStore.hasInitialLoad
  })
}, { immediate: true })
const budgetDollars = ref('')
const isCreating = ref(false)

const isValid = computed(() => {
  const parsed = parseFloat(budgetDollars.value)
  return !isNaN(parsed) && parsed > 0
})

const handleCreate = async () => {
  if (!isValid.value) return

  isCreating.value = true
  try {
    const budgetAmount = parseFloat(budgetDollars.value)
    await createNewPeriod(budgetAmount)
  } catch (error) {
    console.error('Error creating first budget:', error)
    alert('Failed to create budget. Please try again.')
  } finally {
    isCreating.value = false
  }
}
</script>

<template>
  <Dialog :open="isOpen">
    <DialogContent class="max-w-md sm:max-w-lg">
      <DialogHeader>
        <div class="flex justify-center mb-4">
          <div class="text-6xl">💰</div>
        </div>
        <DialogTitle class="text-center text-2xl">
          Set Your Weekly Budget
        </DialogTitle>
        <DialogDescription class="text-center">
          Enter the amount you want to spend this week
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div>
          <Label for="first-budget-input" class="text-sm font-semibold">
            Weekly Budget Amount
          </Label>
          <div class="relative mt-2">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-semibold">
              $
            </span>
            <Input
              id="first-budget-input"
              v-model="budgetDollars"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              class="text-xl font-bold pl-8 h-12"
              autofocus
              @keydown.enter="handleCreate"
            />
          </div>
          <p v-if="budgetDollars && !isValid" class="text-xs text-red-600 mt-1.5">
            Please enter a budget amount greater than $0
          </p>
        </div>

        <Button
          @click="handleCreate"
          :disabled="!isValid || isCreating"
          class="w-full"
          size="lg"
        >
          {{ isCreating ? 'Creating...' : 'Get Started' }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
