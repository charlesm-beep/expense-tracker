<script setup lang="ts">
import { computed } from 'vue'
import { useBudgetStore } from '@/stores/budget'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import PeriodRow from './PeriodRow.vue'

const budgetStore = useBudgetStore()

const sortedHistory = computed(() => {
  return [...budgetStore.history].sort((a, b) => {
    return new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
  })
})

const hasHistory = computed(() => {
  return budgetStore.history.length > 0
})
</script>

<template>
  <div v-if="hasHistory" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow class="bg-gray-50">
          <TableHead class="font-semibold text-gray-700">Week</TableHead>
          <TableHead class="font-semibold text-gray-700 text-right hidden md:table-cell">
            Budget
          </TableHead>
          <TableHead class="font-semibold text-gray-700 text-right">
            Spent
          </TableHead>
          <TableHead class="font-semibold text-gray-700 text-right">
            Status
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <PeriodRow
          v-for="period in sortedHistory"
          :key="period.id"
          :period="period"
        />
      </TableBody>
    </Table>
  </div>

  <div
    v-else
    class="bg-white rounded-lg border border-gray-200 p-12 text-center"
  >
    <div class="text-6xl mb-4">📋</div>
    <h3 class="text-xl font-semibold text-gray-900 mb-2">No History Yet</h3>
    <p class="text-gray-600">
      Complete your first budget period to see your spending history here
    </p>
  </div>
</template>
