import { DEMO_PROPERTIES, NEIGHBORHOOD_INFO } from "@/data/demo/properties";
import { DEMO_INQUIRIES } from "@/data/demo/inquiries";
import { applyFilters, applySort } from "@/lib/filters";
import type { Inquiry } from "@/types/inquiry";
import type { Property, PropertyFilters, SortOption } from "@/types/property";

/**
 * Capa de acceso a datos. Los componentes y páginas solo dependen de esta interfaz.
 * En la Etapa B se reemplaza `demoRepository` por una implementación que lea el catálogo autorizado
 * de ZF y el contenido enriquecido de la base propia, sin tocar la interfaz.
 */
export interface PropertyRepository {
  list(filters?: PropertyFilters, sort?: SortOption): Promise<Property[]>;
  getBySlug(slug: string): Promise<Property | null>;
  getManyBySlug(slugs: string[]): Promise<Property[]>;
  neighborhoods(): Promise<string[]>;
  neighborhoodInfo(name: string): Promise<string | null>;
  inquiries(): Promise<Inquiry[]>;
}

const demoRepository: PropertyRepository = {
  async list(filters = {}, sort = "recientes") {
    return applySort(applyFilters(DEMO_PROPERTIES, filters), sort);
  },
  async getBySlug(slug) {
    return DEMO_PROPERTIES.find((p) => p.slug === slug) ?? null;
  },
  async getManyBySlug(slugs) {
    return slugs
      .map((s) => DEMO_PROPERTIES.find((p) => p.slug === s))
      .filter((p): p is Property => Boolean(p));
  },
  async neighborhoods() {
    return [...new Set(DEMO_PROPERTIES.map((p) => p.neighborhood))].sort((a, b) => a.localeCompare(b, "es"));
  },
  async neighborhoodInfo(name) {
    return NEIGHBORHOOD_INFO[name] ?? null;
  },
  async inquiries() {
    return [...DEMO_INQUIRIES].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
};

export const propertyRepository: PropertyRepository = demoRepository;

/** Datos livianos para componentes de cliente (comparador, formulario) sin exponer el repositorio. */
export function toSummary(p: Property) {
  return {
    slug: p.slug,
    title: p.title,
    neighborhood: p.neighborhood,
    photo: p.photos[0] ?? null,
  };
}
export type PropertySummary = ReturnType<typeof toSummary>;
