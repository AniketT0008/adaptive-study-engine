import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ConceptDiagram from './ConceptDiagram.jsx';
import { DIAGRAM_LABELS, getConceptDiagramType } from './conceptDiagramSelection.js';

describe('getConceptDiagramType', () => {
  it.each([
    ['calculus', 'mcv4u-calculus-vectors', 'Derivative from First Principles', 'derivative'],
    ['physics', 'sph4u-physics-12', '2D Kinematics and Projectile Motion', 'projectile'],
    ['chemistry', 'sch4u-chemistry-12', 'Buffers and Titration Curves', 'titration'],
    ['biology', 'sbi4u-biology-12', 'Proteins and Enzymes', 'enzyme'],
    ['computer science', 'CS 135', 'Structural recursion on lists', 'recursion'],
    ['statistics', 'mdm4u-data-management-12', 'Normal Distribution and Z-Scores', 'normal'],
    ['fluid mechanics', 'AER210H1', 'Conservation of mass', 'streamtube'],
    ['orbital mechanics', 'AER301H1', 'Orbital elements', 'orbit'],
    ['control systems', 'AER372H1', 'Step response', 'stable-response'],
    ['differential geometry', 'MAT307H5', 'Tangent planes', 'tangent-plane'],
    ['actuarial science', 'ACT350H1', 'M/M/1 queues', 'counting-process'],
  ])('selects a specific %s visual', (_subject, courseCode, label, expected) => {
    expect(getConceptDiagramType({ courseCode, label })).toBe(expected);
  });

  it.each([
    ['sbi4u-biology-12', 'Water, pH, and Biological Chemistry', 'pH does not imply a chemistry titration'],
    ['sbi4u-biology-12', 'Translation and Protein Synthesis', 'protein does not imply an enzyme'],
    ['sch4u-chemistry-12', 'Balancing Redox Reactions', 'redox does not imply a galvanic cell'],
    ['sch4u-chemistry-12', 'Acid-Base Equilibrium and pH', 'pH does not imply a weak-acid titration'],
    ['ACT350H1', 'Common actuarial distributions', 'distribution does not imply a normal distribution'],
    ['AER372H1', 'Bode plots', 'frequency analysis does not imply a step response'],
    ['sph4u-physics-12', 'Work and Energy Transfer', 'physics does not receive a generic fallback'],
    ['ics4u-cs-12', 'Ethics, Privacy, and Security', 'computing does not receive a generic fallback'],
  ])('does not misrepresent %s / %s (%s)', (courseCode, label) => {
    expect(getConceptDiagramType({ courseCode, label })).toBeNull();
  });

  it('keeps university tangent planes out of calculus matching', () => {
    expect(getConceptDiagramType({
      courseCode: 'MAT307H5',
      label: 'Tangent planes',
      snippet: 'A tangent plane approximates a smooth surface.',
    })).toBe('tangent-plane');
  });

  it('does not let adjacent ideas in long prose override the concept label', () => {
    expect(getConceptDiagramType({
      courseCode: 'sbi4u-biology-12',
      label: 'Translation and Protein Synthesis',
      snippet: 'An enzyme may appear elsewhere in this lesson text.',
    })).toBeNull();
    expect(getConceptDiagramType({
      courseCode: 'ACT350H1',
      label: 'Common actuarial distributions',
      snippet: 'A normal distribution is one possible comparison.',
    })).toBeNull();
  });
});

describe('ConceptDiagram semantics', () => {
  it('provides the exact scientific label as the image accessible name and visible caption', () => {
    render(<ConceptDiagram courseCode="sph4u-physics-12" label="2D Kinematics and Projectile Motion" />);
    const label = DIAGRAM_LABELS.projectile;
    expect(screen.getByRole('img', { name: label })).toBeInTheDocument();
    expect(screen.getByText(label, { selector: 'figcaption' })).toBeInTheDocument();
  });

  it('renders nothing when no topic-specific visual is supported', () => {
    const { container } = render(
      <ConceptDiagram courseCode="sph4u-physics-12" label="Electric Potential and Energy" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('defines a non-empty semantic label for every selectable diagram type', () => {
    expect(Object.keys(DIAGRAM_LABELS)).toHaveLength(32);
    for (const [type, label] of Object.entries(DIAGRAM_LABELS)) {
      expect(type).not.toBe('');
      expect(label.length).toBeGreaterThan(30);
    }
  });
});
