"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCompare } from "@/hooks/use-compare";
import { buttonClasses } from "@/lib/ui";
import { IconMenu, IconX } from "@/components/ui/icons";
import { Brand } from "./brand";

const NAV = [
  { href: "/alquileres", label: "Alquileres" },
  { href: "/comparar", label: "Comparar" },
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/mudanza", label: "Servicios y mudanza" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { selected } = useCompare();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const link = (item: (typeof NAV)[number], mobile = false) => (
    <Link
      href={item.href}
      aria-current={isActive(item.href) ? "page" : undefined}
      onClick={() => setOpen(false)}
      className={
        mobile
          ? `flex min-h-12 items-center justify-between border-b border-zf-border px-1 text-base font-semibold ${isActive(item.href) ? "text-zf-red" : "text-zf-navy"}`
          : `relative flex h-full items-center px-1 text-[0.95rem] font-medium transition-colors hover:text-zf-red ${
              isActive(item.href)
                ? "text-zf-red after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-zf-red"
                : "text-zf-navy"
            }`
      }
    >
      {item.label}
      {item.href === "/comparar" && selected.length > 0 && (
        <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-zf-red px-1.5 text-xs font-bold text-white">
          {selected.length}
          <span className="sr-only"> seleccionadas</span>
        </span>
      )}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-zf-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Brand />
        <nav aria-label="Principal" className="hidden h-full md:block">
          <ul className="flex h-full items-center gap-6 lg:gap-7">
            {NAV.map((item) => (
              <li key={item.href} className="h-full">
                {link(item)}
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/contacto" className={buttonClasses("secondary", "md", "hidden sm:inline-flex")}>
            Contacto
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-zf-navy hover:bg-zf-navy-soft md:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconX size={24} /> : <IconMenu size={24} />}
            <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="menu-movil"
          aria-label="Principal (móvil)"
          className="border-t border-zf-border bg-white px-4 pb-4 md:hidden"
        >
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>{link(item, true)}</li>
            ))}
            <li>
              <Link
                href="/contacto"
                onClick={() => setOpen(false)}
                className={buttonClasses("secondary", "lg", "mt-4 w-full")}
              >
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
