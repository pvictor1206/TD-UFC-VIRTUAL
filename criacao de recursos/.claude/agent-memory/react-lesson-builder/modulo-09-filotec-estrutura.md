---
name: modulo-09-filotec-estrutura
description: Estrutura de arquivos do Módulo 9 (Filosofia da Tecnologia, Aula 09 — 7 filósofos contemporâneos mais citados: Yuk Hui, Verbeek, Coeckelbergh, Winner, Feenberg, Ihde, Simondon) e estado atual do roteamento em App.jsx
metadata:
  type: project
---

O Módulo 9 / Aula 09 ("Filósofos da Tecnologia Mais Citados em Universidades de Renome") foi criado em 2026-07-07, substituindo a Aula 08 neste branch (`Aula-09-Filosofia-Tecnologia-EaD`). Diferente de Aulas 07/08 (que continuavam a numeração de "Filósofas Críticas da Tecnologia"), a Aula 09 abre uma **nova linha temática independente** — um ranking dos filósofos contemporâneos da tecnologia mais citados academicamente — com numeração própria 1-7 (não continua a numeração 1-5 de Haraway...Mies das aulas anteriores). Curiosamente Gilbert Simondon já havia aparecido como linha de tabela no quadro-resumo geral da Aula 08; aqui ele ganha uma seção própria completa e aprofundada.

- Documento fonte: `public/Agente IA FILOTEC AULA 9 EAD.docx` (revisora "Thais Gomes Carlos", mesmo padrão Google-Docs-export). **2 imagens embutidas** (`word/media/image1.png` = infográfico Yuk Hui via `rId9`, `image2.png` = infográfico Peter-Paul Verbeek via `rId10`, confirmado em `word/_rels/document.xml.rels`).
- Imagens salvas em `src/assets/imgs/filotec_aula_09/` como `yuk_hui_infografico.png` e `peter_paul_verbeek_infografico.png`.
- Conteúdo estruturado: `src/assets/content_Modulo_09/filotec_aula_09.json` (38 sections — a aula mais extensa até agora).
- Componente da página: `src/components/Modules/Module-09/Filotec_Aula_09.jsx`.
- Rota: `/` (raiz) em `src/App.jsx`.

## Achado importante: apenas 2 de 7 infográficos foram de fato embutidos
O docx tem o marcador de texto `"[infográfico]"` repetido para **todos os 7 autores** (Yuk Hui, Verbeek, Coeckelbergh, Winner, Feenberg, Ihde, Simondon), mas ao inspecionar `r:embed` no XML só existem 2 imagens reais (`rId9`, `rId10`), correspondentes a Yuk Hui e Verbeek. Os outros 5 marcadores são placeholders sem imagem correspondente. Isso é confirmado por um comentário de revisão da própria Thais (`w:id="3"`, ancorado logo no início do documento): **"validar texto com o professor Robson, pedir desenhos ao Eduardo"** — ou seja, os infográficos dos 5 autores restantes ainda não foram encomendados/produzidos por um ilustrador (Eduardo). Segui o mesmo princípio já aplicado em [[modulo-06-filotec-estrutura]] (vídeo pendente): **não inventei imagens/placeholders** para esses 5 autores — apenas Yuk Hui e Verbeek têm `type: "image"` no JSON. Reportado ao usuário no resumo final.

## Comentário de vídeo sugerido, mas sem conteúdo (não implementado)
Comentário `w:id="0"` (Thais), ancorado no título "AULA 9": **"Sugerir um vídeo explicando o conteúdo dessa aula"** — é uma sugestão de pauta para produção futura, sem nenhum ID de vídeo/Drive associado em nenhum lugar do documento. Diferente de aulas anteriores (04/05) que tinham `driveId` real, aqui não há vídeo algum a embutir. Nenhuma section `video` foi criada — mantive apenas o `case 'video'` no switch por consistência de padrão, sem uso real.

## Instrução explícita de reordenação: tabela comparativa movida para o fim
Comentário `w:id="1"` (Thais), ancorado logo no início do documento sobre a grande tabela comparativa (7 autores × 8 colunas: Autor, Conceito Central, Visão da Tecnologia, Relação Humano-Técnica, Crítica Principal, Conceitos-Chave, Dimensão Política/Ética, Exemplos Práticos): **"Sugerir essa tabela comparativa ao fim do conteúdo"**. Embora essa tabela apareça logo após o título no documento fonte, ela foi **deliberadamente reposicionada para o final do JSON** (penúltima section, logo antes do "Resumo Visual"), atendendo à instrução explícita da revisora. Esta é uma diretiva de reordenação de conteúdo, não apenas de escolha de componente — vale destacar para o usuário caso ele espere a ordem literal do docx.

## Numeração inconsistente no docx original (renumerada por mim)
Os cabeçalhos de cada autor no docx trazem números avulsos e inconsistentes (Yuk Hui="1.", Verbeek="1." também, Coeckelbergh="2.", Winner sem número, Feenberg="3.", Ihde="4.", Simondon="5."), aparentemente por artefato de edição/cópia (não uma verdadeira sequência 1-7). **Renumerei sequencialmente 1 a 7** (Yuk Hui, Verbeek, Coeckelbergh, Winner, Feenberg, Ihde, Simondon) nos títulos dos `highlight_section`, respaldado pela ordem consistente em que os mesmos 7 nomes aparecem no "Resumo Visual" final (posições 3ª a 9ª do ranking geral, envolvendo Floridi e Latour antes e Jonas depois — mas entre si, sempre na mesma ordem). Reportado ao usuário como decisão editorial, não uma escolha arbitrária.

## Apêndice exclusivo de Simondon: aprofundamento filosófico
Só para Simondon, após a "Conclusão" padrão, o documento traz um trecho extra único (~90 parágrafos) fundamentando a tese "a técnica não é só ferramenta, mas um ser em individuação". Mapeado como:
- `dropdown_group` "🧩 Três Pilares da Individuação Técnica" (3 items curtos, marcador literal `"[dropdown]"`).
- `dropdown_group` "🧩 Como Fundamentar: Técnica, Humanos e Individuação" (4 items longos, sem marcador de componente explícito no docx — **análise proativa**: dado o mesmo padrão numerado 1-4 com bullets recorrente em toda a aula, tratei como dropdown_group por consistência, seguindo GEMINI.md seção 5).
- `conclusion` (QuoteCard) para a citação-síntese entre aspas marcada explicitamente como `"[linha lateral do texto]"` — a única vez nesta aula que `conclusion` é usado **no meio do conteúdo**, não só no fechamento, porque o marcador pedia tratamento visual de destaque lateral/pull-quote (função que o `QuoteCard` já cumpre). **Atenção:** `QuoteCard` renderiza `{quote}` como texto puro (sem `dangerouslySetInnerHTML`), então removi manualmente os `**negrito**` desse trecho específico antes de usá-lo como `conclusion` — diferente de `highlight_section`/`dropdown_group`, que passam por `FormattedText` e suportam markdown.
- `highlight_section` "Exemplo Prático: Inteligência Artificial" e `highlight_section` "Conclusão" final (esta última era o marcador `"[quadro de texto]"`, mapeado como de costume para container de destaque).

## Nenhum componente novo criado
Toda a aula (a mais longa até agora, 38 sections) foi montada 100% reaproveitando os tipos já existentes: `intro`, `highlight_section`, `image`, `dropdown_group`, `bullet_cards`, `data_table`, `conclusion`. Nenhuma seção `story` ou `reference_box` nesta aula.

## Build validado
`npm run build`: 73 modules, 2.46s, zero erros (2 infográficos PNG ~693KB cada no bundle). `npm run lint`: zero erros/warnings. (2026-07-07)
Grep por "08" em `src/` após remoção do Módulo 08: só resta `src/assets/react.svg` (ícone boilerplate do Vite, falso positivo já visto em aulas anteriores).

Nota lateral: o arquivo `public/Agente IA FILOTEC AULA 8 EAD.docx` já não existia no working tree quando iniciei esta tarefa (aparece como deletado no `git status`, presumivelmente removido pelo usuário antes de me acionar) — não fui eu quem o removeu, mas está alinhado com o objetivo de não deixar vestígios da Aula 08.
