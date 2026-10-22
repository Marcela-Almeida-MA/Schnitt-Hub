// Dados do usuário autenticado disponíveis durante uma requisição.
export interface AuthenticatedUser {
  id: string;
}

// Amplia a tipagem original do Express sem declarar um namespace global.
declare module "express-serve-static-core" {
  interface Request {
    authUser?: AuthenticatedUser;
    barbershopId?: string;
    membershipRole?: "owner" | "admin" | "professional" | "receptionist";
  }
}
