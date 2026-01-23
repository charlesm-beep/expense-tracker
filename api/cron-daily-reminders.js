import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Verify this is a cron job request (Vercel adds this header)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get all users with SMS reminders enabled
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('user_id, phone_number')
      .eq('sms_reminders_enabled', true)
      .not('phone_number', 'is', null);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    if (!users || users.length === 0) {
      return res.status(200).json({
        message: 'No users with SMS reminders enabled',
        sent: 0
      });
    }

    // Initialize Twilio client
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // For each user, check if they have logged today
    const results = [];
    const today = new Date().toISOString().split('T')[0];

    for (const user of users) {
      try {
        // Get user's current period
        const { data: periods } = await supabase
          .from('periods')
          .select('days_marked_done, end_date')
          .eq('user_id', user.user_id)
          .eq('closed', false)
          .order('start_date', { ascending: false })
          .limit(1);

        if (!periods || periods.length === 0) continue;

        const period = periods[0];
        const hasLoggedToday = period.days_marked_done?.includes(today);

        // Only send reminder if they haven't logged today
        if (!hasLoggedToday) {
          const daysLeft = Math.ceil((new Date(period.end_date) - new Date()) / (1000 * 60 * 60 * 24));
          const message = `💰 Save It! Reminder\n\nDon't forget to log your expenses today!\n\n${daysLeft} days left this week. Keep your streak going! 🔥\n\nLog now: https://save-it-eta.vercel.app`;

          await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: user.phone_number
          });

          results.push({ userId: user.user_id, status: 'sent' });
        } else {
          results.push({ userId: user.user_id, status: 'already_logged' });
        }
      } catch (error) {
        console.error(`Error sending to ${user.phone_number}:`, error);
        results.push({ userId: user.user_id, status: 'failed', error: error.message });
      }
    }

    return res.status(200).json({
      message: 'Daily reminders processed',
      total: users.length,
      results: results
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
