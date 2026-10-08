---
name: modulo-01-filotec-estrutura
description: Estrutura de arquivos do Módulo 1 (Filosofia da Tecnologia, Aula 01) — JSON de conteúdo, componente de página, padrão de seções
metadata:
  type: project
---

O Módulo 1 / Aula 01 ("Filosofia da Tecnologia: Estranhando o Familiar") usa esta estrutura:

- Documento fonte: `public/FILOTEC AULA 1 EAD.docx` (havia também um `public/GEMINI 02 FILOTEC AULA 1 EAD.docx` mais antigo, marcado para remoção pelo usuário fora do escopo de qualquer tarefa de conteúdo — não tocar nele a menos que pedido).
- Conteúdo estruturado: `src/assets/content_Modulo_01/filotec_aula_01.json` — um único objeto com `aula`, `disciplina`, `titulo`, `objetivo` e um array `sections`, cada uma com `type`.
- Componente da página: `src/components/Modules/Module-01/Filotec_Aula_01.jsx` — possui um `renderSection` com `switch(section.type)` que mapeia cada tipo de seção do JSON para uma combinação de componentes de `@ui` (alias para `src/components/ui`).
- Imagens: `src/assets/imgs/filotec_aula_01/image1.png` ... `image5.png`, importadas estaticamente no topo do JSX e mapeadas em `imageMap` por nome de arquivo (`section.src` no JSON é só o nome do arquivo, ex: `"image2.png"`).
- Rota: `src/App.jsx` — a rota raiz `"/"` renderiza `<Filotec_Aula_01 />` diretamente (não há lazy loading nem rotas por aula ainda; é um projeto de página única por enquanto).

Tipos de `section.type` já existentes no JSON e o que cada um renderiza no JSX:
- `intro` — parágrafo de abertura destacado com borda azul lateral.
- `image` — wrapper `<ImageLightbox>`; tem lógica condicional de classe de largura máxima por nome de arquivo (`imageMaxWidthClass`) e de espaçamento (`extraBottomSpacing`) — ver [[inventario-componentes-ui]].
- `dropdown_section` — grid de `DropdownContent` + `QuoteCard` de conclusão (usado para "O ponto de partida à brasileira" / Marilena Chauí).
- `story` — historinhas/diálogos filosóficos; título + subtítulo + campo `dialogue` (string única com `\n` separando falas/narração, renderizada via `FormattedText` com `whitespace-pre-line`). Ver [[discrepancias-conteudo-aula01]] sobre erros recorrentes nesse campo.
- `comparison_cards` — duas colunas de `HighlightBlock` (column_a/column_b).
- `infobox_section` — bloco com `title`, `subtitle`, `text` (suporta `<strong>` literal no JSON, não markdown), `warning` e `conclusion`. É renderizado como texto corrido com `whitespace-pre-line`, sem subtópicos estruturados — no docx fonte essa seção também é texto corrido (sem headings/bullets distintos), então a estrutura atual (text/warning/conclusion como 3 campos string) já reflete fielmente o doc.
- `dropdown_group` — grid de `DropdownContent` com `title`/`subtitle` opcional e `items[].{title,content}` (content suporta `**bold**` via `FormattedText`).
- `numbered_list` — lista com número grande + `DropdownContent` por item (`items[].{numero,tipo,foco,text}`).
- `timeline` — usa o componente `Timeline` de `src/components/ui/Timeline/Timeline.jsx`. Ver [[timeline-clique-revelar]].
- `vieira_pinto_section` — grid de `DropdownContent` com borda lateral azul grossa, específico para a seção sobre Álvaro Vieira Pinto.
- `data_table` — `DataTable` de `src/components/ui/Table/DataTable.jsx`.
- `highlight_section` — bloco com borda lateral azul grossa e `FormattedText`.
- `final_section` — seção de encerramento com dropdowns + lista de `HighlightBlock` (`highlights_title`/`highlights`).

Padrão de negrito no JSON: campos que passam por `FormattedText` (helper local no JSX que faz `text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')`) usam markdown `**texto**`. Campos como `infobox_section.text` usam `<strong>` HTML literal diretamente no JSON (inconsistência pré-existente, mas funcional pois também passa por `FormattedText`, que só processa `**`, e o HTML literal sobrevive via `dangerouslySetInnerHTML`).
