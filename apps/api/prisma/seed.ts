import "dotenv/config";
import bcrypt from "bcryptjs";
import { createPrismaClient } from "../src/lib/create-prisma.js";

const prisma = createPrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("ADMIN_EMAIL/ADMIN_PASSWORD ausentes; nenhum administrador criado.");
    return;
  }
  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: { name: "Administrador AutoViva", email, passwordHash: await bcrypt.hash(password, 12), role: "ADMIN" }
  });
  console.log(`Administrador configurado: ${email}`);
}

main().finally(() => prisma.$disconnect());
