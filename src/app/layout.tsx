import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { HydrationMarker } from "@/components/layout/hydration-marker";
import { DemoBanner } from "@/components/layout/demo-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CompareBar } from "@/components/property/compare-bar";
import { propertyRepository, toSummary } from "@/services/property-service";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ZF Alquiler Digital · Zavalía & Fuster Propiedades",
    template: "%s · ZF Alquiler Digital",
  },
  description:
    "Conocé alquileres en Córdoba Capital sin viajar: fotos, plano con medidas por ambiente, costos y consultas en línea.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  robots: { index: false, follow: false }, // demo: no indexar
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#253d47",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Resúmenes livianos para la barra del comparador.
  const summaries = (await propertyRepository.list()).map(toSummary);
  return (
    <html lang="es-AR" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-zf-navy focus:shadow"
        >
          Saltar al contenido
        </a>
        <DemoBanner />
        <SiteHeader />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <CompareBar all={summaries} />
        <HydrationMarker />
      </body>
    </html>
  );
}
