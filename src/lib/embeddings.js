// Using Xenova Transformers.js for free local embeddings
import { pipeline } from '@xenova/transformers';

let embeddingPipeline = null;

async function getEmbeddingPipeline() {
  if (!embeddingPipeline) {
    embeddingPipeline = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );
  }
  return embeddingPipeline;
}

export async function generateEmbedding(text) {
  const pipe = await getEmbeddingPipeline();
  const output = await pipe(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

export async function generateEmbeddings(texts) {
  const embeddings = [];
  for (const text of texts) {
    const embedding = await generateEmbedding(text);
    embeddings.push(embedding);
  }
  return embeddings;
}

// Chunk text into manageable pieces
export function chunkText(text, chunkSize = 500, overlap = 50) {
  const chunks = [];
  const words = text.split(/\s+/);
  
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    chunks.push(chunk);
  }
  
  return chunks;
}

// Parse PDF and extract text (server-side only)
export async function extractTextFromPDF(buffer) {
  if (typeof window !== 'undefined') {
    throw new Error('PDF parsing must be done on server');
  }
  
  const pdf = await import('pdf-parse/lib/pdf-parse.js');
  const data = await pdf.default(buffer);
  
  return {
    text: data.text,
    numPages: data.numpages,
  };
}

// Process document: extract text, chunk, and generate embeddings
export async function processDocument(buffer, fileType) {
  let text = '';
  let numPages = 1;
  
  if (fileType === 'application/pdf') {
    const result = await extractTextFromPDF(buffer);
    text = result.text;
    numPages = result.numPages;
  } else if (fileType === 'text/plain') {
    text = buffer.toString('utf-8');
  } else {
    throw new Error('Unsupported file type');
  }
  
  // Clean and chunk text
  const cleanText = text.replace(/\s+/g, ' ').trim();
  const chunks = chunkText(cleanText);
  
  // Generate embeddings for each chunk
  const embeddings = await generateEmbeddings(chunks);
  
  return {
    chunks,
    embeddings,
    numPages,
  };
}
