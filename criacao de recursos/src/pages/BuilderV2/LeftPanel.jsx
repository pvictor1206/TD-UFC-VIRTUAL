import { useEffect, useMemo, useRef, useState } from 'react';
import { SECTION_CATALOG, GROUPS, getSectionDefinition } from '@lesson';
import HelpButton from '../Builder/HelpButton';
import { kids, previewOf, sectionLabel } from './lessonOps';

// Tipos de dado usados no arrastar-e-soltar.
export const DRAG_NEW = 'application/x-editor2-novo'; // componente novo, vindo da lista
export const DRAG_MOVE = 'application/x-editor2-mover'; // componente que já está na página
export const DRAG_CHAPTER = 'application/x-editor2-capitulo'; // capítulo que já está na página

export const SELECT_COLOR = '#0a84ff';

const normalize = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const sameSel = (a, b) =>
  !!a && !!b && a.kind === b.kind && (a.s ?? null) === (b.s ?? null) && (a.c ?? null) === (b.c ?? null);

function ComponentList({ onAdd, search }) {
  const q = normalize(search).trim();
  const groups = useMemo(
    () =>
      GROUPS.map((group) => ({
        ...group,
        blocks: SECTION_CATALOG.filter(
          (b) =>
            b.group === group.id &&
            b.type !== 'section' &&
            (!q || normalize(`${b.label} ${b.description} ${group.label}`).includes(q))
        ),
      })).filter((g) => g.blocks.length > 0),
    [q]
  );

  if (groups.length === 0) {
    return <p className="px-1 py-6 text-center text-sm text-gray-400">Nenhum componente encontrado para “{search}”.</p>;
  }

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group.id}>
          <h3 className="mb-1.5 px-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">{group.label}</h3>
          <div className="space-y-0.5">
            {group.blocks.map((block) => (
              <div
                key={block.type}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(DRAG_NEW, block.type);
                  e.dataTransfer.setData('text/plain', block.label);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                className="group flex items-center gap-1"
              >
                <button
                  type="button"
                  onClick={() => onAdd(block.type)}
                  title={`${block.description} Clique para adicionar ou arraste para a página.`}
                  className="flex min-w-0 flex-1 cursor-grab items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 active:cursor-grabbing"
                >
                  <span className="w-5 shrink-0 text-center text-base">{block.icon}</span>
                  <span className="truncate font-medium">{block.label}</span>
                </button>
                <HelpButton definition={block} className="!h-7 !w-7 !text-xs opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// (div em vez de button: botões não são arrastáveis em todos os navegadores)
function LayerRow({ depth, active, onClick, children, rowRef, title, dragProps, tint }) {
  return (
    <div
      ref={rowRef}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      title={title}
      {...dragProps}
      className={`flex w-full cursor-pointer items-center gap-2 rounded-lg py-1.5 pr-2 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-300 ${
        tint ? 'bg-[#cfe6ff]' : active ? 'bg-[#e6f2ff] font-semibold text-[#0a5cc2]' : 'text-gray-700 hover:bg-gray-100'
      }`}
      style={{ paddingLeft: 8 + depth * 18 }}
    >
      {children}
    </div>
  );
}

const dragKinds = (e) => Array.from(e.dataTransfer?.types || []);
const halfOf = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  return e.clientY < r.top + r.height / 2 ? 'top' : 'bottom';
};

// Linha-guia azul (onde o item vai ficar ao soltar)
const Line = ({ edge }) => (
  <span aria-hidden className="pointer-events-none absolute inset-x-1 z-10 h-0.5 rounded-full" style={{ background: SELECT_COLOR, [edge === 'top' ? 'top' : 'bottom']: 0 }} />
);

// Camadas: a estrutura da aula. Clique seleciona; arraste para reorganizar (componentes entre capítulos,
// capítulos inteiros); o "+" do capítulo adiciona um componente nele.
function Layers({ lesson, selected, onSelect, dragRef, ops }) {
  const activeRef = useRef(null);
  const [closed, setClosed] = useState({}); // capítulo (índice) -> recolhido
  // o que está sob o item arrastado: { kind: 'line', s, c, edge } | { kind: 'into', s } | { kind: 'chapter', s, edge }
  const [mark, setMark] = useState(null);

  // mantém a camada selecionada à vista quando a seleção vem da página
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  useEffect(() => {
    const clear = () => setMark(null);
    window.addEventListener('dragend', clear);
    window.addEventListener('drop', clear);
    return () => { window.removeEventListener('dragend', clear); window.removeEventListener('drop', clear); };
  }, []);

  const ref = (sel) => (sameSel(selected, sel) ? activeRef : null);
  const isBlockDrag = (e) => { const t = dragKinds(e); return t.includes(DRAG_MOVE) || t.includes(DRAG_NEW); };
  const isChapterDrag = (e) => dragKinds(e).includes(DRAG_CHAPTER);
  const leave = (e, same) => { if (!e.currentTarget.contains(e.relatedTarget)) setMark((m) => (m && same(m) ? null : m)); };

  // solta um componente (novo ou existente) na posição c do capítulo s
  const dropBlock = (e, s, c) => {
    const types = dragKinds(e);
    const from = dragRef.current;
    setMark(null);
    if (types.includes(DRAG_NEW)) ops.addBlock(e.dataTransfer.getData(DRAG_NEW), { s, c }, { scroll: true });
    else if (from?.kind === 'block') ops.dropMove(from, { s, c }, { scroll: true });
    dragRef.current = null;
  };

  const startDrag = (payload, type) => (e) => {
    dragRef.current = payload;
    e.dataTransfer.setData(type, '1');
    e.dataTransfer.setData('text/plain', '');
    e.dataTransfer.effectAllowed = 'move';
  };
  const endDrag = () => { dragRef.current = null; setMark(null); };

  return (
    <div className="space-y-0.5">
      <LayerRow depth={0} active={selected?.kind === 'lesson'} rowRef={ref({ kind: 'lesson' })} onClick={() => onSelect({ kind: 'lesson' }, true)}>
        <span className="w-5 shrink-0 text-center">🎓</span>
        <span className="truncate">{lesson.titulo || `Aula ${lesson.aula || ''}`.trim()}</span>
      </LayerRow>

      {lesson.sections.length === 0 && <p className="px-2 py-4 text-sm text-gray-400">Nenhum capítulo ainda.</p>}

      {lesson.sections.map((section, s) => {
        const open = !closed[s];
        const sel = { kind: 'section', s };
        const children = kids(section);
        const chapterMark = mark?.kind === 'chapter' && mark.s === s ? mark.edge : null;
        return (
          <div
            key={s}
            className="relative"
            // arrastando um capítulo: solta antes ou depois deste (metade de cima / de baixo do grupo inteiro)
            onDragOver={(e) => {
              if (!isChapterDrag(e)) return;
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              const edge = halfOf(e);
              if (!mark || mark.kind !== 'chapter' || mark.s !== s || mark.edge !== edge) setMark({ kind: 'chapter', s, edge });
            }}
            onDragLeave={(e) => leave(e, (m) => m.kind === 'chapter' && m.s === s)}
            onDrop={(e) => {
              if (!isChapterDrag(e)) return;
              e.preventDefault();
              const from = dragRef.current;
              const edge = halfOf(e);
              setMark(null);
              dragRef.current = null;
              if (from?.kind === 'chapter') ops.dropChapter(from.s, edge === 'top' ? s : s + 1, { scroll: true });
            }}
          >
            {chapterMark && <Line edge={chapterMark} />}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setClosed((c) => ({ ...c, [s]: open }))}
                aria-label={open ? 'Recolher capítulo' : 'Expandir capítulo'}
                aria-expanded={open}
                className="flex h-7 w-6 shrink-0 items-center justify-center rounded text-gray-500 hover:bg-gray-100"
              >
                {open ? '▾' : '▸'}
              </button>
              <div className="min-w-0 flex-1">
                <LayerRow
                  depth={0}
                  active={sameSel(selected, sel)}
                  tint={mark?.kind === 'into' && mark.s === s}
                  rowRef={ref(sel)}
                  onClick={() => onSelect(sel, true)}
                  title={`${sectionLabel(section, s)} — arraste para mudar de lugar`}
                  dragProps={{
                    draggable: true,
                    onDragStart: startDrag({ kind: 'chapter', s }, DRAG_CHAPTER),
                    onDragEnd: endDrag,
                    // um componente solto em cima do capítulo entra no fim dele
                    onDragOver: (e) => {
                      if (!isBlockDrag(e)) return;
                      e.preventDefault();
                      e.stopPropagation();
                      e.dataTransfer.dropEffect = dragKinds(e).includes(DRAG_NEW) ? 'copy' : 'move';
                      if (!mark || mark.kind !== 'into' || mark.s !== s) setMark({ kind: 'into', s });
                    },
                    onDragLeave: (e) => leave(e, (m) => m.kind === 'into' && m.s === s),
                    onDrop: (e) => {
                      if (!isBlockDrag(e)) return;
                      e.preventDefault();
                      e.stopPropagation();
                      dropBlock(e, s, children.length);
                    },
                  }}
                >
                  <span className="w-5 shrink-0 text-center">🔖</span>
                  <span className="truncate">{sectionLabel(section, s)}</span>
                  <span className="ml-auto shrink-0 text-xs font-normal text-gray-400">{children.length}</span>
                </LayerRow>
              </div>
              <button
                type="button"
                onClick={(e) => ops.openQuickAdd(e.currentTarget.getBoundingClientRect(), { s, c: children.length }, { scroll: true })}
                title="Adicionar um componente neste capítulo"
                aria-label={`Adicionar componente no capítulo ${s + 1}`}
                className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-[#0a5cc2] hover:bg-[#e6f2ff]"
              >
                +
              </button>
            </div>

            {open &&
              children.map((block, c) => {
                const def = getSectionDefinition(block.type);
                const csel = { kind: 'block', s, c };
                const preview = previewOf(block);
                const lineEdge = mark?.kind === 'line' && mark.s === s && mark.c === c ? mark.edge : null;
                return (
                  <div key={c} className="relative">
                    {lineEdge && <Line edge={lineEdge} />}
                    <LayerRow
                      depth={2}
                      active={sameSel(selected, csel)}
                      rowRef={ref(csel)}
                      onClick={() => onSelect(csel, true)}
                      title={`${def?.label || ''} — arraste para mudar de lugar`}
                      dragProps={{
                        draggable: true,
                        onDragStart: startDrag({ kind: 'block', s, c }, DRAG_MOVE),
                        onDragEnd: endDrag,
                        // solta antes (metade de cima) ou depois (metade de baixo) deste componente
                        onDragOver: (e) => {
                          if (!isBlockDrag(e)) return;
                          e.preventDefault();
                          e.stopPropagation();
                          e.dataTransfer.dropEffect = dragKinds(e).includes(DRAG_NEW) ? 'copy' : 'move';
                          const edge = halfOf(e);
                          if (!mark || mark.kind !== 'line' || mark.s !== s || mark.c !== c || mark.edge !== edge) setMark({ kind: 'line', s, c, edge });
                        },
                        onDragLeave: (e) => leave(e, (m) => m.kind === 'line' && m.s === s && m.c === c),
                        onDrop: (e) => {
                          if (!isBlockDrag(e)) return;
                          e.preventDefault();
                          e.stopPropagation();
                          dropBlock(e, s, halfOf(e) === 'top' ? c : c + 1);
                        },
                      }}
                    >
                      <span className="w-5 shrink-0 text-center">{def?.icon || '▫️'}</span>
                      <span className="truncate">
                        {def?.label || block.type}
                        {preview && <span className="font-normal text-gray-400"> · {preview}</span>}
                      </span>
                    </LayerRow>
                  </div>
                );
              })}
          </div>
        );
      })}
      {lesson.sections.length > 1 && (
        <p className="px-2 pt-3 text-[11px] leading-snug text-gray-400">
          Arraste um componente ou um capítulo para mudar a ordem. Use o + para adicionar um componente no capítulo.
        </p>
      )}
    </div>
  );
}

// Painel da esquerda: lista de componentes (clique ou arraste) e camadas da aula.
export default function LeftPanel({ lesson, selected, tab, onTab, onSelect, onAddBlock, onAddSection, dragRef, ops }) {
  const [search, setSearch] = useState('');

  const tabBtn = (id, label) => (
    <button
      type="button"
      onClick={() => onTab(id)}
      aria-pressed={tab === id}
      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${tab === id ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
    >
      {label}
    </button>
  );

  return (
    <aside className="flex min-h-0 w-72 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center gap-1 px-3 pt-3">
        {tabBtn('components', 'Componentes')}
        {tabBtn('layers', 'Camadas')}
      </div>

      <div className="space-y-2 border-b border-gray-100 px-3 pb-3 pt-3">
        {tab === 'components' && (
          <label className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-500 focus-within:ring-2 focus-within:ring-blue-300">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar componente…"
              aria-label="Buscar componente"
              className="min-w-0 flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
          </label>
        )}
        <button
          type="button"
          onClick={onAddSection}
          className="w-full rounded-lg bg-blue-700 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-800"
        >
          + Adicionar capítulo
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {tab === 'components' ? (
          <ComponentList onAdd={onAddBlock} search={search} />
        ) : (
          <Layers lesson={lesson} selected={selected} onSelect={onSelect} dragRef={dragRef} ops={ops} />
        )}
      </div>

      {tab === 'components' && (
        <p className="border-t border-gray-100 px-4 py-2.5 text-[11px] leading-snug text-gray-400">
          Clique para adicionar abaixo do que está selecionado ou arraste direto para a página.
        </p>
      )}
    </aside>
  );
}
