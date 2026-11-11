import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/admin-nav";
import { IconInfo } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: { default: "Panel ZF (demostración)", template: "%s · Panel ZF (demostración)" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="bg-zf-surface/70">
      <div className="border-b border-zf-warning/30 bg-zf-warning-soft">
        <p className="mx-auto flex max-w-7xl items-start gap-2 px-4 py-3 text-sm text-zf-warning sm:px-6">
          <IconInfo size={18} className="mt-0.5 shrink-0" />
          <span>
            <strong>Panel de demostración.</strong> Sin inicio de sesión ni guardado: los cambios se ven en
            pantalla y se pierden al recargar. Los datos y las consultas son ficticios.
          </span>
        </p>
      </div>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr]">
        <AdminNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
