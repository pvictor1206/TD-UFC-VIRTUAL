import { SECTION_CATALOG, GROUPS, getSectionDefinition } from '@lesson';
import BlockCard from './BlockCard';

// Lista de blocos dentro de uma seção (título). Usa os mesmos cartões de
// edição da lista principal, mas não permite colocar uma seção dentro de outra.
export default function NestedBlocks({ value, onChange }) {
  const blocks = value || [];

  const add = (type) => {
    const definition = getSectionDefinition(type);
    if (definition) onChange([...blocks, definition.defaultData()]);
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
    <div className="rounded-lg border-l-4 border-lav-bar bg-lav-soft/60 pl-3 pr-2 py-3 space-y-3">
      {blocks.length === 0 && (
        <p className="text-xs text-gray-500 italic">Nenhum bloco nesta seção ainda. Adicione abaixo.</p>
      )}
      {blocks.map((block, i) => (
        <BlockCard
          key={i}
          section={block}
          index={i}
          total={blocks.length}
          nested
          onChange={(b) => update(i, b)}
          onRemove={() => remove(i)}
          onDuplicate={() => duplicate(i)}
          onMove={(dir) => move(i, dir)}
        />
      ))}
      <select
        value=""
        onChange={(e) => e.target.value && add(e.target.value)}
        aria-label="Adicionar bloco dentro desta seção"
        className="w-full rounded-lg border border-dashed border-blue-400 bg-white text-blue-700 px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">+ Adicionar bloco dentro desta seção…</option>
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
