# Construtor de Aulas

Esta branch (`sistema-construtor-de-aulas`) contém **apenas** a ferramenta de
montagem de conteúdo — nenhuma aula específica está publicada aqui. O foco é
único: montar o conteúdo de uma aula **sem escrever código**, combinando os
componentes padrão já usados em todas as aulas (acordeões, cards, tabelas,
citações, quiz, vídeo, etc.), e baixar o resultado como **um site pronto**
(HTML + CSS + JS), sem precisar mexer em JSON, terminal ou código.

## Como usar

1. Rode o projeto localmente:
   ```bash
   npm install
   npm run dev
   ```
2. Abra no navegador: `http://localhost:5173/` — o Construtor já é a tela
   inicial desta branch (também disponível em `/construtor`).
3. Preencha "Dados da aula" (número, título, objetivo).
4. No menu à esquerda, clique nos blocos que quiser adicionar (introdução,
   bloco com título, acordeões, tabela, quiz, vídeo, etc.). Cada bloco vira um
   cartão na lista central com os campos daquele tipo.
5. Use ↑ / ↓ para reordenar, ⧉ para duplicar e 🗑 para excluir um bloco.
6. Clique em **"Pré-visualizar"** a qualquer momento para ver exatamente como
   a aula vai aparecer para o aluno (mesmo visual, mesmos componentes).
7. Quando terminar, clique em **"⬇ Baixar site"**.

> O rascunho fica salvo automaticamente no navegador (localStorage), então
> fechar a aba sem querer não perde o trabalho. Use "Exemplo" para carregar
> uma aula de demonstração com um bloco de cada tipo.

## Baixando e abrindo o site

Ao clicar em **"⬇ Baixar site"**, o Construtor gera um arquivo
`site_<nome-da-aula>.zip` contendo três arquivos:

```
index.html
standalone.js
standalone.css
```

Para ver a aula pronta, basta **descompactar o .zip e abrir o `index.html`**
— funciona direto no navegador, sem instalar nada, sem servidor, sem
internet. Todos os componentes interativos (acordeões, quiz, carrossel,
zoom de imagem, controle de tamanho de fonte) já funcionam nesse arquivo.

Se a aula tiver imagens, coloque os arquivos de imagem na mesma pasta do
`index.html` (ex: dentro de uma subpasta `imagens/`) e use esse mesmo nome no
campo "Caminho da imagem" de cada bloco de imagem — ou use diretamente um
link (`https://...`) se a imagem já estiver hospedada em algum lugar.

Esse `.zip` é o que se entrega/publica como a aula final (por exemplo,
enviando os 3 arquivos para o servidor/plataforma onde o material fica
hospedado).

## Continuando a editar depois

O botão **"⬇ Baixar site"** gera o produto final, mas não guarda a estrutura
editável (blocos, campos etc.) — só o resultado pronto. Para conseguir voltar
e editar a aula depois (inclusive em outro computador), use:

- **"Salvar projeto"** — baixa um arquivo de projeto para guardar.
- **"Abrir projeto"** — carrega esse arquivo de volta no Construtor para
  continuar de onde parou.

(O rascunho automático no navegador já cobre o caso de simplesmente fechar a
aba sem querer; esses dois botões são para levar o trabalho para outro
computador ou guardar uma cópia de segurança.)

## Blocos disponíveis

O catálogo completo de blocos (tipos, campos e componente usado) vive em
[`src/components/LessonRenderer/sectionCatalog.js`](../src/components/LessonRenderer/sectionCatalog.js).
Para adicionar um bloco novo no futuro (reaproveitando algum componente de
`src/components/ui/` que ainda não tem bloco equivalente), basta:

1. Adicionar uma entrada no catálogo (`sectionCatalog.js`) com os campos do
   formulário.
2. Adicionar o `case` correspondente em
   [`src/components/LessonRenderer/LessonRenderer.jsx`](../src/components/LessonRenderer/LessonRenderer.jsx).
3. Rodar `npm run build:standalone` para recompilar o pacote que vai dentro
   do `.zip` baixado (veja a seção técnica abaixo).

Nenhuma outra tela precisa mudar — o Construtor lê o catálogo automaticamente
e passa a oferecer o bloco novo.

## Formatação de texto nos campos

Nos campos de texto longo (introdução, blocos com título, etc.), a mesma
convenção usada nas aulas anteriores continua valendo:

- `**texto**` vira **negrito**
- `*texto*` vira *itálico*
- Uma linha começando com `•` vira item de lista

## Detalhe técnico: como o "Baixar site" funciona

O botão não depende de nenhum servidor/backend. Em `public/standalone/`
existe um pacote pré-compilado (`standalone.js` + `standalone.css`) contendo
React e todos os componentes de `src/components/ui/` já empacotados. Ao
clicar em "Baixar site", o Construtor:

1. Busca esses dois arquivos (já servidos pelo próprio Vite/hospedagem).
2. Gera um `index.html` com o conteúdo da aula embutido em
   `window.__LESSON_CONTENT__`.
3. Empacota os três arquivos num `.zip` (biblioteca `jszip`) e inicia o
   download no navegador.

Esse pacote pré-compilado precisa ser **regerado manualmente** sempre que
`LessonRenderer`, o catálogo de blocos ou algum componente de
`src/components/ui/` mudar:

```bash
npm run build:standalone
```

Isso recompila `public/standalone/standalone.js` e `.css` (config em
`vite.standalone.config.js`) — depois é só commitar os arquivos atualizados.

## Observações

- Esta branch é só a ferramenta: não há nenhuma aula publicada nela.
- O rascunho automático do navegador (localStorage) é por
  navegador/computador — use "Salvar projeto" / "Abrir projeto" para levar o
  trabalho de um computador para outro.
