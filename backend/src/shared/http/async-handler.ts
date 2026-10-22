import type { Request, Response, NextFunction, RequestHandler } from "express";

// Converte rejeições assíncronas em erros que o middleware do Express trata.
export function asyncHandler(
  handler: (request: Request, response: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (request, response, next) => {
    void handler(request, response, next).catch(next);
  };
}
