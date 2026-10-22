# ADR-0001: organização modular do front-end

- **Status:** Proposta — precisa ser validada com o código e com a pessoa responsável.
- **Data:** 2026-10-21

## Contexto

A documentação do projeto registra React + Vite e prevê múltiplas áreas funcionais, como agendamentos, clientes, serviços e profissionais. Ainda não foi feita aqui uma inspeção do código para confirmar a estrutura atual.

## Proposta

Manter React + Vite como base atual e, conforme as funcionalidades crescerem, agrupar código por capacidade de negócio, mantendo componentes compartilhados em um local explícito. Separar regras de negócio de componentes visuais quando isso trouxer testabilidade ou clareza.

Uma estrutura candidata, a adaptar ao repositório real:

```text
src/
  app/                 # composição da aplicação e rotas, se necessário
  shared/              # componentes e utilitários realmente compartilhados
  features/
    appointments/
    clients/
    services/
    professionals/
  assets/
  styles/
```

Não mover arquivos apenas para fazer a estrutura coincidir com este exemplo. Antes, examinar a estrutura existente e planejar migração pequena.

## Alternativas

- Manter estrutura atual: menor custo inicial, pode ser suficiente em projeto pequeno.
- Organizar somente por tipo (`components/`, `pages/`, `services/`): simples, mas pode espalhar uma funcionalidade por muitas pastas.
- Organizar por funcionalidade: favorece coesão; requer convenções consistentes.

## Consequências esperadas

- Melhor localização do código de cada funcionalidade.
- Necessidade de definir limites para evitar dependências circulares.
- Nenhum ganho justifica refatoração ampla antes de haver necessidade concreta.

## Critérios de validação

Inspecionar a árvore real, imports, rotas, scripts e testes; propor uma migração incremental somente se houver problema concreto.
