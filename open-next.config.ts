// Configuración de OpenNext para Cloudflare Workers.
// La app no usa revalidación (todo se prerenderiza en el build), así que el caché se lee de los
// archivos estáticos del Worker: no hace falta R2 ni KV (sin costos ni configuración extra).
// Si en la Etapa B se agrega revalidación (ISR), cambiar a r2IncrementalCache.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
