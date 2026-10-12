import { useMemo } from 'react';
import { renderMath } from './math';

// Mostra uma fórmula LaTeX. `display` centraliza em bloco; sem ele fica na linha.
export default function MathView({ latex, display = true, className = '' }) {
  const html = useMemo(() => renderMath(latex, display), [latex, display]);
  if (!html) return null;
  return (
    <span
      className={`${display ? 'block overflow-x-auto overflow-y-hidden py-1 text-center' : 'inline'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
