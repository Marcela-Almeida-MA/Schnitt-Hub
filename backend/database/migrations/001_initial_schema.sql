-- Esquema inicial do Schnitt Hub (PostgreSQL).
-- Execute uma única vez em um banco vazio. Para evoluções futuras, crie novas migrações.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Permite usar igualdade UUID em uma constraint GiST contra sobreposição de horários.
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TYPE membership_role AS ENUM ('owner', 'admin', 'professional', 'receptionist');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE barbershops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(160) NOT NULL,
  phone VARCHAR(40),
  email VARCHAR(254),
  timezone VARCHAR(80) NOT NULL DEFAULT 'America/Sao_Paulo',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Associação explícita permite que um usuário participe de várias barbearias.
CREATE TABLE barbershop_memberships (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  barbershop_id UUID NOT NULL REFERENCES barbershops(id) ON DELETE RESTRICT,
  role membership_role NOT NULL DEFAULT 'professional',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, barbershop_id)
);

CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id UUID NOT NULL REFERENCES barbershops(id) ON DELETE RESTRICT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254),
  phone VARCHAR(40),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (id, barbershop_id)
);
CREATE INDEX idx_professionals_shop_active ON professionals(barbershop_id, is_active, name);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id UUID NOT NULL REFERENCES barbershops(id) ON DELETE RESTRICT,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(1000),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes BETWEEN 5 AND 600),
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (id, barbershop_id)
);
CREATE INDEX idx_services_shop_active ON services(barbershop_id, is_active, name);

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id UUID NOT NULL REFERENCES barbershops(id) ON DELETE RESTRICT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254),
  phone VARCHAR(40),
  notes VARCHAR(2000),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (id, barbershop_id)
);
CREATE INDEX idx_clients_shop_name ON clients(barbershop_id, name);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id UUID NOT NULL REFERENCES barbershops(id) ON DELETE RESTRICT,
  client_id UUID NOT NULL,
  professional_id UUID NOT NULL,
  service_id UUID NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  -- O valor é copiado para o agendamento para preservar o preço histórico do serviço.
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  notes VARCHAR(2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (ends_at > starts_at),
  FOREIGN KEY (client_id, barbershop_id) REFERENCES clients(id, barbershop_id) ON DELETE RESTRICT,
  FOREIGN KEY (professional_id, barbershop_id) REFERENCES professionals(id, barbershop_id) ON DELETE RESTRICT,
  FOREIGN KEY (service_id, barbershop_id) REFERENCES services(id, barbershop_id) ON DELETE RESTRICT
);
CREATE INDEX idx_appointments_shop_start ON appointments(barbershop_id, starts_at);
CREATE INDEX idx_appointments_professional_start ON appointments(barbershop_id, professional_id, starts_at);
CREATE INDEX idx_appointments_status ON appointments(barbershop_id, status, starts_at);

-- Protege contra dois agendamentos ativos sobrepostos para o mesmo profissional,
-- inclusive quando duas requisições concorrentes tentam reservar o mesmo horário.
ALTER TABLE appointments
  ADD CONSTRAINT appointments_no_active_overlap
  EXCLUDE USING gist (
    barbershop_id WITH =,
    professional_id WITH =,
    tstzrange(starts_at, ends_at, '[)') WITH &&
  ) WHERE (status IN ('scheduled', 'confirmed'));

-- Atualiza updated_at automaticamente para as tabelas que possuem esse campo.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER barbershops_set_updated_at BEFORE UPDATE ON barbershops
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER professionals_set_updated_at BEFORE UPDATE ON professionals
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER services_set_updated_at BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER clients_set_updated_at BEFORE UPDATE ON clients
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER appointments_set_updated_at BEFORE UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
