import type { Metadata } from "next";
import Link from "next/link";
import { IconCheck, IconExternal, IconInfo } from "@/components/ui/icons";
import { MOVING_TIPS, SERVICE_GUIDES } from "@/data/demo/service-guides";
import { formatDate } from "@/lib/format";
import { buttonClasses } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Servicios y mudanza",
  description: "Cómo funcionan la luz, el gas y el agua en Córdoba Capital y qué revisar antes de mudarte.",
};

export default function MovingPage() {
  return (
    <div>
      <section className="bg-zf-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <h1 className="text-3xl font-extrabold tracking-tight text-zf-red sm:text-4xl">
            Servicios y mudanza
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-zf-navy">
            Una guía para instalarte en Córdoba Capital: quién presta cada servicio, cuándo hace falta el
            cambio de titularidad y qué documentación suelen pedir.
          </p>
          <p className="mt-6 flex max-w-3xl items-start gap-2 rounded-lg border border-zf-border bg-white px-4 py-3 text-sm text-zf-text">
            <IconInfo size={20} className="mt-0.5 shrink-0 text-zf-navy" />
            <span>
              Información orientativa. Los requisitos los define cada prestador y pueden cambiar: confirmalos
              siempre en el sitio oficial. ZF no realiza estos trámites salvo que se acuerde expresamente.
            </span>
          </p>
          <nav aria-label="Servicios" className="mt-6 flex flex-wrap gap-2">
            {SERVICE_GUIDES.map((g) => (
              <a key={g.id} href={`#${g.id}`} className={buttonClasses("outline", "md")}>
                {g.service}
              </a>
            ))}
            <a href="#antes-de-mudarte" className={buttonClasses("outline", "md")}>
              Antes de mudarte
            </a>
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6">
        {SERVICE_GUIDES.map((g) => (
          <section
            key={g.id}
            id={g.id}
            aria-labelledby={`${g.id}-t`}
            className="scroll-mt-28 rounded-2xl border border-zf-border bg-white p-5 sm:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="border-l-4 border-zf-red pl-4">
                <p className="text-sm font-semibold text-zf-muted">{g.service}</p>
                <h2 id={`${g.id}-t`} className="text-2xl font-bold text-zf-navy">
                  {g.provider}
                </h2>
              </div>
              <a
                href={g.officialUrl}
                target="_blank"
                rel="noopener"
                className={buttonClasses("secondary", "md")}
              >
                Sitio oficial de {g.provider} <IconExternal size={16} />
              </a>
            </div>
            <p className="mt-4 max-w-4xl text-zf-text">{g.summary}</p>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <div className="rounded-xl bg-zf-surface p-5">
                <h3 className="font-bold text-zf-navy">¿Cuándo hace falta?</h3>
                <p className="mt-2 text-[0.95rem] text-zf-text">{g.whenNeeded}</p>
              </div>
              <div className="rounded-xl bg-zf-surface p-5">
                <h3 className="font-bold text-zf-navy">Documentación habitual</h3>
                <ul className="mt-2 space-y-2 text-[0.95rem] text-zf-text">
                  {g.usualDocuments.map((d) => (
                    <li key={d} className="flex gap-2">
                      <IconCheck size={18} className="mt-0.5 shrink-0 text-zf-success" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-zf-surface p-5">
                <h3 className="font-bold text-zf-navy">Pasos sugeridos</h3>
                <ol className="mt-2 space-y-2 text-[0.95rem] text-zf-text">
                  {g.steps.map((s, i) => (
                    <li key={s} className="flex gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zf-navy text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <p className="mt-4 text-xs text-zf-muted">
              Última revisión: {formatDate(g.reviewedAt)} · Responsable editorial: a definir por ZF.
            </p>
          </section>
        ))}

        <section id="antes-de-mudarte" aria-labelledby="tips-t" className="scroll-mt-28">
          <h2 id="tips-t" className="text-2xl font-bold text-zf-red">
            Antes de mudarte
          </h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MOVING_TIPS.map((t) => (
              <li key={t.title} className="rounded-xl border border-zf-border bg-white p-6">
                <h3 className="text-lg font-bold text-zf-navy">{t.title}</h3>
                <p className="mt-2 text-[0.95rem] text-zf-muted">{t.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-zf-navy p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-xl font-bold">¿Tenés una duda sobre un inmueble en particular?</h2>
            <p className="mt-1 text-white/90">Cada ficha indica qué servicios tiene y quién los paga.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/alquileres"
              className="inline-flex min-h-12 items-center rounded-lg bg-white px-6 font-semibold text-zf-navy hover:bg-zf-navy-soft"
            >
              Ver propiedades
            </Link>
            <Link href="/contacto" className={buttonClasses("primary", "lg")}>
              Consultar a ZF
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
