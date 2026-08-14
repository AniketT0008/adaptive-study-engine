import { getQuestionSet, rotateOptions } from '../engine/teaching.js';

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash'];
const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MAX_INLINE_FILE_BYTES = 50 * 1024 * 1024;

function buildApiUrl(model, apiKey) {
  return `${API_BASE_URL}/${model}:generateContent?key=${apiKey}`;
}

function getResponseText(data) {
  return data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('\n').trim() || '';
}

async function requestGemini(payload, apiKey, { responseMimeType, timeoutMs = 30000 } = {}) {
  if (!apiKey || !apiKey.trim()) {
    return { ok: false, error: 'Missing Gemini API key.' };
  }

  let lastError = 'Gemini API request failed.';

  for (const model of GEMINI_MODELS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(buildApiUrl(model, apiKey.trim()), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          generationConfig: {
            ...(payload.generationConfig || {}),
            ...(responseMimeType ? { responseMimeType } : {}),
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        lastError = `Gemini ${model} returned ${response.status}${detail ? `: ${detail.slice(0, 180)}` : ''}`;
        continue;
      }

      return { ok: true, model, data: await response.json() };
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error?.name === 'AbortError'
        ? `Gemini ${model} timed out.`
        : `Gemini ${model} could not be reached.`;
    }
  }

  return { ok: false, error: lastError };
}

function labelFromSnippet(snippet, index) {
  const sentence = String(snippet || '').split(/[.!?]/)[0].trim();
  if (!sentence) return `Topic ${index + 1}`;

  const named = sentence.match(/^(?:The|A|An)\s+([A-Za-z][A-Za-z0-9\s-]{1,48}?)(?:\s+(?:is|are|describes?|requires?|means|uses|connects|measures|equals)\b)/i);
  if (named?.[1]) {
    return named[1].replace(/\s+/g, ' ').trim().replace(/^\w/, (c) => c.toUpperCase());
  }

  const beforeVerb = sentence.match(/^([A-Z][A-Za-z0-9\s-]{1,40}?)(?:\s+(?:describe|require|connect|measure|use|mean|equal|represent)s?\b)/i);
  if (beforeVerb?.[1] && beforeVerb[1].split(/\s+/).length <= 4) {
    return beforeVerb[1].trim();
  }

  const stop = new Set(['the', 'a', 'an', 'is', 'are', 'of', 'and', 'to', 'for', 'with', 'that', 'this', 'as', 'from']);
  const words = sentence.replace(/[^a-zA-Z0-9\s-]/g, '').split(/\s+/).filter((word) => word.length > 2 && !stop.has(word.toLowerCase()));
  if (words.length === 0) return `Topic ${index + 1}`;
  return words.slice(0, 3).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

/**
 * Local rule-based concept & question generator fallback when no API key is provided or API fails.
 */
export function generateLocalDeckFromText(text) {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 30);
  const rawBlocks = paragraphs.length >= 3
    ? paragraphs
    : text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length >= 10);

  const concepts = [];
  const questions = [];
  const count = Math.min(12, Math.max(1, rawBlocks.length));

  for (let i = 0; i < count; i++) {
    const snippet = rawBlocks[i] || rawBlocks[i % rawBlocks.length] || 'Key concept from course notes.';
    const label = labelFromSnippet(snippet, i);
    const conceptId = `c-local-${Date.now()}-${i}`;

    concepts.push({
      id: conceptId,
      label,
      unit: 'Imported Material',
      topics: [label],
      sourceSnippet: snippet.trim(),
      example: `Worked check for ${label}: restated from the notes — ${snippet.trim().slice(0, 180)}${snippet.length > 180 ? '…' : ''}`,
      learningGoal: `Explain ${label} and apply it to a fresh example from the imported material.`,
      commonMistake: `Treating ${label} as a definition to memorize instead of checking when it applies.`,
      mastery: 0,
      easinessFactor: 2.5,
      interval: 1,
      repetitions: 0,
      nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      history: [],
    });

    const claim = String(snippet).split(/[.!?]/)[0].trim() || snippet.trim().slice(0, 90);
    const excerpt = snippet.length > 140 ? `${snippet.trim().slice(0, 140)}…` : snippet.trim();
    questions.push(
      {
        id: `q-local-${conceptId}-easy`,
        conceptId,
        type: 'mcq',
        difficulty: 'easy',
        prompt: `The notes on ${label} include: "${excerpt}" Which claim is actually in that passage?`,
        options: [
          claim,
          `${label} is defined by discarding the given conditions.`,
          `The notes say ${label} never applies to this material.`,
          `The passage only lists unrelated formulas with no claim about ${label}.`,
        ],
        answer: claim,
        explanation: `The imported notes support this wording: ${claim}.`,
        requiresSelfAssessment: false,
      },
      {
        id: `q-local-${conceptId}-medium`,
        conceptId,
        type: 'mcq',
        difficulty: 'medium',
        prompt: `Using the notes on ${label}, which application is justified?`,
        options: [
          `Keep the stated conditions, apply ${label}, and interpret the result in that same setting.`,
          `Reuse a memorized number from another topic even if the givens changed.`,
          `Ignore the notes and guess from the heading ${label} alone.`,
          `Change the original conditions until a familiar formula becomes easier to use.`,
        ],
        answer: `Keep the stated conditions, apply ${label}, and interpret the result in that same setting.`,
        explanation: `A justified application starts from the imported conditions for ${label}, not from a title or a leftover number.`,
        requiresSelfAssessment: false,
      },
      {
        id: `q-local-${conceptId}-hard`,
        conceptId,
        type: 'mcq',
        difficulty: 'hard',
        prompt: `A student memorizes the heading "${label}" and ignores this sentence: "${claim}." What went wrong?`,
        options: [
          `They used the title instead of the stated conditions in the notes.`,
          `They should have deleted units and signs before answering.`,
          `The heading is enough; the sentence can be ignored.`,
          `They needed a longer heading rather than the given conditions.`,
        ],
        answer: `They used the title instead of the stated conditions in the notes.`,
        explanation: `The heading names the topic; the notes supply the conditions that make ${label} applicable.`,
        requiresSelfAssessment: false,
      },
    );
  }

  return { concepts, questions };
}

/**
 * Low-level Gemini API call. Sends a prompt, expects JSON back.
 */
export async function callGemini(prompt, apiKey) {
  const result = await requestGemini({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.3 },
  }, apiKey, { responseMimeType: 'application/json' });

  if (!result.ok) {
    console.error(result.error);
    return null;
  }

  const text = getResponseText(result.data);
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (!match) return null;

    try {
      return JSON.parse(match[1].trim());
    } catch {
      return null;
    }
  }
}

export async function testGeminiConnection(apiKey) {
  const result = await requestGemini({
    contents: [{ parts: [{ text: 'Return exactly this JSON object: {"status":"ok"}' }] }],
    generationConfig: { temperature: 0 },
  }, apiKey, { responseMimeType: 'application/json', timeoutMs: 15000 });

  if (!result.ok) return { ok: false, error: result.error };

  const text = getResponseText(result.data);
  try {
    const parsed = JSON.parse(text);
    if (parsed.status === 'ok') return { ok: true, model: result.model };
  } catch {
    return { ok: true, model: result.model };
  }

  return { ok: false, error: 'Gemini responded, but the health-check payload was unexpected.' };
}

/**
 * Gemini call for plain-text responses (AI tutor, explanations).
 */
export async function callGeminiText(prompt, apiKey) {
  const result = await requestGemini({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.4 },
  }, apiKey);

  if (!result.ok) {
    console.error(result.error);
    return null;
  }

  return getResponseText(result.data) || null;
}

/**
 * Extracts concepts from course material using Gemini or local NLP fallback.
 */
export async function extractConcepts(material, apiKey) {
  if (!material || material.trim().length < 50) {
    return generateLocalDeckFromText(material || '').concepts;
  }

  if (apiKey && apiKey.trim()) {
    const prompt = `You are an educational content analyzer preparing material for a rigorous first-year university course. Extract 8-15 atomic, testable concepts from the following course material.

For each concept, provide:
- "label": A short, clear name for the concept (2-5 words)
- "unit": The unit or module name this concept belongs to (e.g. "Unit 2: Derivatives")
- "topics": An array of 2-4 specific sub-topics covered by this concept
- "sourceSnippet": Two cohesive textbook paragraphs: first define all important terms; then explain the mechanism, derivation, or causal relationship and its conditions
- "intuition": A distinct conceptual explanation or analogy that is accurate for this concept, not a repeated generic study strategy
- "workedExplanation": A detailed method that names what happens at each step and why that step is valid
- "example": A fresh worked example with 4-6 numbered steps, changed values or conditions, visible formulas/calculations/code/reaction bookkeeping where relevant, and a final independent check
- "learningGoal": One observable skill the student should demonstrate after the lesson
- "commonMistake": One plausible misconception or error to watch for

Return a JSON array of objects.

Course material:
${material}`;

    const result = await callGemini(prompt, apiKey);
    if (result && Array.isArray(result) && result.length > 0) {
      return result;
    }
  }

  return generateLocalDeckFromText(material).concepts;
}

/**
 * Generates quiz questions using Gemini or local template fallback.
 */
export async function generateQuestions(concepts, apiKey) {
  if (apiKey && apiKey.trim()) {
    const conceptList = concepts.map(c => `- ID: "${c.id}", Label: "${c.label}", Unit: "${c.unit || 'Imported Material'}", Snippet: "${c.sourceSnippet}"`).join('\n');

    const prompt = `You are a rigorous textbook-style assessment writer. For each concept below, generate exactly 3 multiple-choice questions.

Concepts:
${conceptList}

Requirements:
- Every question must be multiple choice with exactly 4 options and exactly 1 correct answer.
- Do not generate fill-in-the-blank, cloze, short-answer, self-assessment, confidence-rating, or vague reflection questions.
- Questions must be concrete and course-like: use numerical values, equations, data, code traces, chemical equations, diagrams described in text, or realistic scenarios whenever the subject supports them.
- Avoid asking students to simply define a term. Test application, interpretation, calculation, prediction, or comparison.
- Difficulty must progress from easy to medium to hard.
- Distractors should reflect plausible mistakes, not jokes or obviously unrelated answers.
- Place the correct answer at a varied option index. Do not consistently put it first.
- At least one question per concept must require calculation, code tracing, diagram interpretation, mechanism prediction, data interpretation, or error analysis when the subject allows it.
- The explanation must show the key reasoning or calculation.

For each question return:
- "conceptId"
- "type": "mcq"
- "difficulty": "easy", "medium", or "hard"
- "prompt"
- "options": exactly 4 strings
- "answer": exactly one of the option strings
- "explanation"

Return only a JSON array.`;
    const result = await callGemini(prompt, apiKey);
    if (result && Array.isArray(result) && result.length > 0) {
      return result
        .filter((q) => q && q.type === 'mcq' && Array.isArray(q.options) && q.options.length === 4 && q.options.includes(q.answer))
        .map((q, i) => ({
          id: `q-gen-${q.conceptId}-${q.difficulty || 'medium'}-${i}`,
          ...q,
          type: 'mcq',
          options: rotateOptions(q.answer, q.options.filter((option) => option !== q.answer).slice(0, 3), `${q.conceptId}-${q.difficulty}-${i}`),
          requiresSelfAssessment: false,
        }));
    }
  }

  const questions = [];
  concepts.forEach((concept) => {
    getQuestionSet(concept).forEach((spec) => questions.push({
      id: `q-gen-${concept.id}-${spec.difficulty}`,
      conceptId: concept.id,
      type: 'mcq',
      difficulty: spec.difficulty,
      prompt: spec.prompt,
      options: rotateOptions(spec.answer, spec.distractors, `${concept.id}-${spec.difficulty}`),
      answer: spec.answer,
      explanation: spec.explanation,
      visual: spec.visual,
      requiresSelfAssessment: false,
    }));
  });
  return questions;
}

/**
 * Extracts text from uploaded PDF, Image (PNG/JPG/JPEG/WEBP), or text file.
 */
export async function extractTextFromFile(file, apiKey) {
  if (!file) return null;
  if (file.size > MAX_INLINE_FILE_BYTES) {
    throw new Error('Gemini supports inline PDF/image extraction up to 50MB. Try a smaller file or split the document.');
  }

  if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result || null);
      reader.onerror = () => resolve(null);
      reader.readAsText(file);
    });
  }

  const isGeminiReadable = file.type.startsWith('image/') || file.type === 'application/pdf';
  if (!isGeminiReadable) {
    throw new Error('Unsupported file type. Upload .txt, .md, PDF, PNG, JPG, JPEG, or WEBP.');
  }

  if (!apiKey || !apiKey.trim()) {
    throw new Error('Add and verify a Gemini API key to extract text from images or PDFs.');
  }

  const reader = new FileReader();
  const base64Promise = new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const base64Data = await base64Promise;
  const mimeType = file.type || 'application/octet-stream';
  const result = await requestGemini({
    contents: [{
      parts: [
        { inlineData: { mimeType, data: base64Data } },
        { text: 'Extract all educational text, diagrams, formulas, and notes from this document or image. Return plain extracted text with headings when possible.' },
      ],
    }],
    generationConfig: { temperature: 0.1 },
  }, apiKey, { timeoutMs: 45000 });

  if (!result.ok) {
    throw new Error(result.error || 'Gemini could not extract readable text from that file.');
  }

  const extracted = getResponseText(result.data);
  if (!extracted) {
    throw new Error('Gemini responded, but no readable text was returned.');
  }
  return extracted;
}

