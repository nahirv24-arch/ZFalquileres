import Link from "next/link";
import { CompletenessBar } from "@/components/admin/completeness-bar";
import { completeness } from "@/lib/completeness";
import { formatDate } from "@/lib/format";
import { buttonClasses } from "@/lib/ui";
import { propertyRepository } from "@/services/property-service";

export const metadata = { title: "Resumen" };

export default async function AdminHome() {
  const [properties, inquiries] = await Promise.all([
    propertyRepository.list(),
    propertyRepository.inquiries(),
  ]);
  const scores = properties.map((p) => ({ p, c: completeness(p) }));
  const complete = scores.filter((s) => s.c.percent === 100).length;
  const pending = scores.reduce((acc, s) => acc + s.c.missing.length, 0);
  const newInquiries = inquiries.filter((i) => i.status === "Nueva").length;
  const withPlan = properties.filter((p) => p.plan).length;

  const kpis = [
    { label: "Propiedades publicadas (demo)", value: properties.length },
    { label: "Fichas completas", value: `${complete} de ${properties.length}` },
    { label: "Campos pendientes", value: pending },
    { label: "Consultas nuevas", value: newInquiries },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zf-red">Resumen</h1>
        <p className="mt-1 text-zf-navy">
          Estado de las fichas y consultas. Cifras calculadas sobre los datos de demostración.
        </p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-zf-border bg-white p-5">
            <dt className="text-sm font-semibold text-zf-muted">{k.label}</dt>
            <dd className="mt-1 text-3xl font-bold tabular-nums text-zf-navy">{k.value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="pendientes" className="rounded-2xl border border-zf-border bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id="pendientes" className="text-xl font-bold text-zf-navy">
              Fichas para completar
            </h2>
            <Link href="/admin/propiedades" className="text-sm font-semibold text-zf-red hover:underline">
              Ver todas
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-zf-border">
            {scores
              .sort((a, b) => a.c.percent - b.c.percent)
              .slice(0, 4)
              .map(({ p, c }) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/propiedades/${p.slug}`}
                      className="font-semibold text-zf-navy hover:underline"
                    >
                      {p.title}
                    </Link>
                    <p className="text-sm text-zf-muted">
                      {p.neighborhood} · faltan: {c.missing.slice(0, 2).join(", ")}
                      {c.missing.length > 2 && ` y ${c.missing.length - 2} más`}
                    </p>
                  </div>
                  <CompletenessBar percent={c.percent} />
                </li>
              ))}
          </ul>
        </section>

        <section aria-labelledby="ultimas" className="rounded-2xl border border-zf-border bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id="ultimas" className="text-xl font-bold text-zf-navy">
              Últimas consultas
            </h2>
            <Link href="/admin/consultas" className="text-sm font-semibold text-zf-red hover:underline">
              Ver todas
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-zf-border">
            {inquiries.slice(0, 3).map((i) => (
              <li key={i.id} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-zf-navy">{i.name}</p>
                  <span className="text-xs text-zf-muted">{formatDate(i.createdAt)}</span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-sm text-zf-text">{i.message}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-zf-border bg-white p-6">
        <h2 className="text-xl font-bold text-zf-navy">Actualización del catálogo</h2>
        <p className="mt-2 text-zf-text">
          Fuente: <strong>datos de demostración</strong>. La sincronización con el catálogo autorizado de ZF
          se configura en la Etapa B. {withPlan} de {properties.length} propiedades tienen plano cargado.
        </p>
        <p className="mt-3">
          <Link href="/admin/propiedades" className={buttonClasses("secondary", "md")}>
            Gestionar fichas
          </Link>
        </p>
      </section>
    </div>
  );
}
