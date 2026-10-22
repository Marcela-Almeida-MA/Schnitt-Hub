import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { pool } from "./infrastructure/database/pool.js";

const server = app.listen(env.PORT, env.HOST, () => {
  logger.info("Schnitt Hub API iniciada", {
    host: env.HOST,
    port: env.PORT,
    environment: env.NODE_ENV
  });
});

// Encerramento gracioso permite finalizar requisições e liberar conexões.
function shutdown(signal: string) {
  logger.info("Sinal de encerramento recebido", { signal });
  server.close(() => {
    void pool.end().finally(() => process.exit(0));
  });

  // Evita processo preso indefinidamente caso uma conexão não termine.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
