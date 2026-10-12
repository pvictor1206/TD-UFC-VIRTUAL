import FormattedText from '@lesson/FormattedText';

// Glossário: termo à esquerda, definição à direita.
export default function Glossary({ items = [] }) {
  const list = items.filter((i) => i && (i.term || i.definition));
  if (list.length === 0) return null;
  return (
    <dl className="my-4 overflow-hidden rounded-[6px]">
      {list.map((item, i) => (
        <div
          key={i}
          className={`grid grid-cols-1 md:grid-cols-[minmax(8rem,1fr)_3fr] gap-1 md:gap-4 px-4 py-3 ${i % 2 === 0 ? 'bg-lav-soft' : 'bg-lav-mid'}`}
        >
          <dt className="font-bold text-ink">{item.term}</dt>
          <dd className="text-ink">
            <FormattedText text={item.definition} className="text-left leading-relaxed" />
          </dd>
        </div>
      ))}
    </dl>
  );
}
