import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "tsx prisma/seed.ts" },
  // Permite gerar o cliente no build sem credenciais; migrações exigem DATABASE_URL real.
  datasource: { url: process.env.DATABASE_URL ?? "mysql://root:root@localhost:3306/autoviva" }
});
