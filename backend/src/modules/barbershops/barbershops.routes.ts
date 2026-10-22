import { Router } from "express";
import { pool } from "../../infrastructure/database/pool.js";
import { AppError } from "../../shared/errors/app-error.js";
import { asyncHandler } from "../../shared/http/async-handler.js";
import { requireRoles } from "../../shared/auth/require-roles.js";
import { updateBarbershopSchema } from "./barbershops.schemas.js";

export const barbershopsRoutes = Router();

barbershopsRoutes.get("/current", asyncHandler(async (request, response) => {
  const result = await pool.query(
    `SELECT id, name, phone, email, timezone, is_active AS "isActive",
            created_at AS "createdAt", updated_at AS "updatedAt"
     FROM barbershops WHERE id = $1`,
    [request.barbershopId]
  );
  if (!result.rows[0]) throw new AppError(404, "Barbearia não encontrada.", "BARBERSHOP_NOT_FOUND");
  response.json({ data: result.rows[0] });
}));

barbershopsRoutes.patch("/current", requireRoles("owner", "admin"), asyncHandler(async (request, response) => {
  const input = updateBarbershopSchema.parse(request.body);
  if (Object.keys(input).length === 0) throw new AppError(400, "Informe ao menos um campo.", "EMPTY_UPDATE");

  const columns: Record<string, string> = { name: "name", phone: "phone", email: "email", timezone: "timezone" };
  const values: unknown[] = [request.barbershopId];
  const assignments: string[] = [];
  for (const [key, value] of Object.entries(input)) {
    assignments.push(`${columns[key]} = $${values.length + 1}`);
    values.push(value ?? null);
  }
  assignments.push("updated_at = NOW()");

  const result = await pool.query(
    `UPDATE barbershops SET ${assignments.join(", ")} WHERE id = $1
     RETURNING id, name, phone, email, timezone, is_active AS "isActive", updated_at AS "updatedAt"`,
    values
  );
  if (!result.rows[0]) throw new AppError(404, "Barbearia não encontrada.", "BARBERSHOP_NOT_FOUND");
  response.json({ data: result.rows[0] });
}));
