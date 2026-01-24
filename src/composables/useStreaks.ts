import { computed } from 'vue'
import { useBudgetStore } from '@/stores/budget'
import { MILESTONES } from '@/lib/constants'
import type { Milestone } from '@/types'

export function useStreaks() {
  const budgetStore = useBudgetStore()

  const milestones = computed<Milestone[]>(() => MILESTONES)

  const achievedMilestones = computed<Milestone[]>(() => {
    return MILESTONES.filter((m) => budgetStore.longestStreak >= m.weeks)
  })

  const nextMilestone = computed<Milestone | undefined>(() => {
    return MILESTONES.find((m) => budgetStore.longestStreak < m.weeks)
  })

  const progressToNextMilestone = computed<number>(() => {
    if (!nextMilestone.value) return 100
    return Math.min(100, (budgetStore.longestStreak / nextMilestone.value.weeks) * 100)
  })

  return {
    milestones,
    achievedMilestones,
    nextMilestone,
    progressToNextMilestone,
    currentStreak: computed(() => budgetStore.currentStreak),
    longestStreak: computed(() => budgetStore.longestStreak),
  }
}
