---
name: modulo-06-filotec-estrutura
description: Estrutura de arquivos do Módulo 6 (Filosofia da Tecnologia, Aula 06 — Umberto Galimberti, crítica à ciência sem filosofia) e estado atual do roteamento em App.jsx
metadata:
  type: project
---

O Módulo 6 / Aula 06 ("A Crítica à Ciência sem Filosofia — Umberto Galimberti") foi criado em 2026-07-06, substituindo a Aula 05 neste branch.

- Documento fonte: `public/Agente IA FILOTEC AULA 6 EAD.docx` (comentários de revisão: autora "Thais Gomes Carlos", revisor "RoLo"). Diretivas: "caixa de texto" → `highlight_section`, "bullet points" → lista com `•` no JSON, "quadro de texto e deixar em negrito cada título" → `highlight_section` com **bold** nos títulos, "dropdown" → `dropdown_group`, "linha lateral do texto" → `highlight_section` com bordas, "manter os títulos em bold e fazer cards de cada bullet point" → `dropdown_group` vertical, "cards" → `dropdown_group` vertical, "tabela" → `dropdown_group` vertical.
- Conteúdo estruturado: `src/assets/content_Modulo_06/filotec_aula_06.json`.
- Componente da página: `src/components/Modules/Module-06/Filotec_Aula_06.jsx`.
- Imagens: `src/assets/imgs/filotec_aula_06/image1.png` (1 imagem extraída do docx, posição para 5 — entre a introdução e o bloco "A cegueira da ciência sem filosofia").
- Rota: `/` (raiz) em `src/App.jsx` — este branch só tem a Aula 06.

## Seções do documento

1. `highlight_section` — Galimberti: obra-chave + tese central
2. `image` — image1.png
3. `highlight_section` — A Cegueira da Ciência sem Filosofia (caixa de texto)
4. `highlight_section` — A Função Crítica da Filosofia
5. `highlight_section` — Impactos da Separação (quadro de texto, títulos em bold: Cega eticamente, politicamente, existencialmente)
6. `dropdown_group` — Exemplos Concretos (IA, Biotecnologia, Ecologia)
7. `intro` — "Para Galimberti, a ciência precisa da filosofia como limite..."
8. `highlight_section` — "Por que a Filosofia — e não outra área — deve cumprir esse papel?" (linha lateral do texto)
9. `dropdown_group` — 4 subsections: Ciência parcial, Filosofia reflexiva/totalizante, Guardiã da ética, Diálogo entre saberes
10. `highlight_section` — Considerações (inclui os cards como bullets e conclusão)
11. `dropdown_group` — Cruzamento com outros autores (Heidegger, Jonas, Vieira Pinto) — era "tabela" no docx

## Nota: sem vídeo nesta aula

O comentário de revisão ID:7 ("vídeo sobre o assunto, @matheus.unfer@virtual.ufc.br") indica que um vídeo foi planejado mas **nenhuma URL foi fornecida no documento**. A seção de vídeo foi omitida — quando o ID do Drive estiver disponível, adicionar uma seção `video` com `driveId` no JSON.

## Nota: sem story/história nesta aula

A Aula 06 não possui seção narrativa ("Histórias de Filosofia"). O documento é mais conciso e direto, focando na argumentação filosófica.

## Build validado

npm run build: 72 modules, 2.27s, zero erros. (2026-07-06)
