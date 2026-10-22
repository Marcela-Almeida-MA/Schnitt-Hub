import { Router } from "express";
import { asyncHandler } from "../../shared/http/async-handler.js";
import { requireAuth } from "../../shared/auth/auth.middleware.js";
import { registerController, loginController, meController } from "./auth.controller.js";

export const authRoutes = Router();

authRoutes.post("/register", asyncHandler(registerController));
authRoutes.post("/login", asyncHandler(loginController));
authRoutes.get("/me", requireAuth, asyncHandler(meController));
