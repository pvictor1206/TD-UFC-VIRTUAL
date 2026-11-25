import { getSectionDefinition } from '@lesson';
import SchemaField from '../Builder/SchemaField';
import HelpButton from '../Builder/HelpButton';
import ColorPicker from '../Builder/ColorPicker';
import { TextField, TextAreaField } from '../Builder/fieldInputs';
import SpacingField from './SpacingField';
import { kids } from './lessonOps';

// Campos que já são editados direto na página — não se repetem aqui.
const EDITED_ON_PAGE = { intro: ['text'], heading: ['text'] };

const iconBtn = 'inline-flex h-9 w-9 items-center justify-center rounded-lg text-xl text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent';

function Actions({ canUp, canDown, onUp, onDown, onDuplicate, onRemove, noun }) {
  return (
    <div className="flex items-center gap-1 border-t border-gray-100 pt-3">
      <button type="button" disabled={!canUp} onClick={onUp} title={`Mover ${noun} para cima`} className={iconBtn}>↑</button>
      <button type="button" disabled={!canDown} onClick={onDown} title={`Mover ${noun} para baixo`} className={iconBtn}>↓</button>
      <button type="button" onClick={onDuplicate} title={`Duplicar ${noun}`} className={iconBtn}>⧉</button>
      <span className="flex-1" />
      <button type="button" onClick={onRemove} title={`Excluir ${noun}`} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
        🗑 Excluir
      </button>
    </div>
  );
}

function Shell({ icon, title, description, help, children }) {
  return (
    <aside className="flex min-h-0 w-80 shrink-0 flex-col border-l border-gray-200 bg-white">
      <div className="flex items-start gap-3 border-b border-gray-100 px-4 py-3">
        <span className="mt-0.5 text-xl">{icon}</span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
          {description && <p className="mt-0.5 text-xs leading-snug text-gray-500">{description}</p>}
        </div>
        {help}
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">{children}</div>
    </aside>
  );
}

// Painel da direita: propriedades do que está selecionado na página.
export default function Inspector({ lesson, selected, canEditSpacing, ops }) {
  if (selected?.kind === 'block' && lesson.sections[selected.s]?.children?.[selected.c]) {
    const { s, c } = selected;
    const block = lesson.sections[s].children[c];
    const total = kids(lesson.sections[s]).length;
    const def = getSectionDefinition(block.type);
    if (!def) {
      return (
        <Shell icon="⚠️" title="Componente desconhecido" description={`Tipo "${block.type}" não existe no catálogo.`}>
          <Actions noun="componente" canUp={c > 0} canDown={c < total - 1} onUp={() => ops.moveBlockBy(s, c, -1)} onDown={() => ops.moveBlockBy(s, c, 1)} onDuplicate={() => ops.duplicateBlock(s, c)} onRemove={() => ops.removeBlock(s, c)} />
        </Shell>
      );
    }
    const hidden = EDITED_ON_PAGE[block.type] || [];
    const fields = def.fields.filter((f) => !hidden.includes(f.key));
    const set = (key, value) => ops.changeBlock(s, c, { ...block, [key]: value });
    return (
      <Shell
        key={`${s}-${c}-${block.type}`}
        icon={def.icon}
        title={def.label}
        description={def.description}
        help={<HelpButton definition={def} className="!h-8 !w-8 !text-sm" />}
      >
        {hidden.length > 0 && (
          <p className="rounded-lg bg-lav-soft px-3 py-2 text-xs text-ink">
            ✏️ O texto é editado direto na página: clique nele e digite.
          </p>
        )}
        {fields.map((field) => (
          <SchemaField key={field.key} field={field} value={block[field.key]} onChange={(v) => set(field.key, v)} siblingValues={block} />
        ))}
        {canEditSpacing && (
          <div className="space-y-3 rounded-lg bg-lav-soft/70 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-ink">↕ Espaçamento</p>
            <SpacingField label="Em cima" value={block.spaceBefore} onChange={(v) => set('spaceBefore', v)} />
            <SpacingField label="Em baixo" value={block.spaceAfter} onChange={(v) => set('spaceAfter', v)} />
          </div>
        )}
        <Actions noun="componente" canUp={c > 0} canDown={c < total - 1} onUp={() => ops.moveBlockBy(s, c, -1)} onDown={() => ops.moveBlockBy(s, c, 1)} onDuplicate={() => ops.duplicateBlock(s, c)} onRemove={() => ops.removeBlock(s, c)} />
      </Shell>
    );
  }

  if (selected?.kind === 'section' && lesson.sections[selected.s]) {
    const s = selected.s;
    const section = lesson.sections[s];
    const def = getSectionDefinition('section');
    const set = (key, value) => ops.patchSection(s, { [key]: value });
    return (
      <Shell
        key={`section-${s}`}
        icon="🔖"
        title={`Capítulo ${s + 1}`}
        description={def.description}
        help={<HelpButton definition={def} className="!h-8 !w-8 !text-sm" />}
      >
        <TextField
          label="Nome do capítulo (só você vê)"
          help="Aparece na barra do capítulo e nas camadas; não aparece para o aluno."
          value={section.name}
          onChange={(v) => set('name', v)}
        />
        {def.fields.filter((f) => f.key !== 'children').map((field) => (
          <SchemaField key={field.key} field={field} value={section[field.key]} onChange={(v) => set(field.key, v)} siblingValues={section} />
        ))}
        {canEditSpacing && (
          <div className="space-y-3 rounded-lg bg-lav-soft/70 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-ink">↕ Espaçamento</p>
            <SpacingField label="Em cima do título" value={section.titleBefore} onChange={(v) => set('titleBefore', v)} />
            <SpacingField label="Entre o título e os componentes" value={section.titleAfter} onChange={(v) => set('titleAfter', v)} />
          </div>
        )}
        <Actions noun="capítulo" canUp={s > 0} canDown={s < lesson.sections.length - 1} onUp={() => ops.moveSectionBy(s, -1)} onDown={() => ops.moveSectionBy(s, 1)} onDuplicate={() => ops.duplicateSection(s)} onRemove={() => ops.removeSection(s)} />
      </Shell>
    );
  }

  // nada selecionado (ou o cabeçalho): dados gerais da aula
  return (
    <Shell icon="🎓" title="Dados da aula" description="Número, título, objetivo e cor da aula. Também dá para editar o cabeçalho direto na página.">
      <TextField label="Número da aula" value={lesson.aula} onChange={(v) => ops.updateMeta('aula', v)} placeholder="Nº" />
      <TextField label="Título da aula" value={lesson.titulo} onChange={(v) => ops.updateMeta('titulo', v)} />
      <TextAreaField label="Objetivo (subtítulo, opcional)" value={lesson.objetivo} onChange={(v) => ops.updateMeta('objetivo', v)} rows={3} />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-gray-600">Cor da aula</p>
        <ColorPicker value={lesson.cor || ''} onChange={(v) => ops.updateMeta('cor', v)} />
      </div>
      <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs leading-snug text-gray-500">
        Clique em um capítulo ou componente na página para editar as propriedades dele aqui.
      </p>
    </Shell>
  );
}
