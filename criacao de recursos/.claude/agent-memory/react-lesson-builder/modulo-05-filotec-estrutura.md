---
name: modulo-05-filotec-estrutura
description: Estrutura de arquivos do Módulo 5 (Filosofia da Tecnologia, Aula 05 — Hans Jonas, Ético-Limitadora) e estado atual do roteamento em App.jsx
metadata:
  type: project
---

O Módulo 5 / Aula 05 ("Hans Jonas — Filosofia como Ético-Limitadora da Ação Científica") foi criado em 2026-07-06, substituindo a Aula 04 neste branch. Espelha a estrutura dos módulos anteriores.

- Documento fonte: `public/Agente IA FILOTEC AULA 5 EAD.docx` (comentários de revisão: autora "Thais Gomes Carlos", revisores "RoLo" e "Eduardo Ferreira"). Diretivas de design: "caixa de texto de referência" → `reference_box`, "quadro de texto" → `highlight_section`, "dropdown para cada ator" → `dropdown_group`, "cards"/"título em bold e cards para cada bullet point" → `dropdown_group` com layout vertical, "tabela" → `dropdown_group` vertical (Diálogo com outros autores), "Quadro de texto, e vídeo" → `highlight_section` + `story` + `video`.
- Conteúdo estruturado: `src/assets/content_Modulo_05/filotec_aula_05.json` — mesmo formato (`aula`, `disciplina`, `titulo`, `objetivo`, array `sections`).
- Componente da página: `src/components/Modules/Module-05/Filotec_Aula_05.jsx`.
- Imagens: `src/assets/imgs/filotec_aula_05/image1.png`, `image2.png`, `image3.png`, `image4.png` (4 imagens extraídas do docx).
- Rota: `/` (raiz) em `src/App.jsx` — este branch só tem a Aula 05.

## Seções do documento

1. `intro` — abertura informal ("Vamos conhecer um pouco mais...")
2. `highlight_section` — Hans Jonas: obra central + tese principal
3. `reference_box` — citação longa do Princípio Responsabilidade (filosofia como limite ético)
4. `intro` — "Jonas propõe um imperativo..."
5. `reference_box` — O imperativo: "Aja de modo que os efeitos da tua ação..."
6. `intro` — "Ou seja, a ciência e a técnica não podem ser orientadas apenas pelo lucro..."
7. `intro` — comentário informal do professor ("Tá, conta outra agora…")
8. `highlight_section` — Ciência e Técnica: Curiosidade, Financiamento, Mercado e Poder (quadro de texto)
9. `dropdown_group` — Os Atores da Coprodução Científica (Jasanoff, Kitcher, Feenberg)
10. `dropdown_group` — A Técnica: Do Local ao Global (3 cards: local→global, irreversibilidade, risco existencial)
11. `dropdown_group` — Exemplos Pragmáticos (4 cards: Energia Nuclear, CRISPR, Mudanças Climáticas, IA)
12. `image` — image1.png (infográfico nuclear)
13. `image` — image3.png (CRISPR)
14. `image` — image4.png (IA)
15. `dropdown_group` — O Problema Prático (Regulação Externa, Pressão Social, Ampliação da Responsabilidade)
16. `image` — image2.png (conflito responsabilidade vs. interesse privado)
17. `dropdown_group` — Diálogo com Outros Autores (Jonas vs. Heidegger/Ellul, Marcuse, Vieira Pinto) — era "tabela" no docx
18. `highlight_section` — Considerações
19. `story` — PROTOCOLO AURORA (história filosófica com Helena, filósofa consultora ético-limitadora)
20. `video` — Google Drive embed, driveId: `1G9jLDutH8Xnwl89FbnjfGHV63Oth6MP8`

## Posição das imagens no DOCX (para referência futura)

- image1.png: para 55 — dentro do bloco Energia Nuclear (infográfico LEU vs HEU)
- image3.png: para 89 — dentro do bloco Edição Genética / CRISPR
- image4.png: para 98 — dentro do bloco Inteligência Artificial (compartilha parágrafo com o texto "Inteligência Artificial")
- image2.png: para 108 — entre "Como Jonas pode ser aplicado ao mundo dos empresários?" e "Regulação Externa"

## Roteamento (App.jsx) — estado atual do branch Aula-05

Este branch tem apenas Aula 05:
- `/` → `Filotec_Aula_05`
- `*` → `<Navigate to="/" replace />`

Todas as referências à Aula 04 foram removidas (pastas Module-04, content_Modulo_04, imgs/filotec_aula_04 deletadas).

## Nota sobre text com `>` na story

Parágrafos que começam com `>` no DOCX (blockquote style — avisos, relatórios, diálogos de sistema) foram convertidos em strings com `<em>...</em>` tags inline no JSON, para renderização com `dangerouslySetInnerHTML` no componente de story.

## Build validado

npm run build: 75 modules, 1.83s, zero erros. (2026-07-06)
