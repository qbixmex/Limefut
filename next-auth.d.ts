import { DefaultSession } from 'next-auth';

export interface User {
  id: string;
  name: string | null;
  email: string;
  username: string | null;
  emailVerified?: Date | null;
  roles: string[],
  imageUrl: string | null,
  isActive: boolean,
  createdAt?: Date,
  updatedAt?: Date,
}

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user'];
  };
}