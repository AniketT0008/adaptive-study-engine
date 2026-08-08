import { useState, useEffect } from 'react';
import { playSound } from '../utils/audio.js';

const typeLabels = { mcq: 'Multiple Choice', short: 'Short Answer', cloze: 'Fill in the Blank' };
const diffLabels = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

export default function QuestionCard({ question, concept, onAnswer }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setIsSubmitted(false);
    setIsCorrect(false);
    setInputValue('');
    setSelectedOption(null);
  }, [question?.id]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore keybindings if user is typing in a text input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) && !isSubmitted) {
        return;
      }

      if (!isSubmitted) {
        if (question.type === 'mcq' && question.options) {
          const numKey = parseInt(e.key, 10);
          if (numKey >= 1 && numKey <= question.options.length) {
            e.preventDefault();
            handleMCQSelect(question.options[numKey - 1]);
          }
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, question, selectedOption, inputValue, isCorrect]);

  const checkAnswer = (val) => {
    const answerStr = String(question.answer).trim().toLowerCase();
    const valStr = String(val).trim().toLowerCase();
    return answerStr === valStr;
  };

  const handleMCQSelect = (opt) => {
    if (isSubmitted) return;
    setSelectedOption(opt);
    const correct = checkAnswer(opt);
    setIsCorrect(correct);
    setIsSubmitted(true);
    playSound(correct ? 'correct' : 'wrong');
  };

  const handleTextSubmit = () => {
    if (isSubmitted || !inputValue.trim()) return;
    const correct = checkAnswer(inputValue);
    setIsCorrect(correct);
    setIsSubmitted(true);
    playSound(correct ? 'correct' : 'wrong');
  };

  const handleNext = () => {
    playSound('click');
    onAnswer(isCorrect, question);
  };

  const diffBadgeClass = {
    easy: 'badge-easy',
    medium: 'badge-medium',
    hard: 'badge-hard',
  }[question.difficulty] || 'badge-medium';

  const typeBadgeClass = {
    mcq: 'badge-mcq',
    short: 'badge-short',
    cloze: 'badge-cloze',
  }[question.type] || 'badge-mcq';

  return (
    <div key={question?.id} className={`glass-strong p-6 sm:p-8 rounded-2xl transition-all duration-200 animate-card-advance ${
      isSubmitted ? (isCorrect ? 'animate-correct border-[var(--color-success)]/50 shadow-[0_0_25px_rgba(0,206,201,0.25)]' : 'animate-shake border-[var(--color-danger)]/50 shadow-[0_0_25px_rgba(255,118,117,0.25)]') : ''
    }`}>
      {/* Badges & Keyboard hint */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="badge bg-[rgba(108,92,231,0.15)] text-[#a29bfe]">
            {concept?.label || 'Concept'}
          </span>
          <span className={`badge ${diffBadgeClass}`}>
            {diffLabels[question.difficulty] || question.difficulty}
          </span>
          <span className={`badge ${typeBadgeClass}`}>
            {typeLabels[question.type] || question.type}
          </span>
        </div>
        
        {question.type === 'mcq' && !isSubmitted && (
          <span className="text-xs text-[var(--color-text-muted)] bg-white/[0.04] px-2.5 py-1 rounded-full font-mono">
            ⌨️ Press 1-{question.options?.length || 4} to answer
          </span>
        )}
      </div>

      {/* Question prompt (MCQ and Short show it here) */}
      {question.type !== 'cloze' && (
        <p className="text-xl font-semibold text-[var(--color-text)] mb-6 leading-relaxed">
          {question.prompt}
        </p>
      )}

      {/* MCQ options */}
      {question.type === 'mcq' && question.options && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const isOptCorrect = checkAnswer(opt);

            let cardClass = 'glass p-4 rounded-xl text-left transition-all duration-200 cursor-pointer border-2 relative ';
            if (!isSubmitted) {
              cardClass += 'border-transparent hover:border-[var(--color-accent)] hover:bg-white/[0.03]';
            } else {
              cardClass += 'cursor-default ';
              if (isSelected && isOptCorrect) {
                cardClass += 'border-[var(--color-success)] bg-[rgba(0,206,201,0.1)]';
              } else if (isSelected && !isOptCorrect) {
                cardClass += 'border-[var(--color-danger)] bg-[rgba(255,118,117,0.1)]';
              } else if (isOptCorrect) {
                cardClass += 'border-[var(--color-success)] bg-[rgba(0,206,201,0.05)]';
              } else {
                cardClass += 'border-transparent opacity-40';
              }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleMCQSelect(opt)}
                className={cardClass}
              >
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[var(--color-text-muted)] bg-white/[0.06] w-5 h-5 rounded flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-[var(--color-text)] text-sm font-medium">{opt}</span>
                  </div>
                  {isSubmitted && isSelected && isOptCorrect && <span className="text-[var(--color-success)] font-bold text-lg">✓</span>}
                  {isSubmitted && isSelected && !isOptCorrect && <span className="text-[var(--color-danger)] font-bold text-lg">✗</span>}
                  {isSubmitted && !isSelected && isOptCorrect && <span className="text-[var(--color-success)] font-bold text-lg">✓</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Short answer */}
      {question.type === 'short' && (
        <div className="flex gap-3">
          <input
            type="text"
            disabled={isSubmitted}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
            placeholder="Type your answer and press Enter..."
            className="flex-1"
            autoFocus
          />
          {!isSubmitted && (
            <button
              disabled={!inputValue.trim()}
              onClick={handleTextSubmit}
              className="btn-primary disabled:opacity-40"
            >
              Submit
            </button>
          )}
        </div>
      )}

      {/* Cloze */}
      {question.type === 'cloze' && (
        <div className="text-lg font-medium text-[var(--color-text)] leading-relaxed">
          {question.prompt.split('___').map((part, index, arr) => (
            <span key={index}>
              <span>{part}</span>
              {index < arr.length - 1 && (
                <input
                  type="text"
                  disabled={isSubmitted}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                  className="inline-block mx-1 w-36 border-b-2 border-[var(--color-accent)] bg-[var(--color-surface-2)] text-center rounded-t px-2 py-1 text-base"
                  autoFocus
                />
              )}
            </span>
          ))}
          {!isSubmitted && (
            <button
              disabled={!inputValue.trim()}
              onClick={handleTextSubmit}
              className="btn-primary ml-4 text-sm px-4 py-2 disabled:opacity-40"
            >
              Submit
            </button>
          )}
        </div>
      )}

      {/* Feedback */}
      {isSubmitted && (
        <div className="mt-6 animate-slide-up space-y-4">
          {isCorrect ? (
            <div className="glass p-4 rounded-xl border border-[rgba(0,206,201,0.3)] bg-[rgba(0,206,201,0.08)]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <h4 className="font-bold text-[var(--color-success)]">Correct!</h4>
                  <p className="text-sm text-[var(--color-text-muted)]">{question.explanation || 'Great job!'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass p-4 rounded-xl border border-[rgba(255,118,117,0.3)] bg-[rgba(255,118,117,0.08)]">
              <h4 className="font-bold text-[var(--color-danger)] flex items-center gap-2 mb-2">
                <span>✗</span> Incorrect
              </h4>
              <p className="text-sm text-[var(--color-text)] mb-2">
                <span className="text-[var(--color-text-muted)]">Correct answer: </span>
                <span className="font-semibold text-[var(--color-success)]">{question.answer}</span>
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mb-3">{question.explanation}</p>
              {concept?.sourceSnippet && (
                <div className="mt-3 pt-3 border-t border-white/[0.06]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">From your course material</span>
                  <p className="text-sm italic text-[var(--color-text-muted)] bg-[var(--color-surface-2)] p-3 rounded-lg">
                    "{concept.sourceSnippet}"
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-text-muted)] font-mono">
              Press [Enter] or [Space] for Next
            </span>
            <button onClick={handleNext} className="btn-primary flex items-center gap-2">
              Next <span className="text-lg">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
