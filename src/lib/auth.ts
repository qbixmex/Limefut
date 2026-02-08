import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession, admin } from "better-auth/plugins";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { ROLE } from "../shared/interfaces";

const options = {
  secret: process.env.BETTER_AUTH_SECRET ?? '',
  database: prismaAdapter(prisma, {
    provider: "postgresql",
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
      username: {
        type: 'string',
        required: false,
      },
      roles: {
        type: "string[]",
        required: false,
        defaultValue: [ROLE.USER],
        input: false,
      },
      imageUrl: {
        type: "string",
        required: false,
        defaultValue: '',
        input: false,
      },
    },
  },
  plugins: [
    nextCookies(),
    admin({
      defaultRole: ROLE.USER,
      adminRoles: [ROLE.ADMIN],
    }),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(
      async ({ user, session }) => ({
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.imageUrl,
          roles: user.roles,
        },
        session: {
          createdAt: session.createdAt,
          expiresAt: session.expiresAt,
          token: session.token,
          userAgent: session.userAgent,
        },
      }),
      options,
    ),
  ],
});
