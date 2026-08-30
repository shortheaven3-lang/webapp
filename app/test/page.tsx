import type { Metadata } from "next";
import Selbsttest from "@/components/Selbsttest";

export const metadata: Metadata = {
  title: "Selbsttest",
  description:
    "Zwölf Sätze, zwei Minuten. Danach weißt du, in welchem der vier Bereiche es bei dir gerade am lautesten ist.",
};

export default function TestSeite() {
  return (
    <div className="huelle">
      <span className="marke-klein">Zwei Minuten</span>
      <h1>Wo verlässt du dich selbst?</h1>
      <Selbsttest />
    </div>
  );
}
