import type { Property, PropertyFilters, SortOption } from "@/types/property";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recientes", label: "Más recientes" },
  { value: "precio-asc", label: "Menor precio" },
  { value: "precio-desc", label: "Mayor precio" },
  { value: "superficie-desc", label: "Mayor superficie" },
];

export const PRICE_RANGES = [
  { value: "350000", label: "Hasta $ 350.000" },
  { value: "450000", label: "Hasta $ 450.000" },
  { value: "550000", label: "Hasta $ 550.000" },
  { value: "650000", label: "Hasta $ 650.000" },
];

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function toPositiveInt(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number.parseInt(v.replace(/\D/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** Convierte los parámetros de la URL en filtros válidos. Ignora valores mal formados. */
export function parseFilters(params: RawParams): { filters: PropertyFilters; sort: SortOption } {
  const neighborhood = first(params.barrio)?.trim() || undefined;
  const sortRaw = first(params.orden);
  const sort = SORT_OPTIONS.some((o) => o.value === sortRaw) ? (sortRaw as SortOption) : "recientes";
  return {
    filters: {
      neighborhood,
      rooms: toPositiveInt(first(params.ambientes)),
      bedrooms: toPositiveInt(first(params.dormitorios)),
      minPrice: toPositiveInt(first(params.precioDesde)),
      maxPrice: toPositiveInt(first(params.precioHasta)),
      minArea: toPositiveInt(first(params.supDesde)),
      maxArea: toPositiveInt(first(params.supHasta)),
      balcony: first(params.balcon) === "si" ? true : undefined,
    },
    sort,
  };
}

/** Ambientes: "4" significa 4 o más, el resto es exacto (como en los portales argentinos). */
function matchesRooms(p: Property, rooms: number) {
  return rooms >= 4 ? p.rooms >= 4 : p.rooms === rooms;
}

export function applyFilters(list: Property[], f: PropertyFilters): Property[] {
  return list.filter((p) => {
    if (f.neighborhood && p.neighborhood !== f.neighborhood) return false;
    if (f.rooms && !matchesRooms(p, f.rooms)) return false;
    if (f.bedrooms && p.bedrooms < f.bedrooms) return false;
    if (f.minPrice && p.rent.amount < f.minPrice) return false;
    if (f.maxPrice && p.rent.amount > f.maxPrice) return false;
    if (f.minArea && p.totalArea < f.minArea) return false;
    if (f.maxArea && p.totalArea > f.maxArea) return false;
    if (f.balcony && !p.hasBalcony) return false;
    return true;
  });
}

export function applySort(list: Property[], sort: SortOption): Property[] {
  const copy = [...list];
  switch (sort) {
    case "precio-asc":
      return copy.sort((a, b) => a.rent.amount - b.rent.amount);
    case "precio-desc":
      return copy.sort((a, b) => b.rent.amount - a.rent.amount);
    case "superficie-desc":
      return copy.sort((a, b) => b.totalArea - a.totalArea);
    case "recientes":
    default:
      return copy.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }
}

export function hasActiveFilters(f: PropertyFilters) {
  return Object.values(f).some((v) => v !== undefined);
}
