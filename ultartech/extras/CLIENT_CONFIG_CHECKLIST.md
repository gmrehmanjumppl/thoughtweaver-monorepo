# Quick Reference: Client Configuration Checklist

**For**: Client deployment configuration  
**See**: [CLIENT_DEPLOYMENT_CONFIG.md](./CLIENT_DEPLOYMENT_CONFIG.md) for detailed guide

---

## 🔑 Required Client Configurations

### 1. Supabase ⚠️
- [ ] Project URL: `https://[CLIENT-PROJECT].supabase.co`
- [ ] Anonymous Key (public)
- [ ] Service Role Key (private - server-side only)
- [ ] Database URL with password
- [ ] Run database migrations
- [ ] Configure OAuth redirect URLs

### 2. OpenAI API Key ⚠️
- [ ] Replace with client's OpenAI API key
- [ ] Update in root `.env` and `apps/api/.env`

### 3. Google OAuth ⚠️
- [ ] Create Google Cloud project for client
- [ ] Enable Google+ API
- [ ] Create OAuth credentials
- [ ] Add to Supabase Dashboard
- [ ] Configure redirect URLs

### 4. Application URLs ⚠️
- [ ] Production app URL: `https://[CLIENT-DOMAIN.com]`
- [ ] Production API URL: `https://api.[CLIENT-DOMAIN.com]`
- [ ] Update in Supabase redirect URLs

### 5. JWT Secret ⚠️
- [ ] Generate new secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Update in root `.env` and `apps/api/.env`

### 6. Stripe (If Using) ⚠️
- [ ] Secret key
- [ ] Publishable key
- [ ] Webhook secret

---

## 📋 Files to Update

- [ ] Root `.env`
- [ ] `apps/web/.env.local`
- [ ] `apps/api/.env`
- [ ] Supabase Dashboard settings
- [ ] Google Cloud Console settings

---

## ⚠️ Security Reminders

- Never commit `.env` files to Git
- Never expose service role keys to client-side
- Use HTTPS in production
- Generate strong JWT secrets
- Enable RLS policies in Supabase

---

**Full Guide**: See [CLIENT_DEPLOYMENT_CONFIG.md](./CLIENT_DEPLOYMENT_CONFIG.md)

