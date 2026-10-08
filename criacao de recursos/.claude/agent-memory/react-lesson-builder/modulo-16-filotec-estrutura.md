---
name: modulo-16-filotec-estrutura
description: Estrutura de arquivos do Módulo 16 (Transhumanismo e Filosofia da Tecnologia + diversidade do pensamento brasileiro sobre tecnologia); duas "Conclusões" literais e distintas na mesma aula; título de dropdown_group editorial; sub-bullets de 2º nível achatados
metadata:
  type: project
---

O Módulo 16 / Aula 16 ("Transhumanismo e Filosofia da Tecnologia") foi criado em 2026-07-08, substituindo a Aula 15 ([[modulo-15-filotec-estrutura]]) neste branch (`Aula-16-Filosofia-Tecnologia-EaD`). Tema duplo/dois blocos na mesma aula: (1) o transhumanismo analisado pela Filosofia da Tecnologia (Heidegger, Simondon, Mumford, Winner, Latour, Marcuse, Feenberg, Vieira Pinto, Ihde, Verbeek, Byung-Chul Han, Stiegler, Galimberti como problematizadores; Kurzweil/Bostrom/More como defensores; Jonas/Vieira Pinto/Haraway/Han/Galimberti como críticos); (2) a diversidade regional/histórica/política/cultural do pensamento brasileiro sobre tecnologia (10 eixos temáticos, citando Vieira Pinto, Paulo Freire, Marilena Chauí).

- Documento fonte: `public/Agente IA FILOTEC AULA 16 EAD.docx` (revisora "Thais Gomes Carlos", 4 comentários em `word/comments.xml`, mesmo padrão Google-Docs-export). **Sem imagens embutidas nem tabelas** — não existe pasta `word/media`, zero `<w:tbl>`/`<w:drawing>` no document.xml.
- Conteúdo estruturado: `src/assets/content_Modulo_16/filotec_aula_16.json` (5 sections: `dropdown_group`, `highlight_section` ×2 — ambos "Conclusão" —, `highlight_section` "Sobre o Brasil", `bullet_cards` com 10 itens).
- Componente da página: `src/components/Modules/Module-16/Filotec_Aula_16.jsx`.
- Rota: `/` (raiz) em `src/App.jsx`.

## Diretivas de revisão (comments.xml) e como foram mapeadas
- `w:id="0"` ("Cada número um dropdown") — ancorada do parágrafo "1. O que é o Transhumanismo?" até o parágrafo final sobre Umberto Galimberti, cobrindo os 3 itens numerados → `dropdown_group` (3 items). O item 3 ("Principais defensores e críticos") tem dois subtítulos internos ("Defensores do transhumanismo" / "Críticos do transhumanismo") com suas próprias listas, preservados dentro do mesmo `item.content` (bold subheading + bullets), sem gerar item de dropdown extra — mesmo padrão já usado em aulas 11/13 para conteúdo hierárquico dentro de um único item.
- `w:id="1"` ("manter o negrito onde está em negrito") e `w:id="3"` ("manter onde está em negrito") — **não são diretivas de componente**, são instruções tipográficas puras (preservar negrito ao transpor o texto), ambas ancoradas nos parágrafos "Conclusão" de cada bloco temático. Seguidas via `**texto**` no JSON + FormattedText, sem gerar nenhuma section especial.
- `w:id="2"` ("Cada número, um card") — ancorada dos 10 itens numerados da seção "Diversidade do Brasil na Filosofia da Tecnologia e Ciências Sociais" → `bullet_cards` (10 items).
- Todas as diretivas também aparecem como texto visível entre colchetes no corpo do documento — não copiado para o JSON, mesmo padrão de sempre.

## Duas "Conclusão" literais e distintas na mesma aula (não é duplicação acidental)
O docx tem **dois** blocos de fechamento, ambos com o cabeçalho literal "Conclusão": um encerra o bloco sobre transhumanismo (antes de "Sobre o Brasil"), outro encerra o bloco sobre diversidade brasileira (fim do documento). Ambos implementados como `highlight_section` distintas no array `sections` (não fundidas em uma só, não renomeadas para desambiguar visualmente) — fidelidade estrutural ao docx, com comentário explícito no JSX avisando o revisor de que a repetição é intencional/literal, seguindo o precedente de módulos anteriores que sinalizavam duplicações reais do documento fonte (ex.: [[modulo-07-filotec-estrutura]]).

## Título do dropdown_group É EDITORIAL (diferente da Aula 15)
Ao contrário de [[modulo-15-filotec-estrutura]] (onde o título do dropdown_group era literal, "Acadêmicos e filósofos centrais"), aqui o docx vai direto do título da aula para a diretiva colchete "[Cada número um dropdown]" e o item numerado "1.", sem nenhum cabeçalho de grupo. O título usado ("O Transhumanismo em debate") foi sintetizado editorialmente e sinalizado como tal em comentário no JSX — nenhuma informação de conteúdo foi inventada, apenas um rótulo estrutural.

## Sub-bullets de 2º nível (ilvl=1) achatados para um único nível
Dois itens do bloco "Diversidade do Brasil" têm sub-bullets de nível 1 no docx (item 4 "Tradições intelectuais diversas": Vieira Pinto/Freire/Chauí; item 9 "Diversidade de aplicação tecnológica": Agronegócio/Periferias urbanas). Como nem `FormattedText` nem `DropdownContent`/`HighlightBlock` deste projeto distinguem visualmente níveis de indentação de lista (só reconhecem "•" genérico), os sub-bullets foram renderizados como marcadores "•" de mesmo nível que os demais — achatamento de hierarquia visual, não perda ou invenção de conteúdo. Regra a generalizar: se uma futura aula precisar de bullets aninhados com indentação visual real, isso exigiria estender `FormattedText` (ou criar variante), não inventar dados.

## Sem "objetivo" literal no docx (mesma situação de várias aulas anteriores)
Assim como em [[modulo-10-filotec-estrutura]], [[modulo-12-filotec-estrutura]], [[modulo-13-filotec-estrutura]], [[modulo-14-filotec-estrutura]] e [[modulo-15-filotec-estrutura]], o docx não tem parágrafo de "objetivo" explícito — vai direto de "AULA 16" para o título e a diretiva colchete. O campo `objetivo` do JSON foi sintetizado editorialmente cobrindo os dois temas centrais (transhumanismo em debate na Filosofia da Tecnologia + diversidade do pensamento brasileiro sobre tecnologia).

## Nenhum componente novo criado; nenhuma imagem
Toda a aula (5 sections) foi montada reaproveitando tipos já existentes: `dropdown_group`, `highlight_section` (×3, incluindo "Sobre o Brasil"), `bullet_cards`. Sem `image`, `reference_box`, `story`, `video`, `data_table` ou `conclusion`/QuoteCard (sem conteúdo correspondente no docx fonte, ou incompatível com bullets/negrito no caso do `conclusion`).

## Build e limpeza validados
`npm run build`: build limpo, ~2.5s, zero erros (sem imagens, bundle JS ~250KB). `npm run lint`: zero erros/warnings. (2026-07-08)
Grep por `aula[ _-]?15|modulo_15|module-15|filotec_aula_15` (case-insensitive) em `src/` após remoção do Módulo 15: só 2 ocorrências, ambas comentários explicativos legítimos no próprio JSX da Aula 16 (referenciando a decisão de design herdada de usar `highlight_section` em vez de `conclusion`), não código morto.

## Ambiguidades reportadas ao usuário (não resolvidas unilateralmente)
1. Título do `dropdown_group` é editorial (ver acima) — sinalizado em comentário, não é uma lacuna real, apenas uma decisão de rotulagem estrutural.
2. Sub-bullets de 2º nível achatados para "•" simples (ver acima) — limitação técnica do componente, não ambiguidade de conteúdo.
3. Nenhuma outra ambiguidade estrutural relevante — documento com diretivas de comentário claras e sem títulos numéricos faltando/duplicados incorretamente (a duplicação de "Conclusão" é literal e intencional do docx, não um erro de numeração).
