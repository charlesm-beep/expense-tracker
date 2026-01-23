<script setup lang="ts">
import { computed } from 'vue'
import { useStreaks } from '@/composables/useStreaks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award } from 'lucide-vue-next'

const { achievedMilestones } = useStreaks()

const hasAchievements = computed(() => achievedMilestones.value.length > 0)
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Award class="w-5 h-5 text-yellow-500" />
        <span>Achievements</span>
        <Badge
          v-if="hasAchievements"
          class="bg-yellow-100 text-yellow-800 border-yellow-300 ml-auto"
        >
          {{ achievedMilestones.length }}
        </Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="hasAchievements" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="milestone in achievedMilestones"
          :key="milestone.name"
          class="flex items-center gap-3 bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4 shadow-sm"
        >
          <div class="text-3xl">{{ milestone.icon }}</div>
          <div>
            <div class="font-semibold text-gray-900 text-sm">
              {{ milestone.name }}
            </div>
            <div class="text-xs text-gray-600">
              {{ milestone.weeks }} {{ milestone.weeks === 1 ? 'week' : 'weeks' }}
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <div class="text-5xl mb-4">🏆</div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          No Achievements Yet
        </h3>
        <p class="text-gray-600 text-sm">
          Complete budget periods under budget to unlock your first achievement
        </p>
      </div>
    </CardContent>
  </Card>
</template>
