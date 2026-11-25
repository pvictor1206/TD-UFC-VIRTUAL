import { spacingPx, SPACING_MAX_PX } from '@lesson';

// Espaçamento vertical em pixels (vazio = padrão do componente). Mesmo controle da Versão 1.
export default function SpacingField({ label, value, onChange }) {
  const px = spacingPx(value);
  const set = (n) => onChange(n === undefined ? '' : String(Math.max(0, Math.min(SPACING_MAX_PX, n))));
  const stepBtn = 'h-9 w-9 shrink-0 rounded-lg border border-gray-300 bg-white text-lg leading-none text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400';
  return (
    <div className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
      <span>{label}</span>
      <div className="flex items-center gap-1.5 font-normal">
        <button type="button" aria-label={`Diminuir ${label}`} onClick={() => set(Math.max(0, (px ?? 0) - 4))} className={stepBtn}>−</button>
        <div className="relative min-w-0 flex-1">
          <input
            type="number"
            min="0"
            max={SPACING_MAX_PX}
            step="4"
            inputMode="numeric"
            aria-label={label}
            value={px ?? ''}
            placeholder="Padrão"
            onChange={(e) => set(e.target.value === '' ? undefined : Number(e.target.value))}
            className="h-9 w-full rounded-lg border border-gray-300 bg-white pl-3 pr-8 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500">px</span>
        </div>
        <button type="button" aria-label={`Aumentar ${label}`} onClick={() => set((px ?? 0) + 4)} className={stepBtn}>+</button>
        {px !== undefined && (
          <button type="button" onClick={() => set(undefined)} title="Voltar ao espaçamento padrão" className="h-9 shrink-0 rounded-lg px-2 text-xs font-semibold text-gray-500 hover:bg-gray-100">
            Padrão
          </button>
        )}
      </div>
    </div>
  );
}
