"use client";

import type { KeyboardEvent } from "react";
import { formatMeters } from "@/lib/format";
import type { Room } from "@/types/property";

const S = 64; // píxeles por metro
const PAD = 56; // margen para cotas

const FILL: Record<Room["kind"], string> = {
  living: "#ffffff",
  dormitorio: "#ffffff",
  cocina: "#ffffff",
  bano: "#ffffff",
  balcon: "#f1f4f5",
  lavadero: "#ffffff",
  circulacion: "#f7f8f9",
};

function DimLine({
  x1,
  y1,
  x2,
  y2,
  label,
  vertical = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  vertical?: boolean;
}) {
  const tick = 6;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g className="pointer-events-none" stroke="var(--zf-red)" strokeWidth={1.5}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      {vertical ? (
        <>
          <line x1={x1 - tick} y1={y1} x2={x1 + tick} y2={y1} />
          <line x1={x2 - tick} y1={y2} x2={x2 + tick} y2={y2} />
        </>
      ) : (
        <>
          <line x1={x1} y1={y1 - tick} x2={x1} y2={y1 + tick} />
          <line x1={x2} y1={y2 - tick} x2={x2} y2={y2 + tick} />
        </>
      )}
      <rect
        x={vertical ? mx - 30 : mx - 32}
        y={vertical ? my - 11 : my - 11}
        width={vertical ? 60 : 64}
        height={22}
        rx={4}
        fill="white"
        stroke="none"
      />
      <text
        x={mx}
        y={my + 5}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fill="var(--zf-red)"
        stroke="none"
      >
        {label}
      </text>
    </g>
  );
}

export function FloorPlanSvg({
  rooms,
  selectedId,
  onSelect,
}: {
  rooms: Room[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const maxX = Math.max(...rooms.map((r) => r.x + r.length));
  const maxY = Math.max(...rooms.map((r) => r.y + r.width));
  const width = maxX * S + PAD * 2;
  const height = maxY * S + PAD * 2;
  const selected = rooms.find((r) => r.id === selectedId) ?? null;

  const onKey = (e: KeyboardEvent<SVGGElement>, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(id);
    }
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full select-none"
      role="group"
      aria-label="Plano interactivo. Elegí un ambiente para ver sus medidas."
    >
      <defs>
        <pattern id="semi" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="#d3dade" strokeWidth="2" />
        </pattern>
      </defs>
      <g transform={`translate(${PAD} ${PAD})`}>
        {rooms.map((r) => {
          const isSel = r.id === selectedId;
          const x = r.x * S;
          const y = r.y * S;
          const w = r.length * S;
          const h = r.width * S;
          const small = w < 110 || h < 80;
          const area = (r.length * r.width).toLocaleString("es-AR", { maximumFractionDigits: 1 });
          return (
            <g
              key={r.id}
              role="button"
              tabIndex={0}
              aria-pressed={isSel}
              aria-label={`${r.name}: ${formatMeters(r.length)} de largo por ${formatMeters(r.width)} de ancho, ${area} metros cuadrados`}
              onClick={() => onSelect(r.id)}
              onKeyDown={(e) => onKey(e, r.id)}
              className="cursor-pointer outline-none [&:focus-visible>rect.focus]:opacity-100 [&:hover>rect.hover]:opacity-100"
            >
              <rect x={x} y={y} width={w} height={h} fill={r.semiCovered ? "url(#semi)" : FILL[r.kind]} />
              {r.semiCovered && <rect x={x} y={y} width={w} height={h} fill={FILL.balcon} opacity={0.55} />}
              <rect
                className="hover"
                x={x}
                y={y}
                width={w}
                height={h}
                fill="var(--zf-navy-soft)"
                opacity={0}
              />
              {isSel && <rect x={x} y={y} width={w} height={h} fill="var(--zf-room-selected)" />}
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill="none"
                stroke="var(--zf-navy)"
                strokeWidth={r.semiCovered ? 3 : 6}
                strokeDasharray={r.semiCovered ? "8 5" : undefined}
              />
              {isSel && (
                <rect
                  x={x + 5}
                  y={y + 5}
                  width={w - 10}
                  height={h - 10}
                  fill="none"
                  stroke="var(--zf-room-selected-stroke)"
                  strokeWidth={3}
                  rx={2}
                />
              )}
              <rect
                className="focus"
                x={x + 4}
                y={y + 4}
                width={w - 8}
                height={h - 8}
                fill="none"
                stroke="var(--zf-red)"
                strokeWidth={3}
                strokeDasharray="6 4"
                opacity={0}
              />
              <text
                x={x + w / 2}
                y={y + h / 2 - (small ? 2 : 6)}
                textAnchor="middle"
                fontSize={small ? 13 : 17}
                fontWeight={700}
                fill="var(--zf-navy)"
              >
                {r.name}
              </text>
              {!small && (
                <text
                  x={x + w / 2}
                  y={y + h / 2 + 16}
                  textAnchor="middle"
                  fontSize={14}
                  fill="var(--zf-muted)"
                >
                  {r.length.toLocaleString("es-AR", { minimumFractionDigits: 2 })} ×{" "}
                  {r.width.toLocaleString("es-AR", { minimumFractionDigits: 2 })} m
                </text>
              )}
            </g>
          );
        })}

        {/* Cotas del ambiente seleccionado */}
        {/* Cotas del ambiente seleccionado, proyectadas sobre los márgenes del plano */}
        {selected && (
          <>
            <g
              stroke="var(--zf-red)"
              strokeWidth={1}
              strokeDasharray="4 4"
              opacity={0.7}
              className="pointer-events-none"
            >
              <line x1={selected.x * S} y1={-30} x2={selected.x * S} y2={selected.y * S} />
              <line
                x1={(selected.x + selected.length) * S}
                y1={-30}
                x2={(selected.x + selected.length) * S}
                y2={selected.y * S}
              />
              <line x1={-30} y1={selected.y * S} x2={selected.x * S} y2={selected.y * S} />
              <line
                x1={-30}
                y1={(selected.y + selected.width) * S}
                x2={selected.x * S}
                y2={(selected.y + selected.width) * S}
              />
            </g>
            <DimLine
              x1={selected.x * S}
              y1={-30}
              x2={(selected.x + selected.length) * S}
              y2={-30}
              label={formatMeters(selected.length)}
            />
            <DimLine
              x1={-30}
              y1={selected.y * S}
              x2={-30}
              y2={(selected.y + selected.width) * S}
              label={formatMeters(selected.width)}
              vertical
            />
          </>
        )}
      </g>
    </svg>
  );
}
