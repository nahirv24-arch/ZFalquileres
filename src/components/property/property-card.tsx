import Image from "next/image";
import Link from "next/link";
import { formatArea, formatMoney } from "@/lib/format";
import type { Property } from "@/types/property";
import { IconArea, IconBath, IconBed, IconChevronRight } from "@/components/ui/icons";
import { CompareToggle } from "./compare-toggle";

export function PropertyCard({ property: p, priority = false }: { property: Property; priority?: boolean }) {
  const href = `/alquileres/${p.slug}`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-zf-border bg-white transition-shadow hover:shadow-[0_6px_24px_rgb(37_61_71/0.10)]">
      <Link
        href={href}
        className="relative block aspect-[16/10] overflow-hidden bg-zf-surface"
        tabIndex={-1}
        aria-hidden="true"
      >
        {p.photos[0] && (
          <Image
            src={p.photos[0].src}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        )}
        <span className="absolute bottom-3 right-3 rounded-md bg-black/65 px-2 py-0.5 text-xs font-semibold text-white">
          {p.photos.length} fotos
        </span>
        {p.plan && (
          <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-0.5 text-xs font-semibold text-zf-navy">
            Plano con medidas
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm text-zf-muted">{p.neighborhood}</p>
        <h3 className="mt-0.5 text-lg font-bold leading-snug text-zf-navy">
          <Link href={href} className="hover:underline">
            {p.title}
          </Link>
        </h3>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <span className="text-2xl font-bold text-zf-red">
            {formatMoney(p.rent.amount, p.rent.currency)}
          </span>
          <span className="text-sm text-zf-muted">
            {p.expenses
              ? `+ ${formatMoney(p.expenses.amount, p.expenses.currency)} expensas`
              : "sin expensas"}
          </span>
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zf-text">
          <li className="flex items-center gap-1.5">
            <IconBed size={18} className="text-zf-navy" />
            {p.bedrooms === 0 ? "Monoambiente" : `${p.bedrooms} dorm.`}
          </li>
          <li className="flex items-center gap-1.5">
            <IconBath size={18} className="text-zf-navy" />
            {p.bathrooms} {p.bathrooms === 1 ? "baño" : "baños"}
          </li>
          <li className="flex items-center gap-1.5">
            <IconArea size={18} className="text-zf-navy" />
            {formatArea(p.totalArea)}
          </li>
        </ul>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <CompareToggle slug={p.slug} title={p.title} />
          <Link
            href={href}
            className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-zf-red hover:bg-zf-red-soft"
          >
            Ver ficha
            <IconChevronRight size={18} />
            <span className="sr-only">
              {" "}
              de {p.title} en {p.neighborhood}
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
