# Quick Start Guide - 15 Minutes to Running App

## Prerequisites

- Node.js 18+ installed
- Code editor (VS Code recommended)
- Terminal access

## Step 1: Get the Code (2 min)

```bash
# Clone or download the repo
git clone https://github.com/yourusername/pharmaintel-ai.git
cd pharmaintel-ai

# Install dependencies
npm install
```

## Step 2: Setup Supabase (5 min)

1. **Create project**: [supabase.com](https://supabase.com) → New Project
2. **Run migrations**: Copy SQL from `supabase/migrations/` → SQL Editor → Run
3. **Create bucket**: Storage → New bucket → Name: `documents` → Private
4. **Get keys**: Settings → API → Copy URL + Keys

## Step 3: Setup Groq (1 min)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up → API Keys → Create
3. Copy key (starts with `gsk_`)

## Step 4: Configure Environment (2 min)

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
GROQ_API_KEY=gsk_your_groq_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=any_random_string
```

## Step 5: Run (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test It (4 min)

1. **Sign up**: Create account with email/password
2. **Upload**: Drop a PDF (any document)
3. **Wait**: 30-60 seconds for processing
4. **Ask**: Type "What is this document about?"
5. **Get answer**: AI responds with citations!

## ✅ You're Done!

Your local dev environment is ready.

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run production build

# Testing
node scripts/test-scraper.js  # Test regulatory scraper
```

## File Structure (What to Know)

```
src/
  app/api/           # Backend API routes
  components/        # React UI components
  lib/              # Core logic (DB, AI, scraper)
supabase/           # Database schema
```

## Key Files

- `src/lib/supabase.js` - Database connection
- `src/lib/embeddings.js` - Vector search
- `src/lib/llm.js` - AI answers
- `src/lib/scraper.js` - Regulatory monitoring

## What's Free

- Supabase: 500MB DB + 1GB storage
- Groq: 14,400 requests/day
- Vercel: Unlimited hosting + 1 cron job

## Need Help?

- Check `README.md` for detailed docs
- Check `DEPLOYMENT.md` for going live
- Open GitHub issue for bugs

## Next Steps

1. Customize UI in `src/components/`
2. Add more regulatory sources in `src/lib/scraper.js`
3. Improve prompts in `src/lib/llm.js`
4. Deploy to Vercel (see DEPLOYMENT.md)

That's it! Happy coding! 🚀
