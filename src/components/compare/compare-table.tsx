"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { MAX_COMPARE, useCompare } from "@/hooks/use-compare";
import { formatArea, formatMoney, roomsLabel } from "@/lib/format";
import { buttonClasses, inputClasses } from "@/lib/ui";
import type { Property } from "@/types/property";
import { IconCheck, IconX } from "@/components/ui/icons";

type Row = {
  label: string;
  value: (p: Property) => React.ReactNode;
  /** Para resaltar el mejor valor numérico de la fila. */
  best?: { score: (p: Property) => number; better: "min" | "max"; tag: string };
};

const yesNo = (v: boolean, yes = "Sí", no = "No") => (
  <span className={`inline-flex items-center gap-1 font-semibold ${v ? "text-zf-success" : "text-zf-muted"}`}>
    {v ? <IconCheck size={16} /> : <IconX size={16} />}
    {v ? yes : no}
  </span>
);

const ROWS: Row[] = [
  {
    label: "Precio mensual",
    value: (p) => (
      <span className="text-lg font-bold text-zf-red">{formatMoney(p.rent.amount, p.rent.currency)}</span>
    ),
    best: { score: (p) => p.rent.amount, better: "min", tag: "Menor precio" },
  },
  {
    label: "Expensas",
    value: (p) => (p.expenses ? formatMoney(p.expenses.amount, p.expenses.currency) : "Sin expensas"),
  },
  { label: "Ubicación", value: (p) => p.neighborhood },
  { label: "Ambientes", value: (p) => roomsLabel(p.rooms) },
  { label: "Dormitorios", value: (p) => (p.bedrooms === 0 ? "Monoambiente" : p.bedrooms) },
  { label: "Baños", value: (p) => p.bathrooms },
  {
    label: "Superficie total",
    value: (p) => <span className="font-semibold">{formatArea(p.totalArea)}</span>,
    best: { score: (p) => p.totalArea, better: "max", tag: "Más amplia" },
  },
  {
    label: "Superficie cubierta",
    value: (p) => (p.plan ? formatArea(p.plan.coveredArea) : "Dato no informado"),
  },
  { label: "Balcón", value: (p) => yesNo(p.hasBalcony) },
  { label: "Orientación", value: (p) => p.orientation },
  { label: "Piso", value: (p) => p.floor },
  { label: "Plano con medidas", value: (p) => yesNo(p.plan !== null, "Disponible", "No disponible") },
  { label: "Recorrido 3D", value: (p) => yesNo(p.tour3dUrl !== null, "Disponible", "No disponible") },
  { label: "Disponibilidad", value: (p) => <span className="text-zf-warning">{p.availability.label}</span> },
];

export function CompareTable({ all }: { all: Property[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { selected: stored, set } = useCompare();

  const fromUrl = (searchParams.get("ids") ?? "")
    .split(",")
    .filter((s) => all.some((p) => p.slug === s))
    .slice(0, MAX_COMPARE);
  const slugs = fromUrl.length > 0 ? fromUrl : stored;
  const chosen = slugs.map((s) => all.find((p) => p.slug === s)).filter((p): p is Property => Boolean(p));

  // Mantener la selección guardada alineada con un enlace compartido.
  useEffect(() => {
    if (fromUrl.length > 0 && fromUrl.join(",") !== stored.join(",")) set(fromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const update = (next: string[]) => {
    const clean = [...new Set(next.filter(Boolean))].slice(0, MAX_COMPARE);
    set(clean);
    router.replace(clean.length ? `${pathname}?ids=${clean.join(",")}` : pathname, { scroll: false });
  };

  const slotsCount = Math.min(
    MAX_COMPARE,
    Math.max(2, chosen.length + (chosen.length < MAX_COMPARE ? 1 : 0)),
  );
  const slots = Array.from({ length: slotsCount }, (_, i) => chosen[i]?.slug ?? "");

  const bestFor = (row: Row): string | null => {
    if (!row.best || chosen.length < 2) return null;
    const scores = chosen.map((p) => row.best!.score(p));
    const target = row.best.better === "min" ? Math.min(...scores) : Math.max(...scores);
    const winners = chosen.filter((p) => row.best!.score(p) === target);
    return winners.length === 1 ? winners[0].slug : null;
  };

  return (
    <div>
      <div className="grid gap-3 rounded-2xl border border-zf-border bg-white p-4 sm:grid-cols-3 sm:p-5">
        {slots.map((slug, i) => (
          <div key={i}>
            <label htmlFor={`slot-${i}`} className="mb-1.5 block text-sm font-semibold text-zf-navy">
              Propiedad {i + 1}
            </label>
            <select
              id={`slot-${i}`}
              value={slug}
              onChange={(e) => {
                const next = [...slots];
                next[i] = e.target.value;
                update(next);
              }}
              className={inputClasses}
            >
              <option value="">{i < 2 ? "Elegí una propiedad" : "Agregar otra (opcional)"}</option>
              {all.map((p) => (
                <option key={p.slug} value={p.slug} disabled={slots.includes(p.slug) && p.slug !== slug}>
                  {p.neighborhood} · {p.title} · {formatMoney(p.rent.amount, p.rent.currency)}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {chosen.length < 2 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-zf-border bg-zf-surface px-6 py-14 text-center">
          <h2 className="text-xl font-bold text-zf-navy">Elegí al menos dos propiedades</h2>
          <p className="mx-auto mt-2 max-w-lg text-zf-muted">
            Usá los selectores de arriba o tocá «Comparar» en las tarjetas del catálogo. Podés comparar hasta
            tres.
          </p>
          <Link href="/alquileres" className={buttonClasses("secondary", "md", "mt-6")}>
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-zf-border bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left text-[0.95rem]">
            <caption className="sr-only">Comparación de {chosen.length} propiedades</caption>
            <thead>
              <tr>
                <td className="sticky left-0 z-10 w-44 bg-white" />
                {chosen.map((p) => (
                  <th
                    key={p.slug}
                    scope="col"
                    className="min-w-52 border-l border-zf-border p-4 align-top font-normal"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-zf-surface">
                      {p.photos[0] && (
                        <Image src={p.photos[0].src} alt="" fill sizes="300px" className="object-cover" />
                      )}
                    </div>
                    <p className="mt-3 text-sm text-zf-muted">{p.neighborhood}</p>
                    <p className="font-bold leading-snug text-zf-navy">{p.title}</p>
                    <button
                      type="button"
                      onClick={() => update(chosen.filter((c) => c.slug !== p.slug).map((c) => c.slug))}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-zf-muted hover:text-zf-red"
                    >
                      <IconX size={14} /> Quitar
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const winner = bestFor(row);
                return (
                  <tr key={row.label} className="border-t border-zf-border">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-zf-surface px-4 py-3 text-sm font-semibold text-zf-navy"
                    >
                      {row.label}
                    </th>
                    {chosen.map((p) => (
                      <td
                        key={p.slug}
                        className={`border-l border-zf-border px-4 py-3 ${winner === p.slug ? "bg-zf-success-soft" : ""}`}
                      >
                        {row.value(p)}
                        {winner === p.slug && (
                          <span className="ml-2 rounded bg-zf-success px-1.5 py-0.5 text-xs font-bold text-white">
                            {row.best!.tag}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
              <tr className="border-t border-zf-border">
                <td className="sticky left-0 z-10 bg-zf-surface" />
                {chosen.map((p) => (
                  <td key={p.slug} className="border-l border-zf-border p-4">
                    <div className="flex flex-col gap-2">
                      <Link href={`/alquileres/${p.slug}`} className={buttonClasses("outline", "md")}>
                        Ver ficha
                      </Link>
                      <Link href={`/contacto?propiedad=${p.slug}`} className={buttonClasses("primary", "md")}>
                        Consultar
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
