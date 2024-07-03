import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Credentials {
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials as Credentials;

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            throw new Error("No user found");
          }

          const isValid = await verifyPassword(password, user.password);

          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: `${user.id}`,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt({ token, user }) {
      token.sub = user?.id;
      return token;
    },
    session({ session, token }) {
      session.user.id = Number(token?.sub);
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
