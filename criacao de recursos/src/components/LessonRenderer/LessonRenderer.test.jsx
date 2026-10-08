import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LessonRenderer from './LessonRenderer';
import { SECTION_CATALOG } from './sectionCatalog';
import { createBlankLesson, SAMPLE_LESSON } from './blankLesson';

describe('LessonRenderer', () => {
  it('renders the lesson title and objective', () => {
    render(<LessonRenderer content={{ aula: '1', titulo: 'Título de teste', objetivo: 'Objetivo de teste', sections: [] }} />);
    expect(screen.getByText('Título de teste')).toBeInTheDocument();
    expect(screen.getByText('Objetivo de teste')).toBeInTheDocument();
  });

  it('renders nothing (no crash) for an empty lesson', () => {
    render(<LessonRenderer content={createBlankLesson()} />);
  });

  it('renders every block type from the sample lesson without crashing', () => {
    render(<LessonRenderer content={SAMPLE_LESSON} />);
    expect(screen.getByText(SAMPLE_LESSON.titulo)).toBeInTheDocument();
  });

  it('has a default value factory for every catalog entry that includes its own type', () => {
    SECTION_CATALOG.forEach((definition) => {
      const data = definition.defaultData();
      expect(data.type).toBe(definition.type);
    });
  });
});
