# ADR 0002: Demostración frontend-first (Etapa A)

- **Fecha:** 2026-11-11
- **Estado:** Aceptada (prompt de Etapa A del responsable del proyecto)

## Contexto

Hay que presentar la experiencia a gerencia con una demo navegable y estable. El backend, la integración con
Tokko y la persistencia quedan para la Etapa B.

## Decisiones

1. **Datos centralizados.** Todos los datos de la demo viven en `src/data/demo/`. Las páginas los leen solo a
   través de `PropertyRepository` (`src/services/property-service.ts`).
2. **Se descartan las postulaciones.** Se eliminaron `/postular` y `/seguimiento`. Solo queda una consulta
   simple: nombre, contacto, propiedad, mensaje y consentimiento.
3. **Planos generados y coherentes.** Los planos se arman con generadores que garantizan que los ambientes no se
   superpongan. Las superficies se derivan de las medidas: total = cubierta + semicubierta. Los tests lo
   verifican.
4. **3D honesto.** Ninguna propiedad tiene un recorrido real (`tour3dUrl: null`). La ficha muestra «Recorrido 3D
   no disponible» y una vista volumétrica rotulada como demostración. El botón «Ver modelo 3D» aparece solo con
   un recurso real.
5. **Contacto sin WhatsApp.** No hay un número confirmado. La confirmación del formulario aclara que no se envió
   nada.
6. **Marca.** Rojo `#df0c1d` y azul `#253d47`, tomados de la web institucional. Tipografía Plus Jakarta Sans,
   autoalojada por `next/font`.
7. **Fotos locales.** Están en `public/demo/photos` para que la demo funcione sin depender de servicios externos.
   El único recurso externo es el mapa de OpenStreetMap en la ficha.
8. **Base de la Fase 1 en reserva.** Prisma y el adaptador de catálogo quedan en el repositorio para la Etapa B.

## Pendiente para la Etapa B

Persistencia de consultas y fichas enriquecidas, autenticación del panel, adaptador del catálogo autorizado
(D-01), almacenamiento de fotos, planos y modelos, notificaciones, analíticas, y textos legales (D-05).
