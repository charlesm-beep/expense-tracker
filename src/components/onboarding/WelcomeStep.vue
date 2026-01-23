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
    <div class="text-6xl mb-6">👋</div>
    <h2 class="text-3xl font-bold text-green-700 mb-3">
      Welcome to Weekly Budget!
    </h2>
    <p class="text-lg text-gray-600 mb-10 leading-relaxed">
      Your simple, effective tool for managing weekly spending and building better financial habits
    </p>

    <div class="flex flex-col gap-6 mb-10 text-left">
      <div
        v-for="benefit in benefits"
        :key="benefit.title"
        class="flex gap-4 items-start"
      >
        <span class="text-3xl flex-shrink-0">{{ benefit.icon }}</span>
        <div>
          <div class="font-semibold text-gray-900 mb-1">{{ benefit.title }}</div>
          <div class="text-sm text-gray-600 leading-relaxed">{{ benefit.text }}</div>
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
