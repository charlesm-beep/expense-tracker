# Security Documentation

## Overview
This document outlines the security measures implemented in Save It! and recommendations for maintaining a secure application.

## ✅ Implemented Security Measures

### 1. Authentication & Authorization
- **Supabase Authentication** with Google OAuth
- **Row Level Security (RLS)** on all database tables
- User data isolation via `auth.uid() = user_id` policies
- Automatic session management via Supabase

### 2. Data Protection
- **Input Sanitization**: All user-generated text (expense notes) is sanitized to prevent XSS
- **Validation**: All numeric inputs validated (min/max, no negatives)
- **Output Escaping**: Vue automatically escapes all template output
- **No v-html usage**: Prevents HTML injection

### 3. Database Security
- **Parameterized Queries**: All queries use Supabase SDK (prevents SQL injection)
- **Foreign Keys**: Cascade deletes ensure data integrity
- **RLS Policies**: Enforced at database level for defense in depth

### 4. Client-Side Security
- **Content Security Policy (CSP)**: Restricts resource loading
- **X-Frame-Options**: Prevents clickjacking (DENY)
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Referrer Policy**: Limits referrer information leakage
- **HTTPS Check**: Warns if running over HTTP in production
- **Error Sanitization**: Prevents information leakage via error messages

### 5. Code Quality
- **No eval()**: No dynamic code execution
- **Safe JSON parsing**: Only parsing trusted localStorage data
- **Input validation**: All user inputs validated before processing
- **Delete confirmation**: Prevents accidental data loss

### 6. Infrastructure
- **Environment Variables**: All secrets in .env (gitignored)
- **No Hardcoded Secrets**: All credentials from environment
- **CDN Security**: crossorigin attribute on external scripts

## ⚠️ Known Limitations & Recommendations

### 1. Subresource Integrity (SRI)
**Status**: Partially implemented (crossorigin added)

**Recommendation**: Add SRI hashes to CDN script tags:
```html
<script
  src="https://unpkg.com/vue@3.3.4/dist/vue.global.js"
  integrity="sha384-[HASH]"
  crossorigin="anonymous">
</script>
```

To generate hashes:
```bash
curl https://unpkg.com/vue@3.3.4/dist/vue.global.js | openssl dgst -sha384 -binary | openssl base64 -A
```

### 2. Rate Limiting
**Status**: Relies on Supabase limits

**Recommendation**:
- Configure Supabase project rate limits appropriately
- Add client-side debouncing for expensive operations
- Monitor API usage in Supabase dashboard

### 3. localStorage Encryption
**Status**: Not implemented (optional)

**Note**: Budget data stored in plain text in browser localStorage

**Recommendation** (optional):
- For highly sensitive deployments, encrypt localStorage data
- Use Web Crypto API for encryption
- Trade-off: Adds complexity, impacts performance

### 4. HTTPS Enforcement
**Status**: Warning only

**Deployment Requirements**:
- **MUST deploy with HTTPS in production**
- Use services like Netlify, Vercel, or Cloudflare Pages (auto HTTPS)
- Never expose Supabase credentials over HTTP

### 5. Content Security Policy Tuning
**Current CSP**: Allows `unsafe-inline` and `unsafe-eval` for Vue

**Future Improvement**:
- Use Vue build without `unsafe-eval` for stricter CSP
- Move inline scripts to external files
- Use nonces for inline scripts

## 🔐 Security Best Practices for Deployment

### Production Checklist

- [ ] Deploy over HTTPS (required)
- [ ] Set up Supabase project rate limiting
- [ ] Configure Supabase email templates (prevent phishing)
- [ ] Enable Supabase Email Confirmations for new users
- [ ] Set up proper CORS on Supabase
- [ ] Monitor Supabase logs for suspicious activity
- [ ] Keep dependencies updated (npm audit)
- [ ] Enable GitHub Dependabot for security updates
- [ ] Set strong Supabase project password
- [ ] Enable 2FA on Supabase account
- [ ] Review Supabase RLS policies regularly
- [ ] Backup database regularly (Supabase automatic backups)

### Environment Variables

Required `.env` file:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Important**:
- Never commit `.env` to git (already in .gitignore)
- The anon key is safe to expose client-side
- Service role key should NEVER be used client-side

## 🛡️ Defense in Depth

This app implements multiple layers of security:

1. **Client-side validation** - First line of defense
2. **Input sanitization** - Prevents XSS
3. **CSP headers** - Blocks unauthorized resources
4. **Supabase SDK** - Prevents SQL injection
5. **RLS policies** - Database-level authorization
6. **Authentication** - User verification via Google OAuth

Even if one layer fails, others provide protection.

## 📊 Security Monitoring

### What to Monitor

1. **Supabase Dashboard**:
   - API usage patterns
   - Failed authentication attempts
   - Unusual query patterns

2. **Browser Console** (Development):
   - CSP violations
   - HTTPS warnings
   - Authentication errors

3. **Application Logs**:
   - Error rates
   - Failed operations
   - Sync errors

### Incident Response

If you suspect a security issue:

1. **Immediate Actions**:
   - Rotate Supabase anon key if compromised
   - Review RLS policies
   - Check recent database changes
   - Review user activity logs

2. **Investigation**:
   - Check Supabase logs
   - Review recent code changes
   - Test RLS policies
   - Verify authentication flow

3. **Remediation**:
   - Fix vulnerability
   - Update dependencies
   - Deploy patch
   - Notify affected users (if applicable)

## 🔄 Regular Security Maintenance

### Weekly
- [ ] Check for dependency updates
- [ ] Review Supabase logs

### Monthly
- [ ] Run `npm audit`
- [ ] Review RLS policies
- [ ] Test authentication flow
- [ ] Verify backup integrity

### Quarterly
- [ ] Full security audit
- [ ] Update dependencies
- [ ] Review access controls
- [ ] Test incident response plan

## 📞 Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** open a public GitHub issue
2. Email security concerns privately
3. Include details: steps to reproduce, impact, suggestions
4. Allow reasonable time for fix before disclosure

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [Vue Security Best Practices](https://vuejs.org/guide/best-practices/security.html)
- [CSP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

**Last Updated**: 2026-01-20
**Next Review**: 2026-04-20
