<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useBudgetStore } from '@/stores/budget'
import { useUIStore } from '@/stores/ui'
import { useDailyLogging } from '@/composables/useDailyLogging'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const budgetStore = useBudgetStore()
const uiStore = useUIStore()
const { weekDays, toggleDayComplete } = useDailyLogging()

// Use selected day if available, otherwise use today
const activeDay = computed(() => {
  if (uiStore.selectedDay) {
    return uiStore.selectedDay
  }
  return weekDays.value.find((d) => d.isToday)
})

const isChecked = ref(false)

// Sync isChecked with activeDay.isComplete - watch both the day and its completion status
watch(
  () => activeDay.value,
  (newDay) => {
    isChecked.value = newDay?.isComplete || false
  },
  { immediate: true, deep: true }
)

const labelText = computed(() => 'Done logging')

async function handleClick() {
  if (!activeDay.value) {
    return
  }

  const wasComplete = activeDay.value.isComplete

  // Toggle the value
  isChecked.value = !isChecked.value

  await toggleDayComplete(activeDay.value.dayKey)

  // Show celebration modal when marking as complete
  if (!wasComplete) {
    setTimeout(() => {
      uiStore.openStreakCelebration()
    }, 200)
  }
}
</script>

<template>
  <div
    class="flex items-center gap-2 cursor-pointer"
    @click="handleClick"
  >
    <Label
      for="done-logging"
      class="text-xs font-medium text-gray-600 cursor-pointer whitespace-nowrap"
    >
      {{ labelText }}
    </Label>
    <Switch
      id="done-logging"
      :checked="isChecked"
    />
  </div>
</template>
