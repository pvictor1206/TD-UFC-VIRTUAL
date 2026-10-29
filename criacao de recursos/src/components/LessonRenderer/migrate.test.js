import { it, expect } from 'vitest';
import { migrateLesson } from './migrate';
import { SAMPLE_LESSON } from './blankLesson';

it('migra blocos antigos para capítulo + filhos e é idempotente', () => {
  const old = { sections: [
    { type: 'highlight_section', title: 'T', text: 'x' },
    { type: 'highlight_section', title: '', text: 'y' },
    { type: 'story', label: 'L', title: 'S', warning: 'w', paragraphs: ['a', 'b'] },
    { type: 'data_table', title: 'Tab', headers: ['a'], rows: [['1']] },
    { type: 'dropdown_group', layout: 'grid', items: [] },
  ] };
  const m = migrateLesson(old);
  expect(m.sections.map((s) => s.type)).toEqual(['section', 'section', 'section', 'section', 'section']);
  expect(m.sections[2].children).toHaveLength(2);
  expect(m.sections[3].children[0].title).toBeUndefined();
  expect(m.sections[1].children[0].type).toBe('intro');
  expect(migrateLesson(m)).toBe(m);
  expect(migrateLesson(SAMPLE_LESSON)).toBe(SAMPLE_LESSON);
});
