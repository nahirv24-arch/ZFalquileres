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
