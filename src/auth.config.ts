import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import z from "zod";

export const authConfig: NextAuthConfig = {
  // TODO adapter: PrismaAdapter(prisma),
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

          // TODO Validate if user exists with provided email
          // const user = await prisma.user.findUnique({
          //   where: { email: email.toLowerCase() },
          // });

          // if (!user) return null;

          // TODO Validate if passwords matches
          // const passwordsMatch = bcrypt.compareSync(password, user.password as string);
          // if (!passwordsMatch) return null;

          // TODO Remove Password from Authenticated User
          // const userWithoutPassword = Object.fromEntries(
          //   Object.entries(user).filter(([key]) => key !== 'password')
          // );

          // TODO return userWithoutPassword;
          return { id: "1", name: "John Doe", email: "john@gmail.com" };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) { return true; },
    async jwt({ token, user }) { return token; },
    async session({ session, token }) { return session; },
  },
};

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);
