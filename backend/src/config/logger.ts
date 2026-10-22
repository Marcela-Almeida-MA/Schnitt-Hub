import { env } from "./env.js";

type Level = "debug" | "info" | "warn" | "error";
const priorities: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

// Logger pequeno e estruturado para manter a base simples.
// Nunca passe senhas, tokens ou objetos de requisição inteiros para este logger.
function write(level: Level, message: string, metadata?: Record<string, unknown>) {
  if (priorities[level] < priorities[env.LOG_LEVEL]) return;
  const entry = { timestamp: new Date().toISOString(), level, message, ...metadata };
  const output = JSON.stringify(entry);
  if (level === "error") console.error(output);
  else if (level === "warn") console.warn(output);
  else console.log(output);
}

export const logger = {
  debug: (message: string, metadata?: Record<string, unknown>) => write("debug", message, metadata),
  info: (message: string, metadata?: Record<string, unknown>) => write("info", message, metadata),
  warn: (message: string, metadata?: Record<string, unknown>) => write("warn", message, metadata),
  error: (message: string, metadata?: Record<string, unknown>) => write("error", message, metadata)
};
