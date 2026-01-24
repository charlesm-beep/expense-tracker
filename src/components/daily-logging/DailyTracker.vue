<script setup lang="ts">
import { computed } from 'vue'
import { useDailyLogging } from '@/composables/useDailyLogging'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DayCell from './DayCell.vue'

const { weekDays } = useDailyLogging()

const completedDays = computed(() => weekDays.value.filter((d) => d.isComplete).length)
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
      <CardTitle>Daily Logging</CardTitle>
      <span class="text-sm text-gray-600">{{ completedDays }}/7 days</span>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-7 gap-2">
        <DayCell
          v-for="day in weekDays"
          :key="day.dayKey"
          :day="day"
        />
      </div>
    </CardContent>
  </Card>
</template>
