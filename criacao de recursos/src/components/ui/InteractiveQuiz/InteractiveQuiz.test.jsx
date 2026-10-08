import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import InteractiveQuiz from './InteractiveQuiz';
import React from 'react';

describe('InteractiveQuiz', () => {
  it('should render a message when no questions are provided', () => {
    render(<InteractiveQuiz questions={[]} />);
    expect(screen.getByText(/Nenhuma pergunta disponível/i)).toBeInTheDocument();
  });

  it('should render a message when questions is undefined or missing options', () => {
    // This test reproduces the reported bug
    const questionsWithMissingOptions = [
      {
        text: 'Pergunta sem opções',
        // options: [] // Missing or undefined
        correctAnswer: 'A'
      }
    ];
    
    // We expect it NOT to crash and show a fallback or handle it gracefully
    render(<InteractiveQuiz questions={questionsWithMissingOptions} />);
    expect(screen.getByText(/Pergunta sem opções/i)).toBeInTheDocument();
  });
});