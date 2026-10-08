# Transição Didática - Material Digital UFC

> **Projeto:** Transição Didática
> <br/>
> **Instituição:** Instituto Universidade Virtual (IUVI) - Universidade Federal do Ceará (UFC)
> <br/>
> **Planejamento:** Alexandre Almeida
> <br/>
> **Desenvolvimento:** Paulo Victor Santos Magalhães e Mirele Rodrigues Fernandes
> <br/>
> **UX/UI:** Maria Eduarda Ferreira Leandro, Samiris Sampaio de Albuquerque e Thais Gomes Carlos

Este repositório contém o código-fonte da aplicação web desenvolvida como material de apoio didático. O projeto atua como um **material digital interativo**, permitindo a navegação entre módulos teóricos (*Enfrentamentos*) de forma fluida e organizada.

> **Sobre esta branch (`sistema-construtor-de-aulas`):** aqui o foco é **apenas
> o Construtor de Aulas** — a ferramenta de montagem de conteúdo. Nenhuma aula
> específica está publicada nesta branch; ela é a tela inicial da aplicação.
> Veja [`docs/CONSTRUTOR-DE-AULAS.md`](docs/CONSTRUTOR-DE-AULAS.md).

![Preview do Projeto](https://gitlab.virtual.ufc.br/diuvi/material/-/raw/main/img-documentation/site-funcional.png)

---

## Sobre o Projeto

Conforme as premissas de **Clean Code** e documentação técnica enxuta, este arquivo foca na visão arquitetural e nas decisões de design, evitando descrever linhas de código voláteis que se tornam obsoletas rapidamente.

### Contexto e Objetivo

O software tem como objetivo realizar a **transposição didática** do conteúdo da disciplina para um meio digital. A aplicação funciona como uma **SPA (Single Page Application)**, garantindo que o usuário navegue entre os capítulos sem recarregamentos desnecessários, proporcionando uma experiência de leitura contínua semelhante a um aplicativo nativo.

---

## Stack Tecnológica

O projeto utiliza um ecossistema moderno (versões 2024/2025) para garantir performance, facilidade de manutenção e longevidade do código.

| Tecnologia                                   | Versão    | Função                                                               |
| :------------------------------------------- | :-------- | :------------------------------------------------------------------- |
| **[React](https://react.dev/)**              | `^19.1.1` | Biblioteca core para construção da interface baseada em componentes  |
| **[Vite](https://vitejs.dev/)**              | `^7.1.1`  | Ferramenta de build e servidor de desenvolvimento (HMR ultra-rápido) |
| **[Tailwind CSS](https://tailwindcss.com/)** | `^4.1.11` | Framework de utilitários para estilização (integrado via Vite)       |
| **[React Router](https://reactrouter.com/)** | `^7.8.2`  | Gerenciamento de rotas e navegação client-side                       |
| **ESLint**                                   | `^9.32.0` | Padronização e qualidade de código (Linter)                          |

---

## Arquitetura e Modelagem

A arquitetura foi pensada para **desacoplar a estrutura de layout (interface)** do **conteúdo didático (texto)**.

### 1. Estrutura Lógica (Visão Macro)

O diagrama abaixo ilustra como os dados fluem e como a aplicação é estruturada:

![Diagrama da Arquitetura](https://gitlab.virtual.ufc.br/diuvi/material/-/raw/main/img-documentation/diagrama.svg)

### 2. Decisões de Design e Implementação

* **Roteamento Dinâmico**
  A aplicação utiliza `react-router-dom` v7, permitindo que a URL reflita o conteúdo atual (ex: `/enfrentamento-01`), facilitando o compartilhamento de links específicos.

* **Componentização**
  O layout é composto por componentes persistentes (como o menu lateral) e uma área de conteúdo dinâmica (`<Outlet />`). Isso garante que o aluno não perca o contexto de navegação ao trocar de tópico.

* **Estilização Atômica (Tailwind v4)**
  O Tailwind CSS v4 é integrado diretamente ao Vite, eliminando a necessidade de arquivos de configuração complexos. O estilo vive junto ao componente, promovendo coesão e legibilidade.

---

## Construtor de Aulas (montagem de conteúdo sem código)

Para montar o conteúdo de uma nova aula sem escrever componentes React,
use o **Construtor de Aulas**: um formulário visual (tela inicial desta
branch, também em `/construtor`) que gera, com um clique, **um site pronto
(HTML + CSS + JS)** a partir dos componentes padrão do projeto, com
pré-visualização ao vivo. Veja o passo a passo em
[`docs/CONSTRUTOR-DE-AULAS.md`](docs/CONSTRUTOR-DE-AULAS.md).

---

## Como Executar o Projeto

### Pré-requisitos

* Node.js instalado (versão LTS recomendada)

### 1. Instalação

Baixe o repositório e instale as dependências listadas no `package.json`:

```bash
npm install
# ou
yarn install
```

### 2. Executar em Desenvolvimento

Inicie o servidor local com recarregamento automático:

```bash
npm run dev
```

O terminal indicará o endereço local, geralmente:

```
http://localhost:5173
```

### 3. Build para Produção

Para gerar a versão otimizada para hospedagem (arquivos estáticos):

```bash
npm run build
```

Os arquivos finais serão gerados na pasta `dist/`. O projeto está configurado com `base: "./"` no Vite, facilitando o deploy em subdiretórios ou GitHub Pages.

---

## Padrões e Qualidade de Código

Para manter a consistência do código e seguir boas práticas profissionais:

* **Linting**
  O projeto possui regras estritas configuradas no `eslint.config.js` (incluindo React Hooks e Fast Refresh). Certifique-se de que não há erros antes de submeter alterações:

  ```bash
  npm run lint
  ```

* **Nomenclatura**

  * Componentes: `PascalCase` (ex: `Sidebar.jsx`)
  * Utilitários e configs: `camelCase`

* **Filosofia**
  Código deve ser autoexplicativo (**Clean Code**). Comentários existem para explicar o *porquê* de decisões complexas — não o *o quê*.

---

Desenvolvido para a **Universidade Federal do Ceará (UFC)** Instituto Universidade Virtual.
