import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { SessionProvider } from "@/components/SessionProvider";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Firmenkundenakademie",
  description: "Wissenschaftlich fundierte Weiterbildungsmodule für Firmenkundenberater.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans">
        <SessionProvider>
          <NavBar />
          <main className="mx-auto min-h-[calc(100vh-72px)]">
            {children}
          </main>
          <footer className="border-t border-line">
            <div className="mx-auto flex max-w-content flex-col gap-3 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-14">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">© FKB Campus</p>
              <div className="flex gap-6">
                <Link href="/impressum" className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 transition hover:text-ink">
                  Impressum
                </Link>
                <Link href="/datenschutz" className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 transition hover:text-ink">
                  Datenschutz
                </Link>
              </div>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
