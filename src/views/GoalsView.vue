<script setup lang="ts">
import StreakCard from '@/components/streaks/StreakCard.vue'
import MilestoneProgress from '@/components/streaks/MilestoneProgress.vue'
import AchievementsList from '@/components/streaks/AchievementsList.vue'
</script>

<template>
  <div class="space-y-6">
    <StreakCard />
    <MilestoneProgress />
    <AchievementsList />
  </div>
</template>
