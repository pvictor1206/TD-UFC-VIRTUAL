import { useEffect, useMemo, useRef, useState } from 'react';
import { SECTION_CATALOG, GROUPS, getSectionDefinition } from '@lesson';
import HelpButton from '../Builder/HelpButton';
import { kids, previewOf, sectionLabel } from './lessonOps';

// Tipos de dado usados no arrastar-e-soltar.
export const DRAG_NEW = 'application/x-editor2-novo'; // componente novo, vindo da lista
export const DRAG_MOVE = 'application/x-editor2-mover'; // componente que já está na página

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

function LayerRow({ depth, active, onClick, children, rowRef, title }) {
  return (
    <button
      ref={rowRef}
      type="button"
      onClick={onClick}
      title={title}
      className={`flex w-full items-center gap-2 rounded-lg py-1.5 pr-2 text-left text-sm transition-colors ${
        active ? 'bg-[#e6f2ff] font-semibold text-[#0a5cc2]' : 'text-gray-700 hover:bg-gray-100'
      }`}
      style={{ paddingLeft: 8 + depth * 18 }}
    >
      {children}
    </button>
  );
}

function Layers({ lesson, selected, onSelect }) {
  const activeRef = useRef(null);
  const [closed, setClosed] = useState({}); // capítulo (índice) -> recolhido

  // mantém a camada selecionada à vista quando a seleção vem da página
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  const ref = (sel) => (sameSel(selected, sel) ? activeRef : null);

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
        return (
          <div key={s}>
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
                <LayerRow depth={0} active={sameSel(selected, sel)} rowRef={ref(sel)} onClick={() => onSelect(sel, true)} title={sectionLabel(section, s)}>
                  <span className="w-5 shrink-0 text-center">🔖</span>
                  <span className="truncate">{sectionLabel(section, s)}</span>
                  <span className="ml-auto shrink-0 text-xs font-normal text-gray-400">{kids(section).length}</span>
                </LayerRow>
              </div>
            </div>
            {open &&
              kids(section).map((block, c) => {
                const def = getSectionDefinition(block.type);
                const csel = { kind: 'block', s, c };
                const preview = previewOf(block);
                return (
                  <LayerRow key={c} depth={2} active={sameSel(selected, csel)} rowRef={ref(csel)} onClick={() => onSelect(csel, true)} title={def?.label}>
                    <span className="w-5 shrink-0 text-center">{def?.icon || '▫️'}</span>
                    <span className="truncate">
                      {def?.label || block.type}
                      {preview && <span className="font-normal text-gray-400"> · {preview}</span>}
                    </span>
                  </LayerRow>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}

// Painel da esquerda: lista de componentes (clique ou arraste) e camadas da aula.
export default function LeftPanel({ lesson, selected, tab, onTab, onSelect, onAddBlock, onAddSection }) {
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
          <Layers lesson={lesson} selected={selected} onSelect={onSelect} />
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
