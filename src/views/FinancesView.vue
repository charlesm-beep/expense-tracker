<script setup lang="ts">
import { computed } from 'vue'
import { useBudgetStore } from '@/stores/budget'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const budgetStore = useBudgetStore()

const hasPeriod = computed(() => !!budgetStore.currentPeriod)
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-6">
    <div v-if="hasPeriod" class="space-y-4">
      <!-- Placeholder for Finances Tab -->
      <Card>
        <CardHeader>
          <CardTitle>Finances</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-gray-600">
            This tab will show your comprehensive budget breakdown, income, and savings.
          </p>
          <div class="mt-4 space-y-2 text-sm text-gray-500">
            <p>✨ Coming soon:</p>
            <ul class="list-disc list-inside ml-2 space-y-1">
              <li>Income tracking (salary, bonuses)</li>
              <li>Category budgets (rent, bills, discretionary)</li>
              <li>Savings calculations</li>
              <li>Recurring expenses management</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- No Period Message -->
    <div v-else class="text-center py-12">
      <div class="text-4xl mb-4">💰</div>
      <div class="text-lg font-semibold text-gray-900 mb-2">No Active Period</div>
      <div class="text-sm text-gray-600">Create a budget period to get started</div>
    </div>
  </div>
</template>
