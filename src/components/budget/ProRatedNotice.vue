<script setup lang="ts">
import { computed } from 'vue'
import { useBudgetStore } from '@/stores/budget'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InfoIcon } from 'lucide-vue-next'

const budgetStore = useBudgetStore()

const shouldShow = computed(() => budgetStore.isProRatedWeek)

const fullBudgetAmount = computed(() => {
  if (!budgetStore.lastBudgetCents) return '0.00'
  return (budgetStore.lastBudgetCents / 100).toFixed(2)
})
</script>

<template>
  <Alert
    v-if="shouldShow"
    variant="info"
    class="mb-6"
  >
    <InfoIcon class="h-4 w-4" />
    <AlertDescription>
      Your budget is adjusted for the remaining days this week. Starting Monday, you'll get the
      full ${{ fullBudgetAmount }} weekly budget.
    </AlertDescription>
  </Alert>
</template>
