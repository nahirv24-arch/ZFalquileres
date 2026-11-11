import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Propiedades en alquiler",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Propiedades en alquiler"
      intro="Buscá por barrio, precio y cantidad de dormitorios."
      phase="la Fase 2 (catálogo)"
    />
  );
}
