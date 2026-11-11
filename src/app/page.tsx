import Link from "next/link";

const STEPS = [
  {
    title: "Mirá la propiedad en detalle",
    text: "Fotos, videos y medidas de cada ambiente, para saber si entran tus muebles.",
  },
  {
    title: "Conocé todos los costos",
    text: "Alquiler, expensas y otros conceptos por separado, indicando qué es estimado y qué está confirmado.",
  },
  {
    title: "Consultá o postulate en línea",
    text: "Un formulario corto, por pasos. Un equipo de ZF revisa cada solicitud.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="bg-zf-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <h1 className="max-w-2xl text-3xl font-bold leading-tight text-zf-coral sm:text-4xl">
            Alquilá en Córdoba sin viajar para conocer cada propiedad
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zf-navy">
            Propiedades administradas por Zavalía &amp; Fuster, con información clara y verificable para
            decidir a distancia.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/propiedades"
              className="inline-flex min-h-12 items-center rounded-lg bg-zf-coral px-6 text-base font-semibold text-white hover:bg-zf-coral-hover"
            >
              Ver propiedades
            </Link>
            <Link
              href="/como-funciona"
              className="inline-flex min-h-12 items-center rounded-lg border-2 border-zf-navy px-6 text-base font-semibold text-zf-navy hover:bg-white"
            >
              Cómo funciona
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12" aria-labelledby="pasos">
        <h2 id="pasos" className="text-2xl font-bold text-zf-navy">
          Cómo te ayudamos
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rounded-xl border border-zf-border p-5">
              <span className="text-sm font-semibold text-zf-coral">Paso {i + 1}</span>
              <h3 className="mt-1 text-lg font-semibold text-zf-navy">{s.title}</h3>
              <p className="mt-2 text-zf-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
