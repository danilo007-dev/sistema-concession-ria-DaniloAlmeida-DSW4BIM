import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../lib/http-error.js";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next(new HttpError(401, "Faça login para continuar."));
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as jwt.JwtPayload;
    if (!payload.sub || !payload.role) throw new Error("Token inválido");
    req.user = { id: payload.sub, role: payload.role } as Express.Request["user"];
    next();
  } catch {
    next(new HttpError(401, "Sessão inválida ou expirada. Entre novamente."));
  }
}
