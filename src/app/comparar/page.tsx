import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Comparar propiedades",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Comparar propiedades"
      intro="Elegí entre dos y tres propiedades y compará sus características."
      phase="la Fase 3"
    />
  );
}
