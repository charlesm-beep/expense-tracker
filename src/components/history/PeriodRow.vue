<script setup lang="ts">
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useFormatters } from '@/composables/useFormatters'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { ChevronDown, ChevronRight } from 'lucide-vue-next'
import type { HistoricalPeriod } from '@/types'

interface Props {
  period: HistoricalPeriod
}

const props = defineProps<Props>()

const uiStore = useUIStore()
const { formatCurrency, formatDate } = useFormatters()

const isExpanded = computed(() => {
  return !!uiStore.expandedPeriods[props.period.id]
})

const periodDates = computed(() => {
  const start = formatDate(props.period.start_date)
  const end = formatDate(props.period.end_date)
  return `${start} - ${end}`
})

const totalSpent = computed(() => {
  return props.period.total_spent_cents || 0
})

const statusBadge = computed(() => {
  if (props.period.success) {
    return {
      text: 'Success',
      class: 'bg-green-100 text-green-800 border-green-300',
    }
  }
  return {
    text: 'Over Budget',
    class: 'bg-red-100 text-red-800 border-red-300',
  }
})

const hasExpenses = computed(() => {
  return props.period.expenses && props.period.expenses.length > 0
})

function toggleExpand() {
  if (hasExpenses.value) {
    uiStore.togglePeriodExpanded(props.period.id)
  }
}
</script>

<template>
  <template>
    <TableRow
      :class="hasExpenses ? 'cursor-pointer hover:bg-gray-50' : ''"
      @click="toggleExpand"
    >
      <TableCell class="font-medium">
        <div class="flex items-center gap-2">
          <component
            :is="isExpanded ? ChevronDown : ChevronRight"
            v-if="hasExpenses"
            class="w-4 h-4 text-gray-500"
          />
          <span class="text-sm">{{ periodDates }}</span>
        </div>
      </TableCell>
      <TableCell class="text-right font-semibold hidden md:table-cell">
        {{ formatCurrency(period.budget_cents) }}
      </TableCell>
      <TableCell class="text-right font-semibold">
        {{ formatCurrency(totalSpent) }}
      </TableCell>
      <TableCell class="text-right">
        <Badge :class="statusBadge.class">
          {{ statusBadge.text }}
        </Badge>
      </TableCell>
    </TableRow>

    <!-- Expanded Expenses -->
    <TableRow v-if="isExpanded && hasExpenses">
      <TableCell colspan="4" class="bg-gray-50 p-0">
        <div class="px-6 py-4">
          <div class="text-sm font-semibold text-gray-700 mb-3">Expenses</div>
          <div class="space-y-2">
            <div
              v-for="expense in period.expenses"
              :key="expense.id"
              class="flex justify-between items-start text-sm bg-white p-3 rounded-lg border border-gray-200"
            >
              <div class="flex-1">
                <div class="font-medium text-gray-900">
                  {{ expense.note || 'No description' }}
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ formatDate(expense.timestamp) }}
                </div>
              </div>
              <div class="font-semibold text-gray-900 ml-4">
                {{ formatCurrency(expense.amount_cents) }}
              </div>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  </template>
</template>
