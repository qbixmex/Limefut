import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { type AdapterUser } from 'next-auth/adapters';
import z from "zod";
import prisma from "./lib/prisma";
import bcrypt from 'bcryptjs';
import { SessionUser } from "../next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().min(1, {
              message: '! El correo electrónico no puede ir vacío !'
            }),
            password: z.string().min(8, {
              message: '! La contraseña debe ser mayor a 8 caracteres !'
            }),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          // Validate if user exists with provided email
          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
          });

          if (!user) return null;

          // Validate if passwords matches
          const passwordsMatch = bcrypt.compareSync(password, user.password as string);
          if (!passwordsMatch) return null;

          // Remove Password from Authenticated User
          const userWithoutPassword = Object.fromEntries(
            Object.entries(user).filter(([key]) => key !== 'password')
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
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email as string }
      });

      // If user does not exist, allow NextAuth to create it (only for OAuth)
      if (!dbUser) {
        // Allow registration, but do not return true here,
        // just let NextAuth create the user.
        return true;
      }

      // If user exists but email is not verified, block login !
      if (!dbUser.emailVerified) {
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
};

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);
