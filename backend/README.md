# Schnitt Hub — Backend

API REST modular para a plataforma de gestão de barbearias.

> **Status:** estrutura inicial implementada como base de desenvolvimento. Antes de produção, revise os requisitos, execute os testes, configure o banco, faça uma revisão de segurança e valide os fluxos com o front-end.

## Stack

- Node.js + TypeScript
- Express 5
- PostgreSQL + `pg`
- Zod para validação de entrada
- bcryptjs para hash de senhas
- JWT para autenticação
- Helmet, CORS e rate limiting para proteções HTTP básicas
- Vitest + Supertest para testes

## Requisitos

- Node.js 24 ou uma versão LTS compatível com as dependências
- npm
- PostgreSQL 15+ recomendado

## Configuração local

Na pasta `Backend/`:

```bash
npm install
cp .env.example .env
```

Edite `.env` com as credenciais locais do PostgreSQL e defina um `JWT_SECRET` aleatório e forte. Não compartilhe nem versione esse arquivo.

Crie o banco de dados, por exemplo:

```sql
CREATE DATABASE schnitt_hub;
```

Aplique a migração inicial. Como o `.env` da aplicação não exporta automaticamente variáveis para o terminal, informe a URL ao `psql` ou carregue a variável explicitamente:

```bash
export DATABASE_URL='postgresql://postgres:SUA_SENHA@localhost:5432/schnitt_hub'
psql "$DATABASE_URL" -f database/migrations/001_initial_schema.sql
```

Substitua a URL pelos dados reais do seu PostgreSQL local. Não use uma senha real em comandos compartilhados ou capturas de tela.

## Executar

```bash
npm run dev
```

API local: `http://localhost:3333`

Verificação de saúde:

```bash
curl http://localhost:3333/api/health
```

Verificações de código:

```bash
npm run typecheck
npm test
npm run build
```

## Fluxo inicial

1. `POST /api/auth/register` cria usuário, barbearia e associação de proprietário.
2. A resposta traz um token JWT e o identificador da barbearia.
3. Para endpoints de domínio, envie `Authorization: Bearer <token>` e `X-Barbershop-Id: <uuid>`.
4. O backend verifica se o usuário pertence à barbearia selecionada antes de executar a operação.

### Exemplo de cadastro

```bash
curl -X POST http://localhost:3333/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Pessoa Responsável",
    "email": "responsavel@example.com",
    "password": "uma-senha-forte-para-desenvolvimento",
    "barbershopName": "Barbearia Exemplo"
  }'
```

Não reutilize credenciais de exemplo em ambientes reais.

## Endpoints iniciais

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET|PATCH /api/barbershops/current`
- `GET|POST /api/services`
- `PATCH|DELETE /api/services/:id`
- `GET|POST /api/professionals`
- `PATCH|DELETE /api/professionals/:id`
- `GET|POST /api/clients`
- `PATCH|DELETE /api/clients/:id`
- `GET|POST /api/appointments`
- `GET /api/appointments/:id`
- `PATCH /api/appointments/:id/status`
- `PATCH /api/appointments/:id`
- `DELETE /api/appointments/:id`- `DELETE /api/appointments/:id`


Os endpoints de domínio exigem token e `X-Barbershop-Id`. Consulte `../docs/database-schema.md` para o modelo persistente.

## Decisões e limitações atuais

- O modelo é multi-barbearia: uma conta pode ter associação explícita a uma ou mais barbearias.
- O primeiro cadastro cria uma barbearia e associa o usuário como `owner`.
- O token não escolhe sozinho a barbearia ativa; cada requisição protegida envia `X-Barbershop-Id`, validado pelo servidor.
- A primeira versão implementa operações essenciais, não um sistema financeiro completo, notificações, recuperação de senha ou gestão avançada de permissões.
- O endpoint de cancelamento de agendamento altera o status para `cancelled`; não apaga o histórico.
- O projeto não inclui uma interface administrativa nem integração com provedores externos.
- Não há ainda estratégia de refresh token. O JWT tem validade limitada e o cliente deve tratar expiração.
- Revise o modelo de conflitos de horário e considere restrições/transações adicionais antes de usar em produção sob concorrência elevada.

## Segurança

- Não exponha `DATABASE_URL` ou `JWT_SECRET`.
- Não use `NODE_ENV=development` em produção.
- Configure `FRONTEND_ORIGIN` com a origem exata do front-end.
- Use HTTPS em produção.
- Configure backups, monitoramento, política de atualização e revisão de permissões.
