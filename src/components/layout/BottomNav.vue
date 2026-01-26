<script setup lang="ts">
import { useUIStore, type TabType } from '@/stores/ui'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Wallet, History } from 'lucide-vue-next'

const uiStore = useUIStore()

const tabs = [
  {
    id: 'dashboard' as TabType,
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'finances' as TabType,
    label: 'Finances',
    icon: Wallet,
  },
  {
    id: 'history' as TabType,
    label: 'History',
    icon: History,
  },
]

const handleTabClick = (tabId: TabType) => {
  uiStore.setActiveTab(tabId)
}
</script>

<template>
  <div class="bottom-nav">
    <Button
      v-for="tab in tabs"
      :key="tab.id"
      variant="ghost"
      class="nav-tab"
      :class="{ active: uiStore.activeTab === tab.id }"
      @click="handleTabClick(tab.id)"
    >
      <component :is="tab.icon" class="nav-icon" :size="20" />
      <span class="nav-label">{{ tab.label }}</span>
    </Button>
  </div>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rem;
  background: white;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  z-index: 100;
  padding: 0;
}

.nav-tab {
  height: 100%;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  color: #64748b;
  transition: all 0.2s ease;
  position: relative;
  padding: 0.5rem;
}

.nav-tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

/* Match border radius on desktop to container corners */
@media (min-width: 768px) {
  .nav-tab:first-child::before {
    border-top-left-radius: 1rem;
  }

  .nav-tab:last-child::before {
    border-top-right-radius: 1rem;
  }
}

.nav-tab:hover {
  background: #f8fafc;
  color: #334155;
}

.nav-tab:active {
  transform: scale(0.95);
}

.nav-tab.active {
  color: #10b981;
  font-weight: 600;
}

.nav-tab.active::before {
  transform: scaleX(1);
}

.nav-icon {
  flex-shrink: 0;
}

.nav-label {
  font-size: 0.75rem;
  font-weight: inherit;
  line-height: 1;
}

@media (max-width: 640px) {
  .bottom-nav {
    height: 3.5rem;
  }

  .nav-label {
    font-size: 0.625rem;
  }

  .nav-icon {
    width: 18px;
    height: 18px;
  }
}

@media (min-width: 768px) {
  .bottom-nav {
    max-width: 768px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 1rem 1rem 0 0;
    border-left: 1px solid #e5e7eb;
    border-right: 1px solid #e5e7eb;
  }
}
</style>
