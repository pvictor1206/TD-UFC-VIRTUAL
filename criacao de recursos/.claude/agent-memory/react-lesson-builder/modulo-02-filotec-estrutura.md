---
name: modulo-02-filotec-estrutura
description: Estrutura de arquivos do Módulo 2 (Filosofia da Tecnologia, Aula 02 — Vieira Pinto cap. 1-4) e introdução de roteamento multi-aula no App.jsx
metadata:
  type: project
---

O Módulo 2 / Aula 02 ("O Conceito de Tecnologia, Vol. 1 — Álvaro Vieira Pinto em Face da Era Tecnológica") foi criado em 2026-06-23, espelhando a estrutura do [[modulo-01-filotec-estrutura]]:

- Documento fonte: `public/AGENTE FILOTEC AULA 2 EAD.docx` (com comentários de revisão no docx, autora "Thais Gomes Carlos", contendo diretivas de design: "Caixa de texto"/"Quadro de texto" → blocos de destaque, "dropdown" → `DropdownContent`, "Linha lateral do texto" → borda lateral azul, "Cada capítulo um dropdown" → um dropdown por capítulo na síntese final. Também havia um comentário extenso do revisor "Robson Carlos Loureiro (RoLo)" sobre Derrick de Kerckhove/"Narcose de Narciso" que foi tratado como nota de contexto do revisor, não incorporado ao conteúdo didático principal — não é texto do corpo do documento, é comentário de revisão suplementar).
- Conteúdo estruturado: `src/assets/content_Modulo_02/filotec_aula_02.json` — mesmo formato (`aula`, `disciplina`, `titulo`, `objetivo`, array `sections`).
- Componente da página: `src/components/Modules/Module-02/Filotec_Aula_02.jsx`.
- Imagens: `src/assets/imgs/filotec_aula_02/image1.png` ... `image9.png` (9 imagens, todas referenciadas no fluxo do docx — nenhuma órfã).
- Rota: `/aula-02` em `src/App.jsx`.

**Tipo de seção novo introduzido nesta aula** (não existia na Aula 01): `dropdown` — um único `DropdownContent` solto (não em grid), usado quando o docx tinha uma marcação `[dropdown]` isolada entre blocos de texto corrido, em vez de várias marcações agrupadas (que continuam mapeando para `dropdown_group`). Diferença de `dropdown_group`: este não tem `title`/`subtitle` de seção nem grid, é renderizado direto com `title`+`content` do próprio item.

**Extensões em tipos de seção já existentes:**
- `image` agora aceita campo opcional `caption` (legenda abaixo da imagem, usada na Aula 02 para repetir a pergunta retórica "Isso faz parte natural do cotidiano?" nas 3 primeiras tirinhas). Renderizado dentro de `<figure>/<figcaption>`, em vez do `<div>` simples da Aula 01.
- `final_section` agora aceita campo opcional `conclusion` (renderizado via `QuoteCard`, reaproveitando o padrão visual do `dropdown_section` da Aula 01) — a Aula 01 não usava esse campo no `final_section`, mas a Aula 02 tinha uma citação de encerramento "Esse arcabouço teórico oferece instrumentos..." que pedia esse tratamento.
- `highlight_section.text` e itens de `dropdown`/`dropdown_group`/`vieira_pinto_section` passam por um `FormattedText` que agora também detecta bullets `•` dentro de texto com `**bold**` misturado (a Aula 01 tinha um helper `FormattedText` mais simples só com regex de `**`; na Aula 02 o helper foi expandido para também quebrar por linha e tratar `•` como lista, replicando a lógica que já existia *dentro* do `DropdownContent` nativo, mas agora reutilizável em qualquer seção que precise de bullets + negrito juntos).

**Imagens mapeadas por contexto** (para referência caso precise ajustar alt-text/posição depois):
- image9: tirinha 3 quadros, homem correndo para pegar ônibus (Lugar A — "isso faz parte natural do cotidiano?")
- image3: fila de carrinhos de compras (Lugar B)
- image8: contraste carrinho de dinheiro vs. pobreza/fogueira (Lugar C)
- image5: humano "plugado" numa máquina verde futurista (Lugar D — alienação tecnológica)
- image7: cidade tomada pela vegetação (Lugar E — natureza transformada/embaralhada)
- image4: tirinha "Sanguessuga Cell" — fábrica/loja/compra parcelada (Lugar F — crítica ao consumismo tech)
- image2: tirinha "se você não tem, não é ninguém" / EPOW / "eu sou alguém" (Lugar G — fetiche da mercadoria/tecnologia)
- image1: robô perguntando "tem certeza que estou parecendo natural?" ao lado de humano desenhando sob árvore (Lugar H)
- image6: diálogo 2 quadros sobre aprender vs. copiar da tecnologia (antes da seção "A Tecnologia")

## Decisão de roteamento (App.jsx) — implementada sem confirmação prévia do usuário

Antes só existia uma rota (`/` → `Filotec_Aula_01` direto). Com a Aula 02, mudei para:
- `/` → `<Navigate to="/aula-01" replace />` (preserva o comportamento de quem acessava a raiz antes)
- `/aula-01` → `Filotec_Aula_01`
- `/aula-02` → `Filotec_Aula_02`
- `*` → `<Navigate to="/" replace />`

Também adicionei um link de navegação simples entre aulas (`<Link>` do `react-router-dom`) no final do conteúdo de cada página, antes do `<footer>`: "Próxima aula: Aula 02 →" na Aula 01, "← Aula anterior: Aula 01" na Aula 02. Isso porque sem isso a Aula 02 ficaria acessível só por URL direta, sem nenhum ponto de entrada na UI.

**Why:** A ferramenta AskUserQuestion não estava disponível neste ambiente/sessão (`ToolSearch` não encontrou). Como o prompt da tarefa pedia para perguntar "se tiver dúvida real sobre qual comportamento de navegação o usuário prefere", mas a ferramenta de pergunta não pôde ser usada, segui com a opção mais conservadora (preserva o comportamento atual da raiz, adiciona o mínimo de navegação necessária para não esconder a Aula 02) e documentei a decisão explicitamente no resumo final para o usuário poder corrigir se preferir outra UX (ex: uma página índice de aulas, ou Sidebar/NavBar do `MainLayout` que já existe em `src/components/layout/` mas não está em uso ativo).

**How to apply:** Se o usuário pedir uma Aula 03 no futuro, seguir o mesmo padrão de rota explícita (`/aula-03`) e considerar se já vale a pena nesse ponto introduzir o `MainLayout`/`Sidebar` (ver `src/components/layout/`) como navegação global em vez de continuar empilhando links manuais de "próxima/anterior" — com 3+ aulas isso pode começar a valer a pena. Perguntar ao usuário antes de migrar para `MainLayout`, pois é uma mudança estrutural maior que afeta as duas aulas existentes.

Build (`npm run build`) e lint (`npm run lint`) validados sem erros após a criação da Aula 02.

## Rodada de revisão de estilo (2026-06-24) — 4 ajustes pontuais do professor

Após a criação inicial, o usuário (professor, revisor pedagógico) pediu 4 ajustes de estilo/layout na Aula 02, todos implementados em `Filotec_Aula_02.jsx`, `filotec_aula_02.json`, `HighlightBlock.jsx` e `AccessibilityControls.jsx` (`src/components/ui/AccessLink/AccessibilityControls.jsx`):

1. **Padronização de fonte do corpo de texto para 16px.** Havia 3 esquemas de tamanho coexistindo: `intro` com `fontSize: '1.2em'`; `highlight_section` com classes Tailwind Typography `prose prose-slate lg:prose-xl` (tamanho diferente mobile/desktop); e `DropdownContent` com props hardcoded `contentFontSizeMobile/Desktop = "14px"/"15px"`. Resolvido tornando todos `1em` (removendo as classes `prose`/`prose-xl`) e mudando o estado base `fontSize` em `Filotec_Aula_02.jsx` de `useState(18)` para `useState(16)`, já que o container raiz aplica `fontSize: ${fontSize}px` e todo o resto herda via `em`. **Decisão de design:** 16px passou a ser o novo padrão/default da página (não um valor absoluto imune a zoom), preservando o `AccessibilityControls` (`+`/`-`/reset) que continua escalando a partir dele. O componente `AccessibilityControls` (compartilhado, em `src/components/ui/AccessLink/`) ganhou uma prop nova `defaultSize = 18` (fallback preserva comportamento anterior para outros usos futuros) usada pelo botão de reset; a Aula 02 passa `defaultSize={16}` explicitamente. As 4 chamadas de `DropdownContent` na página agora passam `contentFontSizeMobile="1em" contentFontSizeDesktop="1em"` explicitamente (não mudei o default do componente `DropdownContent` em si, para não afetar outros módulos que possam vir a usá-lo sem essa necessidade).
2. **Layout vertical seletivo em `dropdown_group`.** O JSON ganhou um campo opcional novo `"layout": "vertical"` no nível da seção (usado hoje só na seção `"O discurso da \"Era Tecnológica\""`). No JSX, `case 'dropdown_group'` agora é um block statement que lê `section.layout === 'vertical'` para escolher entre `grid-cols-1` (vertical) ou `grid-cols-1 md:grid-cols-2` (grid padrão, default quando o campo não existe). As outras 2 seções `dropdown_group` do JSON ("A natureza transformada", "\"A Tecnologia\"") não têm esse campo e continuam em grid de 2 colunas.
3. **`final_section` (Síntese dos Capítulos 1-4) virou empilhamento vertical total** (`grid grid-cols-1 gap-4`, antes era `md:grid-cols-2`) — única instância desse tipo no JSON, alterado globalmente no `case 'final_section'` sem campo de schema novo (não havia risco de afetar outra seção).
4. **Negrito indevido removido.** No `dropdown_group` "\"A Tecnologia\"", item "Tecnologia como o logos da técnica" — o campo `content` inteiro estava envolto em `**...**` (diferente dos outros 3 itens do mesmo grupo). Removidos os `**` do início/fim para padronizar.
5. **`HighlightBlock` (`src/components/ui/HighlightBlock/HighlightBlock.jsx`) ganhou `text-left` explícito no `<p>`** — antes herdava `text-align: center` da regra legada `#root { text-align: center }` em `src/App.css`. Fix local ao componente, sem tocar a regra global (outras partes da página dependem dela ou já fazem override pontual).
6. **`QuoteCard` final do `final_section` perdeu a restrição de largura.** O wrapper `<div className="max-w-2xl mx-auto ...">` em torno do `QuoteCard` de conclusão foi simplificado para `<div className="pt-4 border-t ...">`, sem `max-w-2xl mx-auto` — agora ocupa a largura total do container padrão (`max-w-[1000px]` do wrapper externo da página), igual aos demais quadros.

**Observação à parte (não é um ajuste pedido, é um fato notado durante a investigação):** neste branch (`Aula-02-Filosofia-Tecnologia-EaD`), `src/components/Modules/` só contém `Module-02/Filotec_Aula_02.jsx` — `Module-01`/`Filotec_Aula_01.jsx` (referenciado em [[modulo-01-filotec-estrutura]] e na seção de roteamento acima) não existe nesta árvore de arquivos atual. Pode estar em outro branch ou ter sido removido/renomeado. Antes de assumir que a Aula 01 existe ou de propor mudanças que afetem ambas as aulas, confirmar com `Glob`/`git log` qual é o estado real do branch corrente.

Build (`npm run build`) e lint (`npm run lint`) validados sem erros após esta rodada de ajustes.
