import { NextResponse } from 'next/server';
import { supabaseAdmin, getCurrentUser } from '@/lib/supabase';
import { generateQuiz } from '@/lib/llm';

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, numQuestions = 10 } = await request.json();

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    // Verify user owns document
    const { data: document } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Get document chunks
    const { data: chunks } = await supabaseAdmin
      .from('embeddings')
      .select('chunk')
      .eq('doc_id', documentId)
      .limit(20);

    if (!chunks || chunks.length === 0) {
      return NextResponse.json({ error: 'No content found' }, { status: 404 });
    }

    // Combine chunks for context
    const documentText = chunks.map(c => c.chunk).join('\n\n');

    // Generate quiz
    const questions = await generateQuiz(documentText, numQuestions);

    return NextResponse.json({
      success: true,
      quiz: {
        documentId,
        documentName: document.name,
        questions,
      },
    });
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
