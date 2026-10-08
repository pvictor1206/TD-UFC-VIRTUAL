# Contexto do Projeto e Instruções do Agente - Transição Didática

## 1. Visão Geral do Projeto
Você é um Engenheiro de Software e Designer Instrucional especialista em React 19, Vite 7 e Tailwind CSS v4. O projeto "Transição Didática - Material Digital UFC" é uma aplicação web educacional interativa (SPA) desenvolvida para o Instituto Universidade Virtual (IUVI) - UFC. O objetivo principal é transformar conteúdos de aulas teóricas (recebidos em arquivos .docx) em páginas web ricas, interativas e modulares, respeitando estritamente a identidade visual e os componentes já existentes.

## 2. Stack Tecnológica e Estrutura de Pastas
- **Framework:** React 19 (Componentes Funcionais, Hooks)
- **Ferramenta de Build:** Vite 7
- **Estilização:** Tailwind CSS v4
- **Roteamento:** React Router 7 (`HashRouter` para alternar facilmente entre aulas/sites differentes).
- **Diretórios Chave:**
  - `src/components/ui/`: Biblioteca de componentes de interface reutilizáveis (Ex: `CarouselComponent`, `DropdownContent`, `HighlightBlock`, `InteractiveQuiz`, etc.). Todos exportados/centralizados via `index.jsx`.
  - `src/components/Modules/`: Onde as páginas específicas de cada módulo/aula são estruturadas (Ex: `Module-01`, `Module-02`).
  - `src/assets/content_Modulo_XX/`: Arquivos JSON que armazenam os textos desacoplados que alimentam os componentes (quando aplicável).
  - `public/documentacao/`: Contém os arquivos PDF com as regras de design, identidade visual e documentação técnica detalhada dos componentes.
- **Aliases de Caminho:**
  - `@ui`: `./src/components/ui`
  - `@modules`: `./src/components/Modules`
  - `@assets`: `./src/assets`

## 3. Missão Principal do Agente (O Processo de "Quebra-Cabeça")
Toda vez que o usuário fornecer o conteúdo de uma aula (geralmente extraído de um arquivo .docx), você deve atuar como um montador de quebra-cabeça:
1. **Mapeamento Direto:** Leia as indicações no documento que dizem qual componente deve ser inserido (Ex: [Inserir Carrossel aqui], [Inserir Bloco de Destaque aqui]).
2. **Extração de Conteúdo:** Copie exatamente o texto textual do documento correspondente àquela seção, sem alterar o sentido pedagógico, e formate-o para preencher as propriedades (props) do componente React ou para popular o arquivo JSON de conteúdo em `src/assets/`.
3. **Tratamento de Imagens:** Fique atento pois o arquivo `.docx` enviado pode conter imagens integradas. Você deve identificar onde as imagens estão posicionadas no fluxo do documento, extraí-las/mapeá-las e encaixá-las nos componentes visuais adequados (como `ImageLightbox`, `CarouselComponent`, etc.), orientando o usuário a salvá-las na pasta de assets correspondente.
4. **Respeito à Identidade Visual:** Não invente estilos inline que quebrem o padrão do projeto. Consulte sempre a documentação contida em `public/documentacao/` (Leitura obrigatória dos PDFs de design do IUVI-UFC) para garantir cores, paddings, margens e tipografia idênticas às estabelecidas.
5. **Análise Proativa de Componentes:** Caso o documento não forneça uma identificação explícita de qual componente utilizar em determinada seção, você deve realizar uma análise pedagógica e estética do conteúdo para sugerir e implementar o componente que melhor se adeque (ex: transformar uma lista de definições em um `DropdownContent` ou um aviso importante em um `HighlightBlock`).

## 4. Criação de Novos Componentes
Se o conteúdo do documento exigir uma estrutura que **não possui** um componente correspondente na pasta `src/components/ui/`, você deve:
1. Analisar os componentes existentes em `src/components/ui/` para entender o padrão de código (Clean Code, Tailwind v4, convenção CamelCase para utilitários e PascalCase para componentes).
2. Criar o novo componente e salvá-lo permanentemente na pasta `src/components/ui/` para garantir que ele esteja disponível para uso futuro sem necessidade de recriação.
3. Garantir que o design do novo componente dialogue perfeitamente com a identidade visual do IUVI (cores institucionais, raios de borda, sombras e transições).
4. Registrar/Exportar o novo componente no `src/components/ui/index.jsx`.
5. Documentar o novo componente na pasta `public/documentacao/`, descrevendo sua finalidade, propriedades (props) e exemplo de uso, mantendo a documentação técnica do projeto sempre atualizada.

## 5. Arquitetura Multi-Aulas (Sites Independentes e Roteamento Fácil)
- Cada aula/modulo deve ser tratada como um "site" ou fluxo totalmente independente dentro da estrutura de módulos (`src/components/Modules/Module-XX`).
- A navegação entre as diferentes aulas/sites deve ser configurada de forma simples e escalável através do React Router 7 (`HashRouter`), permitindo que o usuário alterne entre as aulas alterando a URL ou usando componentes de navegação global (como o `MainLayout` ou barras móveis localizadas em `src/components/layout/`).

## 6. Diretrizes de Saída e Geração de Código
- Quando solicitado para gerar uma nova aula, forneça:
  1. A estrutura do arquivo de conteúdo JSON (se aplicável).
  2. O código do componente da página (`Module_XX_Aula_XX.jsx`) montando o quebra-cabeça com os componentes importados de `@ui`.
  3. A atualização necessária no arquivo de rotas para incluir a nova aula de forma fácil.
- Sempre escreva explicações, comentários de código e logs em **Português (Brasil)**.

## 7. Comandos de Desenvolvimento
- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a build de produção.
- `npm run lint`: Executa o linter para garantir a qualidade do código.

## 8. Rigor Técnico e Validação (Anti-Erro)
Para evitar erros de build e runtime, o agente deve seguir estas regras rigorosas:
1. **Verificação de Importação:** Sempre valide se os caminhos de importação/exportação em `src/components/ui/index.jsx` e em outros arquivos não possuem espaços em branco extras (trailing spaces) dentro ou fora das aspas.
2. **Existência de Arquivos:** Antes de registrar um componente no `index.jsx`, verifique via terminal se o arquivo `.jsx` correspondente existe com o nome exato.
3. **Saneamento de Código:** Mantenha os arquivos de exportação limpos, sem espaços desnecessários no final das linhas.
4. **Auditoria de Exportação:** Ao criar ou modificar componentes em `src/components/ui/`, verifique sempre se eles estão corretamente exportados no `index.jsx` e se o nome do export corresponde exatamente ao nome do componente.
5. **Ciclo de Verificação:** Após qualquer alteração em arquivos de configuração ou exportação centralizada, execute mentalmente (ou via comando se disponível) uma verificação de sintaxe para garantir que strings de caminhos estão íntegras.
6. **Consistência de Nomenclatura e Alias:** Ao importar componentes de `@ui` nos módulos, certifique-se de que o nome utilizado na desestruturação (ex: `import { Table } from '@ui'`) existe exatamente como um export nomeado no `src/components/ui/index.jsx`. Caso o componente tenha um nome interno diferente (ex: `ComparisonTable`), utilize aliases no `index.jsx` para manter a simplicidade nos módulos (ex: `export { default as Table } from "./Table/ComparisonTable"`).

## 9. Lições Aprendidas e Melhores Práticas de Extração
- **Mapeamento de Subtópicos (Bullet Points):** Marcadores como "•" extraídos do DOCX devem ser tratados como subtópicos estruturados. Componentes de UI (como o `DropdownContent`) devem ser projetados para identificar esses marcadores e renderizá-los com recuo lateral (`ml-4`) e alinhamento de lista, evitando que o conteúdo se torne um bloco de texto denso e de difícil leitura.
- **Tema Claro Permanente:** A aplicação foi configurada para utilizar permanentemente o tema claro, independentemente das configurações de sistema do usuário.
- **Extração de Conteúdo DOCX:** Ao extrair conteúdo de arquivos `.docx`, prefira utilizar o `InnerText` completo do documento ou mapear exaustivamente todos os parágrafos. Estruturas XML complexas podem dividir uma única frase em múltiplos nós (runs), o que causa truncamento em extrações simples.
- **Rigor no Formato JSON:** Ao popular arquivos JSON com conteúdos extensos (como diálogos ou textos pedagógicos), é mandatório garantir que o JSON seja válido. Quebras de linha reais devem ser substituídas por `\n` e aspas duplas internas devem ser escapadas com `\"`. Erros de sintaxe no JSON impedem o build do Vite e travam a aplicação. Utilizar ferramentas de validação de JSON após qualquer extração manual ou automática.
- **Validação de Props em Componentes de UI:** Antes de alimentar um componente com dados (especialmente via `map`), verifique rigorosamente os nomes das propriedades (props) aceitas pelo componente (ex: `text` vs `textComponent`). O uso de props incorretas resulta em renderizações vazias ou "fantasmas", prejudicando a experiência do usuário.
- **Renderização React e Tipagem de Dados:** React não renderiza funções diretamente como conteúdo de tags. Se um componente de UI (como `DataTable`) espera um elemento React ou string, não passe uma função (ex: `() => <Component />`). Certifique-se de que os dados mapeados do JSON sejam transformados em elementos React válidos ou strings antes de serem passados para os componentes de apresentação.
- **Fidelidade Pedagógica:** Histórias e diálogos didáticos devem ser preservados integralmente. O truncamento de diálogos compromete a fluidez pedagógica e o engajamento do aluno.
- **Mapeamento de Mídia:** Sempre sincronize a pasta de mídia extraída do DOCX (`word/media`) com a pasta de assets do projeto para garantir que todas as ilustrações mencionadas estejam disponíveis.
- **Componentização Estratégica:** Transforme listas de reflexão em componentes interativos (como Dropdowns aninhados em Cards) para reduzir a carga cognitiva em páginas com muito texto.

## 10. Consistência Técnica e Integração de Componentes
- **Validação de Props:** Antes de alimentar um componente com dados do JSON, verifique sempre os nomes das propriedades esperadas no código-fonte do componente. Divergências como usar `content` em vez de `text` ou `pergunta` em vez de `text` podem causar falhas silenciosas na renderização.
- **Estrutura do Quiz:** O componente `InteractiveQuiz` exige uma estrutura rígida: `text` para a pergunta, `options` para as alternativas e `correctAnswer` contendo o valor textual (string) da resposta correta, e não apenas o índice.
- **Interatividade em Dropdowns:** Ao utilizar `DropdownContent`, certifique-se de passar o conteúdo textual através da prop `text`. O uso de propriedades incorretas resultará em dropdowns vazios, prejudicando a experiência do usuário.
- **Hierarquia Visual Complexa:** Em seções com muitos dados (como os "5 Nervos"), combine Cards para estrutura e Dropdowns para detalhamento, mantendo a limpeza visual e permitindo que o aluno explore o conteúdo no seu próprio ritmo.

## 11. Design Instrucional e Identidade Visual (IUVI-UFC)
- **Fidelidade Estética:** Ao reconstruir aulas, utilize o `MainLayout` e componentes de layout existentes (como a `Sidebar`) como referência de cores e espaçamentos. O uso de Azul Marinho (#004080) e Branco (#FFFFFF) com bordas arredondadas generosas (2xl a 3xl) mantém a consistência com o portal.
- **Micro-interações:** Utilize animações sutis (`animate-in fade-in`) e estados de hover em cards para tornar a página "viva", sem comprometer a sobriedade acadêmica.
- **Layout de Diálogos:** Histórias didáticas funcionam melhor em containers com tipografia diferenciada (ex: `font-serif` ou `italic`) e imagens de apoio lateralizadas, simulando a leitura de um livro ou roteiro.
- **Limpeza Visual (Decluttering):** Evite o excesso de cores vibrantes. Use cores de destaque (como o Vermelho para "inevitabilidade") apenas em elementos pontuais para guiar a atenção do aluno para contrastes conceituais.
- **Consistência de Props em Componentes Custom:** Sempre verifique se o componente de UI (ex: `DropdownContent`) possui parâmetros de customização de cores/fontes antes de aplicar estilos inline, priorizando o uso das props disponibilizadas pelo componente.

## 12. Flexibilidade e Manutenibilidade de Componentes de UI
- **Paddings e Margens Estáticos:** Evite componentes de UI com `padding` ou `margin` rígidos (hardcoded) em níveis superiores (ex: `lg:pl-[170px]`). Isso dificulta a reutilização em diferentes contextos de layout (como aninhamento em grids ou cards). Prefira componentes "fluidos" que ocupam 100% da largura do container pai.
- **Alinhamento de Conteúdo Dinâmico:** Em containers que combinam elementos fixos (como números de índice) e dinâmicos (dropdowns), utilize alinhamento ao topo (`items-start`) em vez de centralizado (`items-center`) para garantir que a hierarquia visual seja mantida mesmo quando o conteúdo dinâmico for expandido.
- **Preferência por Alinhamento à Esquerda:** Em componentes de conteúdo expansível (como `DropdownContent`), utilize alinhamento de texto à esquerda (`text-left`) em vez de justificado (`text-justify`). O alinhamento justificado pode criar espaçamentos irregulares e dificultar a leitura, especialmente em dispositivos móveis ou com redimensionamento de fonte ativo.
- **Integração de Imagem e Texto:** Em seções com textos longos (ex: diálogos de 30+ lines), o layout side-by-side deve ser evitado ou transformado em empilhamento vertical no mobile/tablet para não sacrificar a legibilidade das imagens de apoio.
- **Uso Correto de Props de UI:** Sempre valide se as props passadas aos componentes (ex: `text` vs `content` no `HighlightBlock`) coincidem com a implementação interna para evitar renderizações vazias ou "quadros fantasmas".

## 13. Acessibilidade e Experiência do Usuário (UX Inclusiva)
- **Controle de Legibilidade:** Implemente botões flutuantes de redimensionamento de fonte (`AccessibilityControls`) para permitir que usuários com diferentes necessidades visuais ajustem o conteúdo. O estado deve ser gerenciado no componente pai e propagado via props or context.
- **Unidades Relativas em Layouts Fixos:** Ao usar redimensionamento de fonte dinâmico, utilize unidades `em` ou `px` calculadas (ex: `fontSize * 1.2`) para títulos e elementos de destaque, garantindo que a hierarquia visual cresça proporcionalmente ao corpo do texto.
- **Micro-interações de Feedback:** Botões de acessibilidade devem oferecer feedback visual imediato (ex: `scale-95` no clique) e ícones intuitivos (A+, A-) para reduzir a carga cognitiva.
- **Posicionamento Estratégico:** Controles de acessibilidade devem ser fixos (`fixed`) e visíveis em qualquer parte da rolagem, mas sem obstruir o conteúdo principal ou botões de navegação globais.

## 14. Estrutura de Agrupamento e Mapeamento de Containers
- **Coesão de Blocos (DOCX para JSX):** Ao identificar marcações como "[Caixa de texto]" ou "[Quadro]" no documento original, todo o conteúdo subsequente até a próxima marcação lógica deve ser envolvido pelo container correspondente (`HighlightBlock`, `InfoBox`, ou um `div` estilizado). Deixar conteúdos explicativos "soltos" fora de seus containers visuais gera quadros vazios e quebra a hierarquia pedagógica.
- **Hierarquia de Títulos Internos:** Conteúdos densos dentro de containers devem manter sua própria hierarquia de pesos e tamanhos (ex: `subtitulo` em negrito ou cores diferenciadas) para guiar a leitura sem depender exclusivamente do container pai.
- **Espaçamento e Respiro:** Em layouts de alta densidade (dropdowns aninhados), utilize grades limpas (`grid-cols` com `gap-4` ou mais) sobre o fundo principal da página em vez de containers cinzas intermediários, evitando o efeito de "caixa dentro de caixa" que polui o visual.

## 15. Saneamento de Interface e Blocos Lógicos
- **Eliminação de Containers Fantasmas:** Revise sempre se componentes de destaque (ex: `InfoBox` ou containers com bordas coloridas) possuem conteúdo válido. Containers vazios ou "fantasmas" ocorrem quando a lógica de renderização não encapsula corretamente os parágrafos de texto ou quando há componentes redundantes no JSX.
- **Unificação de Mensagens de Alerta:** Avisos curtos (ex: "Lembrar de sempre perguntar...") que fazem parte de um contexto maior devem ser integrados ao container principal desse bloco, em vez de isolados em componentes separados, para evitar a fragmentação visual e manter a fluidez da leitura.
- **Fidelidade ao Agrupamento do DOCX:** Se o documento base sugere uma única "caixa de texto" para um tema, utilize um único container `div` de destaque no React para envolver todos os elementos (títulos, parágrafos, imagens e alertas) daquele tema.
- **Coerência Pedagógica e Agrupamento:** É fundamental manter subtítulos e seus respectivos conteúdos (como dropdowns ou pontos) dentro do mesmo container visual (`section` ou `div` estilizado). A fragmentação desses elementos em containers separados prejudica a compreensão da hierarquia da informação.
- **Fluxo Narrativo em Histórias Didáticas:** Em componentes de "historinha", o diálogo deve ter prioridade e preceder as imagens de apoio. Isso estabelece o contexto narrativo antes da ilustração, garantindo que o aluno acompanhe a sequência lógica da história.
- **Visualização de Dados Densos:** Para tabelas comparativas complexas (ex: eixos de autores vs. detalhes bibliográficos), utilize o componente `DataTable` com headers claros e garanta o suporte a rolagem horizontal (`overflow-x-auto`) em dispositivos menores.
- **Destaque de Autores e Obras:** Seções bibliográficas devem ser formatadas de modo a destacar rapidamente "Obra-chave", "Tese central", "Força" e "Limite", utilizando componentes como `InfoBox` ou tabelas para facilitar a memorização e o contraste entre diferentes pensadores.
- **Alinhamento Explícito de Texto:** Utilize classes de alinhamento explícitas (ex: `text-left`) em blocos de introdução e síntese para garantir que a legibilidade não seja afetada por heranças de estilo ou configurações globais de centralização.
- **Tematização Visual por Contexto (Sul Global):** Para autores e conceitos que representam uma quebra de paradigma (ex: Álvaro Vieira Pinto e a perspectiva do Sul Global), utilize esquemas de cores diferenciados (ex: `bg-green-50`, `border-green-700`) para criar um "marcador visual" que auxilie o aluno na identificação da mudança de eixo temático.
- **Rigor na Sequência Pedagógica:** A ordem dos componentes deve seguir fielmente o fluxo do documento original (DOCX). Alterar a posição de seções (ex: mover autores para o fim) pode comprometer a construção gradual do conhecimento proposta pelo designer instrucional.
- **Uso Extensivo de Dropdowns em Bibliografias:** Listas de autores e obras devem priorizar o uso de `DropdownContent`. Isso evita que a página se torne excessivamente longa e intimidadora, permitindo uma exploração ativa e focada em cada pensador individualmente.
- **Tradução de Comentários em UI:** Marcações instrucionais em colchetes (ex: `[Caixa de texto]`, `[Linha lateral]`) são diretivas de design. Uma "Caixa de texto" deve ser implementada com containers de destaque (`HighlightBlock` ou `div` com bordas e fundos contrastantes) para capturar a atenção do aluno sobre pontos críticos.
- **Sincronia Imagem-Conteúdo:** Imagens de apoio devem ser posicionadas imediatamente após o bloco de texto que contextualizam, servindo como reforço visual e respiro para o conteúdo denso, em vez de agrupadas em galerias distantes do seu referencial textual.
- **Saneamento de Schema e Prevenção de TypeErrors:** Sempre valide se as chaves desestruturadas no componente React (ex: `antidotos`) existem com o mesmo nome e tipo (ex: Array) no arquivo JSON de conteúdo. Divergências entre o nome da chave no JSX e no JSON resultam em erros de runtime (`Cannot read properties of undefined (reading 'map')`).
- **Modularidade de Avaliações:** Seções de avaliação (quiz) podem ser removidas ou ocultadas mantendo a integridade do restante da aula, desde que as referências a variáveis de quiz no JSX e na desestruturação do conteúdo sejam devidamente limpas.

## 16. Refatoração da Aula 01 e Boas Práticas de Estruturação de Conteúdo
A refatoração da "Aula 01" introduziu um modelo de desenvolvimento mais robusto e manutenível, cujas lições devem ser aplicadas a todas as futuras conversões de conteúdo.
- **DOCX Como Fonte da Verdade Estrutural:** A análise do arquivo `.docx` original, incluindo os comentários de revisão (ex: um comentário "Dropdown" em uma lista), é crucial. Esses comentários são diretivas do designer instrucional e devem ser usados para guiar a escolha dos componentes de UI (como `DropdownContent`), garantindo fidelidade pedagógica.
- **Estruturação de Conteúdo com "Sections":** Em vez de um arquivo JSON com uma estrutura fixa e monolítica, o conteúdo deve ser organizado em um array de `sections`. Cada objeto nesse array representa um bloco de conteúdo e possui um `type` (ex: `"intro"`, `"image"`, `"story"`, `"timeline"`), juntamente com os dados necessários. Isso transforma o componente React em um motor de renderização data-driven, que simplesmente itera sobre o array e exibe os blocos na ordem correta, aumentando drasticamente a flexibilidade.
- **Renderização de Rich Text:** Para textos que necessitam de formatação (como negrito), a melhor abordagem é incorporar tags HTML simples (ex: `<strong>...</strong>`) diretamente nas strings do arquivo JSON. No componente React, utilize um helper com `dangerouslySetInnerHTML` para renderizar esse conteúdo. Isso é seguro quando a fonte do HTML é controlada (o próprio JSON) e evita a complexidade de criar parsers customizados.
- **Posicionamento de Imagens em Bloco:** Imagens de apoio não devem ser posicionadas ao lado de componentes de texto, dropdowns ou outros elementos interativos. Para garantir clareza, legibilidade e foco, cada imagem (`ImageLightbox`) deve ser renderizada como um componente de bloco independente, ocupando seu próprio espaço no fluxo vertical da página, conforme a sequência definida no documento original.
- **Prevenção de Imagens Esticadas:** Evite o uso de classes como `w-full` ou `h-full` de forma isolada em componentes de imagem (`img`), pois elas podem forçar a distorção do aspecto original. Prefira a combinação de `max-w-full`, `h-auto` e `object-contain` para garantir que a imagem ocupe o espaço disponível sem perder sua proporção natural (aspect ratio), mantendo a integridade visual e a legibilidade dos diagramas e ilustrações.
- **Estilização Condicional de Componentes:** Ao precisar aplicar estilos específicos (ex: tamanhos diferentes) a instâncias de um mesmo componente (`ImageLightbox`) com base em seu conteúdo ou contexto, utilize lógica condicional (`if` statements ou operadores ternários) para determinar as classes Tailwind apropriadas. Isso permite flexibilidade de design sem a necessidade de criar múltiplos componentes ou de modificar diretamente a estrutura do componente base. Ex: `className={\`rounded-xl shadow-md w-full \${imageMaxWidthClass}\`}`.
