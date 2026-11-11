"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/types/property";

type Item = Photo & { local?: boolean };

/** Gestión visual de fotos: ordenar, elegir portada, quitar y previsualizar nuevas. Nada se sube (demo). */
export function MediaManager({ photos }: { photos: Photo[] }) {
  const [items, setItems] = useState<Item[]>(photos);
  const inputRef = useRef<HTMLInputElement>(null);
  const created = useRef<string[]>([]);

  useEffect(() => {
    const urls = created.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const move = (i: number, d: -1 | 1) =>
    setItems((list) => {
      const j = i + d;
      if (j < 0 || j >= list.length) return list;
      const copy = [...list];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const btn =
    "inline-flex min-h-9 items-center rounded-md border border-zf-border bg-white px-2 text-xs font-semibold text-zf-navy hover:bg-zf-navy-soft disabled:opacity-40";

  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((ph, i) => (
          <li key={ph.src} className="overflow-hidden rounded-xl border border-zf-border bg-white">
            <div className="relative aspect-[4/3] bg-zf-surface">
              {ph.local ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ph.src} alt={ph.alt} className="h-full w-full object-cover" />
              ) : (
                <Image src={ph.src} alt={ph.alt} fill sizes="300px" className="object-cover" />
              )}
              {i === 0 && (
                <span className="absolute left-2 top-2 rounded bg-zf-red px-2 py-0.5 text-xs font-bold text-white">
                  Portada
                </span>
              )}
              {ph.local && (
                <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs font-bold text-white">
                  Vista previa local
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="truncate text-sm text-zf-text">{ph.alt}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <button type="button" className={btn} disabled={i === 0} onClick={() => move(i, -1)}>
                  Subir<span className="sr-only"> {ph.alt}</span>
                </button>
                <button
                  type="button"
                  className={btn}
                  disabled={i === items.length - 1}
                  onClick={() => move(i, 1)}
                >
                  Bajar<span className="sr-only"> {ph.alt}</span>
                </button>
                <button
                  type="button"
                  className={btn}
                  disabled={i === 0}
                  onClick={() => setItems((l) => [l[i], ...l.filter((_, k) => k !== i)])}
                >
                  Usar de portada
                </button>
                <button
                  type="button"
                  className={`${btn} text-zf-red`}
                  disabled={items.length <= 1}
                  onClick={() => setItems((l) => l.filter((_, k) => k !== i))}
                >
                  Quitar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          id="add-photos"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            const added = files.map((f) => {
              const url = URL.createObjectURL(f);
              created.current.push(url);
              return { src: url, alt: f.name, credit: "Vista previa local", local: true };
            });
            setItems((l) => [...l, ...added]);
            e.target.value = "";
          }}
        />
        <label
          htmlFor="add-photos"
          className="inline-flex min-h-11 cursor-pointer items-center rounded-lg border-2 border-dashed border-zf-navy px-4 font-semibold text-zf-navy hover:bg-zf-navy-soft"
        >
          Agregar fotos (vista previa)
        </label>
        <p className="text-sm text-zf-muted">
          {items.length} fotos. Las fotos nuevas solo se previsualizan en este navegador: no se suben.
        </p>
      </div>
    </div>
  );
}
