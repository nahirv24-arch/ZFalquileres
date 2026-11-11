import type { Inquiry } from "@/types/inquiry";

/** CONSULTAS FICTICIAS para el panel de demostración. No son personas reales. */
export const DEMO_INQUIRIES: Inquiry[] = [
  {
    id: "C-0007",
    createdAt: "2026-11-11T10:24:00-03:00",
    name: "Persona de ejemplo A",
    contact: "ejemplo-a@demo.test",
    propertySlug: "departamento-1-dormitorio-balcon-nueva-cordoba",
    message: "Vivo en Salta y me mudo en enero. ¿Entra una heladera de 1,85 m en la cocina?",
    status: "Nueva",
    assignedTo: null,
  },
  {
    id: "C-0006",
    createdAt: "2026-11-10T18:02:00-03:00",
    name: "Persona de ejemplo B",
    contact: "+54 9 351 000 0000 (ficticio)",
    propertySlug: "departamento-2-dormitorios-nueva-cordoba",
    message: "¿Se puede coordinar una videollamada para recorrer el departamento?",
    status: "En curso",
    assignedTo: "Agente de ejemplo",
  },
  {
    id: "C-0005",
    createdAt: "2026-11-09T09:40:00-03:00",
    name: "Persona de ejemplo C",
    contact: "ejemplo-c@demo.test",
    propertySlug: "monoambiente-general-paz",
    message: "¿Las expensas incluyen el agua?",
    status: "Respondida",
    assignedTo: "Agente de ejemplo",
  },
  {
    id: "C-0004",
    createdAt: "2026-11-08T16:15:00-03:00",
    name: "Persona de ejemplo D",
    contact: "ejemplo-d@demo.test",
    propertySlug: "departamento-2-dormitorios-balcon-cofico",
    message: "Tengo un perro mediano, ¿lo aceptan en el edificio?",
    status: "Nueva",
    assignedTo: null,
  },
];
