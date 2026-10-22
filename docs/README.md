# Documentação do Schnitt Hub

Esta pasta reúne a documentação técnica e de produto. Ela deve acompanhar o estado real do repositório.

## Documentos

- `architecture/README.md` — visão geral da arquitetura proposta e princípios.
- `architecture/system-context.md` — contexto, atores e limites conhecidos.
- `architecture/domain-model.md` — conceitos de domínio e perguntas em aberto.
- `architecture/decisions/ADR-TEMPLATE.md` — modelo para registrar decisões.
- `architecture/decisions/ADR-0001-modular-frontend.md` — proposta inicial para organizar o front-end.
- `architecture/decisions/ADR-0002-backend-and-persistence.md` — opções a avaliar para backend e persistência.
- `roadmap.md` — etapas sugeridas, sem afirmar que estão implementadas.
- `security.md` — checklist de segurança.
- `testing.md` — estratégia de qualidade e testes.

## Regra de evidência

A documentação inicial deriva da descrição conhecida do projeto: uma aplicação web para gestão de barbearias, com fundação de front-end em React + Vite. A estrutura e o comportamento reais precisam ser verificados no repositório antes de se declarar qualquer item concluído.

Use os rótulos **Implementado**, **Em desenvolvimento**, **Planejado** e **Não confirmado** para evitar confundir intenção com implementação.
