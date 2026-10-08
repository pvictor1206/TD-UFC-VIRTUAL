---
name: padronizacao-cores-azul
description: Paleta de cores lilás/roxa foi removida em 2026-06-22; componentes de ui/ agora usam apenas tons de azul como default de cor
metadata:
  type: project
---

Em 2026-06-22, a pedido do usuário, todas as cores lilás/roxo (hex, não havia classes Tailwind `purple-*`/`violet-*` em uso) foram substituídas por tons de azul equivalentes nos **defaults** (props default) dos componentes de UI compartilhados. O motivo: o Módulo 1 (Aula 01) tinha containers em lilás (herdados dos defaults do `DropdownContent` e afins) misturados com containers já em azul, quebrando a consistência visual. Ver [[modulo-01-filotec-estrutura]] e [[inventario-componentes-ui]].

**Arquivos alterados** (todos só trocaram valores hex de props default de cor, nenhuma lógica/conteúdo foi tocado):
- `src/components/ui/DropdownContent/DropdownContent.jsx` — `bgColor`, `hoverBgColor`, `borderColor`, `iconColor`.
- `src/components/ui/InteractiveQuiz/InteractiveQuiz.jsx` — `progressColor` default e `buttonBgColor` default (doc comment + valor).
- `src/components/ui/ReferenceInfoBox/ReferenceInfoBox.jsx` — `borderColor`.
- `src/components/ui/ReferenceInfoBox/ReferenceBoxColor.jsx` — `borderColor` (comentário também corrigido de "verde" para "azul", já estava incorreto antes).
- `src/components/ui/Table/ComparisonTable.jsx` — `colors.headBg`, `colors.zebra`, `colors.zebra_two`, `colors.border`.
- `src/components/ui/CarouselComponent/CarouselComponent.jsx` — `colors.arrowBg`, `colors.dotActive`, `colors.dotInactive`.
- `src/components/ui/QuestionnairePrompt/QuestionnairePrompt.jsx` — `topBgColor`, `buttonBgColor`, `focus:ring-[...]` do botão.
- `src/components/ui/AccessLink/AccessLink.tsx` — `colors.bg`, `colors.icon`.
- `src/components/layout/Sidebar/DropdownMenu.jsx` — `activeClass` (bg/border do item ativo) e hover do botão de grupo. Este arquivo está em `layout/`, não em `ui/`, mas usava a mesma paleta lilás (`#F4F2FF`/`#C9BFEF`) hardcoded inline — corrigido por consistência.

**Paleta de conversão usada** (lilás antigo → azul novo):
- `#FDFBFF`/`#FAFBFF` (fundo quase branco) → `#FAFBFF`
- `#F4F2FF`/`#F9F8FF` (hover/fundo claro) → `#EFF6FF` (≈ Tailwind `blue-50`)
- `#D8D1F5` (header/borda média) → `#BFDBFE` (≈ `blue-200`)
- `#C9BFEF`/`#CBBEF2`/`#BCA6E3` (borda lilás clara) → `#93C5FD` (≈ `blue-300`)
- `#E5DFFB` (zebra de tabela) → `#DBEAFE` (≈ `blue-100`)
- `#4A3B8C` (roxo escuro ícone) → `#1e40af` (`blue-800`, já usado no projeto)
- `#3F2177` (roxo escuro carrossel) → `#1e3a8a` (`blue-900`, já usado no projeto)
- `#8B5CF6` (violet-500, quiz progress) → `#2563EB` (≈ `blue-600`)

**Importante:** `Filotec_Aula_01.jsx` (`src/components/Modules/Module-01/Filotec_Aula_01.jsx`) não tinha hex roxo algum no próprio arquivo — os roxos vinham só dos *defaults* dos componentes de UI nas seções que não sobrescreviam cor (`dropdown_section`, `dropdown_group`, `final_section` usavam `<DropdownContent>` sem props de cor, herdando o lilás default). As seções que já passavam `bgColor`/`borderColor`/`iconColor` explícitos (`numbered_list`, `vieira_pinto_section`) já estavam em azul (`#1e40af`, `#1e3a8a`, `#f8fafc`, `#e2e8f0`) — por isso a inconsistência visual só aparecia nas seções com defaults não sobrescritos.

**Impacto em outros módulos:** hoje (2026-06-22) só existe `Module-01` em `src/components/Modules/`, então o impacto prático desta mudança ficou contido na Aula 01 + Sidebar global. Mas como as cores foram trocadas no nível de *default* dos componentes `@ui`, qualquer aula futura que use `DropdownContent`, `InteractiveQuiz`, `ComparisonTable`, `CarouselComponent`, `ReferenceInfoBox`, `ReferenceBoxColor`, `QuestionnairePrompt` ou `AccessLink` **sem** passar props de cor customizadas herdará automaticamente a nova paleta azul — não há mais necessidade de sobrescrever manualmente essas cores para manter consistência com o tema azul institucional.

Build (`npm run build`) e `npm run lint` validados sem erros após a mudança.

## Rodada 2 (mesmo dia, 2026-06-22) — componentes que escaparam da primeira varredura

O usuário reportou que a caixa de "conclusion" do `dropdown_section` (renderizada via `<QuoteCard quote={section.conclusion} />` em `Filotec_Aula_01.jsx` linha ~92-94) ainda estava em lilás. Causa raiz: a Rodada 1 só procurou por **props default em JS** (`bgColor = "#..."` etc.) dentro de componentes que já tinham esse padrão de customização. Ela não pegou classes Tailwind com **hex arbitrário direto no JSX** (`className="bg-[#EBD9FF]"`), que é como `QuoteCard.jsx` e `HighlightBlock.jsx` tinham suas cores hardcoded — sem nenhuma prop de cor exposta.

**Lição:** ao procurar cores fora da paleta, sempre grep por `#[0-9A-Fa-f]{6}` em **todo** `src/` (não só em arquivos que pareçam ter props de cor) — componentes simples sem API de customização de cor costumam embutir o hex direto em `className="...bg-[#XXXXXX]..."`.

**Arquivos corrigidos nesta rodada:**
- `src/components/ui/QuoteCard/QuoteCard.jsx` — `border-[#D8C0FF]`→`border-[#93C5FD]`, `bg-[#EBD9FF]`→`bg-[#EFF6FF]`, `text-[#1F1C3C]`→`text-[#1e3a8a]`, `text-[#5B4F82]`→`text-[#1e40af]`. **Este é o componente do bloco "conclusion" citado pelo usuário.**
- `src/components/ui/HighlightBlock/HighlightBlock.jsx` — prop default `accentColor = "#8A63FF"`→`"#2563EB"`, `border-[#E6E1FF]`→`border-[#BFDBFE]`, `bg-[#F8F4FF]`→`bg-[#EFF6FF]`.
- `src/components/Mobile/MobileBottomBarBackNext.jsx` e `src/components/Mobile/MobileBottomBar.jsx` — prop default `bgColor = "#44257A"` (roxo escuro) → `"#1e3a8a"` (blue-900). Não estão em uso em nenhuma rota hoje (`App.jsx` só renderiza `Filotec_Aula_01` direto, sem `MainLayout`), mas existem na árvore de componentes prontos para uso futuro.

**Verificados e confirmados como NÃO precisando de mudança** (cores fora de azul mas que não são roxo/lilás, fazem parte de outra paleta semântica do projeto):
- `src/components/ui/InfoBox/InfoBox.jsx` — `border-[#EFE58D]` é amarelo de aviso (intencional), `text-[#0C1E33]` já é azul-marinho neutro. **Nota importante:** existem dois componentes chamados `ReferenceInfoBox` no código-fonte — um em `InfoBox/InfoBox.jsx` (versão simples sem props de cor, é o que `index.jsx` exporta como `InfoBox`) e outro em `ReferenceInfoBox/ReferenceInfoBox.jsx` (versão parametrizada, exportada como `ReferenceInfoBox`). Não confundir os dois ao editar.
- `src/components/layout/Sidebar/NavBar.jsx` — não tem hex hardcoded; usa `moduleColor`/`moduleColorProgressBar` vindos de props dinâmicas (de `modules`), que hoje nunca são populadas porque `MainLayout`/`NavBar` não estão em uso ativo no roteamento.
- `src/assets/content_Modulo_01/filotec_aula_01.json` — `accentColor: "#ef4444"` (vermelho, usado intencionalmente para o conceito de "inevitabilidade" nos `comparison_cards`) e `"#3b82f6"` (já é azul). Conteúdo, não tocar.
- `src/App.css` — `#646cffaa`/`#61dafbaa` são o boilerplate do logo Vite/React, não usado visualmente na aplicação real.

Build e lint validados novamente sem erros após a Rodada 2.
