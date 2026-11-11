import Link from "next/link";

const NAV = [
  { href: "/propiedades", label: "Propiedades" },
  { href: "/comparar", label: "Comparar" },
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/mudanza", label: "Mudanza" },
  { href: "/consulta", label: "Consultas" },
] as const;

export function SiteHeader() {
  return (
    <header className="bg-zf-navy text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {/* Logo oficial pendiente (D-06) */}
          ZF <span className="font-normal">Alquiler Digital</span>
        </Link>
        <nav aria-label="Principal">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[0.95rem]">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="underline-offset-4 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
