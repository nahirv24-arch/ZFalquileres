import Image from "next/image";
import Link from "next/link";

/** Marca: isotipo oficial ZF (recoloreado según referencias) + nombre institucional + producto. */
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 sm:gap-4"
      aria-label="ZF Alquiler Digital, ir al inicio"
    >
      <Image
        src="/brand/zf-isotipo.png"
        alt=""
        width={51}
        height={39}
        priority
        className="h-8 w-auto sm:h-10"
      />
      <span className="hidden leading-tight min-[420px]:block">
        <span className="block text-[0.95rem] font-bold tracking-wide text-zf-navy sm:text-base">
          ZAVALÍA &amp; FUSTER
        </span>
        <span className="block text-[0.62rem] font-medium tracking-[0.32em] text-zf-navy">PROPIEDADES</span>
      </span>
      {!compact && (
        <>
          <span aria-hidden="true" className="hidden h-10 w-px bg-zf-border lg:block" />
          <span className="hidden text-xl font-bold tracking-tight lg:block">
            <span className="text-zf-red">ZF</span> <span className="text-zf-navy">Alquiler Digital</span>
          </span>
        </>
      )}
    </Link>
  );
}
