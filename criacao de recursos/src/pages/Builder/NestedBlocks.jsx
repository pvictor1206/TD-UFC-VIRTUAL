import { useEffect, useRef } from 'react';
import { SECTION_CATALOG, GROUPS, getSectionDefinition } from '@lesson';
import BlockCard from './BlockCard';

// Lista de blocos dentro de um capítulo (título). Usa os mesmos cartões de
// edição da lista principal, mas não permite colocar um capítulo dentro de outro.
export default function NestedBlocks({ value, onChange, sectionNumber }) {
  const blocks = value || [];
  const rootRef = useRef(null);
  const newIndexRef = useRef(null); // componente recém-criado neste capítulo: a tela rola até ele

  useEffect(() => {
    const i = newIndexRef.current;
    if (i === null) return;
    newIndexRef.current = null;
    const go = () => rootRef.current?.querySelector(`[data-child-index="${i}"]`)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    requestAnimationFrame(() => { go(); requestAnimationFrame(go); });
    setTimeout(go, 150);
  }, [blocks.length]);

  const add = (type) => {
    const definition = getSectionDefinition(type);
    if (!definition) return;
    newIndexRef.current = blocks.length;
    onChange([...blocks, definition.defaultData()]);
  };
  const update = (i, block) => onChange(blocks.map((b, idx) => (idx === i ? block : b)));
  const remove = (i) => onChange(blocks.filter((_, idx) => idx !== i));
  const duplicate = (i) => {
    const next = [...blocks];
    next.splice(i + 1, 0, JSON.parse(JSON.stringify(blocks[i])));
    onChange(next);
  };
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div ref={rootRef} className="space-y-3">
      {blocks.length === 0 && (
        <p className="text-xs text-gray-500 italic">Nenhum componente nesta capítulo ainda. Adicione abaixo ou pela barra lateral.</p>
      )}
      {blocks.map((block, i) => (
        <div key={i} data-child-index={i} style={{ scrollMarginTop: 190 }}>
        <BlockCard
          section={block}
          index={i}
          total={blocks.length}
          nested
          number={sectionNumber ? `${sectionNumber}.${i + 1}` : undefined}
          onChange={(b) => update(i, b)}
          onRemove={() => remove(i)}
          onDuplicate={() => duplicate(i)}
          onMove={(dir) => move(i, dir)}
        />
        </div>
      ))}
      <select
        value=""
        onChange={(e) => e.target.value && add(e.target.value)}
        aria-label="Adicionar bloco dentro deste capítulo"
        className="w-full rounded-lg border border-dashed border-blue-400 bg-white text-blue-700 px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">+ Adicionar componente nesta capítulo…</option>
        {GROUPS.map((group) => {
          const options = SECTION_CATALOG.filter((b) => b.group === group.id && b.type !== 'section');
          if (options.length === 0) return null;
          return (
            <optgroup key={group.id} label={group.label}>
              {options.map((b) => (
                <option key={b.type} value={b.type}>{b.icon} {b.label}</option>
              ))}
            </optgroup>
          );
        })}
      </select>
    </div>
  );
}
