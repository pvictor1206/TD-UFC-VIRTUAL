import ColorPicker from '../Builder/ColorPicker';

const ghost = 'rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50';

function PanelToggle({ on, onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      title={label}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${on ? 'border-lav-bar bg-lav text-ink' : 'border-gray-300 text-gray-500 hover:bg-gray-50'}`}
    >
      {children}
    </button>
  );
}

// Barra de cima: voltar, salvamento automático e ações de arquivo.
// Painel da esquerda e botões de edição só existem na edição; na leitura e na visão do aluno a barra é mais enxuta.
// `student` = { on, toggle }: botão que mostra a aula como o aluno vê (e volta a editar).
export default function TopBar({ headerExtra, readOnly, hideFileActions, hideExample, saveState, flushSave, files, cor, onCor, panels, student }) {
  const editing = !readOnly && !student?.on;
  return (
    <header className="z-30 flex shrink-0 flex-wrap items-center gap-3 border-b border-gray-200 bg-white px-4 py-2.5">
      {headerExtra}
      <div className="min-w-[200px] flex-1">
        <h1 className="flex items-center gap-2 text-lg font-bold leading-tight text-ink">
          Editor Estrutural
          <span className="rounded-full bg-lav px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-ink">Versão 2</span>
        </h1>
        <p className="text-xs text-gray-400">
          {readOnly
            ? 'Somente leitura — é assim que a aula aparece para o aluno.'
            : student?.on
              ? 'Visão do aluno — é assim que a aula aparece para ele.'
              : 'Edite direto nos componentes da página — sem alternar entre editar e visualizar.'}
        </p>
      </div>

      {!readOnly && (
        <span
          role="status"
          aria-live="polite"
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
            saveState === 'saved' ? 'bg-green-50 text-green-700' : saveState === 'saving' ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-700'
          }`}
        >
          {saveState === 'saved' && '✓ Salvo automaticamente'}
          {saveState === 'saving' && 'Salvando…'}
          {saveState === 'error' && (
            <>
              ⚠ Não foi possível salvar
              <button type="button" onClick={flushSave} className="underline">Tentar agora</button>
            </>
          )}
        </span>
      )}

      {student && (
        <button
          type="button"
          onClick={student.toggle}
          aria-pressed={student.on}
          title={student.on ? 'Voltar para a edição' : 'Ver a aula como o aluno vê'}
          className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors ${student.on ? 'bg-blue-700 text-white hover:bg-blue-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
        >
          {student.on ? '✏️ Voltar a editar' : '👁 Visão do aluno'}
        </button>
      )}

      {panels && editing && (
        <div className="flex items-center gap-1.5">
          <PanelToggle on={panels.left} onClick={panels.toggleLeft} label={panels.left ? 'Esconder lista de componentes' : 'Mostrar lista de componentes'}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><rect x="1.75" y="2.75" width="12.5" height="10.5" rx="2" /><path d="M6 2.75v10.5" /></svg>
          </PanelToggle>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {editing && <ColorPicker value={cor || ''} onChange={onCor} />}
        {editing && !hideExample && <button type="button" onClick={files.onSample} className={ghost}>Exemplo</button>}
        {editing && !hideFileActions && <button type="button" onClick={files.onImportClick} className={ghost}>Abrir projeto</button>}
        <input ref={files.fileInputRef} type="file" accept="application/json" className="hidden" onChange={files.onImportFile} />
        {!hideFileActions && (
          <button type="button" onClick={files.onSave} title="Baixa um arquivo para continuar editando depois" className={ghost}>Salvar projeto</button>
        )}
        {!hideFileActions && (
          <button type="button" onClick={files.onDownload} disabled={files.downloading} className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800 disabled:opacity-60">
            {files.downloading ? 'Gerando site…' : '⬇ Baixar site'}
          </button>
        )}
        {editing && <button type="button" onClick={files.onNew} className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">Limpar</button>}
      </div>
    </header>
  );
}
