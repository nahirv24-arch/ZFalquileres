# ADR 0003: Hosting en Cloudflare Workers

- **Fecha:** 2026-11-11
- **Estado:** Aceptada (decisión del responsable del proyecto, que eligió Cloudflare sobre Vercel)

## Contexto

Se necesita una URL pública para la demo y un hosting que sirva también para el sistema completo. El plan
gratuito de Cloudflare permite uso comercial. El plan gratuito de Vercel (Hobby) no lo permite.

## Decisión

- Publicar en **Cloudflare Workers** con `@opennextjs/cloudflare` 1.20.16, que soporta Next.js 16.4.5 o
  posterior, y `wrangler` 4.160.1.
- Desplegar automáticamente desde GitHub con Workers Builds: cada push a `main` publica.
- Caché incremental: `static-assets-incremental-cache`. La app no revalida, así que no hacen falta R2 ni KV y no
  hay costos extra.

## Ajustes que exigió Cloudflare (verificados)

1. **Cache Components y Partial Prefetching desactivados.** En `wrangler dev` las respuestas se colgaban (Next
   advierte que en este runtime no puede garantizarlos). Sin ellos, el catálogo se renderiza a pedido y las
   fichas son estáticas (SSG). La app no usaba `"use cache"`.
2. **`images.unoptimized: true`.** La optimización de `next/image` en Cloudflare requiere Cloudflare Images.
   Las fotos se redujeron a 1280 px como máximo (2,4 MB en total).
3. **Bundle del Worker: 1,16 MB comprimido**, dentro del límite del plan gratuito (3 MB).

## Verificación

- 34 de 34 pruebas E2E y de accesibilidad pasan contra `wrangler dev`, el runtime local de Cloudflare.
- Las mismas 34 pasan contra `next start` (Node).

## Pendiente

- Si se agrega revalidación (ISR) o base de datos en la Etapa B: R2 o KV para el caché y D1 o Hyperdrive para
  la base, según lo que se decida.
- Dominio propio, como `alquileres.zfpropiedades.com.ar`, cuando ZF lo autorice (D-07).
