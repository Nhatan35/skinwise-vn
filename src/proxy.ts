import NextAuth from "next-auth";

import { authConfig } from "@/modules/auth/auth.config";

const { auth } = NextAuth(authConfig);

export const proxy = auth;

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/skin-profile/:path*",
    "/routines/:path*",
    "/routine-logs/:path*",
    "/journal/:path*",
    "/products/:path*",
    "/product-match/:path*",
    "/saved-products/:path*",
    "/insights/:path*",
    "/ingredients/:path*",
    "/settings/:path*",
  ],
};
