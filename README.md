# Synapse - AI-Powered Spaced Repetition Study Engine

**CUTC Transform Hackathon 2026 Submission**

Live Application: https://AniketT0008.github.io/adaptive-study-engine/

## Key Features

- Interactive Teacher Mode for lesson-by-lesson learning before quizzes.
- Expanded Ontario and university course decks with units, lessons, examples, and practice questions.
- Adaptive spaced repetition powered by the SuperMemo-2 (SM-2) algorithm.
- Multimodal material import: paste notes or upload text, image, PDF, or markdown files.
- Analytics dashboard with mastery, accuracy, recall history, and targeted-vs-random review simulation.
- Strict content validation, versioned local storage, and import/export safeguards.
- Keyboard-accessible quizzes, reduced-motion support, and KaTeX math rendering.

## How Adaptation Works

Synapse uses the SuperMemo-2 (SM-2) spaced-repetition model to decide when a lesson should return. Each answer updates that lesson's mastery, repetition count, review interval, and ease factor. Correct retrieval increases the interval; an incorrect answer brings the lesson back sooner. The review selector also considers recent accuracy and avoids immediately repeating the same question when another assessment is available.

Focus Review applies this model to the weakest quarter of a deck. It keeps each weak lesson together for recognition, recall, and written transfer rather than sending the learner back to the deck after a single prompt. Teacher Mode uses the same history to recommend whether a learner should build foundations, rebuild the model, strengthen recall, or transfer the concept to a new problem.

## Import Notes

Text and Markdown files are read directly in the browser. PDF and image extraction use a Gemini API key because they require OCR/visual understanding. Reliable custom lesson and question generation also requires a verified Gemini key; Synapse does not silently save generic fallback questions when generation fails. The import control accepts PDF, PNG, JPG, JPEG, WEBP, TXT, and Markdown files; it deliberately does not claim support for Word documents.

## Built With

- React 19
- Vite 8
- Tailwind CSS v4
- React Router 7
- Recharts
- Web Audio API
- KaTeX
- Gemini 2.5 Flash (with a 2.0 Flash compatibility fallback)

## Local Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run content:validate
npm run test
npm run build
npm run test:e2e
```

Run the complete release gate with `npm run verify`.
