<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSMS } from '@/composables/useSMS'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircleIcon, CheckCircle2Icon, InfoIcon } from 'lucide-vue-next'

const authStore = useAuthStore()
const { updateSMSSettings, validatePhoneNumber } = useSMS()

const isOpen = defineModel<boolean>()
const phoneNumber = ref('')
const smsEnabled = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const isPhoneNumberValid = computed(() => {
  if (!phoneNumber.value) return false
  const validation = validatePhoneNumber(phoneNumber.value)
  return validation.valid
})

const canSave = computed(() => {
  return phoneNumber.value.trim() !== '' && isPhoneNumberValid.value
})

async function handleSave() {
  if (!canSave.value) {
    errorMessage.value = 'Please enter a valid phone number with country code'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const result = await updateSMSSettings(phoneNumber.value, smsEnabled.value)

    if (result.success) {
      successMessage.value = smsEnabled.value
        ? 'SMS reminders enabled successfully!'
        : 'SMS settings saved successfully!'

      // Close dialog after 1.5 seconds
      setTimeout(() => {
        isOpen.value = false
        resetForm()
      }, 1500)
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to update SMS settings'
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel() {
  isOpen.value = false
  resetForm()
}

function resetForm() {
  phoneNumber.value = ''
  smsEnabled.value = false
  errorMessage.value = ''
  successMessage.value = ''
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>SMS Reminder Settings</DialogTitle>
        <DialogDescription>
          Get daily SMS reminders to log your expenses. Standard message rates may apply.
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <!-- Phone Number Input -->
        <div class="grid gap-2">
          <Label for="phone-number">Phone Number</Label>
          <Input
            id="phone-number"
            v-model="phoneNumber"
            type="tel"
            placeholder="+14155552671"
            :disabled="isSubmitting"
            @keyup.enter="handleSave"
          />
          <p class="text-xs text-muted-foreground">
            Include country code (e.g., +1 for US, +44 for UK)
          </p>
        </div>

        <!-- SMS Reminders Toggle -->
        <div class="flex items-center justify-between space-x-2 py-2">
          <div class="space-y-0.5">
            <Label for="sms-enabled" class="text-base">Enable SMS Reminders</Label>
            <p class="text-sm text-muted-foreground">
              Receive daily reminders if you haven't logged expenses
            </p>
          </div>
          <Switch
            id="sms-enabled"
            v-model:checked="smsEnabled"
            :disabled="isSubmitting"
          />
        </div>

        <!-- Info Alert -->
        <Alert v-if="smsEnabled && !errorMessage && !successMessage" variant="info">
          <InfoIcon class="h-4 w-4" />
          <AlertDescription>
            You'll receive a daily SMS reminder if you haven't logged any expenses for the day.
          </AlertDescription>
        </Alert>

        <!-- Success Message -->
        <Alert v-if="successMessage" variant="success">
          <CheckCircle2Icon class="h-4 w-4" />
          <AlertDescription>{{ successMessage }}</AlertDescription>
        </Alert>

        <!-- Error Message -->
        <Alert v-if="errorMessage" variant="destructive">
          <AlertCircleIcon class="h-4 w-4" />
          <AlertDescription>{{ errorMessage }}</AlertDescription>
        </Alert>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          @click="handleCancel"
          :disabled="isSubmitting"
        >
          Cancel
        </Button>
        <Button
          @click="handleSave"
          :disabled="!canSave || isSubmitting"
        >
          {{ isSubmitting ? 'Saving...' : 'Save Settings' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
