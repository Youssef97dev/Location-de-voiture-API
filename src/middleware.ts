import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

import { authMiddleware } from "@/middlewares/api/auth-middleware";

export const config = {
  matcher: "/api/:path*",
};

export async function middleware(request: NextApiRequest) {
  const authResult = await authMiddleware(request);
  if (
    !authResult.isValid &&
    !request.url?.includes("api/register") &&
    !request.url?.includes("api/auth")
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.next();
}
