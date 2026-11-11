import type { FloorPlan, Room } from "@/types/property";

/**
 * Generadores de planos de EJEMPLO. Las coordenadas forman ambientes contiguos (sin superposiciones),
 * y las superficies se derivan de las medidas, así los totales siempre son coherentes.
 * Cuando exista información real, se reemplazan por los planos relevados por ZF.
 */

const snap = (n: number) => Math.round(n * 20) / 20; // múltiplos de 5 cm

/** Factor de muros y tabiques sobre la superficie útil, para estimar la superficie cubierta. */
const WALL_FACTOR = 1.13;

function scale(rooms: Room[], sx: number, sy: number): Room[] {
  // Se escalan los bordes (no las medidas) para que los ambientes vecinos sigan compartiendo pared.
  return rooms.map((r) => {
    const x1 = snap(r.x * sx);
    const x2 = snap((r.x + r.length) * sx);
    const y1 = snap(r.y * sy);
    const y2 = snap((r.y + r.width) * sy);
    return { ...r, x: x1, y: y1, length: snap(x2 - x1), width: snap(y2 - y1) };
  });
}

function finalize(
  rooms: Room[],
  meta: Pick<FloorPlan, "measuredAt" | "measuredBy" | "verification">,
): FloorPlan {
  const useful = rooms.filter((r) => !r.semiCovered).reduce((acc, r) => acc + r.length * r.width, 0);
  const semi = rooms.filter((r) => r.semiCovered).reduce((acc, r) => acc + r.length * r.width, 0);
  return {
    rooms,
    coveredArea: Math.round(useful * WALL_FACTOR),
    semiCoveredArea: Math.round(semi),
    ...meta,
  };
}

const DEMO_META = {
  measuredBy: "Datos de ejemplo (no relevados)",
  measuredAt: "2026-11-11",
  verification: "estimada" as const,
};

interface Options {
  sx?: number;
  sy?: number;
  balcony?: boolean;
  notes?: Partial<Record<string, string>>;
}

function withNotes(rooms: Room[], notes: Options["notes"]) {
  return rooms.map((r) => (notes?.[r.id] ? { ...r, notes: notes[r.id] } : r));
}

/** Departamento de 1 dormitorio (inspirado en la referencia 21.5). */
export function oneBedroomPlan({ sx = 1, sy = 1, balcony = true, notes }: Options = {}): FloorPlan {
  const base: Room[] = [
    { id: "cocina", name: "Cocina", kind: "cocina", x: 0, y: 0, length: 2.6, width: 2.1, height: 2.6 },
    {
      id: "recibidor",
      name: "Recibidor",
      kind: "circulacion",
      x: 0,
      y: 2.1,
      length: 2.6,
      width: 1.1,
      height: 2.6,
    },
    {
      id: "living",
      name: "Living / Comedor",
      kind: "living",
      x: 2.6,
      y: 0,
      length: 4.5,
      width: 3.2,
      height: 2.6,
    },
    { id: "bano", name: "Baño", kind: "bano", x: 0, y: 3.2, length: 2.2, width: 1.6, height: 2.4 },
    {
      id: "pasillo",
      name: "Pasillo",
      kind: "circulacion",
      x: 2.2,
      y: 3.2,
      length: 1.3,
      width: 3.0,
      height: 2.6,
    },
    {
      id: "dormitorio",
      name: "Dormitorio",
      kind: "dormitorio",
      x: 3.5,
      y: 3.2,
      length: 3.6,
      width: 3.0,
      height: 2.6,
    },
  ];
  if (balcony) {
    base.push({
      id: "balcon",
      name: "Balcón",
      kind: "balcon",
      x: 7.1,
      y: 0.2,
      length: 1.35,
      width: 3.0,
      height: 2.6,
      semiCovered: true,
    });
  }
  return finalize(withNotes(scale(base, sx, sy), notes), DEMO_META);
}

/** Departamento de 2 dormitorios, con uno o dos baños. */
export function twoBedroomPlan({
  sx = 1,
  sy = 1,
  balcony = true,
  secondBath = false,
  notes,
}: Options & { secondBath?: boolean } = {}): FloorPlan {
  const base: Room[] = [
    { id: "cocina", name: "Cocina", kind: "cocina", x: 0, y: 0, length: 2.8, width: 2.4, height: 2.6 },
    {
      id: "recibidor",
      name: "Recibidor",
      kind: "circulacion",
      x: 0,
      y: 2.4,
      length: 2.8,
      width: 1.2,
      height: 2.6,
    },
    {
      id: "living",
      name: "Living / Comedor",
      kind: "living",
      x: 2.8,
      y: 0,
      length: 4.8,
      width: 3.6,
      height: 2.6,
    },
    {
      id: "dormitorio-2",
      name: "Dormitorio 2",
      kind: "dormitorio",
      x: 0,
      y: 3.6,
      length: 2.9,
      width: 3.1,
      height: 2.6,
    },
    {
      id: "dormitorio",
      name: "Dormitorio principal",
      kind: "dormitorio",
      x: 4.6,
      y: 3.6,
      length: 3.0,
      width: 3.1,
      height: 2.6,
    },
  ];
  if (secondBath) {
    base.push(
      { id: "bano", name: "Baño", kind: "bano", x: 2.9, y: 3.6, length: 1.7, width: 1.6, height: 2.4 },
      {
        id: "bano-2",
        name: "Baño en suite",
        kind: "bano",
        x: 2.9,
        y: 5.2,
        length: 1.7,
        width: 1.5,
        height: 2.4,
      },
    );
  } else {
    base.push(
      { id: "bano", name: "Baño", kind: "bano", x: 2.9, y: 3.6, length: 1.7, width: 2.2, height: 2.4 },
      {
        id: "pasillo",
        name: "Pasillo",
        kind: "circulacion",
        x: 2.9,
        y: 5.8,
        length: 1.7,
        width: 0.9,
        height: 2.6,
      },
    );
  }
  if (balcony) {
    base.push({
      id: "balcon",
      name: "Balcón",
      kind: "balcon",
      x: 7.6,
      y: 0,
      length: 1.4,
      width: 3.6,
      height: 2.6,
      semiCovered: true,
    });
  }
  return finalize(withNotes(scale(base, sx, sy), notes), DEMO_META);
}

/** Monoambiente con cocina separada. */
export function studioPlan({ sx = 1, sy = 1, balcony = false, notes }: Options = {}): FloorPlan {
  const base: Room[] = [
    {
      id: "living",
      name: "Ambiente principal",
      kind: "living",
      x: 0,
      y: 0,
      length: 5.4,
      width: 4.2,
      height: 2.6,
    },
    { id: "cocina", name: "Cocina", kind: "cocina", x: 5.4, y: 0, length: 2.0, width: 2.2, height: 2.6 },
    { id: "bano", name: "Baño", kind: "bano", x: 5.4, y: 2.2, length: 2.0, width: 2.0, height: 2.4 },
  ];
  if (balcony) {
    base.push({
      id: "balcon",
      name: "Balcón",
      kind: "balcon",
      x: 0.6,
      y: 4.2,
      length: 4.2,
      width: 1.1,
      height: 2.6,
      semiCovered: true,
    });
  }
  return finalize(withNotes(scale(base, sx, sy), notes), DEMO_META);
}
