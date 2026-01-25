<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBudgetStore } from '@/stores/budget'
import { useUIStore } from '@/stores/ui'
import { useBudget } from '@/composables/useBudget'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-vue-next'

const budgetStore = useBudgetStore()
const uiStore = useUIStore()
const { updateBudget, getWeekEnd } = useBudget()

const isOpen = computed({
  get: () => uiStore.newPeriodDialogVisible,
  set: (value: boolean) => {
    if (!value) {
      uiStore.closeNewPeriodDialog()
    }
  }
})
const newBudgetAmount = ref<number | null>(null)
const isSubmitting = ref(false)
const errorMessage = ref('')

const willBeProRated = computed(() => {
  if (!budgetStore.currentPeriod) return false
  const now = new Date()
  const periodEnd = new Date(budgetStore.currentPeriod.end_date)
  const daysRemaining = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return daysRemaining < 7
})

const calculatedThisWeekBudget = computed(() => {
  if (!newBudgetAmount.value || !budgetStore.currentPeriod) return 0

  const weeklyBudgetCents = Math.round(newBudgetAmount.value * 100)
  const now = new Date()
  const periodEnd = new Date(budgetStore.currentPeriod.end_date)
  const daysInPeriod = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (daysInPeriod < 7) {
    return Math.round(weeklyBudgetCents * (daysInPeriod / 7))
  }

  return weeklyBudgetCents
})

async function handleUpdate() {
  if (!newBudgetAmount.value || newBudgetAmount.value < 0.01) {
    errorMessage.value = 'Please enter a valid budget amount'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await updateBudget(newBudgetAmount.value)
    uiStore.closeNewPeriodDialog()
    newBudgetAmount.value = null
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to update budget'
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel() {
  uiStore.closeNewPeriodDialog()
  newBudgetAmount.value = null
  errorMessage.value = ''
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[450px]">
      <DialogHeader>
        <DialogTitle>Update Weekly Budget</DialogTitle>
        <DialogDescription>
          Change your weekly budget amount. This will apply to your current period.
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="budget-amount">Weekly Budget Amount (USD)</Label>
          <Input
            id="budget-amount"
            v-model.number="newBudgetAmount"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0.01"
            max="100000"
            @keyup.enter="handleUpdate"
          />
        </div>

        <!-- Pro-rated budget preview -->
        <Alert
          v-if="willBeProRated && newBudgetAmount && newBudgetAmount > 0"
          variant="warning"
        >
          <AlertCircleIcon class="h-4 w-4" />
          <AlertDescription>
            <div class="font-semibold mb-1">
              This week's budget: ${{ (calculatedThisWeekBudget / 100).toFixed(2) }}
            </div>
            <div class="text-xs">
              Since you're mid-week, this week's budget is adjusted for the remaining days.
              Starting Monday, you'll get the full ${{ newBudgetAmount.toFixed(2) }} weekly budget.
            </div>
          </AlertDescription>
        </Alert>

        <!-- Full budget confirmation -->
        <Alert
          v-else-if="newBudgetAmount && newBudgetAmount > 0"
          variant="success"
        >
          <AlertDescription>
            This week you'll get the full ${{ newBudgetAmount.toFixed(2) }} budget
          </AlertDescription>
        </Alert>

        <!-- Error message -->
        <Alert v-if="errorMessage" variant="destructive">
          <AlertDescription>{{ errorMessage }}</AlertDescription>
        </Alert>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          @click="handleCancel"
          :disabled="isSubmitting"
        >
          Cancel
        </Button>
        <Button
          @click="handleUpdate"
          :disabled="!newBudgetAmount || newBudgetAmount <= 0 || isSubmitting"
        >
          {{ isSubmitting ? 'Updating...' : 'Update' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
