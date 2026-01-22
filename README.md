import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Code, Database, Server, Cloud, CheckCircle } from 'lucide-react';

const BuildGuide = () => {
  const [openSections, setOpenSections] = useState({ stack: true });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const freeStack = [
    { name: 'Frontend', tool: 'Next.js + Vercel', cost: 'Free', icon: <Code className="w-5 h-5" /> },
    { name: 'Backend', tool: 'Next.js API Routes', cost: 'Free', icon: <Server className="w-5 h-5" /> },
    { name: 'Database', tool: 'Supabase (500MB)', cost: 'Free', icon: <Database className="w-5 h-5" /> },
    { name: 'Vector DB', tool: 'pgvector (Supabase)', cost: 'Free', icon: <Database className="w-5 h-5" /> },
    { name: 'Storage', tool: 'Supabase Storage (1GB)', cost: 'Free', icon: <Cloud className="w-5 h-5" /> },
    { name: 'LLM', tool: 'Groq (free tier)', cost: 'Free', icon: <Code className="w-5 h-5" /> },
    { name: 'Embeddings', tool: 'Xenova/transformers.js', cost: 'Free', icon: <Code className="w-5 h-5" /> },
    { name: 'Cron Jobs', tool: 'Vercel Cron', cost: 'Free', icon: <Server className="w-5 h-5" /> }
  ];

  const repoStructure = `pharmaintel-ai/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.js
│   │   │   │   └── signup/route.js
│   │   │   ├── documents/
│   │   │   │   ├── upload/route.js
│   │   │   │   ├── ask/route.js
│   │   │   │   └── summary/route.js
│   │   │   ├── regulatory/
│   │   │   │   ├── sources/route.js
│   │   │   │   ├── scan/route.js
│   │   │   │   └── alerts/route.js
│   │   │   ├── training/
│   │   │   │   ├── generate-quiz/route.js
│   │   │   │   ├── submit-quiz/route.js
│   │   │   │   └── progress/route.js
│   │   │   └── cron/
│   │   │       └── scraper/route.js
│   │   ├── dashboard/
│   │   │   └── page.js
│   │   ├── documents/
│   │   │   └── page.js
│   │   ├── regulatory/
│   │   │   └── page.js
│   │   ├── training/
│   │   │   └── page.js
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   │   ├── DocumentUpload.js
│   │   ├── ChatInterface.js
│   │   ├── RegulatoryFeed.js
│   │   └── QuizGenerator.js
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── embeddings.js
│   │   ├── llm.js
│   │   ├── scraper.js
│   │   └── utils.js
│   └── styles/
│       └── globals.css
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_vector_extension.sql
│   │   └── 003_rls_policies.sql
│   └── seed.sql
├── scripts/
│   ├── setup.sh
│   └── test-scraper.js
├── .env.example
├── .gitignore
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md`;

  const steps = [
    {
      title: 'Step 1: Setup GitHub & Local Environment',
      commands: [
        '# Create GitHub repo',
        'gh repo create pharmaintel-ai --public --clone',
        'cd pharmaintel-ai',
        '',
        '# Initialize Next.js',
        'npx create-next-app@latest . --typescript --tailwind --app --no-src-dir',
        '',
        '# Install dependencies',
        'npm install @supabase/supabase-js @xenova/transformers cheerio node-cron groq-sdk'
      ]
    },
    {
      title: 'Step 2: Setup Supabase (Free)',
      commands: [
        '# Go to supabase.com',
        '# Create new project (free tier)',
        '# Get API keys from Settings > API',
        '',
        '# Add to .env.local:',
        'NEXT_PUBLIC_SUPABASE_URL=your_url',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key',
        'SUPABASE_SERVICE_ROLE_KEY=your_service_key'
      ]
    },
    {
      title: 'Step 3: Setup Groq (Free LLM)',
      commands: [
        '# Go to console.groq.com',
        '# Sign up for free tier',
        '# Create API key',
        '',
        '# Add to .env.local:',
        'GROQ_API_KEY=your_groq_key'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">PharmaIntel AI - Free Build Guide</h1>
          <p className="text-gray-600 mb-6">Build a production-ready pharma AI platform with $0 budget</p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-800">100% Free Stack</h3>
                <p className="text-sm text-green-700">Everything below is completely free. No credit card needed for MVP.</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <button
              onClick={() => toggleSection('stack')}
              className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3"
            >
              {openSections.stack ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              Free Tech Stack
            </button>
            
            {openSections.stack && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-7">
                {freeStack.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-blue-600">{item.icon}</div>
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{item.tool}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      {item.cost}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <button
              onClick={() => toggleSection('repo')}
              className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3"
            >
              {openSections.repo ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              Repository Structure
            </button>
            
            {openSections.repo && (
              <div className="ml-7">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {repoStructure}
                </pre>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Setup Instructions</h2>
            
            {steps.map((step, idx) => (
              <div key={idx} className="mb-4">
                <button
                  onClick={() => toggleSection(`step${idx}`)}
                  className="flex items-center gap-2 text-md font-medium text-gray-700 mb-2"
                >
                  {openSections[`step${idx}`] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  {step.title}
                </button>
                
                {openSections[`step${idx}`] && (
                  <div className="ml-6">
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                      {step.commands.join('\n')}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Next: Full Code Files</h3>
            <p className="text-sm text-blue-700">
              Click "Generate Complete Code" below and I'll create all the actual code files you need.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildGuide;
