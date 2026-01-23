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
    'border-2 hover:scale-110',
    {
      // Selected state (not complete) - subtle shadow and darker border
      'border-gray-400 bg-gray-50 text-gray-900 shadow-md':
        isSelected.value && !props.day.isComplete,
      // Complete state - green with checkmark
      'bg-green-600 border-green-600 text-white':
        props.day.isComplete && !isSelected.value,
      // Complete + selected - green with subtle shadow
      'bg-green-600 border-green-700 text-white shadow-md':
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
    <div v-if="!day.isComplete" class="flex flex-col items-center">
      <div class="text-[10px] font-semibold uppercase leading-none mb-0.5">
        {{ dayInitial }}
      </div>
      <div class="text-[10px] leading-none">{{ day.dayNumber }}</div>
    </div>
    <div v-else class="text-xl font-bold">✓</div>
  </button>
</template>
