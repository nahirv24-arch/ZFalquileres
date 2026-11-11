import { describe, expect, it } from "vitest";
import { displayOrMissing, formatMoney, NOT_INFORMED } from "@/lib/format";

describe("displayOrMissing (RF-003)", () => {
  it("marca los valores faltantes en lugar de inventarlos", () => {
    expect(displayOrMissing(null)).toBe(NOT_INFORMED);
    expect(displayOrMissing(undefined)).toBe(NOT_INFORMED);
    expect(displayOrMissing("")).toBe(NOT_INFORMED);
  });

  it("conserva el cero como dato válido", () => {
    expect(displayOrMissing(0, " dormitorios")).toBe("0 dormitorios");
  });
});

describe("formatMoney (RN-006)", () => {
  it("siempre incluye la moneda", () => {
    expect(formatMoney(450000, "ARS")).toMatch(/\$/);
    expect(formatMoney(450000, "ARS")).toMatch(/450\.000/);
    expect(formatMoney(800, "USD")).toMatch(/US\$|USD/);
  });

  it("no muestra un precio sin moneda", () => {
    expect(formatMoney(450000, null)).toBe(NOT_INFORMED);
    expect(formatMoney(null, "ARS")).toBe(NOT_INFORMED);
  });
});
