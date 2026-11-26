import { Router } from "express";
import { create, index, remove, update } from "../controllers/vehicle-controller.js";
import { authenticate } from "../middleware/auth.js";

export const vehicleRoutes = Router();
vehicleRoutes.use(authenticate);
vehicleRoutes.get("/", index);
vehicleRoutes.post("/", create);
vehicleRoutes.patch("/:id", update);
vehicleRoutes.delete("/:id", remove);
