import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../errors/app-error.js";
import { asyncHandler } from "../http/async-handler.js";
import { pool } from "../../infrastructure/database/pool.js";

interface TokenPayload extends jwt.JwtPayload {
  sub: string;
}

export const requireAuth: RequestHandler = (request, _response, next) => {
  const authorization = request.header("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    next(new AppError(401, "Autenticação necessária.", "AUTHENTICATION_REQUIRED"));
    return;
  }

  try {
    const token = authorization.slice("Bearer ".length);
    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    if (typeof payload.sub !== "string") {
      throw new Error("Token sem subject");
    }
    request.authUser = { id: payload.sub };
    next();
  } catch {
    next(new AppError(401, "Token inválido ou expirado.", "INVALID_TOKEN"));
  }
};

export const requireBarbershopMembership: RequestHandler = asyncHandler(async (request, _response, next) => {
  const barbershopId = request.header("x-barbershop-id");
  if (!barbershopId) {
    throw new AppError(400, "Informe o cabeçalho X-Barbershop-Id.", "BARBERSHOP_REQUIRED");
  }

  const membership = await pool.query<{ role: "owner" | "admin" | "professional" | "receptionist" }>(
    `SELECT m.role
     FROM barbershop_memberships m
     JOIN barbershops b ON b.id = m.barbershop_id
     WHERE m.user_id = $1 AND m.barbershop_id = $2
       AND m.is_active = true AND b.is_active = true`,
    [request.authUser?.id, barbershopId]
  );

  const row = membership.rows[0];
  if (!row) throw new AppError(403, "Você não tem acesso a esta barbearia.", "BARBERSHOP_ACCESS_DENIED");

  request.barbershopId = barbershopId;
  request.membershipRole = row.role;
  next();
});
