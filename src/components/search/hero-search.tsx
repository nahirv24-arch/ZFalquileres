import { PRICE_RANGES } from "@/lib/filters";
import { IconBed, IconPin, IconSearch } from "@/components/ui/icons";

/**
 * Buscador de la portada. Formulario GET nativo: funciona sin JavaScript y deja la búsqueda
 * en la URL, así se puede compartir.
 */
export function HeroSearch({ neighborhoods }: { neighborhoods: string[] }) {
  const field =
    "h-12 w-full appearance-none rounded-lg border border-zf-border bg-white pl-10 pr-8 text-[0.95rem] text-zf-text focus:border-zf-navy focus:outline-none focus:ring-2 focus:ring-zf-navy/30";
  const chevron =
    "pointer-events-none absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-b-2 border-r-2 border-zf-muted";
  return (
    <form
      action="/alquileres"
      method="get"
      role="search"
      aria-label="Buscar alquileres"
      className="grid gap-3 rounded-2xl border border-zf-border bg-white p-3 shadow-[0_10px_30px_rgb(37_61_71/0.10)] sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_auto]"
    >
      <div className="relative">
        <label htmlFor="hs-barrio" className="sr-only">
          Zona
        </label>
        <IconPin
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zf-navy"
        />
        <select id="hs-barrio" name="barrio" defaultValue="" className={field}>
          <option value="">¿En qué zona buscás?</option>
          {neighborhoods.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span aria-hidden="true" className={chevron} />
      </div>
      <div className="relative">
        <label htmlFor="hs-ambientes" className="sr-only">
          Ambientes
        </label>
        <IconBed
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zf-navy"
        />
        <select id="hs-ambientes" name="ambientes" defaultValue="" className={field}>
          <option value="">Ambientes</option>
          <option value="1">Monoambiente</option>
          <option value="2">2 ambientes</option>
          <option value="3">3 ambientes</option>
          <option value="4">4 o más</option>
        </select>
        <span aria-hidden="true" className={chevron} />
      </div>
      <div className="relative">
        <label htmlFor="hs-precio" className="sr-only">
          Presupuesto mensual
        </label>
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[0.95rem] font-bold text-zf-navy">
          $
        </span>
        <select id="hs-precio" name="precioHasta" defaultValue="" className={field}>
          <option value="">Presupuesto</option>
          {PRICE_RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <span aria-hidden="true" className={chevron} />
      </div>
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-zf-navy px-6 font-semibold text-white hover:bg-zf-navy-dark sm:col-span-2 lg:col-span-1"
      >
        <IconSearch size={20} />
        Buscar
      </button>
    </form>
  );
}
