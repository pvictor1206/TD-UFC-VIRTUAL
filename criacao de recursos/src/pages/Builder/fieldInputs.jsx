// Peças de formulário reaproveitáveis pelo Construtor de Aulas.
// Cada uma edita um pedaço do JSON de uma seção (bloco) da aula.

const inputBase =
  'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500';

const labelBase = 'block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1';
const helpBase = 'mt-1 text-[11px] text-gray-400 dark:text-gray-500';

export function FieldShell({ label, help, children }) {
  return (
    <div>
      {label && <label className={labelBase}>{label}</label>}
      {children}
      {help && <p className={helpBase}>{help}</p>}
    </div>
  );
}

export function TextField({ label, help, value, onChange, placeholder }) {
  return (
    <FieldShell label={label} help={help}>
      <input
        type="text"
        className={inputBase}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldShell>
  );
}

export function TextAreaField({ label, help, value, onChange, rows = 4 }) {
  return (
    <FieldShell label={label} help={help}>
      <textarea
        className={`${inputBase} resize-y`}
        rows={rows}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldShell>
  );
}

export function SelectField({ label, help, value, onChange, options }) {
  return (
    <FieldShell label={label} help={help}>
      <select className={inputBase} value={value ?? options[0]?.value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </FieldShell>
  );
}

const smallBtn =
  'inline-flex items-center justify-center rounded-md text-xs font-semibold px-2 py-1 transition-colors';

export function RemoveButton({ onClick, label = 'Remover' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${smallBtn} text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40`}
      aria-label={label}
      title={label}
    >
      ✕
    </button>
  );
}

export function AddButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 inline-flex items-center gap-1 rounded-lg border border-dashed border-blue-400 text-blue-700 dark:text-blue-300 px-3 py-1.5 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
    >
      + {label}
    </button>
  );
}

export function StringListField({ label, help, value = [], onChange, itemType = 'text', addLabel = 'Adicionar item' }) {
  const items = value || [];
  const setItem = (i, v) => {
    const next = [...items];
    next[i] = v;
    onChange(next);
  };
  const removeItem = (i) => onChange(items.filter((_, idx) => idx !== i));
  const addItem = () => onChange([...items, '']);

  return (
    <FieldShell label={label} help={help}>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            {itemType === 'textarea' ? (
              <textarea
                className={`${inputBase} resize-y flex-1`}
                rows={2}
                value={item}
                onChange={(e) => setItem(i, e.target.value)}
              />
            ) : (
              <input
                type="text"
                className={`${inputBase} flex-1`}
                value={item}
                onChange={(e) => setItem(i, e.target.value)}
              />
            )}
            <RemoveButton onClick={() => removeItem(i)} />
          </div>
        ))}
      </div>
      <AddButton onClick={addItem} label={addLabel} />
    </FieldShell>
  );
}

export function ObjectListField({ label, help, value = [], onChange, itemFields, addLabel = 'Adicionar item', renderItemField }) {
  const items = value || [];
  const setItem = (i, newItem) => {
    const next = [...items];
    next[i] = newItem;
    onChange(next);
  };
  const removeItem = (i) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const emptyItem = () => Object.fromEntries(itemFields.map((f) => [f.key, f.type === 'stringList' ? [] : '']));
  const addItem = () => onChange([...items, emptyItem()]);

  return (
    <FieldShell label={label} help={help}>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-gray-400">#{i + 1}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => move(i, -1)} className="text-xs text-gray-400 hover:text-gray-700 px-1" title="Mover para cima">↑</button>
                <button type="button" onClick={() => move(i, 1)} className="text-xs text-gray-400 hover:text-gray-700 px-1" title="Mover para baixo">↓</button>
                <RemoveButton onClick={() => removeItem(i)} />
              </div>
            </div>
            <div className="space-y-2">
              {itemFields.map((f) => (
                <div key={f.key}>
                  {renderItemField(f, item[f.key], (v) => setItem(i, { ...item, [f.key]: v }))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <AddButton onClick={addItem} label={addLabel} />
    </FieldShell>
  );
}

export function DataTableRowsField({ label, headers = [], value = [], onChange }) {
  const columnCount = Math.max(headers.length, 1);
  const rows = value || [];

  const normalizeRow = (row = []) => {
    const next = [...row];
    while (next.length < columnCount) next.push('');
    return next.slice(0, columnCount);
  };

  const setCell = (r, c, v) => {
    const next = rows.map((row) => normalizeRow(row));
    next[r][c] = v;
    onChange(next);
  };
  const addRow = () => onChange([...rows.map(normalizeRow), Array(columnCount).fill('')]);
  const removeRow = (r) => onChange(rows.filter((_, idx) => idx !== r));

  return (
    <FieldShell label={label}>
      <div className="space-y-2 overflow-x-auto">
        {rows.map((row, r) => {
          const normalized = normalizeRow(row);
          return (
            <div key={r} className="flex items-start gap-2">
              <div className="grid gap-2 flex-1" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(120px, 1fr))` }}>
                {normalized.map((cell, c) => (
                  <input
                    key={c}
                    type="text"
                    className={inputBase}
                    placeholder={headers[c] || `Coluna ${c + 1}`}
                    value={cell}
                    onChange={(e) => setCell(r, c, e.target.value)}
                  />
                ))}
              </div>
              <RemoveButton onClick={() => removeRow(r)} />
            </div>
          );
        })}
      </div>
      <AddButton onClick={addRow} label="Adicionar linha" />
    </FieldShell>
  );
}
