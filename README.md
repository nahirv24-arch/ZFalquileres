# ZF Alquiler Digital

Plataforma complementaria de **Zavalía & Fuster Propiedades** para conocer y gestionar alquileres
residenciales en Córdoba Capital a distancia. No reemplaza ni modifica www.zfpropiedades.com.ar.

> Estado: **Fase 1 — Fundaciones.** Las secciones públicas muestran "en construcción" e indican en
> qué fase se implementan. Todos los datos de propiedades son **ficticios** (`[FICTICIO]`).

## Requisitos

- Node.js 24 o superior (probado con 26)
- npm 11
- No hace falta Docker: la base local usa **Prisma Postgres local** (`prisma dev`).

## Primeros pasos

```bash
npm install
cp .env.example .env
npm run db:start          # levanta Postgres local (muestra la URL; ajustá DATABASE_URL si cambia el puerto)
npm run db:migrate        # aplica migraciones
npm run db:seed           # carga propiedades FICTICIAS
npm run dev               # http://localhost:3000
```

## Scripts

| Script                                         | Qué hace                                                                                               |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `npm run dev`                                  | Servidor de desarrollo                                                                                 |
| `npm run build` / `npm start`                  | Build y servidor de producción local                                                                   |
| `npm run lint` / `npm run typecheck`           | ESLint y TypeScript                                                                                    |
| `npm run format` / `npm run format:check`      | Prettier                                                                                               |
| `npm test`                                     | Tests unitarios (Vitest)                                                                               |
| `npm run test:e2e`                             | E2E + accesibilidad con axe (Playwright; requiere `npm run build` y `npx playwright install chromium`) |
| `npm run db:start` / `db:stop`                 | Prisma Postgres local                                                                                  |
| `npm run db:migrate` / `db:seed` / `db:studio` | Migraciones, datos ficticios, explorador de datos                                                      |

## Estructura

```
src/app/                 rutas (App Router). /admin se implementa en Fase 4
src/components/          componentes de marca y layout
src/lib/                 utilidades compartidas (formato, variables de entorno)
src/server/catalog/      contrato CatalogAdapter, adaptador de fixtures, reglas de visibilidad
src/server/db.ts         cliente Prisma (solo servidor)
src/generated/           cliente Prisma generado (no versionado)
prisma/                  esquema, migraciones y seed ficticio
tests/unit, tests/e2e    Vitest y Playwright
docs/adr/                registro de decisiones técnicas
```

## Reglas del proyecto

- **No se inventan datos de inmuebles.** Lo faltante se muestra como "Dato no informado".
- **Solo lectura sobre el catálogo existente** y únicamente por vías autorizadas (sin scraping).
- Datos comerciales del catálogo y contenido enriquecido de ZF viven en tablas separadas
  (`CatalogProperty` / `PropertyEnrichment`) para que una sincronización nunca borre medidas o videos.
- Secretos fuera del repositorio: solo se versiona `.env.example`.
- Producción, DNS, servicios pagos y datos reales requieren aprobación explícita de ZF.

## Valores provisorios

Los colores de `src/app/globals.css` y el logotipo de texto son **provisorios** hasta que ZF entregue
los activos oficiales (decisión D-06).
