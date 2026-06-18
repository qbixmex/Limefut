import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { customSession, admin } from 'better-auth/plugins';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { nextCookies } from 'better-auth/next-js';
import { ROLE } from '../shared/interfaces';

const options = {
  secret: process.env.BETTER_AUTH_SECRET ?? '',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password) => {
        return await bcrypt.hash(password, 10);
      },
      verify: async ({ password, hash }) => {
        return await bcrypt.compare(password, hash);
      },
    },
  },
  user: {
    additionalFields: {
      username: { type: 'string', required: false },
      roles: { type: 'string[]', required: false, defaultValue: [ROLE.USER], input: false },
      imageUrl: { type: 'string', required: false, defaultValue: '', input: false },
    },
  },
  plugins: [
    admin({
      defaultRole: ROLE.USER,
      adminRoles: [ROLE.ADMIN],
    }),
    // 1. Ponemos customSession aquí arriba
    customSession(async ({ user, session }) => {
       const extendedUser = user as typeof user & {
        username?: string;
        roles?: string[];
        imageUrl?: string;
      };

      return {
        user: {
          id: extendedUser.id,
          name: extendedUser.name,
          username: extendedUser.username,
          email: extendedUser.email,
          emailVerified: extendedUser.emailVerified,
          roles: extendedUser.roles,
          image: extendedUser.imageUrl,
        },
        session: {
          createdAt: session.createdAt,
          expiresAt: session.expiresAt,
          token: session.token,
          userAgent: session.userAgent,
        },
      };
    }),
    nextCookies(),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth(options);
