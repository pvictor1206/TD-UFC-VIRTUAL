import { getSectionDefinition } from '@lesson';

// Operações puras sobre o JSON da aula (a mesma estrutura usada pela Versão 1):
// { aula, titulo, objetivo, cor, sections: [{ type: 'section', ..., children: [...] }] }
// Nenhuma altera o objeto recebido — sempre devolvem uma cópia nova.

export const clone = (obj) => JSON.parse(JSON.stringify(obj));

export const newSection = () => getSectionDefinition('section').defaultData();
export const newBlock = (type) => getSectionDefinition(type)?.defaultData();

export const kids = (section) => (section && section.children) || [];

const mapSection = (lesson, s, fn) => ({
  ...lesson,
  sections: lesson.sections.map((sec, i) => (i === s ? fn(sec) : sec)),
});

// ---------- componentes (dentro de um capítulo) ----------

export const insertBlock = (lesson, s, c, block) =>
  mapSection(lesson, s, (sec) => {
    const children = [...kids(sec)];
    children.splice(c, 0, block);
    return { ...sec, children };
  });

export const updateBlock = (lesson, s, c, block) =>
  mapSection(lesson, s, (sec) => ({ ...sec, children: kids(sec).map((b, i) => (i === c ? block : b)) }));

export const removeBlock = (lesson, s, c) =>
  mapSection(lesson, s, (sec) => ({ ...sec, children: kids(sec).filter((_, i) => i !== c) }));

export const duplicateBlock = (lesson, s, c) => insertBlock(lesson, s, c + 1, clone(kids(lesson.sections[s])[c]));

// Troca de lugar com o vizinho (dentro do mesmo capítulo).
export const swapBlock = (lesson, s, c, dir) => {
  const children = kids(lesson.sections[s]);
  const j = c + dir;
  if (j < 0 || j >= children.length) return lesson;
  const next = [...children];
  [next[c], next[j]] = [next[j], next[c]];
  return mapSection(lesson, s, (sec) => ({ ...sec, children: next }));
};

// Leva um componente para outra posição (pode ser em outro capítulo).
// `to.c` é a posição de inserção contada ANTES de tirar o componente do lugar de origem.
// Devolve { lesson, at } — `at` é onde o componente ficou.
export function moveBlock(lesson, from, to) {
  const block = kids(lesson.sections[from.s])[from.c];
  if (!block) return { lesson, at: from };
  let target = to.c;
  if (from.s === to.s && from.c < target) target -= 1;
  if (from.s === to.s && from.c === target) return { lesson, at: from };
  const without = removeBlock(lesson, from.s, from.c);
  return { lesson: insertBlock(without, to.s, target, block), at: { s: to.s, c: target } };
}

// ---------- capítulos ----------

export const insertSection = (lesson, at, section = newSection()) => {
  const sections = [...lesson.sections];
  sections.splice(at, 0, section);
  return { ...lesson, sections };
};

export const patchSection = (lesson, s, patch) => mapSection(lesson, s, (sec) => ({ ...sec, ...patch }));

export const removeSection = (lesson, s) => ({ ...lesson, sections: lesson.sections.filter((_, i) => i !== s) });

export const duplicateSection = (lesson, s) => insertSection(lesson, s + 1, clone(lesson.sections[s]));

export const swapSection = (lesson, s, dir) => {
  const j = s + dir;
  if (j < 0 || j >= lesson.sections.length) return lesson;
  const sections = [...lesson.sections];
  [sections[s], sections[j]] = [sections[j], sections[s]];
  return { ...lesson, sections };
};

// Leva um capítulo para outra posição. "to" é a posição de inserção contada ANTES de tirar o capítulo do lugar
// (0 = antes do primeiro, n = depois do último). Devolve { lesson, at }.
export function moveSection(lesson, from, to) {
  let target = to;
  if (from < target) target -= 1;
  if (!lesson.sections[from] || target === from) return { lesson, at: from };
  const sections = [...lesson.sections];
  const [section] = sections.splice(from, 1);
  sections.splice(target, 0, section);
  return { lesson: { ...lesson, sections }, at: target };
}

// ---------- apoio à interface ----------

// Onde entra um componente novo quando o usuário clica na lista (sem arrastar):
// logo abaixo do componente selecionado; no fim do capítulo selecionado; ou no fim do último capítulo.
export function defaultTarget(lesson, selected) {
  const last = lesson.sections.length - 1;
  if (selected?.kind === 'block' && lesson.sections[selected.s]) return { s: selected.s, c: selected.c + 1 };
  if (selected?.kind === 'section' && lesson.sections[selected.s]) {
    return { s: selected.s, c: kids(lesson.sections[selected.s]).length };
  }
  return { s: last, c: kids(lesson.sections[last]).length };
}

export const sectionLabel = (section, i) => {
  const name = section?.name || section?.title || '';
  return `Capítulo ${i + 1}${name ? ` — ${name}` : ''}`;
};

const PREVIEW_KEYS = ['text', 'title', 'statement', 'question', 'message', 'label', 'caption', 'latex', 'leftHeader', 'filename', 'src'];

// Trecho curto do conteúdo, para identificar o componente na lista de camadas.
export function previewOf(block, max = 34) {
  for (const key of PREVIEW_KEYS) {
    const v = block?.[key];
    if (typeof v === 'string' && v.trim() && !/^(https?:|data:|blob:)/i.test(v.trim())) {
      const flat = v.replace(/[*•\n]+/g, ' ').replace(/\s+/g, ' ').trim();
      return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
    }
  }
  return '';
}
