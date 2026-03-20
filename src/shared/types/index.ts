export type SessionUI = {
  user: {
    id: string;
    name: string;
    username: string | null | undefined;
    email: string;
    emailVerified: boolean;
    image: string | null | undefined;
    roles: string[] | null | undefined;
  };
  session: {
    createdAt: Date;
    expiresAt: Date;
    token: string;
    userAgent: string | null | undefined;
  };
} | null;
