import { Router } from "express";
import { pool } from "../../infrastructure/database/pool.js";
import { AppError } from "../../shared/errors/app-error.js";
import { asyncHandler } from "../../shared/http/async-handler.js";
import { idParamSchema, paginationSchema } from "../../shared/validation/common.js";
import {
  createAppointmentSchema, updateAppointmentSchema, updateAppointmentStatusSchema
} from "./appointments.schemas.js";

export const appointmentsRoutes = Router();

const appointmentSelect = `
  SELECT a.id, a.client_id AS "clientId", c.name AS "clientName",
         a.professional_id AS "professionalId", p.name AS "professionalName",
         a.service_id AS "serviceId", s.name AS "serviceName",
         a.starts_at AS "startsAt", a.ends_at AS "endsAt",
         a.status, a.price_cents AS "priceCents", a.notes,
         a.created_at AS "createdAt", a.updated_at AS "updatedAt"
  FROM appointments a
  JOIN clients c ON c.id = a.client_id
  JOIN professionals p ON p.id = a.professional_id
  JOIN services s ON s.id = a.service_id
`;

appointmentsRoutes.get("/", asyncHandler(async (request, response) => {
  const { limit, offset } = paginationSchema.parse(request.query);
  const result = await pool.query(
    `${appointmentSelect}
     WHERE a.barbershop_id = $1
     ORDER BY a.starts_at DESC LIMIT $2 OFFSET $3`,
    [request.barbershopId, limit, offset]
  );
  response.json({ data: result.rows, pagination: { limit, offset } });
}));

appointmentsRoutes.get("/:id", asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  const result = await pool.query(
    `${appointmentSelect} WHERE a.id = $1 AND a.barbershop_id = $2`,
    [id, request.barbershopId]
  );
  if (!result.rows[0]) throw new AppError(404, "Agendamento não encontrado.", "APPOINTMENT_NOT_FOUND");
  response.json({ data: result.rows[0] });
}));

appointmentsRoutes.post("/", asyncHandler(async (request, response) => {
  const input = createAppointmentSchema.parse(request.body);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Os dados relacionados são buscados dentro da barbearia autorizada.
    // Isso impede usar IDs de clientes, serviços ou profissionais de outra empresa.
    const related = await client.query<{
      client_id: string; professional_id: string; service_id: string;
      duration_minutes: number; price_cents: number;
    }>(
      `SELECT c.id AS client_id, p.id AS professional_id, s.id AS service_id,
              s.duration_minutes, s.price_cents
       FROM clients c
       JOIN professionals p ON p.barbershop_id = c.barbershop_id
       JOIN services s ON s.barbershop_id = c.barbershop_id
       WHERE c.id = $1 AND p.id = $2 AND s.id = $3
         AND c.barbershop_id = $4 AND c.is_active = true
         AND p.is_active = true AND s.is_active = true`,
      [input.clientId, input.professionalId, input.serviceId, request.barbershopId]
    );
    const item = related.rows[0];
    if (!item) throw new AppError(400, "Cliente, profissional ou serviço inválido para esta barbearia.", "INVALID_APPOINTMENT_RELATION");

    const startsAt = new Date(input.startsAt);
    const endsAt = new Date(startsAt.getTime() + item.duration_minutes * 60_000);

    // A transação reduz inconsistências. Para concorrência de produção, considere
    // também uma constraint de exclusão no PostgreSQL ou bloqueio por profissional.
    const conflict = await client.query(
      `SELECT id FROM appointments
       WHERE barbershop_id = $1 AND professional_id = $2
         AND status IN ('scheduled', 'confirmed')
         AND starts_at < $4 AND ends_at > $3
       LIMIT 1`,
      [request.barbershopId, input.professionalId, startsAt.toISOString(), endsAt.toISOString()]
    );
    if (conflict.rowCount) throw new AppError(409, "O profissional já possui um agendamento nesse horário.", "APPOINTMENT_CONFLICT");

    const result = await client.query(
      `INSERT INTO appointments
       (barbershop_id, client_id, professional_id, service_id, starts_at, ends_at, price_cents, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, client_id AS "clientId", professional_id AS "professionalId",
                 service_id AS "serviceId", starts_at AS "startsAt", ends_at AS "endsAt",
                 status, price_cents AS "priceCents", notes`,
      [request.barbershopId, input.clientId, input.professionalId, input.serviceId,
       startsAt.toISOString(), endsAt.toISOString(), item.price_cents, input.notes ?? null]
    );
    await client.query("COMMIT");
    response.status(201).json({ data: result.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    // A constraint do PostgreSQL também protege contra reservas concorrentes.
    // O código 23P01 identifica violação de constraint de exclusão.
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23P01") {
      throw new AppError(409, "O profissional já possui um agendamento nesse horário.", "APPOINTMENT_CONFLICT");
    }
    throw error;
  } finally {
    client.release();
  }
}));

appointmentsRoutes.patch("/:id/status", asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  const { status } = updateAppointmentStatusSchema.parse(request.body);
  const result = await pool.query(
    `UPDATE appointments SET status = $3, updated_at = NOW()
     WHERE id = $1 AND barbershop_id = $2
     RETURNING id, status, updated_at AS "updatedAt"`,
    [id, request.barbershopId, status]
  );
  if (!result.rows[0]) throw new AppError(404, "Agendamento não encontrado.", "APPOINTMENT_NOT_FOUND");
  response.json({ data: result.rows[0] });
}));

appointmentsRoutes.patch("/:id", asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  const input = updateAppointmentSchema.parse(request.body);
  if (Object.keys(input).length === 0) throw new AppError(400, "Informe ao menos um campo.", "EMPTY_UPDATE");

  const current = await pool.query<{
    client_id: string; professional_id: string; service_id: string; starts_at: Date; notes: string | null;
  }>(
    `SELECT client_id, professional_id, service_id, starts_at, notes
     FROM appointments WHERE id = $1 AND barbershop_id = $2`,
    [id, request.barbershopId]
  );
  const old = current.rows[0];
  if (!old) throw new AppError(404, "Agendamento não encontrado.", "APPOINTMENT_NOT_FOUND");

  const clientId = input.clientId ?? old.client_id;
  const professionalId = input.professionalId ?? old.professional_id;
  const serviceId = input.serviceId ?? old.service_id;
  const startsAt = input.startsAt ? new Date(input.startsAt) : new Date(old.starts_at);

  const related = await pool.query<{ duration_minutes: number; price_cents: number }>(
    `SELECT s.duration_minutes, s.price_cents
     FROM clients c
     JOIN professionals p ON p.barbershop_id = c.barbershop_id
     JOIN services s ON s.barbershop_id = c.barbershop_id
     WHERE c.id = $1 AND p.id = $2 AND s.id = $3 AND c.barbershop_id = $4
       AND c.is_active = true AND p.is_active = true AND s.is_active = true`,
    [clientId, professionalId, serviceId, request.barbershopId]
  );
  const item = related.rows[0];
  if (!item) throw new AppError(400, "Cliente, profissional ou serviço inválido para esta barbearia.", "INVALID_APPOINTMENT_RELATION");

  const endsAt = new Date(startsAt.getTime() + item.duration_minutes * 60_000);
  const conflict = await pool.query(
    `SELECT id FROM appointments
     WHERE barbershop_id = $1 AND professional_id = $2 AND id <> $5
       AND status IN ('scheduled', 'confirmed')
       AND starts_at < $4 AND ends_at > $3 LIMIT 1`,
    [request.barbershopId, professionalId, startsAt.toISOString(), endsAt.toISOString(), id]
  );
  if (conflict.rowCount) throw new AppError(409, "O profissional já possui um agendamento nesse horário.", "APPOINTMENT_CONFLICT");

  const result = await pool.query(
    `UPDATE appointments SET client_id = $3, professional_id = $4, service_id = $5,
       starts_at = $6, ends_at = $7, price_cents = $8, notes = $9, updated_at = NOW()
     WHERE id = $1 AND barbershop_id = $2
     RETURNING id, client_id AS "clientId", professional_id AS "professionalId",
       service_id AS "serviceId", starts_at AS "startsAt", ends_at AS "endsAt",
       status, price_cents AS "priceCents", notes, updated_at AS "updatedAt"`,
    [id, request.barbershopId, clientId, professionalId, serviceId, startsAt.toISOString(),
      endsAt.toISOString(), item.price_cents, input.notes === undefined ? old.notes : input.notes]
  );
  response.json({ data: result.rows[0] });
}));

appointmentsRoutes.delete("/:id", asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  // Cancelar preserva histórico e vínculos financeiros futuros.
  const result = await pool.query(
    `UPDATE appointments SET status = 'cancelled', updated_at = NOW()
     WHERE id = $1 AND barbershop_id = $2 RETURNING id, status`,
    [id, request.barbershopId]
  );
  if (!result.rows[0]) throw new AppError(404, "Agendamento não encontrado.", "APPOINTMENT_NOT_FOUND");
  response.json({ data: result.rows[0] });
}));
