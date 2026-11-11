import type { Property } from "@/types/property";

/** Requisitos de una ficha enriquecida completa. Se calculan a partir de los datos, no se inventan. */
export const COMPLETENESS_CHECKS: { id: string; label: string; ok: (p: Property) => boolean }[] = [
  { id: "fotos", label: "Al menos 5 fotos", ok: (p) => p.photos.length >= 5 },
  { id: "plano", label: "Plano con ambientes", ok: (p) => p.plan !== null && p.plan.rooms.length > 0 },
  { id: "medidas", label: "Medidas verificadas por ZF", ok: (p) => p.plan?.verification === "verificada" },
  {
    id: "notas",
    label: "Observaciones de ambientes",
    ok: (p) => p.plan?.rooms.some((r) => Boolean(r.notes)) ?? false,
  },
  { id: "mascotas", label: "Política de mascotas informada", ok: (p) => p.petsAllowed !== null },
  { id: "video", label: "Video", ok: (p) => p.videoUrl !== null },
  { id: "tour", label: "Recorrido 3D autorizado", ok: (p) => p.tour3dUrl !== null },
  { id: "servicios", label: "Servicios del inmueble", ok: (p) => p.services.length > 0 },
];

export function completeness(p: Property) {
  const missing = COMPLETENESS_CHECKS.filter((c) => !c.ok(p)).map((c) => c.label);
  const done = COMPLETENESS_CHECKS.length - missing.length;
  return {
    percent: Math.round((done / COMPLETENESS_CHECKS.length) * 100),
    done,
    total: COMPLETENESS_CHECKS.length,
    missing,
  };
}
