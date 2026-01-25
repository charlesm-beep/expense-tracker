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
    <div class="text-5xl mb-4">💰</div>
    <h2 class="text-2xl font-bold text-green-700 mb-2">
      Set Your Weekly Budget
    </h2>
    <p class="text-base text-gray-600 mb-6 leading-relaxed">
      Choose a realistic weekly spending limit
    </p>

    <div class="mb-6">
      <Label for="budget-input" class="text-left block mb-2 text-sm font-semibold">
        Weekly Budget Amount
      </Label>
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base font-semibold">
          $
        </span>
        <Input
          id="budget-input"
          v-model="budgetDollars"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          class="text-xl font-bold pl-7 h-12"
          autofocus
        />
      </div>
      <p v-if="!isValid" class="text-xs text-red-600 mt-1.5">
        Please enter a budget amount greater than $0
      </p>
    </div>

    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
      <div class="flex gap-2">
        <span class="text-xl">💡</span>
        <div>
          <div class="font-semibold text-blue-900 mb-1 text-sm">Quick Tips</div>
          <ul class="text-xs text-blue-800 space-y-0.5 list-disc list-inside">
            <li>Start with your typical weekly spending</li>
            <li>Be realistic - success matters more than perfection</li>
            <li>You can adjust at the start of each week</li>
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
