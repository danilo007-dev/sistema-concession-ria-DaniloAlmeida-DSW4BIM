import { Router } from "express";
import { currentUser, register, signIn } from "../controllers/auth-controller.js";
import { authenticate } from "../middleware/auth.js";

export const authRoutes = Router();
authRoutes.post("/register", register);
authRoutes.post("/login", signIn);
authRoutes.get("/me", authenticate, currentUser);
