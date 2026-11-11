"use client";

import { useCompare } from "@/hooks/use-compare";
import { IconCheck, IconCompare } from "@/components/ui/icons";

/** Agrega o quita una propiedad del comparador (máximo 3). */
export function CompareToggle({
  slug,
  title,
  variant = "card",
}: {
  slug: string;
  title: string;
  variant?: "card" | "detail";
}) {
  const { isSelected, isFull, toggle } = useCompare();
  const selected = isSelected(slug);
  const disabled = !selected && isFull;

  const base =
    variant === "card"
      ? "inline-flex min-h-10 items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-colors"
      : "inline-flex min-h-12 items-center gap-2 rounded-lg border-2 px-4 text-base font-semibold transition-colors";
  const state = selected
    ? "border-zf-navy bg-zf-navy text-white hover:bg-zf-navy-dark"
    : "border-zf-border bg-white text-zf-navy hover:border-zf-navy";

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={selected}
      disabled={disabled}
      title={disabled ? "Ya elegiste 3 propiedades para comparar" : undefined}
      className={`${base} ${state} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {selected ? <IconCheck size={18} /> : <IconCompare size={18} />}
      {selected ? "En comparación" : "Comparar"}
      <span className="sr-only"> {title}</span>
    </button>
  );
}
