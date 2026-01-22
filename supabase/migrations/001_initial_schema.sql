-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE public.documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size BIGINT,
  storage_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document embeddings (for vector search)
CREATE TABLE public.embeddings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  doc_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  chunk TEXT NOT NULL,
  page_no INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Regulatory sources
CREATE TABLE public.regulatory_sources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  authority TEXT NOT NULL CHECK (authority IN ('FDA', 'EMA', 'CDSCO')),
  url TEXT NOT NULL,
  last_checked TIMESTAMPTZ,
  content_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Regulatory alerts
CREATE TABLE public.alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  authority TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training results
CREATE TABLE public.training_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  module TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_embeddings_doc_id ON public.embeddings(doc_id);
CREATE INDEX idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX idx_training_user_id ON public.training_results(user_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own documents" ON public.documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON public.documents
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view embeddings for their documents" ON public.embeddings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.documents
      WHERE documents.id = embeddings.doc_id
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own alerts" ON public.alerts
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view own training results" ON public.training_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training results" ON public.training_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);
