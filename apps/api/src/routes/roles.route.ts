import { Router, Request, Response } from "express";
import { auth } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { roleService } from "../domain/services/role.service";

export function rolesRouter() {
  const router = Router();

  // GET /api/v1/roles — list roles (auth + roles:read permission)
  router.get(
    "/",
    auth(),
    requirePermission("roles:read"),
    (_req: Request, res: Response) => {
      res.status(200).json(roleService.listRoles());
    }
  );

  return router;
}