// Converte aulas no formato antigo para a estrutura atual do Editor Estrutural.
//
// Antes, vários blocos carregavam o próprio título (bloco com título,
// história, grupo de acordeões, lista de cards, tabelas). Agora o título é
// um componente separado — `section` — que contém os outros blocos em
// `children`. Esta função é idempotente: aulas já no formato novo passam
// sem alteração (devolve os mesmos objetos).

const WRAPPED_TYPES = ['dropdown_group', 'bullet_cards', 'data_table', 'comparison_table'];

const hasText = (v) => typeof v === 'string' && v.trim() !== '';

// Devolve uma lista (um bloco antigo pode virar vários).
export function migrateSection(section) {
  if (!section || typeof section !== 'object') return [section];

  switch (section.type) {
    case 'highlight_section': {
      const text = { type: 'intro', text: section.text || '' };
      return [hasText(section.title) ? { type: 'section', title: section.title, children: [text] } : text];
    }

    case 'story': {
      const paragraphs = (section.paragraphs || []).map((p) => ({ type: 'intro', text: p }));
      if (!hasText(section.label) && !hasText(section.title) && !hasText(section.warning)) return paragraphs;
      return [{
        type: 'section',
        label: section.label || '',
        title: section.title || '',
        subtitle: section.warning || '',
        children: paragraphs,
      }];
    }

    case 'section': {
      const children = section.children || [];
      const migrated = children.flatMap(migrateSection);
      const unchanged = migrated.length === children.length && migrated.every((c, i) => c === children[i]);
      return [unchanged && section.children ? section : { ...section, children: migrated }];
    }

    default:
      if (WRAPPED_TYPES.includes(section.type) && (hasText(section.title) || hasText(section.subtitle))) {
        const { title, subtitle, ...rest } = section;
        return [{ type: 'section', title: title || '', subtitle: subtitle || '', children: [rest] }];
      }
      return [section];
  }
}

export const migrateSections = (sections = []) => {
  const out = sections.flatMap(migrateSection);
  const unchanged = out.length === sections.length && out.every((s, i) => s === sections[i]);
  return unchanged ? sections : out;
};

export const migrateLesson = (lesson) => {
  if (!lesson) return lesson;
  const sections = groupIntoSections(migrateSections(lesson.sections || []));
  return sections === lesson.sections ? lesson : { ...lesson, sections };
};

// O editor exige que todo componente esteja dentro de uma seção: blocos soltos
// consecutivos são agrupados em uma seção sem título. Idempotente.
export const groupIntoSections = (sections = []) => {
  const out = [];
  let loose = null;
  for (const s of sections) {
    if (s && s.type === 'section') {
      loose = null;
      out.push(s);
    } else {
      if (!loose) {
        loose = { type: 'section', label: '', title: '', subtitle: '', children: [] };
        out.push(loose);
      }
      loose.children.push(s);
    }
  }
  const unchanged = out.length === sections.length && out.every((s, i) => s === sections[i]);
  return unchanged ? sections : out;
};
