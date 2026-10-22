import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).optional().nullable(),
  phone: z.string().trim().min(8).max(40).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable()
});
export const updateClientSchema = createClientSchema.partial();
