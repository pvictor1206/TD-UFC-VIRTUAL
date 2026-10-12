import { useState } from 'react';
import { languageLabel } from '@lesson/highlight';
import CodeBlock from './CodeBlock';

// O mesmo problema resolvido em várias linguagens: o aluno escolhe a aba.
export default function CodeTabs({ items = [], caption, lineNumbers = 'sim' }) {
  const list = items.filter((i) => i && i.code);
  const [active, setActive] = useState(0);
  if (list.length === 0) return null;
  const current = list[Math.min(active, list.length - 1)];

  return (
    <div className="my-4">
      <div className="flex flex-wrap items-end gap-1" role="tablist" aria-label="Linguagens">
        {list.map((item, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-t-lg px-4 py-2 text-[0.85em] font-bold transition-colors ${
              i === active ? 'bg-[#1b1b3a] text-white' : 'bg-lav text-ink hover:bg-lav-mid'
            }`}
          >
            {item.label || languageLabel(item.language)}
          </button>
        ))}
      </div>
      <CodeBlock
        key={active}
        embedded
        code={current.code}
        language={current.language}
        filename={current.filename}
        lineNumbers={lineNumbers}
        output={current.output}
        runnable={current.runnable}
        caption={caption}
      />
    </div>
  );
}
