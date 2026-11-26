import type { Request, Response } from "express";
import { getCurrentUser, login, signup } from "../services/auth-service.js";

export async function register(req: Request, res: Response) {
  res.status(201).json(await signup(req.body));
}

export async function signIn(req: Request, res: Response) {
  res.json(await login(req.body));
}

export async function currentUser(req: Request, res: Response) {
  res.json({ user: await getCurrentUser(req.user!.id) });
}
