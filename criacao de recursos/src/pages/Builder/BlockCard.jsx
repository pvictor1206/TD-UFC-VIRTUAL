import { useState } from 'react';
import { getSectionDefinition, spacingPx, SPACING_MAX_PX } from '@lesson';
import SchemaField from './SchemaField';
import HelpButton from './HelpButton';

// Espaçamento vertical em pixels. Vazio = padrão do componente.
function SpacingSelect({ label, value, onChange }) {
  const px = spacingPx(value);
  const set = (n) => onChange(n === undefined ? '' : String(Math.max(0, Math.min(SPACING_MAX_PX, n))));
  return (
    <div className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
      <div>
        {label}
        <div className="mt-1 flex items-center gap-1.5 font-normal">
          <button
            type="button"
            aria-label={`Diminuir ${label}`}
            onClick={() => set(Math.max(0, (px ?? 0) - 4))}
            className="h-9 w-9 shrink-0 rounded-lg border border-gray-300 bg-white text-lg text-gray-600 hover:bg-gray-50"
          >
            −
          </button>
          <div className="relative">
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
              className="h-9 w-24 rounded-lg border border-gray-300 bg-white pl-2 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">px</span>
          </div>
          <button
            type="button"
            aria-label={`Aumentar ${label}`}
            onClick={() => set((px ?? 0) + 4)}
            className="h-9 w-9 shrink-0 rounded-lg border border-gray-300 bg-white text-lg text-gray-600 hover:bg-gray-50"
          >
            +
          </button>
          {px !== undefined && (
            <button
              type="button"
              onClick={() => set(undefined)}
              title="Voltar ao espaçamento padrão"
              className="h-9 shrink-0 rounded-lg px-2 text-xs font-semibold text-gray-500 hover:bg-gray-100"
            >
              Padrão
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Etiqueta que deixa claro o que o aluno enxerga e o que é só do editor.
function Zone({ visible, children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
        visible ? 'bg-lav text-ink' : 'bg-gray-200 text-gray-600'
      }`}
    >
      <span aria-hidden>{visible ? '👁' : '🚫'}</span>
      {children}
    </span>
  );
}

export default function BlockCard({ section, index, total, onChange, onRemove, onMove, onDuplicate, nested = false, isActive = false }) {
  const [collapsed, setCollapsed] = useState(false);
  const [spacingOpen, setSpacingOpen] = useState(false);
  const definition = getSectionDefinition(section.type);

  if (!definition) {
    return (
      <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
        Tipo de bloco desconhecido: "{section.type}"
      </div>
    );
  }

  const setFieldValue = (key, value) => {
    onChange({ ...section, [key]: value });
  };

  const isSection = section.type === 'section';

  return (
    <div className={`rounded-xl border bg-white shadow-sm ${nested ? 'border-lav-bar' : 'border-lav-bar border-2'}`}>
      <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-t-[10px] border-b border-gray-100 ${isSection ? 'bg-gray-100' : 'bg-gray-50'}`}>
        {isSection ? (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              aria-expanded={!collapsed}
              title={collapsed ? 'Mostrar conteúdo da seção' : 'Recolher seção'}
              className="w-9 h-9 shrink-0 inline-flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200"
            >
              {collapsed ? '▸' : '▾'}
            </button>
            <input
              type="text"
              value={section.name ?? ''}
              onChange={(e) => setFieldValue('name', e.target.value)}
              placeholder={`Seção ${index + 1} — nome interno (opcional)`}
              aria-label="Nome da seção (não aparece para o aluno)"
              title="Nome da seção: só aparece no editor, não aparece para o aluno"
              className="flex-1 min-w-0 rounded-lg border border-transparent hover:border-gray-300 focus:border-blue-400 bg-transparent px-2 py-1.5 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 truncate"
            />
            <span className="hidden md:inline-flex shrink-0"><Zone>Só no editor</Zone></span>
            {isActive && (
              <span className="hidden sm:inline shrink-0 rounded-full bg-lav text-ink text-[10px] font-bold uppercase tracking-wide px-2 py-1">
                Recebendo componentes
              </span>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="flex items-center gap-2 text-left flex-1 min-w-0"
          >
            <span className="text-lg">{definition.icon}</span>
            <span className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">{definition.label}</span>
            <span className="text-gray-400 text-xs">{collapsed ? 'mostrar' : 'ocultar'}</span>
          </button>
        )}
        <div className="flex items-center gap-1.5 shrink-0">
          {nested && !isSection && (
            <button
              type="button"
              onClick={() => setSpacingOpen((o) => !o)}
              aria-expanded={spacingOpen}
              aria-label="Espaçamento vertical deste componente"
              title="Espaçamento vertical (em cima e em baixo)"
              className={`w-9 h-9 inline-flex items-center justify-center text-xl rounded-lg transition-colors ${
                section.spaceBefore || section.spaceAfter ? 'bg-lav text-ink' : 'text-gray-500 hover:bg-gray-200'
              } ${spacingOpen ? 'ring-2 ring-blue-400' : ''}`}
            >
              ↕
            </button>
          )}
          <HelpButton definition={definition} className="mr-1" />
          <button type="button" disabled={index === 0} onClick={() => onMove(-1)} title="Mover para cima" className="w-9 h-9 inline-flex items-center justify-center text-xl rounded-lg disabled:opacity-30 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">↑</button>
          <button type="button" disabled={index === total - 1} onClick={() => onMove(1)} title="Mover para baixo" className="w-9 h-9 inline-flex items-center justify-center text-xl rounded-lg disabled:opacity-30 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">↓</button>
          <button type="button" onClick={onDuplicate} title="Duplicar bloco" className="w-9 h-9 inline-flex items-center justify-center text-xl rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">⧉</button>
          <button type="button" onClick={onRemove} title="Excluir bloco" className="w-9 h-9 inline-flex items-center justify-center text-xl rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40">🗑</button>
        </div>
      </div>

      {spacingOpen && nested && !isSection && (
        <div className="flex flex-wrap items-end gap-4 border-b border-lav bg-lav-soft px-4 py-3">
          <span className="text-xs font-bold text-ink self-center">↕ Espaçamento vertical</span>
          <div>
            <SpacingSelect label="Espaço em cima" value={section.spaceBefore} onChange={(v) => setFieldValue('spaceBefore', v)} />
          </div>
          <div>
            <SpacingSelect label="Espaço em baixo" value={section.spaceAfter} onChange={(v) => setFieldValue('spaceAfter', v)} />
          </div>
          <span className="text-[11px] text-gray-500 self-center">Em branco ("Padrão") mantém o espaçamento original, em pixels (px).</span>
        </div>
      )}

      {!collapsed && isSection && (
        <div className="p-4 space-y-4">
          <div className="rounded-xl border-2 border-lav-bar bg-lav-soft/50 p-3 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Zone visible>Aparece para o aluno</Zone>
              <span className="text-sm font-bold text-ink">Título da seção</span>
              <span className="text-xs text-gray-500">(opcional — deixe em branco para não mostrar título)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_2fr] gap-3">
              {definition.fields.filter((f) => f.key !== 'children').map((field) => (
                <SchemaField
                  key={field.key}
                  field={field}
                  value={section[field.key]}
                  onChange={(v) => setFieldValue(field.key, v)}
                  siblingValues={section}
                />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl border-t border-lav pt-3">
              <SpacingSelect label="↕ Espaço em cima do título" value={section.titleBefore} onChange={(v) => setFieldValue('titleBefore', v)} />
              <SpacingSelect label="↕ Espaço entre o título e os componentes" value={section.titleAfter} onChange={(v) => setFieldValue('titleAfter', v)} />
            </div>
          </div>

          <div className="rounded-xl border-2 border-lav-bar p-3 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Zone visible>Aparece para o aluno</Zone>
              <span className="text-sm font-bold text-ink">Componentes</span>
            </div>
            {definition.fields.filter((f) => f.key === 'children').map((field) => (
              <SchemaField
                key={field.key}
                field={{ ...field, label: '' }}
                value={section[field.key]}
                onChange={(v) => setFieldValue(field.key, v)}
                siblingValues={section}
              />
            ))}
          </div>

          <div className="rounded-xl border border-gray-200 p-3">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-sm font-bold text-ink">↕ Espaçamento vertical</span>
              <span className="text-xs text-gray-500">(só altura; "Padrão" mantém o espaçamento original)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              <SpacingSelect label="Entre os componentes desta seção" value={section.gap} onChange={(v) => setFieldValue('gap', v)} />
              <SpacingSelect label="Depois desta seção" value={section.spaceAfter} onChange={(v) => setFieldValue('spaceAfter', v)} />
            </div>
          </div>
        </div>
      )}

      {!collapsed && !isSection && (
        <div className="p-4 space-y-4">
          <p className="text-xs text-gray-500">{definition.description}</p>
          {definition.fields.map((field) => (
            <SchemaField
              key={field.key}
              field={field}
              value={section[field.key]}
              onChange={(v) => setFieldValue(field.key, v)}
              siblingValues={section}
            />
          ))}
        </div>
      )}
    </div>
  );
}
