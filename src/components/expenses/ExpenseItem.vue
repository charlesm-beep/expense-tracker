<script setup lang="ts">
import { ref } from 'vue'
import { useFormatters } from '@/composables/useFormatters'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-vue-next'
import DeleteExpenseDialog from './DeleteExpenseDialog.vue'
import type { Expense } from '@/types'

interface Props {
  expense: Expense
}

const props = defineProps<Props>()

const { formatCurrency, formatRelativeDate } = useFormatters()

const showDeleteDialog = ref(false)

function handleDeleteClick() {
  showDeleteDialog.value = true
}
</script>

<template>
  <div class="flex justify-between items-center py-3 hover:bg-gray-50 transition-colors">
    <div class="flex-1 min-w-0">
      <div class="font-medium text-gray-900 truncate">
        {{ expense.note || 'No note' }}
      </div>
      <div class="text-xs text-gray-500 mt-0.5">
        {{ formatRelativeDate(expense.timestamp) }}
      </div>
    </div>
    <div class="flex items-center gap-2 ml-4">
      <div class="font-semibold text-red-600 whitespace-nowrap">
        {{ formatCurrency(expense.amount_cents) }}
      </div>
      <Button
        variant="ghost"
        size="icon"
        class="h-9 w-9 text-red-600 hover:bg-red-50 hover:text-red-700"
        @click="handleDeleteClick"
        title="Delete expense"
      >
        <XIcon class="h-4 w-4" />
      </Button>
    </div>
  </div>

  <DeleteExpenseDialog
    v-model:open="showDeleteDialog"
    :expense="expense"
  />
</template>
