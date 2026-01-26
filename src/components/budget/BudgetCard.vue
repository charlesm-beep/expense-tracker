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

const remainingPercentage = computed(() => {
  if (!budgetStore.currentPeriod) return 100
  const percentage = (budgetStore.remainingCents / budgetStore.currentPeriod.budget_cents) * 100
  return Math.min(100, Math.max(0, percentage))
})

const progressBarColor = computed(() => {
  const percentage = remainingPercentage.value

  // Color shifts from bright green (full) to darker green (empty)
  // Using HSL: adjust lightness based on remaining percentage
  // 100% = hsl(142, 76%, 45%) bright green
  // 0% = hsl(142, 76%, 25%) dark green
  const lightness = 25 + (percentage * 0.2) // 25% to 45%
  return `hsl(142, 76%, ${lightness}%)`
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
  if (colorClass === 'warning') return 'Caution'
  return 'On Track'
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
          :style="{ color: progressBarColor }"
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
      <div class="mb-3">
        <Progress
          :model-value="remainingPercentage"
          :style="{ '--progress-color': progressBarColor }"
          class="h-3"
        />
      </div>

      <!-- Starting Budget Context -->
      <div class="text-center">
        <span class="text-sm text-gray-500">
          Started with {{ budgetAmount }}
        </span>
      </div>
    </CardContent>
  </Card>
</template>
