"use client";

import { useState } from "react";
import { formatArea, roomArea } from "@/lib/format";
import { buttonClasses } from "@/lib/ui";
import type { Room, VerificationLevel } from "@/types/property";

type Field = "length" | "width" | "height";

const toInput = (n: number) => n.toFixed(2).replace(".", ",");
const parse = (s: string) => {
  const n = Number.parseFloat(s.replace(",", "."));
  return Number.isFinite(n) && n > 0 && n < 50 ? n : null;
};

/** Edición visual de medidas: recalcula superficies en pantalla. No guarda (demo). */
export function MeasurementsEditor({
  rooms,
  verification,
}: {
  rooms: Room[];
  verification: VerificationLevel;
}) {
  const initial = () =>
    Object.fromEntries(
      rooms.map((r) => [
        r.id,
        { length: toInput(r.length), width: toInput(r.width), height: toInput(r.height) },
      ]),
    );
  const [values, setValues] = useState<Record<string, Record<Field, string>>>(initial);
  const [level, setLevel] = useState<VerificationLevel>(verification);
  const [notice, setNotice] = useState<string | null>(null);

  const dirty =
    rooms.some((r) =>
      (["length", "width", "height"] as Field[]).some((f) => values[r.id][f] !== toInput(r[f])),
    ) || level !== verification;
  const invalid = rooms.some((r) =>
    (["length", "width", "height"] as Field[]).some((f) => parse(values[r.id][f]) === null),
  );

  const covered = rooms
    .filter((r) => !r.semiCovered)
    .reduce((acc, r) => acc + (parse(values[r.id].length) ?? 0) * (parse(values[r.id].width) ?? 0), 0);

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-zf-border">
        <table className="w-full min-w-[600px] text-left text-[0.95rem]">
          <thead className="bg-zf-surface text-zf-navy">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Ambiente
              </th>
              <th scope="col" className="px-3 py-3 font-semibold">
                Largo (m)
              </th>
              <th scope="col" className="px-3 py-3 font-semibold">
                Ancho (m)
              </th>
              <th scope="col" className="px-3 py-3 font-semibold">
                Alto (m)
              </th>
              <th scope="col" className="px-3 py-3 font-semibold">
                Superficie
              </th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => {
              const l = parse(values[r.id].length);
              const w = parse(values[r.id].width);
              return (
                <tr key={r.id} className="border-t border-zf-border">
                  <th scope="row" className="px-4 py-2 font-semibold text-zf-navy">
                    {r.name}
                  </th>
                  {(["length", "width", "height"] as Field[]).map((f) => {
                    const bad = parse(values[r.id][f]) === null;
                    return (
                      <td key={f} className="px-3 py-2">
                        <input
                          aria-label={`${r.name}: ${f === "length" ? "largo" : f === "width" ? "ancho" : "alto"} en metros`}
                          aria-invalid={bad || undefined}
                          inputMode="decimal"
                          value={values[r.id][f]}
                          onChange={(e) => {
                            setNotice(null);
                            setValues((v) => ({ ...v, [r.id]: { ...v[r.id], [f]: e.target.value } }));
                          }}
                          className={`h-10 w-24 rounded-lg border px-2 tabular-nums focus:outline-none focus:ring-2 focus:ring-zf-navy/30 ${
                            bad ? "border-zf-red bg-zf-red-soft" : "border-zf-border"
                          }`}
                        />
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 tabular-nums text-zf-text">
                    {l && w ? formatArea(roomArea({ length: l, width: w })) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="verif" className="text-sm font-semibold text-zf-navy">
            Estado de las medidas
          </label>
          <select
            id="verif"
            value={level}
            onChange={(e) => {
              setNotice(null);
              setLevel(e.target.value as VerificationLevel);
            }}
            className="h-10 rounded-lg border border-zf-border bg-white px-2"
          >
            <option value="verificada">Verificadas</option>
            <option value="estimada">Estimadas / de ejemplo</option>
            <option value="no-disponible">No disponibles</option>
          </select>
          <span className="text-sm text-zf-muted">
            Superficie útil cubierta: {formatArea(Math.round(covered * 10) / 10)}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!dirty}
            onClick={() => {
              setValues(initial());
              setLevel(verification);
              setNotice(null);
            }}
            className={buttonClasses("ghost", "md")}
          >
            Restablecer
          </button>
          <button
            type="button"
            disabled={!dirty || invalid}
            onClick={() =>
              setNotice("Cambios validados. En la demostración no se guardan: se pierden al recargar.")
            }
            className={buttonClasses("secondary", "md")}
          >
            Validar cambios
          </button>
        </div>
      </div>
      {invalid && (
        <p role="alert" className="mt-3 text-sm font-semibold text-zf-red">
          Hay medidas inválidas: usá números mayores que 0 (por ejemplo 3,60).
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="mt-3 rounded-lg bg-zf-warning-soft px-4 py-2 text-sm font-semibold text-zf-warning"
        >
          {notice}
        </p>
      )}
    </div>
  );
}
