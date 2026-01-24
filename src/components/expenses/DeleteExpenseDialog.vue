<script setup lang="ts">
import { ref } from 'vue'
import { useExpenses } from '@/composables/useExpenses'
import { useFormatters } from '@/composables/useFormatters'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Expense } from '@/types'

interface Props {
  expense: Expense
}

const props = defineProps<Props>()
const isOpen = defineModel<boolean>('open')

const { deleteExpense } = useExpenses()
const { formatCurrency } = useFormatters()

const isDeleting = ref(false)
const errorMessage = ref('')

async function handleDelete() {
  isDeleting.value = true
  errorMessage.value = ''

  try {
    await deleteExpense(props.expense.id)
    isOpen.value = false
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to delete expense'
  } finally {
    isDeleting.value = false
  }
}

function handleCancel() {
  isOpen.value = false
  errorMessage.value = ''
}
</script>

<template>
  <AlertDialog v-model:open="isOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Expense</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete this expense?
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div class="my-4 p-4 bg-gray-50 rounded-lg">
        <div class="flex justify-between items-start">
          <div>
            <div class="font-medium text-gray-900">{{ expense.note || 'No note' }}</div>
            <div class="text-sm text-gray-500 mt-1">
              {{ formatCurrency(expense.amount_cents) }}
            </div>
          </div>
        </div>
      </div>

      <p v-if="errorMessage" class="text-sm text-red-600 mb-2">
        {{ errorMessage }}
      </p>

      <p class="text-sm text-gray-600">
        This action cannot be undone.
      </p>

      <AlertDialogFooter>
        <AlertDialogCancel @click="handleCancel" :disabled="isDeleting">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          @click="handleDelete"
          :disabled="isDeleting"
          class="bg-red-600 hover:bg-red-700 focus:ring-red-600"
        >
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
