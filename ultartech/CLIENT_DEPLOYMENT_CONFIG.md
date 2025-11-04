# Client Deployment Configuration Guide

**Purpose**: This document lists all configurations that need to be updated when deploying for a client or moving to production.

**Location**: All configurations are in `.env` files and Supabase Dashboard settings.

---

## 🔑 Required Client Configurations

### 1. Supabase Configuration

#### Supabase Project URL
- **Current**: `https://eisbyyememqqtuvmsagi.supabase.co`
- **Client**: Replace with client's Supabase project URL
- **Location**: 
  - Root `.env`: `NEXT_PUBLIC_SUPABASE_URL`
  - `apps/web/.env.local`: `VITE_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`

#### Supabase Anonymous Key (Public Key)
- **Current**: Development key (in `.env` files)
- **Client**: Replace with client's Supabase anon key
- **Location**:
  - Root `.env`: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `apps/web/.env.local`: `VITE_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Where to get**: Supabase Dashboard → Settings → API → `anon` `public` key

#### Supabase Service Role Key (Private Key)
- **Current**: Development service role key
- **Client**: Replace with client's Supabase service role key
- **Location**:
  - Root `.env`: `SUPABASE_SERVICE_ROLE_KEY`
  - `apps/api/.env`: `SUPABASE_SERVICE_ROLE_KEY`
- **⚠️ Important**: This is a secret key - never expose to client-side code
- **Where to get**: Supabase Dashboard → Settings → API → `service_role` `secret` key

#### Database URL
- **Current**: Development database URL with placeholder password
- **Client**: Replace with client's database connection string
- **Location**:
  - Root `.env`: `DATABASE_URL`
  - `apps/api/.env`: `DATABASE_URL`
- **Format**: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
- **Where to get**: Supabase Dashboard → Settings → Database → Connection string

---

### 2. OpenAI API Key

#### OpenAI API Key
- **Current**: Development/test key
- **Client**: Replace with client's OpenAI API key
- **Location**:
  - Root `.env`: `OPENAI_API_KEY`
  - `apps/api/.env`: `OPENAI_API_KEY`
- **Format**: `sk-proj-...` or `sk-...`
- **Where to get**: https://platform.openai.com/api-keys

#### Additional LLM API Keys (Optional)
If client uses other LLM providers:

**Anthropic API Key**:
- Root `.env`: `ANTHROPIC_API_KEY`
- Format: `sk-ant-...`
- Get from: https://console.anthropic.com/

**Google AI API Key**:
- Root `.env`: `GOOGLE_AI_API_KEY`
- Get from: https://makersuite.google.com/app/apikey

**Grok API Key**:
- Root `.env`: `GROK_API_KEY`
- Get from: https://x.ai/api (when available)

---

### 3. Google OAuth Configuration

#### Google Cloud Console Setup
1. **Create/Use Client's Google Cloud Project**:
   - Go to: https://console.cloud.google.com/
   - Create new project or use existing client project
   - Project name: Use client's project name

2. **Enable Google+ API**:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click **Enable**

3. **Create OAuth Credentials**:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: "Thoughtweaver [Client Name]"
   - **Authorized redirect URIs**:
     ```
     https://[CLIENT-SUPABASE-PROJECT].supabase.co/auth/v1/callback
     ```
   - Click **Create**
   - **Copy Client ID and Client Secret** (you'll need these)

4. **Add Credentials to Supabase**:
   - Go to Supabase Dashboard → **Authentication** → **Providers** → **Google**
   - Enable Google provider
   - Paste **Client ID** and **Client Secret**
   - Click **Save**

#### Supabase Redirect URLs
- Go to Supabase Dashboard → **Authentication** → **URL Configuration**
- **Site URL**: `https://[CLIENT-DOMAIN.com]` (production domain)
- **Redirect URLs**:
  ```
  https://[CLIENT-DOMAIN.com]
  https://[CLIENT-DOMAIN.com]/**
  http://localhost:3000  (for local development)
  ```

---

### 4. Application URLs

#### App URL (Production)
- **Current**: `http://localhost:3000`
- **Client**: Replace with client's production domain
- **Location**:
  - Root `.env`: `NEXT_PUBLIC_APP_URL`
  - `apps/web/.env.local`: `VITE_APP_URL` or `NEXT_PUBLIC_APP_URL`
- **Example**: `https://app.clientname.com`

#### API URL (Production)
- **Current**: `http://localhost:4000`
- **Client**: Replace with client's API domain
- **Location**:
  - Root `.env`: `API_URL`
  - `apps/web/.env.local`: `VITE_API_URL` or `API_URL`
- **Example**: `https://api.clientname.com`

---

### 5. JWT Secret

#### JWT Secret Key
- **Current**: Placeholder or development secret
- **Client**: Generate new secure random secret
- **Location**:
  - Root `.env`: `JWT_SECRET`
  - `apps/api/.env`: `JWT_SECRET`
- **Generate new secret**:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **⚠️ Important**: Use a strong, random secret (32+ characters)

---

### 6. Stripe Configuration (If Using Billing)

#### Stripe Secret Key
- **Current**: Test key (`sk_test_...`)
- **Client**: Replace with client's Stripe secret key
- **Location**:
  - Root `.env`: `STRIPE_SECRET_KEY`
  - `apps/api/.env`: `STRIPE_SECRET_KEY`
- **Format**: `sk_live_...` (production) or `sk_test_...` (testing)

#### Stripe Publishable Key
- **Current**: Test key (`pk_test_...`)
- **Client**: Replace with client's Stripe publishable key
- **Location**:
  - Root `.env`: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `apps/web/.env.local`: `VITE_STRIPE_PUBLISHABLE_KEY`
- **Format**: `pk_live_...` (production) or `pk_test_...` (testing)

#### Stripe Webhook Secret
- **Current**: Test webhook secret (`whsec_...`)
- **Client**: Replace with client's Stripe webhook secret
- **Location**:
  - Root `.env`: `STRIPE_WEBHOOK_SECRET`
  - `apps/api/.env`: `STRIPE_WEBHOOK_SECRET`
- **Format**: `whsec_...`
- **Where to get**: Stripe Dashboard → Developers → Webhooks → Select webhook → Signing secret

---

### 7. GitHub Configuration (CI/CD)

#### GitHub Token
- **Current**: Development token
- **Client**: Replace with client's GitHub Personal Access Token
- **Location**:
  - Root `.env`: `GITHUB_TOKEN`
  - GitHub Secrets (for CI/CD): `GITHUB_TOKEN`
- **Where to get**: GitHub → Settings → Developer settings → Personal access tokens

---

## 📋 Deployment Checklist

### Before Deployment

- [ ] **Supabase Configuration**
  - [ ] Update Supabase project URL in all `.env` files
  - [ ] Update Supabase anon key in all `.env` files
  - [ ] Update Supabase service role key in `.env` files (server-side only)
  - [ ] Update database URL with client's password
  - [ ] Run database migrations in client's Supabase project
  - [ ] Configure OAuth redirect URLs in Supabase Dashboard

- [ ] **OpenAI Configuration**
  - [ ] Update OpenAI API key in `.env` files
  - [ ] (Optional) Update other LLM API keys if needed

- [ ] **Google OAuth**
  - [ ] Create Google Cloud project for client
  - [ ] Enable Google+ API
  - [ ] Create OAuth credentials
  - [ ] Add credentials to Supabase Dashboard
  - [ ] Configure redirect URLs in Supabase

- [ ] **Application URLs**
  - [ ] Update production app URL
  - [ ] Update production API URL
  - [ ] Update Supabase redirect URLs

- [ ] **Security**
  - [ ] Generate new JWT secret
  - [ ] Update JWT secret in all `.env` files
  - [ ] Verify service role keys are not exposed to client-side

- [ ] **Billing (If Applicable)**
  - [ ] Update Stripe keys (if using Stripe)
  - [ ] Configure Stripe webhook endpoint
  - [ ] Update Stripe webhook secret

- [ ] **CI/CD**
  - [ ] Update GitHub token in CI/CD secrets
  - [ ] Update deployment environment variables
  - [ ] Configure production build settings

---

## 🔐 Environment Files Reference

### Root `.env` File
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[CLIENT-PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[CLIENT-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[CLIENT-SERVICE-ROLE-KEY]

# Database
DATABASE_URL=postgresql://postgres:[CLIENT-PASSWORD]@db.[CLIENT-PROJECT].supabase.co:5432/postgres

# LLM API Keys
OPENAI_API_KEY=[CLIENT-OPENAI-KEY]
ANTHROPIC_API_KEY=[CLIENT-ANTHROPIC-KEY]  # Optional
GOOGLE_AI_API_KEY=[CLIENT-GOOGLE-KEY]      # Optional
GROK_API_KEY=[CLIENT-GROK-KEY]             # Optional

# Stripe Configuration
STRIPE_SECRET_KEY=[CLIENT-STRIPE-SECRET-KEY]
STRIPE_WEBHOOK_SECRET=[CLIENT-WEBHOOK-SECRET]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[CLIENT-STRIPE-PUBLISHABLE-KEY]

# Application URLs
NEXT_PUBLIC_APP_URL=https://[CLIENT-DOMAIN.com]
API_URL=https://api.[CLIENT-DOMAIN.com]

# JWT Secret
JWT_SECRET=[GENERATE-NEW-SECRET]

# GitHub (for CI/CD)
GITHUB_TOKEN=[CLIENT-GITHUB-TOKEN]
```

### `apps/web/.env.local` File
```env
# Supabase (for Vite/Next.js)
VITE_SUPABASE_URL=https://[CLIENT-PROJECT].supabase.co
VITE_SUPABASE_ANON_KEY=[CLIENT-ANON-KEY]
# OR for Next.js:
NEXT_PUBLIC_SUPABASE_URL=https://[CLIENT-PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[CLIENT-ANON-KEY]

# Application URLs
VITE_APP_URL=https://[CLIENT-DOMAIN.com]
VITE_API_URL=https://api.[CLIENT-DOMAIN.com]
# OR for Next.js:
NEXT_PUBLIC_APP_URL=https://[CLIENT-DOMAIN.com]
API_URL=https://api.[CLIENT-DOMAIN.com]

# Stripe (if using)
VITE_STRIPE_PUBLISHABLE_KEY=[CLIENT-STRIPE-PUBLISHABLE-KEY]
```

### `apps/api/.env` File
```env
# Database
DATABASE_URL=postgresql://postgres:[CLIENT-PASSWORD]@db.[CLIENT-PROJECT].supabase.co:5432/postgres

# Supabase Service Role (server-side only)
SUPABASE_SERVICE_ROLE_KEY=[CLIENT-SERVICE-ROLE-KEY]

# JWT Secret
JWT_SECRET=[GENERATE-NEW-SECRET]

# LLM API Keys
OPENAI_API_KEY=[CLIENT-OPENAI-KEY]
ANTHROPIC_API_KEY=[CLIENT-ANTHROPIC-KEY]  # Optional

# Stripe (if using)
STRIPE_SECRET_KEY=[CLIENT-STRIPE-SECRET-KEY]
STRIPE_WEBHOOK_SECRET=[CLIENT-WEBHOOK-SECRET]
```

---

## 🚀 Deployment Steps

### Step 1: Prepare Client Credentials

1. **Get from Client**:
   - Supabase project details
   - OpenAI API key
   - Google Cloud project (or create new)
   - Production domain URLs
   - Stripe account (if using billing)

2. **Create New**:
   - Google OAuth credentials
   - JWT secret (generate new)
   - GitHub token (if needed)

### Step 2: Configure Supabase

1. Go to client's Supabase Dashboard
2. Run database migrations (`infra/supabase/migrations/*.sql`)
3. Configure OAuth providers:
   - Enable Google OAuth
   - Add Google OAuth credentials
   - Set redirect URLs
4. Configure URL settings:
   - Site URL: Production domain
   - Redirect URLs: Production domain + localhost

### Step 3: Update Environment Files

1. Update root `.env` with client credentials
2. Update `apps/web/.env.local` with client credentials
3. Update `apps/api/.env` with client credentials
4. **⚠️ Never commit `.env` files to Git** (they're in `.gitignore`)

### Step 4: Test Configuration

1. Test Supabase connection:
   ```bash
   cd apps/web
   pnpm dev
   # Try signing in - should work with client's Supabase
   ```

2. Test OAuth:
   - Click "Continue with Google"
   - Should redirect to Google sign-in
   - Should redirect back to app

3. Test API calls:
   - Verify OpenAI API works
   - Verify database queries work

### Step 5: Deploy

1. Push code to client's repository
2. Configure CI/CD environment variables
3. Deploy to production environment
4. Verify all functionality works

---

## ⚠️ Security Checklist

- [ ] **Never expose service role keys** - Only use in server-side code
- [ ] **Use strong JWT secrets** - Generate with crypto.randomBytes
- [ ] **Secure API keys** - Never commit to Git
- [ ] **Use HTTPS in production** - Never use HTTP for production
- [ ] **Enable RLS policies** - Verify Row Level Security is enabled
- [ ] **Review OAuth scopes** - Only request necessary permissions
- [ ] **Monitor API usage** - Set up alerts for API key usage
- [ ] **Rotate secrets regularly** - Update keys periodically

---

## 📝 Notes

- **Development vs Production**: Always use separate credentials for development and production
- **Environment Variables**: Different frameworks use different prefixes:
  - Vite: `VITE_*`
  - Next.js: `NEXT_PUBLIC_*`
  - Server-side: No prefix (never exposed to client)

- **Supabase URLs**: 
  - Project URL: `https://[PROJECT-REF].supabase.co`
  - Database: `db.[PROJECT-REF].supabase.co:5432`

- **OAuth Redirect URLs**:
  - Must match exactly in Google Cloud Console and Supabase
  - Development: `http://localhost:3000`
  - Production: `https://[CLIENT-DOMAIN.com]`

---

## 🔗 Related Documentation

- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Setup instructions
- [SUPABASE_OAUTH_SETUP.md](./SUPABASE_OAUTH_SETUP.md) - OAuth configuration guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture overview

---

**Last Updated**: November 2025  
**Maintained By**: Development Team

