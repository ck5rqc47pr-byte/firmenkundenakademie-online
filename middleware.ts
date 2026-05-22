import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// Nur geschützte Routen absichern — öffentliche Seiten sind frei zugänglich
export const config = {
  matcher: [
    "/kompass/:path*",
    "/trainer/:path*",
    "/admin/:path*",
    "/module/:path*",
  ],
};
