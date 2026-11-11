import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Panel administrativo",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Panel administrativo"
      intro="Acceso exclusivo para el equipo de ZF."
      phase="la Fase 4"
    />
  );
}
