import { useState, useEffect, useCallback } from 'react';
import { playSound } from '../utils/audio.js';
import ConceptDiagram from './ConceptDiagram.jsx';
import { getConceptDiagramType } from './conceptDiagramSelection.js';
import { validateQuestion } from '../data/validation.js';
import MathText from './MathText.jsx';

const diffLabels = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

export default function QuestionCard({ question, concept, courseCode, onAnswer, onCommit, onNext }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setIsSubmitted(false);
    setIsCorrect(false);
    setSelectedOption(null);
  }, [question?.id]);

  const checkAnswer = useCallback((value) => (
    String(value).trim().toLowerCase() === String(question?.answer || '').trim().toLowerCase()
  ), [question?.answer]);

  const handleSelect = useCallback((option) => {
    if (isSubmitted) return;
    const correct = checkAnswer(option);
    setSelectedOption(option);
    setIsCorrect(correct);
    setIsSubmitted(true);
    playSound(correct ? 'correct' : 'wrong');
    if (onCommit) onCommit(correct, question);
  }, [checkAnswer, isSubmitted, onCommit, question]);

  const handleNext = useCallback(() => {
    playSound('click');
    if (onNext) onNext();
    else onAnswer?.(isCorrect, question);
  }, [isCorrect, onAnswer, onNext, question]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isSubmitted) {
        const index = Number.parseInt(event.key, 10) - 1;
        if (index >= 0 && index < (question.options?.length || 0)) {
          event.preventDefault();
          handleSelect(question.options[index]);
        }
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handleSelect, isSubmitted, question?.options]);

  const validationErrors = validateQuestion(question);
  if (validationErrors.length > 0) {
    return (
      <div role="alert" className="glass-strong rounded-2xl border border-[var(--color-danger)]/40 p-6">
        <h3 className="font-bold text-[var(--color-danger)]">This question cannot be displayed</h3>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{validationErrors[0]}</p>
      </div>
    );
  }

  const diffBadgeClass = {
    easy: 'badge-easy',
    medium: 'badge-medium',
    hard: 'badge-hard',
  }[question.difficulty] || 'badge-medium';
  const diagramSnippet = `${concept?.shortDefinition || ''} ${question.prompt}`;
  const hasSpecificDiagram = Boolean(getConceptDiagramType({
    courseCode,
    label: concept?.label,
    snippet: diagramSnippet,
  }));

  return (
    <div className={`glass-strong p-6 sm:p-8 rounded-2xl transition-all duration-200 animate-card-advance ${
      isSubmitted
        ? (isCorrect
          ? 'animate-correct border-[var(--color-success)]/50 shadow-[0_0_25px_rgba(0,206,201,0.25)]'
          : 'animate-shake border-[var(--color-danger)]/50 shadow-[0_0_25px_rgba(255,118,117,0.25)]')
        : ''
    }`}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="badge bg-[rgba(108,92,231,0.15)] text-[#a29bfe]">
            {concept?.label || 'Concept'}
          </span>
          <span className={`badge ${diffBadgeClass}`}>
            {diffLabels[question.difficulty] || question.difficulty}
          </span>
          <span className="badge badge-mcq">Multiple Choice</span>
        </div>
        {!isSubmitted && (
          <span className="text-xs text-[var(--color-text-muted)] bg-white/[0.04] px-2.5 py-1 rounded-full font-mono">
            Press 1-{Math.min(question.options?.length || 4, 9)} to answer
          </span>
        )}
      </div>

      <p className="text-xl font-semibold text-[var(--color-text)] mb-6 leading-relaxed">
        <MathText>{question.prompt}</MathText>
      </p>

      {question.visual && hasSpecificDiagram && (
        <div className="mb-6">
          <ConceptDiagram courseCode={courseCode} label={concept?.label} snippet={diagramSnippet} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(question.options || []).map((option, index) => {
          const isSelected = selectedOption === option;
          const isOptionCorrect = checkAnswer(option);

          let cardClass = 'glass p-4 rounded-xl text-left transition-all duration-200 cursor-pointer border-2 relative ';
          if (!isSubmitted) {
            cardClass += 'border-transparent hover:border-[var(--color-accent)] hover:bg-white/[0.03]';
          } else {
            cardClass += 'cursor-default ';
            if (isSelected && isOptionCorrect) {
              cardClass += 'border-[var(--color-success)] bg-[rgba(0,206,201,0.1)]';
            } else if (isSelected) {
              cardClass += 'border-[var(--color-danger)] bg-[rgba(255,118,117,0.1)]';
            } else if (isOptionCorrect) {
              cardClass += 'border-[var(--color-success)] bg-[rgba(0,206,201,0.05)]';
            } else {
              cardClass += 'border-transparent opacity-40';
            }
          }

          return (
            <button
              key={`${index}-${option}`}
              type="button"
              disabled={isSubmitted}
              onClick={() => handleSelect(option)}
              className={cardClass}
            >
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-[var(--color-text-muted)] bg-white/[0.06] w-6 h-6 rounded flex items-center justify-center font-bold shrink-0">
                    {index + 1}
                  </span>
                  <MathText className="text-[var(--color-text)] text-sm font-medium text-left">{option}</MathText>
                </div>
                {isSubmitted && isOptionCorrect && <span className="text-[var(--color-success)] font-bold text-lg shrink-0">✓</span>}
                {isSubmitted && isSelected && !isOptionCorrect && <span className="text-[var(--color-danger)] font-bold text-lg shrink-0">✗</span>}
              </div>
            </button>
          );
        })}
      </div>

      {isSubmitted && (
        <div className="mt-6 animate-slide-up space-y-4">
          <div className={`glass p-4 rounded-xl border ${isCorrect
            ? 'border-[var(--color-success)]/30 bg-[rgba(0,206,201,0.08)]'
            : 'border-[var(--color-danger)]/30 bg-[rgba(255,118,117,0.08)]'}`}>
            <h4 className={`font-bold ${isCorrect ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
              {isCorrect ? 'Correct' : 'Not quite'}
            </h4>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              <MathText>{question.explanation}</MathText>
            </p>
          </div>

          <button onClick={handleNext} className="btn-primary w-full sm:w-auto">
            Next Question <span className="ml-2">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
