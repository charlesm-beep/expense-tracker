<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useExpenses } from '@/composables/useExpenses'
import { useUIStore } from '@/stores/ui'
import { useBudgetStore } from '@/stores/budget'
import { useAuthStore } from '@/stores/auth'
import { useFormatters } from '@/composables/useFormatters'
import { useDailyLogging } from '@/composables/useDailyLogging'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { supabase } from '@/lib/supabase'
import { EXPENSE_CATEGORIES } from '@/lib/constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-vue-next'

const { addExpense } = useExpenses()
const uiStore = useUIStore()
const budgetStore = useBudgetStore()
const authStore = useAuthStore()
const { formatDate } = useFormatters()
const { weekDays } = useDailyLogging()
const localStorage = useLocalStorage()

const amount = ref<number | null>(null)
const category = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

const hasSelectedDay = computed(() => !!uiStore.selectedDay)

const selectedDayLabel = computed(() => {
  if (!uiStore.selectedDay) return ''
  return `${uiStore.selectedDay.dayName}, ${formatDate(uiStore.selectedDay.date.toISOString())}`
})

// The day key to work with: selected day or today
const targetDayKey = computed(() => {
  if (uiStore.selectedDay) {
    return uiStore.selectedDay.dayKey
  }
  return new Date().toISOString().split('T')[0]
})

// Use a ref to track completion state
const isTargetDayComplete = ref(false)

// Watch for changes to target day or completion state
watch(
  () => [targetDayKey.value, budgetStore.currentPeriod?.days_marked_done],
  () => {
    if (!budgetStore.currentPeriod) {
      isTargetDayComplete.value = false
      return
    }
    isTargetDayComplete.value = budgetStore.currentPeriod.days_marked_done.includes(targetDayKey.value)
  },
  { immediate: true, deep: true }
)

// Get target day info for display
const targetDayInfo = computed(() => {
  return weekDays.value.find((day) => day.dayKey === targetDayKey.value)
})

// Label for the button
const toggleLabel = 'Done logging'

async function handleToggleChange() {
  if (!budgetStore.currentPeriod) return

  const dayKey = targetDayKey.value

  // Toggle immediately in store
  budgetStore.toggleDayMarkedDone(dayKey)

  // Manually update the ref for immediate UI feedback
  isTargetDayComplete.value = budgetStore.currentPeriod.days_marked_done.includes(dayKey)

  // Save to localStorage
  localStorage.saveCurrentPeriod(budgetStore.currentPeriod)

  // Sync to Supabase in background
  if (authStore.user) {
    try {
      await supabase
        .from('periods')
        .update({
          days_marked_done: budgetStore.currentPeriod.days_marked_done
        })
        .eq('id', budgetStore.currentPeriod.id)
    } catch (error) {
      console.error('Failed to sync day completion:', error)
      authStore.setPendingChanges(true)
    }
  }
}

async function handleAddExpense() {
  if (!amount.value || amount.value <= 0) {
    errorMessage.value = 'Please enter a valid amount'
    return
  }

  if (!category.value) {
    errorMessage.value = 'Please select a category'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    // If a day is selected, use that day's date (at noon to avoid timezone issues)
    let timestamp: string | undefined = undefined
    if (uiStore.selectedDay) {
      const selectedDate = new Date(uiStore.selectedDay.date)
      selectedDate.setHours(12, 0, 0, 0)
      timestamp = selectedDate.toISOString()
    }

    await addExpense(amount.value, category.value, timestamp)
    // Reset form
    amount.value = null
    category.value = ''
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to add expense'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Card :class="{ 'ring-2 ring-emerald-500 ring-offset-2': hasSelectedDay }">
    <!-- Selected Day Banner -->
    <div v-if="hasSelectedDay" class="bg-emerald-50 border-b border-emerald-200 px-6 py-3">
      <div class="flex items-center gap-2 text-emerald-900">
        <span class="text-lg">📅</span>
        <span class="text-sm font-medium">
          Logging expenses for {{ selectedDayLabel }}
        </span>
      </div>
    </div>

    <!-- Helper Text when no day selected -->
    <div v-else class="bg-gray-50 border-b border-gray-200 px-6 py-3">
      <div class="flex items-center gap-2 text-gray-600">
        <span class="text-lg">💡</span>
        <span class="text-sm">
          Select a day above or log for today
        </span>
      </div>
    </div>

    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-6">
      <CardTitle>Add Expense</CardTitle>
      <div class="flex items-center gap-2">
        <span class="text-sm font-normal">
          {{ toggleLabel }}
        </span>
        <button
          @click="handleToggleChange"
          :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
            isTargetDayComplete ? 'bg-green-600' : 'bg-gray-300'
          ]"
          type="button"
          role="switch"
          :aria-checked="isTargetDayComplete"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              isTargetDayComplete ? 'translate-x-6' : 'translate-x-1'
            ]"
          />
        </button>
      </div>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div class="space-y-2">
          <Label for="expense-amount">Amount *</Label>
          <Input
            id="expense-amount"
            v-model.number="amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0.01"
            max="10000"
            @keyup.enter="handleAddExpense"
          />
        </div>

        <div class="space-y-2">
          <Label for="expense-category">Category *</Label>
          <Select v-model="category">
            <SelectTrigger id="expense-category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="cat in EXPENSE_CATEGORIES"
                  :key="cat.value"
                  :value="cat.value"
                >
                  {{ cat.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Alert v-if="errorMessage" variant="destructive" class="mb-4">
        <AlertCircleIcon class="h-4 w-4" />
        <AlertDescription>{{ errorMessage }}</AlertDescription>
      </Alert>

      <Button
        @click="handleAddExpense"
        :disabled="!amount || amount <= 0 || !category || isSubmitting"
        class="w-full"
      >
        {{ isSubmitting ? 'Adding...' : 'Add Expense' }}
      </Button>
    </CardContent>
  </Card>
</template>
