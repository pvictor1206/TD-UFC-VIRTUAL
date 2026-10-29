// Textos de ajuda de cada bloco do Construtor (exibidos no popup "?").
// Para cada tipo de bloco (mesmas chaves de sectionCatalog.js):
//   what   – o que o componente é e como aparece para o aluno
//   when   – quando vale a pena usar
//   steps  – passo a passo de preenchimento
//   tips   – dicas e cuidados


export const BLOCK_HELP = {
  intro: {
    what: 'Texto corrido, direto na página e sem moldura. Aceita negrito, itálico e listas.',
    when: 'Use para introduções, explicações e qualquer parágrafo da aula. Para dar um título ao texto, coloque-o em um capítulo com título.',
    steps: ['Escreva o texto no campo e use a barra para negrito, itálico e listas.', 'Se quiser destacar uma ideia-chave, coloque-a entre ** **.'],
    tips: ['Prefira de 3 a 6 linhas: introduções longas cansam o aluno.', 'Coloque este bloco sempre como o primeiro da lista.'],
  },
  heading: {
    what: 'Um título avulso, dentro do capítulo. Serve para separar partes do conteúdo com outro título, além do título do próprio capítulo.',
    when: 'Use quando uma mesma capítulo tiver mais de um assunto (ex.: "Exemplo resolvido" no meio do capítulo) e você quiser um título entre os componentes.',
    steps: ['Escreva o texto do título.', 'Escolha o tamanho (grande, médio ou pequeno) e o alinhamento.', 'Posicione o componente onde o título deve aparecer, entre os outros componentes.'],
    tips: ['Para o título principal do trecho, prefira o campo "Título" do capítulo.', 'Títulos curtos funcionam melhor.'],
  },
  section: {
    what: 'Agrupa componentes em um trecho da aula. O nome do capítulo é só para você se organizar (não aparece para o aluno). O título, o rótulo e o subtítulo são opcionais e, se preenchidos, aparecem acima dos componentes.',
    when: 'Todo componente precisa estar dentro de um capítulo. Use um capítulo para cada tópico da aula; deixe o título em branco quando o conteúdo não precisar de título.',
    steps: [
      'Clique em "+ Adicionar capítulo" (na barra lateral ou no fim da lista).',
      'Dê um nome à capítulo no topo do cartão (só você vê). Se quiser um título para o aluno, preencha o campo "Título exibido ao aluno".',
      'Clique no capítulo para ativá-lo e adicione componentes pela barra lateral, ou pela lista dentro do próprio capítulo.',
      'Use os botões do cartão para mover, duplicar ou excluir o capítulo inteiro.',
    ],
    tips: ['O capítulo com borda destacada é onde os componentes da barra lateral entram.', 'Um capítulo não pode conter outro capítulo.'],
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
      'Escolha a disposição: duas colunas ou uma coluna.',
      'Em "Itens do acordeão", adicione um item para cada tópico, com título e conteúdo.',
    ],
    tips: ['Numere os títulos (1., 2., 3.) quando a ordem importar.', 'O conteúdo aceita negrito, itálico e listas.'],
  },
  bullet_cards: {
    what: 'Lista vertical de cartões em destaque, um por item.',
    when: 'Use para listas curtas e importantes: objetivos, etapas, características.',
    steps: ['Em "Itens", adicione um card por campo.', 'Use **negrito** no início de cada item para criar um "rótulo".'],
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
    steps: ['Em "Colunas", defina os nomes das colunas.', 'Em "Linhas", preencha uma célula por coluna e adicione quantas linhas precisar.'],
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

  formula: {
    what: 'Uma fórmula ou equação em destaque, centralizada, com número, legenda e a explicação das variáveis ("onde...").',
    when: 'Cálculo, Física, Química, Estatística — sempre que uma equação merecer destaque na aula.',
    steps: [
      'Na caixa "Fórmula", clique nos símbolos (frações, raízes, integrais, letras gregas...) ou escreva em LaTeX.',
      'Confira em "Como vai aparecer". Para reações químicas, use a aba Química (ex: \\ce{2H2 + O2 -> 2H2O}).',
      'Opcional: número da equação, "onde..." (explicando as letras) e legenda.',
    ],
    tips: ['No texto corrido, use $x^2$ para uma fórmula na mesma linha e $$x^2$$ para uma fórmula em bloco.', 'Fórmula inválida aparece em vermelho na pré-visualização.'],
  },
  formula_sheet: {
    what: 'Cartões lado a lado, cada um com o nome, a fórmula e uma observação.',
    when: 'Resumos e "formulários" de consulta rápida (ex: fórmulas de cinemática, derivadas básicas, constantes).',
    steps: ['Escolha 1, 2 ou 3 colunas.', 'Adicione uma fórmula por cartão: nome, fórmula e observação opcional.'],
    tips: ['Use 3 colunas para fórmulas curtas e 1 coluna para fórmulas longas.'],
  },
  step_by_step: {
    what: 'Exercício resolvido que o aluno vê um passo por vez, com botões Próximo passo, Mostrar tudo e Reiniciar.',
    when: 'Exemplos resolvidos e exercícios em que o raciocínio importa mais que a resposta.',
    steps: ['Escreva o enunciado.', 'Adicione os passos: explicação e, se quiser, a fórmula daquele passo.', 'Preencha a resposta final (texto ou fórmula).'],
    tips: ['Quebre a resolução em passos curtos: um raciocínio por passo.', 'A resposta só aparece depois do último passo.'],
  },
  callout: {
    what: 'Caixa de destaque com selo do tipo: Definição, Teorema, Demonstração, Exemplo, Observação, Dica ou Atenção (esta em tom quente).',
    when: 'Para separar do texto o que o aluno precisa guardar: definições, enunciados de teoremas, avisos de erros comuns.',
    steps: ['Escolha o tipo.', 'Se quiser, dê um título (ex: Teorema de Pitágoras).', 'Escreva o texto; fórmulas entram entre $ $.'],
    tips: ['Use poucas caixas por capítulo para elas continuarem chamando atenção.'],
  },
  glossary: {
    what: 'Lista de termos com suas definições, em linhas alternadas.',
    when: 'Vocabulário de uma unidade: grandezas, símbolos, conceitos.',
    steps: ['Adicione um termo por vez e escreva a definição.'],
    tips: ['Ordene os termos alfabeticamente com as setas ↑ ↓.'],
  },

  code_block: {
    what: 'Código com as cores da linguagem, números de linha, botão Copiar e, se quiser, a saída esperada e um botão Executar.',
    when: 'Qualquer exemplo de código: trechos, programas completos, comandos de terminal, consultas SQL, HTML/CSS.',
    steps: [
      'Escolha a linguagem (Python, JavaScript, Java, C, C++, SQL, HTML, Terminal e outras).',
      'Cole o código no campo escuro (a tecla Tab insere espaços).',
      'Opcional: nome do arquivo, linhas em destaque (ex: 2,4-6), saída esperada e legenda.',
      'JavaScript e HTML: ative "Executar" para o aluno rodar o código na própria página.',
    ],
    tips: ['Destaque as linhas que você vai comentar no texto.', 'A execução do aluno é isolada: não acessa a página nem o computador dele.'],
  },
  code_tabs: {
    what: 'O mesmo exemplo em abas, uma por linguagem. O aluno escolhe a que quer ver.',
    when: 'Para mostrar o mesmo algoritmo em Python, Java, C... ou comparar sintaxes.',
    steps: ['Para cada aba, escolha a linguagem e cole o código.', 'Use as setas ↑ ↓ para ordenar as abas.'],
    tips: ['Mantenha a mesma lógica em todas as abas, para a comparação ser justa.'],
  },
  code_quiz: {
    what: 'Um código e uma pergunta ("o que este código imprime?"). O aluno escolhe a alternativa e vê se acertou, com a sua explicação.',
    when: 'Para treinar leitura de código, rastreamento de variáveis e depuração.',
    steps: ['Escreva a pergunta e cole o código.', 'Liste as alternativas e informe o número da correta (1, 2, 3...).', 'Explique o porquê no campo de explicação.'],
    tips: ['Use alternativas parecidas: o erro comum do aluno é o melhor distrator.'],
  },
};
