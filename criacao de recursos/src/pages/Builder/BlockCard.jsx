import { useState } from 'react';
import { getSectionDefinition } from '@lesson';
import SchemaField from './SchemaField';
import HelpButton from './HelpButton';

export default function BlockCard({ section, index, total, onChange, onRemove, onMove, onDuplicate }) {
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

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-2 text-left flex-1 min-w-0"
        >
          <span className="text-lg">{definition.icon}</span>
          <span className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">
            {definition.label}
          </span>
          <span className="text-gray-400 text-xs">{collapsed ? 'mostrar' : 'ocultar'}</span>
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <HelpButton definition={definition} className="mr-1" />
          <button type="button" disabled={index === 0} onClick={() => onMove(-1)} title="Mover para cima" className="px-2 py-1 text-xs rounded disabled:opacity-30 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">↑</button>
          <button type="button" disabled={index === total - 1} onClick={() => onMove(1)} title="Mover para baixo" className="px-2 py-1 text-xs rounded disabled:opacity-30 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">↓</button>
          <button type="button" onClick={onDuplicate} title="Duplicar bloco" className="px-2 py-1 text-xs rounded text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">⧉</button>
          <button type="button" onClick={onRemove} title="Excluir bloco" className="px-2 py-1 text-xs rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40">🗑</button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-4 space-y-4">
          <p className="text-xs text-gray-400">{definition.description}</p>
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
