import { describe, expect, it } from "vitest";
import { validateContact } from "@/lib/contact-schema";

const valid = {
  name: "Juana Pérez",
  contact: "juana@correo.com",
  property: "",
  message: "Quisiera coordinar una videollamada.",
  consent: true,
  website: "",
};

describe("validación de la consulta", () => {
  it("acepta una consulta completa con correo o teléfono", () => {
    expect(validateContact(valid).ok).toBe(true);
    expect(validateContact({ ...valid, contact: "+54 9 351 555-1234" }).ok).toBe(true);
  });

  it("marca los campos obligatorios", () => {
    const r = validateContact({ name: "", contact: "", property: "", message: "", consent: false });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(Object.keys(r.errors).sort()).toEqual(["consent", "contact", "message", "name"]);
    }
  });

  it("rechaza contactos inválidos y el campo trampa completo", () => {
    expect(validateContact({ ...valid, contact: "hola" }).ok).toBe(false);
    expect(validateContact({ ...valid, website: "spam" }).ok).toBe(false);
  });
});
