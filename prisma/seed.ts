/**
 * Seed de desarrollo con DATOS FICTICIOS (ver src/server/catalog/fixtures.ts).
 * Se niega a correr contra una base que no sea local.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { FIXTURE_PROPERTIES } from "../src/server/catalog/fixtures";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("Falta DATABASE_URL (ver .env.example)");
if (!/@(localhost|127\.0\.0\.1)[:/]/.test(url)) {
  throw new Error("El seed ficticio solo corre contra una base local.");
}

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

async function main() {
  for (const p of FIXTURE_PROPERTIES) {
    const data = { ...p, lastSeenAt: new Date(), lastSyncedAt: new Date() };
    await db.catalogProperty.upsert({
      where: { source_externalId: { source: p.source, externalId: p.externalId } },
      create: data,
      update: data,
    });
  }
  await db.user.upsert({
    where: { email: "admin@ejemplo.test" },
    create: { email: "admin@ejemplo.test", name: "Admin de prueba", role: "ADMIN" },
    update: {},
  });
  console.log(`Seed listo: ${FIXTURE_PROPERTIES.length} propiedades ficticias y 1 usuario de prueba.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
