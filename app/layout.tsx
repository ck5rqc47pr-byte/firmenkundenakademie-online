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
            <div className="mx-auto max-w-content px-6 py-8 lg:px-14">
              <p className="font-serif text-sm text-ink-2 leading-relaxed mb-5 max-w-xl">
                Wir machen relevantes Wissen im Firmenkundengeschäft sichtbar, prüfbar und anwendbar.
              </p>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">© FKB Campus</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <Link href="/team" className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 transition hover:text-ink">
                    Team
                  </Link>
                  <Link href="/impressum" className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 transition hover:text-ink">
                    Impressum
                  </Link>
                  <Link href="/datenschutz" className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 transition hover:text-ink">
                    Datenschutz
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
