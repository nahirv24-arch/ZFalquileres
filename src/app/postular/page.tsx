import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Postulate a un alquiler",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Postulate a un alquiler"
      intro="Un formulario por pasos. Cada solicitud la revisa una persona de ZF."
      phase="la Fase 3"
    />
  );
}
