import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { marked } from "marked";

const VERZEICHNIS = path.join(process.cwd(), "content", "lektionen");

export type Saeule = "Der Spiegel" | "Das Ritual" | "Die Stille";

export type Lektion = {
  tag: number;
  titel: string;
  saeule: Saeule;
  /** Lesedauer in Minuten, wie in der Datei angegeben. */
  dauer: number;
  /** Frei zugänglich, auch ohne Kauf. */
  kostenlos: boolean;
  /** Noch nicht ausgeschrieben — wird in der Übersicht gekennzeichnet. */
  entwurf: boolean;
  /** Anrisstext für Übersicht und Bezahlschranke. */
  vorschau: string;
  /** Markdown-Quelltext. */
  quelle: string;
};

function lies(datei: string): Lektion {
  const roh = fs.readFileSync(path.join(VERZEICHNIS, datei), "utf8");
  const { data, content } = matter(roh);

  const tag = Number(data.tag);
  if (!Number.isInteger(tag) || tag < 1) {
    throw new Error(`${datei}: Feld "tag" fehlt oder ist keine ganze Zahl.`);
  }
  if (typeof data.titel !== "string" || data.titel.trim() === "") {
    throw new Error(`${datei}: Feld "titel" fehlt.`);
  }

  return {
    tag,
    titel: data.titel,
    saeule: (data.saeule ?? "Der Spiegel") as Saeule,
    dauer: Number(data.dauer) || 7,
    kostenlos: data.kostenlos === true,
    entwurf: data.entwurf === true,
    vorschau: typeof data.vorschau === "string" ? data.vorschau : "",
    quelle: content.trim(),
  };
}

/**
 * Alle Lektionen, nach Tag sortiert. Wird je Anfrage nur einmal von der Platte
 * gelesen; im Produktivbetrieb rendert Next die Seiten ohnehin vorab.
 */
export const alleLektionen = cache((): Lektion[] => {
  const dateien = fs
    .readdirSync(VERZEICHNIS)
    .filter((d) => d.endsWith(".md"));

  return dateien.map(lies).sort((a, b) => a.tag - b.tag);
});

export const lektionFuerTag = cache((tag: number): Lektion | undefined =>
  alleLektionen().find((l) => l.tag === tag),
);

/** Anzahl der Tage, die das Programm umfasst. */
export function programmLaenge(): number {
  return alleLektionen().length;
}

/** Markdown in HTML. Die Quellen liegen im Repository, nicht bei Nutzern. */
export function alsHtml(markdown: string): string {
  return marked.parse(markdown, { async: false });
}
