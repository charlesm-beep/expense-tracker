# Save It! - Weekly Budget Tracker

A modern Vue 3 application for tracking weekly budgets with daily logging, streaks, and cloud sync.

## Features

- 💰 **Weekly Budgets**: Set and track weekly spending budgets
- 📅 **Daily Logging**: Mark days as complete when you're done logging expenses
- 🔥 **Streaks & Milestones**: Build momentum with streak tracking and achievement badges
- 📊 **Historical Data**: Review past periods and analyze spending patterns
- ☁️ **Cloud Sync**: Automatic sync to Supabase with offline fallback
- 📱 **Mobile-First**: Responsive design optimized for mobile devices
- 🔐 **Google OAuth**: Secure authentication with Google Sign-In

## Tech Stack

- **Frontend**: Vue 3, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn-vue
- **State Management**: Pinia
- **Backend**: Supabase (PostgreSQL, Auth)
- **Deployment**: Vercel
- **SMS Reminders**: Twilio (optional)

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**:
```bash
git clone <your-repo-url>
cd ExpenseApp
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

4. **Start the development server**:
```bash
npm run dev
```

5. **Open your browser**:
Navigate to `http://localhost:5173`

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Format code
npm run format
```

## Project Structure

```
src/
├── main.ts              # Application entry point
├── App.vue              # Root component
├── components/
│   ├── ui/             # Shadcn-vue UI components
│   ├── layout/         # Layout components (Header, Nav, etc.)
│   ├── auth/           # Authentication components
│   ├── budget/         # Budget management components
│   ├── expenses/       # Expense tracking components
│   ├── daily-logging/  # Daily completion tracker
│   ├── onboarding/     # First-time user onboarding
│   ├── history/        # Historical data views
│   └── streaks/        # Streak and milestone components
├── views/              # Page-level components
├── composables/        # Reusable composition functions
├── stores/             # Pinia state management
├── lib/                # Utilities and constants
└── types/              # TypeScript type definitions
```

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Add environment variables** in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Deploy**: Vercel will automatically build and deploy

Build settings:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Manual Deployment

```bash
# Build
npm run build

# Deploy dist/ folder to your hosting provider
```

## Supabase Setup

### Database Schema

The app requires two tables:

1. **periods**:
   - `id` (uuid, primary key)
   - `user_id` (uuid, foreign key)
   - `start_date` (timestamp)
   - `end_date` (timestamp)
   - `budget_cents` (integer)
   - `closed` (boolean)
   - `days_marked_done` (text array)

2. **expenses**:
   - `id` (uuid, primary key)
   - `period_id` (uuid, foreign key)
   - `user_id` (uuid, foreign key)
   - `amount_cents` (integer)
   - `note` (text)
   - `timestamp` (timestamp)

### Authentication

Enable Google OAuth in Supabase:
1. Go to Authentication → Providers
2. Enable Google
3. Add authorized redirect URLs

## Features

### Budget Management
- Create weekly budget periods
- Update budgets mid-period
- Pro-rated budgets for partial weeks
- Automatic period rollover

### Expense Tracking
- Add expenses with categories
- View expense history
- Delete expenses
- Real-time budget calculations

### Daily Logging
- 7-day week view with completion circles
- Mark days as complete
- Visual progress tracking

### Streaks & Goals
- Track current and longest streaks
- Milestone achievements (9 levels)
- Progress visualization

### History
- View all past periods
- Success/failure indicators
- Total spending and savings
- Average spending per week

## Browser Support

- Chrome/Edge (latest)
- Safari (latest)
- Firefox (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

Production build:
- JavaScript: 441KB (132KB gzipped)
- CSS: 44KB (8.74KB gzipped)
- Total: ~486KB (~141KB gzipped)

## Contributing

This is a personal project, but suggestions are welcome! Feel free to open an issue.

## License

Private - All Rights Reserved

## Acknowledgments

- Built with [Vue 3](https://vuejs.org/)
- UI components from [Shadcn-vue](https://www.shadcn-vue.com/)
- Icons from [Lucide](https://lucide.dev/)
- Backend powered by [Supabase](https://supabase.com/)

---

**Migration Complete**: This app was successfully migrated from a single 3,457-line HTML file to a modern Vue 3 architecture. See `MIGRATION_COMPLETE.md` for details.
