// Catálogo único dos blocos padrão de uma aula.
// Este arquivo é a "fonte da verdade": tanto o Construtor (formulários)
// quanto o LessonRenderer (tela final) leem daqui os tipos de bloco
// disponíveis, seus campos e valores padrão.
//
// Para reaproveitar um componente de src/components/ui/ que ainda não vire
// bloco aqui, basta adicionar uma nova entrada nesta lista + o `case`
// correspondente em LessonRenderer.jsx.

export const FIELD_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  STRING_LIST: 'stringList',
  OBJECT_LIST: 'objectList',
  DATA_TABLE_ROWS: 'dataTableRows',
};

export const GROUPS = [
  { id: 'texto', label: 'Texto' },
  { id: 'estrutura', label: 'Estrutura / Listas' },
  { id: 'midia', label: 'Mídia' },
  { id: 'dados', label: 'Dados e Comparações' },
  { id: 'interativo', label: 'Interativo' },
  { id: 'destaque', label: 'Destaques e Citações' },
];

const helpFormatacao = 'Use **texto** para negrito, *texto* para itálico e linhas começando com • para lista.';

export const SECTION_CATALOG = [
  {
    type: 'intro',
    label: 'Introdução',
    group: 'texto',
    icon: '📝',
    description: 'Parágrafo de abertura da aula, logo abaixo do título.',
    fields: [
      { key: 'text', label: 'Texto de introdução', type: FIELD_TYPES.TEXTAREA, help: helpFormatacao, rows: 5 },
    ],
    defaultData: () => ({ type: 'intro', text: '' }),
  },
  {
    type: 'highlight_section',
    label: 'Bloco com título',
    group: 'texto',
    icon: '📘',
    description: 'Cartão branco com um título em destaque e um texto abaixo.',
    fields: [
      { key: 'title', label: 'Título da seção', type: FIELD_TYPES.TEXT },
      { key: 'text', label: 'Texto', type: FIELD_TYPES.TEXTAREA, help: helpFormatacao, rows: 6 },
    ],
    defaultData: () => ({ type: 'highlight_section', title: '', text: '' }),
  },
  {
    type: 'story',
    label: 'História / narrativa',
    group: 'texto',
    icon: '📖',
    description: 'Bloco escuro para narrativas, histórias e exemplos ficcionais.',
    fields: [
      { key: 'label', label: 'Rótulo (opcional, ex: "HISTÓRIA")', type: FIELD_TYPES.TEXT },
      { key: 'title', label: 'Título', type: FIELD_TYPES.TEXT },
      { key: 'warning', label: 'Aviso/subtítulo (opcional)', type: FIELD_TYPES.TEXT },
      {
        key: 'paragraphs',
        label: 'Parágrafos',
        type: FIELD_TYPES.STRING_LIST,
        itemType: 'textarea',
        addLabel: 'Adicionar parágrafo',
      },
    ],
    defaultData: () => ({ type: 'story', label: '', title: '', warning: '', paragraphs: [''] }),
  },
  {
    type: 'image',
    label: 'Imagem com legenda',
    group: 'midia',
    icon: '🖼️',
    description: 'Uma imagem centralizada, com legenda opcional. Amplia ao clicar.',
    fields: [
      { key: 'src', label: 'Caminho da imagem', type: FIELD_TYPES.TEXT, help: 'Um link (https://...) ou o nome do arquivo que você vai colocar ao lado do index.html, ex: imagens/foto1.png' },
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
          { key: 'src', label: 'Caminho da imagem', type: FIELD_TYPES.TEXT },
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
      { key: 'title', label: 'Título do grupo', type: FIELD_TYPES.TEXT },
      { key: 'subtitle', label: 'Subtítulo (opcional)', type: FIELD_TYPES.TEXT },
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
          { key: 'content', label: 'Conteúdo', type: FIELD_TYPES.TEXTAREA, help: helpFormatacao },
        ],
      },
    ],
    defaultData: () => ({ type: 'dropdown_group', title: '', subtitle: '', layout: 'grid', items: [] }),
  },
  {
    type: 'bullet_cards',
    label: 'Lista de cards',
    group: 'estrutura',
    icon: '🔷',
    description: 'Lista vertical de cartões azuis em destaque — bom para itens numerados.',
    fields: [
      { key: 'title', label: 'Título da lista', type: FIELD_TYPES.TEXT },
      {
        key: 'items',
        label: 'Itens',
        type: FIELD_TYPES.STRING_LIST,
        itemType: 'textarea',
        addLabel: 'Adicionar card',
      },
    ],
    defaultData: () => ({ type: 'bullet_cards', title: '', items: [''] }),
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
      { key: 'title', label: 'Título da tabela (opcional)', type: FIELD_TYPES.TEXT },
      { key: 'headers', label: 'Colunas', type: FIELD_TYPES.STRING_LIST, itemType: 'text', addLabel: 'Adicionar coluna' },
      { key: 'rows', label: 'Linhas', type: FIELD_TYPES.DATA_TABLE_ROWS, headersKey: 'headers' },
    ],
    defaultData: () => ({ type: 'data_table', title: '', headers: ['Coluna 1', 'Coluna 2'], rows: [['', '']] }),
  },
  {
    type: 'comparison_table',
    label: 'Tabela comparativa',
    group: 'dados',
    icon: '⚖️',
    description: 'Duas colunas lado a lado para comparar conceitos (ex: Presencial x EaD).',
    fields: [
      { key: 'title', label: 'Título (opcional)', type: FIELD_TYPES.TEXT },
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
    defaultData: () => ({ type: 'comparison_table', title: '', leftHeader: 'Presencial', rightHeader: 'EaD', rows: [] }),
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

export const getSectionDefinition = (type) => SECTION_CATALOG.find((s) => s.type === type);
