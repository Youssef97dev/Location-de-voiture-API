import type { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";

export async function authMiddleware(req: NextApiRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return { isValid: false };
  }
  return { isValid: true };
}
