<script setup lang="ts">
import { computed } from 'vue'
import { useBudgetStore } from '@/stores/budget'
import { useUIStore } from '@/stores/ui'
import { useDailyLogging } from '@/composables/useDailyLogging'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const budgetStore = useBudgetStore()
const uiStore = useUIStore()
const { weekDays } = useDailyLogging()

const isOpen = computed({
  get: () => uiStore.showStreakCelebration,
  set: (value: boolean) => {
    if (!value) {
      uiStore.closeStreakCelebration()
    }
  }
})

const streakCount = computed(() => budgetStore.currentStreak)

const handleDismiss = () => {
  uiStore.closeStreakCelebration()
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="max-w-[90vw] sm:max-w-md bg-slate-800 border-slate-700 text-white p-0">
      <div class="flex flex-col items-center py-4 sm:py-8 px-4 sm:px-6 space-y-4 sm:space-y-6">
        <!-- Confetti decoration -->
        <div class="text-4xl sm:text-6xl">🎉</div>

        <!-- Streak Count -->
        <div class="text-center">
          <div class="text-5xl sm:text-7xl font-bold text-amber-500 mb-1 sm:mb-2">
            {{ streakCount }}
          </div>
          <div class="text-xl sm:text-2xl font-medium text-white">
            day streak
          </div>
        </div>

        <!-- Week visualization -->
        <div class="w-full">
          <div class="flex items-center justify-center gap-1 sm:gap-2 p-3 sm:p-6 bg-slate-900 rounded-lg overflow-x-auto">
            <div
              v-for="day in weekDays"
              :key="day.dayKey"
              class="flex flex-col items-center flex-shrink-0"
            >
              <div
                :class="[
                  'w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold transition-all',
                  day.isComplete
                    ? 'bg-green-600 text-xl sm:text-2xl'
                    : 'bg-gray-600'
                ]"
              >
                <span v-if="day.isComplete">✓</span>
              </div>
              <div class="text-[10px] sm:text-xs text-gray-400 mt-1">
                {{ day.dayName.substring(0, 2) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Dismiss button -->
        <Button
          @click="handleDismiss"
          class="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-base sm:text-lg py-4 sm:py-6"
          size="lg"
        >
          Nice job!
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
