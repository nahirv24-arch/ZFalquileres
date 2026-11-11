"use client";

import type { Room } from "@/types/property";

/**
 * Vista volumétrica ESQUEMÁTICA: extruye el plano de ejemplo en perspectiva isométrica.
 * No es un modelo 3D real ni un recorrido virtual; se rotula así en la interfaz.
 */

const S = 34; // px por metro
const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);
const WALL_SCALE = 0.42; // muros recortados para ver el interior (maqueta)

const FLOOR: Record<Room["kind"], string> = {
  living: "#f3e9dc",
  dormitorio: "#e9eef6",
  cocina: "#eef2ee",
  bano: "#e6f0f3",
  balcon: "#eceff1",
  lavadero: "#eef0f2",
  circulacion: "#f5f5f4",
};

type Pt = [number, number];

function rotate(rooms: Room[], turns: number) {
  const maxX = Math.max(...rooms.map((r) => r.x + r.length));
  const maxY = Math.max(...rooms.map((r) => r.y + r.width));
  return rooms.map((r) => {
    let { x, y } = r;
    let l = r.length;
    let w = r.width;
    let mx = maxX;
    let my = maxY;
    for (let i = 0; i < turns; i++) {
      // rotación 90° horaria del rectángulo dentro de la caja (mx × my)
      const nx = my - (y + w);
      const ny = x;
      x = nx;
      y = ny;
      [l, w] = [w, l];
      [mx, my] = [my, mx];
    }
    return { ...r, x, y, length: l, width: w };
  });
}

const iso = (x: number, y: number, z: number): Pt => [(x - y) * COS * S, (x + y) * SIN * S - z * S];
const poly = (pts: Pt[]) => pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

export function IsoView({
  rooms,
  turns,
  selectedId,
  onSelect,
}: {
  rooms: Room[];
  turns: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const rotated = rotate(rooms, turns).sort((a, b) => a.x + a.y - (b.x + b.y));

  const allPts: Pt[] = rotated.flatMap((r) => {
    const h = r.height * WALL_SCALE;
    return [
      iso(r.x, r.y, h),
      iso(r.x + r.length, r.y, h),
      iso(r.x, r.y + r.width, 0),
      iso(r.x + r.length, r.y + r.width, 0),
      iso(r.x, r.y + r.width, h),
      iso(r.x + r.length, r.y, 0),
    ];
  });
  const minX = Math.min(...allPts.map((p) => p[0])) - 20;
  const maxX = Math.max(...allPts.map((p) => p[0])) + 20;
  const minY = Math.min(...allPts.map((p) => p[1])) - 20;
  const maxY = Math.max(...allPts.map((p) => p[1])) + 20;

  return (
    <svg
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      className="h-auto max-h-[460px] w-full"
      role="group"
      aria-label="Vista volumétrica esquemática del plano de ejemplo"
    >
      {rotated.map((r) => {
        const h = (r.semiCovered ? 1.0 : r.height) * WALL_SCALE;
        const { x, y, length: l, width: w } = r;
        const isSel = r.id === selectedId;
        const floor = [iso(x, y, 0), iso(x + l, y, 0), iso(x + l, y + w, 0), iso(x, y + w, 0)];
        const backWallY = [iso(x, y, 0), iso(x + l, y, 0), iso(x + l, y, h), iso(x, y, h)];
        const backWallX = [iso(x, y, 0), iso(x, y + w, 0), iso(x, y + w, h), iso(x, y, h)];
        const frontWallY = [iso(x, y + w, 0), iso(x + l, y + w, 0), iso(x + l, y + w, h), iso(x, y + w, h)];
        const frontWallX = [iso(x + l, y, 0), iso(x + l, y + w, 0), iso(x + l, y + w, h), iso(x + l, y, h)];
        const stroke = isSel ? "var(--zf-room-selected-stroke)" : "var(--zf-navy)";
        return (
          <g
            key={r.id}
            role="button"
            tabIndex={0}
            aria-pressed={isSel}
            aria-label={`${r.name} en la vista volumétrica`}
            onClick={() => onSelect(r.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(r.id);
              }
            }}
            className="cursor-pointer outline-none [&:focus-visible>polygon.floor]:stroke-[var(--zf-red)]"
          >
            <polygon points={poly(backWallY)} fill="#c9d3d8" stroke={stroke} strokeWidth={1} />
            <polygon points={poly(backWallX)} fill="#b7c3c9" stroke={stroke} strokeWidth={1} />
            <polygon
              className="floor"
              points={poly(floor)}
              fill={isSel ? "var(--zf-room-selected)" : FLOOR[r.kind]}
              stroke={stroke}
              strokeWidth={isSel ? 2.5 : 1.2}
            />
            <polygon
              points={poly(frontWallY)}
              fill="#dfe6ea"
              fillOpacity={0.35}
              stroke={stroke}
              strokeWidth={1}
            />
            <polygon
              points={poly(frontWallX)}
              fill="#d0d9de"
              fillOpacity={0.35}
              stroke={stroke}
              strokeWidth={1}
            />
            <title>{r.name}</title>
          </g>
        );
      })}
      {/* Segunda pasada: etiquetas siempre visibles, por encima de los muros */}
      <g className="pointer-events-none" aria-hidden="true">
        {rotated.map((r) => {
          const [cx, cy] = iso(r.x + r.length / 2, r.y + r.width / 2, 0);
          return (
            <text
              key={r.id}
              x={cx}
              y={cy + 4}
              textAnchor="middle"
              fontSize={r.kind === "circulacion" ? 9 : 11}
              fontWeight={700}
              fill="var(--zf-navy)"
              stroke="white"
              strokeWidth={3}
              paintOrder="stroke"
            >
              {r.name}
            </text>
          );
        })}
      </g>
    </svg>
  );
}
