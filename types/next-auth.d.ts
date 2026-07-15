import "next-auth";
import "next-auth/jwt";
import { UserRole } from "@/lib/db";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      id?: string;
      bank?: string | null;
      track?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    uid?: string;
    bank?: string | null;
    track?: string | null;
  }
}
