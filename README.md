# Save It!

A simple weekly expense tracker with cloud sync, Google OAuth authentication, and gamification features to help you build better spending habits.

## Features

- **Weekly Budget Periods**: Create custom weekly budget periods with automatic pro-rating for partial weeks
- **Expense Tracking**: Add and delete expenses with notes and timestamps
- **Real-Time Budget Monitoring**: Color-coded progress bar (green/orange/red) based on remaining budget
- **Daily Logging Tracker**: Check off days when you've logged all your expenses to build consistency
- **Budget Streaks**: Track how many consecutive weeks you've stayed under budget
- **Onboarding Flow**: First-time user experience with budget setup and educational content
- **History & Archive**: View all past budget periods with complete expense records
- **Google Authentication**: Sign in with Google to sync your data across devices
- **Offline Support**: Works without authentication using local storage
- **Responsive Design**: Mobile-friendly interface
- **Auto-Migration**: Automatically converts old 14-day periods to new 7-day weekly periods

## Tech Stack

- **Frontend**: Vue 3 (CDN)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Dev Server**: Vite
- **Styling**: Vanilla CSS

## Prerequisites

- Node.js and npm installed
- A Supabase account and project

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)

2. Run the database migration:
   - Go to the SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase_migrations.sql`
   - Paste and run the script

   Or manually create the following database tables:

### `periods` table
```sql
CREATE TABLE periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  budget_cents INTEGER NOT NULL,
  total_spent_cents INTEGER DEFAULT 0,
  closed BOOLEAN DEFAULT false,
  days_marked_done JSONB DEFAULT '[]'::jsonb,
  success BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE periods ENABLE ROW LEVEL SECURITY;

-- Allow users to only see their own periods
CREATE POLICY "Users can view own periods" ON periods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own periods" ON periods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own periods" ON periods
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own periods" ON periods
  FOR DELETE USING (auth.uid() = user_id);
```

### `expenses` table
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id UUID REFERENCES periods(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  note TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Allow users to only see their own expenses
CREATE POLICY "Users can view own expenses" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses" ON expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses" ON expenses
  FOR DELETE USING (auth.uid() = user_id);
```

### `user_profiles` table
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own profile
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;
```

3. Enable Google OAuth:
   - Go to Authentication > Providers in your Supabase dashboard
   - Enable Google provider
   - Configure OAuth credentials from Google Cloud Console
   - Add your site URL to authorized redirect URIs

4. Get your Supabase credentials:
   - Go to Settings > API
   - Copy your project URL and anon/public key

## Local Development Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ExpenseApp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to the URL shown (typically `http://localhost:5173`)

## Usage

### Without Authentication (Local-Only Mode)
- Simply start using the app without signing in
- All data is stored in your browser's localStorage
- Data will not sync across devices

### With Google Authentication
- Click "Sign in with Google"
- Authorize the application
- Your data will automatically sync to Supabase
- Access your expenses from any device

### Managing Budget Periods
1. Complete the onboarding flow (first-time users only)
2. Enter your weekly budget amount
3. Click "Create New Period" to start a new week
4. Add expenses as you spend throughout the week
5. Monitor your remaining budget and progress in real-time
6. Mark days as "done" when you've logged all expenses for that day
7. Periods automatically roll over on Sunday nights (or manually create a new period)
8. Build streaks by staying under budget for consecutive weeks!

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Project Structure

```
ExpenseApp/
├── index.html          # Main application file (HTML + CSS + Vue.js)
├── package.json        # Dependencies and scripts
├── .env               # Environment variables (not committed)
└── .gitignore         # Git ignore rules
```

## Security Notes

- Supabase anonymous key is safe to expose in client-side code
- Row Level Security (RLS) policies protect user data at the database level
- All user data is isolated by user_id
- Google OAuth handles authentication securely

## License

MIT
