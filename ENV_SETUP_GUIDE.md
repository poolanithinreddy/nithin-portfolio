# Environment Variables Setup Guide

This guide will help you set up all the required environment variables for your portfolio project.

## 📋 Overview

Your portfolio needs the following services:
1. **PostgreSQL Database** (via Supabase or local)
2. **Supabase** (for file storage and CDN)
3. **Resend** (for contact form emails)
4. **Plausible Analytics** (optional - for privacy-friendly analytics)

---

## 🚀 Step-by-Step Setup

### 1. PostgreSQL Database Setup

#### Option A: Using Supabase (Recommended - Free)

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → Sign up with GitHub
3. Create a new project:
   - **Project Name**: `nithin-portfolio` (or your choice)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you (e.g., `us-east-1`)
4. Wait for project to provision (~2 minutes)
5. Go to **Settings** → **Database**
6. Scroll to "Connection string" → Copy the **Connection pooling** URI
7. Replace `[YOUR-PASSWORD]` with your database password

**Your DATABASE_URL will look like:**
```
postgresql://postgres.xxxxx:YOUR-PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally:
   ```bash
   # macOS
   brew install postgresql@15
   brew services start postgresql@15
   
   # Or use Docker
   docker run --name portfolio-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
   ```

2. Create database:
   ```bash
   createdb portfolio
   ```

3. Your DATABASE_URL:
   ```
   postgresql://postgres:password@localhost:5432/portfolio?schema=public
   ```

---

### 2. Supabase Storage Setup (for images/files)

**Using the same Supabase project:**

1. In your Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
   - **Name**: `portfolio-media`
   - **Public bucket**: ✅ Yes (for public images)
   - Click "Create bucket"

3. Get your keys from **Settings** → **API**:
   - **Project URL**: Copy this (e.g., `https://xxxxx.supabase.co`)
   - **anon public key**: Copy this (starts with `eyJh...`)
   - **service_role key**: Copy this (starts with `eyJh...`) - **Keep secret!**

4. (Optional) Set up CDN URL:
   - Go to **Settings** → **Storage**
   - Copy the CDN URL (or leave empty to use default Supabase URL)

---

### 3. Resend Email Setup (for contact form)

1. Go to [resend.com](https://resend.com)
2. Sign up with email or GitHub
3. Click "API Keys" → "Create API Key"
   - **Name**: `Portfolio Contact Form`
   - **Permission**: Full Access
   - Click "Add"
4. **Copy the API key immediately** (you won't see it again!)
5. (Optional) Verify your domain:
   - Go to "Domains" → "Add Domain"
   - Follow DNS verification steps
   - Or use the free `onboarding@resend.dev` for testing

---

### 4. Plausible Analytics (Optional - Privacy-friendly analytics)

1. Go to [plausible.io](https://plausible.io)
2. Sign up (has free trial, then ~$9/month)
3. Add your website domain: `nithin.dev`
4. Copy your domain name for the env variable

**Or skip this** - it's optional and the site will work without it.

---

## 📝 Create Your .env.local File

Create a file named `.env.local` in your project root:

```bash
# Server (Backend)
DATABASE_URL="postgresql://postgres.xxxxx:YOUR-PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
ADMIN_SECRET="create-a-random-32-char-string-here"
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
RESEND_FROM="Nithin Reddy <hello@nithin.dev>"
CONTACT_INBOX="nithinpoolareddy@gmail.com"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx"
SUPABASE_STORAGE_BUCKET="portfolio-media"

# Client (Frontend - publicly visible)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx"
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET="portfolio-media"
NEXT_PUBLIC_SUPABASE_CDN_URL=""
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="nithin.dev"
```

---

## 🔐 Generating ADMIN_SECRET

The `ADMIN_SECRET` is used to protect your admin routes. Generate a random string:

```bash
# Option 1: Use OpenSSL
openssl rand -base64 32

# Option 2: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

Copy the output and use it as your `ADMIN_SECRET`.

---

## 🗄️ Database Migration

After setting up your `.env.local`, initialize the database:

```bash
# Install dependencies if you haven't
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed with sample data
npx prisma db seed
```

---

## ✅ Verification Checklist

- [ ] PostgreSQL database is accessible
- [ ] Supabase project created
- [ ] Storage bucket `portfolio-media` created
- [ ] Resend API key obtained
- [ ] `.env.local` file created with all variables
- [ ] `ADMIN_SECRET` is random and secure
- [ ] Prisma migrations run successfully
- [ ] Contact form test email works

---

## 🧪 Test Your Setup

### 1. Test Database Connection
```bash
npx prisma studio
```
This should open Prisma Studio at `http://localhost:5555`

### 2. Test the Application
```bash
npm run dev
```
Visit `http://localhost:3000`

### 3. Test Contact Form
- Go to `/contact`
- Fill out the form
- Check your email inbox (`CONTACT_INBOX`)

### 4. Test Admin Panel
- Go to `/admin` or `/login`
- Use your `ADMIN_SECRET` to authenticate

---

## 🔒 Security Notes

### ⚠️ Never commit these files:
- `.env.local`
- `.env.production`
- `.env` (if it contains secrets)

### ✅ Safe to commit:
- `.env.example` (template without real values)

### 🛡️ Keep these SECRET (server-side only):
- `DATABASE_URL`
- `ADMIN_SECRET`
- `RESEND_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 📢 These are public (client-side):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

---

## 🆘 Troubleshooting

### Database connection error
- Check if PostgreSQL is running
- Verify DATABASE_URL format
- Check firewall/security groups
- Ensure password is URL-encoded if it has special characters

### Resend emails not sending
- Verify API key is correct
- Check Resend dashboard for errors
- Verify sender email domain
- Check spam folder

### Supabase storage not working
- Ensure bucket is public
- Check bucket name matches env variable
- Verify anon key has correct permissions

### Build fails with Prisma errors
```bash
# Regenerate Prisma client
npx prisma generate

# Reset and push schema
npx prisma db push --force-reset
```

---

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Resend Docs](https://resend.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Plausible Analytics](https://plausible.io/docs)

---

## 🎉 You're All Set!

Once you've completed all the steps above, your portfolio will have:
- ✅ Working database for projects and posts
- ✅ Image storage and CDN
- ✅ Contact form with email notifications
- ✅ Admin panel for content management
- ✅ (Optional) Privacy-friendly analytics

Happy coding! 🚀
