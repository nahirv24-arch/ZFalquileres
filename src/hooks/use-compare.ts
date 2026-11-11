"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Selección para el comparador: hasta 3 propiedades, guardada en este navegador. */
export const MAX_COMPARE = 3;
const KEY = "zf-compare";
const EVENT = "zf-compare-change";
const EMPTY: string[] = [];

let cacheRaw: string | null = null;
let cacheValue: string[] = EMPTY;

function read(): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return cacheValue;
  }
  if (raw === cacheRaw) return cacheValue;
  cacheRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cacheValue = Array.isArray(parsed)
      ? parsed.filter((s) => typeof s === "string").slice(0, MAX_COMPARE)
      : EMPTY;
  } catch {
    cacheValue = EMPTY;
  }
  return cacheValue;
}

function write(next: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Sin almacenamiento disponible: la selección vive solo en memoria.
    cacheRaw = JSON.stringify(next);
    cacheValue = next;
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useCompare() {
  const selected = useSyncExternalStore(subscribe, read, () => EMPTY);

  const toggle = useCallback((slug: string) => {
    const current = read();
    if (current.includes(slug)) write(current.filter((s) => s !== slug));
    else if (current.length < MAX_COMPARE) write([...current, slug]);
  }, []);

  const set = useCallback((slugs: string[]) => write(slugs.slice(0, MAX_COMPARE)), []);
  const clear = useCallback(() => write([]), []);

  return {
    selected,
    isSelected: (slug: string) => selected.includes(slug),
    isFull: selected.length >= MAX_COMPARE,
    toggle,
    set,
    clear,
  };
}
