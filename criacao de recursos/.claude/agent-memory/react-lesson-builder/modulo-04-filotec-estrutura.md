---
name: modulo-04-filotec-estrutura
description: Estrutura de arquivos do Módulo 4 (Filosofia da Tecnologia, Aula 04 — Vieira Pinto Resumo Integrado + Gerações Atuais) e estado atual do roteamento em App.jsx
metadata:
  type: project
---

O Módulo 4 / Aula 04 ("O Conceito de Tecnologia, Vol. 1 — Álvaro Vieira Pinto: Resumo Integrado") foi criado em 2026-07-06, espelhando a estrutura do [[modulo-02-filotec-estrutura]]:

- Documento fonte: `public/AGENTE IA FILOTEC AULA 4 EAD.docx` (com comentários de revisão no docx, autora "Thais Gomes Carlos", revisores "RoLo" e "Eduardo Ferreira"). Diretivas de design: "Caixa de texto" → `highlight_section`, "Cada capítulo, um dropdown" → `vieira_pinto_section`, "Cada autor, um dropdown" → `dropdown_group`, "Linha lateral do texto" → `highlight_section` com borda azul esquerda, "Caixa de referência" → `reference_box`.
- Conteúdo estruturado: `src/assets/content_Modulo_04/filotec_aula_04.json` — mesmo formato (`aula`, `disciplina`, `titulo`, `objetivo`, array `sections`).
- Componente da página: `src/components/Modules/Module-04/Filotec_Aula_04.jsx`.
- Imagens: `src/assets/imgs/filotec_aula_04/image1.jpg`, `image2.jpg`, `image3.jpg` (3 imagens extraídas do docx).
- Rota: `/` (raiz) em `src/App.jsx` — este branch só tem a Aula 04, sem multi-aula.

## Novos tipos de seção introduzidos nesta aula (não existiam na Aula 02)

- **`story`**: Narrativas didáticas longas ("CONDOMÍNIO TECNO-HUMANO HORIZONTE VIVO" e "O Protesto da Geladeira"). Estrutura JSON: `label` (ex: "HISTÓRIAS FILOSÓFICAS"), `title` (subtítulo da história), `paragraphs` (array de strings). Renderizados com header azul-marinho e corpo em `p` tags com `dangerouslySetInnerHTML` para tratar `**bold**`. Usando `font-normal` (não `font-serif italic` para manter legibilidade em textos longos).
- **`reference_box`**: Caixa de referência bibliográfica (Foucault e similares). Estrutura JSON: `text` (citação), `citation` (referência bibliográfica). Renderizado com `ReferenceInfoBox` do `@ui`, com cores `bg-eff6ff` / `borderColor="#1e40af"`.
- **`video`**: Embed de Google Drive (não YouTube). Estrutura JSON: `driveId` (ID do arquivo no Drive), `title`. Renderizado com `<iframe>` nativo apontando para `https://drive.google.com/file/d/{driveId}/preview` (ratio 16:9 via `paddingBottom: 56.25%`). **Nota:** `VideoEmbed` do `@ui` só suporta YouTube (recebe `videoId`); para Google Drive é necessário usar iframe inline.

## Roteamento (App.jsx) — estado atual do branch Aula-04

Este branch (`Aula-04-Filosofia-Tecnologia-EaD`) tem apenas Aula 04:
- `/` → `Filotec_Aula_04`
- `*` → `<Navigate to="/" replace />`

Todas as referências à Aula 02 foram removidas do App.jsx.

## Imagens mapeadas por contexto

- image3.jpg: posição 20 no XML — após a lista das 5 linhas de reflexão da FiloTec, antes do "[Cada capítulo, um dropdown]"
- image1.jpg: posição 29 no XML — após Cap. 4 text, antes de "Na Parte Dois"
- image2.jpg: posição 32 no XML — após "Na Parte Dois" (Razão Técnica), antes de "[Linha lateral do texto]"

As imagens são representações visuais sugeridas por RoLo nos comentários do docx (infográficos não produzidos ainda); os alt texts descrevem os conceitos que deveriam ilustrar.

## Decisão de roteamento

O task description pediu explicitamente para "substituir Aula 02 por Aula 04" neste branch. Portanto, a rota raiz `/` aponta diretamente para `Filotec_Aula_04`, sem multi-aula e sem Navigate. Se no futuro o usuário quiser multi-aula neste branch, seguir o padrão de [[modulo-02-filotec-estrutura]] (rotas explícitas `/aula-04`, `/aula-XX` com Navigate na raiz).

Build (`npm run build`) validado sem erros após criação da Aula 04 (2.43s, 74 modules).
