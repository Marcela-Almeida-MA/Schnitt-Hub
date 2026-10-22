import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../infrastructure/database/pool.js";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/app-error.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  barbershopName: string;
}

interface LoginInput {
  email: string;
  password: string;
}

function createToken(userId: string): string {
  // O token contém apenas o identificador do usuário; a associação à barbearia
  // é verificada no servidor em cada requisição protegida.
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
}

export async function register(input: RegisterInput) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const existing = await client.query("SELECT id FROM users WHERE email = $1", [input.email]);
    if (existing.rowCount) {
      throw new AppError(409, "Já existe uma conta com este e-mail.", "EMAIL_ALREADY_EXISTS");
    }

    const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
    const userResult = await client.query<{ id: string; name: string; email: string }>(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [input.name, input.email, passwordHash]
    );
    const user = userResult.rows[0]!;

    const shopResult = await client.query<{ id: string; name: string }>(
      "INSERT INTO barbershops (name) VALUES ($1) RETURNING id, name",
      [input.barbershopName]
    );
    const barbershop = shopResult.rows[0]!;

    await client.query(
      "INSERT INTO barbershop_memberships (user_id, barbershop_id, role) VALUES ($1, $2, 'owner')",
      [user.id, barbershop.id]
    );

    await client.query("COMMIT");
    return { user, barbershop, token: createToken(user.id) };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function login(input: LoginInput) {
  const result = await pool.query<{
    id: string; name: string; email: string; password_hash: string; is_active: boolean;
  }>(
    "SELECT id, name, email, password_hash, is_active FROM users WHERE email = $1",
    [input.email]
  );
  const user = result.rows[0];

  // Mensagem genérica para não revelar se o e-mail está cadastrado.
  if (!user || !user.is_active || !(await bcrypt.compare(input.password, user.password_hash))) {
    throw new AppError(401, "E-mail ou senha inválidos.", "INVALID_CREDENTIALS");
  }

  const memberships = await pool.query<{ id: string; name: string; role: string }>(
    `SELECT b.id, b.name, m.role
     FROM barbershop_memberships m
     JOIN barbershops b ON b.id = m.barbershop_id
     WHERE m.user_id = $1 AND m.is_active = true AND b.is_active = true
     ORDER BY b.name`,
    [user.id]
  );

  return {
    user: { id: user.id, name: user.name, email: user.email },
    barbershops: memberships.rows,
    token: createToken(user.id)
  };
}

export async function getCurrentUser(userId: string) {
  const result = await pool.query<{ id: string; name: string; email: string }>(
    "SELECT id, name, email FROM users WHERE id = $1 AND is_active = true",
    [userId]
  );
  const user = result.rows[0];
  if (!user) throw new AppError(404, "Usuário não encontrado.", "USER_NOT_FOUND");

  const memberships = await pool.query<{ id: string; name: string; role: string }>(
    `SELECT b.id, b.name, m.role
     FROM barbershop_memberships m
     JOIN barbershops b ON b.id = m.barbershop_id
     WHERE m.user_id = $1 AND m.is_active = true AND b.is_active = true`,
    [userId]
  );
  return { ...user, barbershops: memberships.rows };
}
