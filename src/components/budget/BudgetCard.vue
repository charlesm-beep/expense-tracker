<script setup lang="ts">
import { computed } from 'vue'
import { useBudgetStore } from '@/stores/budget'
import { useFormatters } from '@/composables/useFormatters'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

const budgetStore = useBudgetStore()
const { formatCurrency } = useFormatters()

const remainingAmount = computed(() => formatCurrency(budgetStore.remainingCents))

const spentAmount = computed(() => formatCurrency(budgetStore.totalSpentCents))

const budgetAmount = computed(() =>
  budgetStore.currentPeriod ? formatCurrency(budgetStore.currentPeriod.budget_cents) : '$0.00'
)

const spendingPercentage = computed(() => {
  if (!budgetStore.currentPeriod) return 0
  const percentage = (budgetStore.totalSpentCents / budgetStore.currentPeriod.budget_cents) * 100
  return Math.min(100, Math.max(0, percentage))
})

const remainingColorClass = computed(() => {
  const colorClass = budgetStore.remainingColorClass
  if (colorClass === 'danger') return 'text-red-600'
  if (colorClass === 'warning') return 'text-amber-600'
  return 'text-green-600'
})

const badgeVariant = computed(() => {
  const colorClass = budgetStore.remainingColorClass
  if (colorClass === 'danger') return 'destructive'
  if (colorClass === 'warning') return 'secondary'
  return 'default'
})

const badgeText = computed(() => {
  const colorClass = budgetStore.remainingColorClass
  if (colorClass === 'danger') return 'Over Budget'
  if (colorClass === 'warning') return 'Low Budget'
  return 'On Track'
})

const progressColorClass = computed(() => {
  const colorClass = budgetStore.remainingColorClass
  if (colorClass === 'danger') return 'bg-red-600'
  if (colorClass === 'warning') return 'bg-amber-600'
  return 'bg-green-600'
})
</script>

<template>
  <Card class="mb-6">
    <CardContent class="pt-6">
      <!-- Remaining Budget Display -->
      <div class="text-center mb-6">
        <div class="text-sm text-gray-600 mb-2 uppercase tracking-wide font-medium">
          Remaining This Week
        </div>
        <div
          class="text-5xl font-bold transition-colors duration-300"
          :class="remainingColorClass"
        >
          {{ remainingAmount }}
        </div>
        <div class="mt-3">
          <Badge :variant="badgeVariant">
            {{ badgeText }}
          </Badge>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mb-6">
        <Progress
          :model-value="spendingPercentage"
          :class="progressColorClass"
          class="h-3"
        />
      </div>

      <!-- Budget Breakdown -->
      <div class="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div class="flex flex-col text-center">
          <span class="text-xs text-gray-600 mb-1 uppercase tracking-wide font-semibold">
            Spent
          </span>
          <span class="text-base font-semibold text-gray-900">
            {{ spentAmount }}
          </span>
        </div>
        <div class="flex flex-col text-center">
          <span class="text-xs text-gray-600 mb-1 uppercase tracking-wide font-semibold">
            Budget
          </span>
          <span class="text-base font-semibold text-gray-900">
            {{ budgetAmount }}
          </span>
        </div>
        <div class="flex flex-col text-center">
          <span class="text-xs text-gray-600 mb-1 uppercase tracking-wide font-semibold">
            Remaining
          </span>
          <span
            class="text-base font-semibold"
            :class="remainingColorClass"
          >
            {{ remainingAmount }}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
