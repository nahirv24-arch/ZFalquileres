import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact/contact-form";
import { propertyRepository, toSummary } from "@/services/property-service";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Consultá por una propiedad o por el servicio de alquiler a distancia de ZF.",
};

const STEPS = [
  "Completás el formulario con tu consulta.",
  "Un agente de ZF la recibe y te responde por correo o teléfono.",
  "Si te interesa, coordinan una videollamada o una visita.",
];

export default async function ContactPage() {
  const properties = (await propertyRepository.list()).map(toSummary);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zf-red sm:text-4xl">Hacé tu consulta</h1>
          <p className="mt-2 text-lg text-zf-navy">
            Escribinos sobre una propiedad o sobre cómo alquilar a distancia.
          </p>
          <div className="mt-8">
            <Suspense
              fallback={<div className="h-96 animate-pulse rounded-2xl bg-zf-surface" aria-hidden="true" />}
            >
              <ContactForm properties={properties} />
            </Suspense>
          </div>
        </div>
        <aside className="space-y-6 lg:pt-24">
          <div className="rounded-2xl bg-zf-surface p-6">
            <h2 className="text-lg font-bold text-zf-navy">¿Qué pasa después?</h2>
            <ol className="mt-4 space-y-4">
              {STEPS.map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zf-navy text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-zf-text">{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-zf-border p-6">
            <h2 className="text-lg font-bold text-zf-navy">Importante</h2>
            <p className="mt-2 text-sm text-zf-text">
              La consulta no reserva la propiedad ni inicia una evaluación. ZF revisa cada caso de forma
              personal y no pide documentación por este medio.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
