import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SECTION_CATALOG, GROUPS } from '@lesson';

const normalize = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Janelinha "adicionar componente aqui": aparece junto do botão "+" clicado (na página ou nas camadas),
// com busca. Escolher um componente o coloca exatamente no lugar onde o "+" estava.
export default function QuickAdd({ rect, title, onPick, onClose }) {
  const [q, setQ] = useState('');
  const box = useRef(null);
  const needle = normalize(q).trim();

  const groups = useMemo(
    () =>
      GROUPS.map((group) => ({
        ...group,
        blocks: SECTION_CATALOG.filter(
          (b) => b.group === group.id && b.type !== 'section' && (!needle || normalize(`${b.label} ${b.description} ${group.label}`).includes(needle))
        ),
      })).filter((g) => g.blocks.length > 0),
    [needle]
  );

  useEffect(() => {
    const onDown = (e) => { if (!box.current?.contains(e.target)) onClose(); };
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [onClose]);

  // abaixo do botão; se não couber, acima
  const width = 360;
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
  const room = window.innerHeight - rect.bottom;
  const style = room > 320
    ? { left, top: rect.bottom + 6, maxHeight: Math.min(460, room - 16) }
    : { left, bottom: window.innerHeight - rect.top + 6, maxHeight: Math.min(460, rect.top - 16) };

  return createPortal(
    <div
      ref={box}
      role="dialog"
      aria-label="Adicionar componente"
      className="fixed z-[70] flex flex-col rounded-xl border border-gray-200 bg-white text-ink shadow-2xl"
      style={{ width, ...style, fontSize: 14 }}
    >
      <div className="border-b border-gray-100 p-3">
        <p className="mb-2 truncate text-xs font-bold uppercase tracking-wide text-gray-500">{title}</p>
        <input
          autoFocus
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && groups[0]) onPick(groups[0].blocks[0].type); }}
          placeholder="Buscar componente…"
          aria-label="Buscar componente"
          className="w-full rounded-lg bg-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {groups.length === 0 && <p className="py-4 text-center text-gray-400">Nenhum componente encontrado.</p>}
        {groups.map((group) => (
          <div key={group.id}>
            <h3 className="mb-1 px-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">{group.label}</h3>
            <div className="grid grid-cols-2 gap-1">
              {group.blocks.map((b) => (
                <button
                  key={b.type}
                  type="button"
                  onClick={() => onPick(b.type)}
                  title={b.description}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-gray-100"
                >
                  <span className="w-5 shrink-0 text-center text-base">{b.icon}</span>
                  <span className="truncate font-medium">{b.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
}
