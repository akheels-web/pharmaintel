# Deployment Guide - PharmaIntel AI

Complete step-by-step guide to deploy your app for FREE.

## 🎯 What You'll Need

- GitHub account (free)
- Supabase account (free)
- Groq account (free)
- Vercel account (free)

Total cost: **$0/month** ✨

---

## Step 1: GitHub Repository (5 min)

### Option A: Use GitHub Desktop (Easiest)

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Install and sign in
3. Click **File** → **New Repository**
   - Name: `pharmaintel-ai`
   - Local path: Choose location
   - Click **Create Repository**
4. Copy all project files to this folder
5. Click **Commit to main** (bottom left)
6. Click **Publish repository** (top right)
7. ✅ Done!

### Option B: Use Command Line

```bash
# Navigate to project folder
cd pharmaintel-ai

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
gh repo create pharmaintel-ai --public --source=. --push
```

---

## Step 2: Supabase Setup (10 min)

### 2.1 Create Project

1. Go to [supabase.com](https://supabase.com)
2. Click **Start your project** → Sign in with GitHub
3. Click **New project**
   - Name: `pharmaintel`
   - Database password: Generate strong password (save it!)
   - Region: Choose closest to you
   - Plan: **Free** (500MB DB, 1GB storage)
4. Wait 2 minutes for project creation

### 2.2 Get API Keys

1. Go to **Settings** → **API**
2. Copy these values (you'll need them):
   - Project URL: `https://xxxxx.supabase.co`
   - `anon` `public` key: `eyJhbG...`
   - `service_role` key: `eyJhbG...` (click "Reveal")

### 2.3 Run Database Migrations

1. Go to **SQL Editor** (left sidebar)
2. Click **+ New query**
3. Copy entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and click **Run**
5. Wait for "Success" message
6. Repeat for `002_vector_extension.sql`
7. ✅ Database ready!

### 2.4 Create Storage Bucket

1. Go to **Storage** (left sidebar)
2. Click **New bucket**
   - Name: `documents`
   - Public bucket: **OFF** (keep private)
   - Click **Create bucket**
3. Click on `documents` bucket
4. Click **Policies** → **New policy**
5. Template: **Enable read access for authenticated users only**
6. Click **Review** → **Save policy**
7. ✅ Storage ready!

---

## Step 3: Groq API Setup (2 min)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with Google/GitHub
3. Go to **API Keys** (left sidebar)
4. Click **Create API Key**
   - Name: `PharmaIntel`
   - Click **Submit**
5. Copy the key (starts with `gsk_...`)
6. ✅ Save this key!

---

## Step 4: Vercel Deployment (5 min)

### 4.1 Deploy

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **Add New** → **Project**
4. Find `pharmaintel-ai` repo → **Import**
5. **DO NOT CLICK DEPLOY YET!**

### 4.2 Add Environment Variables

Before deploying, add these in Vercel:

1. Click **Environment Variables** section
2. Add each variable:

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbG... (anon key)
SUPABASE_SERVICE_ROLE_KEY = eyJhbG... (service role key)
GROQ_API_KEY = gsk_... (your Groq key)
NEXT_PUBLIC_APP_URL = https://pharmaintel-ai.vercel.app
CRON_SECRET = [click "Generate" button]
```

3. Click **Deploy**
4. Wait 2-3 minutes
5. ✅ App is live!

### 4.3 Setup Cron Job

Your `vercel.json` already configures the cron job! It will:
- Run daily at midnight
- Check regulatory sites
- Send alerts to users

To verify:
1. Go to Vercel dashboard
2. Click your project
3. Go to **Settings** → **Cron Jobs**
4. You should see `/api/cron/scraper` scheduled

---

## Step 5: Test Your App (5 min)

### 5.1 Create Account

1. Visit your Vercel URL (e.g., `https://pharmaintel-ai.vercel.app`)
2. Click **Sign Up**
3. Enter email/password
4. Check email for confirmation
5. Sign in

### 5.2 Test Document Upload

1. Download a sample PDF (any document)
2. Go to **Documents** page
3. Upload the PDF
4. Wait for processing (30-60 seconds)
5. Ask a question: "What is this document about?"
6. ✅ If you get an answer, it works!

### 5.3 Test Cron Job (Optional)

```bash
# Send request to trigger scraper manually
curl -X GET https://your-app.vercel.app/api/cron/scraper \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Check Supabase → **Table Editor** → `alerts` for new entries.

---

## 🎉 You're Live!

Your app is now running at: `https://pharmaintel-ai.vercel.app`

### What You Get For Free:

- ✅ Unlimited users
- ✅ 500MB database
- ✅ 1GB file storage
- ✅ Vector search (pgvector)
- ✅ AI document Q&A
- ✅ Daily regulatory monitoring
- ✅ Training quiz generation
- ✅ SSL certificate
- ✅ Custom domain (optional)

---

## 🔧 Post-Deployment Checklist

- [ ] Test document upload
- [ ] Test document Q&A
- [ ] Check alerts are created
- [ ] Verify cron job in Vercel settings
- [ ] Add custom domain (optional)
- [ ] Enable Google Analytics (optional)
- [ ] Share with users!

---

## 🚨 Common Issues

### "Supabase connection failed"
**Fix**: Check environment variables in Vercel
1. Go to Settings → Environment Variables
2. Verify all keys are correct
3. Redeploy: Deployments → ⋯ → Redeploy

### "Upload fails"
**Fix**: Check storage bucket
1. Supabase → Storage → `documents`
2. Verify bucket exists and is private
3. Check RLS policies are enabled

### "No answers from AI"
**Fix**: Check Groq API key
1. Verify key starts with `gsk_`
2. Check quota at console.groq.com
3. Free tier: 14,400 requests/day

### "Cron job not running"
**Fix**: Verify vercel.json deployed
1. Check `vercel.json` in repo
2. Redeploy project
3. Check Settings → Cron Jobs

---

## 📊 Free Tier Limits

| Resource | Free Tier | Enough For |
|----------|-----------|------------|
| Supabase DB | 500MB | ~5,000 documents |
| Supabase Storage | 1GB | ~100 PDFs |
| Groq API | 14,400 req/day | ~1,400 questions/day |
| Vercel Bandwidth | 100GB/mo | ~10,000 users/mo |
| Vercel Builds | 6,000 min/mo | Unlimited deploys |

**Conclusion**: Perfect for MVP and early users!

---

## 🚀 When To Upgrade

Upgrade when you hit:
- 500MB database (Supabase Pro: $25/mo → 8GB)
- 14k requests/day (Groq pay-as-you-go)
- 100GB bandwidth (Vercel Pro: $20/mo → 1TB)

Until then, **stay on free tier**!

---

## 🔐 Security Checklist

- [x] Environment variables in Vercel (not in code)
- [x] Row Level Security enabled
- [x] Private storage buckets
- [x] Cron job protected by secret
- [x] HTTPS enabled (automatic)
- [x] No API keys in frontend

---

## 🎨 Custom Domain (Optional)

1. Buy domain (e.g., Namecheap $10/year)
2. Vercel → Settings → Domains
3. Add domain
4. Update DNS records (Vercel shows instructions)
5. Wait 10 minutes for SSL
6. ✅ Your app at `pharmaintel.com`!

---

## 📱 Share Your App

Your app is live at: `https://pharmaintel-ai.vercel.app`

Share with:
- Pharmaceutical professionals
- Regulatory teams
- Medical writers
- Drug safety teams

---

## 🆘 Need Help?

1. Check logs: Vercel → Deployments → View Function Logs
2. Check Supabase: Table Editor → See data
3. GitHub Issues: Report bugs
4. Discord: Join community (add link)

---

## 🎓 Next Steps

1. **Add users**: Share signup link
2. **Monitor usage**: Vercel Analytics
3. **Get feedback**: Add feedback form
4. **Iterate**: Add features users want
5. **Scale**: Upgrade when needed

---

**Congratulations! Your app is live! 🎉**
