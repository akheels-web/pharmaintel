import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Answer questions from document chunks
export async function answerQuestion(question, context) {
  const prompt = `You are a pharmaceutical document assistant.

Answer the question ONLY using the provided context below.
If the answer is not found in the context, say "Not found in document".
Always cite page numbers when available.

Context:
${context}

Question: ${question}

Answer:`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a helpful pharmaceutical documentation assistant. Be concise and accurate.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'llama3-8b-8192', // Free tier model
    temperature: 0.3,
    max_tokens: 1024,
  });

  return completion.choices[0]?.message?.content || 'No answer generated';
}

// Generate document summary
export async function generateSummary(text) {
  const prompt = `Summarize the following pharmaceutical document. Include:
- Main topic
- Key findings
- Important regulatory information
- Critical dates or deadlines

Document:
${text.substring(0, 8000)}

Summary:`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'llama3-8b-8192',
    temperature: 0.5,
    max_tokens: 500,
  });

  return completion.choices[0]?.message?.content || 'No summary generated';
}

// Generate training quiz
export async function generateQuiz(documentText, numQuestions = 10) {
  const prompt = `Generate ${numQuestions} multiple-choice questions from this pharmaceutical document.

Format as JSON array:
[
  {
    "question": "Question text",
    "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
    "correct": "A",
    "explanation": "Brief explanation"
  }
]

Document:
${documentText.substring(0, 6000)}

Questions (JSON only):`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'llama3-8b-8192',
    temperature: 0.7,
    max_tokens: 2000,
  });

  const response = completion.choices[0]?.message?.content || '[]';
  
  // Extract JSON from response
  const jsonMatch = response.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  return [];
}

// Summarize regulatory changes
export async function summarizeRegulatoryChange(oldContent, newContent) {
  const prompt = `Compare these two versions of a regulatory document and summarize what changed.

Old version:
${oldContent.substring(0, 3000)}

New version:
${newContent.substring(0, 3000)}

Summary of changes:`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'llama3-8b-8192',
    temperature: 0.3,
    max_tokens: 500,
  });

  return completion.choices[0]?.message?.content || 'Unable to determine changes';
}
