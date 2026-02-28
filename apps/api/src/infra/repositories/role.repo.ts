import fs from 'fs';
import path from 'path';
import type { Role } from '../../domain/models/types';

type SeedRoles = { roles?: Role[] };

function loadRolesFromSeed(): Role[] {
  const candidates = [
    process.env.SEED_DATA_PATH,
    path.resolve(__dirname, '../../../../../../scripts/seed-data.json'), // monorepo: dist/infra/repositories -> repo root
    path.resolve(__dirname, '../../../../../scripts/seed-data.json'),    // src/infra/repositories (Jest)
    path.resolve(__dirname, '../../../scripts/seed-data.json'),          // container: /app/dist/infra/repositories
    path.resolve(process.cwd(), '../../scripts/seed-data.json'),         // from apps/api -> repo root
  ].filter(Boolean) as string[];

  for (const seedPath of candidates) {
    try {
      if (fs.existsSync(seedPath)) {
        const raw = fs.readFileSync(seedPath, 'utf-8');
        const data = JSON.parse(raw) as SeedRoles;
        if (Array.isArray(data.roles) && data.roles.length > 0) {
          return data.roles;
        }
      }
    } catch {
      continue;
    }
  }
  return [];
}

const ROLES: Role[] = loadRolesFromSeed();

export function roleRepository() {
  return {
    listAll(): Role[] {
      return [...ROLES];
    },
    findById(id: string): Role | undefined {
      return ROLES.find((r) => r.id === id);
    },
    getPermissionKeysByRoleIds(roleIds: string[]): string[] {
      const set = new Set<string>();
      for (const roleId of roleIds) {
        const role = ROLES.find((r) => r.id === roleId);
        if (role) role.permissionKeys.forEach((k) => set.add(k));
      }
      return Array.from(set);
    },
  };
}

export const roleRepo = roleRepository();
