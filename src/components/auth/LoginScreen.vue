<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { Button } from '@/components/ui/button'
import { Chrome, Mountain } from 'lucide-vue-next'

const { signInWithGoogle } = useAuth()

// Generate random budget preview numbers
const randomBudget = computed(() => {
  const budget = Math.floor(Math.random() * (2200 - 800) + 800) // $800-$2200
  return budget.toFixed(2)
})

const randomRemaining = computed(() => {
  const budget = parseFloat(randomBudget.value)
  const percentage = Math.random() * (0.9 - 0.4) + 0.4 // 40-90% remaining
  const remaining = budget * percentage
  return remaining.toFixed(2)
})

const remainingPercentage = computed(() => {
  const remaining = parseFloat(randomRemaining.value)
  const budget = parseFloat(randomBudget.value)
  return Math.round((remaining / budget) * 100)
})

const handleSignIn = async () => {
  await signInWithGoogle()
}
</script>

<template>
  <div class="login-screen">
    <!-- Footer Credits -->
    <div class="footer-credits">
      <div class="credit-item">
        <Mountain :size="16" />
        <span>Built in Denver</span>
      </div>
      <div class="credit-divider">•</div>
      <a href="https://www.linkedin.com/in/charlesnmichael/" target="_blank" rel="noopener noreferrer" class="credit-link">
        Charles Michael
      </a>
    </div>

    <div class="login-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <h1 class="hero-title">Stop overspending.<br>Start tracking.</h1>
        <p class="hero-subtitle">
          Weekly budgets that actually work—for people who've tried everything else.
        </p>
      </div>

      <!-- Preview Section -->
      <div class="preview-section">
        <div class="preview-card">
          <div class="preview-header">
            <div class="preview-label">Remaining This Week</div>
            <div class="preview-amount">${{ randomRemaining }}</div>
          </div>
          <div class="preview-bar">
            <div class="preview-bar-fill" :style="{ width: `${remainingPercentage}%` }"></div>
          </div>
          <div class="preview-footer">Started with ${{ randomBudget }}</div>
        </div>
        <p class="preview-caption">Watch your budget disappear like cash from your wallet</p>
      </div>

      <!-- CTA Section -->
      <div class="cta-section">
        <Button
          size="lg"
          class="cta-button"
          @click="handleSignIn"
        >
          <Chrome :size="20" class="mr-2" />
          Start Your First Week Free
        </Button>
        <Button
          size="lg"
          variant="outline"
          class="login-button"
          @click="handleSignIn"
        >
          <Chrome :size="20" class="mr-2" />
          Sign In with Google
        </Button>
        <p class="social-proof">Join 1,000+ people building better money habits</p>
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
  background: #ffffff;
  padding: 2rem 1.5rem;
  position: relative;
}

/* Footer Credits */
.footer-credits {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
}

.credit-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.credit-item svg {
  color: #3b82f6;
}

.credit-divider {
  color: #cbd5e1;
}

.credit-link {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s ease;
}

.credit-link:hover {
  color: #3b82f6;
  text-decoration: underline;
}

.login-content {
  max-width: 560px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

/* Hero Section */
.hero-section {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.03em;
  margin: 0;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: #475569;
  font-weight: 400;
  margin: 0;
  line-height: 1.6;
  max-width: 480px;
}

.hero-credibility {
  font-size: 0.875rem;
  color: #94a3b8;
  font-style: italic;
  margin: 0;
}

/* Preview Section */
.preview-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.preview-card {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.preview-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.preview-label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.preview-amount {
  font-size: 2.5rem;
  font-weight: 700;
  color: #16a34a;
}

.preview-bar {
  height: 12px;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.preview-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #16a34a 0%, #15803d 100%);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.preview-footer {
  text-align: center;
  font-size: 0.875rem;
  color: #64748b;
}

.preview-caption {
  font-size: 0.875rem;
  color: #94a3b8;
  text-align: center;
  font-style: italic;
  margin: 0;
}

/* CTA Section */
.cta-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.cta-button {
  width: 100%;
  max-width: 360px;
  background: #0f172a;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  height: 3.5rem;
  transition: all 0.2s ease;
  animation: subtle-pulse 3s ease-in-out infinite;
}

.cta-button:hover {
  background: #1e293b;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.25);
  animation: none;
}

.cta-button:active {
  transform: translateY(0) scale(0.98);
}

@keyframes subtle-pulse {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.15);
  }
  50% {
    box-shadow: 0 4px 20px rgba(15, 23, 42, 0.25);
  }
}

.login-button {
  width: 100%;
  max-width: 360px;
  background: white;
  color: #0f172a;
  border: 2px solid #e2e8f0;
  font-weight: 600;
  font-size: 1rem;
  height: 3.5rem;
  transition: all 0.2s ease;
}

.login-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-button:active {
  transform: translateY(0) scale(0.98);
}

.social-proof {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .login-screen {
    padding: 1.5rem 1rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .preview-amount {
    font-size: 2rem;
  }

  .login-content {
    gap: 2rem;
    padding-bottom: 4rem;
  }

  .footer-credits {
    position: fixed;
    bottom: 0.75rem;
    right: 0.75rem;
    font-size: 0.75rem;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
    line-height: 1.4;
  }

  .credit-divider {
    display: none;
  }
}
</style>
