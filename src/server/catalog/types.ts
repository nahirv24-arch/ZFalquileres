/**
 * Contrato del adaptador de catálogo (PRD 20.4).
 * Cualquier fuente (fixtures, importación manual, API autorizada) implementa esta interfaz.
 * La plataforma nunca escribe en la fuente externa: solo lectura (PRD 9.5).
 */
export type Availability = "AVAILABLE" | "RESERVED" | "RENTED" | "WITHDRAWN" | "UNCONFIRMED";

export interface NormalizedProperty {
  source: string;
  externalId: string;
  title: string;
  description: string | null;
  propertyType: string | null;
  neighborhood: string | null;
  addressDisplay: string | null;
  rentAmount: number | null;
  rentCurrency: "ARS" | "USD" | null;
  bedrooms: number | null;
  rooms: number | null;
  coveredAreaM2: number | null;
  availability: Availability;
  publishable: boolean;
}

export interface SyncHealth {
  source: string;
  ok: boolean;
  checkedAt: Date;
  message?: string;
}

export interface CatalogAdapter {
  readonly source: string;
  listProperties(): Promise<NormalizedProperty[]>;
  getPropertyByExternalId(externalId: string): Promise<NormalizedProperty | null>;
  /** Solo si la fuente lo soporta; si no, se hace sincronización completa. */
  getChangesSince?(since: Date): Promise<NormalizedProperty[] | null>;
  reportSyncHealth(): Promise<SyncHealth>;
}
