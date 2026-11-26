import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../lib/http-error.js";

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, "Rota não encontrada."));
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: "Verifique os campos informados.", errors: error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })) });
  }
  if (error instanceof HttpError) return res.status(error.status).json({ message: error.message });
  console.error(error);
  return res.status(500).json({ message: "Ocorreu um erro interno. Tente novamente." });
}
