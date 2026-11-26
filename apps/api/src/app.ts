import cors from "cors";
import express from "express";
import { authRoutes } from "./routes/auth-routes.js";
import { vehicleRoutes } from "./routes/vehicle-routes.js";
import { errorHandler, notFound } from "./middleware/errors.js";

export const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL?.split(",") ?? "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok", application: "AutoViva API" }));
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use(notFound);
app.use(errorHandler);
