import { NextResponse } from 'next/server';
import { supabaseAdmin, getCurrentUser } from '@/lib/supabase';
import { generateEmbedding } from '@/lib/embeddings';
import { answerQuestion } from '@/lib/llm';

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { question, documentId } = await request.json();

    if (!question || !documentId) {
      return NextResponse.json(
        { error: 'Question and document ID required' },
        { status: 400 }
      );
    }

    // Verify user owns this document
    const { data: document } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Generate embedding for the question
    const questionEmbedding = await generateEmbedding(question);

    // Find similar chunks using vector search
    const { data: matches, error: searchError } = await supabaseAdmin.rpc(
      'match_documents',
      {
        query_embedding: questionEmbedding,
        match_threshold: 0.5,
        match_count: 5,
        filter_doc_id: documentId,
      }
    );

    if (searchError) {
      console.error('Search error:', searchError);
      return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }

    if (!matches || matches.length === 0) {
      return NextResponse.json({
        answer: 'No relevant information found in the document.',
        sources: [],
      });
    }

    // Build context from matched chunks
    const context = matches
      .map((match, index) => {
        return `[Page ${match.page_no}]
${match.chunk}`;
      })
      .join('

---

');

    // Get answer from LLM
    const answer = await answerQuestion(question, context);

    // Return answer with sources
    return NextResponse.json({
      answer,
      sources: matches.map(m => ({
        page: m.page_no,
        similarity: m.similarity,
        snippet: m.chunk.substring(0, 150) + '...',
      })),
    });
  } catch (error) {
    console.error('Ask error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to answer question' },
      { status: 500 }
    );
  }
}
