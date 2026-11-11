import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = [
  "/",
  "/alquileres",
  "/alquileres/departamento-1-dormitorio-balcon-nueva-cordoba",
  "/comparar",
  "/como-funciona",
  "/mudanza",
  "/contacto",
  "/privacidad",
  "/admin",
  "/admin/propiedades",
  "/admin/propiedades/departamento-1-dormitorio-balcon-nueva-cordoba",
  "/admin/consultas",
];

function trackConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => {
    // El mapa embebido de OpenStreetMap puede registrar avisos propios; no son de la app.
    if (m.type() === "error" && !m.location().url.includes("openstreetmap")) errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

for (const route of ROUTES) {
  test(`carga sin errores ni violaciones WCAG A/AA detectables: ${route}`, async ({ page }) => {
    const errors = trackConsoleErrors(page);
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "es-AR");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .exclude("iframe")
      .analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("recorrido para gerencia: buscar, filtrar, abrir ficha, galería, plano, 3D", async ({ page }) => {
  const errors = trackConsoleErrors(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Alquilá tu próximo departamento a distancia",
  );

  // 2. Buscar en Nueva Córdoba desde la portada
  await page.getByLabel("Zona").selectOption("Nueva Córdoba");
  await page.getByRole("button", { name: "Buscar" }).click();
  await expect(page).toHaveURL(/barrio=Nueva/);
  await expect(page.getByRole("heading", { level: 2, name: /propiedades en alquiler/ })).toContainText(
    "2 propiedades",
  );

  // 3. Filtrar por precio y ambientes
  await page.getByLabel("Precio hasta").fill("500000");
  await page.getByLabel("Ambientes").selectOption("2");
  await page
    .getByRole("search", { name: "Filtrar alquileres" })
    .getByRole("button", { name: "Buscar" })
    .click();
  await expect(page.getByRole("heading", { level: 2, name: /propiedad/ })).toContainText(
    "1 propiedad en alquiler",
  );

  // 4. Abrir la propiedad
  await page.getByRole("link", { name: /Ver ficha de Departamento 1 dormitorio con balcón/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Nueva Córdoba");

  // 5. Recorrer fotos
  await page.waitForLoadState("networkidle");
  const counter = page.locator("p[aria-live=polite]", { hasText: "/ 5" });
  await expect(counter).toContainText("1 / 5");
  await page.getByRole("button", { name: "Foto siguiente" }).first().click();
  await expect(counter).toContainText("2 / 5");
  await page.getByRole("button", { name: "Ver foto ampliada" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("dialog")).toContainText("3 / 5");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  // 6-7. Seleccionar el dormitorio en el plano y ver medidas
  await page.getByRole("button", { name: /^Dormitorio: 3,60 m de largo/ }).click();
  const detail = page.locator("[aria-live=polite]", { hasText: "Ambiente seleccionado" });
  await expect(detail).toContainText("Dormitorio");
  await expect(detail).toContainText("3,60 m");
  await expect(detail).toContainText("3,00 m");
  await expect(detail).toContainText("2,60 m");
  await expect(detail).toContainText("10,8 m²");

  // 8. Orientación, balcón y superficies
  const plan = page.locator("#plano-y-medidas");
  await expect(plan).toContainText("Noreste");
  await expect(plan).toContainText("Superficie semicubierta");
  await expect(plan).toContainText("Superficie total");

  // 9. Recorrido 3D: no se simula un modelo real
  const tour = page.locator("#recorrido-3d");
  await expect(tour).toContainText("Recorrido 3D no disponible");
  await tour.getByRole("button", { name: /Girar a la derecha/ }).click();
  await expect(page.getByRole("link", { name: "Ver modelo 3D" })).toHaveCount(0);

  expect(errors).toEqual([]);
});

test("comparar dos departamentos y consultar", async ({ page }) => {
  await page.goto("/alquileres?barrio=Nueva+Córdoba");
  await page.waitForLoadState("networkidle");
  // Al marcar uno, su botón pasa a «En comparación»: el siguiente «Comparar» vuelve a ser el primero.
  await page
    .getByRole("button", { name: /^Comparar/ })
    .first()
    .click();
  await expect(page.getByRole("button", { name: /^En comparación/ })).toHaveCount(1);
  await page
    .getByRole("button", { name: /^Comparar/ })
    .first()
    .click();
  await expect(page.getByRole("button", { name: /^En comparación/ })).toHaveCount(2);
  await page.getByRole("link", { name: "Comparar ahora" }).click();
  await expect(page).toHaveURL(/comparar\?ids=/);
  const table = page.getByRole("table");
  await expect(table).toContainText("Precio mensual");
  await expect(table).toContainText("Orientación");
  await expect(table).toContainText("Menor precio");

  // 11. Consulta desde el comparador
  await table.getByRole("link", { name: "Consultar" }).first().click();
  await expect(page).toHaveURL(/contacto\?propiedad=/);
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Enviar consulta" }).click();
  await expect(page.getByRole("alert").first()).toContainText("Revisá los campos");
  await page.getByLabel(/Nombre y apellido/).fill("Persona de Prueba");
  await page.getByLabel(/Correo electrónico o teléfono/).fill("prueba@demo.test");
  await page.getByLabel(/Mensaje/).fill("¿Se puede coordinar una videollamada?");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Enviar consulta" }).click();
  await expect(page.getByRole("status")).toContainText("no se envió");
});

test("estado vacío del catálogo", async ({ page }) => {
  await page.goto("/alquileres?precioHasta=1000");
  await expect(page.getByText("No encontramos propiedades con esos filtros")).toBeVisible();
  await page.getByRole("link", { name: "Ver todas las propiedades" }).click();
  await expect(page.getByRole("heading", { level: 2, name: /propiedades en alquiler/ })).toContainText("7");
});

test("panel: editar medidas recalcula y avisa que no guarda", async ({ page }) => {
  await page.goto("/admin/propiedades/departamento-1-dormitorio-balcon-nueva-cordoba");
  await expect(page.getByText("Panel de demostración.")).toBeVisible();
  await page.waitForLoadState("networkidle");
  const largo = page.getByLabel("Dormitorio: largo en metros");
  await largo.fill("4,00");
  await page.getByRole("button", { name: "Validar cambios" }).click();
  await expect(page.getByRole("status").filter({ hasText: "no se guardan" })).toBeVisible();
});

test("sin scroll horizontal a 320 px (RNF-007)", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  for (const route of [
    "/",
    "/alquileres",
    "/alquileres/departamento-1-dormitorio-balcon-nueva-cordoba",
    "/mudanza",
  ]) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const wide = await page.evaluate(() => {
      const w = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth <= w) return [];
      const insideScroller = (e: Element) => {
        for (let p = e.parentElement; p; p = p.parentElement) {
          const o = getComputedStyle(p).overflowX;
          if (o === "auto" || o === "scroll" || o === "hidden") return true;
        }
        return false;
      };
      return [...document.querySelectorAll("body *")]
        .filter((e) => e.getBoundingClientRect().right > w + 1 && !insideScroller(e))
        .slice(0, 5)
        .map((e) => `${e.tagName}.${String(e.className).slice(0, 60)}`);
    });
    expect(wide, route).toEqual([]);
  }
});
