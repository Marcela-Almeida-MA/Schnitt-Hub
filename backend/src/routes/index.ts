import { Router } from "express";
import { healthRoutes } from "../modules/health/health.routes.js";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { barbershopsRoutes } from "../modules/barbershops/barbershops.routes.js";
import { servicesRoutes } from "../modules/services/services.routes.js";
import { professionalsRoutes } from "../modules/professionals/professionals.routes.js";
import { clientsRoutes } from "../modules/clients/clients.routes.js";
import { appointmentsRoutes } from "../modules/appointments/appointments.routes.js";
import { requireAuth, requireBarbershopMembership } from "../shared/auth/auth.middleware.js";

export const apiRoutes = Router();

apiRoutes.use("/health", healthRoutes);
apiRoutes.use("/auth", authRoutes);

// Tudo abaixo exige token válido e associação ativa com a barbearia escolhida.
const protectedRoutes = Router();
protectedRoutes.use(requireAuth, requireBarbershopMembership);
protectedRoutes.use("/barbershops", barbershopsRoutes);
protectedRoutes.use("/services", servicesRoutes);
protectedRoutes.use("/professionals", professionalsRoutes);
protectedRoutes.use("/clients", clientsRoutes);
protectedRoutes.use("/appointments", appointmentsRoutes);
apiRoutes.use(protectedRoutes);
