<script setup lang="ts">
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import { cn } from '@/lib/utils'
import type { DayInfo } from '@/types'

interface Props {
  day: DayInfo
}

const props = defineProps<Props>()

const uiStore = useUIStore()

const isSelected = computed(() => {
  if (!uiStore.selectedDay) return false
  return uiStore.selectedDay.dayKey === props.day.dayKey
})

const cellClasses = computed(() =>
  cn(
    'aspect-square rounded-full flex items-center justify-center cursor-pointer transition-all duration-300',
    'border-4 hover:scale-110 active:scale-100',
    {
      // Selected state (not complete) - bold emerald ring
      'border-emerald-500 bg-emerald-50 text-gray-900 shadow-lg ring-4 ring-emerald-200 scale-105':
        isSelected.value && !props.day.isComplete,
      // Complete state - green with checkmark
      'bg-green-600 border-green-600 text-white':
        props.day.isComplete && !isSelected.value,
      // Complete + selected - bold emerald ring with green background
      'bg-green-600 border-emerald-500 text-white shadow-lg ring-4 ring-emerald-200 scale-105':
        props.day.isComplete && isSelected.value,
      // Today (not complete, not selected) - ring border
      'border-green-600 bg-white text-gray-900':
        props.day.isToday && !props.day.isComplete && !isSelected.value,
      // Regular day (not complete, not today, not selected)
      'border-gray-300 bg-white text-gray-700':
        !props.day.isToday && !props.day.isComplete && !isSelected.value,
    }
  )
)

const dayInitial = computed(() => props.day.dayName.substring(0, 1))

function handleClick() {
  uiStore.selectDay(props.day)
}
</script>

<template>
  <button
    :class="cellClasses"
    @click="handleClick"
    :title="`${day.dayName}, ${day.dayNumber}`"
  >
    <div class="flex flex-col items-center justify-center px-1">
      <div v-if="day.isComplete" class="text-lg font-bold mb-0.5">✓</div>
      <div class="text-[9px] font-semibold leading-tight text-center">
        {{ day.dayName }}
      </div>
      <div class="text-[8px] leading-tight opacity-90">
        {{ day.dayNumber }}
      </div>
    </div>
  </button>
</template>
