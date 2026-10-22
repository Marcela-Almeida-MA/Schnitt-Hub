import { Router } from "express";
import { pool } from "../../infrastructure/database/pool.js";
import { AppError } from "../../shared/errors/app-error.js";
import { asyncHandler } from "../../shared/http/async-handler.js";
import { idParamSchema, paginationSchema } from "../../shared/validation/common.js";
import { createProfessionalSchema, updateProfessionalSchema } from "./professionals.schemas.js";

export const professionalsRoutes = Router();

professionalsRoutes.get("/", asyncHandler(async (request, response) => {
  const { limit, offset } = paginationSchema.parse(request.query);
  const result = await pool.query(
    `SELECT id, name, email, phone, is_active AS "isActive",
            created_at AS "createdAt", updated_at AS "updatedAt"
     FROM professionals WHERE barbershop_id = $1
     ORDER BY name LIMIT $2 OFFSET $3`,
    [request.barbershopId, limit, offset]
  );
  response.json({ data: result.rows, pagination: { limit, offset } });
}));

professionalsRoutes.post("/", asyncHandler(async (request, response) => {
  const input = createProfessionalSchema.parse(request.body);
  const result = await pool.query(
    `INSERT INTO professionals (barbershop_id, name, email, phone)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, phone, is_active AS "isActive"`,
    [request.barbershopId, input.name, input.email ?? null, input.phone ?? null]
  );
  response.status(201).json({ data: result.rows[0] });
}));

professionalsRoutes.patch("/:id", asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  const input = updateProfessionalSchema.parse(request.body);
  if (Object.keys(input).length === 0) throw new AppError(400, "Informe ao menos um campo.", "EMPTY_UPDATE");

  const fields: string[] = [];
  const values: unknown[] = [id, request.barbershopId];
  const columns: Record<string, string> = { name: "name", email: "email", phone: "phone" };
  for (const [key, value] of Object.entries(input)) {
    fields.push(`${columns[key]} = $${values.length + 1}`);
    values.push(value ?? null);
  }
  fields.push("updated_at = NOW()");
  const result = await pool.query(
    `UPDATE professionals SET ${fields.join(", ")}
     WHERE id = $1 AND barbershop_id = $2
     RETURNING id, name, email, phone, is_active AS "isActive"`,
    values
  );
  if (!result.rows[0]) throw new AppError(404, "Profissional não encontrado.", "PROFESSIONAL_NOT_FOUND");
  response.json({ data: result.rows[0] });
}));

professionalsRoutes.delete("/:id", asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  const result = await pool.query(
    `UPDATE professionals SET is_active = false, updated_at = NOW()
     WHERE id = $1 AND barbershop_id = $2 RETURNING id`,
    [id, request.barbershopId]
  );
  if (!result.rows[0]) throw new AppError(404, "Profissional não encontrado.", "PROFESSIONAL_NOT_FOUND");
  response.status(204).send();
}));
