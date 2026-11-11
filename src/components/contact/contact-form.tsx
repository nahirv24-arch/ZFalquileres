"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { validateContact, type ContactErrors, type ContactInput } from "@/lib/contact-schema";
import { buttonClasses, inputClasses, labelClasses } from "@/lib/ui";
import type { PropertySummary } from "@/services/property-service";
import { IconCheck, IconInfo } from "@/components/ui/icons";

const FIELD_ORDER: (keyof ContactInput)[] = ["name", "contact", "property", "message", "consent"];

export function ContactForm({ properties }: { properties: PropertySummary[] }) {
  const searchParams = useSearchParams();
  const preselected = properties.find((p) => p.slug === searchParams.get("propiedad"))?.slug ?? "";
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [done, setDone] = useState<{ ref: string; property: string } | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const input: ContactInput = {
      name: String(fd.get("name") ?? ""),
      contact: String(fd.get("contact") ?? ""),
      property: String(fd.get("property") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
    };
    const result = validateContact(input);
    if (!result.ok) {
      setErrors(result.errors);
      const first = FIELD_ORDER.find((k) => result.errors[k]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    const prop = properties.find((p) => p.slug === input.property);
    setDone({
      ref: `DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
      property: prop ? `${prop.title} (${prop.neighborhood})` : "Consulta general",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done) {
    return (
      <div role="status" className="rounded-2xl border-2 border-zf-success bg-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zf-success-soft text-zf-success">
            <IconCheck size={28} />
          </span>
          <div>
            <h2 className="text-2xl font-bold text-zf-navy">Consulta validada (ejemplo)</h2>
            <p className="mt-2 text-zf-text">
              Así se confirma la recepción de una consulta. Referencia de ejemplo: <strong>{done.ref}</strong>
              . Propiedad: <strong>{done.property}</strong>.
            </p>
          </div>
        </div>
        <p className="mt-6 flex items-start gap-2 rounded-lg bg-zf-warning-soft px-4 py-3 text-sm text-zf-warning">
          <IconInfo size={20} className="mt-0.5 shrink-0" />
          <span>
            <strong>Demostración:</strong> este mensaje no se envió a ZF ni se guardó. En la versión final, la
            consulta llega al equipo comercial y te responde un agente.
          </span>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => setDone(null)} className={buttonClasses("outline", "md")}>
            Hacer otra consulta
          </button>
          <Link href="/alquileres" className={buttonClasses("secondary", "md")}>
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const err = (k: keyof ContactInput) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-1.5 text-sm font-semibold text-zf-red">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof ContactInput) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-zf-border bg-white p-5 sm:p-8"
    >
      {Object.keys(errors).length > 0 && (
        <p
          role="alert"
          className="mb-6 rounded-lg bg-zf-red-soft px-4 py-3 text-sm font-semibold text-zf-red-dark"
        >
          Revisá los campos marcados para poder enviar la consulta.
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClasses}>
            Nombre y apellido{" "}
            <span className="text-zf-red" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Ej.: Juana Pérez"
            className={inputClasses}
            {...aria("name")}
          />
          {err("name")}
        </div>
        <div>
          <label htmlFor="contact" className={labelClasses}>
            Correo electrónico o teléfono{" "}
            <span className="text-zf-red" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="contact"
            name="contact"
            autoComplete="email"
            placeholder="nombre@correo.com o 351 000 0000"
            className={inputClasses}
            {...aria("contact")}
          />
          {err("contact")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="property" className={labelClasses}>
            Propiedad de interés
          </label>
          <select id="property" name="property" defaultValue={preselected} className={inputClasses}>
            <option value="">Consulta general</option>
            {properties.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.neighborhood} · {p.title}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClasses}>
            Mensaje{" "}
            <span className="text-zf-red" aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            maxLength={1000}
            placeholder="Por ejemplo: ¿Se puede coordinar una videollamada para ver el departamento?"
            className={`${inputClasses} min-h-32 py-2.5`}
            {...aria("message")}
          />
          {err("message")}
        </div>
        {/* Campo trampa para bots (oculto para personas) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">No completar</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-[0.95rem] text-zf-text">
            <input
              type="checkbox"
              name="consent"
              className="mt-1 h-5 w-5 shrink-0 accent-zf-navy"
              {...aria("consent")}
            />
            <span>
              Acepto que Zavalía &amp; Fuster use estos datos solo para responder mi consulta, según el{" "}
              <Link href="/privacidad" className="font-semibold text-zf-navy underline underline-offset-2">
                aviso de privacidad
              </Link>
              .{" "}
              <span className="text-zf-red" aria-hidden="true">
                *
              </span>
            </span>
          </label>
          {err("consent")}
        </div>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-zf-border pt-6">
        <p className="text-sm text-zf-muted">
          <span className="text-zf-red">*</span> Campos obligatorios. No pedimos documentación.
        </p>
        <button type="submit" className={buttonClasses("primary", "lg")}>
          Enviar consulta
        </button>
      </div>
    </form>
  );
}
