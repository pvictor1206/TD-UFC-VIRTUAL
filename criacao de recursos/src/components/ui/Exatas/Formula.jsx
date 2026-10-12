import MathView from '@lesson/MathView';
import FormattedText from '@lesson/FormattedText';

// Fórmula/equação em destaque, com número (opcional), legenda e "onde:"
// explicando as variáveis.
export default function Formula({ latex, number, caption, where }) {
  if (!latex) return null;
  return (
    <figure className="my-4 rounded-[6px] bg-lav-soft border-l-[6px] border-lav-bar p-4 md:p-5">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1 text-ink" style={{ fontSize: '1.2em' }}>
          <MathView latex={latex} display />
        </div>
        {number && <span className="shrink-0 text-ink/70 font-semibold">({number})</span>}
      </div>
      {where && (
        <div className="mt-3 pt-3 border-t border-lav text-ink" style={{ fontSize: '0.92em' }}>
          <FormattedText text={where} className="text-left leading-relaxed" />
        </div>
      )}
      {caption && (
        <figcaption className="mt-2 text-center italic text-ink/70" style={{ fontSize: '0.9em' }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
