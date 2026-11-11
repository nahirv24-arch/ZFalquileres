import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Tu mudanza",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Tu mudanza"
      intro="Guías de servicios y cambio de titularidad para cada propiedad."
      phase="la Fase 5"
    />
  );
}
