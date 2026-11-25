import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FormattedText } from '@lesson';
import MathView from '@lesson/MathView';
import { LANGUAGES, highlightLines, parseLineRanges } from '@lesson/highlight';
import LatexField from '../Builder/LatexField';
import { BuilderContext } from '../Builder/BuilderContext';
import { markupToHtml, htmlToMarkup } from './richText';

// Peças de edição "dentro do componente". Tudo que é campo editável leva `data-field`
// (é assim que o editor acha o primeiro campo para já deixar o cursor num componente novo).

export { default as InlineText } from './InlineText';

// ---------------------------------------------------------------------------
// Texto formatado (negrito, itálico, lista): parado, mostra o texto como o aluno vê;
// ao clicar vira editável no mesmo lugar, com uma barrinha de formatação.

const exec = (cmd) => document.execCommand(cmd, false, null);

function FormatButton({ label, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }} // mantém a seleção do texto
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-md text-sm text-ink hover:bg-lav ${className}`}
    >
      {children}
    </button>
  );
}

export function Rich({ value, onChange, className = '', style, placeholder = 'Escreva aqui…' }) {
  const [editing, setEditing] = useState(false);
  const ref = useRef(null);
  const text = value ?? '';

  // ao entrar em edição: carrega o texto e deixa o cursor no fim
  useLayoutEffect(() => {
    const el = ref.current;
    if (!editing || !el) return;
    el.innerHTML = markupToHtml(text);
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }, [editing]);

  const commit = () => { if (ref.current) onChange(htmlToMarkup(ref.current)); };

  if (!editing) {
    return (
      <div
        data-field=""
        tabIndex={0}
        role="textbox"
        aria-label={placeholder}
        onFocus={() => setEditing(true)}
        className="cursor-text rounded-sm outline-none transition-colors hover:bg-black/[0.03]"
      >
        {text ? (
          <FormattedText text={text} className={className} style={style} />
        ) : (
          <p className={`italic text-ink/35 ${className}`} style={style}>{placeholder}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute -top-10 left-0 z-40 flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-lg" onMouseDown={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
        <FormatButton label="Negrito (Ctrl+B)" onClick={() => { exec('bold'); commit(); }} className="font-extrabold">B</FormatButton>
        <FormatButton label="Itálico (Ctrl+I)" onClick={() => { exec('italic'); commit(); }} className="font-serif italic">I</FormatButton>
        <FormatButton label="Lista com marcadores" onClick={() => { exec('insertUnorderedList'); commit(); }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <circle cx="2.5" cy="3.5" r="1.3" /><circle cx="2.5" cy="8" r="1.3" /><circle cx="2.5" cy="12.5" r="1.3" />
            <rect x="6" y="2.7" width="9" height="1.6" rx=".8" /><rect x="6" y="7.2" width="9" height="1.6" rx=".8" /><rect x="6" y="11.7" width="9" height="1.6" rx=".8" />
          </svg>
        </FormatButton>
      </div>
      <div
        ref={ref}
        data-field=""
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder}
        onInput={commit}
        onBlur={() => { commit(); setEditing(false); }}
        onKeyDown={(e) => { if (e.key === 'Escape') e.currentTarget.blur(); }}
        onPaste={(e) => {
          // cola sempre como texto simples (sem trazer formatação de outros sites)
          e.preventDefault();
          document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
        }}
        className={`${className} rounded-sm bg-black/[0.04] outline-none [&_div]:min-h-[1.4em] [&_ul]:list-disc [&_ul]:pl-6`}
        style={style}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Texto simples de várias linhas (cresce conforme se digita).

function useAutoGrow(ref, value) {
  const fit = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };
  useLayoutEffect(fit, [value]);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    let width = el.clientWidth;
    const ro = new ResizeObserver(() => { if (el.clientWidth !== width) { width = el.clientWidth; fit(); } });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
}

// Tab insere espaços (em vez de pular de campo) nos campos de código.
const tabToSpaces = (value, onChange) => (e) => {
  if (e.key !== 'Tab' || e.shiftKey) return;
  e.preventDefault();
  const el = e.currentTarget;
  const v = value ?? '';
  const pos = el.selectionStart + 2;
  onChange(v.slice(0, el.selectionStart) + '  ' + v.slice(el.selectionEnd));
  requestAnimationFrame(() => el.setSelectionRange(pos, pos));
};

export function Area({ value, onChange, placeholder, label, className = '', style, mono = false, dark = false, onBlur, autoFocus = false }) {
  const ref = useRef(null);
  useAutoGrow(ref, value);
  useEffect(() => { if (autoFocus) ref.current?.focus(); }, [autoFocus]);
  return (
    <textarea
      ref={ref}
      data-field=""
      rows={1}
      value={value ?? ''}
      spellCheck={!mono}
      aria-label={label || placeholder}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={mono ? tabToSpaces(value, onChange) : undefined}
      onBlur={onBlur}
      className={`block w-full resize-none overflow-hidden rounded-sm bg-transparent outline-none transition-colors placeholder:italic ${dark ? 'placeholder:text-[#8f8ab5] hover:bg-white/5 focus:bg-white/10' : 'placeholder:text-ink/35 hover:bg-black/[0.03] focus:bg-black/[0.05]'} ${className}`}
      style={style}
    />
  );
}

// ---------------------------------------------------------------------------
// Botões de lista (adicionar / remover / mover item), sempre no próprio componente.

export function RemoveX({ onClick, title = 'Remover', inside = false }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={title}
      aria-label={title}
      className={`absolute z-20 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-red-600 opacity-0 shadow ring-1 ring-black/15 transition-opacity hover:bg-red-50 focus:opacity-100 group-focus-within/item:opacity-100 group-hover/item:opacity-100 ${inside ? 'right-1 top-1' : '-right-2 -top-2'}`}
    >
      ✕
    </button>
  );
}

export function AddButton({ onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`w-full rounded-lg border-2 border-dashed border-lav-bar py-2 text-sm font-bold text-ink/70 transition-colors hover:bg-lav-soft hover:text-ink ${className}`}
    >
      + {children}
    </button>
  );
}

// Setinhas ‹ › para mudar o item de lugar.
export function MoveButtons({ index, total, onMove, vertical = false }) {
  const btn = 'flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-ink shadow ring-1 ring-black/15 hover:bg-lav disabled:opacity-30 disabled:hover:bg-white';
  return (
    <span className="absolute -left-2 -top-2 z-20 flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-focus-within/item:opacity-100 group-hover/item:opacity-100">
      <button type="button" disabled={index === 0} onClick={(e) => { e.stopPropagation(); onMove(index, -1); }} title="Mover para trás" aria-label="Mover para trás" className={btn}>{vertical ? '↑' : '‹'}</button>
      <button type="button" disabled={index === total - 1} onClick={(e) => { e.stopPropagation(); onMove(index, 1); }} title="Mover para frente" aria-label="Mover para frente" className={btn}>{vertical ? '↓' : '›'}</button>
    </span>
  );
}

// Linha pequena para um endereço (link do botão etc.), dentro do componente.
export function LinkRow({ value, onChange, label = 'Link', placeholder = 'https://…', className = '' }) {
  return (
    <label className={`flex items-center gap-2 text-xs text-ink/60 ${className}`}>
      <span aria-hidden>🔗</span>
      <span className="shrink-0 font-semibold">{label}:</span>
      <input
        type="text"
        data-field=""
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="min-w-0 flex-1 rounded border border-transparent bg-transparent px-1.5 py-0.5 text-ink outline-none hover:border-gray-300 focus:border-blue-400 focus:bg-white"
      />
    </label>
  );
}

// ---------------------------------------------------------------------------
// Imagem: mostra a imagem; sem ela, oferece enviar arquivo ou colar o endereço (dentro do componente).

export function ImageSlot({ value, onChange, alt, className = '', compact = false }) {
  const { uploadImage } = useContext(BuilderContext);
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [urlOpen, setUrlOpen] = useState(false);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !uploadImage) return;
    setBusy(true);
    setError('');
    try {
      onChange(await uploadImage(file));
      setUrlOpen(false);
    } catch (err) {
      setError(err?.message || 'Não foi possível enviar a imagem.');
    } finally {
      setBusy(false);
    }
  };

  const btn = 'rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-ink shadow ring-1 ring-black/15 hover:bg-lav-soft disabled:opacity-60';
  const urlInput = (
    <input
      type="text"
      data-field=""
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={uploadImage ? 'ou cole o endereço da imagem (https://…)' : 'https://… ou imagens/foto1.png'}
      aria-label="Endereço da imagem"
      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-400"
    />
  );

  return (
    <div className={`group/img relative ${className}`}>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={pick} className="hidden" aria-label="Escolher imagem do computador" />
      {value ? (
        <>
          <img src={value} alt={alt || ''} className="mx-auto block h-auto max-w-full rounded-[6px] object-contain" />
          <div className="absolute right-2 top-2 z-10 flex flex-wrap justify-end gap-1.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover/img:opacity-100">
            {uploadImage && <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className={btn}>{busy ? 'Enviando…' : '⬆ Trocar'}</button>}
            <button type="button" onClick={() => setUrlOpen((v) => !v)} className={btn}>🔗 Endereço</button>
            <button type="button" onClick={() => onChange('')} className={`${btn} text-red-600`}>✕ Remover</button>
          </div>
          {urlOpen && <div className="absolute inset-x-2 top-12 z-10">{urlInput}</div>}
        </>
      ) : (
        <div className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-lav-bar bg-lav-soft/60 text-center text-ink/70 ${compact ? 'min-h-32 p-3' : 'min-h-44 p-6'}`}>
          <p className="text-sm font-semibold">🖼️ Nenhuma imagem ainda</p>
          {uploadImage && <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className={btn}>{busy ? 'Enviando…' : '⬆ Enviar imagem'}</button>}
          <div className="w-full max-w-md">{urlInput}</div>
        </div>
      )}
      {error && <p role="alert" className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fórmula: parada, mostra a fórmula pronta; ao clicar abre o campo com os botões de símbolos.

export function LatexSlot({ value, onChange, placeholder = 'Clique para escrever a fórmula', display = true }) {
  const [editing, setEditing] = useState(false);
  const box = useRef(null);
  useEffect(() => { if (editing) box.current?.querySelector('textarea')?.focus(); }, [editing]);

  if (!editing) {
    return (
      <div
        data-field=""
        tabIndex={0}
        role="textbox"
        aria-label={placeholder}
        onFocus={() => setEditing(true)}
        className="cursor-text rounded-md outline-none transition-colors hover:bg-black/[0.03]"
      >
        {value ? <MathView latex={value} display={display} /> : <p className="py-2 text-center italic text-ink/35">{placeholder}</p>}
      </div>
    );
  }
  return (
    <div
      ref={box}
      tabIndex={-1}
      onBlur={(e) => { if (!box.current?.contains(e.relatedTarget)) setEditing(false); }}
      className="text-left text-[1rem] outline-none"
    >
      <LatexField value={value} onChange={onChange} rows={2} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Código: parado mostra o código colorido (como o aluno vê); ao clicar vira caixa de texto.

export function LangSelect({ value, onChange, className = '' }) {
  return (
    <select
      value={value || 'python'}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Linguagem"
      className={`cursor-pointer rounded-full bg-[#c9a8ff] px-2.5 py-0.5 text-[0.68em] font-bold uppercase tracking-wide text-[#1b1b3a] outline-none ${className}`}
    >
      {LANGUAGES.map((l) => <option key={l.value} value={l.value} className="bg-white text-[#1b1b3a]">{l.label}</option>)}
    </select>
  );
}

export function CodeSlot({ code, language, lineNumbers = 'sim', highlight, onChange, placeholder = 'Clique para escrever o código' }) {
  const [editing, setEditing] = useState(false);
  const ref = useRef(null);
  const lines = useMemo(() => highlightLines(code, language), [code, language]);
  const marked = useMemo(() => parseLineRanges(highlight), [highlight]);
  useAutoGrow(ref, code);
  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  if (!editing) {
    return (
      <pre
        data-field=""
        tabIndex={0}
        role="textbox"
        aria-label={placeholder}
        onFocus={() => setEditing(true)}
        className="code-surface m-0 cursor-text overflow-x-auto py-3 text-[0.85em] leading-[1.6] outline-none"
      >
        <code>
          {code ? lines.map((html, i) => {
            const n = i + 1;
            const on = marked.has(n);
            return (
              <div key={i} className="flex pr-4" style={on ? { background: 'rgba(201,168,255,.18)', boxShadow: 'inset 3px 0 0 #c9a8ff' } : undefined}>
                {lineNumbers === 'sim' ? <span className="w-10 shrink-0 select-none pr-3 text-right text-[#8f8ab5]" aria-hidden>{n}</span> : <span className="w-4 shrink-0" aria-hidden />}
                <span className="whitespace-pre" dangerouslySetInnerHTML={{ __html: html || ' ' }} />
              </div>
            );
          }) : <div className="px-4 italic text-[#8f8ab5]">{placeholder}</div>}
        </code>
      </pre>
    );
  }
  return (
    <div className="code-surface py-3">
      <textarea
        ref={ref}
        data-field=""
        rows={3}
        spellCheck={false}
        value={code ?? ''}
        aria-label="Código"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={tabToSpaces(code, onChange)}
        onBlur={() => setEditing(false)}
        className="block w-full resize-none overflow-hidden bg-transparent px-4 text-[0.85em] leading-[1.6] outline-none"
        style={{ color: 'inherit', fontFamily: 'inherit', tabSize: 2 }}
      />
    </div>
  );
}

// "Saída esperada" (abaixo do código)
export function OutputArea({ value, onChange }) {
  return (
    <div className="border-t border-[#2d2a52] bg-[#12122b] px-4 py-3 font-mono text-[0.82em] text-[#ece8fb]">
      <div className="mb-1 text-[0.8em] font-bold uppercase tracking-wide text-[#8ec5ff]">Saída esperada</div>
      <Area mono dark value={value} onChange={onChange} placeholder="Saída esperada (opcional)" className="whitespace-pre-wrap" />
    </div>
  );
}
