import type { NextFunction, Request, Response } from "express";
import { AppError } from "./errorHandler";
import { roleService } from "../domain/services/role.service";

/**
 * Requires the authenticated user to have at least one of the given permissions.
 * Must be used after auth() so that req.user (id, roleIds) exists.
 */
export function requirePermission(...allowedPermissions: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user?.roleIds?.length) {
      return next(
        new AppError({
          status: 403,
          title: "Forbidden",
          detail: "No roles assigned.",
          type: "urn:telecom:error:forbidden",
        })
      );
    }

    const userPermissions = roleService.getPermissionKeysForUser(user.roleIds);
    const hasPermission = allowedPermissions.some((p) => userPermissions.includes(p));

    if (!hasPermission) {
      return next(
        new AppError({
          status: 403,
          title: "Forbidden",
          detail: `Required permission: ${allowedPermissions.join(" or ")}`,
          type: "urn:telecom:error:forbidden",
        })
      );
    }

    next();
  };
}
