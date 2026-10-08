---
name: extracao-docx-via-xml
description: Como extrair texto de arquivos .docx neste ambiente Windows sem bibliotecas Python/Node externas (mammoth, python-docx indisponíveis)
metadata:
  type: project
---

Neste ambiente (Windows, PowerShell/Git Bash, projeto Vite), **não há `python3` funcional nem `mammoth`/`python-docx` instalados** — `python` aciona o stub da Microsoft Store e falha. `node` está disponível mas sem `playwright` nem libs de parsing de docx no `node_modules` do projeto.

Método que funcionou (sem instalar nada novo):
1. Um `.docx` é um arquivo zip. Extrair com `unzip -o "arquivo.docx"` (via Bash tool, Git Bash já tem `unzip`) para uma pasta dentro do repo (não usar `/tmp` — o Read tool não acessa caminhos POSIX do Git Bash, precisa ser um caminho Windows real tipo `C:\...\material\tmp_docx\extract`).
2. O texto fica em `word/document.xml`. Cada parágrafo é um `<w:p>...</w:p>`; o texto visível de cada parágrafo está em tags `<w:t>texto</w:t>` dentro dele (pode haver múltiplos `<w:t>` por parágrafo por causa de formatação inline — precisa concatenar todos).
3. Script Node simples (CommonJS — **atenção**: se o `package.json` do projeto tiver `"type": "module"`, é preciso nomear o arquivo `.cjs`, não `.js`, para usar `require`):
   ```js
   const fs = require('fs');
   const xml = fs.readFileSync('.../word/document.xml', 'utf8');
   const paraRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
   let match, i = 0;
   while ((match = paraRegex.exec(xml)) !== null) {
     const paraXml = match[1];
     const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
     let t, text = '';
     while ((t = textRegex.exec(paraXml)) !== null) text += t[1];
     if (text.trim()) console.log(`${i}|${text}`);
     i++;
   }
   ```
4. Para detectar estrutura (bullets, níveis de lista, negrito) além do texto puro, inspecionar `<w:numPr>` (presença = item de lista), `<w:ilvl w:val="N">` (nível de indentação do bullet) e `<w:b/>` (negrito) dentro do XML de cada parágrafo — útil para decidir se um trecho do doc é texto corrido vs. lista estruturada antes de mapear para componentes JSON/JSX.
5. Entidades HTML como `&quot;` podem aparecer dentro de `<w:t>` (em vez de `"` literal) quando o Word salvou aspas retas — decodificar com `.replace(/&quot;/g, '"')` ao montar o texto final.
6. Sempre limpar a pasta de extração temporária do repo ao final (`rm -rf tmp_docx`) para não deixar lixo no working tree.

Isso evita pedir instalação de pacotes ao usuário só para uma extração pontual de conteúdo.

## Extração de comentários de revisão (word/comments.xml)

Reaplicado com sucesso na Aula 02 ([[modulo-02-filotec-estrutura]]). Além de `word/document.xml`, um `.docx` exportado do Google Docs (sinal: atributos `w:rsidDel="00000000"` e `<w:sdt><w:sdtPr><w:tag w:val="goog_rdk_NN"/>` no XML) frequentemente tem `word/comments.xml` com os comentários de revisão do designer instrucional — essas são as diretivas mais confiáveis sobre qual componente usar em cada trecho (ex: "dropdown", "Caixa de texto", "Quadro de texto", "Linha lateral do texto", "Cada capítulo um dropdown").

Para extrair: regex `/<w:comment\b([^>]*)>([\s\S]*?)<\/w:comment>/g` captura `w:id` e `w:author` nos atributos e o texto via `<w:t>` dentro do corpo, igual à extração de parágrafos.

Para saber a QUAL parágrafo cada comentário se refere: dentro de `word/document.xml`, cada parágrafo pode conter `<w:commentRangeStart w:id="N"/>` (abre a faixa comentada, geralmente dentro de um `<w:sdt><w:sdtContent>` quando vem do Google Docs), `<w:commentRangeEnd w:id="N"/>` e `<w:commentReference w:id="N"/>` (marca onde o "balão" do comentário fica ancorado, normalmente no parágrafo de FECHAMENTO da faixa, não no de abertura). Extrair os três junto com o texto de cada parágrafo permite reconstruir "este comentário X se refere a este trecho de texto" sem precisar abrir o Word.

**Cuidado:** nem todo comentário é conteúdo didático. Comentários de revisores de conteúdo (não do designer instrucional) podem trazer material de pesquisa extra/rascunho (ex: um comentário longo sobre um autor relacionado, sugerindo aprofundamento) que não deve ser incorporado automaticamente ao corpo da aula — tratar como nota de contexto e decidir caso a caso se vale a pena integrar ou só mencionar ao usuário.

## Armadilha: `<w:br w:type="textWrapping"/>` dentro do mesmo `<w:r>` (descoberta na Aula 14)

O método simples do passo 3 acima (extrair todos os `<w:t>` de um `<w:r>` e concatenar) **falha silenciosamente** quando o Word insere uma quebra de linha suave (Shift+Enter) no meio de um mesmo run de formatação: `<w:r>...<w:t>frase um.</w:t><w:br w:type="textWrapping"/><w:t>frase dois.</w:t>...</w:r>`. Como o `<w:br/>` fica **entre dois `<w:t>` do mesmo `<w:r>`**, um `matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)` que ignora a ordem relativa ao `<w:br/>` produz texto colado sem espaço nem quebra ("frase um.frase dois."). Ver [[modulo-14-filotec-estrutura]] para o caso real que motivou a correção.

**Extrator corrigido** (varre sequencialmente `<w:t>|<w:br/>|<w:tab/>` dentro de cada `<w:r>`, na ordem em que aparecem, convertendo `<w:br/>` em `\n` e `<w:tab/>` em `\t`):
```js
const runRegex = /<w:r\b[^>]*>([\s\S]*?)<\/w:r>/g;
let r, text = '';
while ((r = runRegex.exec(paraXml)) !== null) {
  const runXml = r[1];
  const isBold = /<w:b\b(?![\w-])[^\/]*\/>/.test(runXml) || /<w:b\b(?![\w-])[^>]*w:val="(?:1|true)"/.test(runXml);
  const tokenRegex = /<w:t[^>]*>([^<]*)<\/w:t>|<w:br[^>]*\/>|<w:tab[^>]*\/>/g;
  let tk, runText = '';
  while ((tk = tokenRegex.exec(runXml)) !== null) {
    if (tk[0].startsWith('<w:t')) runText += decode(tk[1]);
    else if (tk[0].startsWith('<w:br')) runText += '\n';
    else if (tk[0].startsWith('<w:tab')) runText += '\t';
  }
  if (runText) text += isBold ? runText.split('\n').map(seg => seg ? `**${seg}**` : seg).join('\n') : runText;
}
```
**Usar este extrator (varredura sequencial de tokens) em vez do `matchAll` simples de `<w:t>` em todas as futuras aulas** — é estritamente mais robusto e captura o mesmo conteúdo quando não há `<w:br/>`, sem custo adicional.
