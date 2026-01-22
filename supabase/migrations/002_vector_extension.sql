-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add vector column to embeddings table
ALTER TABLE public.embeddings 
ADD COLUMN embedding vector(384);

-- Create index for vector similarity search
CREATE INDEX ON public.embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Function to search similar chunks
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  filter_doc_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  doc_id uuid,
  chunk text,
  page_no int,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    embeddings.id,
    embeddings.doc_id,
    embeddings.chunk,
    embeddings.page_no,
    1 - (embeddings.embedding <=> query_embedding) as similarity
  FROM embeddings
  WHERE 
    (filter_doc_id IS NULL OR embeddings.doc_id = filter_doc_id)
    AND 1 - (embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
