import { VehicleStatus } from "../generated/prisma/client.js";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../lib/http-error.js";
import type { RequestUser } from "./vehicle-types.js";

const vehicleFields = {
  make: z.string().trim().min(2).max(50),
  model: z.string().trim().min(1).max(60),
  year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1),
  price: z.coerce.number().positive().max(999999999),
  mileage: z.coerce.number().int().min(0),
  color: z.string().trim().min(2).max(30),
  description: z.string().trim().max(500).optional().nullable(),
  status: z.nativeEnum(VehicleStatus)
};
const createSchema = z.object(vehicleFields);
const updateSchema = createSchema.partial();

function visibility(user: RequestUser) {
  return user.role === "ADMIN" ? {} : { ownerId: user.id };
}

export async function listVehicles(user: RequestUser, search?: string, status?: string) {
  return prisma.vehicle.findMany({
    // O collation utf8mb4_unicode_ci do MySQL já faz a busca sem diferenciar maiúsculas.
    where: { ...visibility(user), ...(status && Object.values(VehicleStatus).includes(status as VehicleStatus) ? { status: status as VehicleStatus } : {}), ...(search ? { OR: [{ make: { contains: search } }, { model: { contains: search } }] } : {}) },
    include: { owner: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" }
  });
}

export async function createVehicle(user: RequestUser, input: unknown) {
  const data = createSchema.parse(input);
  return prisma.vehicle.create({ data: { ...data, ownerId: user.id }, include: { owner: { select: { id: true, name: true } } } });
}

async function getVisibleVehicle(user: RequestUser, id: string) {
  const vehicle = await prisma.vehicle.findFirst({ where: { id, ...visibility(user) } });
  if (!vehicle) throw new HttpError(404, "Veículo não encontrado ou sem permissão para acessá-lo.");
  return vehicle;
}

export async function updateVehicle(user: RequestUser, id: string, input: unknown) {
  const data = updateSchema.parse(input);
  const current = await getVisibleVehicle(user, id);
  if (current.status === VehicleStatus.SOLD && data.status === VehicleStatus.AVAILABLE) {
    throw new HttpError(409, "Um veículo vendido não pode voltar para disponível.");
  }
  return prisma.vehicle.update({ where: { id }, data, include: { owner: { select: { id: true, name: true } } } });
}

export async function deleteVehicle(user: RequestUser, id: string) {
  const current = await getVisibleVehicle(user, id);
  if (current.status === VehicleStatus.SOLD) throw new HttpError(409, "Um veículo vendido não pode ser excluído do histórico.");
  await prisma.vehicle.delete({ where: { id } });
}
