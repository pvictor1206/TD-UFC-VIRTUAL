import { useMemo, useRef, useState } from 'react';
import { renderMath } from '@lesson/math';

// Campo de fórmula para quem não sabe LaTeX: botões com os símbolos mais
// usados (clique insere no texto), caixa de texto e pré-visualização ao vivo.

const GROUPS = [
  {
    id: 'basico',
    label: 'Básico',
    items: [
      { face: '\\frac{a}{b}', insert: '\\frac{a}{b}', title: 'Fração' },
      { face: 'x^{2}', insert: 'x^{2}', title: 'Potência' },
      { face: 'x_{i}', insert: 'x_{i}', title: 'Índice' },
      { face: '\\sqrt{x}', insert: '\\sqrt{x}', title: 'Raiz quadrada' },
      { face: '\\sqrt[n]{x}', insert: '\\sqrt[n]{x}', title: 'Raiz n-ésima' },
      { face: '\\left(x\\right)', insert: '\\left( x \\right)', title: 'Parênteses que se ajustam' },
      { face: '|x|', insert: '\\left| x \\right|', title: 'Módulo' },
      { face: '\\pm', insert: '\\pm ', title: 'Mais ou menos' },
      { face: '\\neq', insert: '\\neq ', title: 'Diferente' },
      { face: '\\leq', insert: '\\leq ', title: 'Menor ou igual' },
      { face: '\\geq', insert: '\\geq ', title: 'Maior ou igual' },
      { face: '\\approx', insert: '\\approx ', title: 'Aproximadamente' },
      { face: '\\times', insert: '\\times ', title: 'Vezes' },
      { face: '\\cdot', insert: '\\cdot ', title: 'Ponto (multiplicação)' },
      { face: '\\div', insert: '\\div ', title: 'Dividido' },
    ],
  },
  {
    id: 'calculo',
    label: 'Cálculo',
    items: [
      { face: '\\lim_{x\\to a}', insert: '\\lim_{x \\to a} f(x)', title: 'Limite' },
      { face: '\\frac{dy}{dx}', insert: '\\frac{dy}{dx}', title: 'Derivada' },
      { face: '\\frac{\\partial f}{\\partial x}', insert: '\\frac{\\partial f}{\\partial x}', title: 'Derivada parcial' },
      { face: "f'(x)", insert: "f'(x)", title: 'Derivada (notação linha)' },
      { face: '\\int', insert: '\\int f(x)\\,dx', title: 'Integral indefinida' },
      { face: '\\int_{a}^{b}', insert: '\\int_{a}^{b} f(x)\\,dx', title: 'Integral definida' },
      { face: '\\iint_{D}', insert: '\\iint_{D} f(x,y)\\,dA', title: 'Integral dupla' },
      { face: '\\oint', insert: '\\oint_{C} \\vec{F}\\cdot d\\vec{r}', title: 'Integral de linha' },
      { face: '\\sum_{i=1}^{n}', insert: '\\sum_{i=1}^{n} a_{i}', title: 'Somatório' },
      { face: '\\prod', insert: '\\prod_{i=1}^{n} a_{i}', title: 'Produtório' },
      { face: '\\infty', insert: '\\infty ', title: 'Infinito' },
      { face: '\\nabla', insert: '\\nabla ', title: 'Nabla (gradiente)' },
      { face: '\\to', insert: '\\to ', title: 'Tende a' },
      { face: '\\in', insert: '\\in ', title: 'Pertence' },
      { face: '\\forall', insert: '\\forall ', title: 'Para todo' },
      { face: '\\exists', insert: '\\exists ', title: 'Existe' },
    ],
  },
  {
    id: 'fisica',
    label: 'Física',
    items: [
      { face: '\\vec{F}', insert: '\\vec{F}', title: 'Vetor' },
      { face: '\\hat{i}', insert: '\\hat{i}', title: 'Versor' },
      { face: '\\Delta x', insert: '\\Delta x', title: 'Variação' },
      { face: '\\vec{F}=m\\vec{a}', insert: '\\vec{F} = m\\vec{a}', title: '2ª lei de Newton' },
      { face: 'E=mc^{2}', insert: 'E = mc^{2}', title: 'Energia relativística' },
      { face: '\\vec{a}\\times\\vec{b}', insert: '\\vec{a} \\times \\vec{b}', title: 'Produto vetorial' },
      { face: '\\vec{a}\\cdot\\vec{b}', insert: '\\vec{a} \\cdot \\vec{b}', title: 'Produto escalar' },
      { face: '\\mathrm{m/s^{2}}', insert: '\\,\\mathrm{m/s^{2}}', title: 'Unidade (m/s²)' },
      { face: '\\mathrm{N\\cdot m}', insert: '\\,\\mathrm{N \\cdot m}', title: 'Unidade (N·m)' },
      { face: '\\hbar', insert: '\\hbar ', title: 'h cortado' },
      { face: '\\varepsilon_{0}', insert: '\\varepsilon_{0}', title: 'Permissividade' },
      { face: '\\mu_{0}', insert: '\\mu_{0}', title: 'Permeabilidade' },
      { face: '\\dot{x}', insert: '\\dot{x}', title: 'Derivada no tempo (ponto)' },
      { face: '\\langle x\\rangle', insert: '\\langle x \\rangle', title: 'Valor médio' },
    ],
  },
  {
    id: 'quimica',
    label: 'Química',
    items: [
      { face: '\\ce{H2O}', insert: '\\ce{H2O}', title: 'Fórmula molecular' },
      { face: '\\ce{2H2 + O2 -> 2H2O}', insert: '\\ce{2H2 + O2 -> 2H2O}', title: 'Reação química' },
      { face: '\\ce{A <=> B}', insert: '\\ce{A <=> B}', title: 'Equilíbrio' },
      { face: '\\ce{Na+}', insert: '\\ce{Na+}', title: 'Íon positivo' },
      { face: '\\ce{SO4^2-}', insert: '\\ce{SO4^2-}', title: 'Íon negativo' },
      { face: '\\ce{CO2(g)}', insert: '\\ce{CO2(g)}', title: 'Estado físico' },
      { face: '\\ce{->[\\Delta]}', insert: '\\ce{A ->[\\Delta] B}', title: 'Reação com aquecimento' },
      { face: '\\ce{^{14}_{6}C}', insert: '\\ce{^{14}_{6}C}', title: 'Isótopo' },
      { face: '[\\mathrm{H^+}]', insert: '[\\mathrm{H^+}]', title: 'Concentração' },
      { face: '\\mathrm{pH}', insert: '\\mathrm{pH} = -\\log[\\mathrm{H^+}]', title: 'pH' },
      { face: '\\Delta H', insert: '\\Delta H', title: 'Variação de entalpia' },
      { face: '\\ce{H2SO4}', insert: '\\ce{H2SO4}', title: 'Ácido sulfúrico' },
    ],
  },
  {
    id: 'letras',
    label: 'Letras gregas',
    items: ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'theta', 'lambda', 'mu', 'pi', 'rho', 'sigma', 'tau', 'phi', 'omega', 'Delta', 'Sigma', 'Phi', 'Omega'].map((n) => ({
      face: `\\${n}`,
      insert: `\\${n} `,
      title: n,
    })),
  },
  {
    id: 'estruturas',
    label: 'Matrizes e sistemas',
    items: [
      { face: '\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}', insert: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', title: 'Matriz 2×2' },
      { face: '\\begin{vmatrix}a&b\\\\c&d\\end{vmatrix}', insert: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}', title: 'Determinante' },
      { face: '\\begin{cases}x\\\\y\\end{cases}', insert: '\\begin{cases} x + y = 1 \\\\ x - y = 0 \\end{cases}', title: 'Sistema de equações' },
      { face: '\\overline{AB}', insert: '\\overline{AB}', title: 'Segmento' },
      { face: '\\underbrace{a+b}_{c}', insert: '\\underbrace{a+b}_{c}', title: 'Chave embaixo' },
      { face: '\\Rightarrow', insert: '\\Rightarrow ', title: 'Implica' },
      { face: '\\Leftrightarrow', insert: '\\Leftrightarrow ', title: 'Se e somente se' },
    ],
  },
];

function Face({ latex }) {
  const html = useMemo(() => renderMath(latex, false), [latex]);
  return <span className="pointer-events-none" dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function LatexField({ label, help, value, onChange, rows = 2 }) {
  const [group, setGroup] = useState('basico');
  const ref = useRef(null);
  const current = GROUPS.find((g) => g.id === group) || GROUPS[0];
  const preview = useMemo(() => renderMath(value, true), [value]);

  const insert = (text) => {
    const el = ref.current;
    const v = value ?? '';
    const start = el ? el.selectionStart : v.length;
    const end = el ? el.selectionEnd : v.length;
    const next = v.slice(0, start) + text + v.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      el.setSelectionRange(start + text.length, start + text.length);
    });
  };

  return (
    <div>
      {label && <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>}

      <div className="rounded-lg border border-gray-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-400">
        <div className="flex flex-wrap gap-1 px-2 pt-2 bg-lav-soft border-b border-lav" role="tablist" aria-label="Categorias de símbolos">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              role="tab"
              aria-selected={g.id === group}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setGroup(g.id)}
              className={`px-3 py-1.5 rounded-t-lg text-xs font-bold transition-colors ${g.id === group ? 'bg-white text-ink border border-b-0 border-lav-bar' : 'text-gray-600 hover:bg-lav'}`}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 p-2 bg-white max-h-36 overflow-y-auto border-b border-gray-100">
          {current.items.map((it, i) => (
            <button
              key={i}
              type="button"
              title={it.title}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insert(it.insert)}
              className="min-w-10 h-10 px-2 inline-flex items-center justify-center rounded-lg border border-gray-200 text-ink hover:bg-lav hover:border-lav-bar transition-colors"
            >
              <Face latex={it.face} />
            </button>
          ))}
        </div>

        <textarea
          ref={ref}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          spellCheck={false}
          placeholder="Clique nos símbolos acima ou escreva em LaTeX, ex: \frac{a}{b}"
          aria-label={label || 'Fórmula em LaTeX'}
          className="w-full resize-y px-3 py-2 font-mono text-sm text-gray-900 focus:outline-none"
        />
      </div>

      <div className="mt-2 rounded-lg border border-dashed border-lav-bar bg-lav-soft/60 px-3 py-2 min-h-12">
        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1">Como vai aparecer</p>
        {preview ? (
          <div className="overflow-x-auto text-ink text-center" style={{ fontSize: '1.15rem' }} dangerouslySetInnerHTML={{ __html: preview }} />
        ) : (
          <p className="text-xs text-gray-400 italic">A fórmula aparece aqui enquanto você digita.</p>
        )}
      </div>
      {help && <p className="mt-1 text-[11px] text-gray-400">{help}</p>}
    </div>
  );
}
