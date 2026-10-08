---
name: modulo-10-filotec-estrutura
description: Estrutura de arquivos do Módulo 10 (Filosofia da Tecnologia, Aula 10 — Luciano Floridi, Bruno Latour e Franco "Bifo" Berardi) e estado atual do roteamento em App.jsx
metadata:
  type: project
---

O Módulo 10 / Aula 10 ("Floridi, Latour e Berardi: Informação, Redes e a Crítica ao Capitalismo Digital") foi criado em 2026-07-07, substituindo a Aula 09 neste branch (`Aula-10-Filosofia-Tecnologia-EaD`). Continua a linha de "filósofos mais citados" iniciada na Aula 09 — Floridi (rank 1) e Latour (rank 2) já apareciam no "Resumo Visual" final da Aula 09 como posições 1ª e 2ª do ranking geral — e acrescenta Franco Berardi como um pensador crítico complementar (não faz parte do ranking "mais citados", é tratado à parte, sem número).

- Documento fonte: `public/Agente IA FILOTEC AULA 10 EAD.docx` (revisora "Thais Gomes Carlos", mesmo padrão Google-Docs-export com `goog_rdk_N` e comentários em `word/comments.xml`). **Sem imagens embutidas** — não existe pasta `word/media` nem `r:embed` em `word/_rels/document.xml.rels` (só rels de tema/estilos/numbering/comments). `Filotec_Aula_10.jsx` não define nenhum `imageMap`; o `case 'image'` foi mantido no switch (usando `section.src` direto) só por consistência, mas nenhuma section do tipo `image` existe no JSON.
- Conteúdo estruturado: `src/assets/content_Modulo_10/filotec_aula_10.json` (14 sections — a aula mais curta desta série até agora, pois o docx fonte tem só 137 parágrafos de texto, cobrindo 3 autores).
- Componente da página: `src/components/Modules/Module-10/Filotec_Aula_10.jsx`.
- Rota: `/` (raiz) em `src/App.jsx`.

## Sem "objetivo"/subtítulo literal no docx
Diferente de aulas anteriores, o docx desta aula vai direto de "AULA 10" (título) para "[Cada número, um dropdown]" (marcador) e "Luciano Floridi" (nome do primeiro autor) — não há parágrafo de objetivo/introdução explícito. O campo `objetivo` do JSON e o `titulo` da aula foram **sintetizados editorialmente** a partir do conteúdo (prática já aceita em aulas anteriores), não são texto literal do docx. Nenhuma section `type: "intro"` foi criada (não havia texto de abertura para preencher esse tipo sem inventar conteúdo).

## Diretivas de revisão (comments.xml) e como foram mapeadas
Todas as diretivas vêm em pares: um comentário anexado (`word/comments.xml`, autora Thais) + o mesmo texto como marcador literal entre colchetes no corpo do documento (ex.: `[cards]`, `[Dropdown]`) — redundância, não ambiguidade.
- `w:id="0"` "Cada número, um dropdown" (range cobre TODO o bloco de Luciano Floridi, do nome até a síntese) → só os itens efetivamente **numerados** (1. Infosfera … 5. Síntese) viraram itens do `dropdown_group`; a bio e o parágrafo "Filosofia da Informação como base" (não numerados) ficaram no `highlight_section` de abertura, replicando o padrão já usado nas Aulas 07-09 (bio/definição antes do dropdown, não dentro dele).
- `w:id="2"` "Dropdown" (Bruno Latour, itens 1-6) → `dropdown_group` "🕸️ Bruno Latour e a Filosofia da Tecnologia" (título tirado literalmente do subtítulo do docx, que antecede o marcador "[Dropdown]" sem bullets próprios — diferente de Floridi, cujo dropdown não tinha um subtítulo literal equivalente, por isso ganhou título editorial com emoji).
- `w:id="1"`, `w:id="3"`, `w:id="5"` "cards" (Floridi, Latour, Berardi — "Exemplos práticos") → `bullet_cards` (grid de `HighlightBlock`), 4/3/3 itens respectivamente.
- `w:id="4"` "dropdown" (Berardi, itens 1-5 nominais, mas 8 parágrafos numerados no total — ver duplicação abaixo) → `dropdown_group` "🏭 Franco Berardi e a Fábrica da Infelicidade" (título editorial, sem subtítulo literal no docx).
- `w:id="6"` "tabela" (Berardi, "Diálogo com outros filósofos da tecnologia": Byung-Chul Han, Bernard Stiegler, Álvaro Vieira Pinto, Marcuse) → `data_table` com 2 colunas (Filósofo / Ponto de Diálogo com Berardi).

## Duplicações detectadas no docx (reportadas, resolvidas por edição mínima)
1. **Bio de Berardi duplicada**: dois parágrafos consecutivos (não-adjacentes, com um comentário de revisão entre eles) descrevem a biografia de Berardi quase com as mesmas palavras ("Franco 'Bifo' Berardi (1949– ) é um dos nomes mais provocativos..." vs "Franco 'Bifo' Berardi (1949– ) é um filósofo e ativista italiano ligado ao pós-operaísmo..."). Mantida apenas a versão mais completa (a que menciona a obra com ambas as edições, italiana e portuguesa) — mesmo critério da duplicação da Aula 07 ([[modulo-07-filotec-estrutura]]).
2. **Numeração colidida dentro do dropdown de Berardi**: o range do comentário `w:id="4"` ("dropdown") cobre 8 parágrafos numerados, mas o docx tem uma colisão de numeração: "1. A tese central", "2. Tecnologia como dispositivo de controle", "3. Infelicidade como produto social", depois um item sem número ("Do trabalho manual ao trabalho cognitivo"), seguido por **outro** "2. Infelicidade como produto tecnológico-social" (tema quase idêntico ao item 3 anterior, com redação diferente), "3. Tecnologia, linguagem e semiocapitalismo", "4. Temporalidade e aceleração tecnológica", "5. Possibilidades de resistência" — indício de duas versões/rascunhos do mesmo bloco de 5 pontos mescladas no arquivo. **Não descartei nenhum parágrafo** (todo o texto foi preservado); apenas renumerei sequencialmente 1-8 no JSON para eliminar a colisão visual de dois itens "2." e dois itens "3.". Os itens 3 ("Infelicidade como produto social") e 5 ("Infelicidade como produto tecnológico-social", renumerado) tratam do mesmo tema com textos diferentes — **reportado ao usuário para confirmação/possível fusão**, seguindo o precedente de não resolver ambiguidades de conteúdo sem validação humana.

## Duas seções "Conclusão" para Berardi (não é duplicação)
Diferente do achado acima, as duas ocorrências de `highlight_section` com título "Conclusão" para Berardi (uma logo após os "Exemplos práticos", outra depois da tabela "Diálogo com outros filósofos") **não são duplicatas** — são textos totalmente diferentes fechando blocos distintos (a exposição principal de Berardi vs. o apêndice comparativo com outros filósofos), no mesmo padrão do apêndice de Simondon na Aula 09 ([[modulo-09-filotec-estrutura]]). Ambas mantidas.

## Nenhum componente novo criado
Toda a aula (14 sections) foi montada 100% reaproveitando os tipos já existentes: `highlight_section`, `dropdown_group`, `bullet_cards`, `data_table`. Nenhuma section `intro`, `image`, `story`, `reference_box` ou `video` nesta aula (sem conteúdo correspondente no docx fonte).

## Build validado
`npm run build`: build limpo, ~1.9s, zero erros (sem imagens, bundle JS ~258KB). `npm run lint`: zero erros/warnings. (2026-07-07)
Grep por "09" em `src/` após remoção do Módulo 09: só restam falsos positivos — o ano "2009" (edição portuguesa da obra de Berardi, dentro do próprio JSON da Aula 10) e `src/assets/react.svg` (ícone boilerplate do Vite, mesmo falso positivo de aulas anteriores).
