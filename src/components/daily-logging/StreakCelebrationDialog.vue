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
const { weekDays, getConsecutiveDays } = useDailyLogging()

const isOpen = computed({
  get: () => uiStore.showStreakCelebration,
  set: (value: boolean) => {
    if (!value) {
      uiStore.closeStreakCelebration()
    }
  }
})

const streakCount = computed(() => {
  if (!budgetStore.currentPeriod) return 0
  return getConsecutiveDays(budgetStore.currentPeriod.days_marked_done)
})

const completedDaysThisWeek = computed(() => {
  return weekDays.value.filter(day => day.isComplete).length
})

const isPerfectWeek = computed(() => completedDaysThisWeek.value === 7)

const perfectWeeksCount = computed(() => {
  return Math.floor(streakCount.value / 7)
})

const motivationalCopy = computed(() => {
  const count = streakCount.value
  if (count >= 14) return "You're unstoppable! 🔥"
  if (count >= 7) return "One week down! 💪"
  if (count >= 5) return "On a roll! ⭐"
  if (count >= 3) return "Building momentum! 🚀"
  return "Great start! 🎉"
})

const buttonText = computed(() => {
  if (streakCount.value >= 10) return "I'm crushing it!"
  if (streakCount.value >= 7) return "Let's go!"
  return "I rock!"
})

const handleDismiss = () => {
  uiStore.closeStreakCelebration()
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="max-w-[90vw] sm:max-w-lg bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 text-white p-0 overflow-hidden">
      <div class="flex flex-col items-center py-6 sm:py-10 px-4 sm:px-8 space-y-5 sm:space-y-8">
        <!-- Decorative stars/confetti -->
        <div class="flex items-center gap-8 text-3xl sm:text-4xl">
          <span class="animate-pulse">⭐</span>
          <span class="text-5xl sm:text-6xl">🎉</span>
          <span class="animate-pulse" style="animation-delay: 0.2s">⭐</span>
        </div>

        <!-- Huge Streak Count -->
        <div class="text-center space-y-2">
          <div class="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-orange-500 leading-none tracking-tight">
            {{ streakCount }}
          </div>
          <div class="text-2xl sm:text-3xl font-semibold text-white">
            day streak
          </div>
          <div class="text-base sm:text-lg text-emerald-400 font-medium">
            {{ motivationalCopy }}
          </div>
        </div>

        <!-- Achievement Badge (if perfect weeks) -->
        <div v-if="perfectWeeksCount > 0" class="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-4 px-6">
          <div class="flex items-center justify-center gap-2 text-amber-400 font-bold text-lg sm:text-xl">
            <span class="text-2xl">🏆</span>
            <span>{{ perfectWeeksCount }} Perfect {{ perfectWeeksCount === 1 ? 'Week' : 'Weeks' }}</span>
          </div>
        </div>

        <!-- Week visualization -->
        <div class="w-full bg-slate-800/40 border border-slate-700 rounded-xl p-5 sm:p-6">
          <div class="flex items-center justify-center gap-2 sm:gap-3 mb-4">
            <div
              v-for="day in weekDays"
              :key="day.dayKey"
              class="flex flex-col items-center flex-shrink-0"
            >
              <div
                :class="[
                  'w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold transition-all shadow-lg',
                  day.isComplete
                    ? 'bg-emerald-500 text-white text-2xl sm:text-3xl scale-110'
                    : 'bg-slate-700 text-slate-500 border-2 border-slate-600'
                ]"
              >
                <span v-if="day.isComplete">✓</span>
              </div>
              <div class="text-[10px] sm:text-xs text-gray-400 mt-1.5 font-medium">
                {{ day.dayName.substring(0, 3) }}
              </div>
            </div>
          </div>

          <div v-if="isPerfectWeek" class="text-center text-sm sm:text-base font-semibold text-emerald-400 border-t border-slate-700 pt-3">
            ✨ Perfect Week Achieved ✨
          </div>
          <div v-else class="text-center text-xs sm:text-sm text-slate-400 border-t border-slate-700 pt-3">
            {{ completedDaysThisWeek }} of 7 days completed
          </div>
        </div>

        <!-- Dismiss button -->
        <Button
          @click="handleDismiss"
          class="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-900 font-black text-lg sm:text-xl py-5 sm:py-7 shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
          size="lg"
        >
          {{ buttonText }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
