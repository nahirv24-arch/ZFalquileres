"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/propiedades", label: "Propiedades" },
  { href: "/admin/consultas", label: "Consultas" },
];

export function AdminNav() {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  return (
    <nav aria-label="Panel" className="lg:sticky lg:top-24 lg:self-start">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zf-muted">Panel ZF</p>
      <ul className="flex gap-2 overflow-x-auto lg:flex-col">
        {ITEMS.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              aria-current={active(i.href) ? "page" : undefined}
              className={`flex min-h-11 items-center whitespace-nowrap rounded-lg px-3 font-semibold ${
                active(i.href) ? "bg-zf-navy text-white" : "text-zf-navy hover:bg-white"
              }`}
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
