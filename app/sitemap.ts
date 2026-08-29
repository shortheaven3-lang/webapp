import type { MetadataRoute } from "next";
import { alleLektionen } from "@/lib/lektionen";
import { basisAdresse } from "@/lib/adresse";

// Bei jeder Anfrage erzeugt statt beim Bauen: sonst steht in der Sitemap die
// Adresse, die zum Bauzeitpunkt bekannt war — nach einem nachgetragenen
// APP_URL waere das localhost.
export const dynamic = "force-dynamic";


export default function sitemap(): MetadataRoute.Sitemap {
  const basis = basisAdresse();

  // Nur die frei zugänglichen Tage gehören in die Sitemap. Gesperrte Seiten
  // zeigen ohnehin nur die Bezahlschranke — die muss nicht in den Index.
  const frei = alleLektionen()
    .filter((l) => l.kostenlos)
    .map((l) => ({
      url: `${basis}/programm/${l.tag}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [
    { url: basis, changeFrequency: "weekly", priority: 1 },
    { url: `${basis}/programm`, changeFrequency: "monthly", priority: 0.8 },
    ...frei,
  ];
}
