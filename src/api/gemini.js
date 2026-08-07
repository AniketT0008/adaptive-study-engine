const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Low-level Gemini API call. Sends a prompt, expects JSON back.
 * @param {string} prompt - The prompt to send
 * @param {string} apiKey - Gemini API key
 * @returns {Object|null} Parsed JSON response, or null on failure
 */
export async function callGemini(prompt, apiKey) {
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
      console.error('Gemini API error:', response.status, await response.text());
      return null;
    }
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    
    // Try to parse JSON directly
    try {
      return JSON.parse(text);
    } catch {
      // Try to extract JSON from markdown fences
      const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        try {
          return JSON.parse(match[1].trim());
        } catch {
          console.error('Failed to parse extracted JSON');
          return null;
        }
      }
      console.error('Failed to parse Gemini response as JSON:', text.substring(0, 200));
      return null;
    }
  } catch (e) {
    clearTimeout(timeoutId);
    if (e.name === 'AbortError') {
      console.error('Gemini API call timed out after 30 seconds');
    } else {
      console.error('Gemini API call failed:', e);
    }
    return null;
  }
}

/**
 * Extracts concepts from course material using Gemini.
 * @param {string} material - Raw course text
 * @param {string} apiKey - Gemini API key
 * @returns {Array|null} Array of { label, sourceSnippet } or null on failure
 */
export async function extractConcepts(material, apiKey) {
  const prompt = `You are an educational content analyzer. Extract 10-20 atomic, testable concepts from the following course material.

For each concept, provide:
- "label": A short, clear name for the concept (2-5 words)
- "sourceSnippet": A 2-3 sentence excerpt or summary from the material that teaches this concept

Return a JSON array of objects. Example:
[{"label": "Photosynthesis Process", "sourceSnippet": "Photosynthesis converts light energy into chemical energy..."}]

Course material:
${material}`;

  const result = await callGemini(prompt, apiKey);
  if (!result || !Array.isArray(result)) return null;
  return result;
}

/**
 * Generates quiz questions for a set of concepts using Gemini.
 * @param {Array} concepts - Array of { id, label, sourceSnippet }
 * @param {string} apiKey - Gemini API key
 * @returns {Array|null} Array of question objects or null on failure
 */
export async function generateQuestions(concepts, apiKey) {
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
- "answer": The correct answer (for mcq, the exact text of the correct option)
- "explanation": 1-2 sentences explaining why this is correct

Return a JSON array of question objects. Mix question types and difficulties across the set.`;

  const result = await callGemini(prompt, apiKey);
  if (!result || !Array.isArray(result)) return null;
  
  // Add IDs to questions
  return result.map((q, i) => ({
    id: 'q-gen-' + i,
    ...q
  }));
}

export async function extractTextFromFile(file, apiKey) {
  // Convert file to base64
  const reader = new FileReader();
  const base64Promise = new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const base64Data = await base64Promise;
  
  const mimeType = file.type || 'application/octet-stream';
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);
  
  try {
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inlineData: { mimeType, data: base64Data } },
            { text: 'Extract all the text content from this document or image. Return the extracted text as a plain string, preserving paragraph structure. Do not add any commentary or formatting — just the raw text content.' }
          ]
        }],
        generationConfig: { temperature: 0.1 }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    if (!response.ok) {
      console.error('Gemini file extraction error:', response.status);
      return null;
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (e) {
    clearTimeout(timeoutId);
    console.error('File extraction failed:', e);
    return null;
  }
}
