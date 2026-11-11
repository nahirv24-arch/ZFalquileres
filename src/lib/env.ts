import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
});

let cached: z.infer<typeof serverSchema> | undefined;

/** Valida variables de entorno al primer uso. Falla con un mensaje claro sin imprimir valores. */
export function serverEnv() {
  if (cached) return cached;
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    const keys = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Variables de entorno inválidas o faltantes: ${keys}. Revisá .env.example.`);
  }
  cached = parsed.data;
  return cached;
}
