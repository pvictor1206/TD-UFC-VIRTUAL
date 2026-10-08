---
name: timeline-clique-revelar
description: Padrão aplicado ao Timeline.jsx para expandir/colapsar o campo "evento" ao clicar no marco, reaproveitando a UX do DropdownContent
metadata:
  type: feedback
---

`src/components/ui/Timeline/Timeline.jsx` originalmente renderizava `ano`, `autor` e `evento` sempre visíveis, sem nenhuma interação. O usuário pediu (Aula 01, Filosofia da Tecnologia) que cada marco comece compacto (`ano` + `autor`) e revele o `evento` só ao clicar.

Decisão tomada: reaproveitar o padrão visual/interativo já estabelecido em `DropdownContent` (`src/components/ui/DropdownContent/DropdownContent.jsx`) em vez de inventar uma UX nova — usa `useState` local (`openIndex`) controlando qual item está expandido, ícones `GoChevronDown`/`GoChevronUp` de `react-icons/go` (já era dependência do projeto, usada pelo `DropdownContent`), e `aria-expanded` + `aria-label` para acessibilidade.

**Why:** O projeto já tinha um padrão de acordeão consistente (`dropdown_group` no JSX da Aula 01 usa `DropdownContent` em várias seções); criar uma segunda lógica de expand/collapse divergente quebraria a consistência visual pedida explicitamente pelo usuário ("Veja se já existe um padrão de acordeão/dropdown reutilizável... para manter consistência visual em vez de inventar um padrão novo").

**How to apply:** Para qualquer novo componente "clique para revelar" neste projeto, seguir a mesma assinatura: estado local controlando índice/booleano de item aberto, chevron de `react-icons/go`, `aria-expanded` no elemento clicável. Não criar um terceiro padrão de toggle.

Detalhe de compatibilidade: a prop `item.evento` passada para `Timeline` pelo `Filotec_Aula_01.jsx` é uma função (`() => <FormattedText text={item.evento} />`), não uma string direta — isso já era assim antes da mudança (para suportar negrito `**texto**` dentro do evento). O `Timeline.jsx` precisa checar `typeof item.evento === 'function' ? item.evento() : item.evento` para continuar funcionando tanto com strings simples (uso futuro mais simples) quanto com a forma função atual.

Detalhe de HTML válido: o marcador circular (`absolute -left-[14px]...`) e o card de conteúdo são dois `<button>` **irmãos** dentro da mesma `div` de item — ambos chamam o mesmo `toggleItem(index)`. Não aninhar um `<button>` dentro do outro (inválido em HTML). Evitar `<h4>` dentro de um `<button>` — usar `<span>` com estilo equivalente, pois headings não são "phrasing content" e tecnicamente não deveriam ir dentro de button.
