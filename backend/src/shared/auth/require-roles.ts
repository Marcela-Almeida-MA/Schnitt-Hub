import type { RequestHandler } from "express";
import { AppError } from "../errors/app-error.js";

// Restringe operações administrativas aos papéis explicitamente autorizados.
export function requireRoles(...roles: Array<NonNullable<Express.Request["membershipRole"]>>): RequestHandler {
  return (request, _response, next) => {
    if (!request.membershipRole || !roles.includes(request.membershipRole)) {
      next(new AppError(403, "Você não tem permissão para esta operação.", "INSUFFICIENT_PERMISSIONS"));
      return;
    }
    next();
  };
}
