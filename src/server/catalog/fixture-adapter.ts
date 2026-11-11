import { FIXTURE_PROPERTIES } from "./fixtures";
import type { CatalogAdapter, NormalizedProperty, SyncHealth } from "./types";

/** Adaptador de desarrollo: lee fixtures ficticios en memoria. */
export class FixtureCatalogAdapter implements CatalogAdapter {
  readonly source = "fixture";

  constructor(private readonly data: NormalizedProperty[] = FIXTURE_PROPERTIES) {}

  async listProperties() {
    return [...this.data];
  }

  async getPropertyByExternalId(externalId: string) {
    return this.data.find((p) => p.externalId === externalId) ?? null;
  }

  async reportSyncHealth(): Promise<SyncHealth> {
    return { source: this.source, ok: true, checkedAt: new Date(), message: "Datos ficticios" };
  }
}
