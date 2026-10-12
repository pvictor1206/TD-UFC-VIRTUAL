import { useState } from 'react';
import { getSectionDefinition } from '@lesson';
import SchemaField from './SchemaField';
import HelpButton from './HelpButton';

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
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
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
              placeholder={`Seção ${index + 1} — dê um nome (só para você)`}
              aria-label="Nome da seção (não aparece para o aluno)"
              title="Nome da seção: só aparece no editor, não aparece para o aluno"
              className="flex-1 min-w-0 rounded-lg border border-transparent hover:border-gray-300 focus:border-blue-400 bg-transparent px-2 py-1.5 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 truncate"
            />
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

      {!collapsed && (
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
