/**
 * Die öffentliche Adresse der App. Wird für Metadaten, Sitemap, robots.txt
 * und die Rücksprünge aus der Kasse gebraucht — deshalb steht sie hier und
 * nicht bei einem einzelnen Verwendungszweck.
 */
export function basisAdresse(): string {
  const gesetzt = process.env.APP_URL;
  if (gesetzt) return gesetzt.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
