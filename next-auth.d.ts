import { DefaultSession } from 'next-auth';
import { Role } from './src/shared/interfaces';

export interface User {
  id: string;
  name: string | null;
  email: string;
  username: string | null;
  emailVerified?: Date | null;
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
  roles: Role[],
  imageUrl: string | null,
  imagePublicID: string | null,
  isActive: boolean,
}

export interface SessionUser {
  id: string;
  name: string | null;
  email: string;
  username: string | null;
  roles: string[],
  imageUrl: string | null,
  isActive: boolean,
}

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user'];
  };
}