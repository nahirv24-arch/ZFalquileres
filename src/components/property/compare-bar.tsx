"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAX_COMPARE, useCompare } from "@/hooks/use-compare";
import { buttonClasses } from "@/lib/ui";
import type { PropertySummary } from "@/services/property-service";
import { IconX } from "@/components/ui/icons";

/** Barra flotante con la selección del comparador. No aparece en el comparador ni en el panel. */
export function CompareBar({ all }: { all: PropertySummary[] }) {
  const { selected, toggle, clear } = useCompare();
  const pathname = usePathname();
  if (selected.length === 0 || pathname.startsWith("/comparar") || pathname.startsWith("/admin")) return null;

  const items = selected
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is PropertySummary => Boolean(p));

  return (
    <>
      {/* Espacio para que la barra fija no tape el pie de página */}
      <div aria-hidden="true" className="h-20" />
      <aside
        aria-label="Propiedades para comparar"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-zf-border bg-white shadow-[0_-4px_16px_rgb(0_0_0/0.06)]"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:flex-wrap sm:justify-start sm:px-6 sm:py-3">
          <p className="whitespace-nowrap text-sm font-semibold text-zf-navy">
            Comparar ({items.length}/{MAX_COMPARE})
          </p>
          <ul className="hidden flex-1 flex-wrap gap-2 sm:flex">
            {items.map((p) => (
              <li
                key={p.slug}
                className="flex items-center gap-2 rounded-lg border border-zf-border bg-zf-surface py-1 pl-1 pr-2"
              >
                {p.photo && (
                  <Image
                    src={p.photo.src}
                    alt=""
                    width={40}
                    height={30}
                    className="h-8 w-10 rounded object-cover"
                  />
                )}
                <span className="max-w-40 truncate text-sm text-zf-text">
                  {p.neighborhood} · {p.title}
                </span>
                <button
                  type="button"
                  onClick={() => toggle(p.slug)}
                  className="rounded p-1 text-zf-muted hover:bg-white hover:text-zf-red"
                >
                  <IconX size={16} />
                  <span className="sr-only">Quitar {p.title} de la comparación</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <button type="button" onClick={clear} className={buttonClasses("ghost", "md")}>
              Limpiar
            </button>
            {items.length >= 2 ? (
              <Link
                href={`/comparar?ids=${items.map((p) => p.slug).join(",")}`}
                className={buttonClasses("primary", "md", "whitespace-nowrap")}
              >
                Comparar ahora
              </Link>
            ) : (
              <span className="text-sm text-zf-muted">Elegí al menos una más</span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
