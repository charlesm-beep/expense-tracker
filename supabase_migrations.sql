-- Migration: Update database schema for Save It! app
-- Run this in your Supabase SQL Editor
-- This script is idempotent and safe to run multiple times

-- ============================================
-- 1. Update periods table with missing columns
-- ============================================

-- Add days_marked_done column for daily tracking feature
ALTER TABLE periods ADD COLUMN IF NOT EXISTS days_marked_done JSONB DEFAULT '[]'::jsonb;

-- Add success column for gamification/streak tracking
ALTER TABLE periods ADD COLUMN IF NOT EXISTS success BOOLEAN;

-- Ensure total_spent_cents exists (some installations may already have it)
ALTER TABLE periods ADD COLUMN IF NOT EXISTS total_spent_cents INTEGER;

-- Backfill days_marked_done for existing periods
UPDATE periods
SET days_marked_done = '[]'::jsonb
WHERE days_marked_done IS NULL;

-- Backfill success for existing closed periods
UPDATE periods
SET success = (budget_cents - COALESCE(total_spent_cents, 0) >= 0)
WHERE closed = true AND success IS NULL;

-- ============================================
-- 2. Create user_profiles table for onboarding
-- ============================================

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to make script idempotent)
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
    ON user_profiles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;
