import { z } from "zod";

export const updateBarbershopSchema = z.object({
  name: z.string().trim().min(2).max(160).optional(),
  phone: z.string().trim().max(40).nullable().optional(),
  email: z.string().trim().email().max(254).nullable().optional(),
  timezone: z.string().trim().min(1).max(80).optional()
});
