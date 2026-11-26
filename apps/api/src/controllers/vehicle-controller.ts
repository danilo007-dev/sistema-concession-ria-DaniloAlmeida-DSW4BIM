import type { Request, Response } from "express";
import { createVehicle, deleteVehicle, listVehicles, updateVehicle } from "../services/vehicle-service.js";

export async function index(req: Request, res: Response) {
  res.json(await listVehicles(req.user!, String(req.query.search ?? "").trim(), String(req.query.status ?? "")));
}

export async function create(req: Request, res: Response) {
  res.status(201).json(await createVehicle(req.user!, req.body));
}

export async function update(req: Request, res: Response) {
  res.json(await updateVehicle(req.user!, String(req.params.id), req.body));
}

export async function remove(req: Request, res: Response) {
  await deleteVehicle(req.user!, String(req.params.id));
  res.status(204).send();
}
