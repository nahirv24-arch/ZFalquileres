import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Seguí tu solicitud",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Seguí tu solicitud"
      intro="Consultá el estado de tu postulación con tu código de seguimiento."
      phase="la Fase 3"
    />
  );
}
