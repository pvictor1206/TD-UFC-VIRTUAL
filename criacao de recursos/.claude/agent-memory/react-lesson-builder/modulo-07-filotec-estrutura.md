---
name: modulo-07-filotec-estrutura
description: Estrutura de arquivos do Módulo 7 (Filosofia da Tecnologia, Aula 07 — filósofas críticas da tecnologia: Haraway, Harding, Wajcman) e estado atual do roteamento em App.jsx
metadata:
  type: project
---

O Módulo 7 / Aula 07 ("Filósofas Críticas em Relação à Tecnologia") foi criado em 2026-07-07, substituindo a Aula 06 neste branch (`Aula-07-Filosofia-Tecnologia-EaD`).

- Documento fonte: `public/Agente IA FILOTEC AULA 7 EAD.docx` (revisora "Thais Gomes Carlos"). **Sem imagens embutidas** (não há pasta `word/media` no docx) — diferente de todas as aulas anteriores (01-06), que tinham ao menos 1 imagem. `Filotec_Aula_07.jsx` não importa nenhum `imageMap`; o `case 'image'` no `renderSection` foi mantido no switch (usando `section.src` direto, sem imageMap) só por consistência de padrão, mas não há nenhuma section do tipo `image` no JSON desta aula.
- Conteúdo estruturado: `src/assets/content_Modulo_07/filotec_aula_07.json` (13 sections).
- Componente da página: `src/components/Modules/Module-07/Filotec_Aula_07.jsx`.
- Rota: `/` (raiz) em `src/App.jsx` — este branch só tem a Aula 07.

## Diretivas de revisão (comments.xml) e como foram mapeadas
- "Deixar em negrito e grifado com uma cor" (nas 3 headings de autoras) → `highlight_section` com título em destaque (border-l azul + h2 bold), sem cor por-autora diferenciada (mantendo a paleta azul única do projeto, ver [[padronizacao-cores-azul]]).
- "Quadro de texto" (envolvendo TODA a história "Carne de Garantia", do título até o último parágrafo) → `type: "story"` (já existente desde Aula 04/05/06).
- "Dropdown" (4 ocorrências) → `dropdown_group` com `layout: "vertical"`.
- "tabela" (mini-tabela Antropoceno/Capitaloceno/Chthulucene, aninhada dentro de um dos Dropdowns de Haraway) → **não virou um `data_table` separado**; foi achatada em bullets `• **Termo:** definição` dentro do próprio `content` do item do dropdown, para não fragmentar o bloco (ver [[inventario-componentes-ui]] sobre `dropdown_group`).
- "Seria interessante um quadro comparativo no fim do capítulo" (comentário da revisora na Conclusão, sugestão não implementada no docx) → implementado proativamente como novo tipo de section `data_table` (usa o componente `DataTable` de `@ui`, já existente mas nunca antes usado em nenhum módulo) comparando as 3 autoras (Filósofa / Obra Central / Contribuição Principal), posicionado antes da conclusão.

## Novos tipos de section introduzidos nesta aula
- `data_table`: `{ title, headers: string[], rows: string[][] }` → renderiza `<DataTable title headers data={rows} />`.
- `conclusion`: `{ text, author }` → renderiza `<QuoteCard quote={text} author={author} />`. É a primeira vez que `QuoteCard` é efetivamente usado em um módulo (estava importado mas não utilizado em Filotec_Aula_06.jsx).
- `story` ganhou um campo opcional novo `warning` (aviso itálico abaixo do título, dentro do cabeçalho azul-escuro) além do já existente `label`. Usado para o aviso "Só leia se você gosta de ficção científica cyberpunk!". Os parágrafos da história usam `font-serif` (adicionado ao `<p>` do case `story`, que na Aula 06 não tinha essa classe).

## Duplicação detectada e resolvida no docx fonte
O trecho sobre a segunda obra de Haraway ("Staying with the Trouble: Making Kin in the Chthulucene", 2016) aparecia **duplicado quase integralmente duas vezes seguidas** no documento, cada cópia precedida por um marcador `[Dropdown]` e envolvida por um comentário de revisão "Dropdown" diferente (ID 2 e ID 4 em `word/comments.xml`), com a segunda cópia faltando apenas a mini-tabela Antropoceno/Capitaloceno/Chthulucene presente na primeira. Interpretado como artefato de edição (cópia acidental durante revisão), não como conteúdo pedagógico intencional repetido — **incluído apenas uma vez** (a versão mais completa, com a tabela achatada em bullets). Reportado ao usuário no resumo final para confirmação; se o usuário disser que a duplicação era intencional, seria necessário reverter esta decisão.

## Seções do documento (ordem final no JSON)
1. `highlight_section` — 1. Donna Haraway (1944– )
2. `story` — "Carne de Garantia" (historinha cyberpunk completa, ~140 parágrafos, sem truncamento)
3. `dropdown_group` — Donna Haraway — Chthulucene e o Pós-Antropoceno (3 items: obra 2016 c/ tabela achatada, críticas, exemplos práticos)
4. `highlight_section` — 2. Sandra Harding (1935–2025)
5. `dropdown_group` — Ideias Centrais de Sandra Harding (4 items: standpoint epistemology, objetividade forte, pluralismo epistemológico, ciência/tecnologia como espaços de poder)
6. `highlight_section` — Impactos Recentes e Aplicações Práticas (Harding)
7. `highlight_section` — Críticas e Limitações (Harding)
8. `highlight_section` — 3. Judy Wajcman (1950– )
9. `dropdown_group` — Principais Contribuições de Judy Wajcman (4 items: perfil, obras, abordagem STS, temas contemporâneos)
10. `highlight_section` — Críticas, Limites ou Desafios (Wajcman)
11. `highlight_section` — Exemplos Práticos de Aplicação das Ideias de Wajcman
12. `data_table` — Quadro Comparativo (3 autoras) — adição proativa, ver acima
13. `conclusion` — parágrafo final via QuoteCard

## Build validado
`npm run build`: 71 modules, 2.06s, zero erros. `npm run lint`: zero erros/warnings. (2026-07-07)
Grep por "06" em `src/` após remoção do Módulo 06: só resta `src/assets/react.svg` (ícone boilerplate do Vite, não relacionado a nenhuma aula).
