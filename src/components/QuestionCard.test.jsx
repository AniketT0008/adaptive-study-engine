import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import QuestionCard from './QuestionCard.jsx';

const question = {
  id: 'q1',
  conceptId: 'c1',
  type: 'mcq',
  difficulty: 'easy',
  prompt: 'For f(x) = x^2, choose the result.',
  options: ['1', '2', '3', '4'],
  answer: '2',
  explanation: 'Substitution gives 2.',
};

describe('QuestionCard', () => {
  it('supports keyboard answering and reports the result', () => {
    const onCommit = vi.fn();
    render(<QuestionCard question={question} concept={{ label: 'Functions' }} onCommit={onCommit} />);
    fireEvent.keyDown(window, { key: '2' });
    expect(onCommit).toHaveBeenCalledWith(true, question);
    expect(screen.getByText('Correct')).toBeInTheDocument();
  });

  it('shows a safe error for malformed questions', () => {
    render(<QuestionCard question={{ ...question, options: ['1'] }} concept={{ label: 'Functions' }} />);
    expect(screen.getByRole('alert')).toHaveTextContent('cannot be displayed');
  });

  it('renders detected formulas through KaTeX', () => {
    const { container } = render(<QuestionCard question={question} concept={{ label: 'Functions' }} />);
    expect(container.querySelector('.katex')).toBeTruthy();
  });

  it('renders a course-aware visual for a visual reasoning question', () => {
    const { container } = render(
      <QuestionCard
        question={{ ...question, visual: true }}
        concept={{ label: 'Electric Potential and Energy', shortDefinition: 'Voltage is energy per charge.' }}
        courseCode="sph4u-physics-12"
      />,
    );
    expect(container.querySelector('.concept-visual')).not.toBeNull();
    expect(screen.getByRole('img', { name: /Electric Potential and Energy/i })).toBeInTheDocument();
  });
});
