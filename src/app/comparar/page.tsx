import type { Metadata } from "next";
import { Suspense } from "react";
import { CompareTable } from "@/components/compare/compare-table";
import { propertyRepository } from "@/services/property-service";

export const metadata: Metadata = {
  title: "Comparar propiedades",
  description: "Compará hasta tres propiedades: precio, superficie, balcón, orientación y más.",
};

export default async function ComparePage() {
  const all = await propertyRepository.list();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-zf-red sm:text-4xl">Comparar propiedades</h1>
      <p className="mt-2 text-lg text-zf-navy">
        Elegí hasta tres propiedades y mirá sus diferencias lado a lado.
      </p>
      <div className="mt-8">
        <Suspense
          fallback={<div className="h-40 animate-pulse rounded-2xl bg-zf-surface" aria-hidden="true" />}
        >
          <CompareTable all={all} />
        </Suspense>
      </div>
    </div>
  );
}
