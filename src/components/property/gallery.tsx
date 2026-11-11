"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/types/property";
import { IconChevronLeft, IconChevronRight, IconExpand, IconX } from "@/components/ui/icons";

/** Galería: foto principal, flechas, miniaturas y vista ampliada (dialog nativo, teclado y Escape). */
export function Gallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const count = photos.length;

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    dlg.addEventListener("keydown", onKey);
    return () => dlg.removeEventListener("keydown", onKey);
  }, [go]);

  if (count === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-2xl bg-zf-surface text-zf-muted">
        Sin fotos disponibles
      </div>
    );
  }

  const current = photos[index];
  const arrow =
    "absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-zf-navy shadow hover:bg-white";

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zf-surface">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover"
        />
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className={`${arrow} left-3`}>
              <IconChevronLeft size={22} />
              <span className="sr-only">Foto anterior</span>
            </button>
            <button type="button" onClick={() => go(1)} className={`${arrow} right-3`}>
              <IconChevronRight size={22} />
              <span className="sr-only">Foto siguiente</span>
            </button>
          </>
        )}
        <p
          className="absolute bottom-3 left-3 rounded-full bg-black/65 px-3 py-1 text-sm font-semibold text-white"
          aria-live="polite"
        >
          {index + 1} / {count}
          <span className="sr-only">: {current.alt}</span>
        </p>
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-lg bg-black/65 text-white hover:bg-black/80"
        >
          <IconExpand size={20} />
          <span className="sr-only">Ver foto ampliada</span>
        </button>
      </div>

      {count > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2" aria-label="Miniaturas">
          {photos.map((ph, i) => (
            <li key={ph.src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index}
                className={`relative block aspect-[4/3] w-full overflow-hidden rounded-lg border-2 ${
                  i === index ? "border-zf-red" : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <Image src={ph.src} alt="" fill sizes="120px" className="object-cover" />
                <span className="sr-only">
                  Foto {i + 1}: {ph.alt}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-xs text-zf-muted">{current.credit}</p>

      <dialog
        ref={dialogRef}
        aria-label={`Fotos de ${title}`}
        className="m-auto h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 text-white backdrop:bg-black/90"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-semibold">
              {index + 1} / {count} · {current.alt}
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <IconX size={24} />
              <span className="sr-only">Cerrar vista ampliada</span>
            </button>
          </div>
          <div className="relative flex-1">
            <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
            {count > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} className={`${arrow} left-4`}>
                  <IconChevronLeft size={22} />
                  <span className="sr-only">Foto anterior</span>
                </button>
                <button type="button" onClick={() => go(1)} className={`${arrow} right-4`}>
                  <IconChevronRight size={22} />
                  <span className="sr-only">Foto siguiente</span>
                </button>
              </>
            )}
          </div>
          <p className="px-4 py-3 text-center text-xs text-white/70">
            Usá las flechas del teclado para cambiar de foto y Escape para cerrar.
          </p>
        </div>
      </dialog>
    </div>
  );
}
