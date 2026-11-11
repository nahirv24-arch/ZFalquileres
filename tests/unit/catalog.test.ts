import { describe, expect, it } from "vitest";
import { FixtureCatalogAdapter } from "@/server/catalog/fixture-adapter";
import { availabilityLabel, isPubliclyListed } from "@/server/catalog/visibility";

describe("visibilidad pública (RF-001 / RN-003)", () => {
  it("excluye alquiladas, retiradas y no habilitadas", () => {
    expect(isPubliclyListed({ publishable: true, availability: "RENTED" })).toBe(false);
    expect(isPubliclyListed({ publishable: true, availability: "WITHDRAWN" })).toBe(false);
    expect(isPubliclyListed({ publishable: false, availability: "AVAILABLE" })).toBe(false);
  });

  it("incluye disponibles y a confirmar", () => {
    expect(isPubliclyListed({ publishable: true, availability: "AVAILABLE" })).toBe(true);
    expect(isPubliclyListed({ publishable: true, availability: "UNCONFIRMED" })).toBe(true);
  });

  it("no presenta como disponible lo que no está confirmado", () => {
    expect(availabilityLabel("UNCONFIRMED")).not.toBe("Disponible");
  });
});

describe("FixtureCatalogAdapter", () => {
  const adapter = new FixtureCatalogAdapter();

  it("solo expone datos marcados como ficticios", async () => {
    const all = await adapter.listProperties();
    expect(all.length).toBeGreaterThan(0);
    for (const p of all) expect(p.title).toMatch(/^\[FICTICIO\]/);
  });

  it("filtra la propiedad alquilada del listado público", async () => {
    const visible = (await adapter.listProperties()).filter(isPubliclyListed);
    expect(visible.map((p) => p.externalId)).not.toContain("FX-004");
  });

  it("devuelve null para un id inexistente", async () => {
    expect(await adapter.getPropertyByExternalId("NO-EXISTE")).toBeNull();
  });
});
