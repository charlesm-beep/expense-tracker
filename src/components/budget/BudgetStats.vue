<script setup lang="ts">
import { computed } from 'vue'
import { useBudgetStore } from '@/stores/budget'
import { useFormatters } from '@/composables/useFormatters'
import { Badge } from '@/components/ui/badge'

const budgetStore = useBudgetStore()
const { formatDateShort } = useFormatters()

const daysLeftText = computed(() => {
  const days = budgetStore.daysLeft
  if (days < 0) return 'Overdue'
  if (days === 0) return 'Last day'
  if (days === 1) return '1 day'
  return `${days} days`
})

const periodDates = computed(() => {
  if (!budgetStore.currentPeriod) return ''
  const start = formatDateShort(budgetStore.currentPeriod.start_date)
  const end = formatDateShort(budgetStore.currentPeriod.end_date)
  return `${start} - ${end}`
})

const isOverdue = computed(() => budgetStore.isPeriodOverdue)
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-600">Budget Period:</span>
      <span class="text-sm font-medium text-gray-900">{{ periodDates }}</span>
    </div>
    <div class="flex items-center gap-2">
      <Badge
        v-if="isOverdue"
        variant="destructive"
      >
        Overdue
      </Badge>
      <Badge
        v-else
        :variant="budgetStore.daysLeft <= 2 ? 'secondary' : 'outline'"
      >
        {{ daysLeftText }} left
      </Badge>
    </div>
  </div>
</template>
