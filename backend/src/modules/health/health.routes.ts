import { Router } from "express";
import { asyncHandler } from "../../shared/http/async-handler.js";
import { checkDatabaseConnection } from "../../infrastructure/database/pool.js";

export const healthRoutes = Router();

healthRoutes.get("/", asyncHandler(async (_request, response) => {
  // O status da base é útil para monitoramento sem expor detalhes internos.
  await checkDatabaseConnection();
  response.status(200).json({ status: "ok", database: "connected" });
}));
