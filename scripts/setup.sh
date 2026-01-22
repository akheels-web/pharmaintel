#!/bin/bash

echo "🚀 PharmaIntel AI Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ .env.local created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your API keys:"
    echo ""
    echo "   1. Supabase keys (from supabase.com)"
    echo "   2. Groq API key (from console.groq.com)"
    echo "   3. Random CRON_SECRET"
    echo ""
    echo "Then run: npm run dev"
    exit 0
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure you've:"
echo "   - Created Supabase project"
echo "   - Run SQL migrations"
echo "   - Created storage bucket 'documents'"
echo "   - Got Groq API key"
echo "   - Updated .env.local"
echo ""
echo "2. Start development server:"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:3000"
echo ""
echo "Need help? Check README.md"
