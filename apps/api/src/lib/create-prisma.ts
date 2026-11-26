import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

export function createPrismaClient() {
  const databaseUrl = new URL(process.env.DATABASE_URL ?? "mysql://root:root@localhost:3306/autoviva");
  const adapter = new PrismaMariaDb({
    host: databaseUrl.hostname,
    port: Number(databaseUrl.port || 3306),
    user: decodeURIComponent(databaseUrl.username),
    password: decodeURIComponent(databaseUrl.password),
    database: decodeURIComponent(databaseUrl.pathname.replace(/^\//, "")),
    connectionLimit: 5
  });
  return new PrismaClient({ adapter });
}
