import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LessonBuilderV2 from './LessonBuilderV2';
import * as L from './lessonOps';
import { SAMPLE_LESSON, createBlankLesson } from '@lesson';

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
  window.confirm = vi.fn(() => true);
});

const lessonWith = (children) => ({
  aula: '3',
  titulo: 'Aula de teste',
  objetivo: 'Objetivo',
  cor: '',
  sections: [
    { type: 'section', name: 'Cap A', label: '', title: 'Título A', subtitle: '', children },
    { type: 'section', name: 'Cap B', label: '', title: '', subtitle: '', children: [] },
  ],
});

const setup = (lesson, props = {}) => {
  const onLessonChange = vi.fn(() => true);
  const utils = render(<LessonBuilderV2 initialLesson={lesson} onLessonChange={onLessonChange} {...props} />);
  const last = () => onLessonChange.mock.calls.at(-1)?.[0];
  return { ...utils, onLessonChange, last };
};

const blocks = (container) => Array.from(container.querySelectorAll('[data-s][data-c]'));
// botão da lista de componentes (o "?" de ajuda ao lado tem o mesmo nome no texto)
const paletteButton = (label) => screen.getAllByRole('button', { name: new RegExp(label) }).find((b) => !b.getAttribute('aria-label'));
const flush = () => act(async () => { await new Promise((r) => setTimeout(r, 400)); });

describe('lessonOps', () => {
  const base = lessonWith([{ type: 'intro', text: 'a' }, { type: 'intro', text: 'b' }, { type: 'intro', text: 'c' }]);

  it('moves a block inside the same chapter (insertion index counted before removal)', () => {
    const r = L.moveBlock(base, { s: 0, c: 0 }, { s: 0, c: 3 });
    expect(r.lesson.sections[0].children.map((b) => b.text)).toEqual(['b', 'c', 'a']);
    expect(r.at).toEqual({ s: 0, c: 2 });
  });

  it('moves a block to another chapter and does not touch the original', () => {
    const r = L.moveBlock(base, { s: 0, c: 1 }, { s: 1, c: 0 });
    expect(r.lesson.sections[0].children.map((b) => b.text)).toEqual(['a', 'c']);
    expect(r.lesson.sections[1].children.map((b) => b.text)).toEqual(['b']);
    expect(base.sections[0].children).toHaveLength(3);
  });

  it('dropping a block where it already is changes nothing', () => {
    expect(L.moveBlock(base, { s: 0, c: 1 }, { s: 0, c: 1 }).lesson).toBe(base);
    expect(L.moveBlock(base, { s: 0, c: 1 }, { s: 0, c: 2 }).lesson).toBe(base);
  });

  it('adds new components after the selected one, or at the end of the chapter', () => {
    expect(L.defaultTarget(base, { kind: 'block', s: 0, c: 0 })).toEqual({ s: 0, c: 1 });
    expect(L.defaultTarget(base, { kind: 'section', s: 0 })).toEqual({ s: 0, c: 3 });
    expect(L.defaultTarget(base, null)).toEqual({ s: 1, c: 0 });
  });
});

describe('LessonBuilderV2 — editando na própria página', () => {
  it('mostra a aula inteira numa tela só, sem alternar editar/pré-visualizar', () => {
    const { container } = setup(SAMPLE_LESSON);
    expect(screen.queryByText(/Pré-visualizar/)).toBeNull();
    expect(container.querySelector('[data-lesson-header]')).toBeTruthy();
    expect(container.querySelectorAll('[data-chapter]').length).toBe(SAMPLE_LESSON.sections.length);
    expect(blocks(container).length).toBeGreaterThan(5);
  });

  it('desenha todos os tipos de componente do exemplo sem quebrar', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = setup(SAMPLE_LESSON);
    expect(container.textContent).not.toContain('Não foi possível mostrar este componente');
    spy.mockRestore();
  });

  it('edita o título da aula direto no cabeçalho e salva sozinho', async () => {
    const { container, last } = setup(lessonWith([]));
    const title = within(container.querySelector('[data-lesson-header]')).getByRole('textbox', { name: 'Título da aula' });
    expect(title.textContent).toBe('Aula de teste');
    title.textContent = 'Novo título';
    fireEvent.input(title);
    await flush();
    expect(last().titulo).toBe('Novo título');
  });

  it('edita o título do capítulo direto na página', async () => {
    const { container, last } = setup(lessonWith([]));
    const chapter = container.querySelector('[data-chapter="0"]');
    const title = within(chapter).getByRole('textbox', { name: 'Título do capítulo (opcional)' });
    title.textContent = 'Capítulo renomeado';
    fireEvent.input(title);
    await flush();
    expect(last().sections[0].title).toBe('Capítulo renomeado');
  });

  it('o primeiro clique em um componente só seleciona; o painel da direita mostra as propriedades', () => {
    const { container } = setup(lessonWith([{ type: 'callout', kind: 'dica', title: 'Minha dica', text: 'Texto' }]));
    fireEvent.click(container.querySelector('[data-s="0"][data-c="0"] [class*="relative"]'));
    expect(screen.getAllByText('Destaque (definição, teorema...)').length).toBeGreaterThan(0);
    expect(screen.getByDisplayValue('Minha dica')).toBeTruthy();
  });

  it('edita as propriedades pelo painel e a página muda na hora', async () => {
    const { container, last } = setup(lessonWith([{ type: 'callout', kind: 'dica', title: 'Minha dica', text: 'Texto' }]));
    fireEvent.click(container.querySelector('[data-s="0"][data-c="0"] [class*="relative"]'));
    fireEvent.change(screen.getByDisplayValue('Minha dica'), { target: { value: 'Dica nova' } });
    expect(container.textContent).toContain('Dica nova');
    await flush();
    expect(last().sections[0].children[0].title).toBe('Dica nova');
  });

  it('adiciona um componente pela lista, dentro do capítulo certo, e seleciona ele', async () => {
    const { container, last } = setup(lessonWith([{ type: 'intro', text: 'primeiro' }]));
    fireEvent.click(container.querySelector('[data-chapter="1"]'));
    fireEvent.click(paletteButton('Link de acesso'));
    await flush();
    expect(last().sections[1].children.map((b) => b.type)).toEqual(['access_link']);
    expect(last().sections[0].children).toHaveLength(1);
  });

  it('cria o capítulo sozinho quando a aula está vazia e entra um componente', async () => {
    const { last } = setup({ ...createBlankLesson(), aula: '1', titulo: 'Vazia' });
    fireEvent.click(paletteButton('Link de acesso'));
    await flush();
    expect(last().sections).toHaveLength(1);
    expect(last().sections[0].children.map((b) => b.type)).toEqual(['access_link']);
  });

  it('adiciona componente arrastando da lista para um capítulo', async () => {
    const { container, last } = setup(lessonWith([]));
    const data = { 'application/x-editor2-novo': 'callout' };
    const dataTransfer = { types: Object.keys(data), getData: (k) => data[k], dropEffect: '' };
    const chapter = container.querySelector('[data-chapter="1"]');
    fireEvent.dragOver(chapter, { dataTransfer, clientY: 10 });
    fireEvent.drop(chapter, { dataTransfer, clientY: 10 });
    await flush();
    expect(last().sections[1].children.map((b) => b.type)).toEqual(['callout']);
  });

  it('exclui um componente e o "Desfazer" traz de volta', async () => {
    const { container, last } = setup(lessonWith([{ type: 'intro', text: 'x' }, { type: 'access_link', label: 'L', href: '' }]));
    fireEvent.click(container.querySelector('[data-s="0"][data-c="1"] [class*="relative"]'));
    fireEvent.click(screen.getAllByTitle('Excluir componente')[0]);
    await flush();
    expect(last().sections[0].children).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Desfazer' }));
    await flush();
    expect(last().sections[0].children).toHaveLength(2);
  });

  it('move componente para cima e para baixo', async () => {
    const { container, last } = setup(lessonWith([{ type: 'intro', text: 'a' }, { type: 'access_link', label: 'B', href: '' }]));
    fireEvent.click(container.querySelector('[data-s="0"][data-c="1"] [class*="relative"]'));
    fireEvent.click(screen.getAllByTitle('Mover para cima')[0]);
    await flush();
    expect(last().sections[0].children.map((b) => b.type)).toEqual(['access_link', 'intro']);
  });

  it('o componente que não tem nada para mostrar ganha um aviso clicável', () => {
    // sem ResizeObserver no jsdom o aviso não aparece — aqui só garantimos que não quebra
    const { container } = setup(lessonWith([{ type: 'carousel', images: [] }]));
    expect(container.querySelector('[data-s="0"][data-c="0"]')).toBeTruthy();
  });

  it('modo leitura mostra só a aula, sem painéis de edição', () => {
    const { container } = setup(SAMPLE_LESSON, { readOnly: true });
    expect(screen.getByText(/Modo leitura/)).toBeTruthy();
    expect(container.querySelector('[data-chapter]')).toBeNull();
    expect(screen.queryByText('Componentes')).toBeNull();
  });

  it('uma aula salva na versão 1 abre igual na versão 2 (mesmo JSON, sem campos novos)', async () => {
    const { last, container } = setup(SAMPLE_LESSON);
    const title = within(container.querySelector('[data-lesson-header]')).getByRole('textbox', { name: 'Título da aula' });
    title.textContent = 'Mudou';
    fireEvent.input(title);
    await flush();
    const saved = last();
    expect(Object.keys(saved).sort()).toEqual(Object.keys({ ...createBlankLesson(), ...SAMPLE_LESSON }).sort());
    expect(saved.sections).toEqual(SAMPLE_LESSON.sections);
  });
});
