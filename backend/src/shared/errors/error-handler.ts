import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "./app-error.js";
import { logger } from "../../config/logger.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Os dados enviados são inválidos.",
        details: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message
        }))
      }
    });
    return;
    // O Express exige o quarto parâmetro para reconhecer o middleware de erros.
    // Referenciar a variável evita o alerta de parâmetro não utilizado.
    void next;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: { code: error.code, message: error.message }
    });
    return;
  }

  // Algumas regras de integridade são garantidas pelo PostgreSQL. Traduzimos
  // seus códigos conhecidos em conflitos HTTP sem expor a mensagem do banco.
  if (typeof error === "object" && error !== null && "code" in error) {
    if (error.code === "23P01") {
      response.status(409).json({
        error: { code: "APPOINTMENT_CONFLICT", message: "O profissional já possui um agendamento nesse horário." }
      });
      return;
    }
    if (error.code === "23505") {
      response.status(409).json({
        error: { code: "RESOURCE_ALREADY_EXISTS", message: "Já existe um registro com esses dados únicos." }
      });
      return;
    }
  }

  // A resposta pública é genérica; detalhes internos ficam apenas no log.
  logger.error("Erro não tratado", {
    message: error instanceof Error ? error.message : "Erro desconhecido"
  });
  response.status(500).json({
    error: { code: "INTERNAL_SERVER_ERROR", message: "Ocorreu um erro interno." }
  });
};
