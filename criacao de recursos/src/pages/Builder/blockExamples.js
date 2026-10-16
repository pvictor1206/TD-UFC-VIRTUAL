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
    notes: { text: 'Vira um parágrafo de texto corrido. Use ** ** para destacar palavras.' },
  },
  heading: {
    sample: { type: 'heading', text: 'Exemplo resolvido', size: 'medio', align: 'esquerda' },
    notes: { text: 'O título que aparece entre os componentes.', size: 'Muda o tamanho da letra.', align: 'Posição do título na linha.' },
  },
  section: {
    sample: {
      type: 'section',
      label: 'CASO',
      title: 'A turma que mudou de plataforma',
      subtitle: 'Exemplo fictício',
      children: [
        { type: 'intro', text: 'Em 2020, a professora Ana precisou migrar todas as suas aulas para o ambiente virtual.' },
        { type: 'bullet_cards', items: ['**Desafio:** manter os alunos engajados.', '**Solução:** atividades curtas e interativas.'] },
      ],
    },
    notes: {
      label: 'Etiqueta pequena acima do título.',
      title: 'O título da seção.',
      subtitle: 'Linha discreta abaixo do título.',
      children: 'Os blocos que ficam sob este título.',
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
      layout: 'grid',
      items: [
        { title: '1. O que é transhumanismo?', content: 'Movimento que defende usar a **tecnologia** para superar limites do corpo humano.' },
        { title: '2. Quem são seus críticos?', content: 'Filósofos como Hans Jonas e Donna Haraway.' },
      ],
    },
    notes: {
      layout: 'Duas colunas ou uma coluna.',
      items: 'Cada item é uma "gaveta": o título fica visível e o conteúdo aparece ao clicar.',
    },
  },
  bullet_cards: {
    sample: {
      type: 'bullet_cards',
      items: ['**Compreender** o conceito de EaD.', '**Comparar** modelos presencial e a distância.', '**Aplicar** boas práticas de estudo online.'],
    },
    notes: { items: 'Um card por item. Comece com **negrito** para criar um rótulo.' },
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
      headers: ['Conceito', 'Definição'],
      rows: [['Síncrono', 'Acontece em tempo real'], ['Assíncrono', 'O aluno acessa quando quiser']],
    },
    notes: { headers: 'Nomes das colunas (linha de cabeçalho).', rows: 'Uma célula por coluna, uma linha por vez.' },
  },
  comparison_table: {
    sample: {
      type: 'comparison_table',
      leftHeader: 'Presencial',
      rightHeader: 'EaD',
      rows: [{ left: 'Encontro em horário fixo', right: 'Horário flexível' }, { left: 'Sala de aula', right: 'Ambiente virtual' }],
    },
    notes: { leftHeader: 'Cabeçalho da coluna da esquerda.', rightHeader: 'Cabeçalho da coluna da direita.', rows: 'Cada linha compara o mesmo aspecto dos dois lados.' },
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
  formula: {
    sample: {
      type: 'formula',
      latex: 'x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}',
      number: '1',
      where: '**Onde:** $a$, $b$ e $c$ são os coeficientes da equação $ax^2 + bx + c = 0$.',
      caption: 'Fórmula de Bhaskara',
    },
    notes: {
      latex: 'A fórmula, montada com os botões de símbolos (ou escrita em LaTeX).',
      number: 'Aparece entre parênteses à direita.',
      where: 'Explica o significado das letras; aceita fórmulas entre $ $.',
      caption: 'Texto em itálico embaixo da fórmula.',
    },
  },
  formula_sheet: {
    sample: {
      type: 'formula_sheet',
      columns: '2',
      items: [
        { name: 'Lei de Ohm', latex: 'V = R\\,i', note: 'Tensão = resistência × corrente' },
        { name: 'Velocidade média', latex: 'v = \\frac{\\Delta s}{\\Delta t}', note: 'Variação de posição no tempo' },
        { name: 'Combustão do hidrogênio', latex: '\\ce{2H2 + O2 -> 2H2O}', note: 'Reação balanceada' },
        { name: 'Derivada da potência', latex: '\\frac{d}{dx}x^{n} = nx^{n-1}', note: 'Regra do tombo' },
      ],
    },
    notes: { columns: 'Quantos cartões por linha.', items: 'Um cartão por fórmula: nome, fórmula e observação.' },
  },
  step_by_step: {
    sample: {
      type: 'step_by_step',
      statement: 'Um carro parte do repouso com aceleração $a = 2\\,\\mathrm{m/s^2}$. Qual a velocidade após $t = 5\\,\\mathrm{s}$?',
      steps: [
        { text: 'Identifique a equação da velocidade no MRUV.', latex: 'v = v_{0} + a\\,t' },
        { text: 'Substitua os valores ($v_0 = 0$, pois parte do repouso).', latex: 'v = 0 + 2 \\cdot 5' },
        { text: 'Calcule.', latex: 'v = 10\\,\\mathrm{m/s}' },
      ],
      answer: 'A velocidade após 5 s é de 10 m/s.',
      answerLatex: '',
    },
    notes: {
      statement: 'O enunciado do exercício.',
      steps: 'Cada passo é revelado ao clicar em "Próximo passo".',
      answer: 'Aparece só depois do último passo.',
      answerLatex: 'Alternativa: resposta final como fórmula.',
    },
  },
  callout: {
    sample: {
      type: 'callout',
      kind: 'teorema',
      title: 'Teorema de Pitágoras',
      text: 'Em um triângulo retângulo, $a^2 = b^2 + c^2$, em que $a$ é a hipotenusa.',
    },
    notes: { kind: 'Muda o selo e a cor da caixa.', title: 'Título ao lado do selo.', text: 'Conteúdo da caixa; aceita fórmulas entre $ $.' },
  },
  glossary: {
    sample: {
      type: 'glossary',
      items: [
        { term: 'Derivada', definition: 'Taxa de variação instantânea de uma função.' },
        { term: 'Mol', definition: 'Quantidade de matéria com $6{,}02 \\times 10^{23}$ entidades.' },
      ],
    },
    notes: { items: 'Termo à esquerda e definição à direita, em linhas alternadas.' },
  },
  code_block: {
    sample: {
      type: 'code_block',
      language: 'python',
      filename: 'media.py',
      code: 'notas = [7.5, 8.0, 6.5]\nsoma = 0\nfor n in notas:\n    soma += n\nprint(soma / len(notas))',
      lineNumbers: 'sim',
      highlight: '3-4',
      output: '7.333333333333333',
      runnable: 'nao',
      caption: 'Média de uma lista de notas',
    },
    notes: {
      language: 'Define as cores do código.',
      filename: 'Aparece no topo, ao lado da linguagem.',
      code: 'O código do exemplo.',
      highlight: 'Linhas realçadas (aqui, 3 e 4).',
      output: 'Caixa escura "Saída esperada" abaixo do código.',
      runnable: 'Em JavaScript/HTML, mostra o botão Executar.',
    },
  },
  code_tabs: {
    sample: {
      type: 'code_tabs',
      lineNumbers: 'sim',
      caption: 'O mesmo programa em três linguagens',
      items: [
        { language: 'python', code: 'print("Olá, mundo!")', output: 'Olá, mundo!' },
        { language: 'java', code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Olá, mundo!");\n    }\n}', output: 'Olá, mundo!' },
        { language: 'c', code: '#include <stdio.h>\n\nint main(void) {\n    printf("Olá, mundo!\\n");\n    return 0;\n}', output: 'Olá, mundo!' },
      ],
    },
    notes: { items: 'Cada linguagem vira uma aba; o aluno escolhe qual ver.' },
  },
  code_quiz: {
    sample: {
      type: 'code_quiz',
      question: 'O que este código imprime?',
      language: 'python',
      code: 'x = 3\nfor i in range(3):\n    x += i\nprint(x)',
      options: ['3', '6', '9'],
      correct: '2',
      explanation: 'O laço soma 0, 1 e 2 ao valor inicial 3: 3 + 0 + 1 + 2 = **6**.',
    },
    notes: {
      question: 'A pergunta para o aluno.',
      options: 'As alternativas, na ordem em que aparecem (A, B, C...).',
      correct: 'Número da correta: 2 = segunda alternativa.',
      explanation: 'Aparece depois que o aluno responde.',
    },
  },
};
