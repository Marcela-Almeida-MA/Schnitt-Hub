import { z } from "zod";

export const createProfessionalSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).optional().nullable(),
  phone: z.string().trim().max(40).optional().nullable()
});
export const updateProfessionalSchema = createProfessionalSchema.partial();
