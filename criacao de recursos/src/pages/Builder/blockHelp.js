// Textos de ajuda de cada bloco do Construtor (exibidos no popup "?").
// Para cada tipo de bloco (mesmas chaves de sectionCatalog.js):
//   what   – o que o componente é e como aparece para o aluno
//   when   – quando vale a pena usar
//   steps  – passo a passo de preenchimento
//   tips   – dicas e cuidados


export const BLOCK_HELP = {
  intro: {
    what: 'Parágrafo de abertura da aula, em um cartão com uma faixa lateral colorida. Aparece logo abaixo do título e do objetivo.',
    when: 'Use uma única vez, no começo da aula, para contextualizar o tema e motivar a leitura.',
    steps: ['Escreva 1 ou 2 parágrafos curtos no campo "Texto de introdução".', 'Se quiser destacar uma ideia-chave, coloque-a entre ** **.'],
    tips: ['Prefira de 3 a 6 linhas: introduções longas cansam o aluno.', 'Coloque este bloco sempre como o primeiro da lista.'],
  },
  highlight_section: {
    what: 'Cartão branco com um título em destaque e um texto logo abaixo. É o bloco de conteúdo mais versátil.',
    when: 'Use para apresentar um tópico, um conceito ou uma explicação com título próprio.',
    steps: ['Preencha "Título da seção" com o nome do tópico.', 'Escreva o conteúdo em "Texto". Aceita negrito, itálico e listas.'],
    tips: ['Um tópico por bloco; para vários tópicos, adicione vários blocos.', 'Para listas, comece cada linha com •.'],
  },
  story: {
    what: 'Bloco escuro com destaque para narrativas, histórias e exemplos. O rótulo aparece como uma etiqueta acima do título.',
    when: 'Use para contar um caso, uma situação-problema ou um exemplo fictício que ilustre o conteúdo.',
    steps: [
      'Preencha o rótulo (opcional), por exemplo HISTÓRIA ou CASO.',
      'Informe o título e, se precisar, um aviso/subtítulo.',
      'Em "Parágrafos", clique em adicionar e escreva um parágrafo por campo.',
    ],
    tips: ['Cada campo vira um parágrafo separado: não precisa pular linhas.', 'Use o aviso para lembrar que o exemplo é fictício.'],
  },
  image: {
    what: 'Uma imagem centralizada, com legenda opcional. O aluno pode ampliar clicando nela.',
    when: 'Use para esquemas, fotos, gráficos ou capturas de tela que complementam o texto.',
    steps: [
      'Em "Caminho da imagem", cole um link (https://...) ou o nome do arquivo, como imagens/foto1.png.',
      'Descreva a imagem em "Texto alternativo": é ele que leitores de tela leem.',
      'Se quiser, escreva uma legenda.',
    ],
    tips: [
      'Se usar nome de arquivo, coloque a imagem na mesma pasta do index.html do site baixado.',
      'Nunca deixe o texto alternativo em branco: ele garante a acessibilidade.',
    ],
  },
  video: {
    what: 'Vídeo incorporado dentro da página, do YouTube ou do Google Drive.',
    when: 'Use para aulas gravadas, entrevistas ou demonstrações.',
    steps: [
      'Escolha a origem: YouTube ou Google Drive.',
      'YouTube: cole só o ID do vídeo, a parte final do link (em youtube.com/watch?v=ABC123, o ID é ABC123).',
      'Drive: cole o ID do arquivo (no link, a parte entre /d/ e /view).',
      'Dê um título ao vídeo.',
    ],
    tips: ['O vídeo do Drive precisa estar compartilhado como "qualquer pessoa com o link".', 'Teste na pré-visualização antes de baixar o site.'],
  },
  carousel: {
    what: 'Galeria de imagens navegável por setas, com zoom ao clicar.',
    when: 'Use quando houver várias imagens relacionadas, como etapas de um processo ou slides.',
    steps: ['Clique em adicionar para criar uma imagem na galeria.', 'Informe o caminho, o texto alternativo e a legenda (opcional) de cada uma.', 'Use as setas para reordenar.'],
    tips: ['Mantenha as imagens com proporções parecidas.', 'Evite mais de 8 imagens por carrossel.'],
  },
  dropdown_group: {
    what: 'Lista de itens que abrem e fecham ao clicar (acordeão). O aluno só vê o conteúdo do item que abrir.',
    when: 'Use para perguntas frequentes, tópicos numerados ou textos longos que ficam melhor organizados em partes.',
    steps: [
      'Dê um título ao grupo (e um subtítulo, se quiser).',
      'Escolha a disposição: duas colunas ou uma coluna.',
      'Em "Itens do acordeão", adicione um item para cada tópico, com título e conteúdo.',
    ],
    tips: ['Numere os títulos (1., 2., 3.) quando a ordem importar.', 'O conteúdo aceita negrito, itálico e listas.'],
  },
  bullet_cards: {
    what: 'Lista vertical de cartões em destaque, um por item.',
    when: 'Use para listas curtas e importantes: objetivos, etapas, características.',
    steps: ['Dê um título à lista.', 'Em "Itens", adicione um card por campo.', 'Use **negrito** no início de cada item para criar um "rótulo".'],
    tips: ['Escreva itens de tamanho parecido.', 'Para itens longos, prefira o acordeão.'],
  },
  timeline: {
    what: 'Linha do tempo com marcos cronológicos. Cada marco mostra ano e autor e, ao clicar, revela o evento.',
    when: 'Use para história de um tema, evolução de teorias ou sequência de acontecimentos.',
    steps: ['Adicione um marco por evento.', 'Preencha o ano e o autor ou título curto.', 'Descreva o evento no campo de descrição.'],
    tips: ['Ordene do mais antigo para o mais recente.', 'O ano pode ser texto, como "Séc. XIX" ou "1990-2000".'],
  },
  data_table: {
    what: 'Tabela com cabeçalho e várias linhas e colunas.',
    when: 'Use para organizar dados, definições ou qualquer informação que fique mais clara em colunas.',
    steps: ['Dê um título à tabela (opcional).', 'Em "Colunas", defina os nomes das colunas.', 'Em "Linhas", preencha uma célula por coluna e adicione quantas linhas precisar.'],
    tips: ['Se mudar o número de colunas, confira as linhas depois.', 'Mantenha o texto das células curto.'],
  },
  comparison_table: {
    what: 'Duas colunas lado a lado para comparar dois conceitos.',
    when: 'Use para contrastes diretos, como presencial x EaD ou vantagens x desvantagens.',
    steps: ['Informe o título das colunas esquerda e direita.', 'Em "Linhas", escreva em cada linha o item da esquerda e o item correspondente da direita.'],
    tips: ['Cada linha deve comparar o mesmo aspecto dos dois lados.', 'Para mais de dois conceitos, use a tabela de dados.'],
  },
  reference_box: {
    what: 'Citação em caixa de destaque, com a fonte indicada abaixo.',
    when: 'Use para citar um autor, trecho de obra ou definição de um documento oficial.',
    steps: ['Cole o trecho da citação em "Texto da citação".', 'Em "Fonte / autor", indique de quem é e a obra ou o ano.'],
    tips: ['Copie a citação exatamente como no original.', 'Sempre preencha a fonte, para dar o crédito correto.'],
  },
  conclusion: {
    what: 'Citação curta em formato de card, com destaque visual.',
    when: 'Use para fechar um tópico ou a aula com uma frase de efeito ou uma síntese.',
    steps: ['Escreva a frase em "Texto".', 'Se for de alguém, preencha o autor (opcional).'],
    tips: ['Prefira uma ou duas frases.', 'Para citações acadêmicas com referência completa, use a caixa de referência.'],
  },
  quiz: {
    what: 'Perguntas de múltipla escolha com correção automática: o aluno escolhe e vê na hora se acertou.',
    when: 'Use para fixar conteúdo ao final de um tópico ou da aula.',
    steps: [
      'Clique em adicionar pergunta e escreva o enunciado.',
      'Em "Alternativas", adicione as opções de resposta.',
      'Em "Alternativa correta", copie e cole exatamente uma das opções.',
    ],
    tips: [
      'A alternativa correta precisa ser idêntica à opção, letra por letra, ou a correção não funciona.',
      'Use de 3 a 5 alternativas por pergunta.',
      'Confira na pré-visualização se marcou a resposta certa.',
    ],
  },
  cta: {
    what: 'Caixa de destaque com uma mensagem e um botão que leva a um link.',
    when: 'Use para convidar o aluno a uma ação: responder um questionário, acessar um fórum ou baixar um material.',
    steps: ['Escreva a mensagem convidando à ação.', 'Defina o texto do botão (curto e direto).', 'Cole o link completo, começando com https://.'],
    tips: ['Use verbos no botão: "Responder", "Acessar", "Baixar".', 'Teste o link depois de baixar o site.'],
  },
  access_link: {
    what: 'Caixa simples com um ícone de link e um texto clicável.',
    when: 'Use para indicar materiais complementares, leituras ou sites de apoio.',
    steps: ['Escreva o texto do link, dizendo o que o aluno vai encontrar.', 'Cole o endereço completo em "Endereço (URL)".'],
    tips: ['O texto deve fazer sentido sozinho: evite "clique aqui".', 'Use https:// no início do endereço.'],
  },
};
