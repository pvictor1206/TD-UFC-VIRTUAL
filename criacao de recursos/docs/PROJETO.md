# Documentação do Projeto - Transição Didática

## 1. Introdução
Este projeto visa transformar conteúdos educacionais estáticos em experiências interativas utilizando React 19 e Tailwind CSS v4.

## 2. Padrões de Desenvolvimento (TDD)
Implementamos o **Test-Driven Development (TDD)** para garantir a robustez dos componentes.
- **Ferramenta:** Vitest + React Testing Library.
- **Como executar testes:** `npm test` ou `npm run test:run`.
- **Regra de Ouro:** Antes de corrigir um bug, crie um teste que reproduza a falha. Antes de criar um recurso, descreva seu comportamento em um teste.

## 3. Guia de Correção de Erros (Prevenção de Regressões)
### Erros Comuns e Soluções:
- **TypeError: Cannot read properties of undefined (reading 'map')**
  - **Causa:** Tentar mapear um array que não existe ou é nulo no JSON de conteúdo.
  - **Prevenção:** Sempre utilize *Optional Chaining* (`?.`) ao iterar sobre propriedades vindas de fontes externas (JSON/API) e forneça fallbacks quando necessário.
  - **Exemplo:** `dados.opcoes?.map(...)`

## 4. Estrutura de Pastas
- `src/components/ui/`: Componentes atômicos e reutilizáveis.
    - Cada componente deve ter seu arquivo `.test.jsx`.
- `src/components/Modules/`: Estrutura das aulas/módulos.
- `docs/`: Documentação técnica e manuais.

## 5. Comandos Úteis
- `npm run dev`: Iniciar ambiente de desenvolvimento.
- `npm run build`: Gerar build de produção.
- `npm test`: Rodar testes em modo watch.
- `npm run test:run`: Rodar testes uma única vez.
