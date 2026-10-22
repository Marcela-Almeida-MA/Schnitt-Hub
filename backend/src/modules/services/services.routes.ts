import { Router } from "express";
import { pool } from "../../infrastructure/database/pool.js";
import { AppError } from "../../shared/errors/app-error.js";
import { asyncHandler } from "../../shared/http/async-handler.js";
import { idParamSchema, paginationSchema } from "../../shared/validation/common.js";
import { createServiceSchema, updateServiceSchema } from "./services.schemas.js";

export const servicesRoutes = Router();

servicesRoutes.get("/", asyncHandler(async (request, response) => {
  const { limit, offset } = paginationSchema.parse(request.query);
  const result = await pool.query(
    `SELECT id, name, description, duration_minutes AS "durationMinutes",
            price_cents AS "priceCents", is_active AS "isActive",
            created_at AS "createdAt", updated_at AS "updatedAt"
     FROM services WHERE barbershop_id = $1
     ORDER BY name LIMIT $2 OFFSET $3`,
    [request.barbershopId, limit, offset]
  );
  response.json({ data: result.rows, pagination: { limit, offset } });
}));

servicesRoutes.post("/", asyncHandler(async (request, response) => {
  const input = createServiceSchema.parse(request.body);
  const result = await pool.query(
    `INSERT INTO services (barbershop_id, name, description, duration_minutes, price_cents)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, description, duration_minutes AS "durationMinutes",
               price_cents AS "priceCents", is_active AS "isActive"`,
    [request.barbershopId, input.name, input.description ?? null, input.durationMinutes, input.priceCents]
  );
  response.status(201).json({ data: result.rows[0] });
}));

servicesRoutes.patch("/:id", asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  const input = updateServiceSchema.parse(request.body);
  if (Object.keys(input).length === 0) throw new AppError(400, "Informe ao menos um campo.", "EMPTY_UPDATE");

  const fields: string[] = [];
  const values: unknown[] = [id, request.barbershopId];
  const columns: Record<string, string> = {
    name: "name", description: "description", durationMinutes: "duration_minutes",
    priceCents: "price_cents"
  };
  for (const [key, value] of Object.entries(input)) {
    fields.push(`${columns[key]} = $${values.length + 1}`);
    values.push(value ?? null);
  }
  fields.push("updated_at = NOW()");
  const result = await pool.query(
    `UPDATE services SET ${fields.join(", ")}
     WHERE id = $1 AND barbershop_id = $2
     RETURNING id, name, description, duration_minutes AS "durationMinutes",
               price_cents AS "priceCents", is_active AS "isActive"`,
    values
  );
  if (!result.rows[0]) throw new AppError(404, "Serviço não encontrado.", "SERVICE_NOT_FOUND");
  response.json({ data: result.rows[0] });
}));

servicesRoutes.delete("/:id", asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  // Exclusão lógica preserva o histórico de agendamentos associados ao serviço.
  const result = await pool.query(
    `UPDATE services SET is_active = false, updated_at = NOW()
     WHERE id = $1 AND barbershop_id = $2 RETURNING id`,
    [id, request.barbershopId]
  );
  if (!result.rows[0]) throw new AppError(404, "Serviço não encontrado.", "SERVICE_NOT_FOUND");
  response.status(204).send();
}));
