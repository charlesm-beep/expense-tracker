<script setup lang="ts">
import { ref, computed } from 'vue'
import { useExpenses } from '@/composables/useExpenses'
import { useUIStore } from '@/stores/ui'
import { useFormatters } from '@/composables/useFormatters'
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
const { formatDate } = useFormatters()

const amount = ref<number | null>(null)
const category = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

const hasSelectedDay = computed(() => !!uiStore.selectedDay)

const selectedDayLabel = computed(() => {
  if (!uiStore.selectedDay) return ''
  return `${uiStore.selectedDay.dayName}, ${formatDate(uiStore.selectedDay.date.toISOString())}`
})

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
  <Card>
    <CardHeader class="space-y-2">
      <CardTitle>Add Expense</CardTitle>
      <Badge v-if="hasSelectedDay" variant="secondary" class="w-fit text-xs">
        Adding to: {{ selectedDayLabel }}
      </Badge>
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
