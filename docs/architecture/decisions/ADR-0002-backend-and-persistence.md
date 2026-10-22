# ADR-0002: escolha de backend e persistência

- **Status:** Em avaliação — nenhuma tecnologia aprovada.
- **Data:** 2026-10-21

## Contexto

A descrição do produto prevê funcionalidades que podem exigir dados persistentes, regras de acesso e operações de negócio. A documentação disponível não comprova que backend ou banco de dados já existam.

## Decisão pendente

Definir se o MVP exige backend próprio, quais clientes usarão a API, quais dados serão persistidos e quais requisitos de operação precisam ser atendidos.

## Opções a avaliar

- **Backend:** Node.js + TypeScript (por exemplo, Express ou alternativa equivalente), BaaS ou outra plataforma adequada.
- **API:** REST é uma opção simples para avaliar; não é uma decisão tomada.
- **Banco de dados:** avaliar modelo relacional se os relacionamentos e as transações do domínio justificarem.
- **Autenticação:** escolher conforme os perfis, a experiência de login, a implantação e os requisitos de segurança.

## Critérios de comparação

- complexidade para o MVP;
- experiência de desenvolvimento e manutenção;
- autenticação e autorização;
- isolamento entre barbearias, se multi-tenant;
- transações e integridade de agendamentos;
- custo e facilidade de implantação;
- backups, migrações, observabilidade e testes;
- possibilidade de exportação e portabilidade dos dados.

## Próximos passos

1. Confirmar requisitos do MVP.
2. Inspecionar dependências e estrutura reais do repositório.
3. Comparar duas ou três opções com base nos requisitos.
4. Registrar uma decisão aceita em novo ADR antes de iniciar implementação estrutural.
