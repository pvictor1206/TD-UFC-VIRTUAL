import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LessonBuilderV2 from './LessonBuilderV2';
import * as L from './lessonOps';
import { BLOCK_EDITORS } from './blocks';
import { SAMPLE_LESSON, SECTION_CATALOG, createBlankLesson } from '@lesson';

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
  const block = (s = 0, c = 0) => utils.container.querySelector(`[data-s="${s}"][data-c="${c}"]`);
  const frame = (s = 0, c = 0) => block(s, c).firstElementChild; // moldura de seleção do componente
  return { ...utils, onLessonChange, last, block, frame };
};

const flush = () => act(async () => { await new Promise((r) => setTimeout(r, 400)); });
// digita num campo de texto simples (contentEditable) do componente
const type = (el, text) => { el.textContent = text; fireEvent.input(el); };
// botão da lista de componentes (o "?" de ajuda ao lado tem o mesmo nome no texto)
const paletteButton = (label) => screen.getAllByRole('button', { name: new RegExp(label) }).find((b) => !b.getAttribute('aria-label'));

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

describe('LessonBuilderV2 — a página', () => {
  it('mostra a aula inteira numa tela só, sem alternar editar/pré-visualizar e sem painel de propriedades', () => {
    const { container } = setup(SAMPLE_LESSON);
    expect(screen.queryByText(/Pré-visualizar/)).toBeNull();
    expect(screen.queryByText('Dados da aula')).toBeNull();
    expect(container.querySelector('[data-lesson-header]')).toBeTruthy();
    expect(container.querySelectorAll('[data-chapter]').length).toBe(SAMPLE_LESSON.sections.length);
    expect(container.querySelectorAll('[data-s][data-c]').length).toBeGreaterThan(5);
  });

  it('todo tipo de componente do catálogo tem editor próprio e abre sem quebrar', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const types = SECTION_CATALOG.filter((d) => d.type !== 'section');
    types.forEach((d) => expect(BLOCK_EDITORS[d.type], d.type).toBeTruthy());
    const { container } = setup(lessonWith(types.map((d) => d.defaultData())));
    expect(container.textContent).not.toContain('Não foi possível mostrar este componente');
    expect(container.querySelectorAll('[data-s="0"][data-c]').length).toBe(types.length);
    spy.mockRestore();
  });

  it('o exemplo completo (todos os componentes preenchidos) abre sem quebrar', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = setup(SAMPLE_LESSON);
    expect(container.textContent).not.toContain('Não foi possível mostrar este componente');
    spy.mockRestore();
  });

  it('edita o título da aula direto no cabeçalho e salva sozinho', async () => {
    const { container, last } = setup(lessonWith([]));
    const title = within(container.querySelector('[data-lesson-header]')).getByRole('textbox', { name: 'Título da aula' });
    expect(title.textContent).toBe('Aula de teste');
    type(title, 'Novo título');
    await flush();
    expect(last().titulo).toBe('Novo título');
  });

  it('edita o título do capítulo direto na página', async () => {
    const { container, last } = setup(lessonWith([]));
    const title = within(container.querySelector('[data-chapter="0"]')).getByRole('textbox', { name: 'Título do capítulo (opcional)' });
    type(title, 'Capítulo renomeado');
    await flush();
    expect(last().sections[0].title).toBe('Capítulo renomeado');
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
    type(title, 'Mudou');
    await flush();
    const saved = last();
    expect(Object.keys(saved).sort()).toEqual(Object.keys({ ...createBlankLesson(), ...SAMPLE_LESSON }).sort());
    expect(saved.sections).toEqual(SAMPLE_LESSON.sections);
  });
});

describe('LessonBuilderV2 — montar a aula', () => {
  it('adiciona um componente pela lista, dentro do capítulo certo', async () => {
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

  it('o cursor já vai para o primeiro campo do componente recém-adicionado', async () => {
    const { container } = setup(lessonWith([]));
    fireEvent.click(paletteButton('Título'));
    await flush();
    const field = container.querySelector('[data-s="1"][data-c="0"] [data-field]');
    expect(document.activeElement).toBe(field);
  });

  it('clicar em um componente o seleciona (barra com mover, duplicar, opções e excluir)', () => {
    const { frame } = setup(lessonWith([{ type: 'callout', kind: 'dica', title: 'Minha dica', text: 'Texto' }]));
    expect(screen.queryByTitle('Excluir (Delete)')).toBeNull();
    fireEvent.mouseDown(frame());
    expect(screen.getByTitle('Excluir (Delete)')).toBeTruthy();
    expect(screen.getByTitle('Duplicar')).toBeTruthy();
  });

  it('exclui um componente e o "Desfazer" traz de volta', async () => {
    const { frame, last } = setup(lessonWith([{ type: 'intro', text: 'x' }, { type: 'access_link', label: 'L', href: '' }]));
    fireEvent.mouseDown(frame(0, 1));
    fireEvent.click(screen.getByTitle('Excluir (Delete)'));
    await flush();
    expect(last().sections[0].children).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Desfazer' }));
    await flush();
    expect(last().sections[0].children).toHaveLength(2);
  });

  it('move componente para cima', async () => {
    const { frame, last } = setup(lessonWith([{ type: 'intro', text: 'a' }, { type: 'access_link', label: 'B', href: '' }]));
    fireEvent.mouseDown(frame(0, 1));
    fireEvent.click(screen.getByTitle('Mover para cima'));
    await flush();
    expect(last().sections[0].children.map((b) => b.type)).toEqual(['access_link', 'intro']);
  });
});

describe('LessonBuilderV2 — editando dentro do próprio componente', () => {
  it('bloco com texto: clicar abre o editor no lugar e grava o texto formatado', async () => {
    const { block, last } = setup(lessonWith([{ type: 'intro', text: 'olá' }]));
    fireEvent.focus(within(block()).getByRole('textbox', { name: 'Escreva o texto…' }));
    const editor = within(block()).getByRole('textbox', { name: 'Escreva o texto…' });
    expect(editor.getAttribute('contenteditable')).toBe('true');
    editor.innerHTML = '<div>novo <strong>texto</strong></div><ul><li>item</li></ul>';
    fireEvent.input(editor);
    await flush();
    expect(last().sections[0].children[0].text).toBe('novo **texto**\n• item');
  });

  it('título (heading): digita direto e as opções de tamanho ficam na engrenagem do próprio componente', async () => {
    const { block, frame, last } = setup(lessonWith([{ type: 'heading', text: '', size: 'medio', align: 'esquerda' }]));
    type(within(block()).getByRole('textbox', { name: 'Escreva o título…' }), 'Meu título');
    fireEvent.mouseDown(frame());
    fireEvent.click(screen.getByTitle('Opções deste componente'));
    fireEvent.change(screen.getByDisplayValue('Médio'), { target: { value: 'grande' } });
    await flush();
    expect(last().sections[0].children[0]).toMatchObject({ text: 'Meu título', size: 'grande' });
  });

  it('destaque: troca o tipo no próprio selo e escreve o título', async () => {
    const { block, last } = setup(lessonWith([{ type: 'callout', kind: 'dica', title: '', text: 't' }]));
    fireEvent.change(within(block()).getByLabelText('Tipo de destaque'), { target: { value: 'teorema' } });
    type(within(block()).getByRole('textbox', { name: 'Título (opcional)' }), 'Pitágoras');
    await flush();
    expect(last().sections[0].children[0]).toMatchObject({ kind: 'teorema', title: 'Pitágoras' });
  });

  it('grupo de acordeões: adiciona, escreve e remove itens dentro do componente', async () => {
    const { block, last } = setup(lessonWith([{ type: 'dropdown_group', layout: 'grid', items: [] }]));
    fireEvent.click(within(block()).getByRole('button', { name: '+ Adicionar item' }));
    fireEvent.click(within(block()).getByRole('button', { name: '+ Adicionar item' }));
    type(within(block()).getAllByRole('textbox', { name: 'Título do item' })[1], 'Segundo');
    await flush();
    expect(last().sections[0].children[0].items.map((i) => i.title)).toEqual(['', 'Segundo']);
    fireEvent.click(within(block()).getAllByRole('button', { name: 'Remover item' })[0]);
    await flush();
    expect(last().sections[0].children[0].items.map((i) => i.title)).toEqual(['Segundo']);
  });

  it('tabela de dados: adiciona linha e coluna, edita células', async () => {
    const { block, last } = setup(lessonWith([{ type: 'data_table', headers: ['A', 'B'], rows: [['1', '2']] }]));
    fireEvent.click(within(block()).getByRole('button', { name: '+ Linha' }));
    fireEvent.click(within(block()).getByRole('button', { name: '+ Coluna' }));
    await flush();
    const t = last().sections[0].children[0];
    expect(t.headers).toHaveLength(3);
    expect(t.rows).toEqual([['1', '2', ''], ['', '', '']]);
    type(within(block()).getAllByRole('textbox', { name: '—' })[0], 'X');
    await flush();
    expect(last().sections[0].children[0].rows[0][0]).toBe('X');
  });

  it('quiz: marca a alternativa correta e a resposta acompanha o texto editado', async () => {
    const { block, last } = setup(lessonWith([{ type: 'quiz', questions: [{ text: 'P?', options: ['A', 'B'], correctAnswer: 'A' }] }]));
    fireEvent.click(within(block()).getAllByRole('button', { name: 'Marcar como alternativa correta' })[1]);
    await flush();
    expect(last().sections[0].children[0].questions[0].correctAnswer).toBe('B');
    type(within(block()).getByRole('textbox', { name: 'Alternativa 2' }), 'Bê');
    await flush();
    expect(last().sections[0].children[0].questions[0]).toMatchObject({ options: ['A', 'Bê'], correctAnswer: 'Bê' });
  });

  it('vídeo: aceita o link inteiro do YouTube e guarda só o código', async () => {
    const { block, last } = setup(lessonWith([{ type: 'video', title: '', source: 'youtube', videoId: '', driveId: '' }]));
    fireEvent.change(within(block()).getByLabelText('ID do vídeo no YouTube'), { target: { value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=3' } });
    await flush();
    expect(last().sections[0].children[0].videoId).toBe('dQw4w9WgXcQ');
  });

  it('imagem: sem arquivo, oferece colar o endereço dentro do componente', async () => {
    const { block, last } = setup(lessonWith([{ type: 'image', src: '', alt: '', caption: '' }]));
    fireEvent.change(within(block()).getByLabelText('Endereço da imagem'), { target: { value: 'https://exemplo.com/a.png' } });
    type(within(block()).getByRole('textbox', { name: 'Legenda (opcional)' }), 'Figura 1');
    await flush();
    expect(last().sections[0].children[0]).toMatchObject({ src: 'https://exemplo.com/a.png', caption: 'Figura 1' });
  });

  it('chamada para ação: texto do botão e link no próprio componente', async () => {
    const { block, last } = setup(lessonWith([{ type: 'cta', message: 'M', buttonLabel: '', href: '#' }]));
    type(within(block()).getByRole('textbox', { name: 'Texto do botão' }), 'Responder');
    fireEvent.change(within(block()).getByLabelText('Link do botão'), { target: { value: 'https://forms.example.com' } });
    await flush();
    expect(last().sections[0].children[0]).toMatchObject({ buttonLabel: 'Responder', href: 'https://forms.example.com' });
  });

  it('código: troca a linguagem e escreve o código no próprio componente', async () => {
    const { block, last } = setup(lessonWith([{ type: 'code_block', language: 'python', filename: '', code: 'print(1)', lineNumbers: 'sim', highlight: '', output: '', runnable: 'nao', caption: '' }]));
    fireEvent.change(within(block()).getByLabelText('Linguagem'), { target: { value: 'javascript' } });
    fireEvent.focus(within(block()).getByRole('textbox', { name: 'Clique para escrever o código' }));
    fireEvent.change(within(block()).getByLabelText('Código'), { target: { value: 'console.log(2)' } });
    await flush();
    expect(last().sections[0].children[0]).toMatchObject({ language: 'javascript', code: 'console.log(2)' });
  });

  it('exercício passo a passo: adiciona passos e escreve a resposta', async () => {
    const { block, last } = setup(lessonWith([{ type: 'step_by_step', statement: '', steps: [], answer: '', answerLatex: '' }]));
    fireEvent.click(within(block()).getByRole('button', { name: '+ Adicionar passo' }));
    await flush();
    expect(last().sections[0].children[0].steps).toHaveLength(1);
    type(within(block()).getByRole('textbox', { name: 'Resposta final em texto (opcional)' }), '42');
    await flush();
    expect(last().sections[0].children[0].answer).toBe('42');
  });

  it('o componente continua válido para a versão 1 (mesmos campos, só os valores mudam)', async () => {
    const { block, last } = setup(lessonWith([{ type: 'bullet_cards', items: ['a'] }]));
    fireEvent.click(within(block()).getByRole('button', { name: '+ Adicionar card' }));
    await flush();
    expect(last().sections[0].children[0]).toEqual({ type: 'bullet_cards', items: ['a', ''] });
  });
});

// DataTransfer de mentirinha para simular arrastar e soltar
const makeDt = () => {
  const store = {};
  return {
    types: [],
    effectAllowed: '',
    dropEffect: '',
    setData(k, v) { store[k] = v; this.types = Object.keys(store); },
    getData: (k) => store[k],
    setDragImage() {},
  };
};

describe('lessonOps — capítulos', () => {
  const base = lessonWith([]);
  it('leva um capítulo para depois do outro e mantém a ordem dos demais', () => {
    const three = { ...base, sections: [...base.sections, { ...base.sections[1], name: 'Cap C' }] };
    const r = L.moveSection(three, 0, 2);
    expect(r.lesson.sections.map((x) => x.name)).toEqual(['Cap B', 'Cap A', 'Cap C']);
    expect(r.at).toBe(1);
    expect(L.moveSection(three, 1, 1).lesson).toBe(three);
    expect(L.moveSection(three, 1, 2).lesson).toBe(three);
  });
});

describe('LessonBuilderV2 — arrastar e adicionar (camadas e página)', () => {
  const abrirCamadas = () => fireEvent.click(screen.getByRole('button', { name: 'Camadas' }));

  it('camadas: arrasta um componente para dentro de outro capítulo', async () => {
    const { last } = setup(lessonWith([{ type: 'intro', text: 'a' }, { type: 'access_link', label: 'B', href: '' }]));
    abrirCamadas();
    const dt = makeDt();
    fireEvent.dragStart(screen.getByTitle(/Bloco com texto — arraste/), { dataTransfer: dt });
    const capB = screen.getByTitle(/Capítulo 2/);
    fireEvent.dragOver(capB, { dataTransfer: dt });
    fireEvent.drop(capB, { dataTransfer: dt });
    await flush();
    expect(last().sections[0].children.map((b) => b.type)).toEqual(['access_link']);
    expect(last().sections[1].children.map((b) => b.type)).toEqual(['intro']);
  });

  it('camadas: arrasta um componente para antes/depois de outro (mesmo capítulo)', async () => {
    const { last } = setup(lessonWith([{ type: 'intro', text: 'a' }, { type: 'access_link', label: 'B', href: '' }]));
    abrirCamadas();
    const dt = makeDt();
    fireEvent.dragStart(screen.getByTitle(/Bloco com texto — arraste/), { dataTransfer: dt });
    const alvo = screen.getByTitle(/Link de acesso — arraste/);
    fireEvent.dragOver(alvo, { dataTransfer: dt, clientY: 0 });
    fireEvent.drop(alvo, { dataTransfer: dt, clientY: 0 }); // metade de baixo: depois do link
    await flush();
    expect(last().sections[0].children.map((b) => b.type)).toEqual(['access_link', 'intro']);
  });

  it('camadas: arrasta um capítulo inteiro para outra posição', async () => {
    const { last } = setup(lessonWith([{ type: 'intro', text: 'a' }]));
    abrirCamadas();
    const dt = makeDt();
    fireEvent.dragStart(screen.getByTitle(/Capítulo 1/), { dataTransfer: dt });
    const capB = screen.getByTitle(/Capítulo 2/);
    fireEvent.dragOver(capB, { dataTransfer: dt, clientY: 0 });
    fireEvent.drop(capB, { dataTransfer: dt, clientY: 0 });
    await flush();
    expect(last().sections.map((s) => s.name)).toEqual(['Cap B', 'Cap A']);
  });

  it('camadas: o + do capítulo abre a lista e adiciona o componente no fim dele', async () => {
    const { last } = setup(lessonWith([{ type: 'intro', text: 'a' }]));
    abrirCamadas();
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar componente no capítulo 1' }));
    const dialog = screen.getByRole('dialog', { name: 'Adicionar componente' });
    fireEvent.click(within(dialog).getByRole('button', { name: /Link de acesso/ }));
    await flush();
    expect(last().sections[0].children.map((b) => b.type)).toEqual(['intro', 'access_link']);
    expect(screen.queryByRole('dialog', { name: 'Adicionar componente' })).toBeNull();
  });

  it('página: botão no fim do capítulo adiciona o componente nele', async () => {
    const { last } = setup(lessonWith([]));
    fireEvent.click(screen.getAllByRole('button', { name: '+ Adicionar componente neste capítulo' })[1]);
    const dialog = screen.getByRole('dialog', { name: 'Adicionar componente' });
    fireEvent.change(within(dialog).getByRole('searchbox', { name: 'Buscar componente' }), { target: { value: 'glossário' } });
    fireEvent.click(within(dialog).getByRole('button', { name: /Glossário/ }));
    await flush();
    expect(last().sections[1].children.map((b) => b.type)).toEqual(['glossary']);
  });

  it('página: o + na borda de um componente adiciona logo abaixo dele', async () => {
    const { last } = setup(lessonWith([{ type: 'intro', text: 'a' }, { type: 'intro', text: 'c' }]));
    fireEvent.click(screen.getAllByRole('button', { name: 'Adicionar componente abaixo' })[0]);
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Adicionar componente' })).getByRole('button', { name: /Link de acesso/ }));
    await flush();
    expect(last().sections[0].children.map((b) => b.type)).toEqual(['intro', 'access_link', 'intro']);
  });

  it('página: arrasta um capítulo pela barra e solta em outro', async () => {
    const { container, last } = setup(lessonWith([]));
    const dt = makeDt();
    fireEvent.dragStart(screen.getAllByTitle('Arraste para mudar este capítulo de lugar')[0], { dataTransfer: dt });
    const alvo = container.querySelector('[data-chapter="1"]');
    fireEvent.dragOver(alvo, { dataTransfer: dt, clientY: 0 });
    fireEvent.drop(alvo, { dataTransfer: dt, clientY: 0 });
    await flush();
    expect(last().sections.map((s) => s.name)).toEqual(['Cap B', 'Cap A']);
  });

  it('visão do aluno: mostra a aula pronta, sem a edição, e volta a editar', () => {
    const { container } = setup(lessonWith([{ type: 'callout', kind: 'dica', title: 'Minha dica', text: 'Texto da dica' }]));
    expect(container.querySelector('[data-chapter]')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Visão do aluno/ }));
    expect(container.querySelector('[data-student-view]')).toBeTruthy();
    expect(container.querySelector('[data-chapter]')).toBeNull();
    expect(screen.queryByText('Componentes')).toBeNull();
    expect(container.querySelector('[data-student-view]').textContent).toContain('Texto da dica');
    fireEvent.click(screen.getAllByRole('button', { name: /Voltar a editar/ })[0]);
    expect(container.querySelector('[data-student-view]')).toBeNull();
    expect(container.querySelector('[data-chapter]')).toBeTruthy();
  });

  it('visão do aluno: o Delete não exclui nada por engano', async () => {
    const { last, frame } = setup(lessonWith([{ type: 'intro', text: 'a' }]));
    fireEvent.mouseDown(frame());
    fireEvent.click(screen.getByRole('button', { name: /Visão do aluno/ }));
    fireEvent.keyDown(document.body, { key: 'Delete' });
    await flush();
    expect(last()?.sections?.[0]?.children ?? [{}]).toHaveLength(1);
  });
});
