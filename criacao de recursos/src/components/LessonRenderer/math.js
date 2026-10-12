// Renderização de fórmulas (LaTeX) com KaTeX, usada pelos componentes de
// Exatas e pelo texto corrido ($...$). Inclui a extensão mhchem: \ce{H2O},
// \ce{2H2 + O2 -> 2H2O} para fórmulas e reações químicas.
import katex from 'katex';
import 'katex/contrib/mhchem';
import './katex.css';

const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Devolve HTML pronto. Nunca lança: fórmula inválida aparece em vermelho.
export function renderMath(latex, displayMode = false) {
  const source = String(latex ?? '').trim();
  if (!source) return '';
  try {
    return katex.renderToString(source, {
      displayMode,
      throwOnError: false,
      strict: 'ignore',
      trust: false,
      output: 'htmlAndMathml',
    });
  } catch {
    return `<code>${escapeHtml(source)}</code>`;
  }
}
