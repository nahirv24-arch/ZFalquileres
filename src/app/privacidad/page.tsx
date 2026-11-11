import type { Metadata } from "next";

export const metadata: Metadata = { title: "Aviso de privacidad" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-zf-red sm:text-4xl">Aviso de privacidad</h1>
      <p
        role="status"
        className="mt-6 rounded-lg bg-zf-warning-soft px-4 py-3 text-sm font-semibold text-zf-warning"
      >
        Borrador para la demostración. El texto legal definitivo está pendiente de aprobación por ZF (decisión
        D-05).
      </p>
      <div className="mt-8 space-y-6 text-zf-text">
        <section>
          <h2 className="text-xl font-bold text-zf-navy">Principios que va a seguir la plataforma</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Pedir solo los datos necesarios para responder una consulta: nombre, contacto y mensaje.</li>
            <li>Usarlos únicamente para responder esa consulta.</li>
            <li>No pedir documentación personal por este medio.</li>
            <li>Conservar los datos por un plazo definido y limitado.</li>
            <li>Tratar los datos conforme a la normativa argentina aplicable.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold text-zf-navy">En esta demostración</h2>
          <p className="mt-3">
            El formulario de contacto valida los datos en tu navegador pero no los envía ni los guarda. La
            selección del comparador se guarda solo en tu navegador.
          </p>
        </section>
      </div>
    </div>
  );
}
