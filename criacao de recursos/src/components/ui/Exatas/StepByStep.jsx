import { useState } from 'react';
import MathView from '@lesson/MathView';
import FormattedText from '@lesson/FormattedText';

// Exercício resolvido, revelado passo a passo (o aluno tenta antes de ver).
export default function StepByStep({ statement, steps = [], answer, answerLatex }) {
  const list = steps.filter((s) => s && (s.text || s.latex));
  const [shown, setShown] = useState(0);
  const total = list.length;
  const allShown = shown >= total;
  const hasAnswer = !!(answer || answerLatex);

  return (
    <div className="my-4 rounded-[6px] border-2 border-lav bg-white overflow-hidden">
      <div className="bg-lav-soft p-4 md:p-5">
        <span className="rounded-full bg-lav px-2.5 py-1 text-[0.68em] font-bold uppercase tracking-wide text-ink">
          Exercício
        </span>
        {statement && (
          <FormattedText text={statement} className="mt-3 text-ink text-justify leading-relaxed" />
        )}
      </div>

      {total > 0 && (
        <ol className="p-4 md:p-5 space-y-4">
          {list.slice(0, shown).map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1 text-ink">
                {step.text && <FormattedText text={step.text} className="text-left leading-relaxed" />}
                {step.latex && <MathView latex={step.latex} display />}
              </div>
            </li>
          ))}
          {shown === 0 && (
            <li className="text-sm text-ink/60 italic">Tente resolver primeiro. Quando quiser, revele a resolução passo a passo.</li>
          )}
        </ol>
      )}

      {allShown && hasAnswer && (
        <div className="mx-4 md:mx-5 mb-4 md:mb-5 rounded-[6px] bg-lav p-4 text-ink">
          <span className="text-[0.68em] font-bold uppercase tracking-wide">Resposta</span>
          {answer && <FormattedText text={answer} className="mt-1 text-left leading-relaxed" />}
          {answerLatex && <MathView latex={answerLatex} display />}
        </div>
      )}

      {total > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-lav bg-lav-soft px-4 py-3">
          {!allShown && (
            <button
              type="button"
              onClick={() => setShown((n) => Math.min(n + 1, total))}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800 transition-colors"
            >
              {shown === 0 ? 'Mostrar o 1º passo' : `Próximo passo (${shown}/${total})`}
            </button>
          )}
          {!allShown && (
            <button
              type="button"
              onClick={() => setShown(total)}
              className="rounded-lg border border-lav-bar bg-white px-4 py-2 text-sm font-bold text-ink hover:bg-lav-soft transition-colors"
            >
              Mostrar tudo
            </button>
          )}
          {shown > 0 && (
            <button
              type="button"
              onClick={() => setShown(0)}
              className="rounded-lg border border-lav-bar bg-white px-4 py-2 text-sm font-bold text-ink hover:bg-lav-soft transition-colors"
            >
              Reiniciar
            </button>
          )}
          {allShown && <span className="text-sm font-semibold text-ink/70">Resolução completa ({total}/{total})</span>}
        </div>
      )}
    </div>
  );
}
