<script setup lang="ts">
const tips = [
  {
    icon: '💸',
    title: 'Log Every Expense',
    text: 'Add expenses as you spend to stay on top of your budget',
  },
  {
    icon: '✅',
    title: 'Mark Days Complete',
    text: 'Mark days as done when you\'re satisfied with your spending',
  },
  {
    icon: '🎯',
    title: 'Stay Under Budget',
    text: 'Successfully complete a week to build your streak',
  },
  {
    icon: '🏆',
    title: 'Unlock Achievements',
    text: 'Build streaks to unlock milestone achievements',
  },
]
</script>

<template>
  <div class="text-center animate-fadeIn">
    <div class="text-5xl mb-4">🎓</div>
    <h2 class="text-2xl font-bold text-green-700 mb-2">
      How It Works
    </h2>
    <p class="text-base text-gray-600 mb-6 leading-relaxed">
      Four simple steps to take control of your spending
    </p>

    <div class="flex flex-col gap-4 text-left">
      <div
        v-for="(tip, index) in tips"
        :key="tip.title"
        class="flex gap-3 items-start"
      >
        <div class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">
          {{ index + 1 }}
        </div>
        <div class="flex gap-2 flex-1">
          <span class="text-xl flex-shrink-0">{{ tip.icon }}</span>
          <div>
            <div class="font-semibold text-gray-900 text-sm mb-0.5">{{ tip.title }}</div>
            <div class="text-xs text-gray-600 leading-relaxed">{{ tip.text }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-green-50 border border-green-200 rounded-lg p-3 text-left mt-6">
      <div class="flex gap-2">
        <span class="text-xl">✨</span>
        <div>
          <div class="font-semibold text-green-900 text-sm mb-0.5">You're All Set!</div>
          <div class="text-xs text-green-800">
            Click "Get Started" to create your first budget
          </div>
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
