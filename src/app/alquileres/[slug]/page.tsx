import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PlanExplorer } from "@/components/plan/plan-explorer";
import { CompareToggle } from "@/components/property/compare-toggle";
import { Gallery } from "@/components/property/gallery";
import {
  IconArea,
  IconBalcony,
  IconBath,
  IconBed,
  IconChevronRight,
  IconExternal,
  IconPin,
} from "@/components/ui/icons";
import { formatArea, formatMoney, NOT_INFORMED, roomsLabel } from "@/lib/format";
import { buttonClasses } from "@/lib/ui";
import { propertyRepository } from "@/services/property-service";

export async function generateStaticParams() {
  const all = await propertyRepository.list();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/alquileres/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await propertyRepository.getBySlug(slug);
  if (!p) return {};
  return {
    title: `${p.title} en ${p.neighborhood}`,
    description: `${p.title} en ${p.neighborhood}. ${formatMoney(p.rent.amount, p.rent.currency)} por mes. Plano con medidas por ambiente.`,
    openGraph: { images: p.photos[0] ? [p.photos[0].src] : [] },
  };
}

const SECTIONS = [
  { id: "descripcion", label: "Descripción" },
  { id: "plano-y-medidas", label: "Plano y medidas" },
  { id: "recorrido-3d", label: "Recorrido 3D" },
  { id: "costos", label: "Costos" },
  { id: "ubicacion", label: "Ubicación" },
  { id: "servicios", label: "Servicios y mudanza" },
];

function SectionTitle({ id, title, subtitle }: { id: string; title: string; subtitle?: string }) {
  return (
    <div className="border-l-4 border-zf-red pl-4">
      <h2 id={id} className="text-2xl font-bold text-zf-navy sm:text-[1.7rem]">
        {title}
      </h2>
      {subtitle && <p className="mt-1 text-zf-muted">{subtitle}</p>}
    </div>
  );
}

function PropertySkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6" aria-hidden="true">
      <div className="h-4 w-64 animate-pulse rounded bg-zf-surface" />
      <div className="mt-5 grid gap-8 lg:grid-cols-[1.45fr_1fr]">
        <div className="aspect-[16/10] animate-pulse rounded-2xl bg-zf-surface" />
        <div className="space-y-4">
          <div className="h-10 animate-pulse rounded bg-zf-surface" />
          <div className="h-12 w-1/2 animate-pulse rounded bg-zf-surface" />
          <div className="h-28 animate-pulse rounded bg-zf-surface" />
        </div>
      </div>
    </div>
  );
}

export default function PropertyPage({ params }: PageProps<"/alquileres/[slug]">) {
  return (
    <Suspense fallback={<PropertySkeleton />}>
      <PropertyContent params={params} />
    </Suspense>
  );
}

async function PropertyContent({ params }: { params: PageProps<"/alquileres/[slug]">["params"] }) {
  const { slug } = await params;
  const p = await propertyRepository.getBySlug(slug);
  if (!p) notFound();
  const neighborhoodInfo = await propertyRepository.neighborhoodInfo(p.neighborhood);

  const { lat, lng } = p.approxLocation;
  const bbox = [lng - 0.012, lat - 0.007, lng + 0.012, lat + 0.007].map((n) => n.toFixed(4)).join("%2C");
  const contactHref = `/contacto?propiedad=${p.slug}`;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6">
      <nav aria-label="Ruta de navegación" className="text-sm text-zf-muted">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/alquileres" className="hover:text-zf-navy hover:underline">
              Alquileres
            </Link>
          </li>
          <li aria-hidden="true">
            <IconChevronRight size={14} />
          </li>
          <li>
            <Link
              href={`/alquileres?barrio=${encodeURIComponent(p.neighborhood)}`}
              className="hover:text-zf-navy hover:underline"
            >
              {p.neighborhood}
            </Link>
          </li>
          <li aria-hidden="true">
            <IconChevronRight size={14} />
          </li>
          <li aria-current="page" className="text-zf-text">
            {p.title}
          </li>
        </ol>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.45fr_1fr]">
        <Gallery photos={p.photos} title={p.title} />

        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-zf-red px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
              Alquiler
            </span>
            <span className="rounded-md bg-zf-warning-soft px-2 py-0.5 text-xs font-bold text-zf-warning">
              {p.availability.label}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-zf-navy sm:text-[2.1rem]">
            {p.title} en {p.neighborhood}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-zf-text">
            <IconPin size={18} className="shrink-0 text-zf-navy" />
            {p.addressDisplay}
          </p>
          <p className="mt-5 flex flex-wrap items-baseline gap-x-2">
            <span className="text-4xl font-extrabold text-zf-red">
              {formatMoney(p.rent.amount, p.rent.currency)}
            </span>
            <span className="text-lg font-semibold text-zf-red">/ mes</span>
          </p>
          <p className="mt-1 text-zf-muted">
            {p.expenses
              ? `Expensas estimadas: ${formatMoney(p.expenses.amount, p.expenses.currency)} por mes`
              : "Sin expensas"}
          </p>

          <ul className="mt-6 grid grid-cols-4 divide-x divide-zf-border border-y border-zf-border py-4 text-center">
            <li className="flex flex-col items-center gap-1 px-1">
              <IconBed size={26} className="text-zf-navy" />
              <span className="text-lg font-bold text-zf-navy">{p.bedrooms === 0 ? "—" : p.bedrooms}</span>
              <span className="text-xs text-zf-muted sm:text-sm">
                {p.bedrooms === 0 ? "Monoambiente" : p.bedrooms === 1 ? "Dormitorio" : "Dormitorios"}
              </span>
            </li>
            <li className="flex flex-col items-center gap-1 px-1">
              <IconBath size={26} className="text-zf-navy" />
              <span className="text-lg font-bold text-zf-navy">{p.bathrooms}</span>
              <span className="text-xs text-zf-muted sm:text-sm">{p.bathrooms === 1 ? "Baño" : "Baños"}</span>
            </li>
            <li className="flex flex-col items-center gap-1 px-1">
              <IconArea size={26} className="text-zf-navy" />
              <span className="text-lg font-bold text-zf-navy">{formatArea(p.totalArea)}</span>
              <span className="text-xs text-zf-muted sm:text-sm">Totales</span>
            </li>
            <li className="flex flex-col items-center gap-1 px-1">
              <IconBalcony size={26} className="text-zf-navy" />
              <span className="text-lg font-bold text-zf-navy">{p.hasBalcony ? "Sí" : "No"}</span>
              <span className="text-xs text-zf-muted sm:text-sm">Balcón</span>
            </li>
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={contactHref} className={buttonClasses("primary", "lg", "flex-1")}>
              Consultar por esta propiedad
            </Link>
            <CompareToggle slug={p.slug} title={p.title} variant="detail" />
          </div>
          <p className="mt-3 text-sm text-zf-muted">
            Te responde un agente de ZF. La consulta no reserva la propiedad ni inicia una evaluación.
          </p>
        </div>
      </div>

      <nav
        aria-label="Secciones de la ficha"
        className="sticky top-[72px] z-20 -mx-4 mt-10 overflow-x-auto border-b border-zf-border bg-white/95 px-4 backdrop-blur sm:-mx-6 sm:px-6"
      >
        <ul className="flex min-w-max gap-6">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="inline-flex min-h-12 items-center border-b-[3px] border-transparent text-[0.95rem] font-semibold text-zf-navy hover:border-zf-red hover:text-zf-red"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8 space-y-8">
        <section
          id="descripcion"
          aria-labelledby="descripcion-t"
          className="scroll-mt-32 rounded-2xl border border-zf-border bg-white p-5 sm:p-8"
        >
          <SectionTitle id="descripcion-t" title="Descripción" />
          <div className="mt-5 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="text-lg leading-relaxed text-zf-text">{p.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Características">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="rounded-full bg-zf-navy-soft px-3 py-1 text-sm font-semibold text-zf-navy"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <dl className="divide-y divide-zf-border rounded-xl bg-zf-surface px-5">
              {[
                ["Tipo", p.type],
                ["Ambientes", roomsLabel(p.rooms)],
                ["Piso", p.floor],
                ["Orientación", p.orientation],
                [
                  "Mascotas",
                  p.petsAllowed === null ? NOT_INFORMED : p.petsAllowed ? "Se aceptan" : "No se aceptan",
                ],
                ["Disponibilidad", p.availability.label],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-3">
                  <dt className="text-zf-muted">{k}</dt>
                  <dd
                    className={`text-right font-semibold ${v === NOT_INFORMED ? "italic text-zf-muted" : "text-zf-navy"}`}
                  >
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {p.plan ? (
          <PlanExplorer plan={p.plan} orientation={p.orientation} tour3dUrl={p.tour3dUrl} />
        ) : (
          <section
            id="plano-y-medidas"
            className="scroll-mt-32 rounded-2xl border border-zf-border bg-white p-8"
          >
            <SectionTitle id="plano-t" title="Plano y medidas" />
            <p className="mt-4 text-zf-muted">Plano no disponible para esta propiedad.</p>
          </section>
        )}

        <section
          id="costos"
          aria-labelledby="costos-t"
          className="scroll-mt-32 rounded-2xl border border-zf-border bg-white p-5 sm:p-8"
        >
          <SectionTitle
            id="costos-t"
            title="Costos"
            subtitle="Todos los conceptos declarados, separados y con su naturaleza."
          />
          <div
            className="mt-5 overflow-x-auto rounded-xl border border-zf-border"
            role="region"
            aria-label="Tabla de costos (desplazable)"
            tabIndex={0}
          >
            <table className="w-full min-w-[520px] text-left text-[0.95rem]">
              <thead className="bg-zf-surface text-zf-navy">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Concepto
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Importe
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Tipo
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Nota
                  </th>
                </tr>
              </thead>
              <tbody>
                {p.costs.map((c) => (
                  <tr key={c.label} className="border-t border-zf-border">
                    <th scope="row" className="px-4 py-3 font-semibold text-zf-navy">
                      {c.label}
                    </th>
                    <td className="px-4 py-3 tabular-nums">
                      {c.amount === null ? "A confirmar" : formatMoney(c.amount, c.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                          c.kind === "confirmado"
                            ? "bg-zf-success-soft text-zf-success"
                            : "bg-zf-warning-soft text-zf-warning"
                        }`}
                      >
                        {c.kind === "confirmado" ? "Confirmado" : "Estimado"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zf-muted">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-zf-muted">
            Valores de ejemplo en pesos argentinos. Los importes estimados no son cargos definitivos.
          </p>
        </section>

        <section
          id="ubicacion"
          aria-labelledby="ubicacion-t"
          className="scroll-mt-32 rounded-2xl border border-zf-border bg-white p-5 sm:p-8"
        >
          <SectionTitle
            id="ubicacion-t"
            title="Ubicación"
            subtitle="Mostramos la zona aproximada; la dirección exacta la informa ZF."
          />
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="overflow-hidden rounded-xl border border-zf-border">
              <iframe
                title={`Mapa aproximado de ${p.neighborhood}`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`}
                loading="lazy"
                className="h-80 w-full"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zf-navy">{p.neighborhood}</h3>
              <p className="mt-2 text-zf-text">{neighborhoodInfo ?? NOT_INFORMED}</p>
              <a
                href={`https://www.openstreetmap.org/#map=15/${lat}/${lng}`}
                target="_blank"
                rel="noopener"
                className="mt-4 inline-flex items-center gap-1.5 font-semibold text-zf-navy hover:underline"
              >
                Abrir mapa más grande <IconExternal size={16} />
              </a>
              <p className="mt-4 text-xs text-zf-muted">Mapa © colaboradores de OpenStreetMap.</p>
            </div>
          </div>
        </section>

        <section
          id="servicios"
          aria-labelledby="servicios-t"
          className="scroll-mt-32 rounded-2xl border border-zf-border bg-white p-5 sm:p-8"
        >
          <SectionTitle
            id="servicios-t"
            title="Servicios y mudanza"
            subtitle="Qué servicios tiene el inmueble y quién los gestiona."
          />
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {p.services.map((s) => (
              <li key={s.service} className="rounded-xl border border-zf-border p-5">
                <p className="text-sm font-semibold text-zf-muted">{s.service}</p>
                <p className="mt-1 text-lg font-bold text-zf-navy">{s.provider}</p>
                <dl className="mt-3 space-y-1 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-zf-muted">Paga</dt>
                    <dd className="font-semibold text-zf-text">{s.payer}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-zf-muted">Cambio de titularidad</dt>
                    <dd className="font-semibold text-zf-text">{s.ownershipChange}</dd>
                  </div>
                </dl>
                <Link
                  href={`/mudanza#${s.guideId}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-zf-red hover:underline"
                >
                  Ver guía de {s.service.toLowerCase()} <IconChevronRight size={16} />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-zf-muted">
            Información orientativa. ZF no realiza los trámites ante los prestadores salvo que se acuerde
            expresamente.
          </p>
        </section>

        <section className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-zf-navy p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-xl font-bold">¿Te interesa esta propiedad?</h2>
            <p className="mt-1 text-white/90">
              Escribile a ZF y un agente te responde por correo o teléfono.
            </p>
          </div>
          <Link href={contactHref} className={buttonClasses("primary", "lg")}>
            Consultar por esta propiedad
          </Link>
        </section>
      </div>
    </div>
  );
}
