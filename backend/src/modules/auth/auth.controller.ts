import type { Request, Response } from "express";
import { register, login, getCurrentUser } from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.schemas.js";

export async function registerController(request: Request, response: Response) {
  const input = registerSchema.parse(request.body);
  const result = await register(input);
  response.status(201).json({ data: result });
}

export async function loginController(request: Request, response: Response) {
  const input = loginSchema.parse(request.body);
  const result = await login(input);
  response.status(200).json({ data: result });
}

export async function meController(request: Request, response: Response) {
  const user = await getCurrentUser(request.authUser!.id);
  response.status(200).json({ data: user });
}
