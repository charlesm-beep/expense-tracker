<script setup lang="ts">
import { computed } from 'vue'
import { useBudgetStore } from '@/stores/budget'
import { useFormatters } from '@/composables/useFormatters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ExpenseItem from './ExpenseItem.vue'

const budgetStore = useBudgetStore()
const { formatCurrency } = useFormatters()

const expenses = computed(() => budgetStore.sortedExpenses)

const hasExpenses = computed(() => expenses.value.length > 0)

const totalAmount = computed(() => formatCurrency(budgetStore.totalSpentCents))
</script>

<template>
  <Card v-if="hasExpenses">
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
      <CardTitle>Recent Expenses</CardTitle>
      <span class="text-sm text-gray-600">
        {{ expenses.length }} {{ expenses.length === 1 ? 'item' : 'items' }}
      </span>
    </CardHeader>
    <CardContent class="space-y-0">
      <div class="divide-y divide-gray-200">
        <ExpenseItem
          v-for="expense in expenses"
          :key="expense.id"
          :expense="expense"
        />
      </div>
      <div class="pt-4 mt-4 border-t border-gray-200 flex justify-between items-center">
        <span class="text-sm font-semibold text-gray-900">Total</span>
        <span class="text-lg font-bold text-red-600">{{ totalAmount }}</span>
      </div>
    </CardContent>
  </Card>

  <Card v-else>
    <CardContent class="py-12 text-center">
      <div class="text-4xl mb-4">📝</div>
      <div class="text-lg font-semibold text-gray-900 mb-2">No expenses yet</div>
      <div class="text-sm text-gray-600">Add your first expense to start tracking</div>
    </CardContent>
  </Card>
</template>
