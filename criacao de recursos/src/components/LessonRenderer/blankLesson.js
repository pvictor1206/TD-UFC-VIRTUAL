export const createBlankLesson = () => ({
  aula: '',
  titulo: '',
  objetivo: '',
  cor: '', // cor base da aula (hex); vazio = tema padrão
  sections: [],
});

// Todo componente fica dentro de uma seção; o título da seção é opcional.
export const SAMPLE_LESSON = {
  aula: '00',
  titulo: 'Aula de exemplo — todos os blocos disponíveis',
  objetivo: 'Esta aula mostra um exemplo de cada bloco padrão, para servir de referência ao montar uma aula nova.',
  sections: [
    {
      type: 'section',
      title: 'Introdução',
      children: [
        { type: 'intro', text: 'Este é um **bloco com texto**. Aceita **negrito**, *itálico* e:\n• listas com marcadores\n• quando a linha começa com "•"' },
        { type: 'cta', message: 'Quer testar seus conhecimentos?', buttonLabel: 'Responder questionário', href: '#' },
      ],
    },
    {
      type: 'section',
      title: 'Seção com título',
      subtitle: 'Uma seção agrupa componentes; o título é opcional',
      children: [
        {
          type: 'dropdown_group',
          layout: 'grid',
          items: [
            { title: '1. Primeiro item', content: 'Conteúdo do primeiro item, visível ao clicar no título.' },
            { title: '2. Segundo item', content: 'Conteúdo do segundo item.' },
          ],
        },
        { type: 'bullet_cards', items: ['**Primeiro card** — descrição do primeiro item.', '**Segundo card** — descrição do segundo item.'] },
      ],
    },
    {
      type: 'section',
      children: [
        { type: 'reference_box', text: 'Uma citação em destaque, com a fonte indicada abaixo.', citation: 'Autor, Ano' },
        { type: 'conclusion', text: 'Uma citação curta em formato de card, boa para fechar um tópico.', author: 'Autor da citação' },
      ],
    },
    {
      type: 'section',
      label: 'HISTÓRIA',
      title: 'Título da narrativa',
      children: [
        { type: 'intro', text: 'Primeiro parágrafo da história.' },
        { type: 'intro', text: 'Segundo parágrafo, pode ter quantos forem necessários.' },
      ],
    },
    {
      type: 'section',
      title: 'Tabelas',
      children: [
        {
          type: 'data_table',
          headers: ['Conceito', 'Definição'],
          rows: [['Item 1', 'Explicação do item 1'], ['Item 2', 'Explicação do item 2']],
        },
        {
          type: 'comparison_table',
          leftHeader: 'Presencial',
          rightHeader: 'EaD',
          rows: [{ left: 'Encontro fixo', right: 'Flexível' }],
        },
      ],
    },
    {
      type: 'section',
      title: 'Atividades',
      children: [
        {
          type: 'timeline',
          items: [{ ano: '2020', autor: 'Autor X', evento: 'Descrição do marco histórico.' }],
        },
        {
          type: 'quiz',
          questions: [
            { text: 'Pergunta de exemplo?', options: ['Opção A', 'Opção B', 'Opção C'], correctAnswer: 'Opção B' },
          ],
        },
        { type: 'access_link', label: 'Acessar material complementar', href: '#' },
      ],
    },
  ],
};
