import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-zf-border bg-zf-surface text-sm text-zf-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 sm:flex-row sm:justify-between">
        <p>Zavalía &amp; Fuster Propiedades · Córdoba Capital</p>
        <p>
          Sitio institucional:{" "}
          <a
            href="https://www.zfpropiedades.com.ar"
            className="text-zf-navy underline underline-offset-4"
            rel="noopener"
          >
            zfpropiedades.com.ar
          </a>
          {" · "}
          <Link href="/privacidad" className="text-zf-navy underline underline-offset-4">
            Privacidad
          </Link>
        </p>
      </div>
    </footer>
  );
}
