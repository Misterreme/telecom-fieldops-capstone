export enum UserRole {
  ADMIN = 'admin',
  TECNICO = 'tecnico',
  VENDEDOR = 'vendedor'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  isActive: boolean;
}

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  correlationId: string;
}