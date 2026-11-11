import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Cómo funciona",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Cómo funciona"
      intro="Los pasos para conocer, consultar y postularte a un alquiler a distancia."
      phase="la Fase 3"
    />
  );
}
