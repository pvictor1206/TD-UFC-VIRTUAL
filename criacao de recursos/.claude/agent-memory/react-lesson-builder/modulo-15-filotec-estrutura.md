---
name: modulo-15-filotec-estrutura
description: Estrutura de arquivos do Módulo 15 (Tecnologia da Informação e Manipulação Política — Zuboff, Castells, Tufekci, Benkler, Pariser, Sunstein, Morozov, Byung-Chul Han, Latour); documento mais curto e simples até agora; "Conclusão" literal virou highlight_section (não conclusion/QuoteCard) por ter bullets/negrito
metadata:
  type: project
---

O Módulo 15 / Aula 15 ("Tecnologia da Informação e Manipulação Política") foi criado em 2026-07-08, substituindo a Aula 14 ([[modulo-14-filotec-estrutura]]) neste branch (`Aula-15-Filosofia-Tecnologia-EaD`). Tema: como filosofia da tecnologia, ciência política, comunicação e sociologia convergem no estudo da manipulação política via mídias digitais/algoritmos, através de 9 acadêmicos/filósofos (não só filósofos "puros" — inclui cientistas políticos e comunicólogos).

- Documento fonte: `public/Agente IA FILOTEC AULA 15 EAD.docx` (revisora "Thais Gomes Carlos", 2 comentários em `word/comments.xml`, mesmo padrão Google-Docs-export). **Sem imagens embutidas nem tabelas** — não existe pasta `word/media`, zero `<w:tbl>`/`<w:drawing>` no document.xml. Documento muito mais curto que aulas anteriores: só 41 parágrafos com conteúdo, índice bruto até 51.
- Conteúdo estruturado: `src/assets/content_Modulo_15/filotec_aula_15.json` (apenas **3 sections** — a aula mais enxuta da série até agora: `intro`, `dropdown_group` com 9 itens, `highlight_section` de conclusão).
- Componente da página: `src/components/Modules/Module-15/Filotec_Aula_15.jsx`.
- Rota: `/` (raiz) em `src/App.jsx`.

## Diretivas de revisão (comments.xml) e como foram mapeadas
- `w:id="0"` ("manter onde está em negrito") — ancorada no parágrafo de abertura (intro). **Não é diretiva de componente**, é instrução tipográfica pura (preservar negrito ao transpor o texto). Seguida via `**texto**` no JSON + FormattedText, sem gerar nenhuma section especial.
- `w:id="1"` ("Cada autor um dropdown, onde está em negrito, manter") — ancorada do parágrafo "Shoshana Zuboff" até o parágrafo final sobre Bruno Latour, cobrindo os 9 acadêmicos → `dropdown_group`.
- Ambas as diretivas também aparecem como texto visível entre colchetes no corpo do documento — não copiado para o JSON, mesmo padrão de sempre.

## Título do dropdown_group É LITERAL (diferente de várias aulas anteriores)
Ao contrário de [[modulo-14-filotec-estrutura]] e outras aulas em que o título do `dropdown_group`/`bullet_cards` precisou ser editorial (docx sem cabeçalho antes do bloco), aqui o parágrafo "**Acadêmicos e filósofos centrais**" é um cabeçalho literal em negrito, imediatamente antes da diretiva colchete — usado como `dropdown_group.title` sem nenhuma invenção.

## "Conclusão" (literal) virou `highlight_section`, não `conclusion`/QuoteCard
O título "Conclusão" é literal do docx, mas o parágrafo de conclusão contém uma **lista com marcadores "•" e trechos em negrito** (Algoritmos, Plataformas, Redes globais de poder, Subjetividades capturadas). O tipo `conclusion` usa `QuoteCard`, que renderiza `{quote}` como **texto puro sem FormattedText** (ver regra já documentada em [[inventario-componentes-ui]]) — usá-lo aqui geraria um bloco com "**negrito**" e "•" aparecendo literalmente como caracteres, não como formatação. Por isso foi usado `highlight_section` (que passa o texto por FormattedText, com suporte real a bullets e negrito) mesmo para um bloco chamado "Conclusão". **Regra a generalizar:** ao decidir entre `conclusion`/QuoteCard vs `highlight_section` para um bloco de fechamento, checar primeiro se o texto tem bullets/negrito — se tiver, usar `highlight_section`.

## Bruno Latour com apenas 1 marcador (assimetria mantida, não completada)
Diferente dos outros 8 autores (que têm ao menos "Obra:" + 1-2 bullets adicionais), o item "Bruno Latour" no dropdown_group tem **um único bullet** no docx fonte (sem linha "Obra:" separada). Mantido literalmente assim — não foi inventada nenhuma obra ou dado biográfico para "completar" o padrão visual dos outros itens.

## Sem "objetivo" literal no docx (mesma situação de várias aulas anteriores)
Assim como em [[modulo-10-filotec-estrutura]], [[modulo-12-filotec-estrutura]], [[modulo-13-filotec-estrutura]] e [[modulo-14-filotec-estrutura]], o docx não tem parágrafo de "objetivo" explícito — vai direto de "AULA 15" para o parágrafo de abertura. O campo `objetivo` do JSON foi sintetizado editorialmente cobrindo o tema central (manipulação política via tecnologia da informação) e os 9 autores citados.

## Nenhum componente novo criado; nenhuma imagem
Toda a aula (3 sections) foi montada reaproveitando tipos já existentes: `intro`, `dropdown_group`, `highlight_section`. Sem `image`, `bullet_cards`, `reference_box`, `story`, `video` ou `data_table` (sem conteúdo correspondente no docx fonte — documento sem `word/media`, sem `<w:tbl>`).

## Build e limpeza validados
`npm run build`: build limpo, ~2s, zero erros (sem imagens, bundle JS ~246KB). `npm run lint`: zero erros/warnings. (2026-07-08)
Grep por `aula[ _-]?14|modulo_14|module-14|filotec_aula_14` (case-insensitive) em `src/` após remoção do Módulo 14: zero ocorrências.

## Ambiguidades reportadas ao usuário (não resolvidas unilateralmente)
1. Nenhuma ambiguidade estrutural relevante nesta aula — documento incomumente direto (só 1 diretiva de componente, sem títulos faltando, sem duplicações). A única decisão de design que vale destacar é o uso de `highlight_section` em vez de `conclusion` para o bloco "Conclusão" (ver acima), motivada por limitação técnica do QuoteCard, não por ambiguidade do conteúdo.
