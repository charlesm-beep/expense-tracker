<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useExpenses } from '@/composables/useExpenses'
import { useUIStore } from '@/stores/ui'
import { useBudgetStore } from '@/stores/budget'
import { useAuthStore } from '@/stores/auth'
import { useFormatters } from '@/composables/useFormatters'
import { useDailyLogging } from '@/composables/useDailyLogging'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircleIcon, CheckCircle2 } from 'lucide-vue-next'

const { addExpense } = useExpenses()
const uiStore = useUIStore()
const budgetStore = useBudgetStore()
const authStore = useAuthStore()
const { formatDate } = useFormatters()
const { weekDays } = useDailyLogging()
const localStorage = useLocalStorage()

const amount = ref<number | null>(null)
const description = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref(false)

// Personal merchant list stored in localStorage
interface MerchantEntry {
  description: string
  category: string
  count: number
}

const merchantList = ref<MerchantEntry[]>([])
const showSuggestions = ref(false)
const filteredSuggestions = computed(() => {
  if (!description.value) return []
  const lower = description.value.toLowerCase()
  return merchantList.value
    .filter(m => m.description.toLowerCase().includes(lower))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
})

// Load merchant list from localStorage on mount
onMounted(() => {
  const stored = window.localStorage.getItem('merchant_list')
  if (stored) {
    merchantList.value = JSON.parse(stored)
  }
})

// Auto-categorize based on keywords
function autoCategorize(desc: string): string {
  const lower = desc.toLowerCase()

  if (lower.match(/\b(grocery|groceries|supermarket|whole foods|trader joe|safeway|kroger|walmart|target|costco|produce|vegetables|fruit)\b/)) return 'Groceries'
  if (lower.match(/\b(restaurant|dining|dinner|lunch|breakfast|food|pizza|burger|sushi|taco|cafe|bar|pub)\b/)) return 'Dining Out'
  if (lower.match(/\b(gas|fuel|uber|lyft|taxi|parking|car|vehicle|auto|transit|bus|train|subway|metro)\b/)) return 'Transportation'
  if (lower.match(/\b(movie|cinema|concert|show|entertainment|theater|game|sports|ticket|event)\b/)) return 'Entertainment'
  if (lower.match(/\b(shop|shopping|store|clothes|clothing|amazon|purchase|buy|retail)\b/)) return 'Shopping'
  if (lower.match(/\b(doctor|hospital|pharmacy|medicine|medical|health|dentist|clinic)\b/)) return 'Healthcare'
  if (lower.match(/\b(haircut|salon|barber|spa|gym|fitness|personal)\b/)) return 'Personal Care'
  if (lower.match(/\b(coffee|starbucks|cafe|latte|espresso|drink|bar|beer|wine|alcohol)\b/)) return 'Coffee/Drinks'
  if (lower.match(/\b(subscription|netflix|spotify|hulu|service|membership|bill|utility)\b/)) return 'Subscriptions'

  return 'Other'
}

// Add or update merchant in list
function updateMerchantList(desc: string) {
  const existing = merchantList.value.find(m => m.description.toLowerCase() === desc.toLowerCase())

  if (existing) {
    existing.count++
  } else {
    const category = autoCategorize(desc)
    merchantList.value.push({
      description: desc,
      category,
      count: 1
    })
  }

  // Save to localStorage
  window.localStorage.setItem('merchant_list', JSON.stringify(merchantList.value))
}

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

  if (!description.value || description.value.trim() === '') {
    errorMessage.value = 'Please enter a description'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    // Update merchant list with this description
    updateMerchantList(description.value.trim())

    // If a day is selected, use that day's date (at noon to avoid timezone issues)
    let timestamp: string | undefined = undefined
    if (uiStore.selectedDay) {
      const selectedDate = new Date(uiStore.selectedDay.date)
      selectedDate.setHours(12, 0, 0, 0)
      timestamp = selectedDate.toISOString()
    }

    // Store description in note field
    await addExpense(amount.value, description.value.trim(), timestamp)

    // Show success feedback
    successMessage.value = true
    setTimeout(() => {
      successMessage.value = false
    }, 2000)

    // Reset form
    amount.value = null
    description.value = ''
    showSuggestions.value = false
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to add expense'
  } finally {
    isSubmitting.value = false
  }
}

function selectSuggestion(merchant: MerchantEntry) {
  description.value = merchant.description
  showSuggestions.value = false
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
            'relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 active:scale-95',
            isTargetDayComplete ? 'bg-green-600' : 'bg-gray-300'
          ]"
          type="button"
          role="switch"
          :aria-checked="isTargetDayComplete"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 shadow-sm',
              isTargetDayComplete ? 'translate-x-6 scale-110' : 'translate-x-1'
            ]"
          />
        </button>
      </div>
    </CardHeader>
    <CardContent>
      <div class="space-y-4 mb-4">
        <div class="space-y-2">
          <Label for="expense-amount">Amount *</Label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="expense-amount"
              v-model.number="amount"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              max="10000"
              class="pl-7"
              @keyup.enter="handleAddExpense"
            />
          </div>
        </div>

        <div class="space-y-2 relative">
          <Label for="expense-description">Description *</Label>
          <Input
            id="expense-description"
            v-model="description"
            type="text"
            placeholder="e.g., Coffee at Neon Cowboy, Whole Foods, Gas"
            @keyup.enter="handleAddExpense"
            @focus="showSuggestions = true"
            @blur="setTimeout(() => showSuggestions = false, 200)"
          />

          <!-- Autocomplete Suggestions -->
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="showSuggestions && filteredSuggestions.length > 0"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              <button
                v-for="merchant in filteredSuggestions"
                :key="merchant.description"
                @click="selectSuggestion(merchant)"
                class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
              >
                <span class="font-medium text-gray-900">{{ merchant.description }}</span>
                <span class="text-xs text-gray-500">{{ merchant.category }}</span>
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <Alert v-if="successMessage" class="mb-4 border-green-600 bg-green-50 text-green-900">
          <CheckCircle2 class="h-4 w-4 text-green-600" />
          <AlertDescription class="text-green-900">Expense added successfully!</AlertDescription>
        </Alert>
      </Transition>

      <Alert v-if="errorMessage" variant="destructive" class="mb-4">
        <AlertCircleIcon class="h-4 w-4" />
        <AlertDescription>{{ errorMessage }}</AlertDescription>
      </Alert>

      <Button
        @click="handleAddExpense"
        :disabled="!amount || amount <= 0 || !description || isSubmitting"
        class="w-full"
      >
        {{ isSubmitting ? 'Adding...' : 'Add Expense' }}
      </Button>
    </CardContent>
  </Card>
</template>
