---
name: modulo-11-filotec-estrutura
description: Estrutura de arquivos do Módulo 11 (Filosofia da Tecnologia, Aula 11 — Neil Postman, Byung-Chul Han, Bernard Stiegler e Umberto Galimberti) e estado atual do roteamento em App.jsx
metadata:
  type: project
---

O Módulo 11 / Aula 11 ("Postman, Han, Stiegler e Galimberti: A Crítica Cultural à Tecnologia e os Cidadãos Despotencializados") foi criado em 2026-07-07, substituindo a Aula 10 neste branch (`Aula-11-Filosofia-Tecnologia-EaD`). Continua a linha de "filósofos da crítica cultural/tecnológica" mas muda o eixo: em vez de ranking de "mais citados" (Aulas 09-10), o tema é a formação de "cidadãos despotencializados" — sujeitos que perdem autonomia crítica sob a lógica da técnica, com ênfase nos efeitos sobre a juventude.

- Documento fonte: `public/Agente IA FILOTEC AULA 11 EAD.docx` (revisora "Thais Gomes Carlos", mesmo padrão Google-Docs-export, 22 comentários em `word/comments.xml`, 241 parágrafos com texto — a aula mais longa desta série até agora). **Sem imagens embutidas** — não existe pasta `word/media` nem `r:embed` de imagem em `word/_rels/document.xml.rels` (só rels de tema/settings/fontTable/numbering/styles/customXml/commentsExtended). `Filotec_Aula_11.jsx` não define `imageMap`.
- Conteúdo estruturado: `src/assets/content_Modulo_11/filotec_aula_11.json` (40 sections — cobrindo 4 autores com exposições bem mais longas e menos "dropdown-cêntricas" que Aulas 09-10).
- Componente da página: `src/components/Modules/Module-11/Filotec_Aula_11.jsx`.
- Rota: `/` (raiz) em `src/App.jsx`.

## Regra de mapeamento literal consolidada nesta aula
Confirmado com múltiplas ocorrências no mesmo docx: `[caixa de texto]` e `[quadro de texto]` (comentários "caixa de texto"/"quadro de texto") → sempre `highlight_section` (HighlightBlock); `[linha lateral do texto]` → sempre `conclusion` (QuoteCard). Nesta aula havia as duas variantes de nome ("caixa de texto" vs "quadro de texto") tratadas como sinônimos — tratamento idêntico, só muda o texto do comentário, não a semântica.

## Ilustração pedida mas não entregue ("Adicionar uma charge")
Comentário `w:id="6"` "Adicionar uma charge" está ancorado exatamente no mesmo parágrafo (bloco Obra/Crítica/citação de Byung-Chul Han sobre a juventude) onde também há o comentário `w:id="7"` "cards" — ou seja, a revisora pediu simultaneamente o tratamento em card E uma ilustração/charge para esse trecho. Nenhuma imagem foi encomendada/anexada no docx (sem pasta `word/media`). Documentado em comentário no topo do `.jsx` e reportado ao usuário; **nenhum placeholder foi inserido**, seguindo a lição já estabelecida (comentários de revisão que pedem material ainda não produzido não devem ser preenchidos com imagem inventada).

## Numeração de autores com lacuna (não é colisão)
Diferente da Aula 10 (colisão de números duplicados no dropdown de Berardi), aqui o problema é uma **lacuna**: os títulos dos autores no docx são literalmente "Neil Postman (1931–2003)" (sem número), "2. Byung-Chul Han", "4. Bernard Stiegler", "5. Umberto Galimberti (1942– ) – filósofo italiano" — pula o número "3" inteiramente, sem que exista um terceiro autor no documento. Mantive os números literais dos títulos (não renumerei para 1-2-3-4) e reportei a lacuna ao usuário, em vez de inventar ou remover um autor. Mesmo critério de "reportar em vez de resolver sozinho" usado para a colisão de Berardi na Aula 10 ([[modulo-10-filotec-estrutura]]).

## Numeração interna do dropdown de Han (2-5, não 1-4)
O dropdown de Byung-Chul Han (`dropdown_group` "🧠 Byung-Chul Han e a Sociedade do Cansaço") tem itens literalmente numerados "2. Sociedade do desempenho...", "3. Psicopolítica digital", "4. O digital e a perda da negatividade", "5. Filosofia da Tecnologia em Han – síntese" — sem colisão, apenas começando em "2" (o "1" implícito é o bloco de contexto/bio, que fica fora do dropdown, no `highlight_section` anterior, replicando o padrão já visto com Floridi na Aula 10). Preservei a numeração literal e adicionei uma `subtitle` explicativa no próprio dropdown para não confundir o leitor.

## "Cada número um dropdown" sem números visíveis no texto extraído
O marcador `[cada número um dropdown]` (comentário id13, bloco da "prisão de Stiegler") cobre três parágrafos-título ("A experiência do pharmakon", "A experiência do tempo e da memória", "A técnica como possibilidade de individuação") que **não têm prefixo numérico no texto extraído** — isso ocorre porque a numeração é aplicada via lista automática do Word (`<w:numPr>`, renderizada a partir de `numbering.xml`), não como caractere literal dentro de `<w:t>`. Ao encontrar `BULLET=true` num parágrafo-título sem número visível junto de um comentário "cada número/item um dropdown", tratar como lista numerada automática e atribuir números sequenciais editorialmente (1, 2, 3...) no JSON, sem inventar conteúdo.

## Container aninhado: "caixa de texto" envolvendo um "cada-número-um-dropdown"
Um caso novo de aninhamento: o comentário `w:id="12"` "caixa de texto" cobre apenas a pergunta-título ("Por que a experiência da prisão é central para compreender Stiegler?") + o primeiro subtema ("A técnica como condição de sobrevivência e transformação"), enquanto o comentário seguinte `w:id="13"` "cada número um dropdown" cobre os **outros três** subtemas parativos do mesmo bloco temático. Interpretação aplicada: um único `highlight_section` externo (a "caixa de texto", com a pergunta como título e o primeiro subtema como texto) seguido de um `dropdown_group` separado (os 3 subtemas restantes) — em vez de tentar aninhar um dropdown DENTRO de um HighlightBlock (o que exigiria um componente novo). Essa divisão respeita ambos os comentários sem inventar um componente de "caixa com dropdown aninhado".

## "Tabela" usada para comparação de 2 autores lado a lado (não lista simples)
O comentário "tabela" (`w:id="16"`) no bloco "Exemplos práticos dessa conexão" (Stiegler x Foucault) virou um `data_table` de 3 colunas (Tema / Foucault / Stiegler), já que o conteúdo compara explicitamente a visão de dois pensadores sobre os mesmos 2 temas (Prisão, Redes sociais) — primeiro uso nesta série de `data_table` com estrutura "eixo temático x múltiplos autores" em vez de "autor x descrição". Já o comentário "tabela" anterior (`w:id="15"`, bloco só sobre Foucault) não tinha conteúdo tabular próprio e foi absorvido como texto corrido dentro do `highlight_section` da comparação — só o sub-bloco realmente comparativo (id16) virou tabela de fato.

## "Tabela" usada para lista simples de obras (1 coluna) — só quando explicitamente marcado
O comentário "tabela" (`w:id="2"`) sobre a lista "Principais obras" de Neil Postman virou um `data_table` de uma única coluna ("Obra"), por ser a única lista de obras explicitamente marcada como "tabela" nesta aula. As listas de obras análogas de Han, Stiegler e Galimberti ("Obras-chave", "Principais obras", "Obras centrais") **não têm comentário algum** e foram mantidas como bullet list simples dentro do `highlight_section` de contexto/bio — não uniformizei todas as 4 listas de obras para o mesmo tratamento, respeitando a marcação (ou ausência dela) específica de cada instância, mesmo authors sendo estruturalmente análogos entre si.

## Cards de abertura (Obra/Crítica/citação sobre jovens) aplicados por analogia para o 4º autor
Postman, Han e Stiegler têm o comentário "cards" explicitamente ancorado no bloco de abertura "Obra: X / Crítica: Y / [citação sobre jovens]". Galimberti tem a mesma estrutura de conteúdo (Obra + Crítica, sem linha de citação separada) mas **sem** comentário "cards" correspondente. Apliquei o mesmo tratamento visual por analogia (consistência estética entre os 4 perfis de autor, análise proativa per GEMINI.md §3.5), documentado aqui para transparência — não é uma diretiva explícita do docx para esse caso específico.

## Duas "Conclusões" para Stiegler (não é duplicação — mesmo padrão da Aula 10)
Assim como Berardi na Aula 10 ([[modulo-10-filotec-estrutura]]), Stiegler tem duas seções "Conclusão" distintas: uma fechando a mini-narrativa da prisão (parágrafos sobre pharmakon/Foucault) e outra fechando a exposição completa do autor (farmacologia da técnica, capitalismo cognitivo etc.). Textos totalmente diferentes, ambas mantidas.

## Typo preservado ("invitado" em vez de "convidado"/"hóspede")
O parágrafo final da seção "Juventude e niilismo" de Galimberti usa literalmente "o 'invitado inquietante' (o niilismo)" — provavelmente um resquício não traduzido do título original em italiano "L'ospite inquietante" (traduzido alhures no mesmo docx como "hóspede"/"convidado inquietante"). Mantido verbatim no JSON (fidelidade de extração), reportado ao usuário como possível typo a corrigir, não corrigido unilateralmente.

## Nenhum componente novo criado
Toda a aula (40 sections) foi montada 100% reaproveitando os tipos já existentes: `intro`, `highlight_section`, `dropdown_group`, `bullet_cards`, `data_table`, `conclusion`. Nenhuma section `image`, `story`, `reference_box` ou `video` nesta aula (sem conteúdo correspondente no docx fonte — nem imagens, nem vídeo do Google Drive, nem historinha narrativa).

## Build validado
`npm run build`: build limpo, ~1.9s, zero erros (sem imagens, bundle JS ~267KB). `npm run lint`: zero erros/warnings. (2026-07-07)
Grep por `aula[ _-]?10|modulo_10|module-10|filotec_aula_10` (case-insensitive) em `src/` após remoção do Módulo 10: zero ocorrências.
