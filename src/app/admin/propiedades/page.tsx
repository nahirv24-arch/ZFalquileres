import Image from "next/image";
import Link from "next/link";
import { CompletenessBar } from "@/components/admin/completeness-bar";
import { completeness } from "@/lib/completeness";
import { formatMoney } from "@/lib/format";
import { propertyRepository } from "@/services/property-service";

export const metadata = { title: "Propiedades" };

export default async function AdminProperties() {
  const properties = await propertyRepository.list();
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-zf-red">Propiedades</h1>
      <p className="mt-1 text-zf-navy">Estado de las fichas enriquecidas y campos pendientes de completar.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-zf-border bg-white">
        <table className="w-full min-w-[820px] text-left text-[0.95rem]">
          <thead className="bg-zf-navy text-white">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Propiedad
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Precio
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Ficha
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Pendiente
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Estado
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => {
              const c = completeness(p);
              return (
                <tr key={p.id} className="border-t border-zf-border align-top">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.photos[0] && (
                        <Image
                          src={p.photos[0].src}
                          alt=""
                          width={64}
                          height={44}
                          className="h-11 w-16 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-zf-navy">{p.title}</p>
                        <p className="text-sm text-zf-muted">
                          {p.neighborhood} · {p.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{formatMoney(p.rent.amount, p.rent.currency)}</td>
                  <td className="px-4 py-3">
                    <CompletenessBar percent={c.percent} />
                    <p className="mt-1 text-xs text-zf-muted">
                      {c.done} de {c.total} requisitos
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <ul className="flex max-w-xs flex-wrap gap-1">
                      {c.missing.map((m) => (
                        <li
                          key={m}
                          className="rounded bg-zf-warning-soft px-1.5 py-0.5 text-xs font-semibold text-zf-warning"
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-zf-success-soft px-2 py-0.5 text-xs font-bold text-zf-success">
                      Publicada (demo)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/propiedades/${p.slug}`}
                      className="inline-flex min-h-10 items-center rounded-lg border border-zf-navy px-3 text-sm font-semibold text-zf-navy hover:bg-zf-navy-soft"
                    >
                      Editar ficha<span className="sr-only"> de {p.title}</span>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
