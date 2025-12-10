import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { type AdapterUser } from 'next-auth/adapters';
import type { SessionUser } from "../next-auth";
import { getUserAction } from './app/(auth)/getUserAction';
import z from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, {
    message: '! El correo electrónico no puede ir vacío !',
  }),
  password: z.string().min(8, {
    message: '! La contraseña debe ser mayor a 8 caracteres !',
  }),
});

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          // Validate if user exists with provided email
          const user = await getUserAction(email.toLowerCase());

          if (!user) return null;

          // Validate if passwords matches
          const passwordsMatch = bcrypt.compareSync(password, user.password as string);
          if (!passwordsMatch) return null;

          // Remove Password from Authenticated User
          const userWithoutPassword = Object.fromEntries(
            Object.entries(user).filter(([key]) => key !== 'password'),
          );

          return userWithoutPassword;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      const userDB = await getUserAction(user.email as string);

      // If user does not exist, allow NextAuth to create it (only for OAuth)
      if (!userDB) {
        // Allow registration, but do not return true here,
        // just let NextAuth create the user.
        return true;
      }

      // If user exists but email is not verified, block login !
      if (!userDB.emailVerified) {
        console.error(`[AUTH] Usuario no verificado: ${user.email}`);
        return '/login?error=auth';
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) token.data = user;
      return token;
    },
    async session({ session, token }) {
      const user = token.data as AdapterUser & SessionUser;
      session.user = {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        imageUrl: user.imageUrl,
        roles: user.roles,
        isActive: user.isActive,
      };
      return session;
    },
  },
});
