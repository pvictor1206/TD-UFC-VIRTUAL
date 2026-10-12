import FormattedText from '@lesson/FormattedText';

const CALLOUT_KINDS = {
  definicao: { label: 'Definição', icon: '📘' },
  teorema: { label: 'Teorema', icon: '📐' },
  demonstracao: { label: 'Demonstração', icon: '✍️' },
  exemplo: { label: 'Exemplo', icon: '🧪' },
  observacao: { label: 'Observação', icon: '📝' },
  dica: { label: 'Dica', icon: '💡' },
  atencao: { label: 'Atenção', icon: '⚠️', warm: true },
};

// Caixa de destaque para definições, teoremas, exemplos, avisos...
export default function Callout({ kind = 'definicao', title, text }) {
  const info = CALLOUT_KINDS[kind] || CALLOUT_KINDS.definicao;
  const warm = info.warm;
  return (
    <aside
      className={`my-4 rounded-[6px] border-l-[6px] p-4 md:p-5 ${warm ? 'bg-[#fff6e5] border-[#f5b942]' : 'bg-lav-soft border-lav-bar'}`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.68em] font-bold uppercase tracking-wide text-ink ${warm ? 'bg-[#fde7b8]' : 'bg-lav'}`}
        >
          <span aria-hidden>{info.icon}</span>
          {info.label}
        </span>
        {title && <span className="font-bold text-ink">{title}</span>}
      </div>
      <FormattedText text={text} className="text-ink text-justify leading-relaxed" />
    </aside>
  );
}
