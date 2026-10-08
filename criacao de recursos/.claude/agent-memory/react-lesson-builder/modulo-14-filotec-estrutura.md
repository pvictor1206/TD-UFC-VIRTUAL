---
name: modulo-14-filotec-estrutura
description: Estrutura de arquivos do Módulo 14 (Filósofos da Tecnologia Asiáticos — Yuk Hui, Masanobu Kiyota, Hiroshi Kawano, Qiu Renzong, Byung-Chul Han); Yuk Hui aparece 2x com conteúdo distinto; 2 títulos editoriais atribuídos por necessidade de UI
metadata:
  type: project
---

O Módulo 14 / Aula 14 ("Filósofos da Tecnologia Asiáticos") foi criado em 2026-07-08, substituindo a Aula 13 ([[modulo-13-filotec-estrutura]]) neste branch (`Aula-13-Filosofia-Tecnologia-EaD`, conteúdo trocado sem renomear a branch). Muda de eixo temático outra vez: em vez de autores ocidentais, o tema passa a ser a **desconstrução da ideia de "filosofia asiática da tecnologia" como bloco homogêneo**, seguida de um levantamento de pensadores asiáticos específicos (China, Japão, Coreia do Sul) e suas contribuições próprias.

- Documento fonte: `public/Agente IA FILOTEC AULA 14 EAD.docx` (revisora "Thais Gomes Carlos", 2 comentários em `word/comments.xml`, mesmo padrão Google-Docs-export). **Sem imagens embutidas** — não existe pasta `word/media`. `Filotec_Aula_14.jsx` não define `imageMap`. Documento é bem mais curto que aulas anteriores: só 40 parágrafos com conteúdo (índice bruto até 69, com muitas lacunas de parágrafos vazios entre itens de dropdown).
- Conteúdo estruturado: `src/assets/content_Modulo_14/filotec_aula_14.json` (6 sections).
- Componente da página: `src/components/Modules/Module-14/Filotec_Aula_14.jsx`.
- Rota: `/` (raiz) em `src/App.jsx`.

## Extração: `<w:br w:type="textWrapping"/>` dentro do mesmo `<w:r>` (armadilha nova)
Diferente da técnica documentada em [[extracao-docx-via-xml]] (que só extrai `<w:t>` concatenando por `<w:r>`), este docx tem quebras de linha suaves (`<w:br/>`) **dentro do mesmo `<w:r>`**, entre dois `<w:t>` (ex.: `<w:t>...diferentes</w:t><w:br/><w:t>Exemplo: ...</w:t>` sem espaço algum entre eles). Uma extração ingênua que só concatena `<w:t>` gera texto colado sem espaço ("diferentes**.Exemplo:"). Foi necessário reescrever o extrator para varrer sequencialmente `<w:t>|<w:br/>|<w:tab/>` dentro de cada run e converter `<w:br/>` em `\n`. **Reaproveitar esse extrator (varredura sequencial de tokens dentro do run, não só `matchAll` de `<w:t>`) em futuras aulas** — é mais robusto que o método anterior e deveria substituir o método simples documentado em [[extracao-docx-via-xml]] daqui para frente.

## Diretivas de revisão (comments.xml) e como foram mapeadas
- `w:id="0"` ("Cada título, um card") — cobre os 7 blocos que explicam por que "Ásia" não é uma categoria homogênea (Diversidade geográfica e cultural ... Estereótipos perigosos) → `bullet_cards`.
- `w:id="1"` ("Cada autor, um dropdown") — cobre os 6 itens de autores/pensadores (Yuk Hui ... Byung-Chul Han) → `dropdown_group`.
- Ambas as diretivas também aparecem como texto visível entre colchetes no corpo do documento ("[Cada título, um card]", "[Cada autor, um dropdown]") — não copiado para o JSON, mesmo padrão já usado em aulas anteriores.
- Ranges sem sobreposição, ambíguos apenas quanto à ausência de título antes de cada bloco (ver abaixo).

## Dois títulos editoriais atribuídos por exigência dos componentes de UI (ambiguidade sinalizada)
Nem o bloco `bullet_cards` nem o bloco `dropdown_group` tinham um cabeçalho literal precedendo-os no docx (o comentário/colchete de diretiva aparece sozinho, sem texto de título antes do primeiro item). Como os componentes (`<h2>{section.title}</h2>`) exigem um título para não ficar vazio, foram atribuídos editorialmente:
- `bullet_cards.title` = "Por que a Ásia não é uma categoria homogênea"
- `dropdown_group.title` = "Filósofos e Pensadores Asiáticos da Tecnologia"
- O parágrafo de fechamento do primeiro bloco (síntese sobre identidade geográfica vs. cultural) também não tinha cabeçalho literal — recebeu o rótulo editorial "Síntese" (mesmo precedente de [[modulo-12-filotec-estrutura]]).
- Já os títulos "Observações" e "Conclusão" (parágrafos próprios do highlight_section final e do conclusion) SÃO literais do docx.

## Curiosidade estrutural: Yuk Hui aparece 2x no dropdown_group, com conteúdo distinto (não é duplicação acidental)
Dentro do range do comentário "Cada autor, um dropdown" (parágrafos 31–61), o autor **Yuk Hui** aparece como item de dropdown duas vezes:
1. Primeira entrada (título "Yuk Hui (香港/China, 1982– )"): biografia completa — Obras, Ideia central (cosmotécnica), crítica ao universalismo ocidental, "mais citado mundialmente".
2. Quinta entrada (título "Yuk Hui (apesar de viver e publicar no Ocidente, traz uma matriz chinesa)"): reflexão adicional sobre sua posição geográfica/cultural, reabilitação de tradições chinesas (taoísmo, confucionismo).

Ao contrário do caso resolvido em [[modulo-07-filotec-estrutura]] (onde um trecho sobre Haraway estava **quase idêntico**, repetido duas vezes — interpretado como cópia acidental de edição e deduplicado), aqui o conteúdo das duas entradas é **diferente e complementar**, não uma cópia. Por isso, seguindo a regra de "preservar a ordem/sequência pedagógica literal do documento" e de não resolver ambiguidades de conteúdo unilateralmente, **ambas as entradas foram mantidas**, na ordem em que aparecem no documento, sem fusão editorial. Sinalizado ao usuário como uma escolha que pode ser revista se a duplicação for, na verdade, um erro do documento fonte.

## Sem "objetivo" literal no docx (mesma situação de aulas anteriores)
Assim como em [[modulo-10-filotec-estrutura]], [[modulo-12-filotec-estrutura]] e [[modulo-13-filotec-estrutura]], o docx não tem um parágrafo de "objetivo" explícito — vai direto de "AULA 14" / "Filósofos da Tecnologia Asiáticos" para o parágrafo de abertura. O campo `objetivo` do JSON foi sintetizado editorialmente cobrindo a tese central (Ásia não é categoria homogênea) e os cinco pensadores citados (Yuk Hui, Masanobu Kiyota, Hiroshi Kawano, Qiu Renzong, Byung-Chul Han).

## Expansão de "Exemplo:" mantida onde literal, sem generalizar para toda continuação de parágrafo
Seguindo o precedente de [[modulo-13-filotec-estrutura]] ("Ex.:" → "**Exemplo:**"), nesta aula a palavra "Exemplo:" já aparecia por extenso no docx (não abreviada) em 2 dos 7 `bullet_cards` — só recebeu **negrito** como rótulo (não precisou de expansão textual). Já as continuações de parágrafo que NÃO tinham a palavra "Exemplo:" (ex.: "Falar em 'asiáticos' como se todos fossem ricos ou pobres ignora essas diferenças.", card "Desigualdades econômicas") foram mantidas como parágrafo simples, sem rótulo inventado — para não confundir continuação de raciocínio com exemplo prático.

## Nenhum componente novo criado
Toda a aula (6 sections) foi montada reaproveitando tipos já existentes: `intro`, `bullet_cards`, `highlight_section`, `dropdown_group`, `conclusion`. Nenhuma section `image`, `reference_box`, `story`, `video` ou `data_table` nesta aula (sem conteúdo correspondente no docx fonte).

## Build e limpeza validados
`npm run build`: build limpo, ~2s, zero erros (sem imagens, bundle JS ~249KB). `npm run lint`: zero erros/warnings. (2026-07-08)
Grep por `aula[ _-]?13|modulo_13|module-13|filotec_aula_13` (case-insensitive) em `src/` após remoção do Módulo 13: zero ocorrências.

## Ambiguidades reportadas ao usuário (não resolvidas unilateralmente)
1. Títulos editoriais atribuídos a `bullet_cards.title`, `dropdown_group.title` e ao `highlight_section` de síntese ("Por que a Ásia não é uma categoria homogênea", "Filósofos e Pensadores Asiáticos da Tecnologia", "Síntese") — nenhum é literal do docx.
2. Yuk Hui aparece duas vezes como item de dropdown, com conteúdo distinto — mantido literalmente sem fusão; pode ser um erro do documento fonte a confirmar com a revisora.
