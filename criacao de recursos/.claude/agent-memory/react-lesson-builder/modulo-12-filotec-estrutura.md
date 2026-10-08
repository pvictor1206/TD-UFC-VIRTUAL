---
name: modulo-12-filotec-estrutura
description: Estrutura de arquivos do Módulo 12 (Filosofia da Tecnologia, Aula 12 — Corpo e Tecnologia: Foucault, Haraway, Baudrillard, Le Breton e Preciado) e novo padrão de data_table com células ricas
metadata:
  type: project
---

O Módulo 12 / Aula 12 ("Corpo e Tecnologia: Foucault, Haraway e Outras Críticas Contemporâneas") foi criado em 2026-07-07, substituindo a Aula 11 neste branch (`Aula-12-Filosofia-Tecnologia-EaD`). Muda o eixo temático da série: em vez da crítica cultural aos "cidadãos despotencializados" ([[modulo-11-filotec-estrutura]]), o tema passa a ser o **corpo** como objeto de disciplina, biopolítica, hibridização e regulação tecnológica — Michel Foucault (corpo disciplinado/biopolítico) e Donna Haraway (corpo ciborgue) como eixo central, com Jean Baudrillard, David Le Breton e Paul B. Preciado como "outros autores críticos nessa linha".

- Documento fonte: `public/Agente IA FILOTEC AULA 12 EAD.docx` (revisora "Thais Gomes Carlos", mesmo padrão Google-Docs-export, mas com apenas 4 comentários em `word/comments.xml` — a aula com menos anotações de revisão desta série até agora). **Sem imagens embutidas** — não existe pasta `word/media` nem `r:embed` de imagem em `word/_rels/document.xml.rels`. `Filotec_Aula_12.jsx` não define `imageMap`. Documento também bem mais curto (156 parágrafos de texto) que a Aula 11 (241 parágrafos).
- Conteúdo estruturado: `src/assets/content_Modulo_12/filotec_aula_12.json` (28 sections).
- Componente da página: `src/components/Modules/Module-12/Filotec_Aula_12.jsx`.
- Rota: `/` (raiz) em `src/App.jsx`.

## Sem "objetivo" literal no docx (novamente)
Assim como na Aula 10 ([[modulo-10-filotec-estrutura]]), o docx não tem um parágrafo de "objetivo" explícito — vai direto de "AULA 12" / "CORPO E TECNOLOGIA" para o texto de abertura sobre Foucault e Haraway. O campo `objetivo` do JSON foi sintetizado editorialmente a partir do conteúdo completo da aula (os 5 autores/autoras cobertos), seguindo a prática já aceita. O `titulo` reaproveita literalmente o cabeçalho do docx ("Corpo e Tecnologia") estendido com os nomes dos autores principais, no mesmo padrão das aulas anteriores.

## Novo padrão: "fazer tabela com o texto" cobrindo uma exposição inteira (não uma comparação simples)
Diretiva nova nesta aula: os comentários `w:id="0"` ("Pra cada autor, fazer uma tabela com o texto") e `w:id="1"` ("fazer tabela") têm range cobrindo, cada um, a exposição **inteira** de um autor (todo o bloco de Michel Foucault; todo o bloco de Donna Haraway) — não apenas uma lista de obras (Aula 11, `w:id="2"` Postman) nem uma comparação entre dois autores num mesmo tema (Aula 11, `w:id="16"` Stiegler x Foucault). Interpretação aplicada (não é a única possível — **sinalizada ao usuário para confirmação**): cada exposição virou um `data_table` de 2 colunas ("Tema" / "Conteúdo"), uma linha por subtema do documento (ex.: "1. O corpo disciplinado", "2. O corpo biopolítico", "Exemplo pragmático", "Exemplos práticos"), preservando bullets e texto integral dentro de cada célula via `FormattedText`. Duas linhas por tabela ("Corpos e artefatos tecnológicos"/"Artefatos tecnológicos e reinvenção do corpo" e "Síntese") não tinham cabeçalho literal no docx para o parágrafo de fechamento — rótulos atribuídos editorialmente para simetria estrutural entre as duas tabelas, sem alterar o conteúdo.

## Novo recurso técnico: DataTable com células ricas (bullets/negrito)
Até a Aula 11, os `data_table` só continham strings simples (1 linha por célula). Nesta aula, as células de "Tema"/"Conteúdo" das tabelas de Foucault e Haraway contêm listas de bullets e múltiplos parágrafos (usando "\n" e "•", igual ao `highlight_section`). Como o `DataTable` (`src/components/ui/Table/DataTable.jsx`) já aceita qualquer node como célula ("cada cell pode ser node" — ver [[inventario-componentes-ui]]), o case `'data_table'` do `Filotec_Aula_12.jsx` foi ajustado para mapear cada célula string através do helper `FormattedText` antes de passar para `<DataTable data={...} />`:
```jsx
data={section.rows.map((row) =>
  row.map((cell) =>
    typeof cell === 'string' ? <FormattedText text={cell} className="text-left" /> : cell
  )
)}
```
Isso preserva o padrão de bullets/negrito do JSON também dentro de tabelas, sem precisar de um componente novo. **Reutilizar este padrão em futuras aulas** sempre que uma tabela precisar de células com texto formatado/multi-linha (em vez de strings simples de uma linha).

## "cards para cada bullet point" aplicado só a 2 blocos específicos (não a todos os "Exemplos práticos")
Os comentários `w:id="2"` e `w:id="3"` ("cards para cada bullet point") cobrem apenas os blocos "Ciborgues Químicos" (3 bullets) e "Exemplos Pragmáticos" — a lista de exemplos concretos de ciborgues químicos (pílula, hormônios, Ritalina, doping; 4 bullets) — ambos dentro do excurso sobre "ciborgues que não dependem de eletrônica", inserido entre a conclusão conjunta Foucault/Haraway e a ficha bio de Haraway. Viraram `bullet_cards`. As várias outras listas de "Exemplos práticos" espalhadas pela aula (Foucault, Haraway, Baudrillard, Le Breton, Preciado) **não têm comentário "cards" equivalente** e foram mantidas como bullets simples dentro de `highlight_section`, reafirmando a regra já estabelecida na Aula 11: só uniformizar tratamento visual quando há marcação explícita, mesmo quando os blocos são estruturalmente análogos entre si.

## Estrutura peculiar: bio de Haraway aparece DEPOIS do excurso sobre ciborgues químicos
Diferente do padrão usual (bio/contexto logo no início do bloco do autor), a ficha "Donna Haraway (1944– )" (Obra central / Tese / Crítica / Impacto) aparece no docx **depois** de toda a discussão sobre "ciborgues químicos" e "exemplos pragmáticos" — ou seja, depois que a exposição principal de Haraway (via `data_table`) e a conclusão conjunta já foram fechadas. Mantida na posição literal do documento (mesmo respeitando a "Rigor na Sequência Pedagógica" já estabelecida), não foi movida para logo após o título "Donna Haraway – O corpo ciborgue e híbrido".

## "Outros autores críticos nessa linha": lista-teaser que não continua como lista
O cabeçalho "Outros autores críticos nessa linha" é seguido de apenas UM item de teaser (nome + descrição de uma linha, ambos marcados como bullets no docx) para Jean Baudrillard, e então o documento já mergulha diretamente na exposição completa dele — não há teasers equivalentes para David Le Breton ou Paul B. Preciado antes de suas respectivas seções completas. Implementado como um único `highlight_section` curto ("Outros Autores Críticos Nessa Linha") com um bullet, seguido pela exposição completa de cada autor em sections separadas. Não é uma ambiguidade de conteúdo, apenas a forma como o documento foi escrito (lista iniciada e não continuada).

## Reparo mecânico: bullets colados sem separação e espaços ausentes entre frases (Baudrillard, Le Breton)
Detectados e corrigidos, sem alterar palavras:
1. No bloco "Obras-chave" de Baudrillard, dois itens de lista ficaram colados em um único nó de texto: "...Simulacros e Simulação.A Ilusão da Mídia (1991)" — separados em dois bullets distintos ("Simulacros e Simulação (1981) — ..." e "A Ilusão da Mídia (1991).").
2. Três frases de fechamento (conclusões de Baudrillard e Le Breton) tinham espaço ausente entre o ponto final de uma frase e o início da próxima (ex.: "representação.Sua contribuição...", "tecnológica.Sua contribuição..."), sinal de um glitch mecânico de exportação do Google Docs (mesma família de problema já visto em runs XML fragmentados, mas na direção oposta — aqui *faltou* separação em vez de sobrar). Corrigido apenas com a inserção do espaço faltante, texto preservado.
Ambos os reparos foram documentados em comentário no topo do `.jsx` e reportados ao usuário, não escondidos silenciosamente.

## Possível inconsistência de grafia preservada verbatim ("Testo Yonqui" vs "Testo Junkie")
O docx usa "Testo Yonqui" na frase de abertura da seção de Paul B. Preciado e "Testo Junkie" na lista de "Obras principais" e no conceito "Regime Farmacopornográfico" — aparentemente duas grafias diferentes para a mesma obra (título em espanhol vs. título em inglês da edição mais conhecida). Mantidas ambas exatamente como aparecem em cada trecho original (não unificadas), reportado ao usuário para confirmação, seguindo a política de não corrigir silenciosamente possíveis erros/inconsistências de grafia.

## Nenhum componente novo criado
Toda a aula (28 sections) foi montada reaproveitando tipos já existentes: `intro`, `highlight_section`, `bullet_cards`, `data_table`. Nenhuma section `image`, `dropdown_group`, `story`, `reference_box`, `video` ou `conclusion` nesta aula (sem conteúdo correspondente no docx fonte — não há listas numeradas pedindo dropdown, não há historinha narrativa, não há vídeo do Google Drive, e nenhuma citação/synthesis foi marcada como "linha lateral"). A única novidade técnica foi o ajuste do case `data_table` em `Filotec_Aula_12.jsx` para aceitar células ricas via `FormattedText` (ver seção acima) — mudança apenas na forma de uso do `DataTable` já existente, não um componente novo.

## Build validado
`npm run build`: build limpo, ~1.9s, zero erros (sem imagens, bundle JS ~261KB). `npm run lint`: zero erros/warnings. (2026-07-07)
Grep por `aula[ _-]?11|modulo_11|module-11|filotec_aula_11` (case-insensitive) em `src/` após remoção do Módulo 11: zero ocorrências (uma citação textual solta a "Aula 11" num comentário do `.jsx` foi encontrada e reescrita para não nomear a aula anterior, mantendo só a referência genérica à "memória do projeto"). Grep por `\b11\b`: só resta o falso positivo já conhecido `src/assets/react.svg` (ícone padrão do Vite).

## Ambiguidades reportadas ao usuário (não resolvidas unilateralmente)
1. Interpretação de "fazer uma tabela com o texto" para Foucault e Haraway (ver seção acima) — a granularidade escolhida (uma linha por subtema) é uma entre várias leituras possíveis do comentário.
2. Divergência de grafia "Testo Yonqui" vs "Testo Junkie" para a obra de Paul B. Preciado.
3. Os dois reparos mecânicos (bullet colado, espaços ausentes) foram aplicados diretamente (por serem puramente estruturais/tipográficos, não de conteúdo), mas estão documentados para revisão se o usuário preferir outra abordagem.
