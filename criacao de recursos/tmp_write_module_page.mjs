import fs from 'fs';
const content = `import MainLayout from "../../layout/Sidebar/MainLayout";
import ImageLightbox from "../../ui/ImageLightbox/ImageLightbox";
import MobileBottomBar from "../../Mobile/MobileBottomBar";
import DropdownContent from "../../ui/DropdownContent/DropdownContent";
import ReferenceBoxColor from "../../ui/ReferenceInfoBox/ReferenceBoxColor";
import ReferenceInfoBox from "../../ui/ReferenceInfoBox/ReferenceInfoBox";
import QuoteCard from "../../ui/QuoteCard/QuoteCard";
import { module02Config } from "./Module_02.config";
import imageP4 from "../../../assets/imgs/module-02/carousel-art13/p4.png";

function Module_02_00() {
  const moduleColor = module02Config?.[0]?.color;
  const titleBarColor = module02Config?.[0]?.titleBarColor;

  const introParagraphs = [
    "A Filosofia da Tecnologia é um campo que analisa criticamente o papel da técnica e da tecnologia na vida humana, na cultura e na sociedade.",
    "Ela abrange desde reflexões ontológicas (o que é a técnica?), até éticas (como devemos usá-la?) e políticas (quem controla a tecnologia e para quê?).",
    "O ponto de partida à brasileira - Marilena Chauí, filósofa brasileira, que na minha forma de entender define a filosofia como:",
  ];

  const marilenaValues = [
    "Atividade crítica",
    "Busca de fundamentos",
    "Autonomia do pensamento",
    "Histórico-social",
  ];

  const introClosing = "Ou seja - perguntar criticamente “por quê?” e “para quê?” sobre aquilo que parece natural.";

  const historyStory = [
    "A chuva fina batia no toldo do bar, fazendo um som de fritura distante. Na TV, um jogo qualquer sem som. Na mesa de plástico, duas cervejas, uma quase intacta.",
    "— Ainda acho perda de tempo — disse o sujeito de boné, girando o copo pela borda. — Filosofia. Um monte de gente falando difícil sobre nada. A vida tá aí, não precisa disso.",
    "O filósofo sorriu como quem já tinha ouvido aquilo cem vezes, mas ainda se divertia na centésima primeira.",
    "— Engraçado você dizer que a vida “tá aí” — ele respondeu, ajeitando os óculos. — Você já parou pra pensar quem é que decide o que é “óbvio” na sua vida?",
    "— Óbvio é óbvio, ué. Conta no fim do mês, preço do arroz, ônibus lotado. Isso é realidade. Não precisa de filósofo pra me contar.",
    "— Pois é aí que começa a filosofia — ele inclinou o corpo, aproximando a voz. — Quando a gente desconfia do óbvio.",
    "O sujeito riu.",
    "— Lá vem.",
    "— Pensa assim: por que o ônibus é lotado? Por que o arroz tá caro? Por que você acha normal trabalhar dez horas por dia e ainda sentir que está devendo?",
    "— Porque o mundo é assim, pô. Sistema, política, sei lá. Mas isso todo mundo sabe.",
    "— Todo mundo “sabe” — o filósofo fez aspas no ar — mas quase ninguém pergunta até o fim. A filosofia é essa chatice: não aceita o “é assim mesmo”. Fica cutucando: “por quê?” e “pra quê?”.",
    "O cara virou um gole, pensativo, sem assumir.",
    "— Tá, mas isso qualquer conversa de bar faz.",
    "— Nem sempre. Conversa de bar, muitas vezes, é só opinião jogada, grito mais alto vence. A filosofia não se contenta com opinião. Quer fundamento. Quer razão que não dependa só do seu humor hoje.",
    "Ele pegou uma caneta do bolso e desenhou um círculo no guardanapo.",
    "— Aqui dentro, ó, tá o que você chama de “senso comum”: frases prontas, clichês, o jeito que “todo mundo faz”. Você nasceu aqui dentro. Eu também. A diferença é: você quer ficar aqui pra sempre?",
    "O sujeito franziu a testa.",
    "— Você está dizendo que eu sou manipulado?",
    "— Tô dizendo que, se você nunca questiona, você vive com o pensamento dos outros ocupando sua cabeça como se fosse seu. Filosofia, para Marilena Chauí, é justamente essa atividade crítica: desconfiar do que parece natural. Perguntar de onde veio, a quem serve, o que esconde.",
    "— E isso muda o quê? — ele perguntou, agora um pouco irritado. — Contar de luz continua chegando, irmão.",
    "— Não necessariamente muda a conta. Mas pode mudar quem você aceita que te cobre, como você reage, por que você tolera certas coisas. Pensar não é pagar boleto, mas é decidir que tipo de vida você aceita levar enquanto paga boleto.",
    "Um ônibus passou na rua jogando água na calçada. O bar inteiro olhou por um segundo, depois voltou ao seu ritmo. O filósofo deixou o silêncio pousar, sem pressa.",
    "— Olha em volta — ele continuou. — Esse bar, esse bairro, nesta cidade... nada disso nasceu do nada. Teu jeito de falar, de achar “normal” certas coisas, é resultado de uma história. De lutas, interesses, decisões que você nem viu. A Filosofia lembra isso o tempo todo: a gente pensa dentro de um contexto histórico e social. Não dá pra fingir neutralidade.",
    "— Mas aí vira política — ele rebateu. — E política já enche o saco.",
    "— Vira responsabilidade. Outra coisa. — O filósofo deu de ombros. — Filosofia não é panfleto, é pergunta que incomoda. “Por que tá assim?” e “pra que serve estar assim?”. Serve pra quem?",
    "O sujeito ficou mexendo na espuma da cerveja com o dedo.",
    "— Beleza. Mas ainda não vejo pra que ficar complicando tudo. Eu tenho minhas opiniões, pronto.",
    "— E quem te deu elas? — o filósofo perguntou, direto. — Telejornal? Influenciador? Família? Igreja? Alguma coisa que você leu inteiro ou foi só manchete? Pensar por conta própria dá trabalho. Filosofia é esse treino de autonomia: não ter medo de desmontar a própria opinião pra ver se ela se sustenta.",
    "O outro respirou fundo, como se admitisse internamente que pegou.",
    "— Tá. Mas você também não é totalmente livre, né? Você também foi criado num certo jeito de ver o mundo.",
    "— Claro. Ninguém pensa do zero, como se tivesse nascido hoje numa sala branca. A diferença é que eu sei que tô situado. Sei que a filosofia que eu estudo nasceu em certas épocas, com certos problemas. Isso não invalida; só me obriga a ser honesto. Não finjo que minhas ideias caíram do céu.",
    "O sujeito olhou pro filósofo como quem olha pra um defeito na parede que nunca tinha reparado.",
    "— Então filosofia é o quê, no fim das contas? — perguntou, já sem deboche. — Ficar perguntando?",
    "O filósofo sorriu, mas dessa vez sem ironia.",
    "— Filosofia é não deixar a vida virar piloto automático. É perguntar criticamente “por quê?” e “pra quê?” em cima do que todo mundo já cansou de aceitar. É não se contentar com “é assim”.",
    "Ele empurrou a própria cerveja, quase intacta, para o centro da mesa.",
    "— Por exemplo: por que você tá bebendo hoje?",
    "O sujeito deu uma risada curta.",
    "— Aí é fácil. Porque o dia foi uma merda.",
    "— E pra quê você tá bebendo?",
    "Ele parou. A resposta não veio tão rápido.",
    "— Sei lá... pra esquecer um pouco.",
    "— E funciona? — o filósofo perguntou, sem julgamento.",
    "Mais silêncio. Lá fora, a chuva engrossava.",
    "— Nem sempre.",
    "— Pois é. — O filósofo apoiou os cotovelos na mesa. — A filosofia começa exatamente aqui: quando a resposta automática não dá conta. Quando você percebe que o “óbvio” que você usava pra se explicar já não basta.",
    "O sujeito olhou para a garrafa, como se ela tivesse acabado de revelá-lo.",
    "— Tá me dizendo que eu virei objeto de estudo?",
    "— Tô te dizendo que você virou sujeito de pensamento — ele corrigiu. — A diferença é grande.",
    "Ficaram um tempo sem falar, acompanhando o pingar do toldo.",
    "— E se eu decidir que mesmo assim não gosto de filosofia? — o outro perguntou, por fim.",
    "— Direito seu — o filósofo respondeu, levantando-se devagar. — Mas, a partir de agora, você vai ter que dar um pouco mais de trabalho para si mesmo para continuar dizendo isso.",
    "Ele deixou o dinheiro debaixo do cinzeiro, fez um aceno breve e foi saindo. O sujeito ficou sozinho com a cerveja, a chuva e uma pergunta que não tinha feito antes: “Por que, mesmo, eu tinha tanta certeza de que filosofia não servia pra nada?”.",
  ];

  const techQuotes = [
    { quote: "O celular é assim porque a técnica evolui.", author: "Thais Gomes" },
    { quote: "As redes sociais são neutras, depende de como usamos.", author: "Thais Gomes" },
    { quote: "IA é só mais uma ferramenta.", author: "Thais Gomes" },
  ];

  const techQuestions = [
    { quote: "Por que aceitamos certas tecnologias e rejeitamos outras?", author: "Thais Gomes" },
    { quote: "Quem decide quais tecnologias serão produzidas?", author: "Thais Gomes" },
    { quote: "A quem serve a inovação?", author: "Thais Gomes" },
    { quote: "Quais valores estão embutidos em um artefato?", author: "Thais Gomes" },
  ];

  const naturalizationParagraphs = [
    "Grandes empresários e corporações financiam pesquisas e contratam especialistas para criar novos artefatos técnicos (apps, algoritmos, dispositivos, biotecnologias etc). MAS VOCÊ PESQUISA O QUE EU QUERO!",
    "Esses artefatos não são neutros: carregam interesses econômicos, políticos e culturais. LEMBRAR DE SEMPRE PERGUNTAR - “CARREGAM PARA QUEM?",
    "Para garantir sua aceitação, o discurso empresarial busca apresentá-los como naturais e inevitáveis:",
  ];

  const naturalizationQuotes = [
    "O futuro é digital.",
    "Não há como parar a IA.",
    "Todo mundo vai usar isso. TIPO: VAI ACONTECER ASSIM MESMO!",
  ];

  const philosophyPower = ["Heidegger", "Ellul", "Simondon", "Vieira Pinto"];

  const philosophyPowerParagraphs = [
    "Assim, Filosofia da Tecnologia pode servir como antídoto ao discurso que tenta impor a tecnologia como inevitável.",
    "Aplicada à tecnologia: … a filosofia revela que o celular, o algoritmo, a plataforma não são naturais, mas frutos de escolhas humanas situadas em contextos de poder.",
  ];

  const cafeteriaStory = [
    "O vidro do café dava direto pra avenida: ônibus cuspindo fumaça, anúncios de operadora piscando em telões, gente atravessando no vermelho como se o asfalto tivesse vencido qualquer noção de medo.",
    "Ana mexia o café pela terceira vez, mesmo já sem açúcar pra dissolver.",
    "— Então você é a filósofa que veio ver os nossos ‘produtos de ponta’? — perguntou o homem à frente dela, sorrindo com o tipo de confiança que costuma custar caro. — Terno justo, relógio que brilhava mais do que a luz do teto. — Henrique. CEO da NEXA Mobile.",
    "— ‘Produtos de ponta’ é um bom nome para a prótese de ‘final de fio do cabelo’ — ela murmurou, quase sem querer. — Mas pode ser só Ana, tudo bem.",
    "Ele riu, achando que era piada.",
    "— O que achou do nosso novo modelo? Câmera tripla, IA integrada, tela infinita... — Ele girou o celular entre os dedos, orgulhoso, como quem exibe um troféu. — Estamos levando tecnologia de primeiro mundo pra palma da mão do povo.",
    "Ana observou o aparelho por um segundo. Brilhava como se não tivesse sido montado por ninguém com tendinite.",
    "— Posso ser sincera? — perguntou.",
    "— É pra isso que te chamamos, não é? — respondeu Henrique, ainda confiante. — Uma ‘visão crítica’. O pessoal do marketing adora esse termo.",
    "Ela respirou fundo. A cidade vibrava lá fora, buzinas e sirenes atravessando o vidro como se a rua fosse um organismo vivo.",
    "— O que você chama de tecnologia aqui — apontou pro celular — é só o artefato final. O objeto. A coisa. Bonita, sedutora, cara. Mas tecnologia não é isso.",
    "Henrique arqueou a sobrancelha.",
    "— Agora você me deixou curioso. E o que seria, então?",
    "— Tecnologia é o logos da técnica — ela respondeu, quase como quem recita, mas com voz baixa. — Não é o gadget em si, é o saber organizado sobre o fazer humano. Não é o gadget, é o sistema de trabalho, de conhecimento, de decisões que tornam esse gadget possível... e necessário.",
    "Ele girou o celular mais devagar.",
    "— Isso parece ótimo em palestras. Mas aqui eu preciso vender. Eu invisto, arrisco, gero emprego. No fim do dia, tecnologia é o que está na mão das pessoas.",
    "— Não — ela negou, com calma. — No fim do dia, o que está na mão das pessoas é o resultado de uma história. De relações de poder, de dependência, de trabalho invisível. O Vieira Pinto dizia: não existe tecnologia fora da sociedade que a produziu. Nem fora da divisão entre quem manda e quem só apertou o parafuso.",
    "Henrique olhou pela janela por um instante. Um motoboy parou no sinal bem em frente, enroscado num casaco barato da própria NEXA, logo enorme nas costas.",
    "— A gente gera emprego — ele repetiu, quase para si mesmo. — Parafuso também paga aluguel.",
    "— Paga — concordou Ana. — Mas a questão não é só gerar emprego. É: quem controla a tecnologia que vocês chamam de ‘de ponta’? Pra quem ela serve? Ela liberta ou aperta mais um pouco a coleira?",
    "Ele recostou na cadeira, pousando o celular sobre a mesa, a tela virada pra cima como um olho.",
    "— Você acha que um smartphone oprime alguém? — perguntou, com um sorriso meio impaciente. — As pessoas querem isso. Faz fila para o lançamento. Ninguém está sendo obrigado.",
    "Ana apoiou os cotovelos na mesa, inclinando-se, como se quisesse falar com o aparelho também.",
    "— Não é magia, Henrique. É projeto. Vocês desenham o desejo. Cada notificação, cada atualização ‘obrigatória’, cada obsolescência ‘acidental’... tudo isso organiza a vida de modo que pareça natural trocar de aparelho a cada dois anos. Parecia inevitável ficar rastreável 24 horas.",
    "— Isso é paranoia — ele rebateu. — É o custo de estar conectado. Todo mundo sabe disso.",
    "— Todo mundo “sabe” — ela devolveu, fazendo aspas no ar — mas quase ninguém pensa até o fim. Tecnicamente, seus aparelhos são neutros: manda mensagem, tira foto, faz conta, tanto faz. Moralmente, não. Quem decide o uso, as condições de uso, as dependências... são os humanos. E, curiosamente, sempre os mesmos humanos.",
    "Henrique tamborilou os dedos na mesa, ritmado. Do lado de fora, um outdoor gigante da NEXA erguia um slogan em letras brancas: ‘SEJA VOCÊ MESMO EM 8K’.",
    "— Você está me dizendo que eu sou o vilão? — perguntou, meio em tom de deboche, meio em teste.",
    "— Tô dizendo que você é responsável — Ana respondeu, sem hesitar. — E que o discurso da ‘era tecnológica’, esse em que tudo parece milagre da máquina, esconde o fato de que a tecnologia é um poder humano. De um grupo humano sobre outros.",
    "Ele suspirou, pegando de novo o celular, como se precisasse de apoio.",
    "— E o que você queria que eu fizesse? — perguntou. — Parar de produzir? Voltar pro tijolo e barro? O Brasil já é atrasado demais. A gente traz o melhor hardware, o melhor software, importamos know-how. Você queria o quê, autarquia digital?",
    "Ana deu um sorriso de canto.",
    "— Atrasado pra quem? Medido por qual régua? — Ela apontou pra rua. — O Vieira Pinto batia muito na tecla do subdesenvolvimento: não como ‘falta de tecnologia’, mas como relação de dependência. A periferia importa a técnica, importa o discurso sobre ela, importa os manuais. E se convence de que pensar por conta própria não é com ela.",
    "— E você acha que um país como o nosso tem condições de disputar com um Vale do Silício da vida? — ele retrucou. — Sem parceria, sem importação, sem investimento estrangeiro?",
    "— Eu acho que a gente tem condições de não só montar peça e rezar por investimento — respondeu. — Tecnologia também é autoprodução. É o povo se fazendo a si mesmo, criando seus modos de viver, de se comunicar, de resolver problemas. Quando vocês só vendem o aparelho e o pacote de dependências junto, vocês atrofiam esse poder.",
    "Henrique a encarou por alguns segundos. Na tela do celular, uma notificação de e-mail acendeu. Ele apagou com o polegar, quase irritado.",
    "— Você fala bonito — ele disse, por fim. — Mas continua abstrato. No mundo real, eu tenho fábrica, funcionário, imposto, acionista. Se eu não lanço modelo novo, perco mercado. Se não adicionar o recurso ‘inteligente’, sou engolido. O jogo é esse.",
    "— O jogo é esse — ela concordou. — Mas quem disse que ele foi escrito na pedra? Filosofia serve justamente pra isso: olhar pra regra que todo mundo acha natural e perguntar ‘por quê?’ e ‘pra quê?’. Pra quem é bom que o jogo seja desse jeito?",
    "Ele ficou em silêncio. Do lado de fora, começou uma leve garoa, borrando as luzes da avenida num brilho tremido, quase líquido.",
    "— Você fala de responsabilidade — murmurou Henrique. — Mas, no fundo, o que você quer é que a tecnologia mude o mundo a partir de uma consciência que... — ele fez uma pausa, procurando a palavra — que talvez ninguém queira ter.",
    "Ana deu uma risada breve.",
    "— Não espero que um smartphone faça revolução. Só espero que quem fabrica pare de fingir que é neutro. Você poderia, por exemplo, projetar aparelhos que durem mais de verdade. Abrir mais o sistema pro usuário ter controle. Ensinar junto com o produto como ele é feito, de onde vêm os minerais, quem montou. Isso já seria tecnologia como autoprodução, não só consumo.",
    "Henrique franziu a testa.",
    "— E isso vende?",
    "— Talvez não tanto quanto uma câmera nova todo ano — ela admitiu. — Mas talvez crie outra coisa. Outro tipo de relação. Outro tipo de país.",
    "O barista chamou o nome de alguém, o vapor da máquina de expresso subiu em nuvens pequenas, cheias de cheiro de café queimando.",
    "Henrique olhou de novo o celular. Por um segundo, pareceu mais pesado do que antes.",
    "— Você sabe que, se eu levar isso pro conselho, vão rir de mim — ele disse.",
    "— Eu sei — respondeu Ana. — Mas, quando o mundo der problema — e ele sempre dá — alguém vai perguntar “quem desenhou esse caminho?”. E, lá no fundo, você vai saber se teve escolha ou se só deixou o piloto automático da “era tecnológica” decidir por você.",
    "Ele girou o aparelho uma última vez e o guardou no bolso.",
    "— E se, um dia, eu quiser pensar esse tal “logos da técnica” de um jeito diferente... você toparia conversar com a equipe? — perguntou, sem encarar diretamente.",
    "— Topo — Ana respondeu. — Desde que não seja só pra colocar ‘filosofia da tecnologia’ num slide bonito.",
    "Henrique riu, desta vez sem tanta defesa.",
    "— Sem slide bonito — prometeu. — Só café forte e planilhas feias.",
    "Ela se levantou, ajeitando a mochila no ombro.",
    "— Planilha feia também é tecnologia — disse, caminhando em direção à porta. — A diferença é: ou ela só mede o quanto a gente vende, ou começa a medir também o quanto a gente se vendeu.",
    "Quando Ana saiu, a ‘garoa’ virou chuva de verdade. Henrique ficou olhando o vidro embaçar, com a sensação estranha de que, pela primeira vez, o brilho do outdoor da NEXA lá fora parecia um pouco mais fraco do que antes.",
  ];

  const thinkers = [
    {
      name: "Martin Heidegger",
      work: "A questão da técnica (1954)",
      description: "Vê a técnica moderna como um modo de revelação (Gestell), que reduz o mundo a recurso disponível.",
    },
    {
      name: "José Ortega y Gasset",
      work: "Meditação da Técnica (1939)",
      description: "Defende que a técnica é parte essencial da condição humana, não mero instrumento.",
    },
    {
      name: "Lewis Mumford",
      work: "Técnica e Civilização (1934)",
      description: "Analisa a evolução técnica e seu impacto social, distinguindo entre “técnicas autoritárias” e “democráticas”.",
    },
    {
      name: "Jacques Ellul",
      work: "A técnica ou o desafio do século (1954)",
      description: "Argumenta que a técnica se desenvolve de forma autônoma, independente da moral ou da política.",
    },
    {
      name: "Gilbert Simondon",
      work: "Du mode d’existence des objets techniques (1958)",
      description: "Pensa a técnica como individuação, valorizando o conhecimento dos objetos técnicos em si.",
    },
    {
      name: "Herbert Marcuse",
      work: "O homem unidimensional (1964)",
      description: "Crítica à racionalidade tecnológica como forma de dominação social.",
    },
    {
      name: "Andrew Feenberg",
      work: "Filósofo contemporâneo",
      description: "Defende a democratização das decisões tecnológicas a partir da tradição da Escola de Frankfurt.",
    },
    {
      name: "Langdon Winner",
      work: "A baleia e o reator (1986)",
      description: "Discute como artefatos técnicos embutem valores políticos e sociais.",
    },
    {
      name: "Don Ihde",
      work: "Technology and the Life World",
      description: "Filosofia da tecnologia fenomenológica, com foco na mediação entre humanos e mundo.",
    },
    {
      name: "Bruno Latour",
      work: "Teoria Ator-Rede",
      description: "Dissolve a separação rígida entre técnica, ciência e sociedade, mostrando redes híbridas de humanos e não-humanos.",
    },
    {
      name: "Peter-Paul Verbeek",
      work: "Tecnologias mediadoras",
      description: "Trabalha a ética da mediação e a influência dos artefatos técnicos na experiência humana.",
    },
    {
      name: "Byung-Chul Han",
      work: "Sociedade digital e controle",
      description: "Embora mais focado em filosofia social e cultural, suas análises sobre sociedade digital e tecnologia do controle são muito influentes.",
    },
  ];

  const thinkerCategories = [
    {
      title: "Ontológica",
      items: ["Heidegger", "Simondon"],
    },
    {
      title: "Sociotécnica",
      items: ["Mumford", "Ellul", "Latour", "Winner"],
    },
    {
      title: "Crítica / Política",
      items: ["Marcuse", "Feenberg"],
    },
    {
      title: "Fenomenológica / Existencial",
      items: ["Ihde", "Verbeek"],
    },
    {
      title: "Contemporânea e cultural",
      items: ["Byung-Chul Han", "Bernard Stiegler"],
    },
  ];

  const vieiraPinto = [
    "Pioneirismo no Sul Global: Diferente de Heidegger, Ellul ou Simondon, Vieira Pinto partiu da realidade latino-americana, relacionando tecnologia com colonialismo, dependência econômica e emancipação nacional.",
    "Tecnologia como prática social: Para ele, a tecnologia não é neutra nem autônoma: é produzida em contextos históricos concretos e serve a interesses de classe.",
    "Visão crítica e libertadora: Enfatizou que a apropriação criativa e crítica da técnica é condição para a autonomia dos povos periféricos.",
    "Obra principal: O Conceito de Tecnologia (escrito nos anos 1970, mas publicado em 2005), considerado um dos maiores tratados filosóficos sobre tecnologia já produzidos na América Latina.",
  ];

  const comparative = [
    {
      title: "Martin Heidegger (1889–1976)",
      work: "A questão da técnica (1954)",
      thesis: "A técnica moderna não é só ferramenta, mas um modo de revelação (Gestell) que transforma o mundo em recurso disponível (Bestand).",
      force: "Perspectiva ontológica profunda: mostra como a técnica molda a maneira como o ser humano compreende o ser.",
      limit: "Abordagem abstrata, pouco atenta às condições sociais, políticas e históricas da tecnologia.",
    },
    {
      title: "Jacques Ellul (1912–1994)",
      work: "A técnica ou o desafio do século (1954)",
      thesis: "A técnica possui autonomia: evolui segundo sua própria lógica interna, independente da moral ou da política.",
      force: "Alertou cedo para o “determinismo tecnológico”.",
      limit: "Pessimismo excessivo → reduz a ação humana, política e social diante da técnica.",
    },
    {
      title: "Gilbert Simondon (1924–1989)",
      work: "Du mode d’existence des objets techniques (1958)",
      thesis: "Os objetos técnicos têm sua própria dinâmica de individuação. Para compreendê-los, é preciso integrá-los na cultura.",
      force: "Valorização do conhecimento técnico em si, ponte entre filosofia e engenharia.",
      limit: "Não aprofunda os condicionamentos político-econômicos da produção técnica.",
    },
    {
      title: "Álvaro Vieira Pinto (1909–1987, Brasil)",
      work: "Consciência e Realidade Nacional (1960) / O Conceito de Tecnologia (escrito nos anos 1970, publicado em 2005)",
      thesis: "A tecnologia é produção social e histórica, ligada à luta pela independência e ao desenvolvimento nacional.",
      force: "Pioneiro no Sul Global: formula uma filosofia da tecnologia desde a periferia do capitalismo.",
      limit: "Menos conhecido internacionalmente; muitas obras só publicadas postumamente.",
    },
  ];

  const relevancePoints = [
    "Despolitização: a ideia de “inevitável” retira a tecnologia do debate público.",
    "Consumo acrítico: se é natural, resta apenas consumir.",
    "Controle social: tecnologias de vigilância, por exemplo, são aceitas sem questionamento.",
    "Reprodução da desigualdade: quem tem poder de decidir sobre a técnica legitima sua própria autoridade.",
  ];

  const morePoints = [
    "Desmontar o discurso da inevitabilidade.",
    "Recolocar a técnica no campo da escolha coletiva e democrática.",
    "Mostrar que toda tecnologia é decidida, financiada e projetada – logo, poderia ser diferente.",
    "Filosofar é “perguntar o que parece óbvio”, e no caso da técnica, o óbvio é justamente sua suposta naturalidade. (inspirado em Chauí).",
  ];

  return (
    <MainLayout modules={module02Config}>
      <div className="pr-8 pt-[40px]">
        <h1 className="text-left font-semibold text-[20px] md:text-[25px]">
          FILOSOFIA DA TECNOLOGIA EaD - Aula 01
        </h1>
        <div
          className="h-2 rounded-b-lg mt-1 w-[calc(52vw-var(--content-left)-32px)] md:w-[calc(32vw-var(--content-left)-32px)]"
          style={{ backgroundColor: titleBarColor }}
        />
      </div>

      <div className="lg:pr-[18%] lg:pl-[170px]">
        <section className="pt-[30px]">
          <h2 className="text-left font-semibold text-[20px] py-[25px] md:py-[40px]">
            A Filosofia da Tecnologia
          </h2>
          {introParagraphs.map((paragraph, index) => (
            <p key={index} className="text-[16px] leading-relaxed mb-4 text-justify">
              {paragraph}
            </p>
          ))}

          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <ul className="list-disc list-inside space-y-2 text-[16px] leading-relaxed">
              {marilenaValues.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>

          <ReferenceBoxColor
            quote={introClosing}
            bgColor="#EEF6FF"
            borderColor="#4F8ED5"
            textColor="#0F2A44"
            fontSizeMobile="15px"
            fontSizeDesktop="17px"
          />
        </section>

        <section className="pt-[30px]">
          <h2 className="text-left font-semibold text-[20px] py-[25px] md:py-[40px]">
            HISTORINHA DE FILOSOFIAS
          </h2>
          <h3 className="text-left font-semibold text-[18px] mb-5">
            O BUTECO, O CARA E O OUTRO CARA.
          </h3>
          {historyStory.map((paragraph, index) => (
            <p key={index} className="text-[16px] leading-relaxed mb-4 text-justify">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="pt-[30px]">
          <h2 className="text-left font-semibold text-[20px] py-[25px] md:py-[40px]">
            E quanto a Filosofia da Tecnologia:
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {techQuotes.map((item) => (
              <QuoteCard key={item.quote} quote={item.quote} author={item.author} />
            ))}
          </div>

          <p className="mt-8 text-[16px] leading-relaxed text-justify">
            A filosofia da tecnologia, inspirado no espírito de Chauí, nos faz estranhar o familiar:
          </p>

          <div className="grid gap-4 mt-6 md:grid-cols-2">
            {techQuestions.map((item) => (
              <QuoteCard key={item.quote} quote={item.quote} author={item.author} />
            ))}
          </div>

          <p className="mt-8 text-[16px] leading-relaxed text-justify">
            Um dos “nervos” centrais da Filosofia da Tecnologia: a naturalização da técnica como estratégia de poder.
          </p>

          <div className="mt-6">
            <DropdownContent
              title="Conteúdo em definição"
              text=""
              bgColor="#F8F0FF"
              hoverBgColor="#F0E3FF"
              borderColor="#D8C1FF"
              titleTextColor="#3B1673"
              contentTextColor="#3B1673"
              iconColor="#3B1673"
            />
          </div>
        </section>

        <section className="pt-[30px]">
          <h2 className="text-left font-semibold text-[20px] py-[25px] md:py-[40px]">
            A ideia central: naturalização da tecnologia
          </h2>
          {naturalizationParagraphs.map((paragraph, index) => (
            <p key={index} className="text-[16px] leading-relaxed mb-4 text-justify">
              {paragraph}
            </p>
          ))}

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 mb-6">
            {naturalizationQuotes.map((quote, index) => (
              <p key={index} className="text-[16px] leading-relaxed mb-3">
                “{quote}”
              </p>
            ))}
          </div>

          <p className="text-[16px] leading-relaxed mb-4 text-justify">
            Resultado: as pessoas deixam de ver que haviam outras possibilidades de design, outras escolhas de uso, outras políticas possíveis.
          </p>
        </section>

        <section className="pt-[30px]">
          <h2 className="text-left font-semibold text-[20px] py-[25px] md:py-[40px]">
            A Filosofia da Tecnologia como antídoto
          </h2>

          <div className="grid gap-3 md:grid-cols-2 mb-6">
            {philosophyPower.map((item) => (
              <div key={item} className="rounded-3xl bg-[#F4ECFF] p-6 shadow-sm border border-[#D9C4FF]">
                <p className="font-semibold text-[16px]">{item}</p>
              </div>
            ))}
          </div>

          {philosophyPowerParagraphs.map((paragraph, index) => (
            <p key={index} className="text-[16px] leading-relaxed mb-4 text-justify">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="pt-[30px]">
          <h2 className="text-left font-semibold text-[20px] py-[25px] md:py-[40px]">
            HISTORINHA DE FILOSOFIAS
          </h2>
          <h3 className="text-left font-semibold text-[18px] mb-5">
            CAFETERIA, CHUVA E “SMARTPHONE”.
          </h3>
          {cafeteriaStory.map((paragraph, index) => (
            <p key={index} className="text-[16px] leading-relaxed mb-4 text-justify">
              {paragraph}
            </p>
          ))}

          <ReferenceInfoBox
            id="ref-logos-da-tecnica"
            quote="Tecnologia é o logos da técnica — não é o gadget em si, é o saber organizado sobre o fazer humano."
            reference="Fonte: Aula 01 — Filosofia da Tecnologia"
            targetId="ref-logos-da-tecnica"
            bgColor="#EFF6FF"
            borderColor="#4F8ED5"
            quoteTextColor="#0F2A44"
            refTextColor="#0F4C81"
            quoteFontSizeMobile="15px"
            quoteFontSizeDesktop="17px"
            refFontSizeMobile="13px"
            refFontSizeDesktop="14px"
          />

          <div className="my-8">
            <ImageLightbox
              src={imageP4}
              alt="Placeholder da Aula 01"
              caption="Placeholder para Aula 01"
            />
            <p className="mt-3 text-sm text-slate-500">
              Imagem ilustrativa: [src\\assets\\imgs\\module-02\\carousel-art13\\p4.png]
            </p>
          </div>
        </section>

        <section className="pt-[30px]">
          <h2 className="text-left font-semibold text-[20px] py-[25px] md:py-[40px]">
            Vamos conhecer ALGUNS destes pensadores acadêmicos da Filosofia da Tecnologia
          </h2>
          <div className="grid gap-4">
            {thinkers.map((thinker) => (
              <div key={thinker.name} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-[17px] mb-2">{thinker.name}</h3>
                <p className="text-[15px] font-medium text-slate-600 mb-2">{thinker.work}</p>
                <p className="text-[15px] leading-relaxed text-justify">{thinker.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {thinkerCategories.map((category) => (
              <div key={category.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold mb-2">{category.title}</p>
                <p className="text-[15px] leading-relaxed">{category.items.join(", ")}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
            <p className="font-semibold mb-3">Publicações mais importantes na minha visão, ok?!</p>
            <div className="flex flex-wrap gap-2">
              {['Início do século XX', 'Meados do século XX', 'Anos 1960–1980', 'Anos 1990–2000', 'Século XXI'].map((label) => (
                <span key={label} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{label}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="pt-[30px] pb-[120px]">
          <h2 className="text-left font-semibold text-[20px] py-[25px] md:py-[40px]">
            A importância de Álvaro Vieira Pinto
          </h2>
          {vieiraPinto.map((paragraph, index) => (
            <p key={index} className="text-[16px] leading-relaxed mb-4 text-justify">{paragraph}</p>
          ))}

          <div className="mt-8 space-y-6">
            {comparative.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="font-semibold text-[17px] mb-3">{item.title}</h3>
                <p className="mb-2 text-[15px] text-slate-700">{item.work}</p>
                <p className="mb-2 text-[15px] leading-relaxed">Tese central: {item.thesis}</p>
                <p className="text-[15px] leading-relaxed"><span className="font-semibold">Força:</span> {item.force}</p>
                <p className="text-[15px] leading-relaxed"><span className="font-semibold">Limite:</span> {item.limit}</p>
              </div>
            ))}
          </div>

          <div className="pt-[30px]">
            <h3 className="text-left font-semibold text-[18px] py-[20px]">Então praticar um pouco de Filosofia da Tecnologia pode nos ajudar em alguns pontos?</h3>
            <div className="grid gap-3">
              {relevancePoints.map((point) => (
                <div key={point} className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-[15px] leading-relaxed">{point}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
              {morePoints.map((point) => (
                <p key={point} className="text-[15px] leading-relaxed mb-3">• {point}</p>
              ))}
            </div>
          </div>
        </section>
      </div>

      <MobileBottomBar to="/" text="Voltar ao início" bgColor={moduleColor} />
    </MainLayout>
  );
}

export default Module_02_00;
`;

fs.writeFileSync("src/components/Modules/Module-02/Module_02_00.jsx", content, "utf8");
console.log("WROTE Module_02_00.jsx");
