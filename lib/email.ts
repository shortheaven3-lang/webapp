/**
 * Grobe Prüfung: genau ein @, links und rechts etwas, rechts ein Punkt mit
 * mindestens zwei Zeichen danach. Bewusst keine strengere Regel — jede
 * schärfere Prüfung weist irgendwann echte Adressen ab, und ob eine Adresse
 * existiert, klärt ohnehin erst die erste zugestellte Mail.
 */
export function istEmail(wert: string): boolean {
  const s = wert.trim();
  if (s.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}
