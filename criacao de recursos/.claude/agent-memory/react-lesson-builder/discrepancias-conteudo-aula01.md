---
name: discrepancias-conteudo-aula01
description: Tipo de erro recorrente encontrado ao comparar filotec_aula_01.json com o .docx fonte — diálogos parafraseados/truncados, não apenas erros de digitação
metadata:
  type: project
---

Ao comparar `src/assets/content_Modulo_01/filotec_aula_01.json` com `public/FILOTEC AULA 1 EAD.docx` (Aula 01, Filosofia da Tecnologia), descobri que os campos `dialogue` das duas seções `type: "story"` ("O Buteco, o cara e o outro cara" e "Cafeteria, chuva e smartphone") não eram só diferenças triviais de formatação — em ambos os casos, o JSON tinha o **início correto** do diálogo (igual ao docx, palavra por palavra) mas a partir de um certo ponto **divergia para um texto parafraseado e mais curto**, inventado/resumido, cortando entre 40-50% do conteúdo original do docx (incluindo falas inteiras sobre Vieira Pinto, subdesenvolvimento, autoprodução na segunda história, e sobre "senso comum", autonomia de pensamento, situamento histórico na primeira história).

**Why:** Isso sugere que alguma versão anterior do conteúdo foi resumida/reescrita manualmente ou por IA sem preservar fidelidade ao documento fonte, e ninguém comparou linha a linha depois. Corrigido substituindo o campo `dialogue` completo pelo texto integral do docx (preservando estilo de `\n` por fala/narração e marcação `**bold**` já estabelecida para termos como "logos"/"técnica").

**How to apply:** Em qualquer nova revisão de conteúdo deste projeto (ou outros módulos), não assumir que o início de um campo de texto longo bate com o doc só porque as primeiras frases coincidem — sempre comparar o texto **completo até o fim**, especialmente em campos `dialogue`/`story` que tendem a ser longos e fáceis de truncar/resumir silenciosamente.

Também foi encontrado, na seção `timeline` da Aula 01, um marco ausente: o docx lista **dois marcos distintos para Álvaro Vieira Pinto** ("1959-1960" sobre Consciência e Realidade Nacional / O Conceito de Tecnologia, e um marco separado "1960" sobre o desenvolvimento de sua crítica própria ligada ao desenvolvimento nacional) — o JSON só tinha o primeiro. Ver [[modulo-01-filotec-estrutura]] para o restante da estrutura da Aula 01.
