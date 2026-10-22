import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).optional().nullable(),
  durationMinutes: z.number().int().min(5).max(600),
  priceCents: z.number().int().min(0).max(100000000)
});

export const updateServiceSchema = createServiceSchema.partial();
