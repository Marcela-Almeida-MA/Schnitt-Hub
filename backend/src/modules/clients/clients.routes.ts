import { Router } from "express";
import { pool } from "../../infrastructure/database/pool.js";
import { AppError } from "../../shared/errors/app-error.js";
import { asyncHandler } from "../../shared/http/async-handler.js";
import { idParamSchema, paginationSchema } from "../../shared/validation/common.js";
import { createClientSchema, updateClientSchema } from "./clients.schemas.js";

export const clientsRoutes = Router();

clientsRoutes.get("/", asyncHandler(async (request, response) => {
  const { limit, offset } = paginationSchema.parse(request.query);
  const result = await pool.query(
    `SELECT id, name, email, phone, notes, created_at AS "createdAt",
            updated_at AS "updatedAt"
     FROM clients WHERE barbershop_id = $1
     ORDER BY name LIMIT $2 OFFSET $3`,
    [request.barbershopId, limit, offset]
  );
  response.json({ data: result.rows, pagination: { limit, offset } });
}));

clientsRoutes.post("/", asyncHandler(async (request, response) => {
  const input = createClientSchema.parse(request.body);
  const result = await pool.query(
    `INSERT INTO clients (barbershop_id, name, email, phone, notes)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, notes, created_at AS "createdAt"`,
    [request.barbershopId, input.name, input.email ?? null, input.phone ?? null, input.notes ?? null]
  );
  response.status(201).json({ data: result.rows[0] });
}));

clientsRoutes.patch("/:id", asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  const input = updateClientSchema.parse(request.body);
  if (Object.keys(input).length === 0) throw new AppError(400, "Informe ao menos um campo.", "EMPTY_UPDATE");

  const fields: string[] = [];
  const values: unknown[] = [id, request.barbershopId];
  const columns: Record<string, string> = { name: "name", email: "email", phone: "phone", notes: "notes" };
  for (const [key, value] of Object.entries(input)) {
    fields.push(`${columns[key]} = $${values.length + 1}`);
    values.push(value ?? null);
  }
  fields.push("updated_at = NOW()");
  const result = await pool.query(
    `UPDATE clients SET ${fields.join(", ")}
     WHERE id = $1 AND barbershop_id = $2
     RETURNING id, name, email, phone, notes, updated_at AS "updatedAt"`,
    values
  );
  if (!result.rows[0]) throw new AppError(404, "Cliente não encontrado.", "CLIENT_NOT_FOUND");
  response.json({ data: result.rows[0] });
}));

clientsRoutes.delete("/:id", asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  // O cliente é desativado em vez de apagado para preservar referências históricas.
  const result = await pool.query(
    `UPDATE clients SET is_active = false, updated_at = NOW()
     WHERE id = $1 AND barbershop_id = $2 RETURNING id`,
    [id, request.barbershopId]
  );
  if (!result.rows[0]) throw new AppError(404, "Cliente não encontrado.", "CLIENT_NOT_FOUND");
  response.status(204).send();
}));
