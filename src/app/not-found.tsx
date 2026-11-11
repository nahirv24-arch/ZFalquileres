import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-zf-coral">No encontramos esta página</h1>
      <p className="mt-4 text-lg text-zf-navy">
        Puede que la propiedad ya no esté publicada o que el enlace tenga un error.
      </p>
      <Link
        href="/propiedades"
        className="mt-8 inline-flex min-h-12 items-center rounded-lg bg-zf-coral px-6 font-semibold text-white hover:bg-zf-coral-hover"
      >
        Ver propiedades disponibles
      </Link>
    </section>
  );
}
