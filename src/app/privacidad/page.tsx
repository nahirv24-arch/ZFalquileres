import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Aviso de privacidad"
      intro="El texto legal está pendiente de aprobación por ZF (decisión D-05)."
      phase="la Fase 6"
    />
  );
}
