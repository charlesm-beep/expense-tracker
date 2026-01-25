<script setup lang="ts">
interface Props {
  currentStep: number
}

defineProps<Props>()

const steps = [
  { number: 1, label: 'Welcome' },
  { number: 2, label: 'Budget' },
  { number: 3, label: 'Learn' },
]
</script>

<template>
  <div class="flex items-center justify-center gap-2 mb-6">
    <template v-for="(step, index) in steps" :key="step.number">
      <!-- Step Circle -->
      <div
        class="flex flex-col items-center"
        :class="currentStep >= step.number ? 'opacity-100' : 'opacity-30'"
      >
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300"
          :class="
            currentStep >= step.number
              ? 'bg-green-700 text-white'
              : 'bg-gray-200 text-gray-500'
          "
        >
          {{ step.number }}
        </div>
        <div
          class="mt-1.5 text-[10px] font-medium transition-all duration-300"
          :class="
            currentStep >= step.number ? 'text-green-700' : 'text-gray-400'
          "
        >
          {{ step.label }}
        </div>
      </div>

      <!-- Progress Line -->
      <div
        v-if="index < steps.length - 1"
        class="w-10 h-0.5 mb-5 transition-all duration-300"
        :class="
          currentStep > step.number ? 'bg-green-700' : 'bg-gray-200'
        "
      />
    </template>
  </div>
</template>
