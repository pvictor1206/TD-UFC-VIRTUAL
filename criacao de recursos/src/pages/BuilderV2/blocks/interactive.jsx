import { FaLink } from 'react-icons/fa';
import { AddButton, Area, InlineText, LinkRow, RemoveX } from '../fields';
import { listApi } from '../listOps';

// Quiz, chamada para ação e link de acesso.

export function QuizEditor({ block, onChange }) {
  const questions = listApi(block, onChange, 'questions', () => ({ text: '', options: ['', ''], correctAnswer: '' }));
  const total = questions.items.length;

  const patchQuestion = (qi, patch) => questions.patchItem(qi, patch);

  return (
    <section className="my-12 space-y-4">
      {questions.items.map((q, qi) => {
        const options = q.options || [];
        const setOption = (oi, value) => {
          // se a alternativa corrigida é a que está sendo digitada, a resposta certa acompanha o texto
          const wasCorrect = options[oi] === q.correctAnswer;
          patchQuestion(qi, { options: options.map((o, j) => (j === oi ? value : o)), ...(wasCorrect ? { correctAnswer: value } : {}) });
        };
        const removeOption = (oi) => {
          const wasCorrect = options[oi] === q.correctAnswer;
          patchQuestion(qi, { options: options.filter((_, j) => j !== oi), ...(wasCorrect ? { correctAnswer: '' } : {}) });
        };
        return (
          <div key={qi} className="group/item relative mx-auto w-full max-w-2xl rounded-xl bg-white p-4 shadow-md md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">Questão {qi + 1} de {total}</p>
              <p className="text-xs text-gray-400">Marque (●) a alternativa correta</p>
            </div>
            <Area
              value={q.text}
              onChange={(v) => patchQuestion(qi, { text: v })}
              placeholder="Escreva a pergunta…"
              className="mb-6 text-center text-lg font-semibold text-gray-800 md:text-xl"
            />
            <div className="space-y-3">
              {options.map((opt, oi) => {
                const right = opt !== '' && opt === q.correctAnswer;
                return (
                  <div key={oi} className={`group/opt relative flex items-center gap-3 rounded-lg border-2 p-3 ${right ? 'border-green-500 bg-green-100 text-green-800' : 'border-gray-200'}`}>
                    <button
                      type="button"
                      disabled={opt === ''}
                      onClick={() => patchQuestion(qi, { correctAnswer: opt })}
                      aria-pressed={right}
                      title={opt === '' ? 'Escreva a alternativa para poder marcá-la como correta' : right ? 'Alternativa correta' : 'Marcar como a correta'}
                      aria-label="Marcar como alternativa correta"
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 disabled:opacity-40 ${right ? 'border-green-600 bg-green-600' : 'border-gray-400 bg-white hover:border-green-600'}`}
                    >
                      {right && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <InlineText value={opt} onChange={(v) => setOption(oi, v)} placeholder={`Alternativa ${oi + 1}`} className="block" />
                    </div>
                    <button type="button" onClick={() => removeOption(oi)} title="Remover alternativa" aria-label="Remover alternativa" className="shrink-0 rounded-full px-2 text-sm font-bold text-red-600 opacity-0 transition-opacity hover:bg-red-50 focus:opacity-100 group-hover/opt:opacity-100">✕</button>
                  </div>
                );
              })}
            </div>
            <AddButton onClick={() => patchQuestion(qi, { options: [...options, ''] })} className="mt-3">Adicionar alternativa</AddButton>
            <RemoveX onClick={() => questions.remove(qi)} title="Remover pergunta" />
          </div>
        );
      })}
      <AddButton onClick={questions.add}>Adicionar pergunta</AddButton>
    </section>
  );
}

export function CtaEditor({ block, onChange }) {
  const set = (key) => (value) => onChange({ ...block, [key]: value });
  return (
    <div className="my-4">
      <section className="px-0 py-4">
        <div className="mx-auto flex w-full max-w-[720px] items-center justify-center rounded-t-[14px] bg-lav p-4 sm:w-4/5 sm:p-5 md:w-3/5 md:p-6">
          <p className="w-full break-words text-center text-[17px] font-bold leading-relaxed text-ink">
            <InlineText value={block.message} onChange={set('message')} placeholder="Mensagem da chamada" className="block" />
          </p>
        </div>
        <div className="mx-auto w-full max-w-[720px] sm:w-4/5 md:w-3/5">
          <div className="block h-[50px] select-none rounded-b-[14px] bg-lav-soft text-center text-[12px] font-bold uppercase leading-[50px] tracking-wide text-ink">
            <InlineText value={block.buttonLabel} onChange={set('buttonLabel')} placeholder="Texto do botão" className="inline-block min-w-[6rem]" />
          </div>
          <LinkRow value={block.href} onChange={set('href')} label="Link do botão" className="mt-2" />
        </div>
      </section>
    </div>
  );
}

export function AccessLinkEditor({ block, onChange }) {
  const set = (key) => (value) => onChange({ ...block, [key]: value });
  return (
    <div className="my-4">
      <section className="py-6">
        <div className="mx-auto w-full">
          <div className="flex items-center gap-3 rounded-[7px] bg-lav-soft p-3 sm:p-4">
            <FaLink color="var(--color-lav-bar)" size={18} className="shrink-0" />
            <p className="break-words text-[16px] font-bold uppercase text-ink underline underline-offset-4">
              <InlineText value={block.label} onChange={set('label')} placeholder="Texto do link" className="inline-block min-w-[8rem]" />
            </p>
          </div>
          <LinkRow value={block.href} onChange={set('href')} label="Endereço" className="mt-2" />
        </div>
      </section>
    </div>
  );
}
