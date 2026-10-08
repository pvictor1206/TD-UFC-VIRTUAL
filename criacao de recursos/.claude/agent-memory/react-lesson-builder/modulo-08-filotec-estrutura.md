---
name: modulo-08-filotec-estrutura
description: Estrutura de arquivos do Módulo 8 (Filosofia da Tecnologia, Aula 08 — Lucy Suchman e Maria Mies, mais quadro-resumo geral) e estado atual do roteamento em App.jsx
metadata:
  type: project
---

O Módulo 8 / Aula 08 ("Filósofas Críticas da Tecnologia II: Lucy Suchman e Maria Mies") foi criado em 2026-07-07, substituindo a Aula 07 neste branch (`Aula-08-Filosofia-Tecnologia-EaD`). Continua diretamente a numeração de autoras da Aula 07 ([[modulo-07-filotec-estrutura]]): lá eram 1. Haraway, 2. Harding, 3. Wajcman; aqui são 4. Suchman e 5. Mies.

- Documento fonte: `public/Agente IA FILOTEC AULA 8 EAD.docx` (revisora "Thais Gomes Carlos", mesmo padrão Google-Docs-export das aulas anteriores). **2 imagens embutidas** (`word/media/image1.png` = Maria Mies, `image2.png` = Lucy Suchman — atenção, a numeração dos arquivos NÃO segue a ordem de aparição no documento; confirmar sempre via `r:embed` no `document.xml` + `word/_rels/document.xml.rels`, nunca assumir pela ordem alfabética/numérica do arquivo). Ambas são infográficos estilo desenho técnico (não fotos/retratos), resumindo visualmente toda a seção da autora.
- Imagens salvas em `src/assets/imgs/filotec_aula_08/` como `lucy_suchman_infografico.png` e `maria_mies_infografico.png`, importadas estaticamente e mapeadas em `imageMap` no `.jsx` (mesmo padrão de aulas com imagem, ex. Módulo 05/06).
- Conteúdo estruturado: `src/assets/content_Modulo_08/filotec_aula_08.json` (13 sections).
- Componente da página: `src/components/Modules/Module-08/Filotec_Aula_08.jsx`.
- Rota: `/` (raiz) em `src/App.jsx` — este branch só tem a Aula 08.

## Diretivas de revisão e como foram mapeadas
Nesta aula os marcadores de diretiva aparecem **como texto literal inline no corpo do documento** (parágrafos em negrito entre colchetes, ex. `[Cada número é um dropdown]`), não apenas em `word/comments.xml` — os dois canais coexistem e trazem o mesmo texto (ex. comentário id=1 "Cada número é um dropdown" ancorado via `commentRangeStart/End` sobre o mesmo trecho que o parágrafo colchetes já indicava). Quando ambos existem, o marcador inline é mais fácil de localizar exatamente porque aparece na sequência natural dos parágrafos.
- `"[Infográfico]"` / `"[infográfico]"` (2 ocorrências, uma antes de cada seção de autora) → confirmam a posição das imagens `rId9`/`rId10` já embutidas ali perto.
- `"[Cada número é um dropdown]"` / `"[Cada número é dropdown]"` (Suchman e Mies) → `dropdown_group` com `layout: "vertical"`, 4 items cada, onde o item bold `ilvl=0` virou `item.title` e os bullets `ilvl=1` abaixo viraram `item.content` (bullets `•` inseridos manualmente, já que o Word usa `numPr` para numerar e não grava o caractere `•` dentro do `<w:t>`).
- `"[Cada bullet point é um card]"` / `"[deixar título em bold e usar cards para os bullets points]"` (2 ocorrências, seções "Exemplos práticos de aplicação" de Suchman e Mies) → **novo tipo de section `bullet_cards`**, reaproveitando o componente `HighlightBlock` já existente (sem criar componente novo) em grid `md:grid-cols-2`, um `HighlightBlock` por bullet. Ver seção abaixo.
- `"[transformar em tabela]"` (antes de "Relações com outros autores") → o comentário/marcador se refere ao gigantesco `data_table` que vem logo em seguida no documento (9 autores/autoras × 8 colunas: Autor(a), Obra Principal, Área/Abordagem, Crítica Central, Conceitos-Chave, Relação Tecnologia-Poder, Exemplos, Limitações). Interpretado como: a seção "Relações com outros autores" (3 bullets de prosa, mantidos como `highlight_section`) é seguida por essa tabela-síntese de TODO o curso (não só desta aula) — é o quadro-resumo geral da disciplina de Filosofia da Tecnologia, cobrindo inclusive autores de aulas anteriores (Vieira Pinto, Heidegger, Ellul, Simondon, Haraway, Harding, Jonas) que não têm mais nenhum outro vestígio de conteúdo neste branch (só aparecem como linhas da tabela).

## Novo tipo de section: `bullet_cards`
`{ title, items: string[] }` → título em `<h2>` + grid de `HighlightBlock` (um por item de `items`, cada `text` passado como `<FormattedText text={itemText} />` para suportar `**negrito**`). **Não foi criado nenhum componente novo em `src/components/ui/`** — a diretiva "cada bullet vira card" foi atendida 100% reaproveitando o `HighlightBlock` já existente (padrão já usado para `comparison_cards` em aulas anteriores, ver [[inventario-componentes-ui]]), current de acordo com a diretriz do GEMINI.md de sempre preferir reuso antes de criar componente novo.

## Ausência de `story`, `video`, `reference_box` e `conclusion` nesta aula
Diferente de quase todas as aulas anteriores, o docx da Aula 08 **não contém** historinha, vídeo, caixa de referência bibliográfica isolada nem parágrafo de conclusão/citação final — o documento termina abruptamente logo após a última linha do quadro-resumo (confirmado inspecionando o XML bruto: só um `<w:p>` vazio depois do `</w:tbl>`, sem `w:sectPr` com conteúdo textual). Os cases `story`/`video`/`reference_box`/`conclusion` foram mantidos no switch do `.jsx` por consistência de padrão (mesma decisão tomada para `image` na Aula 07), mas nenhuma section desses tipos existe no JSON desta aula. **Não inventei uma conclusão/citação de encerramento** para não alterar o sentido pedagógico do documento original — se o usuário quiser uma, deve ser adicionada sob confirmação explícita.

## Posicionamento das imagens (decisão de design, não só fidelidade literal)
No XML bruto, a imagem de cada autora vem **logo após o heading, antes dos bullets introdutórios** (heading → imagem → bullets "Obra/Contribuição" → bio "Quem é/foi X?"). Optei por posicionar a imagem **depois** do bloco `highlight_section` (que já une bullets introdutórios + bio, no mesmo padrão usado para Sandra Harding na Aula 07), e não entre o heading e os bullets. Motivo: o infográfico funciona como um recapitulativo visual de TODO o perfil da autora (não ilustra um bullet específico), então lê melhor como "resumo visual" após o texto introdutório completo, antes do aprofundamento em dropdowns. Isso é uma escolha pedagógica deliberada, não um erro de sequência — reportado ao usuário no resumo final para transparência.

## Seções do documento (ordem final no JSON)
1. `highlight_section` — 4. Lucy Suchman (1945– ) [bullets intro + bio "Quem é Lucy Suchman?" fundidos, mesmo padrão da Harding na Aula 07]
2. `image` — infográfico Lucy Suchman
3. `dropdown_group` — 🧠 Principais Ideias/Contribuições (4 items: Plans and Situated Actions, Human-Machine Reconfigurations, Crítica da Autonomia da Máquina, Epistemologia Situada)
4. `highlight_section` — Críticas / Limitações (Suchman)
5. `bullet_cards` — Exemplos Práticos de Aplicação (Suchman, 3 cards)
6. `highlight_section` — 5. Maria Mies (1931–2023) [bullets intro + bio "Quem foi Maria Mies?" fundidos]
7. `image` — infográfico Maria Mies
8. `dropdown_group` — 🧠 Contribuições Principais no Contexto de Tecnologia e Ecofeminismo (4 items)
9. `highlight_section` — Críticas e Desafios (Mies)
10. `bullet_cards` — Exemplos Práticos de Aplicação (Mies, 4 cards)
11. `highlight_section` — Relações com Outros Autores (3 bullets de prosa conectando Suchman/Mies aos autores de aulas anteriores)
12. `data_table` — Quadro-Resumo Comparativo (9 autores/autoras, 8 colunas — tabela larga, depende do `overflow-x-auto` já embutido no `DataTable`)

Sem `intro` inicial, sem `conclusion` final — o cabeçalho `<header>` do componente já cobre título/objetivo (objetivo foi sintetizado por mim, não está literal no docx, seguindo o mesmo padrão da Aula 07).

## Build validado
`npm run build`: 73 modules, 1.97s, zero erros (as duas imagens PNG entraram no bundle, ~1.2MB e ~1.8MB — grandes por serem infográficos densos em alta resolução, considerar otimização/compressão se o tamanho do bundle vier a importar). `npm run lint`: zero erros/warnings. (2026-07-07)
Grep por "07" em `src/` após remoção do Módulo 07: só restam 2 falsos-positivos ("Human-Machine Reconfigurations (2007)" — ano de publicação, não Aula 07).
