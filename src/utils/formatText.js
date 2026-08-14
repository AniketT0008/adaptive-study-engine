const SUPER_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';

/**
 * Render simple math tokens for UI copy: x^2 → x², pi → π.
 */
export function formatMath(text) {
  if (text == null) return '';
  return String(text)
    .replace(/\^(\d+)/g, (_, digits) => [...digits].map((d) => SUPER_DIGITS[Number(d)] ?? d).join(''))
    .replace(/\bpi\b/gi, 'π');
}

/**
 * Strip markdown bold/italic markers for plain display.
 */

export function stripMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Leftover bullet/emphasis asterisks that weren't part of a matched pair
    // (e.g. "* Step one" list markers, or a stray trailing "*")
    .replace(/^\s*\*\s+/gm, '• ')
    .replace(/\*/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

/**
 * Removes duplicate/near-duplicate lines or paragraphs from AI output
 * (guards against the model repeating the same "explanation" twice).
 */
export function dedupeLines(text) {
  if (!text) return '';
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const seen = new Set();
  const deduped = [];
  for (const block of blocks) {
    const key = block.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(block);
  }
  return deduped.join('\n\n');
}

/**
 * Split prose into short paragraphs for textbook-style layout.
 */
export function toParagraphs(text) {
  return dedupeLines(stripMarkdown(text))
    .split(/\n{2,}|\n(?=[•-]\s)/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Detect casual/greeting messages that aren't real study questions.
 */
export function isCasualMessage(text) {
  if (!text) return true;
  const normalized = text.trim().toLowerCase().replace(/[!?.,]+$/g, '');
  if (!normalized) return true;

  const casual = new Set([
    'hi', 'hey', 'hello', 'yo', 'sup', 'hiya', 'howdy', 'hi there', 'hey there',
    'thanks', 'thank you', 'ty', 'thx', 'appreciate it',
    'ok', 'okay', 'k', 'kk', 'cool', 'nice', 'great', 'awesome', 'sweet',
    'help', 'test', 'testing', 'lol', 'lmao', 'haha',
    'hii', 'heyy', 'heyyy', 'hiii', 'good morning', 'good afternoon',
    'good evening', 'whats up', "what's up", 'yes', 'no', 'yep', 'nope',
  ]);
  if (casual.has(normalized)) return true;

  // Very short input with no digits/math/question-like structure isn't a real study question
  if (normalized.length <= 4 && /^[a-z\s]+$/.test(normalized)) return true;

  return false;
}
