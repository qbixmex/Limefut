export const ROLE = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type ROLE_TYPE = typeof ROLE[keyof typeof ROLE];

export interface User {
  id: string;
  name: string | null;
  email: string;
  username: string | null;
  emailVerified: boolean | null;
  roles: string[],
  isActive: boolean,
  imageUrl?: string | null,
  imagePublicID?: string | null,
  createdAt?: Date,
  updatedAt?: Date,
}

export interface UserSeed {
  name: string;
  email: string;
  username: string | null;
  emailVerified?: Date | null;
  password: string;
  roles: ROLE_TYPE[],
  imageUrl: string | null,
  imagePublicID: string | null,
  isActive: boolean,
}