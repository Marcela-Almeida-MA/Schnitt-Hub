import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "../src/modules/auth/auth.schemas.js";

describe("schemas de autenticação", () => {
  it("normaliza o e-mail para minúsculas ao cadastrar", () => {
    const result = registerSchema.parse({
      name: "Marcela",
      email: "MARCELA@EXAMPLE.COM",
      password: "uma-senha-bem-forte-123",
      barbershopName: "Barbearia Central"
    });
    expect(result.email).toBe("marcela@example.com");
  });

  it("rejeita senha menor que o mínimo de cadastro", () => {
    const result = registerSchema.safeParse({
      name: "Marcela",
      email: "marcela@example.com",
      password: "curta",
      barbershopName: "Barbearia Central"
    });
    expect(result.success).toBe(false);
  });

  it("normaliza o e-mail no login", () => {
    expect(loginSchema.parse({ email: "TESTE@EXAMPLE.COM", password: "senha" }).email)
      .toBe("teste@example.com");
  });
});
