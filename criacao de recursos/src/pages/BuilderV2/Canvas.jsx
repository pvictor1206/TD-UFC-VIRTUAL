import { Component, memo, useContext, useEffect, useRef, useState } from 'react';
import { renderSection, getSectionDefinition, lessonThemeStyle, spacingValue } from '@lesson';
import SchemaField from '../Builder/SchemaField';
import HelpButton from '../Builder/HelpButton';
import { BuilderContext } from '../Builder/BuilderContext';
import InlineText from './InlineText';
import SpacingField from './SpacingField';
import { BLOCK_EDITORS, OPTION_KEYS } from './blocks';
import { DRAG_NEW, DRAG_MOVE, DRAG_CHAPTER, SELECT_COLOR } from './LeftPanel';
import { kids } from './lessonOps';

// A página da aula como o aluno vê, mas editável dentro de cada componente: clique no texto e
// digite, adicione/remova itens ali mesmo, arraste para reorganizar. Os desenhos de cada
// componente estão em ./blocks; o do cabeçalho e dos capítulos espelha o de LessonRenderer.jsx.

const SELECTED = { outline: `2px solid ${SELECT_COLOR}`, outlineOffset: 2 };
const HOVER = 'hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-[#0a84ff]/60';

// O que está sendo arrastado: 'chapter' (capítulo), 'new' (componente da lista), 'move' (componente da página) ou null.
const dragKind = (e) => {
  const types = Array.from(e.dataTransfer?.types || []);
  if (types.includes(DRAG_CHAPTER)) return 'chapter';
  if (types.includes(DRAG_NEW)) return 'new';
  if (types.includes(DRAG_MOVE)) return 'move';
  return null;
};
const isBlockDrag = (e) => { const k = dragKind(e); return k === 'new' || k === 'move'; };

// Onde um componente largado em `e.clientY` entraria dentro de um capítulo (posição + altura da linha-guia).
function locate(e, chapterEl) {
  const box = chapterEl.querySelector('[data-children]');
  if (!box) return { c: 0, top: 0 };
  const items = Array.from(box.children).filter((el) => el.hasAttribute('data-c'));
  const base = box.getBoundingClientRect().top;
  let c = items.length;
  for (let i = 0; i < items.length; i += 1) {
    const r = items[i].getBoundingClientRect();
    if (e.clientY < r.top + r.height / 2) { c = i; break; }
  }
  let top = 0;
  if (items.length > 0) {
    top = c < items.length
      ? items[c].getBoundingClientRect().top - base - 8
      : items[items.length - 1].getBoundingClientRect().bottom - base + 8;
  }
  return { c, top };
}

// Um componente que quebre ao ser desenhado não derruba o editor inteiro.
class BlockBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err) { console.error(err); }
  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.failed) this.setState({ failed: false });
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Não foi possível mostrar este componente. Confira o conteúdo dele.
      </div>
    );
  }
}

// Só para tipos de componente que ainda não têm editor próprio: mostra o componente pronto.
const RenderedBlock = memo(function RenderedBlock({ block }) {
  return renderSection(block, 0);
});

// Engrenagem ⚙ do componente: o que não é texto (tamanho, alinhamento, colunas, espaçamento...).
function OptionsPopover({ block, def, hasEditor, canEditSpacing, onChange, onClose }) {
  const keys = hasEditor ? OPTION_KEYS[block.type] || [] : null; // sem editor próprio: todos os campos
  const fields = def.fields.filter((f) => !keys || keys.includes(f.key));
  const set = (key, value) => onChange({ ...block, [key]: value });
  return (
    <div
      className="absolute left-0 top-0 z-50 max-h-[70vh] w-72 space-y-3 overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 text-left text-ink shadow-xl"
      style={{ fontSize: 14 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{hasEditor ? 'Opções' : 'Editar'} · {def.label}</p>
        <button type="button" onClick={onClose} aria-label="Fechar opções" className="rounded-md px-2 text-gray-500 hover:bg-gray-100">✕</button>
      </div>
      {fields.map((field) => (
        <SchemaField key={field.key} field={field} value={block[field.key]} onChange={(v) => set(field.key, v)} siblingValues={block} />
      ))}
      {canEditSpacing && (
        <div className="space-y-3 rounded-lg bg-lav-soft/70 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-ink">↕ Espaçamento</p>
          <SpacingField label="Em cima" value={block.spaceBefore} onChange={(v) => set('spaceBefore', v)} />
          <SpacingField label="Em baixo" value={block.spaceAfter} onChange={(v) => set('spaceAfter', v)} />
        </div>
      )}
    </div>
  );
}

const chromeBtn = 'flex h-6 w-6 items-center justify-center text-sm hover:bg-black/15 disabled:opacity-40 disabled:hover:bg-transparent';

function BlockFrame({ block, s, c, total, selected, focusKey, ops, onSelect, dragRef, clearDrop }) {
  const { canEditSpacing } = useContext(BuilderContext);
  const def = getSectionDefinition(block.type);
  const Editor = BLOCK_EDITORS[block.type];
  const frameRef = useRef(null);
  const contentRef = useRef(null);
  const [empty, setEmpty] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  // (só para componentes sem editor próprio) aviso quando não há nada para mostrar
  useEffect(() => {
    const el = contentRef.current;
    if (Editor || !el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => setEmpty(el.getBoundingClientRect().height < 8));
    ro.observe(el);
    return () => ro.disconnect();
  }, [Editor]);

  useEffect(() => { if (!selected) setOptionsOpen(false); }, [selected]);

  // Componente recém-adicionado: já deixa o cursor no primeiro campo para começar a escrever.
  useEffect(() => {
    if (!focusKey || focusKey.s !== s || focusKey.c !== c) return;
    frameRef.current?.querySelector('[data-field]')?.focus({ preventScroll: true });
    ops.clearFocus();
  }, [focusKey]);

  const before = spacingValue(block.spaceBefore);
  const own = spacingValue(block.spaceAfter);
  const spaced = before !== undefined || own !== undefined;
  const pick = () => onSelect({ kind: 'block', s, c });
  const hasOptions = !Editor || (OPTION_KEYS[block.type] || []).length > 0 || canEditSpacing;

  return (
    <div data-s={s} data-c={c} className={`scroll-mt-6 ${spaced ? 'last:mb-0!' : ''}`} style={{ paddingTop: before, marginBottom: own }}>
      <div
        ref={frameRef}
        className={`group/block relative ${selected ? '' : HOVER}`}
        style={selected ? SELECTED : undefined}
        // clicar/focar em qualquer ponto do componente o seleciona (sem atrapalhar a digitação)
        onMouseDownCapture={() => { if (!selected) pick(); }}
        onFocusCapture={() => { if (!selected) pick(); }}
        // componente sem editor próprio: o 1º clique só seleciona (e links não abrem)
        onClickCapture={Editor ? undefined : (e) => {
          if (!selected) { e.preventDefault(); e.stopPropagation(); pick(); } else if (e.target.closest?.('a')) e.preventDefault();
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={contentRef} className={spaced ? '[&>*]:my-0!' : ''}>
          <BlockBoundary resetKey={block}>
            {Editor ? (
              <Editor block={block} selected={selected} onChange={(b) => ops.changeBlock(s, c, b)} />
            ) : (
              <RenderedBlock block={block} />
            )}
          </BlockBoundary>
        </div>

        {!Editor && empty && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-400">
            {def?.icon} {def?.label || block.type} — vazio.
          </div>
        )}

        {selected ? (
          <>
            {/* alças nos cantos, como em editores de design */}
            {['-left-[5px] -top-[5px]', '-right-[5px] -top-[5px]', '-left-[5px] -bottom-[5px]', '-right-[5px] -bottom-[5px]'].map((pos) => (
              <span key={pos} aria-hidden className={`pointer-events-none absolute z-30 h-2 w-2 rounded-[2px] border-2 bg-white ${pos}`} style={{ borderColor: SELECT_COLOR }} />
            ))}
            <div
              className="absolute -top-8 left-0 z-30 flex h-6 select-none items-center rounded-md text-xs font-semibold text-white shadow-md"
              style={{ background: SELECT_COLOR }}
              onClick={(e) => e.stopPropagation()}
            >
              <span
                draggable
                title="Arraste para mover este componente"
                onDragStart={(e) => {
                  dragRef.current = { kind: 'block', s, c };
                  e.dataTransfer.setData(DRAG_MOVE, '1');
                  e.dataTransfer.setData('text/plain', def?.label || '');
                  e.dataTransfer.effectAllowed = 'move';
                  if (frameRef.current) e.dataTransfer.setDragImage(frameRef.current, 16, 12);
                }}
                onDragEnd={() => { dragRef.current = null; clearDrop(); }}
                className="flex h-6 w-6 cursor-grab items-center justify-center rounded-l-md hover:bg-black/15 active:cursor-grabbing"
              >
                ⠿
              </span>
              <span className="whitespace-nowrap px-1.5">{def?.icon} {def?.label}</span>
              <button type="button" disabled={c === 0} onClick={() => ops.moveBlockBy(s, c, -1)} title="Mover para cima" className={chromeBtn}>↑</button>
              <button type="button" disabled={c === total - 1} onClick={() => ops.moveBlockBy(s, c, 1)} title="Mover para baixo" className={chromeBtn}>↓</button>
              <button type="button" onClick={() => ops.duplicateBlock(s, c)} title="Duplicar" className={chromeBtn}>⧉</button>
              {hasOptions && (
                <button type="button" onClick={() => setOptionsOpen((v) => !v)} aria-expanded={optionsOpen} title="Opções deste componente" className={`${chromeBtn} ${optionsOpen ? 'bg-black/20' : ''}`}>⚙</button>
              )}
              {def && <HelpButton definition={def} className="!h-6 !w-6 !rounded-none !border-0 !bg-transparent !text-xs !text-white hover:!bg-black/15" />}
              <button type="button" onClick={() => ops.removeBlock(s, c)} title="Excluir (Delete)" className={`${chromeBtn} rounded-r-md`}>🗑</button>
            </div>
            {optionsOpen && def && (
              <OptionsPopover
                block={block}
                def={def}
                hasEditor={!!Editor}
                canEditSpacing={canEditSpacing}
                onChange={(b) => ops.changeBlock(s, c, b)}
                onClose={() => setOptionsOpen(false)}
              />
            )}
          </>
        ) : (
          <span
            className="pointer-events-none absolute -top-6 left-0 z-20 hidden h-5 items-center whitespace-nowrap rounded px-1.5 text-[11px] font-semibold text-white shadow group-hover/block:flex"
            style={{ background: SELECT_COLOR }}
          >
            {def?.icon} {def?.label}
          </span>
        )}

        {/* "+" na borda de baixo: adiciona um componente logo abaixo deste */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); ops.openQuickAdd(e.currentTarget.getBoundingClientRect(), { s, c: c + 1 }); }}
          title="Adicionar um componente logo abaixo"
          aria-label="Adicionar componente abaixo"
          className="absolute -bottom-3 left-1/2 z-30 hidden h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full text-base font-bold leading-none text-white shadow-md group-hover/block:flex focus:flex"
          style={{ background: SELECT_COLOR }}
        >
          +
        </button>
      </div>
    </div>
  );
}

const barBtn = 'flex h-7 w-7 items-center justify-center rounded-md text-base text-ink/70 transition-colors hover:bg-white/70 disabled:opacity-30 disabled:hover:bg-transparent';

function ChapterFrame({ section, s, total, selected, focusKey, onSelect, ops, drop, setDrop, dragRef, clearDrop }) {
  const { canEditSpacing } = useContext(BuilderContext);
  const [collapsed, setCollapsed] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const children = kids(section);
  const chapterSelected = selected?.kind === 'section' && selected.s === s;
  const inside = selected?.kind === 'block' && selected.s === s;
  const dropHere = drop?.kind === 'block' && drop.s === s;
  const barRef = useRef(null);
  // rótulo e subtítulo vazios só aparecem quando o capítulo está em uso, para não poluir a página
  const showAll = chapterSelected || inside;
  const titleAfter = spacingValue(section.titleAfter);
  const titleBefore = spacingValue(section.titleBefore);

  const stop = (fn) => (e) => { e.stopPropagation(); fn(); };

  // arrastando um capítulo: solta antes (metade de cima) ou depois (metade de baixo) deste
  const chapterIndex = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    return e.clientY < r.top + r.height / 2 ? s : s + 1;
  };

  const onDragOver = (e) => {
    const kind = dragKind(e);
    if (!kind) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = kind === 'new' ? 'copy' : 'move';
    if (kind === 'chapter') {
      const index = chapterIndex(e);
      if (drop?.kind !== 'chapter' || drop.index !== index) setDrop({ kind: 'chapter', index });
      return;
    }
    const { c, top } = collapsed ? { c: children.length, top: 0 } : locate(e, e.currentTarget);
    if (!dropHere || drop.c !== c || Math.abs(drop.top - top) > 1) setDrop({ kind: 'block', s, c, top });
  };
  const onDrop = (e) => {
    const kind = dragKind(e);
    if (!kind) return;
    e.preventDefault();
    e.stopPropagation();
    const dragged = dragRef.current;
    if (kind === 'chapter') {
      const index = chapterIndex(e);
      clearDrop();
      dragRef.current = null;
      if (dragged?.kind === 'chapter') ops.dropChapter(dragged.s, index);
      return;
    }
    const at = collapsed ? children.length : locate(e, e.currentTarget).c;
    clearDrop();
    if (kind === 'new') ops.addBlock(e.dataTransfer.getData(DRAG_NEW), { s, c: at });
    else if (dragged?.kind === 'block') ops.dropMove(dragged, { s, c: at });
    dragRef.current = null;
  };

  return (
    <div
      data-chapter={s}
      className="relative scroll-mt-6 rounded-xl"
      style={chapterSelected ? { outline: `2px solid ${SELECT_COLOR}`, outlineOffset: 8 } : dropHere ? { outline: `2px dashed ${SELECT_COLOR}`, outlineOffset: 8 } : undefined}
      onClick={(e) => { e.stopPropagation(); onSelect({ kind: 'section', s }); }}
      onDragOver={onDragOver}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDrop((d) => (d && d.s === s ? null : d)); }}
      onDrop={onDrop}
    >
      {/* linhas-guia ao arrastar um capítulo para esta posição */}
      {drop?.kind === 'chapter' && drop.index === s && (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-5 z-40 h-1 rounded-full" style={{ background: SELECT_COLOR }} />
      )}
      {drop?.kind === 'chapter' && s === total - 1 && drop.index === total && (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-5 z-40 h-1 rounded-full" style={{ background: SELECT_COLOR }} />
      )}

      {/* barra do capítulo (só existe no editor) */}
      <div ref={barRef} className="relative mb-3 flex items-center gap-2 rounded-lg border border-lav-bar bg-lav px-2 py-1.5">
        <span
          draggable
          title="Arraste para mudar este capítulo de lugar"
          onClick={(e) => e.stopPropagation()}
          onDragStart={(e) => {
            dragRef.current = { kind: 'chapter', s };
            e.dataTransfer.setData(DRAG_CHAPTER, '1');
            e.dataTransfer.setData('text/plain', `Capítulo ${s + 1}`);
            e.dataTransfer.effectAllowed = 'move';
            if (barRef.current) e.dataTransfer.setDragImage(barRef.current, 24, 16);
          }}
          onDragEnd={() => { dragRef.current = null; clearDrop(); }}
          className="flex h-8 w-6 shrink-0 cursor-grab select-none items-center justify-center rounded-md text-ink/60 hover:bg-white/60 active:cursor-grabbing"
        >
          ⠿
        </span>
        <button
          type="button"
          onClick={stop(() => setCollapsed((v) => !v))}
          aria-expanded={!collapsed}
          title={collapsed ? 'Mostrar conteúdo do capítulo' : 'Recolher capítulo'}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-2xl leading-none text-ink hover:bg-white/60"
        >
          {collapsed ? '▸' : '▾'}
        </button>
        <span className="shrink-0 rounded-md bg-blue-700 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-white">Capítulo {s + 1}</span>
        <span aria-hidden className="shrink-0 text-sm">✏️</span>
        <InlineText
          value={section.name}
          onChange={(v) => ops.patchSection(s, { name: v })}
          placeholder="Nome do capítulo — só você vê"
          label="Nome do capítulo (só você vê, não aparece para o aluno)"
          className="min-w-0 flex-1 truncate px-1 text-sm font-bold text-ink"
        />
        <span className="hidden shrink-0 text-xs font-semibold text-ink/70 sm:inline">
          {children.length} componente{children.length === 1 ? '' : 's'}
        </span>
        <button type="button" disabled={s === 0} onClick={stop(() => ops.moveSectionBy(s, -1))} title="Mover capítulo para cima" className={barBtn}>↑</button>
        <button type="button" disabled={s === total - 1} onClick={stop(() => ops.moveSectionBy(s, 1))} title="Mover capítulo para baixo" className={barBtn}>↓</button>
        <button type="button" onClick={stop(() => ops.duplicateSection(s))} title="Duplicar capítulo" className={barBtn}>⧉</button>
        {canEditSpacing && (
          <button type="button" onClick={stop(() => setOptionsOpen((v) => !v))} aria-expanded={optionsOpen} title="Espaçamento do título (só Suporte técnico e Administrador)" className={`${barBtn} ${optionsOpen ? 'bg-white/70' : ''}`}>⚙</button>
        )}
        <button type="button" onClick={stop(() => ops.removeSection(s))} title="Excluir capítulo" className={`${barBtn} text-red-600`}>🗑</button>
        {optionsOpen && canEditSpacing && (
          <div className="absolute right-0 top-full z-50 mt-1 w-72 space-y-3 rounded-xl border border-gray-200 bg-white p-4 text-ink shadow-xl" style={{ fontSize: 14 }} onClick={(e) => e.stopPropagation()}>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">↕ Espaçamento do título</p>
            <SpacingField label="Em cima do título" value={section.titleBefore} onChange={(v) => ops.patchSection(s, { titleBefore: v })} />
            <SpacingField label="Entre o título e os componentes" value={section.titleAfter} onChange={(v) => ops.patchSection(s, { titleAfter: v })} />
          </div>
        )}
      </div>

      {collapsed ? (
        <p className="rounded-lg border border-dashed border-lav-bar py-3 text-center text-sm text-ink/60">
          Capítulo recolhido — {children.length} componente{children.length === 1 ? '' : 's'} oculto{children.length === 1 ? '' : 's'}.
        </p>
      ) : (
        <section className="space-y-4">
          <div className="space-y-1" style={{ paddingTop: titleBefore, marginBottom: titleAfter }}>
            {(showAll || section.label) && (
              <p className="text-[0.7em] font-bold uppercase tracking-widest text-blue-600">
                <InlineText value={section.label} onChange={(v) => ops.patchSection(s, { label: v })} placeholder="Rótulo (ex: HISTÓRIA)" className="block" />
              </p>
            )}
            <h2 className="text-left font-bold leading-tight text-ink" style={{ fontSize: 'clamp(1.15em, 4vw, 1.4em)' }}>
              <InlineText value={section.title} onChange={(v) => ops.patchSection(s, { title: v })} placeholder="Título do capítulo (opcional)" className="block" />
            </h2>
            {(showAll || section.subtitle) && (
              <p className="italic text-ink/70" style={{ fontSize: '0.9em' }}>
                <InlineText value={section.subtitle} onChange={(v) => ops.patchSection(s, { subtitle: v })} placeholder="Subtítulo (opcional)" className="block" />
              </p>
            )}
          </div>

          <div data-children className="relative space-y-4">
            {children.length === 0 && (
              <div className="rounded-xl border-2 border-dashed border-lav-bar bg-lav-soft/50 px-4 py-8 text-center text-sm text-ink/60">
                Capítulo vazio — arraste um componente da lista para cá ou use o botão abaixo.
              </div>
            )}
            {children.map((block, c) => (
              <BlockFrame
                key={c}
                block={block}
                s={s}
                c={c}
                total={children.length}
                selected={selected?.kind === 'block' && selected.s === s && selected.c === c}
                focusKey={focusKey}
                ops={ops}
                onSelect={onSelect}
                dragRef={dragRef}
                clearDrop={clearDrop}
              />
            ))}
            {dropHere && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 z-40 h-1 rounded-full"
                style={{ top: drop.top - 2, background: SELECT_COLOR }}
              />
            )}
          </div>

          {/* adicionar um componente no fim deste capítulo (também dá para arrastar da lista) */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); ops.openQuickAdd(e.currentTarget.getBoundingClientRect(), { s, c: children.length }); }}
            className="w-full rounded-lg border-2 border-dashed border-lav-bar py-2 text-sm font-bold text-ink/60 transition-colors hover:bg-lav-soft hover:text-ink"
          >
            + Adicionar componente neste capítulo
          </button>
        </section>
      )}
    </div>
  );
}

function LessonHeader({ lesson, selected, onSelect, ops }) {
  const isSel = selected?.kind === 'lesson';
  return (
    <div
      data-lesson-header
      className={`scroll-mt-6 rounded-2xl ${isSel ? '' : HOVER}`}
      style={isSel ? SELECTED : undefined}
      onClick={(e) => { e.stopPropagation(); onSelect({ kind: 'lesson' }); }}
    >
      <header className="relative overflow-hidden rounded-2xl border-l-[10px] border-[color:var(--lesson-accent,#1e40af)] bg-white px-5 py-5 shadow-sm md:px-8 md:py-8">
        <div className="relative z-10 space-y-3 md:space-y-4">
          <div className="flex items-center gap-3 text-base">
            <span className="rounded bg-[color:var(--lesson-accent-soft,#eff6ff)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[color:var(--lesson-accent,#1e40af)]">
              Aula{' '}
              <InlineText value={lesson.aula} onChange={(v) => ops.updateMeta('aula', v)} placeholder="Nº" label="Número da aula" className="inline-block min-w-[1.5ch]" />
            </span>
            <div className="h-px flex-grow bg-gray-100" />
          </div>
          <h1 className="font-bold leading-tight text-gray-900" style={{ fontSize: 'clamp(1.5em, 7vw, 2.5em)' }}>
            <InlineText value={lesson.titulo} onChange={(v) => ops.updateMeta('titulo', v)} placeholder="Título da aula" className="block" />
          </h1>
          <p className="max-w-3xl font-light italic leading-relaxed text-gray-600" style={{ fontSize: 'clamp(1em, 3vw, 1.1em)' }}>
            <InlineText value={lesson.objetivo} onChange={(v) => ops.updateMeta('objetivo', v)} placeholder="Objetivo da aula (opcional)" className="block" />
          </p>
        </div>
      </header>
    </div>
  );
}

export default function Canvas({ lesson, selected, focusKey, onSelect, ops, scrollRef, dragRef }) {
  const [drop, setDrop] = useState(null);
  const clearDrop = () => setDrop(null);

  useEffect(() => {
    const clear = () => setDrop(null);
    window.addEventListener('dragend', clear);
    window.addEventListener('drop', clear);
    return () => { window.removeEventListener('dragend', clear); window.removeEventListener('drop', clear); };
  }, []);

  const sectionCount = lesson.sections.length;

  return (
    <div ref={scrollRef} onClick={() => onSelect(null)} className="min-w-0 flex-1 overflow-y-auto bg-[#ececec] px-6 pb-28 pt-6">
      <div className="mx-auto w-full max-w-[1000px]">
        {/* "moldura" da página, como a etiqueta de um quadro em editores de design */}
        <div className="flex items-center gap-2 rounded-t-lg bg-[#e0e0e0] px-3 py-1.5 text-xs font-semibold text-gray-500">
          <span aria-hidden className="flex h-5 w-5 items-center justify-center rounded bg-white/70 text-[9px]">▶</span>
          Aula {lesson.aula} <span className="font-normal text-gray-400">·</span> <span className="font-normal">largura 1000</span>
        </div>

        <div className="rounded-b-lg bg-white font-[Inter] text-ink shadow-md" style={{ fontSize: 16, ...lessonThemeStyle(lesson.cor) }}>
          <div className="space-y-8 px-4 py-8 md:space-y-10 md:px-8 md:py-12">
            <LessonHeader lesson={lesson} selected={selected} onSelect={onSelect} ops={ops} />

            <div className="space-y-8 md:space-y-10" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
              {sectionCount === 0 && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  onDragOver={(e) => { if (dragKind(e) === 'new') { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; } }}
                  onDrop={(e) => {
                    if (!Array.from(e.dataTransfer.types).includes(DRAG_NEW)) return;
                    e.preventDefault();
                    ops.addBlock(e.dataTransfer.getData(DRAG_NEW));
                  }}
                  className="rounded-xl border-2 border-dashed border-lav-bar bg-lav-soft/50 px-4 py-14 text-center"
                >
                  <p className="text-base font-bold text-ink">Sua aula ainda está vazia</p>
                  <p className="mx-auto mt-1 max-w-md text-sm text-ink/70">
                    Comece criando um capítulo — os componentes ficam dentro dele. Você também pode arrastar um componente da lista para cá.
                  </p>
                  <button type="button" onClick={ops.addSection} className="mt-4 rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800">
                    + Adicionar capítulo
                  </button>
                </div>
              )}

              {lesson.sections.map((section, s) => (
                <ChapterFrame
                  key={s}
                  section={section}
                  s={s}
                  total={sectionCount}
                  selected={selected}
                  focusKey={focusKey}
                  onSelect={onSelect}
                  ops={ops}
                  drop={drop}
                  setDrop={setDrop}
                  dragRef={dragRef}
                  clearDrop={clearDrop}
                />
              ))}

              {sectionCount > 0 && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); ops.addSection(); }}
                  className="w-full rounded-xl border-2 border-dashed border-blue-400 py-4 text-sm font-bold text-blue-700 transition-colors hover:bg-lav-soft"
                >
                  + Adicionar capítulo
                </button>
              )}
            </div>

            <footer className="border-t border-lav pt-16 text-center text-xs font-semibold tracking-widest text-ink/50">
              <p>© MATERIAL DIGITAL UFC • INSTITUTO UFC VIRTUAL (IUVI)</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
