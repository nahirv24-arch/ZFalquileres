"use client";

import { useEffect } from "react";

/** Marca <html data-hydrated> cuando la app ya es interactiva (lo usan las pruebas E2E). */
export function HydrationMarker() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);
  return null;
}
