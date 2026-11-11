# ZF Alquiler Digital

Plataforma de **Zavalía & Fuster Propiedades** para conocer y consultar alquileres en Córdoba Capital a
distancia. Complementa www.zfpropiedades.com.ar, no la reemplaza ni la modifica.

> **Estado: Etapa A, demostración frontend.** Todas las propiedades, precios, medidas, consultas y fotos son
> **ficticios o ilustrativos**, y la app lo indica en pantalla. La demo no tiene backend: no envía ni guarda nada.

## Cómo ejecutarla

Requisitos: Node.js 24 o superior (probado con 26) y npm 11. La demo **no necesita base de datos**.

```bash
npm install
npm run build
npm start          # http://localhost:3000
```

Para desarrollo: `npm run dev`.

## Recorrido sugerido para la presentación

1. Inicio → buscador → zona **Nueva Córdoba** → Buscar.
2. Filtros: precio hasta **500000** y **2 ambientes** → Buscar (queda 1 resultado).
3. Abrir la ficha → galería (flechas, miniaturas, vista ampliada).
4. **Plano y medidas** → tocar **Dormitorio**: largo, ancho, alto y superficie.
5. Superficies cubierta, semicubierta y total, balcón y orientación.
6. **Recorrido 3D**: aviso «no disponible» y vista volumétrica de demostración (girar).
7. Volver al catálogo → «Comparar» en dos tarjetas → **Comparar ahora**.
8. Desde el comparador: **Consultar** → formulario con validación y confirmación de ejemplo.
9. **Servicios y mudanza** (EPEC, Ecogas, Aguas Cordobesas).
10. Pie de página → **Panel ZF (demostración)**: resumen, fichas, edición de medidas y fotos, consultas.

## Scripts

| Script                                        | Qué hace                                                                                             |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `npm run dev` / `npm run build` / `npm start` | Desarrollo, build y servidor de producción local                                                     |
| `npm run lint` / `npm run typecheck`          | ESLint y TypeScript                                                                                  |
| `npm run format` / `npm run format:check`     | Prettier                                                                                             |
| `npm test`                                    | Tests unitarios (Vitest)                                                                             |
| `npm run test:e2e`                            | Recorrido E2E + accesibilidad con axe (requiere `npm run build` y `npx playwright install chromium`) |
| `npm run db:*`                                | Base local de la Fase 1 (Prisma). **No la usa la demo**: queda para la Etapa B                       |

## Estructura

```
src/app/                  páginas (inicio, alquileres, ficha, comparar, contacto, mudanza, admin…)
src/components/           interfaz: layout, property, plan (plano SVG y vista 3D), search, compare, contact, admin, ui
src/data/demo/            ÚNICA fuente de datos de la demo: propiedades, planos, consultas y guías
src/services/             PropertyRepository: interfaz de acceso a datos + implementación demo
src/hooks/                useCompare (selección del comparador en el navegador)
src/lib/                  filtros, formato, validación del formulario, completitud de fichas, clases de UI
src/types/                tipos de dominio
src/app/globals.css       tokens de marca (colores, tipografía)
public/brand, public/demo logo e imágenes de la demo
src/server, prisma/       base de la Fase 1, reservada para la Etapa B
```

Para conectar el backend se reemplaza `demoRepository` en `src/services/property-service.ts` por una
implementación real. Los componentes no cambian.

## Créditos de imágenes

- Isotipo y logo: tomados de la web institucional de ZF. El isotipo está recoloreado (Z roja y F azul) como en
  las referencias del documento de diseño. Pendiente de confirmar con los activos oficiales (D-06).
- `ref-*.jpg`: recortes de las imágenes de referencia de la sección 21 del documento de diseño.
- El resto: fotos de Unsplash (licencia Unsplash, uso libre), ilustrativas. No son de los inmuebles.
