import crypto from "node:crypto";
import { CreateUserInput, EditUserInput, User } from "../models/user";
import { InMemoryUserRepository } from "../../infra/repositories/InMemoryUserRepository";

export class GestionUsuarios {
  constructor(private readonly repository: InMemoryUserRepository) {}

  listUsers(): User[] {
    return this.repository.list();
  }

  getUserById(userId: string): User | undefined {
    return this.repository.findById(userId);
  }

  createUser(input: CreateUserInput): User {
    this.validateCreateInput(input);

    if (this.repository.findByUsername(input.username)) {
      throw new HttpError(409, "urn:telecom:error:conflict", "Username already exists.");
    }

    if (this.repository.findByEmail(input.email)) {
      throw new HttpError(409, "urn:telecom:error:conflict", "Email already exists.");
    }

    const now = new Date().toISOString();
    const user: User = {
      id: `usr_${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`,
      username: input.username.trim(),
      email: input.email.trim().toLowerCase(),
      displayName: input.displayName.trim(),
      roleIds: input.roleIds ?? [],
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    return this.repository.save(user);
  }

  editUser(userId: string, input: EditUserInput): User {
    const current = this.repository.findById(userId);
    if (!current) {
      throw new HttpError(404, "urn:telecom:error:not-found", "User not found.");
    }

    if (input.username) {
      const duplicated = this.repository.findByUsername(input.username);
      if (duplicated && duplicated.id !== userId) {
        throw new HttpError(409, "urn:telecom:error:conflict", "Username already exists.");
      }
    }

    if (input.email) {
      const duplicated = this.repository.findByEmail(input.email);
      if (duplicated && duplicated.id !== userId) {
        throw new HttpError(409, "urn:telecom:error:conflict", "Email already exists.");
      }
    }

    const updated: User = {
      ...current,
      username: input.username?.trim() ?? current.username,
      email: input.email?.trim().toLowerCase() ?? current.email,
      displayName: input.displayName?.trim() ?? current.displayName,
      roleIds: input.roleIds ?? current.roleIds,
      updatedAt: new Date().toISOString(),
    };
    return this.repository.save(updated);
  }

  blockUser(userId: string): User {
    const current = this.repository.findById(userId);
    if (!current) {
      throw new HttpError(404, "urn:telecom:error:not-found", "User not found.");
    }

    const updated: User = {
      ...current,
      isActive: false,
      blockedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.repository.save(updated);
  }

  private validateCreateInput(input: CreateUserInput): void {
    if (!input.username?.trim() || !input.displayName?.trim()) {
      throw new HttpError(400, "urn:telecom:error:validation", "username and displayName are required.");
    }
    if (!input.email?.trim() || !input.email.includes("@")) {
      throw new HttpError(400, "urn:telecom:error:validation", "Invalid email.");
    }
  }
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly type: string,
    message: string,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message);
  }
}
