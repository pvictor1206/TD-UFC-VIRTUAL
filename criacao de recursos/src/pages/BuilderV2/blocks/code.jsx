import { useState } from 'react';
import { AddButton, CodeSlot, InlineText, LangSelect, OutputArea, RemoveX, Rich } from '../fields';
import { listApi } from '../listOps';

// Componentes de programação: o código aparece colorido como o aluno vê e vira caixa de texto ao clicar.

function CodeHeader({ language, onLanguage, filename, onFilename }) {
  return (
    <div className="flex items-center justify-between gap-2 bg-[#2a2754] px-3 py-2 text-[#ece8fb]">
      <div className="flex min-w-0 items-center gap-2">
        <LangSelect value={language} onChange={onLanguage} className="shrink-0" />
        {onFilename && (
          <InlineText value={filename} onChange={onFilename} placeholder="nome do arquivo (opcional)" className="min-w-[10rem] truncate font-mono text-[0.8em] text-[#ece8fb]/80 hover:bg-white/10 focus:bg-white/10 empty:before:text-[#8f8ab5]!" />
        )}
      </div>
      <span className="shrink-0 rounded-md border border-white/25 px-3 py-1 text-[0.78em] font-semibold opacity-60">Copiar</span>
    </div>
  );
}

export function CodeBlockEditor({ block, onChange }) {
  const set = (key) => (value) => onChange({ ...block, [key]: value });
  return (
    <figure className="my-4">
      <div className="overflow-hidden rounded-[8px] border border-[#2d2a52]">
        <CodeHeader language={block.language} onLanguage={set('language')} filename={block.filename} onFilename={set('filename')} />
        <CodeSlot code={block.code} language={block.language} lineNumbers={block.lineNumbers} highlight={block.highlight} onChange={set('code')} />
        <OutputArea value={block.output} onChange={set('output')} />
      </div>
      <figcaption className="mt-2 text-center italic text-ink/70" style={{ fontSize: '0.9em' }}>
        <InlineText value={block.caption} onChange={set('caption')} placeholder="Legenda (opcional)" className="inline-block min-w-[8rem]" />
      </figcaption>
    </figure>
  );
}

export function CodeTabsEditor({ block, onChange }) {
  const [active, setActive] = useState(0);
  const list = listApi(block, onChange, 'items', () => ({ language: 'python', code: '', output: '' }));
  const index = Math.min(active, Math.max(list.items.length - 1, 0));
  const current = list.items[index];
  const set = (key) => (value) => onChange({ ...block, [key]: value });

  return (
    <div className="my-4">
      <div className="flex flex-wrap items-end gap-1" role="tablist" aria-label="Linguagens">
        {list.items.map((item, i) => (
          <div
            key={i}
            role="tab"
            aria-selected={i === index}
            onClick={() => setActive(i)}
            className={`group/item relative flex items-center rounded-t-lg px-3 py-1.5 text-[0.85em] font-bold ${i === index ? 'bg-[#1b1b3a] text-white' : 'cursor-pointer bg-lav text-ink hover:bg-lav-mid'}`}
          >
            <LangSelect value={item.language} onChange={(v) => list.patchItem(i, { language: v })} className="!bg-transparent !px-0 !text-[1em] !normal-case !tracking-normal !text-inherit" />
            {i === index && list.items.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActive(Math.max(0, i - 1)); list.remove(i); }}
                title="Remover esta linguagem"
                aria-label="Remover esta linguagem"
                className="ml-2 rounded-full px-1.5 text-xs text-white/70 hover:bg-white/15 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => { list.add(); setActive(list.items.length); }}
          className="rounded-t-lg border-2 border-dashed border-lav-bar px-3 py-1 text-[0.85em] font-bold text-ink/70 hover:bg-lav-soft"
        >
          + Linguagem
        </button>
      </div>
      {current ? (
        <div className="overflow-hidden rounded-[8px] rounded-tl-none border border-[#2d2a52]">
          <CodeSlot code={current.code} language={current.language} lineNumbers={block.lineNumbers} onChange={(v) => list.patchItem(index, { code: v })} />
          <OutputArea value={current.output} onChange={(v) => list.patchItem(index, { output: v })} />
        </div>
      ) : (
        <AddButton onClick={list.add}>Adicionar a primeira linguagem</AddButton>
      )}
      <p className="mt-2 text-center italic text-ink/70" style={{ fontSize: '0.9em' }}>
        <InlineText value={block.caption} onChange={set('caption')} placeholder="Legenda (opcional)" className="inline-block min-w-[8rem]" />
      </p>
    </div>
  );
}

export function CodeQuizEditor({ block, onChange }) {
  const options = listApi(block, onChange, 'options', () => '');
  const set = (key) => (value) => onChange({ ...block, [key]: value });
  const correct = Math.max(1, Math.min(options.items.length || 1, parseInt(block.correct, 10) || 1));
  return (
    <div className="my-4 overflow-hidden rounded-[6px] border-2 border-lav bg-white">
      <div className="bg-lav-soft p-4 md:p-5">
        <span className="rounded-full bg-lav px-2.5 py-1 text-[0.68em] font-bold uppercase tracking-wide text-ink">Teste o código</span>
        <p className="mt-3 font-semibold text-ink">
          <InlineText value={block.question} onChange={set('question')} placeholder="Pergunta (ex: O que este código imprime?)" className="block" />
        </p>
      </div>
      <div className="px-4 pt-4 md:px-5">
        <div className="overflow-hidden rounded-[8px] border border-[#2d2a52]">
          <CodeHeader language={block.language} onLanguage={set('language')} />
          <CodeSlot code={block.code} language={block.language} onChange={set('code')} />
        </div>
      </div>
      <div className="space-y-2 p-4 md:p-5">
        <p className="text-xs text-ink/50">Marque (●) a alternativa correta</p>
        {options.items.map((opt, i) => {
          const right = i + 1 === correct;
          return (
            <div key={i} className={`group/item relative flex items-center gap-3 rounded-lg border-2 px-4 py-3 font-mono text-[0.9em] text-ink ${right ? 'border-green-500 bg-green-50 text-green-900' : 'border-gray-200'}`}>
              <button
                type="button"
                onClick={() => set('correct')(String(i + 1))}
                aria-pressed={right}
                aria-label="Marcar como alternativa correta"
                title={right ? 'Alternativa correta' : 'Marcar como a correta'}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${right ? 'border-green-600 bg-green-600' : 'border-gray-400 bg-white hover:border-green-600'}`}
              >
                {right && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </button>
              <span className="font-sans font-bold text-ink/60">{String.fromCharCode(65 + i)}</span>
              <div className="min-w-0 flex-1">
                <InlineText value={opt} onChange={(v) => options.setItem(i, v)} placeholder="Alternativa" className="block" />
              </div>
              <RemoveX onClick={() => options.remove(i)} title="Remover alternativa" inside />
            </div>
          );
        })}
        <AddButton onClick={options.add}>Adicionar alternativa</AddButton>
        <div className="mt-3 rounded-[6px] bg-lav-soft p-4 text-ink">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink/60">Explicação (aparece depois que o aluno responde)</p>
          <Rich value={block.explanation} onChange={set('explanation')} placeholder="Explique a resposta certa…" className="text-left leading-relaxed" />
        </div>
      </div>
    </div>
  );
}
