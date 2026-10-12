import MathView from '@lesson/MathView';
import FormattedText from '@lesson/FormattedText';

// Formulário: grade de cartões, cada um com nome, fórmula e uma observação.
export default function FormulaSheet({ items = [], columns = '2' }) {
  const list = items.filter((i) => i && (i.latex || i.name));
  if (list.length === 0) return null;
  const grid = columns === '1' ? 'grid-cols-1' : columns === '3' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2';
  return (
    <div className={`my-4 grid ${grid} gap-3`}>
      {list.map((item, i) => (
        <div key={i} className="rounded-[6px] bg-lav-soft p-4 flex flex-col">
          {item.name && (
            <span className="self-start rounded-full bg-lav px-2.5 py-1 text-[0.68em] font-bold uppercase tracking-wide text-ink">
              {item.name}
            </span>
          )}
          <div className="flex-1 flex items-center justify-center py-2 text-ink" style={{ fontSize: '1.1em' }}>
            <div className="w-full">
              <MathView latex={item.latex} display />
            </div>
          </div>
          {item.note && (
            <FormattedText text={item.note} className="text-ink/80 text-left leading-snug" style={{ fontSize: '0.85em' }} />
          )}
        </div>
      ))}
    </div>
  );
}
