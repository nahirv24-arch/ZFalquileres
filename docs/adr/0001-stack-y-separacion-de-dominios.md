# ADR 0001 — Stack base y separación catálogo / enriquecimiento

- **Fecha:** 2026-11-11
- **Estado:** Aceptada para Fase 1 (aprobada por el responsable del proyecto en el chat de desarrollo)
- **Responsable de aprobación final:** por definir (ZF)

## Contexto

El PRD (secciones 10 y 20.4) propone Next.js + TypeScript, PostgreSQL con migraciones y un adaptador
de catálogo desacoplado del proveedor. La integración con la web actual (Tokko Broker) no está
confirmada (D-01). El equipo de desarrollo no tiene Docker instalado.

## Decisión

| Área          | Elección                                                        | Alternativas descartadas                                                  |
| ------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router, Cache Components) + TypeScript estricto | Remix, Astro + API separada: más piezas para mantener                     |
| Estilos       | Tailwind CSS 4 con tokens de marca en CSS                       | CSS Modules: más lento para iterar diseño                                 |
| Base de datos | PostgreSQL + Prisma 7 (driver adapter `pg`)                     | Drizzle: válido, Prisma tiene mejor tooling de migraciones para el equipo |
| Base local    | Prisma Postgres local (`prisma dev`)                            | Docker Compose: no disponible en la máquina actual                        |
| Validación    | Zod                                                             | —                                                                         |
| Tests         | Vitest, Playwright, axe-core                                    | Jest: más lento y con más configuración                                   |
| Prisma 8      | No se usa: al 2026-11-11 está en RC                             | —                                                                         |

**Modelo:** se adopta la separación de PRD 20.4 en lugar del `Property` único de la sección 10.
`CatalogProperty` guarda solo los datos de la fuente externa (clave `source + externalId`).
`PropertyEnrichment` guarda lo que carga ZF. Así la sincronización actualiza una tabla sin tocar la otra
(RN-002).

**Catálogo:** interfaz `CatalogAdapter` (`listProperties`, `getPropertyByExternalId`,
`getChangesSince?`, `reportSyncHealth`). En Fase 1 solo existe `FixtureCatalogAdapter` con datos
ficticios. `ManualImportAdapter` y un adaptador de API autorizada se evalúan en Fase 2 según D-01.

## Consecuencias

- Hosting y base de producción siguen abiertos (D-07). El stack corre en cualquier proveedor con
  Node y Postgres gestionado.
- Los colores son provisorios (D-06). Las contradicciones entre las secciones 11 y 20.6 del PRD se
  resolvieron provisoriamente así: títulos principales en rojo/coral, subtítulos y header en azul oscuro.
- Autenticación del panel: se decide en Fase 4 (opciones: Auth.js con credenciales o enlace mágico).
