import { z } from "zod";

export const uuidSchema = z.string().uuid("Identificador inválido.");
export const idParamSchema = z.object({ id: uuidSchema });
export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0)
});
