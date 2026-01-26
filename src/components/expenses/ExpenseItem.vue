<script setup lang="ts">
import { computed } from 'vue'
import { useFormatters } from '@/composables/useFormatters'
import { useExpenses } from '@/composables/useExpenses'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-vue-next'
import type { Expense } from '@/types'

interface Props {
  expense: Expense
}

const props = defineProps<Props>()

const { formatCurrency, formatRelativeDate } = useFormatters()
const { deleteExpense } = useExpenses()

// Category mapping with emojis
const CATEGORY_MAP: Record<string, string> = {
  'Groceries': '🛒',
  'Dining Out': '🍽️',
  'Transportation': '🚗',
  'Entertainment': '🎬',
  'Shopping': '🛍️',
  'Healthcare': '🏥',
  'Personal Care': '💅',
  'Coffee/Drinks': '☕',
  'Subscriptions': '📱',
  'Other': '📦'
}

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

const autoCategory = computed(() => autoCategorize(props.expense.note || ''))
const categoryEmoji = computed(() => CATEGORY_MAP[autoCategory.value] || '📦')

async function handleDeleteClick() {
  await deleteExpense(props.expense.id)
}
</script>

<template>
  <div class="flex justify-between items-center py-3 px-1 -mx-1 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-[1.01]">
    <div class="flex-1 min-w-0">
      <div class="font-medium text-gray-900 truncate">
        {{ expense.note || 'No description' }}
      </div>
      <div class="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
        <span>{{ formatRelativeDate(expense.timestamp) }}</span>
        <span>•</span>
        <span class="text-gray-400">{{ autoCategory }}</span>
      </div>
    </div>
    <div class="flex items-center gap-2 ml-4">
      <div class="font-semibold text-red-600 whitespace-nowrap">
        {{ formatCurrency(expense.amount_cents) }}
      </div>
      <Button
        variant="ghost"
        size="icon"
        class="h-9 w-9 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
        @click="handleDeleteClick"
        title="Delete expense"
      >
        <XIcon class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
