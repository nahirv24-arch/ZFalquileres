import type { Metadata } from "next";
import Link from "next/link";
import { HowItWorksSteps } from "@/components/how-it-works";
import { IconCheck, IconX } from "@/components/ui/icons";
import { buttonClasses } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Cómo funciona",
  description: "Cómo conocer y consultar alquileres de ZF a distancia.",
};

const DOES = [
  "Muestra fotos, plano y medidas por ambiente de cada propiedad.",
  "Separa alquiler, expensas y otros costos, indicando qué es estimado.",
  "Permite comparar hasta tres propiedades lado a lado.",
  "Envía tu consulta a un agente de ZF, que te responde personalmente.",
  "Explica qué servicios tiene cada inmueble y cómo cambiar la titularidad.",
];

const DOESNT = [
  "No reserva propiedades ni cobra señas.",
  "No evalúa inquilinos ni aprueba solicitudes de forma automática.",
  "No pide documentación personal por este medio.",
  "No firma contratos en línea.",
];

const FAQ = [
  {
    q: "¿Las medidas de los ambientes son exactas?",
    a: "En la versión final, cada medida indica quién la tomó y cuándo, y si está verificada o es estimada. En esta demostración son valores de ejemplo.",
  },
  {
    q: "¿Puedo alquilar sin viajar a Córdoba?",
    a: "Podés conocer la propiedad, comparar y consultar a distancia. La firma del contrato y la entrega de llaves se coordinan con ZF según cada caso.",
  },
  {
    q: "¿Qué pasa cuando envío una consulta?",
    a: "La recibe el equipo de ZF y un agente te responde por correo o teléfono. Enviar una consulta no reserva la propiedad.",
  },
  {
    q: "¿Qué es el recorrido 3D?",
    a: "Cuando ZF carga un modelo o recorrido real, aparece el botón «Ver modelo 3D» en la ficha. Si no existe, la ficha lo indica claramente.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <h1 className="text-3xl font-extrabold tracking-tight text-zf-red sm:text-4xl">Cómo funciona</h1>
      <p className="mt-2 max-w-3xl text-lg text-zf-navy">
        ZF Alquiler Digital te ayuda a decidir desde donde estés, con información clara sobre cada propiedad
        administrada por Zavalía &amp; Fuster.
      </p>

      <div className="mt-10">
        <HowItWorksSteps />
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="hace" className="rounded-2xl border border-zf-border bg-white p-6 sm:p-8">
          <h2 id="hace" className="text-2xl font-bold text-zf-navy">
            Qué hace la plataforma
          </h2>
          <ul className="mt-5 space-y-3">
            {DOES.map((d) => (
              <li key={d} className="flex gap-3 text-zf-text">
                <IconCheck size={22} className="shrink-0 text-zf-success" />
                {d}
              </li>
            ))}
          </ul>
        </section>
        <section
          aria-labelledby="no-hace"
          className="rounded-2xl border border-zf-border bg-zf-surface p-6 sm:p-8"
        >
          <h2 id="no-hace" className="text-2xl font-bold text-zf-navy">
            Qué no hace
          </h2>
          <ul className="mt-5 space-y-3">
            {DOESNT.map((d) => (
              <li key={d} className="flex gap-3 text-zf-text">
                <IconX size={22} className="shrink-0 text-zf-red" />
                {d}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="faq" className="mt-14">
        <h2 id="faq" className="text-2xl font-bold text-zf-red">
          Preguntas frecuentes
        </h2>
        <div className="mt-6 divide-y divide-zf-border rounded-2xl border border-zf-border bg-white">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-5 py-4 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-zf-navy">
                {f.q}
                <span
                  aria-hidden="true"
                  className="text-2xl leading-none text-zf-red transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-zf-text">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/alquileres" className={buttonClasses("primary", "lg")}>
          Ver propiedades
        </Link>
        <Link href="/contacto" className={buttonClasses("outline", "lg")}>
          Hacer una consulta
        </Link>
      </div>
    </div>
  );
}
