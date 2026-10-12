import { renderMath } from './math';

// Converte marcações simples em HTML:
// **negrito**, *itálico*, linhas iniciadas por "•" viram itens de lista e
// $fórmula$ / $$fórmula$$ viram matemática (LaTeX).
// Mesmo padrão usado manualmente em todas as aulas (Módulos 01-16) — agora centralizado.

// "$" só abre fórmula se não estiver colado a uma palavra (evita "R$ 5 e R$ 10")
// nem seguido de espaço; só fecha se não vier depois de espaço.
const DISPLAY_MATH = /\$\$([^$]+?)\$\$/g;
const INLINE_MATH = /(?<![\w\\$])\$(?!\s|\$)([^$\n]+?)(?<!\s|\\)\$(?!\d)/g;

const toHtml = (line) => {
  const maths = [];
  const stash = (html) => {
    maths.push(html);
    return `${maths.length - 1}`;
  };
  const withMath = String(line)
    .replace(DISPLAY_MATH, (_, tex) => stash(renderMath(tex, true)))
    .replace(INLINE_MATH, (_, tex) => stash(renderMath(tex, false)));

  return withMath
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/(\d+)/g, (_, i) => maths[Number(i)]);
};

export default function FormattedText({ text, className = '', style = {} }) {
  if (!text) return null;
  const lines = String(text).split('\n');
  const hasBullets = lines.some((line) => line.trim().startsWith('•'));

  if (!hasBullets) {
    return (
      <div
        className={className}
        style={style}
        dangerouslySetInnerHTML={{ __html: toHtml(text) }}
      />
    );
  }

  return (
    <div className={className} style={style}>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('•')) {
          return (
            <div key={index} className="flex items-start gap-3 ml-4 mb-3">
              <span className="text-blue-400 font-bold mt-1.5 text-[8px]">●</span>
              <span
                className="flex-1 text-justify"
                dangerouslySetInnerHTML={{ __html: toHtml(trimmed.substring(1).trim()) }}
              />
            </div>
          );
        }
        return (
          <p
            key={index}
            className={`${trimmed === '' ? 'h-4' : 'mb-4'} text-justify leading-relaxed`}
            dangerouslySetInnerHTML={{ __html: toHtml(line) }}
          />
        );
      })}
    </div>
  );
}
