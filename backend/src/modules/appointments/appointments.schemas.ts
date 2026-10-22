import { z } from "zod";

export const createAppointmentSchema = z.object({
  clientId: z.string().uuid(),
  professionalId: z.string().uuid(),
  serviceId: z.string().uuid(),
  startsAt: z.string().datetime({ offset: true }),
  notes: z.string().trim().max(2000).optional().nullable()
});

export const updateAppointmentSchema = z.object({
  clientId: z.string().uuid().optional(),
  professionalId: z.string().uuid().optional(),
  serviceId: z.string().uuid().optional(),
  startsAt: z.string().datetime({ offset: true }).optional(),
  notes: z.string().trim().max(2000).optional().nullable()
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["scheduled", "confirmed", "completed", "cancelled", "no_show"])
});
