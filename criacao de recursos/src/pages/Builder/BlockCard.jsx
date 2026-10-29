import { useContext, useState } from 'react';
import { getSectionDefinition, spacingPx, SPACING_MAX_PX } from '@lesson';
import SchemaField from './SchemaField';
import HelpButton from './HelpButton';
import { BuilderContext } from './BuilderContext';

// Espaçamento vertical em pixels. Vazio = padrão do componente.
// `inline`: rótulo à esquerda do campo (usado no rodapé dos componentes).
function SpacingSelect({ label, value, onChange, inline = false }) {
  const px = spacingPx(value);
  const set = (n) => onChange(n === undefined ? '' : String(Math.max(0, Math.min(SPACING_MAX_PX, n))));
  const stepBtn = 'h-9 w-9 shrink-0 rounded-lg border border-gray-300 bg-white text-lg leading-none text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400';
  return (
    <div className={`text-xs font-semibold text-gray-600 ${inline ? 'flex items-center gap-2' : 'flex flex-col gap-1'}`}>
      <span className={inline ? 'whitespace-nowrap' : ''}>{label}</span>
      <div className="flex items-center gap-1.5 font-normal">
        <button type="button" aria-label={`Diminuir ${label}`} onClick={() => set(Math.max(0, (px ?? 0) - 4))} className={stepBtn}>−</button>
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
            className="h-9 w-32 rounded-lg border border-gray-300 bg-white pl-3 pr-8 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500">px</span>
        </div>
        <button type="button" aria-label={`Aumentar ${label}`} onClick={() => set((px ?? 0) + 4)} className={stepBtn}>+</button>
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
  );
}

export default function BlockCard({ section, index, total, onChange, onRemove, onMove, onDuplicate, nested = false, number }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showSpacing, setShowSpacing] = useState(false);
  const { canEditSpacing } = useContext(BuilderContext);
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
    <div
      className={`bg-white ${
        nested
          ? 'rounded-lg border border-gray-300 shadow-sm'
          : 'rounded-xl border-2 border-l-[10px] border-blue-700 shadow-md'
      }`}
    >
      <div className={isSection ? 'bg-lav rounded-tr-[9px]' : ''}>
      <div className={`flex items-center justify-between gap-3 px-4 py-3 ${nested ? 'rounded-t-[7px]' : 'rounded-tr-[9px]'} border-b ${isSection ? 'bg-lav border-lav-bar' : 'bg-white border-gray-200'}`}>
        {isSection ? (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              aria-expanded={!collapsed}
              title={collapsed ? 'Mostrar conteúdo do capítulo' : 'Recolher capítulo'}
              className="w-9 h-9 shrink-0 inline-flex items-center justify-center rounded-lg text-ink hover:bg-lav-bar"
            >
              {collapsed ? '▸' : '▾'}
            </button>
            <span className="shrink-0 rounded-md bg-blue-700 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white">
              Capítulo {index + 1}
            </span>
            <label className="flex flex-1 min-w-0 items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-3 shadow-sm transition-colors hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <span aria-hidden className="shrink-0 text-base">✏️</span>
              <input
                type="text"
                value={section.name ?? ''}
                onChange={(e) => setFieldValue('name', e.target.value)}
                placeholder={`Capítulo ${index + 1} — clique aqui e escreva um nome`}
                aria-label="Nome do capítulo (só você vê, não aparece para o aluno)"
                title="Nome do capítulo: só aparece no editor, não aparece para o aluno"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm font-bold text-gray-900 placeholder:font-medium placeholder:text-gray-500 focus:outline-none"
              />
            </label>
            <span className="hidden md:inline shrink-0 text-xs font-semibold text-ink/70">
              {(section.children || []).length} componente{(section.children || []).length === 1 ? '' : 's'}
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="flex items-center gap-2 text-left flex-1 min-w-0"
          >
            {number && <span className="shrink-0 rounded bg-gray-200 px-1.5 py-0.5 text-[11px] font-bold text-gray-600">{number}</span>}
            <span className="text-lg">{definition.icon}</span>
            <span className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">{definition.label}</span>
            <span className="text-gray-400 text-xs">{collapsed ? 'mostrar' : 'ocultar'}</span>
          </button>
        )}
        <div className="flex items-center gap-1.5 shrink-0">
          <HelpButton definition={definition} className="mr-1" />
          {canEditSpacing && (
            <button
              type="button"
              onClick={() => setShowSpacing((v) => !v)}
              aria-expanded={showSpacing}
              title="Espaçamento (só Suporte técnico e Administrador)"
              className={`w-9 h-9 inline-flex items-center justify-center text-lg rounded-lg ${showSpacing ? 'bg-blue-700 text-white' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >⚙</button>
          )}
          <button type="button" disabled={index === 0} onClick={() => onMove(-1)} title="Mover para cima" className="w-9 h-9 inline-flex items-center justify-center text-xl rounded-lg disabled:opacity-30 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">↑</button>
          <button type="button" disabled={index === total - 1} onClick={() => onMove(1)} title="Mover para baixo" className="w-9 h-9 inline-flex items-center justify-center text-xl rounded-lg disabled:opacity-30 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">↓</button>
          <button type="button" onClick={onDuplicate} title="Duplicar bloco" className="w-9 h-9 inline-flex items-center justify-center text-xl rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">⧉</button>
          <button type="button" onClick={onRemove} title="Excluir bloco" className="w-9 h-9 inline-flex items-center justify-center text-xl rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40">🗑</button>
        </div>
      </div>

      {!collapsed && isSection && (
        <div className="space-y-2 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-ink">Título do capítulo</span>
            <span className="text-xs text-ink/70">(opcional — deixe em branco para não mostrar título)</span>
          </div>
          {canEditSpacing && showSpacing && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl rounded-lg bg-white/60 p-3">
              <SpacingSelect label="↕ Espaço em cima do título" value={section.titleBefore} onChange={(v) => setFieldValue('titleBefore', v)} />
              <SpacingSelect label="↕ Espaço entre o título e os componentes" value={section.titleAfter} onChange={(v) => setFieldValue('titleAfter', v)} />
            </div>
          )}
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
      )}
      </div>

      {!collapsed && isSection && (
        <div className="p-4 space-y-4">
          <div className="rounded-xl border-2 border-lav-bar p-3 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-ink">Componentes</span>
            </div>
            {definition.fields.filter((f) => f.key === 'children').map((field) => (
              <SchemaField
                key={field.key}
                field={{ ...field, label: '' }}
                sectionNumber={index + 1}
                value={section[field.key]}
                onChange={(v) => setFieldValue(field.key, v)}
                siblingValues={section}
              />
            ))}
          </div>
        </div>
      )}

      {/* Espaçamento vertical: logo abaixo do nome do componente */}
      {!collapsed && nested && !isSection && canEditSpacing && showSpacing && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-lav bg-lav-soft/70 px-4 py-3">
          <span className="text-xs font-bold uppercase tracking-wide text-ink">↕ Espaçamento</span>
          <SpacingSelect inline label="Em cima" value={section.spaceBefore} onChange={(v) => setFieldValue('spaceBefore', v)} />
          <SpacingSelect inline label="Em baixo" value={section.spaceAfter} onChange={(v) => setFieldValue('spaceAfter', v)} />
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
