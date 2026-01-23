import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOnboardingStore = defineStore('onboarding', () => {
  // State
  const showOnboarding = ref(false)
  const onboardingStep = ref(1)
  const onboardingBudget = ref<number | null>(null)

  // Actions
  function setShowOnboarding(show: boolean) {
    showOnboarding.value = show
  }

  function setOnboardingStep(step: number) {
    onboardingStep.value = step
  }

  function nextStep() {
    onboardingStep.value++
  }

  function previousStep() {
    if (onboardingStep.value > 1) {
      onboardingStep.value--
    }
  }

  function setOnboardingBudget(budget: number | null) {
    onboardingBudget.value = budget
  }

  function resetOnboardingState() {
    showOnboarding.value = false
    onboardingStep.value = 1
    onboardingBudget.value = null
  }

  function completeOnboarding() {
    showOnboarding.value = false
    onboardingStep.value = 1
    onboardingBudget.value = null
  }

  return {
    // State
    showOnboarding,
    onboardingStep,
    onboardingBudget,
    // Actions
    setShowOnboarding,
    setOnboardingStep,
    nextStep,
    previousStep,
    setOnboardingBudget,
    resetOnboardingState,
    completeOnboarding,
  }
})
