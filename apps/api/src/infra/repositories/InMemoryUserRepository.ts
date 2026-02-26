import { User } from "../../domain/models/user";

export class InMemoryUserRepository {
  private readonly users = new Map<string, User>();

  constructor() {
    const seedAdmin: User = {
      id: "usr_admin",
      username: "admin",
      email: "admin@telecom.local",
      displayName: "Administrador",
      roleIds: ["ROLE_ADMIN"],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const seedTech: User = {
      id: "usr_tech",
      username: "tech",
      email: "tech@telecom.local",
      displayName: "Tecnico",
      roleIds: ["ROLE_TECH"],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(seedAdmin.id, seedAdmin);
    this.users.set(seedTech.id, seedTech);
  }

  list(): User[] {
    return Array.from(this.users.values());
  }

  findById(userId: string): User | undefined {
    return this.users.get(userId);
  }

  findByUsername(username: string): User | undefined {
    const value = username.trim().toLowerCase();
    return this.list().find((u) => u.username.toLowerCase() === value);
  }

  findByEmail(email: string): User | undefined {
    const value = email.trim().toLowerCase();
    return this.list().find((u) => u.email.toLowerCase() === value);
  }

  save(user: User): User {
    this.users.set(user.id, user);
    return user;
  }
}
