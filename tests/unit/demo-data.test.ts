import { describe, expect, it } from "vitest";
import { DEMO_PROPERTIES } from "@/data/demo/properties";
import { completeness } from "@/lib/completeness";
import { applyFilters, applySort, parseFilters } from "@/lib/filters";
import { propertyRepository } from "@/services/property-service";

describe("datos de demostración", () => {
  it("tiene al menos 6 propiedades, todas marcadas como demo y con slug único", () => {
    expect(DEMO_PROPERTIES.length).toBeGreaterThanOrEqual(6);
    expect(DEMO_PROPERTIES.every((p) => p.isDemo)).toBe(true);
    expect(new Set(DEMO_PROPERTIES.map((p) => p.slug)).size).toBe(DEMO_PROPERTIES.length);
  });

  it("incluye los barrios pedidos", () => {
    const barrios = new Set(DEMO_PROPERTIES.map((p) => p.neighborhood));
    for (const b of ["Nueva Córdoba", "General Paz", "Güemes", "Alta Córdoba", "Centro", "Cofico"]) {
      expect(barrios.has(b)).toBe(true);
    }
  });

  it("la disponibilidad siempre es ilustrativa y ninguna tiene recorrido 3D simulado", () => {
    for (const p of DEMO_PROPERTIES) {
      expect(p.availability.illustrative).toBe(true);
      expect(p.tour3dUrl).toBeNull();
    }
  });

  it.each(DEMO_PROPERTIES.map((p) => [p.slug, p] as const))("plano coherente: %s", (_, p) => {
    const plan = p.plan!;
    expect(plan).not.toBeNull();
    // superficie total = cubierta + semicubierta
    expect(p.totalArea).toBe(plan.coveredArea + plan.semiCoveredArea);
    // balcón en datos ⇔ balcón en plano
    expect(plan.rooms.some((r) => r.kind === "balcon")).toBe(p.hasBalcony);
    // la superficie útil no supera la cubierta declarada
    const useful = plan.rooms.filter((r) => !r.semiCovered).reduce((a, r) => a + r.length * r.width, 0);
    expect(useful).toBeLessThanOrEqual(plan.coveredArea);
    // dormitorios del plano = dormitorios declarados; baños también
    expect(plan.rooms.filter((r) => r.kind === "dormitorio").length).toBe(p.bedrooms);
    expect(plan.rooms.filter((r) => r.kind === "bano").length).toBe(p.bathrooms);
    // ambientes sin superposición
    for (const a of plan.rooms) {
      for (const b of plan.rooms) {
        if (a === b) continue;
        const overlapX = Math.min(a.x + a.length, b.x + b.length) - Math.max(a.x, b.x);
        const overlapY = Math.min(a.y + a.width, b.y + b.width) - Math.max(a.y, b.y);
        expect(overlapX > 0.01 && overlapY > 0.01).toBe(false);
      }
    }
  });
});

describe("filtros del catálogo", () => {
  it("interpreta los parámetros de la URL e ignora valores inválidos", () => {
    const { filters, sort } = parseFilters({
      barrio: "Güemes",
      ambientes: "2",
      precioHasta: "abc",
      orden: "x",
    });
    expect(filters.neighborhood).toBe("Güemes");
    expect(filters.rooms).toBe(2);
    expect(filters.maxPrice).toBeUndefined();
    expect(sort).toBe("recientes");
  });

  it("recorrido de la demo: Nueva Córdoba, hasta $500.000 y 2 ambientes", () => {
    const nc = applyFilters(DEMO_PROPERTIES, { neighborhood: "Nueva Córdoba" });
    expect(nc.length).toBeGreaterThanOrEqual(2);
    const filtered = applyFilters(DEMO_PROPERTIES, {
      neighborhood: "Nueva Córdoba",
      maxPrice: 500000,
      rooms: 2,
    });
    expect(filtered.map((p) => p.slug)).toEqual(["departamento-1-dormitorio-balcon-nueva-cordoba"]);
  });

  it("4 ambientes significa 4 o más; balcón filtra", () => {
    expect(applyFilters(DEMO_PROPERTIES, { rooms: 4 })).toHaveLength(0);
    expect(applyFilters(DEMO_PROPERTIES, { balcony: true }).every((p) => p.hasBalcony)).toBe(true);
  });

  it("ordena por precio y superficie", () => {
    const asc = applySort(DEMO_PROPERTIES, "precio-asc").map((p) => p.rent.amount);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    const area = applySort(DEMO_PROPERTIES, "superficie-desc").map((p) => p.totalArea);
    expect(area).toEqual([...area].sort((a, b) => b - a));
  });

  it("sin resultados devuelve lista vacía", async () => {
    expect(await propertyRepository.list({ maxPrice: 1 })).toEqual([]);
  });
});

describe("completitud de fichas", () => {
  it("calcula porcentaje y pendientes a partir de los datos", () => {
    const c = completeness(DEMO_PROPERTIES[0]);
    expect(c.percent).toBeGreaterThan(0);
    expect(c.percent).toBeLessThan(100); // sin recorrido 3D ni video
    expect(c.missing).toContain("Recorrido 3D autorizado");
  });
});
