import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";

import { authOptions } from "./options";

const handler = NextAuth(authOptions) as NextAuthOptions;

export { handler as GET, handler as POST };
