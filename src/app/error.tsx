"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16" role="alert">
      <h1 className="text-3xl font-bold text-zf-coral">Algo salió mal</h1>
      <p className="mt-4 text-lg text-zf-navy">
        No pudimos cargar esta sección. Probá de nuevo en unos segundos.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex min-h-12 items-center rounded-lg bg-zf-coral px-6 font-semibold text-white hover:bg-zf-coral-hover"
      >
        Reintentar
      </button>
    </section>
  );
}
