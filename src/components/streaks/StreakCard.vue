<script setup lang="ts">
import { useStreaks } from '@/composables/useStreaks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Flame } from 'lucide-vue-next'

const { currentStreak, longestStreak } = useStreaks()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Flame class="w-5 h-5 text-orange-500" />
        <span>Your Streaks</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-2 gap-6">
        <div class="text-center">
          <div class="text-sm text-gray-600 mb-2">Current Streak</div>
          <Badge
            class="text-2xl font-bold px-4 py-2 bg-orange-100 text-orange-800 border-orange-300"
          >
            <Flame class="w-5 h-5 mr-2 inline" />
            {{ currentStreak }} {{ currentStreak === 1 ? 'week' : 'weeks' }}
          </Badge>
        </div>

        <div class="text-center">
          <div class="text-sm text-gray-600 mb-2">Longest Streak</div>
          <Badge
            class="text-2xl font-bold px-4 py-2 bg-purple-100 text-purple-800 border-purple-300"
          >
            <span class="text-xl mr-2">🏆</span>
            {{ longestStreak }} {{ longestStreak === 1 ? 'week' : 'weeks' }}
          </Badge>
        </div>
      </div>

      <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex gap-3">
          <span class="text-xl">💡</span>
          <div>
            <div class="font-semibold text-blue-900 text-sm mb-1">
              Keep Your Streak Going!
            </div>
            <div class="text-xs text-blue-800">
              Complete budget periods under budget to build your streak and unlock achievements
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
