import { Router } from "express";
import { GestionUsuarios } from "../domain/services/GestionUsuarios";
import { requirePermissions } from "../middleware/rbac";
import { withAudit } from "../middleware/audit";

export function createGestionUsuariosRouter(gestionUsuarios: GestionUsuarios): Router {
  const router = Router();

  router.get(
    "/users",
    requirePermissions("USUARIO_VER"),
    (_req, res) => {
      res.status(200).json(gestionUsuarios.listUsers());
    },
  );

  router.post(
    "/users",
    requirePermissions("USUARIO_CREAR"),
    withAudit("USUARIO_CREADO", "Usuario"),
    (req, res) => {
      const created = gestionUsuarios.createUser(req.body);
      res.status(201).json(created);
    },
  );

  router.patch(
    "/users/:userId",
    requirePermissions("USUARIO_EDITAR"),
    withAudit("USUARIO_ACTUALIZADO", "Usuario"),
    (req, res) => {
      const updated = gestionUsuarios.editUser(req.params.userId, req.body);
      res.status(200).json(updated);
    },
  );

  router.post(
    "/users/:userId/block",
    requirePermissions("USUARHIO_BLOQUEAR"),
    withAudit("USUARIO_BLOQUEADO", "Usuario"),
    (req, res) => {
      const blocked = gestionUsuarios.blockUser(req.params.userId);
      res.status(200).json(blocked);
    },
  );

  router.get("/work-orders", (req, res) => {
    if (!req.user?.isActive) {
      res.status(403).json({
        type: "urn:telecom:error:forbidden",
        title: "Acceso prohibido",
        status: 403,
        detail: "El usuario bloqueado no puede acceder a endpoints protegidos.",
        correlationId: req.correlationId,
      });
      return;
    }
    res.status(200).json([]);
  });

  return router;
}
