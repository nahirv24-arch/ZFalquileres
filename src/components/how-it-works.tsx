export const HOW_IT_WORKS = [
  {
    title: "Explorá a distancia",
    text: "Filtrá por barrio, ambientes y presupuesto. Cada ficha tiene fotos, costos detallados y la ubicación aproximada.",
  },
  {
    title: "Revisá plano y medidas",
    text: "Tocá cada ambiente del plano para ver largo, ancho y alto. Así sabés si entran tus muebles antes de viajar.",
  },
  {
    title: "Compará y consultá",
    text: "Compará hasta tres propiedades y escribile a ZF. Un agente responde tu consulta: no hay evaluaciones automáticas.",
  },
  {
    title: "Prepará tu mudanza",
    text: "Consultá qué servicios tiene el inmueble y cómo se gestiona el cambio de titularidad de luz, gas y agua.",
  },
] as const;

export function HowItWorksSteps({ limit }: { limit?: number }) {
  const steps = limit ? HOW_IT_WORKS.slice(0, limit) : HOW_IT_WORKS;
  return (
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <li key={s.title} className="rounded-xl border border-zf-border bg-white p-6">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-zf-red-soft text-base font-bold text-zf-red"
          >
            {i + 1}
          </span>
          <h3 className="mt-4 text-lg font-bold text-zf-navy">
            <span className="sr-only">Paso {i + 1}: </span>
            {s.title}
          </h3>
          <p className="mt-2 text-[0.95rem] text-zf-muted">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
