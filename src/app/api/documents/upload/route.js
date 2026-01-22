import { NextResponse } from 'next/server';
import { supabaseAdmin, getCurrentUser } from '@/lib/supabase';
import { processDocument } from '@/lib/embeddings';

export async function POST(request) {
  try {
    // Get authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check user's document count (free tier limit)
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    const { count } = await supabaseAdmin
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (profile?.plan === 'free' && count >= 5) {
      return NextResponse.json(
        { error: 'Free tier limit reached. Upgrade to Pro for unlimited documents.' },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Upload to Supabase Storage
    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from('documents')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    // Process document (extract text, chunk, generate embeddings)
    const { chunks, embeddings, numPages } = await processDocument(
      fileBuffer,
      file.type
    );

    // Save document metadata
    const { data: document, error: docError } = await supabaseAdmin
      .from('documents')
      .insert({
        user_id: user.id,
        name: file.name,
        type: file.type,
        size: file.size,
        storage_path: fileName,
      })
      .select()
      .single();

    if (docError) {
      console.error('Document save error:', docError);
      return NextResponse.json({ error: 'Failed to save document' }, { status: 500 });
    }

    // Save embeddings
    const embeddingRecords = chunks.map((chunk, index) => ({
      doc_id: document.id,
      chunk: chunk,
      embedding: embeddings[index],
      page_no: Math.floor(index / (chunks.length / numPages)) + 1,
    }));

    const { error: embeddingError } = await supabaseAdmin
      .from('embeddings')
      .insert(embeddingRecords);

    if (embeddingError) {
      console.error('Embedding save error:', embeddingError);
      return NextResponse.json({ error: 'Failed to save embeddings' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        name: document.name,
        chunks: chunks.length,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
