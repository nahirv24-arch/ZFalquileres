import Image from "next/image";
import Link from "next/link";
import { HowItWorksSteps } from "@/components/how-it-works";
import { PropertyCard } from "@/components/property/property-card";
import { HeroSearch } from "@/components/search/hero-search";
import { IconChevronRight } from "@/components/ui/icons";
import { buttonClasses } from "@/lib/ui";
import { propertyRepository } from "@/services/property-service";

export default async function HomePage() {
  const [neighborhoods, latest] = await Promise.all([
    propertyRepository.neighborhoods(),
    propertyRepository.list({}, "recientes"),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-y-0 right-0 hidden w-[52%] lg:block">
          <Image
            src="/demo/photos/ref-balcon.jpg"
            alt=""
            fill
            priority
            sizes="52vw"
            className="object-cover"
          />
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 lg:pb-24 lg:pt-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-zf-red sm:text-5xl lg:text-[3.6rem]">
              Alquilá tu próximo departamento a distancia
            </h1>
            <p className="mt-6 max-w-xl text-lg text-zf-text sm:text-xl">
              Explorá propiedades administradas por Zavalía &amp; Fuster, recorré cada ambiente con su plano y
              sus medidas, y consultá sin viajar a Córdoba.
            </p>
          </div>
          <div className="mt-10 max-w-4xl">
            <HeroSearch neighborhoods={neighborhoods} />
          </div>
          <p className="mt-5">
            <Link
              href="/alquileres"
              className="inline-flex items-center gap-1 font-semibold text-zf-navy hover:underline"
            >
              Ver todos los alquileres
              <IconChevronRight size={18} />
            </Link>
          </p>
        </div>
        <div className="relative aspect-[16/10] w-full lg:hidden">
          <Image src="/demo/photos/ref-balcon.jpg" alt="" fill sizes="100vw" className="object-cover" />
        </div>
      </section>

      <section className="border-y border-zf-border bg-zf-surface" aria-labelledby="como-funciona">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="como-funciona" className="text-3xl font-bold text-zf-red">
                Cómo funciona
              </h2>
              <p className="mt-2 text-lg text-zf-navy">
                Todo lo que necesitás para decidir, antes de viajar.
              </p>
            </div>
            <Link href="/como-funciona" className={buttonClasses("outline", "md")}>
              Conocer más
            </Link>
          </div>
          <div className="mt-8">
            <HowItWorksSteps />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6" aria-labelledby="recientes">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="recientes" className="text-3xl font-bold text-zf-red">
              Publicadas recientemente
            </h2>
            <p className="mt-2 text-lg text-zf-navy">Propiedades de demostración con plano y medidas.</p>
          </div>
          <Link href="/alquileres" className={buttonClasses("primary", "md")}>
            Ver catálogo completo
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.slice(0, 3).map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6" aria-labelledby="mudanza-cta">
        <div className="grid items-center gap-6 rounded-2xl bg-zf-navy p-8 text-white sm:p-10 md:grid-cols-[1fr_auto]">
          <div>
            <h2 id="mudanza-cta" className="text-2xl font-bold">
              ¿Te mudás desde otra ciudad?
            </h2>
            <p className="mt-2 max-w-2xl text-white/90">
              Te contamos cómo funcionan la luz, el gas y el agua en Córdoba Capital, y qué conviene revisar
              antes de la mudanza.
            </p>
          </div>
          <Link
            href="/mudanza"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-6 font-semibold text-zf-navy hover:bg-zf-navy-soft"
          >
            Ver guía de servicios
          </Link>
        </div>
      </section>
    </>
  );
}
