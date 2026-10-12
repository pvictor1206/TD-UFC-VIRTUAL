import { useState } from 'react';
import { getSectionDefinition, SPACING_OPTIONS } from '@lesson';
import SchemaField from './SchemaField';
import HelpButton from './HelpButton';

// Seletor de espaçamento vertical (Padrão, Nenhum, Pequeno...).
function SpacingSelect({ label, value, onChange }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
      {label}
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm font-normal text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {SPACING_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
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
    <div className={`rounded-xl border bg-white shadow-sm overflow-hidden ${nested ? 'border-lav-bar' : 'border-lav-bar border-2'}`}>
      <div className={`flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 ${isSection ? 'bg-gray-100' : 'bg-gray-50'}`}>
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
          <HelpButton definition={definition} className="mr-1" />
          <button type="button" disabled={index === 0} onClick={() => onMove(-1)} title="Mover para cima" className="w-9 h-9 inline-flex items-center justify-center text-xl rounded-lg disabled:opacity-30 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">↑</button>
          <button type="button" disabled={index === total - 1} onClick={() => onMove(1)} title="Mover para baixo" className="w-9 h-9 inline-flex items-center justify-center text-xl rounded-lg disabled:opacity-30 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">↓</button>
          <button type="button" onClick={onDuplicate} title="Duplicar bloco" className="w-9 h-9 inline-flex items-center justify-center text-xl rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">⧉</button>
          <button type="button" onClick={onRemove} title="Excluir bloco" className="w-9 h-9 inline-flex items-center justify-center text-xl rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40">🗑</button>
        </div>
      </div>

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
          {nested && (
            <div className="border-t border-gray-100 pt-3 max-w-xs">
              <SpacingSelect
                label="↕ Espaço abaixo deste componente"
                value={section.spaceAfter}
                onChange={(v) => setFieldValue('spaceAfter', v)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
