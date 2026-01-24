<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PiggyBank, TrendingDown, Target, BarChart3, Chrome } from 'lucide-vue-next'

const { signInWithGoogle } = useAuth()

const features = [
  {
    icon: TrendingDown,
    title: 'Weekly Budgets',
    description: 'Set a budget that resets every Monday',
  },
  {
    icon: Target,
    title: 'Daily Logging',
    description: 'Track your expenses day by day',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'See your spending patterns over time',
  },
]

const handleSignIn = async () => {
  await signInWithGoogle()
}
</script>

<template>
  <div class="login-screen">
    <div class="login-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="welcome-icon">
          <PiggyBank :size="64" class="piggy-icon" />
        </div>
        <h1 class="welcome-title">Save It!</h1>
        <p class="welcome-tagline">
          Weekly budgets that actually stick
        </p>
      </div>

      <!-- Features Section -->
      <div class="features-grid">
        <Badge
          v-for="(feature, index) in features"
          :key="index"
          variant="secondary"
          class="feature-badge"
        >
          <component :is="feature.icon" :size="20" class="feature-icon" />
          <div class="feature-content">
            <span class="feature-title">{{ feature.title }}</span>
            <span class="feature-description">{{ feature.description }}</span>
          </div>
        </Badge>
      </div>

      <!-- Login Card -->
      <Card class="login-card">
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
          <CardDescription>
            Sign in with your Google account to start tracking your weekly budget
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            size="lg"
            class="sign-in-button"
            @click="handleSignIn"
          >
            <Chrome :size="20" class="mr-2" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>

      <!-- Info Section -->
      <div class="info-section">
        <h3 class="info-title">How it works</h3>
        <ul class="info-list">
          <li>Set your weekly budget amount</li>
          <li>Log expenses throughout the week</li>
          <li>Stay under budget to build your streak</li>
          <li>Your data syncs across all your devices</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%);
  padding: 1.5rem;
}

.login-content {
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.hero-section {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.welcome-icon {
  width: 6rem;
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.piggy-icon {
  color: white;
}

.welcome-title {
  font-size: 3rem;
  font-weight: 800;
  color: #334155;
  letter-spacing: -0.02em;
  margin: 0;
}

.welcome-tagline {
  font-size: 1.25rem;
  color: #64748b;
  font-weight: 500;
  margin: 0;
}

.features-grid {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-badge {
  width: 100%;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  cursor: default;
  height: auto;
  justify-content: flex-start;
}

.feature-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  color: #10b981;
  flex-shrink: 0;
}

.feature-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  text-align: left;
}

.feature-title {
  font-weight: 600;
  color: #334155;
  font-size: 0.875rem;
}

.feature-description {
  font-weight: 400;
  color: #64748b;
  font-size: 0.75rem;
}

.login-card {
  width: 100%;
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.sign-in-button {
  width: 100%;
  background: linear-gradient(135deg, #334155 0%, #475569 100%);
  color: white;
  font-weight: 600;
  transition: all 0.2s ease;
}

.sign-in-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(51, 65, 85, 0.3);
}

.info-section {
  width: 100%;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.info-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 1rem;
}

.info-list {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-list li {
  font-size: 0.875rem;
  color: #64748b;
  padding-left: 1.75rem;
  position: relative;
}

.info-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: 700;
  font-size: 1rem;
}

@media (max-width: 640px) {
  .welcome-title {
    font-size: 2.25rem;
  }

  .welcome-tagline {
    font-size: 1rem;
  }

  .welcome-icon {
    width: 5rem;
    height: 5rem;
  }

  .piggy-icon {
    width: 48px;
    height: 48px;
  }
}

@media (min-width: 768px) {
  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
