<script setup lang="ts">
import { computed } from 'vue'
import { useBudgetStore } from '@/stores/budget'
import { useFormatters } from '@/composables/useFormatters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const budgetStore = useBudgetStore()
const { formatCurrency } = useFormatters()

const successRate = computed(() => {
  const total = budgetStore.history.length
  if (total === 0) return 0
  const successful = budgetStore.history.filter((p) => p.success).length
  return Math.round((successful / total) * 100)
})

const totalHistoricalSpending = computed(() => {
  return budgetStore.history.reduce((sum, period) => {
    return sum + (period.total_spent_cents || 0)
  }, 0)
})

const totalHistoricalSavings = computed(() => {
  return budgetStore.history.reduce((sum, period) => {
    const spent = period.total_spent_cents || 0
    const budget = period.budget_cents
    const saved = Math.max(0, budget - spent)
    return sum + saved
  }, 0)
})

const averageSpendingPerWeek = computed(() => {
  const total = budgetStore.history.length
  if (total === 0) return 0
  return Math.round(totalHistoricalSpending.value / total)
})

const successRateColor = computed(() => {
  if (successRate.value >= 80) return 'bg-green-100 text-green-800 border-green-300'
  if (successRate.value >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
  return 'bg-red-100 text-red-800 border-red-300'
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <span>📊</span>
        <span>Overall Statistics</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-sm text-gray-600 mb-2">Success Rate</div>
          <Badge :class="successRateColor" class="text-lg font-bold px-3 py-1">
            {{ successRate }}%
          </Badge>
        </div>

        <div class="text-center">
          <div class="text-sm text-gray-600 mb-2">Total Spent</div>
          <div class="text-lg font-bold text-gray-900">
            {{ formatCurrency(totalHistoricalSpending) }}
          </div>
        </div>

        <div class="text-center">
          <div class="text-sm text-gray-600 mb-2">Total Saved</div>
          <div class="text-lg font-bold text-green-700">
            {{ formatCurrency(totalHistoricalSavings) }}
          </div>
        </div>

        <div class="text-center">
          <div class="text-sm text-gray-600 mb-2">Avg Per Week</div>
          <div class="text-lg font-bold text-gray-900">
            {{ formatCurrency(averageSpendingPerWeek) }}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
