import { z } from "zod";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Teléfonos argentinos con o sin +54, espacios o guiones: entre 8 y 15 dígitos.
const PHONE = /^\+?[\d\s()-]{8,20}$/;

/** Validación de la consulta. Se usa en el cliente y se reutilizará en el servidor (Etapa B). */
export const contactSchema = z.object({
  name: z.string().trim().min(3, "Escribí tu nombre y apellido.").max(80, "El nombre es demasiado largo."),
  contact: z
    .string()
    .trim()
    .min(1, "Dejanos un correo electrónico o un teléfono.")
    .refine((v) => EMAIL.test(v) || (PHONE.test(v) && v.replace(/\D/g, "").length >= 8), {
      message: "Revisá el correo o el teléfono: no parece válido.",
    }),
  property: z.string().trim().max(120),
  message: z
    .string()
    .trim()
    .min(10, "Contanos un poco más (al menos 10 caracteres).")
    .max(1000, "El mensaje puede tener hasta 1000 caracteres."),
  consent: z.literal(true, { error: "Necesitamos tu consentimiento para responderte." }),
  // Campo trampa para bots: debe quedar vacío.
  website: z.string().max(0).optional(),
});

/** Lo que llega del formulario (el consentimiento puede venir sin marcar). */
export type ContactInput = Omit<z.input<typeof contactSchema>, "consent"> & { consent: boolean };
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export function validateContact(input: ContactInput): { ok: true } | { ok: false; errors: ContactErrors } {
  const result = contactSchema.safeParse(input);
  if (result.success) return { ok: true };
  const errors: ContactErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof ContactInput;
    if (!errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}
