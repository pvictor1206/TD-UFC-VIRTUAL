import { useEffect, useRef } from 'react';
import { markupToHtml, htmlToMarkup } from '@lesson/richText';

// Editor de texto estilo Google Docs (negrito, itálico, lista).
// O valor continua sendo o mesmo texto marcado usado pelo renderizador:
// **negrito**, *itálico* e linhas iniciadas por "•" — então aulas antigas,
// o "Baixar site" e o JSON do projeto seguem compatíveis.

function ToolbarButton({ label, title, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      // mouseDown + preventDefault mantém a seleção do texto ao clicar
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      aria-label={label}
      title={title}
      className={`w-8 h-8 inline-flex items-center justify-center rounded-md text-sm text-ink hover:bg-lav transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, rows = 4, placeholder }) {
  const ref = useRef(null);
  const lastValue = useRef(null);

  // Só reescreve o HTML quando o valor muda por fora (evita pular o cursor).
  useEffect(() => {
    if (ref.current && (value ?? '') !== lastValue.current) {
      ref.current.innerHTML = markupToHtml(value);
      lastValue.current = value ?? '';
    }
  }, [value]);

  const emit = () => {
    const markup = htmlToMarkup(ref.current);
    lastValue.current = markup;
    onChange(markup);
  };

  const exec = (cmd) => {
    ref.current?.focus();
    document.execCommand(cmd, false, null);
    emit();
  };

  return (
    <div className="rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 overflow-hidden">
      <div className="flex items-center gap-0.5 px-2 py-1 bg-lav-soft border-b border-lav">
        <ToolbarButton label="Desfazer" title="Desfazer (Ctrl+Z)" onClick={() => exec('undo')}>↶</ToolbarButton>
        <ToolbarButton label="Refazer" title="Refazer (Ctrl+Y)" onClick={() => exec('redo')}>↷</ToolbarButton>
        <span className="w-px h-5 bg-lav-bar mx-1" aria-hidden />
        <ToolbarButton label="Negrito" title="Negrito (Ctrl+B)" onClick={() => exec('bold')} className="font-extrabold">B</ToolbarButton>
        <ToolbarButton label="Itálico" title="Itálico (Ctrl+I)" onClick={() => exec('italic')} className="italic font-serif">I</ToolbarButton>
        <span className="w-px h-5 bg-lav-bar mx-1" aria-hidden />
        <ToolbarButton label="Lista com marcadores" title="Lista com marcadores" onClick={() => exec('insertUnorderedList')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <circle cx="2.5" cy="3.5" r="1.3" /><circle cx="2.5" cy="8" r="1.3" /><circle cx="2.5" cy="12.5" r="1.3" />
            <rect x="6" y="2.7" width="9" height="1.6" rx=".8" /><rect x="6" y="7.2" width="9" height="1.6" rx=".8" /><rect x="6" y="11.7" width="9" height="1.6" rx=".8" />
          </svg>
        </ToolbarButton>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder}
        onInput={emit}
        onBlur={emit}
        onPaste={(e) => {
          // cola sempre como texto simples (sem trazer formatação de outros sites)
          e.preventDefault();
          document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
        }}
        className="px-3 py-2 text-sm text-ink leading-relaxed outline-none overflow-y-auto resize-y [&_ul]:list-disc [&_ul]:pl-6 [&_div]:min-h-[1.4em]"
        style={{ minHeight: `${rows * 1.5 + 1}rem`, maxHeight: '28rem' }}
      />
    </div>
  );
}
