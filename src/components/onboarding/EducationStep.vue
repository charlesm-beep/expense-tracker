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
    <div class="text-6xl mb-6">🎓</div>
    <h2 class="text-3xl font-bold text-green-700 mb-3">
      How to Use Weekly Budget
    </h2>
    <p class="text-lg text-gray-600 mb-10 leading-relaxed">
      Follow these simple steps to take control of your spending
    </p>

    <div class="flex flex-col gap-6 mb-10 text-left">
      <div
        v-for="(tip, index) in tips"
        :key="tip.title"
        class="flex gap-4 items-start"
      >
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
          {{ index + 1 }}
        </div>
        <div class="flex gap-3 flex-1">
          <span class="text-2xl flex-shrink-0">{{ tip.icon }}</span>
          <div>
            <div class="font-semibold text-gray-900 mb-1">{{ tip.title }}</div>
            <div class="text-sm text-gray-600 leading-relaxed">{{ tip.text }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
      <div class="flex gap-3">
        <span class="text-2xl">✨</span>
        <div>
          <div class="font-semibold text-green-900 mb-1">You're All Set!</div>
          <div class="text-sm text-green-800">
            Click "Get Started" below to create your first budget and start building better spending habits!
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
