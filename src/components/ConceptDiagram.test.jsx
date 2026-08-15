import { describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ConceptDiagram from './ConceptDiagram.jsx';
import { EXAMPLE_DECKS } from '../data/exampleDeck.js';
import { UNIVERSITY_DECKS } from '../data/universityCatalog.js';

describe('ConceptDiagram', () => {
  it.each([
    ['mcv4u-calculus-vectors', 'Derivative from First Principles'],
    ['sph4u-physics-12', '2D Kinematics and Projectile Motion'],
    ['sch4u-chemistry-12', 'Buffers and Titration Curves'],
    ['sbi4u-biology-12', 'Proteins and Enzymes'],
    ['CS 135', 'Structural recursion on lists'],
    ['mdm4u-data-management-12', 'Normal Distribution and Z-Scores'],
    ['AER210H1', 'Conservation of mass'],
    ['AER301H1', 'Orbital elements'],
    ['AER372H1', 'Step response'],
    ['MAT307H5', 'Tangent planes'],
    ['ACT350H1', 'M/M/1 queues'],
  ])('renders a labelled, subject-aware visual for %s / %s', (courseCode, label) => {
    render(<ConceptDiagram courseCode={courseCode} label={label} snippet={label} />);
    expect(screen.getByRole('img', { name: new RegExp(label, 'i') })).toBeInTheDocument();
  });

  it('uses the actual vectors from the selected cross-product lesson', () => {
    render(
      <ConceptDiagram
        courseCode="mcv4u-calculus-vectors"
        label="Cross Product, Area, and Torque"
        snippet="The cross product is perpendicular."
        example="<1,2,3> x <4,5,6> = <-3,6,-3>."
      />,
    );
    expect(screen.getByText('u = ⟨1,2,3⟩')).toBeInTheDocument();
    expect(screen.getByText('v = ⟨4,5,6⟩')).toBeInTheDocument();
    expect(screen.getByText('u × v = ⟨-3,6,-3⟩')).toBeInTheDocument();
  });

  it('uses a dedicated 3D plane visual with the lesson normal', () => {
    render(
      <ConceptDiagram
        courseCode="mcv4u-calculus-vectors"
        label="Lines and Planes in 3D"
        example="A plane through (1,2,3) with normal <2,-1,4>."
      />,
    );
    expect(screen.getByText('normal n = ⟨2,-1,4⟩')).toBeInTheDocument();
    expect(screen.getByText(/plane: n ·/)).toBeInTheDocument();
  });

  it('provides a course-aware fallback instead of showing a mismatched or empty visual', () => {
    render(<ConceptDiagram courseCode="sph4u-physics-12" label="Electric Potential and Energy" />);
    expect(screen.getByRole('img', { name: /Electric Potential and Energy/i })).toBeInTheDocument();
  });

  it('maps every built-in lesson to a named conceptual diagram', () => {
    for (const deck of [...EXAMPLE_DECKS, ...UNIVERSITY_DECKS]) {
      for (const concept of deck.concepts) {
        cleanup();
        render(<ConceptDiagram
          courseCode={deck.courseCode || deck.id}
          label={concept.label}
          snippet={concept.sourceSnippet}
          example={concept.example}
        />);
        const visual = screen.getByRole('img', { name: new RegExp(concept.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') });
        expect(visual.closest('figure')?.getAttribute('aria-label'), `${deck.id} / ${concept.label}`).not.toMatch(/governing structure/i);
      }
    }
  });
});
