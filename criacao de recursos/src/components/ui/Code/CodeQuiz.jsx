import { useState } from 'react';
import FormattedText from '@lesson/FormattedText';
import CodeBlock from './CodeBlock';

// "Qual é a saída?" — código + alternativas, com explicação ao responder.
export default function CodeQuiz({ question, code, language, options = [], correct, explanation }) {
  const list = options.filter((o) => o && String(o).trim() !== '');
  const [picked, setPicked] = useState(null);
  const correctIndex = Math.max(0, Math.min(list.length - 1, (parseInt(correct, 10) || 1) - 1));
  const answered = picked !== null;

  return (
    <div className="my-4 rounded-[6px] border-2 border-lav bg-white overflow-hidden">
      <div className="bg-lav-soft p-4 md:p-5">
        <span className="rounded-full bg-lav px-2.5 py-1 text-[0.68em] font-bold uppercase tracking-wide text-ink">Teste o código</span>
        {question && <p className="mt-3 font-semibold text-ink">{question}</p>}
      </div>
      <div className="px-4 md:px-5 pt-4">
        <CodeBlock embedded code={code} language={language} />
      </div>
      {list.length > 0 && (
        <div className="p-4 md:p-5 space-y-2">
          {list.map((opt, i) => {
            const isRight = i === correctIndex;
            const isPicked = picked === i;
            let style = 'border-gray-200 hover:bg-lav-soft';
            if (answered && isRight) style = 'border-green-500 bg-green-50 text-green-900';
            else if (answered && isPicked) style = 'border-red-500 bg-red-50 text-red-900';
            return (
              <button
                key={i}
                type="button"
                disabled={answered}
                onClick={() => setPicked(i)}
                className={`w-full rounded-lg border-2 px-4 py-3 text-left font-mono text-[0.9em] text-ink transition-colors ${style}`}
              >
                <span className="mr-3 font-sans font-bold text-ink/60">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            );
          })}
          {answered && (
            <div className="mt-3 rounded-[6px] bg-lav-soft p-4 text-ink">
              <p className="font-bold">{picked === correctIndex ? '✓ Correto!' : '✗ Não foi dessa vez.'}</p>
              {picked !== correctIndex && (
                <p className="text-[0.92em]">Resposta certa: <strong>{String.fromCharCode(65 + correctIndex)}</strong></p>
              )}
              {explanation && <FormattedText text={explanation} className="mt-2 text-left leading-relaxed" />}
              <button type="button" onClick={() => setPicked(null)} className="mt-3 rounded-lg border border-lav-bar bg-white px-3 py-1.5 text-sm font-bold hover:bg-lav-soft">
                Tentar de novo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
