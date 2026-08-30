import type { Metadata } from "next";
import Selbsttest from "@/components/Selbsttest";

export const metadata: Metadata = {
  title: "Selbsttest",
  description:
    "Zwölf Aussagen, zwei Minuten. Danach weißt du, welcher der vier Bereiche bei dir gerade der lauteste ist.",
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
