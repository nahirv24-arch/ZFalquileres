export const NOT_INFORMED = "Dato no informado";

/** RF-003: los campos faltantes se identifican, nunca se inventan. */
export function displayOrMissing(value: string | number | null | undefined, suffix = ""): string {
  if (value === null || value === undefined || value === "") return NOT_INFORMED;
  return `${value}${suffix}`;
}

/** RN-006: el precio siempre muestra moneda. */
export function formatMoney(
  amount: number | null | undefined,
  currency: "ARS" | "USD" | null | undefined,
): string {
  if (amount === null || amount === undefined || !currency) return NOT_INFORMED;
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

const meters = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const area1 = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 });

/** 3.6 → "3,60 m" */
export function formatMeters(n: number): string {
  return `${meters.format(n)} m`;
}

/** 14.4 → "14,4 m²" */
export function formatArea(n: number): string {
  return `${area1.format(n)} m²`;
}

export function roomArea(r: { length: number; width: number }) {
  return Math.round(r.length * r.width * 100) / 100;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(iso.length === 10 ? `${iso}T12:00:00-03:00` : iso),
  );
}

export function pluralize(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

export function roomsLabel(rooms: number) {
  return rooms === 1 ? "Monoambiente" : `${rooms} ambientes`;
}
