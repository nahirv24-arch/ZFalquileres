"use client";

import { useState } from "react";
import { formatArea, formatDate, formatMeters, roomArea } from "@/lib/format";
import type { FloorPlan, Orientation } from "@/types/property";
import {
  IconBalcony,
  IconChevronLeft,
  IconChevronRight,
  IconCompass,
  IconCube,
  IconExternal,
  IconHand,
  IconInfo,
} from "@/components/ui/icons";
import { FloorPlanSvg } from "./floor-plan-svg";
import { IsoView } from "./iso-view";

const VERIFICATION_LABEL = {
  verificada: { text: "Medidas verificadas", cls: "bg-zf-success-soft text-zf-success" },
  estimada: { text: "Medidas de ejemplo", cls: "bg-zf-warning-soft text-zf-warning" },
  "no-disponible": { text: "Medidas no disponibles", cls: "bg-zf-surface text-zf-muted" },
} as const;

function SectionTitle({ id, title, subtitle }: { id: string; title: string; subtitle: string }) {
  return (
    <div className="border-l-4 border-zf-red pl-4">
      <h2 id={id} className="text-2xl font-bold text-zf-navy sm:text-[1.7rem]">
        {title}
      </h2>
      <p className="mt-1 text-zf-muted">{subtitle}</p>
    </div>
  );
}

export function PlanExplorer({
  plan,
  orientation,
  tour3dUrl,
}: {
  plan: FloorPlan;
  orientation: Orientation;
  tour3dUrl: string | null;
}) {
  const initial = plan.rooms.find((r) => r.kind === "living")?.id ?? plan.rooms[0]?.id ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(initial);
  const [turns, setTurns] = useState(0);
  const selected = plan.rooms.find((r) => r.id === selectedId) ?? null;
  const balcony = plan.rooms.find((r) => r.kind === "balcon");
  const verification = VERIFICATION_LABEL[plan.verification];
  const tableRooms = plan.rooms.filter((r) => r.kind !== "circulacion");

  return (
    <>
      <section
        aria-labelledby="plano"
        id="plano-y-medidas"
        className="scroll-mt-32 rounded-2xl border border-zf-border bg-white p-5 sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionTitle
            id="plano"
            title="Plano interactivo y medidas"
            subtitle="Explorá la distribución, las dimensiones de cada ambiente y la superficie total."
          />
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${verification.cls}`}
            >
              <IconInfo size={18} />
              {verification.text}
            </span>
            {tour3dUrl && (
              <a
                href={tour3dUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border-2 border-zf-navy px-3 text-sm font-semibold text-zf-navy hover:bg-zf-navy-soft"
              >
                <IconCube size={18} /> Ver modelo 3D
              </a>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <div className="rounded-xl border border-zf-border bg-zf-surface/50 p-2 sm:p-4">
              <FloorPlanSvg rooms={plan.rooms} selectedId={selectedId} onSelect={setSelectedId} />
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm text-zf-muted">
              <IconHand size={20} className="shrink-0 text-zf-navy" />
              Hacé clic en un ambiente del plano o de la tabla para ver sus medidas.
            </p>
          </div>

          <div className="min-w-0 space-y-5">
            <div className="overflow-x-auto rounded-xl border border-zf-border">
              <table className="w-full min-w-[420px] text-left text-[0.95rem]">
                <caption className="sr-only">Medidas por ambiente, en metros</caption>
                <thead className="bg-zf-navy text-white">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Ambiente
                    </th>
                    <th scope="col" className="px-3 py-3 font-semibold">
                      Largo
                    </th>
                    <th scope="col" className="px-3 py-3 font-semibold">
                      Ancho
                    </th>
                    <th scope="col" className="px-3 py-3 font-semibold">
                      Alto
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableRooms.map((r) => {
                    const isSel = r.id === selectedId;
                    return (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedId(r.id)}
                        className={`cursor-pointer border-t border-zf-border ${isSel ? "bg-[var(--zf-room-selected)]" : "hover:bg-zf-surface"}`}
                      >
                        <th scope="row" className="px-4 py-2.5 font-semibold text-zf-navy">
                          <button
                            type="button"
                            aria-pressed={isSel}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(r.id);
                            }}
                            className="text-left underline-offset-4 hover:underline"
                          >
                            {r.name}
                          </button>
                        </th>
                        <td className="px-3 py-2.5 tabular-nums">{formatMeters(r.length)}</td>
                        <td className="px-3 py-2.5 tabular-nums">{formatMeters(r.width)}</td>
                        <td className="px-3 py-2.5 tabular-nums">{formatMeters(r.height)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {selected && (
              <div
                aria-live="polite"
                className="rounded-xl border-2 border-[var(--zf-room-selected-stroke)] bg-white p-5"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-zf-muted">
                  Ambiente seleccionado
                </p>
                <h3 className="mt-1 text-xl font-bold text-zf-navy">{selected.name}</h3>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
                  {[
                    ["Largo", formatMeters(selected.length)],
                    ["Ancho", formatMeters(selected.width)],
                    ["Alto", formatMeters(selected.height)],
                    ["Superficie", formatArea(roomArea(selected))],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-sm text-zf-muted">{k}</dt>
                      <dd className="text-lg font-bold tabular-nums text-zf-navy">{v}</dd>
                    </div>
                  ))}
                </dl>
                {selected.notes && (
                  <p className="mt-4 rounded-lg bg-zf-surface px-3 py-2 text-sm text-zf-text">
                    <strong className="font-semibold">Observaciones: </strong>
                    {selected.notes}
                  </p>
                )}
              </div>
            )}

            <dl className="grid grid-cols-3 divide-x divide-zf-border rounded-xl bg-zf-surface py-4">
              <div className="px-4">
                <dt className="text-sm font-semibold text-zf-navy">Superficie cubierta</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-zf-navy">
                  {formatArea(plan.coveredArea)}
                </dd>
              </div>
              <div className="px-4">
                <dt className="text-sm font-semibold text-zf-navy">Superficie semicubierta</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-zf-navy">
                  {formatArea(plan.semiCoveredArea)}
                </dd>
              </div>
              <div className="px-4">
                <dt className="text-sm font-semibold text-zf-navy">Superficie total</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-zf-red">
                  {formatArea(plan.coveredArea + plan.semiCoveredArea)}
                </dd>
              </div>
            </dl>

            <ul className="grid gap-4 sm:grid-cols-2">
              <li className="flex items-start gap-3">
                <IconBalcony size={28} className="mt-0.5 shrink-0 text-zf-navy" />
                <p>
                  <strong className="block font-bold text-zf-navy">Balcón</strong>
                  <span className="text-zf-text">
                    {balcony
                      ? `${formatMeters(balcony.length)} × ${formatMeters(balcony.width)} (${formatArea(roomArea(balcony))})`
                      : "No tiene"}
                  </span>
                </p>
              </li>
              <li className="flex items-start gap-3">
                <IconCompass size={28} className="mt-0.5 shrink-0 text-zf-navy" />
                <p>
                  <strong className="block font-bold text-zf-navy">Orientación</strong>
                  <span className="text-zf-text">{orientation}</span>
                </p>
              </li>
            </ul>

            <p className="text-xs text-zf-muted">
              Fuente: {plan.measuredBy} · {formatDate(plan.measuredAt)}. La superficie cubierta incluye muros.
              Antes de publicar en producción, ZF reemplaza estos valores por mediciones verificadas.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="recorrido"
        id="recorrido-3d"
        className="scroll-mt-32 rounded-2xl border border-zf-border bg-white p-5 sm:p-8"
      >
        <SectionTitle
          id="recorrido"
          title="Recorrido 3D"
          subtitle="Modelos 3D y recorridos virtuales cargados por ZF."
        />
        {tour3dUrl ? (
          <a
            href={tour3dUrl}
            target="_blank"
            rel="noopener"
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-lg bg-zf-navy px-6 font-semibold text-white hover:bg-zf-navy-dark"
          >
            <IconCube size={20} /> Ver modelo 3D <IconExternal size={18} />
          </a>
        ) : (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-zf-border bg-zf-surface px-5 py-4">
            <IconCube size={26} className="mt-0.5 shrink-0 text-zf-navy" />
            <div>
              <p className="font-bold text-zf-navy">Recorrido 3D no disponible para esta propiedad</p>
              <p className="mt-1 text-sm text-zf-muted">
                Cuando ZF cargue un modelo o recorrido real, vas a ver acá el botón «Ver modelo 3D». Mientras
                tanto, podés explorar la vista volumétrica generada a partir del plano.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-xl border border-dashed border-zf-border p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="inline-flex items-center rounded-md bg-zf-warning-soft px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-zf-warning">
                Demostración
              </p>
              <h3 className="mt-1 text-lg font-bold text-zf-navy">Vista volumétrica esquemática</h3>
            </div>
            <div className="flex items-center gap-2" role="group" aria-label="Girar la vista">
              <button
                type="button"
                onClick={() => setTurns((t) => (t + 3) % 4)}
                className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-zf-border px-3 text-sm font-semibold text-zf-navy hover:bg-zf-navy-soft"
              >
                <IconChevronLeft size={18} /> Girar
                <span className="sr-only"> a la izquierda</span>
              </button>
              <button
                type="button"
                onClick={() => setTurns((t) => (t + 1) % 4)}
                className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-zf-border px-3 text-sm font-semibold text-zf-navy hover:bg-zf-navy-soft"
              >
                Girar <IconChevronRight size={18} />
                <span className="sr-only"> a la derecha</span>
              </button>
            </div>
          </div>
          <div className="mt-4">
            <IsoView rooms={plan.rooms} turns={turns} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
          <p className="mt-3 text-sm text-zf-muted">
            Generada automáticamente a partir del plano de ejemplo, con muros recortados para ver el interior.
            No es un recorrido virtual ni un modelo real de la propiedad.
            {selected && (
              <>
                {" "}
                Seleccionado: <strong className="text-zf-navy">{selected.name}</strong>.
              </>
            )}
          </p>
        </div>
      </section>
    </>
  );
}
