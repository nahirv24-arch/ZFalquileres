type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-zf-red text-white hover:bg-zf-red-dark",
  secondary: "bg-zf-navy text-white hover:bg-zf-navy-dark",
  outline: "border-2 border-zf-navy text-zf-navy hover:bg-zf-navy-soft",
  ghost: "text-zf-navy hover:bg-zf-navy-soft",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-4 text-[0.95rem]",
  lg: "min-h-12 px-6 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}

export const inputClasses =
  "min-h-11 w-full rounded-lg border border-zf-border bg-white px-3 text-[0.95rem] text-zf-text placeholder:text-zf-muted focus:border-zf-navy focus:outline-none focus:ring-2 focus:ring-zf-navy/30";

export const labelClasses = "mb-1.5 block text-sm font-semibold text-zf-navy";
