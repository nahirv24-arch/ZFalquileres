import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Hacé tu consulta",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Hacé tu consulta"
      intro="Escribinos sobre una propiedad y te respondemos."
      phase="la Fase 3"
    />
  );
}
