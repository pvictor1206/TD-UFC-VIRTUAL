import { GoChevronDown } from 'react-icons/go';
import { AddButton, Area, InlineText, MoveButtons, RemoveX, Rich } from '../fields';
import { listApi } from '../listOps';

// Acordeões, cards, linha do tempo e tabelas: mesmo desenho do que o aluno vê, editados no lugar.

export function DropdownGroupEditor({ block, onChange }) {
  const list = listApi(block, onChange, 'items', () => ({ title: '', content: '' }));
  const grid = block.layout === 'vertical' ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-1 md:grid-cols-2 gap-2';
  return (
    <section className="space-y-4">
      <div className={grid}>
        {list.items.map((item, i) => (
          <div key={i} className="group/item relative w-full">
            <div className="-mb-px border border-lav">
              <div className="flex w-full items-center justify-between gap-3 bg-lav-soft px-6 py-4 text-[#1b1b3a]">
                <InlineText value={item.title} onChange={(v) => list.patchItem(i, { title: v })} placeholder="Título do item" className="flex-1 text-left text-[15px] font-semibold" />
                <span className="flex shrink-0 items-center justify-center rounded-full border border-blue-600 p-0.5 text-blue-600">
                  <GoChevronDown size={16} />
                </span>
              </div>
              <div className="border-t border-lav bg-lav-soft px-6 py-5 text-left">
                <Rich value={item.content} onChange={(v) => list.patchItem(i, { content: v })} placeholder="Conteúdo que aparece ao abrir o item" className="text-[1em] text-[#1b1b3a] leading-relaxed" />
              </div>
            </div>
            <MoveButtons index={i} total={list.items.length} onMove={list.move} vertical />
            <RemoveX onClick={() => list.remove(i)} title="Remover item" />
          </div>
        ))}
      </div>
      <AddButton onClick={list.add}>Adicionar item</AddButton>
    </section>
  );
}

export function BulletCardsEditor({ block, onChange }) {
  const list = listApi(block, onChange, 'items', () => '');
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {list.items.map((text, i) => (
          <div key={i} className="group/item relative flex gap-3 rounded-[6px] bg-lav-soft p-4 md:p-5">
            <div className="w-1.5 self-stretch rounded-full bg-lav-bar" />
            <div className="min-w-0 flex-1">
              <Rich value={text} onChange={(v) => list.setItem(i, v)} placeholder="Escreva o card…" className="flex-1 text-left leading-relaxed text-ink" style={{ fontSize: '1em' }} />
            </div>
            <MoveButtons index={i} total={list.items.length} onMove={list.move} vertical />
            <RemoveX onClick={() => list.remove(i)} title="Remover card" />
          </div>
        ))}
      </div>
      <AddButton onClick={list.add}>Adicionar card</AddButton>
    </section>
  );
}

export function TimelineEditor({ block, onChange }) {
  const list = listApi(block, onChange, 'items', () => ({ ano: '', autor: '', evento: '' }));
  return (
    <section className="my-12">
      <div className="relative ml-6 space-y-8 border-l-4 border-lav-bar py-4">
        {list.items.map((item, i) => (
          <div key={i} className="group/item relative pl-8">
            <span aria-hidden className="absolute -left-[14px] top-1 h-6 w-6 rounded-full border-4 border-white bg-blue-400" />
            <div className="relative rounded-[6px] bg-lav-soft p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                    <InlineText value={item.ano} onChange={(v) => list.patchItem(i, { ano: v })} placeholder="Ano" className="inline-block min-w-[3ch]" />
                  </span>
                  <span className="text-lg font-bold text-ink">
                    <InlineText value={item.autor} onChange={(v) => list.patchItem(i, { autor: v })} placeholder="Autor / título curto" className="inline-block min-w-[8rem]" />
                  </span>
                </div>
                <span className="flex shrink-0 items-center justify-center rounded-full border border-blue-200 p-1 text-blue-600">
                  <GoChevronDown size={16} />
                </span>
              </div>
              <div className="mt-3 border-t border-lav pt-3 italic text-ink/80">
                <Area value={item.evento} onChange={(v) => list.patchItem(i, { evento: v })} placeholder="Descreva o evento (aparece ao abrir o marco)" className="italic" />
              </div>
              <MoveButtons index={i} total={list.items.length} onMove={list.move} vertical />
              <RemoveX onClick={() => list.remove(i)} title="Remover marco" />
            </div>
          </div>
        ))}
      </div>
      <AddButton onClick={list.add}>Adicionar marco</AddButton>
    </section>
  );
}

export function DataTableEditor({ block, onChange }) {
  const cols = Math.max((block.headers || []).length, 1);
  const headers = Array.from({ length: cols }, (_, c) => (block.headers || [])[c] ?? '');
  const norm = (row = []) => Array.from({ length: cols }, (_, c) => row[c] ?? '');
  const rows = (block.rows || []).map(norm);
  const put = (patch) => onChange({ ...block, ...patch });

  const setHeader = (c, v) => put({ headers: headers.map((h, i) => (i === c ? v : h)) });
  const setCell = (r, c, v) => put({ headers, rows: rows.map((row, i) => (i === r ? row.map((x, j) => (j === c ? v : x)) : row)) });
  const addRow = () => put({ headers, rows: [...rows, Array(cols).fill('')] });
  const removeRow = (r) => put({ headers, rows: rows.filter((_, i) => i !== r) });
  const addCol = () => put({ headers: [...headers, `Coluna ${cols + 1}`], rows: rows.map((row) => [...row, '']) });
  const removeCol = (c) => cols > 1 && put({ headers: headers.filter((_, i) => i !== c), rows: rows.map((row) => row.filter((_, j) => j !== c)) });

  return (
    <section className="my-8">
      <div className="w-full overflow-hidden rounded-[6px] text-ink">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-lav text-ink">
                {headers.map((h, c) => (
                  <th key={c} className="group/item relative px-5 py-3 text-center text-sm font-bold uppercase tracking-wide">
                    <InlineText value={h} onChange={(v) => setHeader(c, v)} placeholder={`Coluna ${c + 1}`} className="block" />
                    {cols > 1 && <RemoveX onClick={() => removeCol(c)} title="Remover coluna" inside />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-lav-soft">
              {rows.map((row, r) => (
                <tr key={r} className={`group/item relative ${r % 2 === 0 ? 'bg-lav-soft' : 'bg-lav-mid'}`}>
                  {row.map((cell, c) => (
                    <td key={c} className="relative px-5 py-3 text-center text-sm text-ink">
                      <InlineText value={cell} onChange={(v) => setCell(r, c, v)} placeholder="—" className="block" />
                      {c === cols - 1 && <RemoveX onClick={() => removeRow(r)} title="Remover linha" inside />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <AddButton onClick={addRow}>Linha</AddButton>
        <AddButton onClick={addCol}>Coluna</AddButton>
      </div>
    </section>
  );
}

const COMPARE = { headBg: 'var(--color-lav)', zebra: 'var(--color-lav-mid)', zebraTwo: 'var(--color-lav-soft)', border: 'var(--color-lav-soft)', divider: '#FFF' };

export function ComparisonTableEditor({ block, onChange }) {
  const list = listApi(block, onChange, 'rows', () => ({ left: '', right: '' }));
  const set = (key) => (value) => onChange({ ...block, [key]: value });
  return (
    <section className="my-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="overflow-hidden bg-white text-[#1b1b3a]">
          <div className="grid grid-cols-2 text-center text-[14px] font-semibold" style={{ backgroundColor: COMPARE.headBg, color: '#1b1b3a' }}>
            <div className="py-3 uppercase">
              <InlineText value={block.leftHeader} onChange={set('leftHeader')} placeholder="Coluna esquerda" className="inline-block min-w-[6rem]" />
            </div>
            <div className="py-3 uppercase" style={{ borderLeft: `3px solid ${COMPARE.divider}` }}>
              <InlineText value={block.rightHeader} onChange={set('rightHeader')} placeholder="Coluna direita" className="inline-block min-w-[6rem]" />
            </div>
          </div>
          <div>
            {list.items.map((row, i) => (
              <div
                key={i}
                className="group/item relative grid grid-cols-2 text-[14px]"
                style={{ backgroundColor: i % 2 === 1 ? COMPARE.zebra : COMPARE.zebraTwo, borderTop: `1px solid ${COMPARE.border}` }}
              >
                <div className="px-4 py-3 text-center">
                  <InlineText value={row.left} onChange={(v) => list.patchItem(i, { left: v })} placeholder="—" className="block" />
                </div>
                <div className="px-4 py-3 text-center" style={{ borderLeft: `3px solid ${COMPARE.divider}` }}>
                  <InlineText value={row.right} onChange={(v) => list.patchItem(i, { right: v })} placeholder="—" className="block" />
                </div>
                <RemoveX onClick={() => list.remove(i)} title="Remover linha" inside />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-2 max-w-4xl">
        <AddButton onClick={list.add}>Adicionar linha</AddButton>
      </div>
    </section>
  );
}
