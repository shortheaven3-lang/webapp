import { ImageResponse } from "next/og";
import { PRODUKT } from "@/lib/preis";

/**
 * Das Bild, das erscheint, wenn jemand den Link teilt — in Instagram-DMs,
 * WhatsApp, überall. Ohne dieses Bild zeigt ein geteilter Link eine graue
 * Fläche, und der halbe Klickanreiz ist weg.
 */
export const alt = PRODUKT.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Vorschaubild() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#faf8f5",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#8b847c",
          }}
        >
          Ein Programm in 30 Tagen
        </div>

        <div style={{ fontSize: 76, lineHeight: 1.15, color: "#1c1a17", maxWidth: 900 }}>
          Du merkst es meistens erst hinterher.
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28 }}>
          <span style={{ color: "#5f5952" }}>{PRODUKT.name}</span>
          <span style={{ color: "#8a6a3f" }}>@shortheaven3</span>
        </div>
      </div>
    ),
    size,
  );
}
