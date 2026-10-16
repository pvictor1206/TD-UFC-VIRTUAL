// Catálogo único dos blocos padrão de uma aula.
// Este arquivo é a "fonte da verdade": tanto o Construtor (formulários)
// quanto o LessonRenderer (tela final) leem daqui os tipos de bloco
// disponíveis, seus campos e valores padrão.
//
// Para reaproveitar um componente de src/components/ui/ que ainda não vire
// bloco aqui, basta adicionar uma nova entrada nesta lista + o `case`
// correspondente em LessonRenderer.jsx.

import { LANGUAGES } from './highlight';

export const FIELD_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  STRING_LIST: 'stringList',
  OBJECT_LIST: 'objectList',
  DATA_TABLE_ROWS: 'dataTableRows',
  IMAGE: 'image', // imagem: enviar arquivo (se o painel permitir) ou colar o endereço
  LATEX: 'latex', // fórmula (LaTeX) com botões de símbolos e pré-visualização
  BLOCKS: 'blocks', // lista de blocos aninhados (usada pelo bloco "section")
};

export const GROUPS = [
  { id: 'texto', label: 'Texto' },
  { id: 'estrutura', label: 'Estrutura / Listas' },
  { id: 'exatas', label: 'Exatas (Cálculo, Física, Química)' },
  { id: 'programacao', label: 'Programação' },
  { id: 'midia', label: 'Mídia' },
  { id: 'dados', label: 'Dados e Comparações' },
  { id: 'interativo', label: 'Interativo' },
  { id: 'destaque', label: 'Destaques e Citações' },
];

const helpFormatacao = 'Use **texto** para negrito, *texto* para itálico e linhas começando com • para lista.';

export const SECTION_CATALOG = [
  {
    type: 'section',
    label: 'Seção',
    group: 'estrutura',
    icon: '🔖',
    description: 'Agrupa componentes. O nome da seção (faixa cinza no topo do cartão) é só para você se organizar e não aparece para o aluno; o título e os componentes, sim.',
    fields: [
      { key: 'label', label: 'Rótulo (ex: HISTÓRIA)', type: FIELD_TYPES.TEXT },
      { key: 'title', label: 'Título', type: FIELD_TYPES.TEXT },
      { key: 'subtitle', label: 'Subtítulo', type: FIELD_TYPES.TEXT },
      { key: 'children', label: 'Componentes', type: FIELD_TYPES.BLOCKS },
    ],
    defaultData: () => ({ type: 'section', name: '', label: '', title: '', subtitle: '', children: [] }),
  },
  {
    type: 'intro',
    label: 'Bloco com texto',
    group: 'texto',
    icon: '📝',
    description: 'Texto corrido (parágrafos, negrito, itálico e listas). Sem moldura, direto na página.',
    fields: [
      { key: 'text', label: 'Texto de introdução', type: FIELD_TYPES.TEXTAREA, help: helpFormatacao, rows: 5, rich: true },
    ],
    defaultData: () => ({ type: 'intro', text: '' }),
  },
  {
    type: 'heading',
    label: 'Título',
    group: 'texto',
    icon: '🔠',
    description: 'Um título avulso dentro da seção (por exemplo, para separar partes do conteúdo). É diferente do título da seção, que fica no topo dela.',
    fields: [
      { key: 'text', label: 'Texto do título', type: FIELD_TYPES.TEXT },
      {
        key: 'size',
        label: 'Tamanho',
        type: FIELD_TYPES.SELECT,
        options: [
          { value: 'grande', label: 'Grande' },
          { value: 'medio', label: 'Médio' },
          { value: 'pequeno', label: 'Pequeno' },
        ],
      },
      {
        key: 'align',
        label: 'Alinhamento',
        type: FIELD_TYPES.SELECT,
        options: [
          { value: 'esquerda', label: 'Esquerda' },
          { value: 'centro', label: 'Centralizado' },
          { value: 'direita', label: 'Direita' },
        ],
      },
    ],
    defaultData: () => ({ type: 'heading', text: '', size: 'medio', align: 'esquerda' }),
  },
  {
    type: 'image',
    label: 'Imagem com legenda',
    group: 'midia',
    icon: '🖼️',
    description: 'Uma imagem centralizada, com legenda opcional. Amplia ao clicar.',
    fields: [
      { key: 'src', label: 'Imagem', type: FIELD_TYPES.IMAGE, help: 'Envie um arquivo (JPG, PNG, WebP ou GIF) ou cole um link. No site baixado, as imagens vão dentro do .zip.' },
      { key: 'alt', label: 'Texto alternativo (acessibilidade)', type: FIELD_TYPES.TEXT },
      { key: 'caption', label: 'Legenda (opcional)', type: FIELD_TYPES.TEXT },
    ],
    defaultData: () => ({ type: 'image', src: '', alt: '', caption: '' }),
  },
  {
    type: 'video',
    label: 'Vídeo',
    group: 'midia',
    icon: '🎬',
    description: 'Vídeo incorporado do YouTube ou do Google Drive.',
    fields: [
      { key: 'title', label: 'Título do vídeo', type: FIELD_TYPES.TEXT },
      {
        key: 'source',
        label: 'Origem do vídeo',
        type: FIELD_TYPES.SELECT,
        options: [
          { value: 'youtube', label: 'YouTube' },
          { value: 'drive', label: 'Google Drive' },
        ],
      },
      { key: 'videoId', label: 'ID do vídeo no YouTube', type: FIELD_TYPES.TEXT, help: 'A parte final do link, ex: dQw4w9WgXcQ', showIf: { field: 'source', equals: 'youtube' } },
      { key: 'driveId', label: 'ID do arquivo no Google Drive', type: FIELD_TYPES.TEXT, showIf: { field: 'source', equals: 'drive' } },
    ],
    defaultData: () => ({ type: 'video', title: '', source: 'youtube', videoId: '', driveId: '' }),
  },
  {
    type: 'carousel',
    label: 'Carrossel de imagens',
    group: 'midia',
    icon: '🎠',
    description: 'Galeria de imagens navegável, com zoom ao clicar.',
    fields: [
      {
        key: 'images',
        label: 'Imagens',
        type: FIELD_TYPES.OBJECT_LIST,
        addLabel: 'Adicionar imagem',
        itemFields: [
          { key: 'src', label: 'Imagem', type: FIELD_TYPES.IMAGE },
          { key: 'alt', label: 'Texto alternativo', type: FIELD_TYPES.TEXT },
          { key: 'caption', label: 'Legenda (opcional)', type: FIELD_TYPES.TEXT },
        ],
      },
    ],
    defaultData: () => ({ type: 'carousel', images: [] }),
  },
  {
    type: 'dropdown_group',
    label: 'Grupo de acordeões',
    group: 'estrutura',
    icon: '🗂️',
    description: 'Lista de itens que abrem e fecham ao clicar (perguntas, tópicos numerados...).',
    fields: [
      {
        key: 'layout',
        label: 'Disposição',
        type: FIELD_TYPES.SELECT,
        options: [
          { value: 'grid', label: 'Duas colunas (padrão)' },
          { value: 'vertical', label: 'Uma coluna' },
        ],
      },
      {
        key: 'items',
        label: 'Itens do acordeão',
        type: FIELD_TYPES.OBJECT_LIST,
        addLabel: 'Adicionar item',
        itemFields: [
          { key: 'title', label: 'Título do item', type: FIELD_TYPES.TEXT },
          { key: 'content', label: 'Conteúdo', type: FIELD_TYPES.TEXTAREA, help: helpFormatacao, rich: true },
        ],
      },
    ],
    defaultData: () => ({ type: 'dropdown_group', layout: 'grid', items: [] }),
  },
  {
    type: 'bullet_cards',
    label: 'Lista de cards',
    group: 'estrutura',
    icon: '🔷',
    description: 'Lista vertical de cartões em destaque — bom para itens numerados.',
    fields: [
      {
        key: 'items',
        label: 'Itens',
        type: FIELD_TYPES.STRING_LIST,
        itemType: 'textarea',
        rich: true,
        addLabel: 'Adicionar card',
      },
    ],
    defaultData: () => ({ type: 'bullet_cards', items: [''] }),
  },
  {
    type: 'timeline',
    label: 'Linha do tempo',
    group: 'estrutura',
    icon: '📅',
    description: 'Marcos cronológicos (ano + autor) que expandem para mostrar o evento.',
    fields: [
      {
        key: 'items',
        label: 'Marcos',
        type: FIELD_TYPES.OBJECT_LIST,
        addLabel: 'Adicionar marco',
        itemFields: [
          { key: 'ano', label: 'Ano', type: FIELD_TYPES.TEXT },
          { key: 'autor', label: 'Autor / título curto', type: FIELD_TYPES.TEXT },
          { key: 'evento', label: 'Descrição do evento', type: FIELD_TYPES.TEXTAREA },
        ],
      },
    ],
    defaultData: () => ({ type: 'timeline', items: [] }),
  },
  {
    type: 'data_table',
    label: 'Tabela de dados',
    group: 'dados',
    icon: '📊',
    description: 'Tabela com cabeçalho e várias linhas/colunas.',
    fields: [
      { key: 'headers', label: 'Colunas', type: FIELD_TYPES.STRING_LIST, itemType: 'text', addLabel: 'Adicionar coluna' },
      { key: 'rows', label: 'Linhas', type: FIELD_TYPES.DATA_TABLE_ROWS, headersKey: 'headers' },
    ],
    defaultData: () => ({ type: 'data_table', headers: ['Coluna 1', 'Coluna 2'], rows: [['', '']] }),
  },
  {
    type: 'comparison_table',
    label: 'Tabela comparativa',
    group: 'dados',
    icon: '⚖️',
    description: 'Duas colunas lado a lado para comparar conceitos (ex: Presencial x EaD).',
    fields: [
      { key: 'leftHeader', label: 'Título da coluna esquerda', type: FIELD_TYPES.TEXT },
      { key: 'rightHeader', label: 'Título da coluna direita', type: FIELD_TYPES.TEXT },
      {
        key: 'rows',
        label: 'Linhas',
        type: FIELD_TYPES.OBJECT_LIST,
        addLabel: 'Adicionar linha',
        itemFields: [
          { key: 'left', label: 'Coluna esquerda', type: FIELD_TYPES.TEXT },
          { key: 'right', label: 'Coluna direita', type: FIELD_TYPES.TEXT },
        ],
      },
    ],
    defaultData: () => ({ type: 'comparison_table', leftHeader: 'Presencial', rightHeader: 'EaD', rows: [] }),
  },
  {
    type: 'reference_box',
    label: 'Caixa de referência',
    group: 'destaque',
    icon: '📚',
    description: 'Citação com indicação de fonte/autor, em caixa de destaque.',
    fields: [
      { key: 'text', label: 'Texto da citação', type: FIELD_TYPES.TEXTAREA, help: helpFormatacao },
      { key: 'citation', label: 'Fonte / autor', type: FIELD_TYPES.TEXT },
    ],
    defaultData: () => ({ type: 'reference_box', text: '', citation: '' }),
  },
  {
    type: 'conclusion',
    label: 'Citação de destaque',
    group: 'destaque',
    icon: '💬',
    description: 'Citação curta em formato de card — boa para conclusões.',
    fields: [
      { key: 'text', label: 'Texto', type: FIELD_TYPES.TEXTAREA },
      { key: 'author', label: 'Autor (opcional)', type: FIELD_TYPES.TEXT },
    ],
    defaultData: () => ({ type: 'conclusion', text: '', author: '' }),
  },
  {
    type: 'quiz',
    label: 'Quiz interativo',
    group: 'interativo',
    icon: '❓',
    description: 'Perguntas de múltipla escolha com correção automática.',
    fields: [
      {
        key: 'questions',
        label: 'Perguntas',
        type: FIELD_TYPES.OBJECT_LIST,
        addLabel: 'Adicionar pergunta',
        itemFields: [
          { key: 'text', label: 'Pergunta', type: FIELD_TYPES.TEXTAREA },
          { key: 'options', label: 'Alternativas', type: FIELD_TYPES.STRING_LIST, itemType: 'text', addLabel: 'Adicionar alternativa' },
          { key: 'correctAnswer', label: 'Alternativa correta (copie exatamente uma das opções acima)', type: FIELD_TYPES.TEXT },
        ],
      },
    ],
    defaultData: () => ({ type: 'quiz', questions: [] }),
  },
  {
    type: 'cta',
    label: 'Chamada para ação',
    group: 'interativo',
    icon: '👉',
    description: 'Caixa de destaque com uma mensagem e um botão de link.',
    fields: [
      { key: 'message', label: 'Mensagem', type: FIELD_TYPES.TEXTAREA },
      { key: 'buttonLabel', label: 'Texto do botão', type: FIELD_TYPES.TEXT },
      { key: 'href', label: 'Link do botão', type: FIELD_TYPES.TEXT },
    ],
    defaultData: () => ({ type: 'cta', message: '', buttonLabel: '', href: '#' }),
  },
  {
    type: 'access_link',
    label: 'Link de acesso',
    group: 'interativo',
    icon: '🔗',
    description: 'Caixa simples com um ícone de link e um texto clicável.',
    fields: [
      { key: 'label', label: 'Texto do link', type: FIELD_TYPES.TEXT },
      { key: 'href', label: 'Endereço (URL)', type: FIELD_TYPES.TEXT },
    ],
    defaultData: () => ({ type: 'access_link', label: '', href: '' }),
  },
];

// Componentes para disciplinas de exatas. Fórmulas usam LaTeX (com botões de
// símbolos no editor); reações químicas usam \ce{...}; no texto corrido, $...$.
SECTION_CATALOG.push(
  {
    type: 'formula',
    label: 'Fórmula / equação',
    group: 'exatas',
    icon: '∑',
    description: 'Fórmula em destaque, centralizada, com número, legenda e explicação das variáveis ("onde...").',
    fields: [
      { key: 'latex', label: 'Fórmula', type: FIELD_TYPES.LATEX },
      { key: 'number', label: 'Número da equação (opcional, ex: 1)', type: FIELD_TYPES.TEXT },
      { key: 'where', label: 'Onde... (explicação das variáveis, opcional)', type: FIELD_TYPES.TEXTAREA, help: 'Aceita fórmulas no texto entre $ $, ex: $F$ é a força.', rows: 3, rich: true },
      { key: 'caption', label: 'Legenda (opcional)', type: FIELD_TYPES.TEXT },
    ],
    defaultData: () => ({ type: 'formula', latex: '', number: '', where: '', caption: '' }),
  },
  {
    type: 'formula_sheet',
    label: 'Formulário (lista de fórmulas)',
    group: 'exatas',
    icon: '🧮',
    description: 'Cartões lado a lado, cada um com nome, fórmula e observação — ótimo para resumos e consultas rápidas.',
    fields: [
      {
        key: 'columns',
        label: 'Colunas',
        type: FIELD_TYPES.SELECT,
        options: [
          { value: '2', label: '2 colunas (padrão)' },
          { value: '1', label: '1 coluna' },
          { value: '3', label: '3 colunas' },
        ],
      },
      {
        key: 'items',
        label: 'Fórmulas',
        type: FIELD_TYPES.OBJECT_LIST,
        addLabel: 'Adicionar fórmula',
        itemFields: [
          { key: 'name', label: 'Nome (ex: Lei de Ohm)', type: FIELD_TYPES.TEXT },
          { key: 'latex', label: 'Fórmula', type: FIELD_TYPES.LATEX },
          { key: 'note', label: 'Observação (opcional)', type: FIELD_TYPES.TEXT },
        ],
      },
    ],
    defaultData: () => ({ type: 'formula_sheet', columns: '2', items: [{ name: '', latex: '', note: '' }] }),
  },
  {
    type: 'step_by_step',
    label: 'Exercício passo a passo',
    group: 'exatas',
    icon: '🪜',
    description: 'Enunciado e resolução revelada um passo por vez: o aluno tenta primeiro e confere depois.',
    fields: [
      { key: 'statement', label: 'Enunciado', type: FIELD_TYPES.TEXTAREA, help: 'Aceita fórmulas no texto entre $ $.', rows: 3, rich: true },
      {
        key: 'steps',
        label: 'Passos da resolução',
        type: FIELD_TYPES.OBJECT_LIST,
        addLabel: 'Adicionar passo',
        itemFields: [
          { key: 'text', label: 'Explicação do passo', type: FIELD_TYPES.TEXTAREA, rows: 2, rich: true },
          { key: 'latex', label: 'Fórmula do passo (opcional)', type: FIELD_TYPES.LATEX },
        ],
      },
      { key: 'answer', label: 'Resposta final em texto (opcional)', type: FIELD_TYPES.TEXT },
      { key: 'answerLatex', label: 'Resposta final em fórmula (opcional)', type: FIELD_TYPES.LATEX },
    ],
    defaultData: () => ({ type: 'step_by_step', statement: '', steps: [{ text: '', latex: '' }], answer: '', answerLatex: '' }),
  },
  {
    type: 'callout',
    label: 'Destaque (definição, teorema...)',
    group: 'destaque',
    icon: '📌',
    description: 'Caixa para definições, teoremas, demonstrações, exemplos, observações, dicas e avisos.',
    fields: [
      {
        key: 'kind',
        label: 'Tipo',
        type: FIELD_TYPES.SELECT,
        options: [
          { value: 'definicao', label: 'Definição' },
          { value: 'teorema', label: 'Teorema' },
          { value: 'demonstracao', label: 'Demonstração' },
          { value: 'exemplo', label: 'Exemplo' },
          { value: 'observacao', label: 'Observação' },
          { value: 'dica', label: 'Dica' },
          { value: 'atencao', label: 'Atenção' },
        ],
      },
      { key: 'title', label: 'Título (opcional, ex: Teorema de Pitágoras)', type: FIELD_TYPES.TEXT },
      { key: 'text', label: 'Texto', type: FIELD_TYPES.TEXTAREA, help: 'Aceita fórmulas no texto entre $ $.', rows: 4, rich: true },
    ],
    defaultData: () => ({ type: 'callout', kind: 'definicao', title: '', text: '' }),
  },
  {
    type: 'glossary',
    label: 'Glossário',
    group: 'texto',
    icon: '🔤',
    description: 'Lista de termos e definições, em linhas alternadas.',
    fields: [
      {
        key: 'items',
        label: 'Termos',
        type: FIELD_TYPES.OBJECT_LIST,
        addLabel: 'Adicionar termo',
        itemFields: [
          { key: 'term', label: 'Termo', type: FIELD_TYPES.TEXT },
          { key: 'definition', label: 'Definição', type: FIELD_TYPES.TEXTAREA, rows: 2, rich: true },
        ],
      },
    ],
    defaultData: () => ({ type: 'glossary', items: [{ term: '', definition: '' }] }),
  },
);

// Componentes para o ensino de programação.
const LANGUAGE_OPTIONS = LANGUAGES.map((l) => ({ value: l.value, label: l.label }));
const YES_NO = (yes, no) => [{ value: 'sim', label: yes }, { value: 'nao', label: no }];

SECTION_CATALOG.push(
  {
    type: 'code_block',
    label: 'Bloco de código',
    group: 'programacao',
    icon: '💻',
    description: 'Código com cores da linguagem escolhida, números de linha, linhas em destaque, botão copiar e saída esperada. Em JavaScript e HTML o aluno pode executar.',
    fields: [
      { key: 'language', label: 'Linguagem', type: FIELD_TYPES.SELECT, options: LANGUAGE_OPTIONS },
      { key: 'filename', label: 'Nome do arquivo (opcional, ex: main.py)', type: FIELD_TYPES.TEXT },
      { key: 'code', label: 'Código', type: FIELD_TYPES.TEXTAREA, rows: 8, mono: true },
      { key: 'lineNumbers', label: 'Números de linha', type: FIELD_TYPES.SELECT, options: YES_NO('Mostrar', 'Ocultar') },
      { key: 'highlight', label: 'Linhas em destaque (opcional, ex: 2,4-6)', type: FIELD_TYPES.TEXT },
      { key: 'output', label: 'Saída esperada (opcional)', type: FIELD_TYPES.TEXTAREA, rows: 3, mono: true },
      {
        key: 'runnable',
        label: 'Botão "Executar" para o aluno (só JavaScript e HTML)',
        type: FIELD_TYPES.SELECT,
        options: [{ value: 'nao', label: 'Não' }, { value: 'sim', label: 'Sim' }],
      },
      { key: 'caption', label: 'Legenda (opcional)', type: FIELD_TYPES.TEXT },
    ],
    defaultData: () => ({ type: 'code_block', language: 'python', filename: '', code: '', lineNumbers: 'sim', highlight: '', output: '', runnable: 'nao', caption: '' }),
  },
  {
    type: 'code_tabs',
    label: 'Código em várias linguagens',
    group: 'programacao',
    icon: '🗂️',
    description: 'O mesmo exemplo em abas (Python, Java, C...): o aluno escolhe a linguagem que quer ver.',
    fields: [
      {
        key: 'items',
        label: 'Linguagens',
        type: FIELD_TYPES.OBJECT_LIST,
        addLabel: 'Adicionar linguagem',
        itemFields: [
          { key: 'language', label: 'Linguagem', type: FIELD_TYPES.SELECT, options: LANGUAGE_OPTIONS },
          { key: 'code', label: 'Código', type: FIELD_TYPES.TEXTAREA, rows: 6, mono: true },
          { key: 'output', label: 'Saída esperada (opcional)', type: FIELD_TYPES.TEXTAREA, rows: 2, mono: true },
        ],
      },
      { key: 'lineNumbers', label: 'Números de linha', type: FIELD_TYPES.SELECT, options: YES_NO('Mostrar', 'Ocultar') },
      { key: 'caption', label: 'Legenda (opcional)', type: FIELD_TYPES.TEXT },
    ],
    defaultData: () => ({ type: 'code_tabs', lineNumbers: 'sim', caption: '', items: [{ language: 'python', code: '', output: '' }, { language: 'java', code: '', output: '' }] }),
  },
  {
    type: 'code_quiz',
    label: 'Qual é a saída? (quiz de código)',
    group: 'programacao',
    icon: '🧩',
    description: 'Mostra um código e pergunta o que ele faz; o aluno escolhe a alternativa e vê a explicação.',
    fields: [
      { key: 'question', label: 'Pergunta', type: FIELD_TYPES.TEXT },
      { key: 'language', label: 'Linguagem', type: FIELD_TYPES.SELECT, options: LANGUAGE_OPTIONS },
      { key: 'code', label: 'Código', type: FIELD_TYPES.TEXTAREA, rows: 6, mono: true },
      { key: 'options', label: 'Alternativas', type: FIELD_TYPES.STRING_LIST, itemType: 'text', addLabel: 'Adicionar alternativa' },
      { key: 'correct', label: 'Número da alternativa correta (1 = primeira, 2 = segunda...)', type: FIELD_TYPES.TEXT },
      { key: 'explanation', label: 'Explicação (aparece depois de responder)', type: FIELD_TYPES.TEXTAREA, rows: 3, rich: true },
    ],
    defaultData: () => ({ type: 'code_quiz', question: 'O que este código imprime?', language: 'python', code: '', options: ['', '', ''], correct: '1', explanation: '' }),
  },
);

export const getSectionDefinition = (type) => SECTION_CATALOG.find((s) => s.type === type);
