-- Add SMS reminder fields to user_profiles table

-- Add phone_number column
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Add SMS reminders enabled flag
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS sms_reminders_enabled BOOLEAN DEFAULT false;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_sms_enabled
ON user_profiles(sms_reminders_enabled)
WHERE sms_reminders_enabled = true;

-- Add comment for documentation
COMMENT ON COLUMN user_profiles.phone_number IS 'User phone number in E.164 format (+12345678900)';
COMMENT ON COLUMN user_profiles.sms_reminders_enabled IS 'Whether user wants daily SMS reminders';
