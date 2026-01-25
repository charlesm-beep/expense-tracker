import { useAuthStore } from '@/stores/auth'

export interface SMSSubscriptionData {
  phoneNumber: string
  enabled: boolean
}

export interface SMSSubscriptionResponse {
  success: boolean
  message: string
  data?: {
    phone_number: string
    sms_reminders_enabled: boolean
  }
}

export function useSMS() {
  const authStore = useAuthStore()

  /**
   * Validates a phone number in E.164 format
   * E.164 format: +[country code][number] (e.g., +14155552671)
   */
  function validatePhoneNumber(phoneNumber: string): { valid: boolean; error?: string } {
    if (!phoneNumber || phoneNumber.trim() === '') {
      return { valid: false, error: 'Phone number is required' }
    }

    const trimmed = phoneNumber.trim()

    // Check E.164 format: +[1-9][0-9]{1,14}
    const e164Regex = /^\+?[1-9]\d{1,14}$/
    if (!e164Regex.test(trimmed)) {
      return {
        valid: false,
        error: 'Please enter a valid phone number with country code (e.g., +14155552671)',
      }
    }

    return { valid: true }
  }

  /**
   * Formats a phone number to E.164 format by ensuring it starts with +
   */
  function formatPhoneNumber(phoneNumber: string): string {
    const trimmed = phoneNumber.trim()
    return trimmed.startsWith('+') ? trimmed : `+${trimmed}`
  }

  /**
   * Subscribe or update SMS reminder settings
   */
  async function updateSMSSettings(
    phoneNumber: string,
    enabled: boolean
  ): Promise<SMSSubscriptionResponse> {
    if (!authStore.user) {
      throw new Error('You must be signed in to update SMS settings')
    }

    // Validate phone number
    const validation = validatePhoneNumber(phoneNumber)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    const formattedPhone = formatPhoneNumber(phoneNumber)

    try {
      const response = await fetch('/api/subscribe-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          userId: authStore.user.id,
          enabled,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to update SMS settings: ${response.status}`)
      }

      const data: SMSSubscriptionResponse = await response.json()
      return data
    } catch (error: any) {
      console.error('Error updating SMS settings:', error)
      throw new Error(error.message || 'Failed to update SMS settings. Please try again.')
    }
  }

  /**
   * Disable SMS reminders (keep phone number but turn off reminders)
   */
  async function disableSMSReminders(phoneNumber: string): Promise<SMSSubscriptionResponse> {
    return updateSMSSettings(phoneNumber, false)
  }

  /**
   * Enable SMS reminders
   */
  async function enableSMSReminders(phoneNumber: string): Promise<SMSSubscriptionResponse> {
    return updateSMSSettings(phoneNumber, true)
  }

  return {
    validatePhoneNumber,
    formatPhoneNumber,
    updateSMSSettings,
    disableSMSReminders,
    enableSMSReminders,
  }
}