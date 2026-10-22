import { describe, expect, it } from "vitest";
import { createServiceSchema } from "../src/modules/services/services.schemas.js";

describe("schema de serviços", () => {
  it("aceita preço em centavos e duração válidos", () => {
    const result = createServiceSchema.parse({
      name: "Corte tradicional",
      durationMinutes: 30,
      priceCents: 4500
    });
    expect(result.priceCents).toBe(4500);
    expect(result.durationMinutes).toBe(30);
  });

  it("rejeita duração fora do intervalo permitido", () => {
    const result = createServiceSchema.safeParse({
      name: "Corte tradicional",
      durationMinutes: 0,
      priceCents: 4500
    });
    expect(result.success).toBe(false);
  });
});
