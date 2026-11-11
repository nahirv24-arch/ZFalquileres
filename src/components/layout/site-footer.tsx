import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-zf-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image
            src="/brand/zf-logo-blanco.png"
            alt="ZF Propiedades"
            width={118}
            height={85}
            className="h-16 w-auto"
          />
          <p className="mt-4 max-w-sm text-sm text-white/85">
            ZF Alquiler Digital es un servicio de Zavalía &amp; Fuster Propiedades para conocer alquileres en
            Córdoba Capital sin viajar.
          </p>
        </div>
        <nav aria-label="Secciones">
          <h2 className="text-sm font-bold tracking-wide text-white">Secciones</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li>
              <Link className="hover:text-white hover:underline" href="/alquileres">
                Alquileres
              </Link>
            </li>
            <li>
              <Link className="hover:text-white hover:underline" href="/comparar">
                Comparar propiedades
              </Link>
            </li>
            <li>
              <Link className="hover:text-white hover:underline" href="/como-funciona">
                Cómo funciona
              </Link>
            </li>
            <li>
              <Link className="hover:text-white hover:underline" href="/mudanza">
                Servicios y mudanza
              </Link>
            </li>
            <li>
              <Link className="hover:text-white hover:underline" href="/contacto">
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-bold tracking-wide text-white">Zavalía &amp; Fuster</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li>
              <a
                className="hover:text-white hover:underline"
                href="https://www.zfpropiedades.com.ar"
                rel="noopener"
              >
                Sitio institucional
              </a>
            </li>
            <li>
              <Link className="hover:text-white hover:underline" href="/privacidad">
                Aviso de privacidad
              </Link>
            </li>
            <li>
              <Link className="hover:text-white hover:underline" href="/admin">
                Panel ZF (demostración)
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-white/75 sm:px-6">
          Versión de demostración. Las propiedades, precios, medidas y fotos son ficticios o ilustrativos y no
          constituyen ofertas reales.
        </p>
      </div>
    </footer>
  );
}
