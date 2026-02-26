export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  roleIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  blockedAt?: string;
}

export interface CreateUserInput {
  username: string;
  email: string;
  displayName: string;
  roleIds?: string[];
}

export interface EditUserInput {
  username?: string;
  email?: string;
  displayName?: string;
  roleIds?: string[];
}
