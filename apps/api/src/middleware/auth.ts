import { Request, Response, NextFunction } from "express";

type AuthUser = {
  id: string;
  username: string;
  permissions: string[];
  isActive: boolean;
};

const rolePermissions: Record<string, string[]> = {
  admin: ["USER_VIEW", "USER_CREATE", "USER_EDIT", "USER_BLOCK"],
  manager: ["USER_VIEW", "USER_CREATE", "USER_EDIT", "USER_BLOCK"],
  tech: ["USER_VIEW"],
};

function userFromToken(token: string): AuthUser | undefined {
  const normalized = token.trim().toLowerCase();
  if (!["admin", "manager", "tech", "blocked"].includes(normalized)) {
    return undefined;
  }
  if (normalized === "blocked") {
    return {
      id: "usr_blocked",
      username: "blocked",
      permissions: ["USER_VIEW"],
      isActive: false,
    };
  }

  return {
    id: `usr_${normalized}`,
    username: normalized,
    permissions: rolePermissions[normalized],
    isActive: true,
  };
}

export function authRequired(req: Request, res: Response, next: NextFunction): void {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({
      type: "urn:telecom:error:unauthorized",
      title: "Unauthorized",
      status: 401,
      detail: "Missing bearer token.",
      correlationId: req.correlationId,
    });
    return;
  }

  const token = header.slice("Bearer ".length);
  const user = userFromToken(token);
  if (!user) {
    res.status(401).json({
      type: "urn:telecom:error:unauthorized",
      title: "Unauthorized",
      status: 401,
      detail: "Invalid bearer token.",
      correlationId: req.correlationId,
    });
    return;
  }

  req.user = user;
  next();
}

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
      user?: AuthUser;
      auditEvents?: Array<Record<string, unknown>>;
    }
  }
}
