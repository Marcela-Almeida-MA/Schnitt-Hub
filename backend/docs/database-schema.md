# Documentação do schema do banco — Schnitt Hub

- **Banco proposto:** PostgreSQL.
- **Migração inicial:** `Backend/database/migrations/001_initial_schema.sql`.
- **Status:** esquema inicial implementado em SQL, ainda precisa ser aplicado e validado em um PostgreSQL real.
- **Escopo:** autenticação básica, associação multi-barbearia, profissionais, serviços, clientes e agendamentos.
- **Fora do escopo atual:** caixa, despesas, comissões, pagamentos, horários de funcionamento, bloqueios de agenda, notificações, auditoria avançada e recuperação de senha.

## 1. Diagrama lógico

```text
users ──< barbershop_memberships >── barbershops
                                         │
                 ┌───────────────────────┼──────────────────────┐
                 │                       │                      │
             services              professionals             clients
                 │                       │                      │
                 └───────────────────────┴──────────────────────┘
                                         │
                                    appointments
```

`appointments` pertence a uma barbearia e referencia cliente, profissional e serviço dessa mesma barbearia. O banco reforça isso com chaves estrangeiras compostas.

## 2. Tabelas

### `users`

| Coluna | Tipo | Regras / finalidade |
|---|---|---|
| `id` | UUID | Chave primária gerada pelo PostgreSQL |
| `name` | VARCHAR(120) | Nome de exibição |
| `email` | VARCHAR(254) | Obrigatório e único; armazenado em minúsculas pela aplicação |
| `password_hash` | TEXT | Hash bcrypt; nunca armazenar senha em texto puro |
| `is_active` | BOOLEAN | Permite desativar acesso sem apagar histórico |
| `created_at`, `updated_at` | TIMESTAMPTZ | Auditoria básica de criação/alteração |

### `barbershops`

| Coluna | Tipo | Regras / finalidade |
|---|---|---|
| `id` | UUID | Chave primária |
| `name` | VARCHAR(160) | Nome da barbearia |
| `phone`, `email` | VARCHAR | Contato opcional |
| `timezone` | VARCHAR(80) | Fuso da barbearia; padrão `America/Sao_Paulo` |
| `is_active` | BOOLEAN | Desativação lógica |
| `created_at`, `updated_at` | TIMESTAMPTZ | Datas de auditoria |

### `barbershop_memberships`

Associa usuários a barbearias e define o papel de cada usuário.

| Coluna | Tipo | Regras / finalidade |
|---|---|---|
| `user_id` | UUID | FK para `users` |
| `barbershop_id` | UUID | FK para `barbershops` |
| `role` | ENUM | `owner`, `admin`, `professional` ou `receptionist` |
| `is_active` | BOOLEAN | Permite revogar a associação |
| `created_at` | TIMESTAMPTZ | Data de associação |

Chave primária composta: `(user_id, barbershop_id)`. A API atual valida a associação, mas ainda não implementa autorização diferenciada por papel em cada operação.

### `professionals`

| Coluna | Tipo | Regras / finalidade |
|---|---|---|
| `id` | UUID | Chave primária |
| `barbershop_id` | UUID | FK da barbearia proprietária |
| `name` | VARCHAR(120) | Nome do profissional |
| `email`, `phone` | VARCHAR | Contatos opcionais |
| `is_active` | BOOLEAN | Desativação lógica |
| `created_at`, `updated_at` | TIMESTAMPTZ | Datas de auditoria |

### `services`

| Coluna | Tipo | Regras / finalidade |
|---|---|---|
| `id` | UUID | Chave primária |
| `barbershop_id` | UUID | FK da barbearia proprietária |
| `name` | VARCHAR(120) | Nome do serviço |
| `description` | VARCHAR(1000) | Descrição opcional |
| `duration_minutes` | INTEGER | Entre 5 e 600 minutos |
| `price_cents` | INTEGER | Preço em centavos; não usar ponto flutuante para dinheiro |
| `is_active` | BOOLEAN | Desativação lógica |
| `created_at`, `updated_at` | TIMESTAMPTZ | Datas de auditoria |

### `clients`

| Coluna | Tipo | Regras / finalidade |
|---|---|---|
| `id` | UUID | Chave primária |
| `barbershop_id` | UUID | FK da barbearia proprietária |
| `name` | VARCHAR(120) | Nome do cliente |
| `email`, `phone` | VARCHAR | Contatos opcionais |
| `notes` | VARCHAR(2000) | Observações operacionais; evite registrar dados sensíveis |
| `is_active` | BOOLEAN | Desativação lógica |
| `created_at`, `updated_at` | TIMESTAMPTZ | Datas de auditoria |

### `appointments`

| Coluna | Tipo | Regras / finalidade |
|---|---|---|
| `id` | UUID | Chave primária |
| `barbershop_id` | UUID | FK da barbearia |
| `client_id` | UUID | Cliente da mesma barbearia |
| `professional_id` | UUID | Profissional da mesma barbearia |
| `service_id` | UUID | Serviço da mesma barbearia |
| `starts_at`, `ends_at` | TIMESTAMPTZ | Início e fim com fuso explícito |
| `status` | ENUM | `scheduled`, `confirmed`, `completed`, `cancelled`, `no_show` |
| `price_cents` | INTEGER | Snapshot do preço no momento do agendamento |
| `notes` | VARCHAR(2000) | Observações opcionais |
| `created_at`, `updated_at` | TIMESTAMPTZ | Datas de auditoria |

O banco verifica `ends_at > starts_at` e aplica a constraint `appointments_no_active_overlap`, que impede sobreposição de agendamentos `scheduled`/`confirmed` para o mesmo profissional, inclusive sob concorrência. A API também verifica o conflito para retornar uma mensagem amigável.

## 3. Relacionamentos e cardinalidade

- Um usuário pode pertencer a várias barbearias; uma barbearia pode ter vários usuários (N:N por `barbershop_memberships`).
- Uma barbearia pode ter vários profissionais, serviços, clientes e agendamentos (1:N).
- Cada agendamento referencia um cliente, profissional e serviço.
- As FKs compostas de `appointments` impedem ligar recursos pertencentes a barbearias diferentes.
- Exclusões são restritas para preservar histórico. A API usa desativação lógica para serviços, profissionais e clientes.

## 4. Índices

- `users(email)` é único e indexado pela constraint.
- Profissionais e serviços são indexados por barbearia e estado.
- Clientes são indexados por barbearia e nome.
- Agendamentos são indexados por barbearia/data, barbearia/profissional/data e barbearia/status/data.

## 5. Regras de segurança

1. O usuário autentica com JWT.
2. Endpoints de domínio exigem `X-Barbershop-Id`.
3. O middleware verifica se existe associação ativa do usuário com a barbearia.
4. As consultas de recursos filtram pelo `barbershop_id` autorizado.
5. Senhas são armazenadas em bcrypt; o hash nunca é retornado.
6. Todas as queries recebem valores por parâmetros, evitando concatenar dados do usuário no SQL.
7. O schema reforça a integridade entre barbearia e recursos relacionados.

## 6. Aplicar a migração

Com PostgreSQL instalado e `DATABASE_URL` configurada em `Backend/.env`:

```bash
cd Backend
psql "$DATABASE_URL" -f database/migrations/001_initial_schema.sql
```

Faça backup antes de aplicar migrações em qualquer banco com dados. Esta migração inicial destina-se a um banco novo.

## 7. Evoluções futuras

Quando requisitos forem confirmados, avaliar:
- horários de funcionamento e exceções por profissional;
- ajustes adicionais de concorrência e regras de disponibilidade;
- tabela de auditoria;
- pagamentos, caixa, despesas e comissões;
- convites de usuários e recuperação de senha;
- regras de acesso por papel;
- política de retenção e exclusão de dados pessoais.
