import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CompletenessBar } from "@/components/admin/completeness-bar";
import { MeasurementsEditor } from "@/components/admin/measurements-editor";
import { MediaManager } from "@/components/admin/media-manager";
import { IconCheck, IconChevronLeft, IconExternal, IconX } from "@/components/ui/icons";
import { COMPLETENESS_CHECKS, completeness } from "@/lib/completeness";
import { formatArea, formatDate } from "@/lib/format";
import { propertyRepository } from "@/services/property-service";

export async function generateStaticParams() {
  const all = await propertyRepository.list();
  return all.map((p) => ({ slug: p.slug }));
}

export const metadata = { title: "Editar ficha" };

export default function AdminPropertyPage({ params }: PageProps<"/admin/propiedades/[slug]">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-white" aria-hidden="true" />}>
      <Editor params={params} />
    </Suspense>
  );
}

function Card({
  id,
  title,
  children,
  aside,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="rounded-2xl border border-zf-border bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={id} className="text-xl font-bold text-zf-navy">
          {title}
        </h2>
        {aside}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

async function Editor({ params }: { params: PageProps<"/admin/propiedades/[slug]">["params"] }) {
  const { slug } = await params;
  const p = await propertyRepository.getBySlug(slug);
  if (!p) notFound();
  const c = completeness(p);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/propiedades"
          className="inline-flex items-center gap-1 text-sm font-semibold text-zf-navy hover:underline"
        >
          <IconChevronLeft size={16} /> Propiedades
        </Link>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-zf-red sm:text-3xl">{p.title}</h1>
            <p className="text-zf-navy">
              {p.neighborhood} · {p.id} · origen: datos de demostración
            </p>
          </div>
          <Link
            href={`/alquileres/${p.slug}`}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border-2 border-zf-navy px-4 font-semibold text-zf-navy hover:bg-zf-navy-soft"
          >
            Ver ficha pública <IconExternal size={16} />
          </Link>
        </div>
      </div>

      <Card
        id="estado"
        title="Estado de la ficha enriquecida"
        aside={<CompletenessBar percent={c.percent} />}
      >
        <ul className="grid gap-2 sm:grid-cols-2">
          {COMPLETENESS_CHECKS.map((check) => {
            const ok = check.ok(p);
            return (
              <li key={check.id} className="flex items-center gap-2 text-[0.95rem]">
                {ok ? (
                  <IconCheck size={18} className="text-zf-success" />
                ) : (
                  <IconX size={18} className="text-zf-red" />
                )}
                <span className={ok ? "text-zf-text" : "font-semibold text-zf-red-dark"}>{check.label}</span>
                <span className="sr-only">{ok ? "completo" : "pendiente"}</span>
              </li>
            );
          })}
        </ul>
      </Card>

      {p.plan ? (
        <Card
          id="medidas"
          title="Medidas por ambiente"
          aside={
            <span className="text-sm text-zf-muted">
              Fuente: {p.plan.measuredBy} · {formatDate(p.plan.measuredAt)}
            </span>
          }
        >
          <MeasurementsEditor rooms={p.plan.rooms} verification={p.plan.verification} />
        </Card>
      ) : (
        <Card id="medidas" title="Medidas por ambiente">
          <p className="text-zf-muted">Sin plano cargado.</p>
        </Card>
      )}

      <Card id="fotos" title="Fotografías">
        <MediaManager photos={p.photos} />
      </Card>

      <Card id="plano" title="Plano y recorrido 3D">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-zf-surface p-4">
            <dt className="text-sm text-zf-muted">Plano interactivo</dt>
            <dd className="mt-1 font-bold text-zf-navy">
              {p.plan
                ? `${p.plan.rooms.length} ambientes · ${formatArea(p.plan.coveredArea + p.plan.semiCoveredArea)}`
                : "Sin plano"}
            </dd>
          </div>
          <div className="rounded-xl bg-zf-surface p-4">
            <dt className="text-sm text-zf-muted">Recorrido 3D</dt>
            <dd className="mt-1 font-bold text-zf-navy">{p.tour3dUrl ? "Cargado" : "No disponible"}</dd>
          </div>
          <div className="rounded-xl bg-zf-surface p-4">
            <dt className="text-sm text-zf-muted">Video</dt>
            <dd className="mt-1 font-bold text-zf-navy">{p.videoUrl ? "Cargado" : "No disponible"}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-zf-muted">
          La carga de planos, videos y modelos 3D se habilita en la Etapa B, con almacenamiento y permisos
          reales.
        </p>
      </Card>
    </div>
  );
}
