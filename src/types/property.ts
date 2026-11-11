/** Tipos de dominio del frontend. Son independientes de la fuente (demo, API autorizada, base local). */

export type Currency = "ARS" | "USD";

export type Orientation =
  "Norte" | "Noreste" | "Este" | "Sureste" | "Sur" | "Suroeste" | "Oeste" | "Noroeste";

export type PropertyType = "Departamento" | "Monoambiente" | "Dúplex";

export type VerificationLevel = "verificada" | "estimada" | "no-disponible";

export type RoomKind = "living" | "dormitorio" | "cocina" | "bano" | "balcon" | "lavadero" | "circulacion";

/** Un ambiente del plano. Coordenadas y medidas en metros. */
export interface Room {
  id: string;
  name: string;
  kind: RoomKind;
  /** Posición en el plano (esquina superior izquierda), en metros. */
  x: number;
  y: number;
  /** Largo (eje horizontal del plano) en metros. */
  length: number;
  /** Ancho (eje vertical del plano) en metros. */
  width: number;
  /** Alto de techo en metros. */
  height: number;
  /** Semicubierto (balcón, galería): cuenta para superficie semicubierta. */
  semiCovered?: boolean;
  notes?: string;
}

export interface FloorPlan {
  rooms: Room[];
  /** Superficie cubierta declarada (incluye muros), m². */
  coveredArea: number;
  /** Superficie semicubierta declarada, m². */
  semiCoveredArea: number;
  measuredBy: string;
  measuredAt: string; // ISO
  verification: VerificationLevel;
}

export interface Photo {
  src: string;
  alt: string;
  /** Crédito de la fotografía (licencia libre o referencia interna). */
  credit: string;
}

export interface CostItem {
  label: string;
  amount: number | null;
  currency: Currency;
  kind: "confirmado" | "estimado";
  note?: string;
}

export interface UtilityService {
  service: "Electricidad" | "Gas natural" | "Agua";
  provider: string;
  guideId: "electricidad" | "gas" | "agua";
  /** Quién paga el servicio durante el contrato. */
  payer: "Inquilino" | "Propietario" | "Incluido en expensas";
  ownershipChange: "Requerido" | "Consultar con ZF" | "No aplica";
}

export interface Property {
  id: string;
  slug: string;
  /** Siempre true en la demo: se muestra un aviso en todas las vistas. */
  isDemo: boolean;
  title: string;
  type: PropertyType;
  neighborhood: string;
  addressDisplay: string;
  /** Coordenadas aproximadas del barrio (no de la propiedad). */
  approxLocation: { lat: number; lng: number };
  rent: { amount: number; currency: Currency };
  expenses: { amount: number; currency: Currency } | null;
  rooms: number; // ambientes
  bedrooms: number;
  bathrooms: number;
  totalArea: number;
  hasBalcony: boolean;
  orientation: Orientation;
  floor: string;
  petsAllowed: boolean | null;
  description: string;
  features: string[];
  photos: Photo[];
  plan: FloorPlan | null;
  /** URL de un modelo 3D o recorrido real autorizado. En la demo ninguna propiedad lo tiene. */
  tour3dUrl: string | null;
  videoUrl: string | null;
  costs: CostItem[];
  services: UtilityService[];
  availability: { label: string; illustrative: true };
  publishedAt: string; // ISO
}

export interface PropertyFilters {
  neighborhood?: string;
  rooms?: number; // ambientes mínimos
  bedrooms?: number; // dormitorios mínimos
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  balcony?: boolean;
}

export type SortOption = "recientes" | "precio-asc" | "precio-desc" | "superficie-desc";
