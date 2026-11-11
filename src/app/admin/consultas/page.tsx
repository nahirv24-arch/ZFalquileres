import { InquiriesTable } from "@/components/admin/inquiries-table";
import { propertyRepository } from "@/services/property-service";

export const metadata = { title: "Consultas" };

export default async function AdminInquiries() {
  const [inquiries, properties] = await Promise.all([
    propertyRepository.inquiries(),
    propertyRepository.list(),
  ]);
  const titles = Object.fromEntries(properties.map((p) => [p.slug, `${p.title} · ${p.neighborhood}`]));
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-zf-red">Consultas</h1>
      <p className="mt-1 text-zf-navy">
        Consultas de ejemplo (personas ficticias). El cambio de estado es visual y no se guarda.
      </p>
      <div className="mt-6">
        <InquiriesTable inquiries={inquiries} titles={titles} />
      </div>
    </div>
  );
}
