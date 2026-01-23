<script setup lang="ts">
import { computed } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const onboardingStore = useOnboardingStore()

const budgetDollars = computed({
  get: () => {
    if (onboardingStore.onboardingBudget === null) return ''
    return (onboardingStore.onboardingBudget / 100).toFixed(2)
  },
  set: (value: string) => {
    const parsed = parseFloat(value)
    if (!isNaN(parsed) && parsed >= 0) {
      onboardingStore.setOnboardingBudget(Math.round(parsed * 100))
    } else if (value === '') {
      onboardingStore.setOnboardingBudget(null)
    }
  },
})

const isValid = computed(() => {
  return onboardingStore.onboardingBudget !== null && onboardingStore.onboardingBudget > 0
})
</script>

<template>
  <div class="text-center animate-fadeIn">
    <div class="text-6xl mb-6">💰</div>
    <h2 class="text-3xl font-bold text-green-700 mb-3">
      Set Your Weekly Budget
    </h2>
    <p class="text-lg text-gray-600 mb-10 leading-relaxed">
      Choose a realistic amount you want to spend each week. You can always adjust this later.
    </p>

    <div class="mb-10">
      <Label for="budget-input" class="text-left block mb-2 text-base font-semibold">
        Weekly Budget Amount
      </Label>
      <div class="relative">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-semibold">
          $
        </span>
        <Input
          id="budget-input"
          v-model="budgetDollars"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          class="text-2xl font-bold pl-8 h-14"
          autofocus
        />
      </div>
      <p v-if="!isValid" class="text-sm text-red-600 mt-2">
        Please enter a budget amount greater than $0
      </p>
    </div>

    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
      <div class="flex gap-3">
        <span class="text-2xl">💡</span>
        <div>
          <div class="font-semibold text-blue-900 mb-1">Budget Tips</div>
          <ul class="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Start with your typical weekly spending</li>
            <li>Be realistic - it's better to succeed with a higher budget than fail with an unrealistic one</li>
            <li>You can adjust your budget at the start of each new week</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease;
}
</style>
