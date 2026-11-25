import { useLayoutEffect, useRef } from 'react';

// Texto de uma linha editado direto na página (contentEditable), com a mesma aparência do
// texto final. Fica sem placeholder quando preenchido; vazio mostra `placeholder` (só no editor).
// Enter confirma (sai do campo); colar entra como texto simples.
export default function InlineText({ as: Tag = 'span', value, onChange, placeholder, className = '', style, onFocus, label }) {
  const ref = useRef(null);
  const last = useRef(null);

  // Só reescreve o texto quando o valor muda por fora (evita pular o cursor ao digitar).
  useLayoutEffect(() => {
    const el = ref.current;
    const v = value ?? '';
    if (el && v !== last.current) {
      el.textContent = v;
      last.current = v;
    }
  }, [value]);

  const emit = () => {
    const el = ref.current;
    const v = el.textContent.replace(/ /g, ' ');
    if (!v) el.innerHTML = ''; // o navegador deixa um <br>; sem isso o placeholder não volta
    last.current = v;
    onChange(v);
  };

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-label={label || placeholder}
      data-placeholder={placeholder}
      onInput={emit}
      onFocus={onFocus}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
        if (e.key === 'Escape') e.currentTarget.blur();
      }}
      onPaste={(e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain').replace(/\s*\n+\s*/g, ' ');
        document.execCommand('insertText', false, text);
      }}
      className={`cursor-text rounded-sm outline-none transition-colors hover:bg-black/[0.04] focus:bg-black/[0.05] empty:before:italic empty:before:font-normal empty:before:normal-case empty:before:tracking-normal empty:before:text-ink/35 empty:before:content-[attr(data-placeholder)] ${className}`}
      style={style}
    />
  );
}
