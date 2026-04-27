import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Firmenkundenakademie",
  description: "Wissenschaftlich fundierte Weiterbildungsmodule für Firmenkundenberater.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>
        <NavBar />
        <main className="mx-auto min-h-[calc(100vh-88px)] max-w-content px-6 py-8 lg:px-8 lg:py-12">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-content flex-col gap-3 px-6 py-8 text-sm text-slate-600 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <p>© Benedikt Zoller Coaching</p>
            <div className="flex gap-4">
              <Link href="/impressum" className="transition hover:text-primary">
                Impressum
              </Link>
              <Link href="/datenschutz" className="transition hover:text-primary">
                Datenschutz
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
