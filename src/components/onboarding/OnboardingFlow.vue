<script setup lang="ts">
import { computed } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding'
import { useBudgetStore } from '@/stores/budget'
import { Button } from '@/components/ui/button'
import ProgressIndicator from './ProgressIndicator.vue'
import WelcomeStep from './WelcomeStep.vue'
import BudgetSetupStep from './BudgetSetupStep.vue'
import EducationStep from './EducationStep.vue'

const onboardingStore = useOnboardingStore()
const budgetStore = useBudgetStore()

const currentStepComponent = computed(() => {
  switch (onboardingStore.onboardingStep) {
    case 1:
      return WelcomeStep
    case 2:
      return BudgetSetupStep
    case 3:
      return EducationStep
    default:
      return WelcomeStep
  }
})

const canProceed = computed(() => {
  if (onboardingStore.onboardingStep === 2) {
    return onboardingStore.onboardingBudget !== null && onboardingStore.onboardingBudget > 0
  }
  return true
})

const nextButtonText = computed(() => {
  if (onboardingStore.onboardingStep === 3) {
    return 'Get Started'
  }
  return 'Next'
})

const showBackButton = computed(() => {
  return onboardingStore.onboardingStep > 1
})

async function handleNext() {
  if (onboardingStore.onboardingStep === 3) {
    // Complete onboarding and create first period
    if (onboardingStore.onboardingBudget) {
      await budgetStore.startNewPeriod(onboardingStore.onboardingBudget)
    }
    onboardingStore.completeOnboarding()
  } else {
    onboardingStore.nextStep()
  }
}

function handleBack() {
  onboardingStore.previousStep()
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
    <div class="max-w-lg w-full bg-white rounded-2xl p-6 md:p-8 shadow-2xl animate-slideUp">
      <ProgressIndicator :current-step="onboardingStore.onboardingStep" />

      <div class="min-h-[320px]">
        <component :is="currentStepComponent" />
      </div>

      <div class="flex gap-3 mt-6">
        <Button
          v-if="showBackButton"
          variant="outline"
          size="default"
          class="flex-1"
          @click="handleBack"
        >
          Back
        </Button>
        <Button
          size="default"
          :class="showBackButton ? 'flex-1' : 'w-full'"
          :disabled="!canProceed"
          @click="handleNext"
        >
          {{ nextButtonText }}
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideUp {
  animation: slideUp 0.4s ease;
}
</style>
