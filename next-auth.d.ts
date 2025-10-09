import { DefaultSession } from 'next-auth';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  emailVerified: Date | null;
  roles?: string[],
  image: string,
  isActive: boolean,
}

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user'];
  };
}