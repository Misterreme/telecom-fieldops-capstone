import { Router } from "express";
import { healthRouter } from "./health";

import { authRouter } from "../../routes/auth.routes";
import { inventoryRouter } from '../../routes/inventory.routes';
import { rolesRouter } from "../../routes/roles.route";


export function buildApiRouter() {
  const router = Router();

  // Public endpoints
  router.use(healthRouter());

 // Protected by auth endpoints
  router.use("/auth", authRouter());
  router.use("/inventory", inventoryRouter());
  router.use("/roles", rolesRouter());

  return router;
}