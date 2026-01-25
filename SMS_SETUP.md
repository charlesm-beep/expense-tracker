# SMS Reminders Setup Checklist

## 1. Get Twilio Account (5 min)

- [ ] Sign up: https://www.twilio.com/try-twilio
- [ ] Verify your phone number
- [ ] Get a Twilio phone number (free with trial)
- [ ] Copy **Account SID** (starts with AC...)
- [ ] Copy **Auth Token** (click eye icon to reveal)
- [ ] Copy **Phone Number** (format: +12345678900)

## 2. Add Environment Variables

### Local (.env file)
Add these lines to `.env`:
```bash
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
CRON_SECRET=your-random-secret-string-here
```

### Vercel Dashboard
- [ ] Go to: https://vercel.com/charles-projects-2a7a5b08/save-it/settings/environment-variables
- [ ] Add `TWILIO_ACCOUNT_SID`
- [ ] Add `TWILIO_AUTH_TOKEN`
- [ ] Add `TWILIO_PHONE_NUMBER`
- [ ] Add `CRON_SECRET` (same value as local)

## 3. Run Database Migration

- [ ] Go to: https://supabase.com/dashboard/project/usilhyecigcpuzsoavtb/sql
- [ ] Copy contents of `supabase_sms_migration.sql`
- [ ] Paste and run in SQL Editor
- [ ] Verify columns added: `phone_number`, `sms_reminders_enabled`

## 4. Deploy to Vercel

```bash
git add .
git commit -m "Add SMS reminders with Twilio"
git push origin feature/sms-reminders
vercel --prod
```

## 5. Test It

### Test Subscribe Endpoint
```bash
curl -X POST https://save-it-eta.vercel.app/api/subscribe-sms \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+12345678900",
    "userId": "your-user-id",
    "enabled": true
  }'
```

### Test Send SMS
```bash
curl -X POST https://save-it-eta.vercel.app/api/send-sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+12345678900",
    "message": "Test from Save It!"
  }'
```

### Test Cron (Manual Trigger)
```bash
curl -X GET https://save-it-eta.vercel.app/api/cron-daily-reminders \
  -H "Authorization: Bearer your-cron-secret"
```

## 6. Add UI (Next Step)

After backend works, add frontend UI:
- Settings page to enter phone number
- Toggle to enable/disable SMS
- Phone number validation
- Success/error messages

## Troubleshooting

### "Unauthorized" error
- Check CRON_SECRET matches in .env and Vercel

### "Invalid phone number"
- Must be E.164 format: +12345678900
- Include country code (+1 for USA)

### SMS not sending
- Check Twilio dashboard for error logs
- Verify phone number is verified (trial accounts have restrictions)
- Check Twilio balance

### Cron not running
- Vercel Pro plan required for cron jobs
- Alternative: Use external cron service (cron-job.org) to hit your API

## Cost Estimate

With Twilio:
- Trial: $15 credit (~150 SMS)
- After trial: $0.0079 per SMS
- 1 user × 30 days = $0.24/month
- 10 users × 30 days = $2.37/month

## Next Steps

1. Complete setup checklist above
2. Test all endpoints
3. Add frontend UI for phone number entry
4. Deploy and test with real users
