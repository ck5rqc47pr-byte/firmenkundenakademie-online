import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// Alle Routen schützen außer Login, API-Auth und statische Assets
export const config = {
  matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon.ico|downloads).*)"],
};
