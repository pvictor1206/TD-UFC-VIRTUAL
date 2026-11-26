import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { htmlToMarkup, markupToHtml } from './richText';
import FormattedText from './FormattedText';
import LessonRenderer from './LessonRenderer';

const fromHtml = (html) => {
  const el = document.createElement('div');
  el.innerHTML = html;
  return htmlToMarkup(el);
};

// texto no formato relatado: subtítulos em negrito separados por linhas em branco
const TEXTO = '**Situação:**\n\nVocê aprende um conteúdo.\n\n**Exemplo**\n\nPrimeira linha\nSegunda linha';

describe('quebras de linha no editor', () => {
  it('o texto vai para o editor e volta igual (linhas em branco incluídas)', () => {
    expect(fromHtml(markupToHtml(TEXTO))).toBe(TEXTO);
  });

  it('Enter: cada bloco vira uma linha', () => {
    expect(fromHtml('um<div>dois</div><div><br></div><div>três</div>')).toBe('um\ndois\n\ntrês');
  });

  it('Shift+Enter (<br> no meio) não é perdido', () => {
    expect(fromHtml('<div>um<br>dois<br><br>três</div>')).toBe('um\ndois\n\ntrês');
    expect(fromHtml('um<br>dois')).toBe('um\ndois');
  });

  it('negrito que atravessa uma quebra é marcado linha a linha', () => {
    expect(fromHtml('<div><b>um<br>dois</b></div>')).toBe('**um**\n**dois**');
  });

  it('texto solto com negrito continua na mesma linha', () => {
    expect(fromHtml('abc <strong>def</strong> ghi')).toBe('abc **def** ghi');
  });

  it('listas continuam funcionando', () => {
    expect(fromHtml('<div>Itens:</div><ul><li>um</li><li>dois</li></ul>')).toBe('Itens:\n• um\n• dois');
  });
});

describe('quebras de linha na aula do aluno', () => {
  it('o texto sem marcadores mantém as quebras', () => {
    const { container } = render(<FormattedText text={`${TEXTO}\n`} className="x" />);
    const el = container.firstElementChild;
    expect(el.className).toContain('whitespace-pre-line');
    expect(el.className).toContain('x');
    expect(el.textContent).toBe('Situação:\n\nVocê aprende um conteúdo.\n\nExemplo\n\nPrimeira linha\nSegunda linha');
  });

  it('citação, linha do tempo, chamada e objetivo também respeitam as quebras', () => {
    const { container } = render(
      <LessonRenderer
        showAccessibilityControls={false}
        content={{
          aula: '1', titulo: 'T', objetivo: 'obj1\nobj2',
          sections: [{ type: 'section', children: [
            { type: 'conclusion', text: 'cit1\ncit2' },
            { type: 'reference_box', text: 'ref1\nref2' },
            { type: 'cta', message: 'cta1\ncta2', buttonLabel: 'ir', href: '#' },
            { type: 'quiz', questions: [{ text: 'q1\nq2', options: ['a'], correctAnswer: 'a' }] },
          ] }],
        }}
      />
    );
    ['obj1', 'cit1', 'ref1', 'cta1', 'q1'].forEach((inicio) => {
      const el = [...container.querySelectorAll('p, h3')].find((n) => n.textContent.includes(inicio));
      expect(el.className, inicio).toContain('whitespace-pre-line');
    });
  });
});
