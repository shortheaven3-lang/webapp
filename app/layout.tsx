import type { Metadata } from "next";
import Link from "next/link";
import { PRODUKT } from "@/lib/preis";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: PRODUKT.name,
    template: `%s — ${PRODUKT.name}`,
  },
  description:
    "Ein geführtes Programm in dreißig Tagen: sehen, was ist. Grenzen ziehen. Handeln. Loslassen.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <header className="kopf">
          <div className="huelle weit">
            <Link href="/" className="marke">
              {PRODUKT.name}
            </Link>
            <nav>
              <Link href="/programm">Programm</Link>
              <Link href="/#kaufen">Teilnehmen</Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="fuss">
          <div className="huelle weit">
            <p style={{ margin: 0 }}>
              Ein Programm von{" "}
              <a href="https://www.instagram.com/shortheaven3/" rel="noreferrer">
                @shortheaven3
              </a>
            </p>
            <nav>
              <Link href="/impressum">Impressum</Link>
              <Link href="/agb">AGB &amp; Widerruf</Link>
              <Link href="/datenschutz">Datenschutz</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
