export const createBlankLesson = () => ({
  aula: '',
  titulo: '',
  objetivo: '',
  sections: [],
});

export const SAMPLE_LESSON = {
  aula: '00',
  titulo: 'Aula de exemplo — todos os blocos disponíveis',
  objetivo: 'Esta aula mostra um exemplo de cada bloco padrão, para servir de referência ao montar uma aula nova.',
  sections: [
    { type: 'intro', text: 'Este é um bloco de **introdução**. Ele aparece logo abaixo do cabeçalho da aula.' },
    { type: 'highlight_section', title: 'Bloco com título', text: 'Um cartão branco com título em destaque e texto abaixo. Aceita **negrito**, *itálico* e:\n• listas com marcadores\n• quando a linha começa com "•"' },
    {
      type: 'dropdown_group',
      title: 'Grupo de acordeões',
      subtitle: 'Clique em cada item para abrir',
      layout: 'grid',
      items: [
        { title: '1. Primeiro item', content: 'Conteúdo do primeiro item, visível ao clicar no título.' },
        { title: '2. Segundo item', content: 'Conteúdo do segundo item.' },
      ],
    },
    {
      type: 'bullet_cards',
      title: 'Lista de cards',
      items: ['**Primeiro card** — descrição do primeiro item.', '**Segundo card** — descrição do segundo item.'],
    },
    { type: 'reference_box', text: 'Uma citação em destaque, com a fonte indicada abaixo.', citation: 'Autor, Ano' },
    { type: 'conclusion', text: 'Uma citação curta em formato de card, boa para fechar um tópico.', author: 'Autor da citação' },
    { type: 'story', label: 'HISTÓRIA', title: 'Título da narrativa', paragraphs: ['Primeiro parágrafo da história.', 'Segundo parágrafo, pode ter quantos forem necessários.'] },
    {
      type: 'data_table',
      title: 'Tabela de exemplo',
      headers: ['Conceito', 'Definição'],
      rows: [['Item 1', 'Explicação do item 1'], ['Item 2', 'Explicação do item 2']],
    },
    {
      type: 'comparison_table',
      title: 'Comparação',
      leftHeader: 'Presencial',
      rightHeader: 'EaD',
      rows: [{ left: 'Encontro fixo', right: 'Flexível' }],
    },
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
    { type: 'cta', message: 'Quer testar seus conhecimentos?', buttonLabel: 'Responder questionário', href: '#' },
    { type: 'access_link', label: 'Acessar material complementar', href: '#' },
  ],
};
