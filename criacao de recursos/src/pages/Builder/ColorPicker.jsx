import { useEffect, useRef, useState } from 'react';
import { COLOR_PRESETS } from '@lesson';

// Botão "Cores" + painel para o professor escolher a cor base da aula.
// `value` é um hex (#rrggbb) ou '' para o tema padrão.
export default function ColorPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isPreset = COLOR_PRESETS.some((p) => p.value.toLowerCase() === (value || '').toLowerCase());

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        title="Cores da aula"
        className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${open ? 'bg-lav border-lav-bar text-ink' : 'border-gray-300 text-gray-600 hover:bg-lav-soft'}`}
      >
        <span
          className="w-4 h-4 rounded-full border border-black/20"
          style={{ background: value || 'linear-gradient(135deg,#1e40af 50%,#d9d3f5 50%)' }}
          aria-hidden
        />
        Cores
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-40 w-72 rounded-xl border border-gray-200 bg-white shadow-xl p-4 space-y-3">
          <p className="text-xs font-bold text-ink">Cor base da aula</p>
          <div className="grid grid-cols-3 gap-2">
            {COLOR_PRESETS.map((p) => {
              const selected = p.value.toLowerCase() === (value || '').toLowerCase();
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => onChange(p.value)}
                  title={p.name}
                  aria-pressed={selected}
                  className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-[10px] font-semibold leading-tight text-center transition-colors ${selected ? 'border-ink bg-lav-soft' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <span
                    className="w-7 h-7 rounded-full border border-black/10"
                    style={{ background: p.value || 'linear-gradient(135deg,#1e40af 50%,#d9d3f5 50%)' }}
                  />
                  {p.name.replace(/ \(.*\)/, '')}
                </button>
              );
            })}
          </div>
          <label className="flex items-center justify-between gap-3 text-xs font-semibold text-gray-700">
            Personalizada
            <input
              type="color"
              value={value || '#2563eb'}
              onChange={(e) => onChange(e.target.value)}
              className={`h-8 w-14 cursor-pointer rounded border ${!isPreset && value ? 'border-ink' : 'border-gray-300'}`}
            />
          </label>
          <p className="text-[11px] text-gray-500">
            Muda título, destaques, tabelas, caixas e botões da aula. Veja o resultado em "Pré-visualizar".
          </p>
        </div>
      )}
    </div>
  );
}
