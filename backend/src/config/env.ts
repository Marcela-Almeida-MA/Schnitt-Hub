import "dotenv/config";
import { z } from "zod";

// Validamos a configuração uma única vez na inicialização para falhar cedo
// quando uma variável obrigatória estiver ausente ou mal configurada.
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3333),
  HOST: z.string().default("127.0.0.1"),
  FRONTEND_ORIGIN: z.string().url().default("http://localhost:5173"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória"),
  DATABASE_SSL: z.enum(["true", "false"]).default("false"),
  DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(100).default(10),
  JWT_SECRET: z.string().min(32, "JWT_SECRET precisa ter pelo menos 32 caracteres"),
  JWT_EXPIRES_IN: z.string().default("8h"),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Não imprimimos valores de ambiente: eles podem conter senhas e tokens.
  console.error("Configuração inválida. Verifique as variáveis do arquivo .env.");
  console.error(parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n"));
  process.exit(1);
}

export const env = {
  ...parsed.data,
  DATABASE_SSL: parsed.data.DATABASE_SSL === "true"
};
