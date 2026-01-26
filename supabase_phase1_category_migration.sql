-- Migration: Phase 1 - Add Category Storage to Expenses
-- This migration adds a category column to the expenses table to store expense categories

-- Add category column to expenses table (nullable for backward compatibility)
ALTER TABLE expenses
ADD COLUMN category TEXT;

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- Comment on column for documentation
COMMENT ON COLUMN expenses.category IS 'Category of the expense (e.g., Groceries, Dining Out, Transportation). Nullable for backward compatibility with existing expenses.';
