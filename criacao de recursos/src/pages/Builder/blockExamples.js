// Exemplos já preenchidos de cada bloco, usados no popup de ajuda (?).
// `sample` é o conteúdo do bloco (mesmo formato do catálogo) e `notes`
// explica, campo a campo, onde aquele texto aparece para o aluno.

const svg = (bg, fg, label) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'><rect width='800' height='450' fill='${bg}'/><g fill='${fg}' opacity='.9'><rect x='120' y='250' width='90' height='120' rx='8'/><rect x='250' y='190' width='90' height='180' rx='8'/><rect x='380' y='130' width='90' height='240' rx='8'/><rect x='510' y='70' width='90' height='300' rx='8'/></g><text x='400' y='415' text-anchor='middle' font-family='sans-serif' font-size='28' fill='${fg}'>${label}</text></svg>`
  )}`;

export const BLOCK_EXAMPLES = {
  intro: {
    sample: { type: 'intro', text: 'Nesta aula vamos entender como a tecnologia transforma a forma de **aprender** e de ensinar.' },
    notes: { text: 'Vira o parágrafo de abertura, ao lado da faixa colorida. Use ** ** para destacar palavras.' },
  },
  highlight_section: {
    sample: {
      type: 'highlight_section',
      title: 'O que é Educação a Distância?',
      text: 'Modalidade em que professores e alunos interagem **mediados por tecnologia**.\n• Estudo em horários flexíveis\n• Materiais digitais interativos',
    },
    notes: {
      title: 'Aparece grande, no topo do cartão.',
      text: 'Texto do cartão. Linhas que começam com • viram lista.',
    },
  },
  story: {
    sample: {
      type: 'story',
      label: 'CASO',
      title: 'A turma que mudou de plataforma',
      warning: 'Exemplo fictício',
      paragraphs: ['Em 2020, a professora Ana precisou migrar todas as suas aulas para o ambiente virtual.', 'No começo, o desafio foi manter os alunos engajados.'],
    },
    notes: {
      label: 'Etiqueta pequena acima do título.',
      title: 'Título da narrativa.',
      warning: 'Aviso discreto abaixo do título.',
      paragraphs: 'Cada campo vira um parágrafo.',
    },
  },
  image: {
    sample: { type: 'image', src: svg('#EEF2FF', '#3730A3', 'Crescimento por etapa'), alt: 'Gráfico de barras crescente', caption: 'Figura 1 — Evolução ao longo do curso' },
    notes: {
      src: 'O endereço da imagem. Aqui usamos uma imagem de exemplo.',
      alt: 'Não aparece na tela: é lido por leitores de tela (acessibilidade).',
      caption: 'Texto em itálico embaixo da imagem.',
    },
  },
  video: {
    sample: { type: 'video', title: 'Vídeo de apresentação', source: 'youtube', videoId: 'M7lc1UVf-VE', driveId: '' },
    notes: {
      title: 'Faixa de título acima do vídeo.',
      source: 'Escolha onde o vídeo está hospedado.',
      videoId: 'Só o final do link: youtube.com/watch?v=ESTE_CÓDIGO.',
      driveId: 'Trecho do link do Drive entre /d/ e /view.',
    },
  },
  carousel: {
    sample: {
      type: 'carousel',
      images: [
        { src: svg('#FEF3C7', '#92400E', 'Etapa 1'), alt: 'Primeira etapa', caption: 'Etapa 1' },
        { src: svg('#DCFCE7', '#166534', 'Etapa 2'), alt: 'Segunda etapa', caption: 'Etapa 2' },
        { src: svg('#FCE7F3', '#9D174D', 'Etapa 3'), alt: 'Terceira etapa', caption: 'Etapa 3' },
      ],
    },
    notes: { images: 'Cada imagem vira um slide. O aluno navega pelas setas.' },
  },
  dropdown_group: {
    sample: {
      type: 'dropdown_group',
      title: 'Perguntas frequentes',
      subtitle: 'Clique em cada item para abrir',
      layout: 'grid',
      items: [
        { title: '1. O que é transhumanismo?', content: 'Movimento que defende usar a **tecnologia** para superar limites do corpo humano.' },
        { title: '2. Quem são seus críticos?', content: 'Filósofos como Hans Jonas e Donna Haraway.' },
      ],
    },
    notes: {
      title: 'Título acima da lista.',
      subtitle: 'Frase menor logo abaixo do título.',
      layout: 'Duas colunas ou uma coluna.',
      items: 'Cada item é uma "gaveta": o título fica visível e o conteúdo aparece ao clicar.',
    },
  },
  bullet_cards: {
    sample: {
      type: 'bullet_cards',
      title: 'Objetivos da aula',
      items: ['**Compreender** o conceito de EaD.', '**Comparar** modelos presencial e a distância.', '**Aplicar** boas práticas de estudo online.'],
    },
    notes: { title: 'Título acima dos cards.', items: 'Um card por item. Comece com **negrito** para criar um rótulo.' },
  },
  timeline: {
    sample: {
      type: 'timeline',
      items: [
        { ano: '1996', autor: 'LDB', evento: 'A lei reconhece oficialmente a educação a distância no Brasil.' },
        { ano: '2005', autor: 'Decreto 5.622', evento: 'Regulamenta a EaD e define os polos de apoio presencial.' },
      ],
    },
    notes: { items: 'Ano e autor ficam visíveis no marco; a descrição aparece ao clicar nele.' },
  },
  data_table: {
    sample: {
      type: 'data_table',
      title: 'Conceitos-chave',
      headers: ['Conceito', 'Definição'],
      rows: [['Síncrono', 'Acontece em tempo real'], ['Assíncrono', 'O aluno acessa quando quiser']],
    },
    notes: { title: 'Título acima da tabela.', headers: 'Nomes das colunas (linha de cabeçalho).', rows: 'Uma célula por coluna, uma linha por vez.' },
  },
  comparison_table: {
    sample: {
      type: 'comparison_table',
      title: 'Presencial x EaD',
      leftHeader: 'Presencial',
      rightHeader: 'EaD',
      rows: [{ left: 'Encontro em horário fixo', right: 'Horário flexível' }, { left: 'Sala de aula', right: 'Ambiente virtual' }],
    },
    notes: { title: 'Título acima da tabela.', leftHeader: 'Cabeçalho da coluna da esquerda.', rightHeader: 'Cabeçalho da coluna da direita.', rows: 'Cada linha compara o mesmo aspecto dos dois lados.' },
  },
  reference_box: {
    sample: { type: 'reference_box', text: 'A técnica nunca é neutra: ela é histórica e social.', citation: 'Álvaro Vieira Pinto, 2005' },
    notes: { text: 'A citação em destaque.', citation: 'Crédito aparece abaixo, em letra menor.' },
  },
  conclusion: {
    sample: { type: 'conclusion', text: 'Aprender é um ato coletivo.', author: 'Paulo Freire' },
    notes: { text: 'A frase em card de destaque.', author: 'Nome de quem disse (opcional).' },
  },
  quiz: {
    sample: {
      type: 'quiz',
      questions: [
        { text: 'Qual é a capital do Ceará?', options: ['Fortaleza', 'Sobral', 'Juazeiro do Norte'], correctAnswer: 'Fortaleza' },
      ],
    },
    notes: {
      questions: 'Cada pergunta mostra as alternativas para o aluno marcar; a correção é automática.',
    },
  },
  cta: {
    sample: { type: 'cta', message: 'Quer testar o que aprendeu?', buttonLabel: 'Responder questionário', href: '#' },
    notes: { message: 'Frase de chamada, em destaque.', buttonLabel: 'Texto dentro do botão.', href: 'Para onde o botão leva ao ser clicado.' },
  },
  access_link: {
    sample: { type: 'access_link', label: 'Acessar o artigo completo', href: '#' },
    notes: { label: 'Texto clicável da caixa.', href: 'Endereço de destino (começa com https://).' },
  },
};
