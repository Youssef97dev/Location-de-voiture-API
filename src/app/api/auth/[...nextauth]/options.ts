import { verifyPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials: any) {
        const { email, password } = credentials;

        try {
          const user = await prisma.user.findUnique({ where: { email } });

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
          console.log("Error: ", error);
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
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = Number(token.sub);
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
