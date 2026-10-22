# Instruções para agentes — Schnitt Hub

## Objetivo
Trabalhar no Schnitt Hub, uma aplicação web para gestão de barbearias, com decisões técnicas explícitas, mudanças pequenas e documentação atualizada.

## Antes de agir
1. Leia `README.md` e os documentos relevantes em `docs/`.
2. Inspecione o código real antes de afirmar que algo existe.
3. Diferencie claramente:
   - **Implementado**: comprovado no código e/ou por execução.
   - **Em desenvolvimento**: parcialmente implementado e verificável.
   - **Planejado**: definido como próximo passo, ainda sem implementação.
   - **Não confirmado**: faltam evidências.
4. Respeite as tecnologias e os padrões já adotados no repositório, salvo decisão explícita em contrário.
5. Não invente requisitos de negócio. Registre dúvidas como perguntas abertas.

## Regras de execução
- Faça a menor alteração que resolva o problema.
- Não introduza bibliotecas, serviços, abstrações ou camadas sem justificar a necessidade.
- Não reescreva o projeto nem altere a arquitetura global sem autorização explícita.
- Não execute comandos destrutivos, não apague dados e não exponha segredos.
- Nunca inclua tokens, senhas, chaves privadas ou dados pessoais em código, logs ou documentação.
- Não instale dependências, não faça commits e não envie alterações ao remoto sem pedido explícito.
- Não afirme que testes, build ou lint passaram sem executá-los e verificar o resultado.
- Não altere arquivos gerados ou lockfiles manualmente quando um gerenciador de pacotes puder atualizá-los.

## Arquitetura
A direção documentada em `docs/architecture/` é uma **proposta inicial**, não uma afirmação de que essas camadas já existem no código.
- Prefira módulos organizados por capacidade de negócio.
- Mantenha componentes de interface focados em apresentação.
- Coloque regras de negócio em locais testáveis e independentes da interface quando a complexidade justificar.
- Isole acesso a APIs e persistência nas fronteiras apropriadas.
- Evite abstrações especulativas e Clean Architecture excessivamente cerimonial.
- Não adicione backend, banco de dados, autenticação ou multi-tenancy antes de confirmar os requisitos e obter autorização.

## Fluxo recomendado
1. Entenda o pedido e examine o estado atual.
2. Resuma o plano e os arquivos que pretende alterar.
3. Implemente apenas o escopo solicitado.
4. Rode os checks disponíveis (lint, testes, build), quando aplicável.
5. Revise o diff e procure regressões, segredos e documentação desatualizada.
6. Informe o que mudou, o que foi testado e o que ficou pendente.

## Documentação
Atualize os documentos em `docs/` quando uma mudança alterar arquitetura, requisitos, segurança, configuração ou comportamento público.
Decisões duradouras devem ser registradas como ADRs em `docs/architecture/decisions/`, usando `docs/architecture/decisions/ADR-TEMPLATE.md`.
Não marque uma proposta como decisão aceita sem confirmação da pessoa responsável pelo projeto.

## Resposta final do agente
Informe:
- resumo das mudanças;
- arquivos alterados;
- comandos executados e resultados reais;
- limitações ou dúvidas;
- próximos passos sugeridos, sem executá-los automaticamente.
