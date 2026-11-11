import type { Availability, NormalizedProperty } from "./types";

/**
 * RF-001 / RN-003: solo se listan propiedades habilitadas por ZF que no estén retiradas ni alquiladas.
 * UNCONFIRMED se lista, pero nunca se presenta como disponibilidad confirmada.
 */
export function isPubliclyListed(p: Pick<NormalizedProperty, "publishable" | "availability">) {
  if (!p.publishable) return false;
  return p.availability === "AVAILABLE" || p.availability === "UNCONFIRMED" || p.availability === "RESERVED";
}

export function availabilityLabel(a: Availability): string {
  switch (a) {
    case "AVAILABLE":
      return "Disponible";
    case "RESERVED":
      return "Reservada";
    case "RENTED":
      return "Alquilada";
    case "WITHDRAWN":
      return "Retirada";
    case "UNCONFIRMED":
      return "Disponibilidad a confirmar por ZF";
  }
}
