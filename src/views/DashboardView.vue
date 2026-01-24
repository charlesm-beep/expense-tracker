<script setup lang="ts">
import { computed } from 'vue'
import { useBudgetStore } from '@/stores/budget'
import BudgetCard from '@/components/budget/BudgetCard.vue'
import BudgetStats from '@/components/budget/BudgetStats.vue'
import ProRatedNotice from '@/components/budget/ProRatedNotice.vue'
import DailyTracker from '@/components/daily-logging/DailyTracker.vue'
import ExpenseForm from '@/components/expenses/ExpenseForm.vue'
import ExpenseList from '@/components/expenses/ExpenseList.vue'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-vue-next'

const budgetStore = useBudgetStore()

const hasPeriod = computed(() => !!budgetStore.currentPeriod)

const isPeriodOverdue = computed(() => budgetStore.isPeriodOverdue)

const daysOverdue = computed(() => Math.abs(budgetStore.daysLeft))
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-6">
    <!-- Budget Display Section -->
    <div v-if="hasPeriod" class="space-y-4">
      <!-- Budget Stats (Period dates and days left) -->
      <BudgetStats />

      <!-- Main Budget Card -->
      <div class="mt-3">
        <BudgetCard />
      </div>

      <!-- Pro-rated Notice (conditional) -->
      <ProRatedNotice />

      <!-- Overdue Warning -->
      <Alert v-if="isPeriodOverdue" variant="destructive">
        <AlertCircleIcon class="h-4 w-4" />
        <AlertDescription>
          This week ended {{ daysOverdue }} {{ daysOverdue === 1 ? 'day' : 'days' }} ago.
          Refresh the page to start the new week.
        </AlertDescription>
      </Alert>

      <!-- Daily Logging Tracker -->
      <div class="mt-6">
        <DailyTracker />
      </div>

      <!-- Expense Form -->
      <div class="mt-6">
        <ExpenseForm />
      </div>

      <!-- Expense List -->
      <div class="mt-6">
        <ExpenseList />
      </div>
    </div>

    <!-- No Period Message -->
    <div v-else class="text-center py-12">
      <div class="text-4xl mb-4">💰</div>
      <div class="text-lg font-semibold text-gray-900 mb-2">No Active Period</div>
      <div class="text-sm text-gray-600">Create a budget period to get started</div>
    </div>
  </div>
</template>
