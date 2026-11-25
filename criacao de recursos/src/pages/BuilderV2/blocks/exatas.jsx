import { AddButton, InlineText, LatexSlot, MoveButtons, RemoveX, Rich } from '../fields';
import { listApi } from '../listOps';

// Fórmulas e exercício passo a passo (Exatas).

export function FormulaEditor({ block, onChange }) {
  const set = (key) => (value) => onChange({ ...block, [key]: value });
  return (
    <figure className="my-4 rounded-[6px] border-l-[6px] border-lav-bar bg-lav-soft p-4 md:p-5">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1 text-ink" style={{ fontSize: '1.2em' }}>
          <LatexSlot value={block.latex} onChange={set('latex')} />
        </div>
        <span className="shrink-0 font-semibold text-ink/70">
          (<InlineText value={block.number} onChange={set('number')} placeholder="nº" label="Número da equação (opcional)" className="inline-block min-w-[1ch]" />)
        </span>
      </div>
      <div className="mt-3 border-t border-lav pt-3 text-ink" style={{ fontSize: '0.92em' }}>
        <Rich value={block.where} onChange={set('where')} placeholder="Onde… (explique as variáveis, opcional. Fórmulas no texto: $F$)" className="text-left leading-relaxed" />
      </div>
      <figcaption className="mt-2 text-center italic text-ink/70" style={{ fontSize: '0.9em' }}>
        <InlineText value={block.caption} onChange={set('caption')} placeholder="Legenda (opcional)" className="inline-block min-w-[8rem]" />
      </figcaption>
    </figure>
  );
}

export function FormulaSheetEditor({ block, onChange }) {
  const list = listApi(block, onChange, 'items', () => ({ name: '', latex: '', note: '' }));
  const grid = block.columns === '1' ? 'grid-cols-1' : block.columns === '3' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2';
  return (
    <div className="my-4">
      <div className={`grid ${grid} gap-3`}>
        {list.items.map((item, i) => (
          <div key={i} className="group/item relative flex flex-col rounded-[6px] bg-lav-soft p-4">
            <span className="self-start rounded-full bg-lav px-2.5 py-1 text-[0.68em] font-bold uppercase tracking-wide text-ink">
              <InlineText value={item.name} onChange={(v) => list.patchItem(i, { name: v })} placeholder="Nome (ex: Lei de Ohm)" className="inline-block min-w-[6rem]" />
            </span>
            <div className="flex flex-1 items-center justify-center py-2 text-ink" style={{ fontSize: '1.1em' }}>
              <div className="w-full"><LatexSlot value={item.latex} onChange={(v) => list.patchItem(i, { latex: v })} /></div>
            </div>
            <div className="leading-snug text-ink/80" style={{ fontSize: '0.85em' }}>
              <InlineText value={item.note} onChange={(v) => list.patchItem(i, { note: v })} placeholder="Observação (opcional)" className="block" />
            </div>
            <MoveButtons index={i} total={list.items.length} onMove={list.move} />
            <RemoveX onClick={() => list.remove(i)} title="Remover fórmula" />
          </div>
        ))}
      </div>
      <AddButton onClick={list.add} className="mt-3">Adicionar fórmula</AddButton>
    </div>
  );
}

export function StepByStepEditor({ block, onChange }) {
  const steps = listApi(block, onChange, 'steps', () => ({ text: '', latex: '' }));
  const set = (key) => (value) => onChange({ ...block, [key]: value });
  return (
    <div className="my-4 overflow-hidden rounded-[6px] border-2 border-lav bg-white">
      <div className="bg-lav-soft p-4 md:p-5">
        <span className="rounded-full bg-lav px-2.5 py-1 text-[0.68em] font-bold uppercase tracking-wide text-ink">Exercício</span>
        <div className="mt-3">
          <Rich value={block.statement} onChange={set('statement')} placeholder="Enunciado do exercício (fórmulas no texto: $x^2$)" className="text-justify leading-relaxed text-ink" />
        </div>
      </div>

      <div className="space-y-4 p-4 md:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Resolução — o aluno revela um passo de cada vez</p>
        <ol className="space-y-4">
          {steps.items.map((step, i) => (
            <li key={i} className="group/item relative flex gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{i + 1}</span>
              <div className="min-w-0 flex-1 text-ink">
                <Rich value={step.text} onChange={(v) => steps.patchItem(i, { text: v })} placeholder="Explique este passo" className="text-left leading-relaxed" />
                <LatexSlot value={step.latex} onChange={(v) => steps.patchItem(i, { latex: v })} placeholder="Fórmula do passo (opcional)" />
              </div>
              <MoveButtons index={i} total={steps.items.length} onMove={steps.move} vertical />
              <RemoveX onClick={() => steps.remove(i)} title="Remover passo" />
            </li>
          ))}
        </ol>
        <AddButton onClick={steps.add}>Adicionar passo</AddButton>
      </div>

      <div className="mx-4 mb-4 rounded-[6px] bg-lav p-4 text-ink md:mx-5 md:mb-5">
        <span className="text-[0.68em] font-bold uppercase tracking-wide">Resposta</span>
        <div className="mt-1">
          <InlineText value={block.answer} onChange={set('answer')} placeholder="Resposta final em texto (opcional)" className="block" />
        </div>
        <LatexSlot value={block.answerLatex} onChange={set('answerLatex')} placeholder="Resposta final em fórmula (opcional)" />
      </div>
    </div>
  );
}
