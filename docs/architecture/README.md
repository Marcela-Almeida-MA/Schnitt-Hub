# Arquitetura do Schnitt Hub

**Status:** proposta inicial para validação; não representa uma auditoria do código-fonte.

## Contexto conhecido

O Schnitt Hub é descrito como uma aplicação web para gestão de barbearias. A documentação disponível registra uma fundação de front-end em React + Vite, JavaScript ES6+, HTML/CSS e ESLint. A existência de backend, banco de dados, autenticação ou integrações ainda precisa ser confirmada no código.

## Objetivos arquiteturais

1. Tornar as funcionalidades fáceis de localizar e modificar.
2. Manter regras de negócio testáveis.
3. Evitar dependência desnecessária entre interface e infraestrutura.
4. Permitir evolução incremental sem antecipar complexidade.
5. Documentar decisões, riscos e dúvidas.

## Direção proposta

Começar com um **monólito modular**, caso o projeto evolua para incluir backend. Organizar primeiro por capacidades de negócio e separar responsabilidades onde houver benefício real. Não adotar microsserviços sem necessidade demonstrada.

### Front-end

- **Apresentação:** páginas, componentes, formulários e navegação.
- **Aplicação:** coordenação de ações de usuário quando a lógica justificar uma camada separada.
- **Domínio:** regras e conceitos de negócio que possam ser expressos sem depender do React.
- **Infraestrutura:** clientes HTTP, armazenamento local e integrações externas, se existirem.

Esta separação é conceitual. Não é necessário criar diretórios vazios ou abstrações para cada camada desde o início. A estrutura final deve seguir o tamanho e as necessidades reais do projeto.

### Backend e persistência

**Ainda não definidos.** Se forem necessários, comparar alternativas considerando experiência da equipe, implantação, custo operacional, segurança, testes e necessidades do produto. Node.js com TypeScript e API REST pode ser avaliado, mas não deve ser tratado como decisão aprovada. A escolha de banco de dados também depende dos requisitos.

## Princípios

- **Evidência acima de suposições:** verificar o código e os comandos antes de afirmar.
- **Simplicidade proporcional:** adicionar abstrações somente quando reduzirem complexidade.
- **Responsabilidade clara:** cada módulo deve ter um propósito compreensível.
- **Segurança desde o início:** validar entradas, proteger credenciais e aplicar autorização no servidor quando houver backend.
- **Testabilidade:** priorizar testes de regras de negócio e fluxos críticos.
- **Documentação viva:** revisar estes documentos quando decisões forem confirmadas.

## Critérios para aprovar a arquitetura

Antes de fechar a arquitetura, confirmar:
- quais usuários e perfis existirão;
- se haverá uma ou várias barbearias por conta;
- como profissionais, clientes e agendamentos se relacionam;
- quais dados são sensíveis e quem pode acessá-los;
- se pagamentos, notificações ou integrações fazem parte do escopo;
- requisitos de hospedagem, orçamento e manutenção.

## Estado

- **Conhecido pela documentação:** front-end React + Vite como base inicial.
- **Planejado na descrição do produto:** agendamentos, clientes, serviços, dashboard, autenticação, gestão financeira, histórico de atendimentos, profissionais e configurações.
- **Não confirmado:** arquitetura de backend, persistência, autenticação funcional, autorização, APIs, CI/CD e infraestrutura de produção.
