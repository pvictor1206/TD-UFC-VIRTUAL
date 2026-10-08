import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { renderSection } from '@lesson';
import { BLOCK_HELP } from './blockHelp';
import { BLOCK_EXAMPLES } from './blockExamples';
import SchemaField from './SchemaField';

const clone = (obj) => JSON.parse(JSON.stringify(obj));

function Badge({ n }) {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-700 text-white text-[11px] font-bold shrink-0">
      {n}
    </span>
  );
}

const FORMAT_EXAMPLES = [
  { code: '**negrito**', result: <strong>negrito</strong> },
  { code: '*itálico*', result: <em>itálico</em> },
  { code: '• item', result: <span>• item de lista</span> },
];

function HelpModal({ definition, onClose }) {
  const help = BLOCK_HELP[definition.type];
  const example = BLOCK_EXAMPLES[definition.type];
  const [sample, setSample] = useState(() => (example ? clone(example.sample) : null));
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const visibleFields = sample
    ? definition.fields.filter((f) => !(f.showIf && sample[f.showIf.field] !== f.showIf.equals))
    : [];
  const hasText = definition.fields.some((f) => f.help || f.type === 'textarea');

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/50"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        className="w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-4 bg-white border-b border-gray-100">
          <div className="min-w-0">
            <h2 id="help-title" className="font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">{definition.icon}</span>
              {definition.label}
            </h2>
            {help && <p className="text-sm text-gray-500 mt-0.5">{help.what}</p>}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar ajuda"
            className="flex items-center justify-center w-9 h-9 p-0 rounded-full bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-300 transition-colors shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-6">
          {help?.when && (
            <div className="flex gap-3 items-start rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-900">
              <span className="text-lg leading-none">💡</span>
              <p><strong>Quando usar:</strong> {help.when}</p>
            </div>
          )}

          {sample && (
            <div>
              <div className="flex flex-wrap items-baseline gap-x-3 mb-3">
                <h3 className="text-sm font-bold text-gray-800">Veja na prática</h3>
                <span className="text-xs text-gray-400">
                  Exemplo editável: mude os campos e veja o resultado. Nada disso é salvo na sua aula.
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                {/* 1 — formulário preenchido */}
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-500">
                    1 · Como preencher
                  </div>
                  <div className="p-4 space-y-4">
                    {visibleFields.map((field, i) => (
                      <div key={field.key} className="space-y-1">
                        <div className="flex items-start gap-2">
                          <Badge n={i + 1} />
                          <p className="text-xs text-blue-800 font-medium pt-0.5">{example.notes[field.key] || ''}</p>
                        </div>
                        <SchemaField
                          field={field}
                          value={sample[field.key]}
                          onChange={(v) => setSample((s) => ({ ...s, [field.key]: v }))}
                          siblingValues={sample}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2 — resultado */}
                <div className="rounded-xl border border-gray-200 overflow-hidden lg:sticky lg:top-24">
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-500">
                    2 · Como o aluno vê
                  </div>
                  <div className="bg-[#f8fafc] p-4 max-h-[60vh] overflow-auto text-base">
                    {renderSection(sample, 0)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {help && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-200 p-4">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Passo a passo</h3>
                <ol className="space-y-2">
                  {help.steps.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <Badge n={i + 1} />
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
              {help.tips?.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <h3 className="text-sm font-bold text-amber-900 mb-2">Dicas e cuidados</h3>
                  <ul className="space-y-2">
                    {help.tips.map((t, i) => (
                      <li key={i} className="flex gap-2 text-sm text-amber-900">
                        <span aria-hidden>⚠️</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {hasText && (
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Formatação do texto</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                {FORMAT_EXAMPLES.map(({ code, result }) => (
                  <div key={code} className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                    <code className="block text-xs text-gray-500 mb-1">{code}</code>
                    <span aria-hidden className="text-gray-400 text-xs">vira → </span>
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// Botão "?" que abre o popup de ajuda do bloco.
export default function HelpButton({ definition, className = '' }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        title={`Como usar: ${definition.label}`}
        aria-label={`Ajuda sobre o bloco ${definition.label}`}
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 text-xs font-bold text-gray-500 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 transition-colors shrink-0 ${className}`}
      >
        ?
      </button>
      {open && <HelpModal definition={definition} onClose={() => setOpen(false)} />}
    </>
  );
}
