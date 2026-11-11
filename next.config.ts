import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Cache Components y Partial Prefetching quedan desactivados: en el runtime de Cloudflare Workers
  // Next.js no puede garantizarlos (dependen de setTimeout) y las respuestas se colgaban.
  // La app no usa "use cache", así que no se pierde funcionalidad.
  images: {
    // En Cloudflare la optimización de next/image requiere Cloudflare Images (servicio aparte).
    // Las fotos ya se guardan optimizadas (≤1280 px, JPEG ~150 KB) en public/, así que se sirven tal cual.
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

// Permite usar los recursos de Cloudflare (bindings) también con `next dev`.
initOpenNextCloudflareForDev();
