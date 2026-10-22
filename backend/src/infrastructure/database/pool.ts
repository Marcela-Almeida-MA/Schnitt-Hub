import pg from "pg";
import { env } from "../../config/env.js";

const { Pool } = pg;

// Um pool reutiliza conexões e evita abrir uma nova conexão para cada requisição.
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.DATABASE_POOL_MAX,
  ssl: env.DATABASE_SSL ? { rejectUnauthorized: true } : false,
  application_name: "schnitt-hub-api"
});

pool.on("error", (error) => {
  // Erros de conexão ociosa precisam ser registrados, sem dados de conexão.
  console.error("Erro inesperado no pool PostgreSQL:", error.message);
});

export async function checkDatabaseConnection(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
  } finally {
    client.release();
  }
}
