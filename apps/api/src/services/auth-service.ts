import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../lib/http-error.js";

const credentials = z.object({ email: z.string().email("Informe um e-mail válido."), password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres.") });
const signupInput = credentials.extend({ name: z.string().trim().min(2, "Informe seu nome.").max(80) });

function issueToken(user: { id: string; role: "SELLER" | "ADMIN" }) {
  return jwt.sign({ role: user.role }, process.env.JWT_SECRET!, { subject: user.id, expiresIn: "8h" });
}

export async function signup(input: unknown) {
  const data = signupInput.parse(input);
  const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (existing) throw new HttpError(409, "Este e-mail já está cadastrado.");
  const user = await prisma.user.create({ data: { name: data.name, email: data.email.toLowerCase(), passwordHash: await bcrypt.hash(data.password, 12) }, select: { id: true, name: true, email: true, role: true } });
  return { token: issueToken(user), user };
}

export async function login(input: unknown) {
  const data = credentials.parse(input);
  const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) throw new HttpError(401, "E-mail ou senha incorretos.");
  return { token: issueToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

export async function getCurrentUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true } });
  if (!user) throw new HttpError(401, "Sessão inválida. Entre novamente.");
  return user;
}
