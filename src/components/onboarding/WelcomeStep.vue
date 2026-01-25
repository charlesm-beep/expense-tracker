<script setup lang="ts">
const benefits = [
  {
    icon: '💰',
    title: 'Simple Weekly Budget',
    text: 'Set a weekly spending limit and track your progress in real-time',
  },
  {
    icon: '📝',
    title: 'Quick Expense Logging',
    text: 'Add expenses in seconds with just an amount and optional note',
  },
  {
    icon: '🔥',
    title: 'Build Streaks',
    text: 'Stay motivated with streak tracking and milestone achievements',
  },
  {
    icon: '📊',
    title: 'Track Your Progress',
    text: 'View your spending history and see how much you have saved',
  },
]
</script>

<template>
  <div class="text-center animate-fadeIn">
    <div class="text-5xl mb-4">👋</div>
    <h2 class="text-2xl font-bold text-green-700 mb-2">
      Welcome to Weekly Budget!
    </h2>
    <p class="text-base text-gray-600 mb-6 leading-relaxed">
      Simple weekly spending tracking with daily logging and streaks
    </p>

    <div class="flex flex-col gap-4 text-left">
      <div
        v-for="benefit in benefits"
        :key="benefit.title"
        class="flex gap-3 items-start"
      >
        <span class="text-2xl flex-shrink-0">{{ benefit.icon }}</span>
        <div>
          <div class="font-semibold text-gray-900 text-sm mb-0.5">{{ benefit.title }}</div>
          <div class="text-xs text-gray-600 leading-relaxed">{{ benefit.text }}</div>
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
