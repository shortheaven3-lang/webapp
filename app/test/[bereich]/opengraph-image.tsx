import { ImageResponse } from "next/og";
import { BEREICHE, ERGEBNISSE, istBereich } from "@/content/selbsttest";

/**
 * Ein eigenes Vorschaubild je Ergebnis. Wer sein Ergebnis teilt, teilt damit
 * nicht irgendeinen Link, sondern einen Satz, auf den andere reagieren.
 */
export const alt = "Ergebnis des Selbsttests";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return BEREICHE.map((bereich) => ({ bereich }));
}

export default async function Vorschaubild({
  params,
}: {
  params: Promise<{ bereich: string }>;
}) {
  const { bereich } = await params;
  const ergebnis = istBereich(bereich) ? ERGEBNISSE[bereich] : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#14120f",
          padding: "72px 80px",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 3, textTransform: "uppercase", color: "#7d766d" }}>
          Selbsttest · Ergebnis
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 72, lineHeight: 1.1, color: "#f0ebe4", maxWidth: 950 }}>
            {ergebnis?.titel ?? "Wo verlässt du dich selbst?"}
          </div>
          {ergebnis && (
            <div style={{ fontSize: 30, lineHeight: 1.4, color: "#b0a89e", maxWidth: 900 }}>
              {ergebnis.kern}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26 }}>
          <span style={{ color: "#7d766d" }}>Zwölf Aussagen, zwei Minuten</span>
          <span style={{ color: "#cfa76a" }}>@shortheaven3</span>
        </div>
      </div>
    ),
    size,
  );
}
