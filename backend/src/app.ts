import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { apiRoutes } from "./routes/index.js";
import { errorHandler } from "./shared/errors/error-handler.js";
import { AppError } from "./shared/errors/app-error.js";

export const app = express();

// Cabeçalhos HTTP de segurança; o front-end deve usar HTTPS em produção.
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_ORIGIN,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Barbershop-Id"]
}));
app.use(express.json({ limit: "1mb" }));

// Limite básico para reduzir abuso dos endpoints. Ajuste-o após observar o tráfego real.
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false
}));

app.get("/", (_request, response) => {
  response.json({ name: "Schnitt Hub API", docs: "/api/health" });
});

app.use("/api", apiRoutes);

// Rota não encontrada é convertida para erro conhecido.
app.use((_request, _response, next) => {
  next(new AppError(404, "Rota não encontrada.", "ROUTE_NOT_FOUND"));
});

// O middleware de erros deve ficar por último.
app.use(errorHandler);
