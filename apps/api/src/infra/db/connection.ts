import fs from 'fs';
import path from 'path';
import type { AuditEvent, RefreshTokenRecord, Role, User } from '../../domain/models/types';

export interface InMemoryDatabase {
  users: Map<string, User>;
  roles: Map<string, Role>;
  audits: AuditEvent[];
  revokedRefreshTokens: Map<string, RefreshTokenRecord>;
}

type SeedAuth = { authRoles?: Role[]; authUsers?: User[] };

function loadAuthFromSeed(): { roles: Role[]; users: User[] } | null {
  const candidates = [
    process.env.SEED_DATA_PATH,
    path.resolve(__dirname, '../../../../../../scripts/seed-data.json'), // dist/infra/db -> repo root
    path.resolve(__dirname, '../../../../../scripts/seed-data.json'),    // src/infra/db (Jest) -> repo root
    path.resolve(__dirname, '../../../scripts/seed-data.json'),        // container: /app/dist/infra/db
    path.resolve(process.cwd(), '../../scripts/seed-data.json'),       // from apps/api -> repo root
  ].filter(Boolean) as string[];

  for (const seedPath of candidates) {
    try {
      if (fs.existsSync(seedPath)) {
        const raw = fs.readFileSync(seedPath, 'utf-8');
        const data = JSON.parse(raw) as SeedAuth;
        if (
          Array.isArray(data.authRoles) &&
          data.authRoles.length > 0 &&
          Array.isArray(data.authUsers) &&
          data.authUsers.length > 0
        ) {
          return { roles: data.authRoles, users: data.authUsers };
        }
      }
    } catch {
      continue;
    }
  }
  return null;
}

const buildSeededDatabase = (): InMemoryDatabase => {
  const db: InMemoryDatabase = {
    users: new Map<string, User>(),
    roles: new Map<string, Role>(),
    audits: [],
    revokedRefreshTokens: new Map<string, RefreshTokenRecord>(),
  };

  const seed = loadAuthFromSeed();
  if (seed) {
    for (const role of seed.roles) {
      db.roles.set(role.id, role);
    }
    for (const user of seed.users) {
      db.users.set(user.id, { ...user, email: user.email.trim().toLowerCase() });
    }
  }

  return db;
};

let database = buildSeededDatabase();

export const getDb = (): InMemoryDatabase => database;

export const resetDb = (): InMemoryDatabase => {
  database = buildSeededDatabase();
  return database;
};
