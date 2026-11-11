"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDate } from "@/lib/format";
import type { Inquiry, InquiryStatus } from "@/types/inquiry";

const STATUSES: InquiryStatus[] = ["Nueva", "En curso", "Respondida"];
const STATUS_CLS: Record<InquiryStatus, string> = {
  Nueva: "bg-zf-red-soft text-zf-red-dark",
  "En curso": "bg-zf-warning-soft text-zf-warning",
  Respondida: "bg-zf-success-soft text-zf-success",
};

export function InquiriesTable({
  inquiries,
  titles,
}: {
  inquiries: Inquiry[];
  titles: Record<string, string>;
}) {
  const [rows, setRows] = useState(inquiries);
  const [filter, setFilter] = useState<InquiryStatus | "Todas">("Todas");
  const visible = filter === "Todas" ? rows : rows.filter((r) => r.status === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
        {(["Todas", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={filter === s}
            onClick={() => setFilter(s)}
            className={`min-h-10 rounded-lg px-3 text-sm font-semibold ${
              filter === s
                ? "bg-zf-navy text-white"
                : "border border-zf-border bg-white text-zf-navy hover:bg-zf-navy-soft"
            }`}
          >
            {s} ({s === "Todas" ? rows.length : rows.filter((r) => r.status === s).length})
          </button>
        ))}
      </div>
      <ul className="mt-5 space-y-4">
        {visible.length === 0 && (
          <li className="rounded-xl border border-dashed border-zf-border bg-white p-8 text-center text-zf-muted">
            No hay consultas con ese estado.
          </li>
        )}
        {visible.map((i) => (
          <li key={i.id} className="rounded-xl border border-zf-border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-zf-muted">
                  {i.id} · {formatDate(i.createdAt)}
                </p>
                <p className="mt-0.5 font-bold text-zf-navy">{i.name}</p>
                <p className="text-sm text-zf-text">{i.contact}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded px-2 py-0.5 text-xs font-bold ${STATUS_CLS[i.status]}`}>
                  {i.status}
                </span>
                <label className="sr-only" htmlFor={`st-${i.id}`}>
                  Cambiar estado de {i.id}
                </label>
                <select
                  id={`st-${i.id}`}
                  value={i.status}
                  onChange={(e) =>
                    setRows((list) =>
                      list.map((r) =>
                        r.id === i.id ? { ...r, status: e.target.value as InquiryStatus } : r,
                      ),
                    )
                  }
                  className="h-10 rounded-lg border border-zf-border bg-white px-2 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="mt-3 text-zf-text">«{i.message}»</p>
            <p className="mt-3 text-sm text-zf-muted">
              Propiedad:{" "}
              <Link
                href={`/alquileres/${i.propertySlug}`}
                className="font-semibold text-zf-navy hover:underline"
              >
                {titles[i.propertySlug] ?? i.propertySlug}
              </Link>{" "}
              · Asignada a: {i.assignedTo ?? "sin asignar"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
