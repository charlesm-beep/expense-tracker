-- Migration: Phase 2 - Recurring Income & Expenses System
-- This migration creates tables for recurring items and income entries

-- ============================================
-- 1. Create income_entries table
-- ============================================

CREATE TABLE IF NOT EXISTS income_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id UUID NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount_cents INTEGER NOT NULL,
    source TEXT NOT NULL,
    income_type TEXT NOT NULL,  -- 'salary', 'bonus', 'other'
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for income_entries
CREATE INDEX IF NOT EXISTS idx_income_entries_period_id ON income_entries(period_id);
CREATE INDEX IF NOT EXISTS idx_income_entries_user_id ON income_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_income_entries_timestamp ON income_entries(timestamp);

-- Enable Row Level Security for income_entries
ALTER TABLE income_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own income entries" ON income_entries;
DROP POLICY IF EXISTS "Users can insert their own income entries" ON income_entries;
DROP POLICY IF EXISTS "Users can update their own income entries" ON income_entries;
DROP POLICY IF EXISTS "Users can delete their own income entries" ON income_entries;

-- Create RLS policies for income_entries
CREATE POLICY "Users can view their own income entries"
    ON income_entries
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own income entries"
    ON income_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own income entries"
    ON income_entries
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own income entries"
    ON income_entries
    FOR DELETE
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON income_entries TO authenticated;

-- ============================================
-- 2. Create recurring_items table
-- ============================================

CREATE TABLE IF NOT EXISTS recurring_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL,  -- 'income' or 'expense'
    category_name TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    description TEXT NOT NULL,
    frequency TEXT NOT NULL,  -- 'weekly', 'biweekly', 'monthly'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for recurring_items
CREATE INDEX IF NOT EXISTS idx_recurring_items_user_id ON recurring_items(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_items_type ON recurring_items(item_type);
CREATE INDEX IF NOT EXISTS idx_recurring_items_active ON recurring_items(is_active);

-- Enable Row Level Security for recurring_items
ALTER TABLE recurring_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own recurring items" ON recurring_items;
DROP POLICY IF EXISTS "Users can insert their own recurring items" ON recurring_items;
DROP POLICY IF EXISTS "Users can update their own recurring items" ON recurring_items;
DROP POLICY IF EXISTS "Users can delete their own recurring items" ON recurring_items;

-- Create RLS policies for recurring_items
CREATE POLICY "Users can view their own recurring items"
    ON recurring_items
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recurring items"
    ON recurring_items
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recurring items"
    ON recurring_items
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recurring items"
    ON recurring_items
    FOR DELETE
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON recurring_items TO authenticated;

-- ============================================
-- 3. Add is_recurring flag to expenses
-- ============================================

-- Add is_recurring column to expenses table (to distinguish user-added vs auto-recurring)
ALTER TABLE expenses
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE;

-- Create index for filtering recurring expenses
CREATE INDEX IF NOT EXISTS idx_expenses_is_recurring ON expenses(is_recurring);

-- Comment on column for documentation
COMMENT ON COLUMN expenses.is_recurring IS 'True if expense was auto-created from a recurring item, false if user-added manually.';

-- ============================================
-- 4. Add computed fields to periods for caching
-- ============================================

ALTER TABLE periods
ADD COLUMN IF NOT EXISTS total_income_cents INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS net_savings_cents INTEGER DEFAULT 0;

-- Comments on columns
COMMENT ON COLUMN periods.total_income_cents IS 'Cached sum of income entries for this period. Computed client-side.';
COMMENT ON COLUMN periods.net_savings_cents IS 'Cached net savings (income - expenses) for this period. Computed client-side.';
