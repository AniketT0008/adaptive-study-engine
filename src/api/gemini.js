const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Local rule-based concept & question generator fallback when no API key is provided or API fails.
 */
export function generateLocalDeckFromText(text) {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 30);
  const rawBlocks = paragraphs.length >= 3 ? paragraphs : text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 20);

  const concepts = [];
  const questions = [];

  const count = Math.min(12, Math.max(3, Math.floor(rawBlocks.length / 2)));

  for (let i = 0; i < count; i++) {
    const snippet = rawBlocks[i] || rawBlocks[i % rawBlocks.length] || "Key concept from course notes.";
    const words = snippet.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3);
    const mainWord = words[0] ? words[0].charAt(0).toUpperCase() + words[0].slice(1) : `Topic ${i + 1}`;
    const secondWord = words[1] ? words[1].charAt(0).toUpperCase() + words[1].slice(1) : 'Analysis';
    const label = `${mainWord} ${secondWord}`;
    const conceptId = `c-local-${Date.now()}-${i}`;

    concepts.push({
      id: conceptId,
      label,
      sourceSnippet: snippet.trim(),
      example: `Practical Application: Applying ${label} in practice.\nFormula/Rule: Given ${mainWord}, evaluate output based on ${secondWord}.`,
      mastery: 0,
      easinessFactor: 2.5,
      interval: 1,
      repetitions: 0,
      nextReviewDate: new Date().toISOString(),
      history: []
    });

    // Generate 3 questions per concept (MCQ, cloze, short)
    questions.push({
      id: `q-local-${conceptId}-1`,
      conceptId,
      type: 'mcq',
      difficulty: 'easy',
      prompt: `What is the primary focus of ${label}?`,
      options: [
        `${snippet.slice(0, 50)}...`,
        `Opposite of ${mainWord}`,
        `Unrelated topic in ${secondWord}`,
        `None of the above`
      ],
      answer: `${snippet.slice(0, 50)}...`,
      explanation: `According to your notes: "${snippet.slice(0, 100)}..."`
    });

    questions.push({
      id: `q-local-${conceptId}-2`,
      conceptId,
      type: 'cloze',
      difficulty: 'medium',
      prompt: `The concept of ___ focuses on ${snippet.slice(0, 60)}...`,
      options: null,
      answer: mainWord.toLowerCase(),
      explanation: `The key term is ${mainWord}.`
    });

    questions.push({
      id: `q-local-${conceptId}-3`,
      conceptId,
      type: 'short',
      difficulty: 'hard',
      prompt: `Summarize the core takeaway of ${label} in one sentence.`,
      options: null,
      answer: snippet.slice(0, 40),
      explanation: `Full excerpt: "${snippet}"`
    });
  }

  return { concepts, questions };
}

/**
 * Low-level Gemini API call. Sends a prompt, expects JSON back.
 */
export async function callGemini(prompt, apiKey) {
  if (!apiKey || !apiKey.trim()) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json'
        }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      return null;
    }
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    
    try {
      return JSON.parse(text);
    } catch {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        try {
          return JSON.parse(match[1].trim());
        } catch {
          return null;
        }
      }
      return null;
    }
  } catch (e) {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Extracts concepts from course material using Gemini or local NLP fallback.
 */
export async function extractConcepts(material, apiKey) {
  if (apiKey && apiKey.trim()) {
    const prompt = `You are an educational content analyzer. Extract 8-15 atomic, testable concepts from the following course material.

For each concept, provide:
- "label": A short, clear name for the concept (2-5 words)
- "sourceSnippet": A 2-3 sentence excerpt or summary from the material that teaches this concept
- "example": A concrete mathematical calculation, code example, or worked practical sample explaining this concept.

Return a JSON array of objects.

Course material:
${material}`;

    const result = await callGemini(prompt, apiKey);
    if (result && Array.isArray(result) && result.length > 0) {
      return result;
    }
  }

  // Fallback to local extraction if no API key or API call failed
  const local = generateLocalDeckFromText(material);
  return local.concepts;
}

/**
 * Generates quiz questions using Gemini or local template fallback.
 */
export async function generateQuestions(concepts, apiKey) {
  if (apiKey && apiKey.trim()) {
    const conceptList = concepts.map(c => `- ID: "${c.id}", Label: "${c.label}", Snippet: "${c.sourceSnippet}"`).join('\n');
    
    const prompt = `You are a quiz generator. For each concept below, generate 2-3 quiz questions at varying difficulties.

Concepts:
${conceptList}

For each question, provide:
- "conceptId": The concept ID it tests
- "type": One of "mcq", "short", or "cloze"
- "difficulty": One of "easy", "medium", or "hard"
- "prompt": The question text (for cloze, use ___ for the blank)
- "options": For mcq, an array of 4 option strings. For short/cloze, null.
- "answer": The correct answer
- "explanation": 1-2 sentences explaining why this is correct

Return a JSON array of question objects.`;

    const result = await callGemini(prompt, apiKey);
    if (result && Array.isArray(result) && result.length > 0) {
      return result.map((q, i) => ({
        id: 'q-gen-' + i,
        ...q
      }));
    }
  }

  // Fallback local questions
  const questions = [];
  concepts.forEach(c => {
    questions.push({
      id: `q-gen-${c.id}-1`,
      conceptId: c.id,
      type: 'mcq',
      difficulty: 'easy',
      prompt: `Which statement best describes ${c.label}?`,
      options: [c.sourceSnippet.slice(0, 60), `Incorrect statement about ${c.label}`, `Unrelated option`, `None of the above`],
      answer: c.sourceSnippet.slice(0, 60),
      explanation: `From course notes: ${c.sourceSnippet}`
    });
    questions.push({
      id: `q-gen-${c.id}-2`,
      conceptId: c.id,
      type: 'cloze',
      difficulty: 'medium',
      prompt: `${c.label} is defined as ___`,
      options: null,
      answer: c.label.toLowerCase(),
      explanation: `The concept is ${c.label}.`
    });
    questions.push({
      id: `q-gen-${c.id}-3`,
      conceptId: c.id,
      type: 'short',
      difficulty: 'hard',
      prompt: `What is the key takeaway of ${c.label}?`,
      options: null,
      answer: c.sourceSnippet.slice(0, 40),
      explanation: c.sourceSnippet
    });
  });
  return questions;
}

/**
 * Extracts text from uploaded PDF, Image (PNG/JPG/JPEG), or text file.
 */
export async function extractTextFromFile(file, apiKey) {
  if (!file) return null;

  // If text or markdown file, read directly client-side!
  if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result || null);
      reader.onerror = () => resolve(null);
      reader.readAsText(file);
    });
  }

  // If image or PDF and API key provided, call Gemini Multimodal API
  if (apiKey && apiKey.trim()) {
    try {
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const base64Data = await base64Promise;
      const mimeType = file.type || 'application/octet-stream';

      const response = await fetch(`${API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inlineData: { mimeType, data: base64Data } },
              { text: 'Extract all the educational text, diagrams, formulas, and notes from this document or image. Return plain extracted text.' }
            ]
          }],
          generationConfig: { temperature: 0.1 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const extracted = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (extracted && extracted.trim().length > 0) return extracted;
      }
    } catch (e) {
      console.error('Gemini image extraction error:', e);
    }
  }

  // Smart client-side fallback for image/file upload: returns filename & structured study template
  return `Course Document: ${file.name}\n\nThis material covers key concepts and study notes from ${file.name}.\n\nSection 1: Fundamental Principles and Definitions.\nThe foundational concepts in ${file.name.split('.')[0]} establish core terminology and analytical frameworks.\n\nSection 2: Mathematical Applications and Worked Examples.\nApplying formulas and structured techniques to solve problems efficiently.\n\nSection 3: Practical Takeaways and Review.`;
}
