import { AddButton, Area, InlineText, RemoveX, Rich } from '../fields';
import { listApi } from '../listOps';

// Componentes de texto e destaque, desenhados como o aluno vê e editados no próprio lugar.

export function IntroEditor({ block, onChange }) {
  return (
    <Rich
      value={block.text}
      onChange={(text) => onChange({ ...block, text })}
      placeholder="Escreva o texto…"
      className="max-w-none text-ink text-justify leading-[1.75]"
      style={{ fontSize: '1em' }}
    />
  );
}

const SIZES = { grande: '1.5em', medio: '1.25em', pequeno: '1.05em' };
const ALIGNS = { esquerda: 'left', centro: 'center', direita: 'right' };

export function HeadingEditor({ block, onChange }) {
  return (
    <InlineText
      as="h3"
      value={block.text}
      onChange={(text) => onChange({ ...block, text })}
      placeholder="Escreva o título…"
      className="block font-bold leading-tight text-ink"
      style={{ fontSize: SIZES[block.size] || SIZES.medio, textAlign: ALIGNS[block.align] || 'left' }}
    />
  );
}

const CALLOUT_KINDS = {
  definicao: { label: 'Definição', icon: '📘' },
  teorema: { label: 'Teorema', icon: '📐' },
  demonstracao: { label: 'Demonstração', icon: '✍️' },
  exemplo: { label: 'Exemplo', icon: '🧪' },
  observacao: { label: 'Observação', icon: '📝' },
  dica: { label: 'Dica', icon: '💡' },
  atencao: { label: 'Atenção', icon: '⚠️', warm: true },
};

export function CalloutEditor({ block, onChange }) {
  const kind = CALLOUT_KINDS[block.kind] ? block.kind : 'definicao';
  const info = CALLOUT_KINDS[kind];
  const set = (key) => (value) => onChange({ ...block, [key]: value });
  return (
    <aside className={`my-4 rounded-[6px] border-l-[6px] p-4 md:p-5 ${info.warm ? 'border-[#f5b942] bg-[#fff6e5]' : 'border-lav-bar bg-lav-soft'}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {/* o "selo" do tipo é o próprio seletor: clique para trocar (Definição, Teorema, Dica...) */}
        <label className={`relative inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.68em] font-bold uppercase tracking-wide text-ink ${info.warm ? 'bg-[#fde7b8]' : 'bg-lav'}`}>
          <span aria-hidden>{info.icon}</span>
          <select
            value={kind}
            onChange={(e) => set('kind')(e.target.value)}
            aria-label="Tipo de destaque"
            className="cursor-pointer appearance-none bg-transparent pr-3 font-bold uppercase tracking-wide outline-none"
          >
            {Object.entries(CALLOUT_KINDS).map(([value, k]) => <option key={value} value={value}>{k.label}</option>)}
          </select>
          <span aria-hidden className="pointer-events-none absolute right-1.5">▾</span>
        </label>
        <InlineText value={block.title} onChange={set('title')} placeholder="Título (opcional)" className="min-w-[8rem] font-bold text-ink" />
      </div>
      <Rich value={block.text} onChange={set('text')} placeholder="Escreva o texto do destaque…" className="text-ink text-justify leading-relaxed" />
    </aside>
  );
}

export function ReferenceBoxEditor({ block, onChange }) {
  const set = (key) => (value) => onChange({ ...block, [key]: value });
  return (
    <section className="my-8">
      <div className="my-4">
        <div className="relative mx-auto max-w-3xl rounded-[6px] border-l-[6px] border-lav-bar bg-lav-soft p-5 md:p-6">
          <Area value={block.text} onChange={set('text')} placeholder="Escreva a citação…" className="italic leading-relaxed text-justify text-[15px] text-ink" />
          <div className="text-[0.85em] text-ink/75">
            — <InlineText value={block.citation} onChange={set('citation')} placeholder="Fonte / autor" className="inline-block min-w-[6rem]" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ConclusionEditor({ block, onChange }) {
  const set = (key) => (value) => onChange({ ...block, [key]: value });
  return (
    <section className="my-12">
      <div className="rounded-[6px] border-l-[6px] border-lav-bar bg-lav-soft p-5 md:p-6">
        <Area value={block.text} onChange={set('text')} placeholder="Escreva a citação de destaque…" className="mb-3 text-center text-[15px] italic leading-relaxed text-[#1b1b3a] md:text-[16px]" />
        <p className="text-right text-sm italic text-[#1b1b3a]/70">
          <InlineText value={block.author} onChange={set('author')} placeholder="Autor (opcional)" className="inline-block min-w-[6rem]" />
        </p>
      </div>
    </section>
  );
}

export function GlossaryEditor({ block, onChange }) {
  const list = listApi(block, onChange, 'items', () => ({ term: '', definition: '' }));
  return (
    <div className="my-4">
      <dl className="overflow-hidden rounded-[6px]">
        {list.items.map((item, i) => (
          <div
            key={i}
            className={`group/item relative grid grid-cols-1 gap-1 px-4 py-3 md:grid-cols-[minmax(8rem,1fr)_3fr] md:gap-4 ${i % 2 === 0 ? 'bg-lav-soft' : 'bg-lav-mid'}`}
          >
            <dt className="font-bold text-ink">
              <InlineText value={item.term} onChange={(v) => list.patchItem(i, { term: v })} placeholder="Termo" className="block" />
            </dt>
            <dd className="text-ink">
              <Rich value={item.definition} onChange={(v) => list.patchItem(i, { definition: v })} placeholder="Definição" className="text-left leading-relaxed" />
            </dd>
            <RemoveX onClick={() => list.remove(i)} title="Remover termo" inside />
          </div>
        ))}
      </dl>
      <AddButton onClick={list.add} className="mt-2">Adicionar termo</AddButton>
    </div>
  );
}
