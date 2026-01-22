# PharmaIntel AI

AI-powered pharmaceutical intelligence platform with document Q&A, regulatory monitoring, and training modules.

## 🎯 Features

- **Document AI**: Upload PDFs, ask questions, get AI answers with citations
- **Regulatory Watch**: Auto-monitor FDA, EMA, CDSCO for changes
- **AI Training**: Generate quizzes from documents

## 💰 100% Free Stack

- **Frontend**: Next.js + Vercel (Free)
- **Database**: Supabase (500MB free)
- **Vector Search**: pgvector (Supabase built-in)
- **Storage**: Supabase Storage (1GB free)
- **LLM**: Groq (Free tier - fast inference)
- **Embeddings**: Transformers.js (Browser-based, free)

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/pharmaintel-ai.git
cd pharmaintel-ai
npm install
```

### 2. Setup Supabase (Free)

1. Go to [supabase.com](https://supabase.com)
2. Create new project (free tier)
3. Go to **Settings** → **API** and copy:
   - Project URL
   - Anon public key
   - Service role key
4. Go to **SQL Editor** and run migrations:
   - Run `supabase/migrations/001_initial_schema.sql`
   - Run `supabase/migrations/002_vector_extension.sql`
5. Go to **Storage** → Create bucket named `documents` → Make it private

### 3. Setup Groq (Free LLM)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for free account
3. Create API key

### 4. Environment Variables

Create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Groq
GROQ_API_KEY=your-groq-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your-random-secret
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Deploy to Vercel (Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings → Environment Variables
```

Your cron job will run automatically daily at midnight!

## 📁 Project Structure

```
pharmaintel-ai/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── documents/    # Upload, Q&A
│   │   │   ├── regulatory/   # Alerts, sources
│   │   │   ├── training/     # Quiz generation
│   │   │   └── cron/         # Scraper job
│   │   ├── dashboard/        # Main UI
│   │   └── page.js           # Landing page
│   ├── components/           # React components
│   │   ├── DocumentUpload.js
│   │   ├── ChatInterface.js
│   │   └── ...
│   └── lib/                  # Core logic
│       ├── supabase.js       # DB client
│       ├── embeddings.js     # Vector search
│       ├── llm.js            # Groq integration
│       └── scraper.js        # Regulatory monitoring
├── supabase/
│   └── migrations/           # Database schema
└── vercel.json               # Cron config
```

## 🔧 Core Workflows

### Document Q&A

1. User uploads PDF
2. Extract text, chunk into pieces
3. Generate embeddings (Transformers.js)
4. Store in Supabase with pgvector
5. User asks question
6. Convert question to embedding
7. Vector search for similar chunks
8. Send context to Groq LLM
9. Return answer with citations

### Regulatory Watch

1. Cron job runs daily (Vercel Cron)
2. Fetch FDA/EMA/CDSCO pages
3. Hash content
4. Compare with stored hash
5. If changed → Generate AI summary
6. Create alert for all users
7. Store in database

### Training Module

1. Select document
2. Extract chunks
3. Send to Groq: "Generate 10 MCQs"
4. Parse JSON response
5. Show quiz UI
6. Score and save results

## 🎓 Free Tier Limits

| Service | Free Tier |
|---------|-----------|
| Supabase DB | 500MB |
| Supabase Storage | 1GB |
| Groq API | 14,400 requests/day |
| Vercel Hosting | Unlimited |
| Vercel Cron | 1 job |

## 💡 Usage Tips

1. **Optimize embeddings**: Use 384-dim model (all-MiniLM-L6-v2) - fits free tier
2. **Chunk wisely**: 500 words per chunk = good balance
3. **Rate limits**: Add delays in scraper (2s between requests)
4. **PDF parsing**: Use server-side only (memory intensive)

## 🔒 Security

- Row Level Security (RLS) enabled
- Users can only access their own documents
- File encryption in Supabase Storage
- Private storage buckets
- Cron job protected by secret

## 📊 Free Tier Capacity

- **Users**: Unlimited
- **Documents per user (free)**: 5
- **Document size**: 10MB max
- **API calls**: ~14k/day (Groq)
- **Storage**: 1GB total

## 🚀 Upgrade Path

When you outgrow free tier:

1. Supabase Pro ($25/mo) → 8GB DB, 100GB storage
2. Groq Pay-as-you-go → $0.10/1M tokens
3. Add OpenAI/Anthropic for better LLM

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Test scraper locally
node scripts/test-scraper.js
```

## 📝 API Endpoints

### Documents
- `POST /api/documents/upload` - Upload PDF/TXT
- `POST /api/documents/ask` - Ask question
- `GET /api/documents/summary` - Generate summary

### Regulatory
- `GET /api/regulatory/sources` - List monitored sources
- `GET /api/regulatory/alerts` - Get user alerts
- `POST /api/regulatory/scan` - Manual scan

### Training
- `POST /api/training/generate-quiz` - Generate quiz
- `POST /api/training/submit-quiz` - Submit answers
- `GET /api/training/progress` - Get user progress

## 🐛 Common Issues

### "Can't connect to Supabase"
- Check `.env.local` has correct keys
- Verify Supabase project is active
- Run migrations in SQL editor

### "Upload fails"
- Check storage bucket exists and is private
- Verify RLS policies applied
- Check file size < 10MB

### "Vector search not working"
- Enable pgvector extension
- Run migration 002_vector_extension.sql
- Rebuild embeddings index

### "Cron job not running"
- Verify `vercel.json` deployed
- Check Vercel dashboard → Settings → Cron
- Set CRON_SECRET environment variable

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Groq API Docs](https://console.groq.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Transformers.js](https://huggingface.co/docs/transformers.js)

## ⚖️ Legal

This tool provides information only. Not regulatory or medical advice.
Users responsible for verifying all information.

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 💬 Support

- GitHub Issues: Report bugs
- Email: your-email@example.com

---

Built with ❤️ for the pharmaceutical community
