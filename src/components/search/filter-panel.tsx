import Link from "next/link";
import { inputClasses } from "@/lib/ui";
import type { PropertyFilters, SortOption } from "@/types/property";
import { IconArea, IconBed, IconPin, IconSearch } from "@/components/ui/icons";

/** Panel de filtros del catálogo (formulario GET: los filtros quedan en la URL). */
export function FilterPanel({
  neighborhoods,
  filters,
  sort,
}: {
  neighborhoods: string[];
  filters: PropertyFilters;
  sort: SortOption;
}) {
  const legend = "mb-1.5 flex items-center gap-1.5 text-sm font-bold text-zf-navy";
  return (
    <form
      action="/alquileres"
      method="get"
      role="search"
      aria-label="Filtrar alquileres"
      className="rounded-2xl border border-zf-border bg-white p-4 shadow-[0_4px_18px_rgb(37_61_71/0.06)] sm:p-5"
    >
      <input type="hidden" name="orden" value={sort} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1.4fr_1.4fr_auto] xl:items-end">
        <div>
          <label htmlFor="f-barrio" className={legend}>
            <IconPin size={18} /> Ubicación
          </label>
          <select
            id="f-barrio"
            name="barrio"
            defaultValue={filters.neighborhood ?? ""}
            className={inputClasses}
          >
            <option value="">Todos los barrios</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-ambientes" className={legend}>
            <IconBed size={18} /> Ambientes
          </label>
          <select
            id="f-ambientes"
            name="ambientes"
            defaultValue={filters.rooms?.toString() ?? ""}
            className={inputClasses}
          >
            <option value="">Todos</option>
            <option value="1">Monoambiente</option>
            <option value="2">2 ambientes</option>
            <option value="3">3 ambientes</option>
            <option value="4">4 o más</option>
          </select>
        </div>
        <fieldset>
          <legend className={legend}>
            <IconArea size={18} /> Superficie (m²)
          </legend>
          <div className="grid grid-cols-2 gap-2">
            <label className="sr-only" htmlFor="f-sup-desde">
              Superficie desde
            </label>
            <input
              id="f-sup-desde"
              name="supDesde"
              inputMode="numeric"
              placeholder="Desde"
              defaultValue={filters.minArea ?? ""}
              className={inputClasses}
            />
            <label className="sr-only" htmlFor="f-sup-hasta">
              Superficie hasta
            </label>
            <input
              id="f-sup-hasta"
              name="supHasta"
              inputMode="numeric"
              placeholder="Hasta"
              defaultValue={filters.maxArea ?? ""}
              className={inputClasses}
            />
          </div>
        </fieldset>
        <fieldset>
          <legend className={legend}>
            <span
              aria-hidden="true"
              className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full border-[1.8px] border-current text-[0.65rem] font-bold"
            >
              $
            </span>
            Precio mensual
          </legend>
          <div className="grid grid-cols-2 gap-2">
            <label className="sr-only" htmlFor="f-precio-desde">
              Precio desde
            </label>
            <input
              id="f-precio-desde"
              name="precioDesde"
              inputMode="numeric"
              placeholder="Desde"
              defaultValue={filters.minPrice ?? ""}
              className={inputClasses}
            />
            <label className="sr-only" htmlFor="f-precio-hasta">
              Precio hasta
            </label>
            <input
              id="f-precio-hasta"
              name="precioHasta"
              inputMode="numeric"
              placeholder="Hasta"
              defaultValue={filters.maxPrice ?? ""}
              className={inputClasses}
            />
          </div>
        </fieldset>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-zf-red px-6 font-semibold text-white hover:bg-zf-red-dark md:col-span-2 xl:col-span-1"
        >
          <IconSearch size={20} />
          Buscar
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zf-border pt-4">
        <label className="inline-flex cursor-pointer items-center gap-2 text-[0.95rem] text-zf-text">
          <input
            type="checkbox"
            name="balcon"
            value="si"
            defaultChecked={filters.balcony === true}
            className="h-5 w-5 rounded border-zf-border accent-zf-navy"
          />
          Solo con balcón
        </label>
        <Link
          href="/alquileres"
          className="text-sm font-semibold text-zf-navy underline-offset-4 hover:underline"
        >
          Limpiar filtros
        </Link>
      </div>
    </form>
  );
}
