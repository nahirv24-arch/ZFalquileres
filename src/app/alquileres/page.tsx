import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PropertyCard } from "@/components/property/property-card";
import { FilterPanel } from "@/components/search/filter-panel";
import { SortSelect } from "@/components/search/sort-select";
import { hasActiveFilters, parseFilters } from "@/lib/filters";
import { buttonClasses } from "@/lib/ui";
import { propertyRepository } from "@/services/property-service";

export const metadata: Metadata = {
  title: "Alquileres en Córdoba Capital",
  description:
    "Departamentos en alquiler administrados por Zavalía & Fuster, con plano y medidas por ambiente.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const { filters, sort } = parseFilters(raw);
  const [neighborhoods, results] = await Promise.all([
    propertyRepository.neighborhoods(),
    propertyRepository.list(filters, sort),
  ]);

  const flatParams = Object.fromEntries(
    Object.entries(raw)
      .map(([k, v]) => [k, Array.isArray(v) ? v[0] : v] as const)
      .filter((e): e is readonly [string, string] => typeof e[1] === "string" && e[1] !== ""),
  );

  const count = results.length;
  return (
    <>
      <FilterPanel neighborhoods={neighborhoods} filters={filters} sort={sort} />
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-zf-navy" aria-live="polite">
          {count === 1 ? "1 propiedad en alquiler" : `${count} propiedades en alquiler`}
          {filters.neighborhood && (
            <span className="font-medium text-zf-muted"> en {filters.neighborhood}</span>
          )}
        </h2>
        <SortSelect sort={sort} params={flatParams} />
      </div>

      {count === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-zf-border bg-zf-surface px-6 py-14 text-center">
          <h3 className="text-xl font-bold text-zf-navy">No encontramos propiedades con esos filtros</h3>
          <p className="mx-auto mt-2 max-w-lg text-zf-muted">
            Probá ampliar el rango de precio o de superficie, o elegir otro barrio. También podés escribirnos
            y te avisamos cuando haya algo parecido.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/alquileres" className={buttonClasses("secondary", "md")}>
              Ver todas las propiedades
            </Link>
            <Link href="/contacto" className={buttonClasses("outline", "md")}>
              Hacer una consulta
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p, i) => (
            <li key={p.id} className="flex">
              <div className="w-full">
                <PropertyCard property={p} priority={i < 3} />
              </div>
            </li>
          ))}
        </ul>
      )}
      {hasActiveFilters(filters) && count > 0 && (
        <p className="mt-8 text-center text-sm text-zf-muted">
          <Link href="/alquileres" className="font-semibold text-zf-navy hover:underline">
            Quitar filtros y ver todas
          </Link>
        </p>
      )}
    </>
  );
}

function ResultsSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="h-36 animate-pulse rounded-2xl bg-zf-surface" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-96 animate-pulse rounded-xl bg-zf-surface" />
        ))}
      </div>
    </div>
  );
}

export default function CatalogPage({ searchParams }: PageProps<"/alquileres">) {
  return (
    <div className="bg-zf-surface/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-zf-red sm:text-4xl">
          Encontrá tu próximo alquiler
        </h1>
        <p className="mt-2 text-lg text-zf-navy">
          Departamentos en Córdoba Capital, con plano y medidas por ambiente.
        </p>
        <div className="mt-8">
          <Suspense fallback={<ResultsSkeleton />}>
            <Results searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
