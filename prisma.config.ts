import "dotenv/config";
import { defineConfig } from "prisma/config";

// DATABASE_URL es opcional: `prisma generate` no se conecta a la base, y la demo (Etapa A) no la usa.
// En el build de Cloudflare no hay base configurada; migraciones y seed sí la requieren.
const url = process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  ...(url ? { datasource: { url } } : {}),
});
