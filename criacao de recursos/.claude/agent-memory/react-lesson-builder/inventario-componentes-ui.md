---
name: inventario-componentes-ui
description: Inventário de componentes em src/components/ui e para que tipo de conteúdo cada um serve, incluindo o padrão de acordeão do DropdownContent
metadata:
  type: project
---

Componentes exportados via `src/components/ui/index.jsx` (alias `@ui`):

- `DropdownContent` (`DropdownContent/DropdownContent.jsx`) — acordeão individual com estado próprio (`useState` interno, não controlado de fora). Props: `title`, `text` (string ou node; se string, processa linhas que começam com `•` como lista com bullet customizado), `imageUrl`/`altText`, e props de cor customizáveis (`bgColor`, `hoverBgColor`, `borderColor`, `titleTextColor`, `contentTextColor`, `iconColor`) e de tamanho de fonte responsivo. Usa ícones `GoChevronDown`/`GoChevronUp` de `react-icons/go`. **Este é o padrão de referência de acordeão do projeto** — qualquer novo componente "clique para revelar" deve seguir essa mesma lógica de chevron + toggle, para manter consistência visual.
- `Timeline` (`Timeline/Timeline.jsx`) — linha do tempo vertical com marcador circular e card. Originalmente estático (sem interação); foi redesenhado (ver [[timeline-clique-revelar]]) para clique-para-revelar usando o mesmo padrão de chevron do `DropdownContent`.
- `HighlightBlock` — bloco de destaque com `accentColor` customizável; usado para cards de comparação e listas de highlights.
- `QuoteCard` — citação com autor, usado para conclusões de seções (ex: aforismos de Marilena Chauí).
- `DataTable` (`Table/DataTable.jsx`) — tabela com `headers` e `rows` (cada cell pode ser node, ex: `<FormattedText>`).
- `ImageLightbox` (`ImageLightbox/ImageLightbox.jsx`) — wrapper de imagem clicável que abre lightbox; aceita `src`, `alt`, `className`.
- `AccessibilityControls` (`AccessLink/AccessibilityControls.jsx`) — controle de tamanho de fonte (`fontSize`/`setFontSize`), usado fixo no topo das páginas de módulo.
- `InteractiveQuiz` — quiz interativo (tem até teste `.test.jsx`), ainda não usado na Aula 01 mas disponível para futuros módulos com pontos de verificação de aprendizagem.
- `ComparisonTable` / `Table` (mesmo arquivo `Table/ComparisonTable.jsx`, dois nomes exportados) — tabela de comparação alternativa ao `DataTable`.
- `InfoBox`, `ReferenceInfoBox`, `ReferenceList`, `ReferenceBoxColor` — variantes de caixas de destaque/referência, pouco usadas na Aula 01 (que usa `infobox_section` custom no próprio JSX em vez do componente `InfoBox`).
- `QuestionnairePrompt` — prompt de questionário, não usado ainda na Aula 01.
- `VideoEmbed` — embed de vídeo.
- `CarouselComponent` / `BarProgress` — carrossel e barra de progresso de scroll, utilitários gerais.

Mapeamento pedagógico já validado neste projeto (reaproveitar em futuras aulas):
- Definições/conceitos-chave de múltiplos autores em paralelo → `dropdown_group` (grid de `DropdownContent`).
- Diálogos/historinhas narrativas longas → `story` (bloco com fundo levemente diferenciado, fonte serifada itálica).
- Comparação de duas posições/colunas → `comparison_cards` (`HighlightBlock` em 2 colunas).
- Linha do tempo cronológica → `timeline`, agora com clique-para-revelar (ver [[timeline-clique-revelar]]).
- Tabelas comparativas multi-autor → `data_table`.
- Listas de "exemplos práticos" onde o docx pede explicitamente "cada bullet vira um card" → section type `bullet_cards` (grid de `HighlightBlock`, um por item), introduzido na Aula 08 ([[modulo-08-filotec-estrutura]]). Não exige componente novo — reaproveita o `HighlightBlock` já existente, só muda o agrupamento em grid.
- Citação/síntese pontual que o docx marca como destaque lateral (ex.: `"[linha lateral do texto]"`) → reaproveitar o tipo `conclusion` (QuoteCard) **no meio do conteúdo**, não só no fechamento da aula (precedente: Aula 09, [[modulo-09-filotec-estrutura]]). Atenção: `QuoteCard` renderiza `{quote}` como texto puro, sem `dangerouslySetInnerHTML` — remover manualmente qualquer `**negrito**` do texto antes de usá-lo nesse tipo, diferente de `highlight_section`/`dropdown_group` que passam por `FormattedText`.
