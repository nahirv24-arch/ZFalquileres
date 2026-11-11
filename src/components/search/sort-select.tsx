"use client";

import { SORT_OPTIONS } from "@/lib/filters";
import type { SortOption } from "@/types/property";

/**
 * Orden del catálogo. Es un formulario GET que conserva los filtros actuales;
 * con JavaScript se aplica al cambiar la opción, sin JavaScript con el botón.
 */
export function SortSelect({ sort, params }: { sort: SortOption; params: Record<string, string> }) {
  return (
    <form action="/alquileres" method="get" className="flex items-center gap-2">
      {Object.entries(params)
        .filter(([k]) => k !== "orden")
        .map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
      <label htmlFor="orden" className="text-sm font-medium text-zf-text">
        Ordenar por
      </label>
      <select
        id="orden"
        name="orden"
        defaultValue={sort}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="min-h-11 rounded-lg border border-zf-border bg-white px-3 text-[0.95rem] text-zf-text focus:border-zf-navy focus:outline-none focus:ring-2 focus:ring-zf-navy/30"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <noscript>
        <button type="submit" className="min-h-11 rounded-lg border border-zf-border px-3 text-sm">
          Aplicar
        </button>
      </noscript>
    </form>
  );
}
