import type { MetadataRoute } from "next";
import { basisAdresse } from "@/lib/adresse";

// Bei jeder Anfrage erzeugt statt beim Bauen: sonst steht in der robots.txt die
// Adresse, die zum Bauzeitpunkt bekannt war — nach einem nachgetragenen
// APP_URL waere das localhost.
export const dynamic = "force-dynamic";


export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Kein Grund, Kassenwege und Rücksprünge indexieren zu lassen.
      disallow: ["/api/", "/danke"],
    },
    sitemap: `${basisAdresse()}/sitemap.xml`,
  };
}
