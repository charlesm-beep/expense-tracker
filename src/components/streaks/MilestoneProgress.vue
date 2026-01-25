<script setup lang="ts">
import { computed } from 'vue'
import { useStreaks } from '@/composables/useStreaks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Target } from 'lucide-vue-next'

const { longestStreak, nextMilestone, progressToNextMilestone } = useStreaks()

const hasNextMilestone = computed(() => !!nextMilestone.value)

const weeksRemaining = computed(() => {
  if (!nextMilestone.value) return 0
  return nextMilestone.value.weeks - longestStreak.value
})
</script>

<template>
  <Card v-if="hasNextMilestone">
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Target class="w-5 h-5 text-blue-500" />
        <span>Next Milestone</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="flex items-center gap-4 mb-4">
        <div class="text-4xl">{{ nextMilestone?.icon }}</div>
        <div class="flex-1">
          <div class="font-bold text-lg text-gray-900 mb-1">
            {{ nextMilestone?.name }}
          </div>
          <div class="text-sm text-gray-600">
            {{ weeksRemaining }} {{ weeksRemaining === 1 ? 'week' : 'weeks' }} to go
          </div>
        </div>
        <Badge class="bg-blue-100 text-blue-800 border-blue-300 text-lg font-bold px-3 py-1">
          {{ Math.round(progressToNextMilestone) }}%
        </Badge>
      </div>

      <Progress :model-value="progressToNextMilestone" class="h-3" />

      <div class="mt-4 text-xs text-gray-600 text-center">
        {{ longestStreak }} / {{ nextMilestone?.weeks }} weeks completed
      </div>
    </CardContent>
  </Card>

  <Card v-else>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Target class="w-5 h-5 text-purple-500" />
        <span>All Milestones Complete!</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="text-center py-6">
        <div class="text-6xl mb-4">🎉</div>
        <div class="font-bold text-xl text-gray-900 mb-2">
          Congratulations!
        </div>
        <div class="text-gray-600">
          You've achieved all available milestones. Keep up the great work!
        </div>
      </div>
    </CardContent>
  </Card>
</template>
