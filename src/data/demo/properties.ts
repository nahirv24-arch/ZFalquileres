import type { CostItem, FloorPlan, Photo, Property, UtilityService } from "@/types/property";
import { oneBedroomPlan, studioPlan, twoBedroomPlan } from "./floor-plans";

/**
 * PROPIEDADES FICTICIAS para la demostración.
 * No son ofertas reales de Zavalía & Fuster: precios, medidas, ubicaciones y fotos son ilustrativos.
 * Este módulo es la única fuente de datos de la demo; se reemplaza por el catálogo autorizado en la Etapa B.
 */

const UNSPLASH = "Foto ilustrativa · Unsplash (licencia libre)";
const REF = "Imagen de referencia del documento de diseño ZF";

const p = (file: string, alt: string, credit = UNSPLASH): Photo => ({
  src: `/demo/photos/${file}.jpg`,
  alt,
  credit,
});

const services = (opts: { gas?: boolean; waterInExpenses?: boolean } = {}): UtilityService[] => {
  const list: UtilityService[] = [
    {
      service: "Electricidad",
      provider: "EPEC",
      guideId: "electricidad",
      payer: "Inquilino",
      ownershipChange: "Consultar con ZF",
    },
  ];
  if (opts.gas !== false) {
    list.push({
      service: "Gas natural",
      provider: "Ecogas",
      guideId: "gas",
      payer: "Inquilino",
      ownershipChange: "Consultar con ZF",
    });
  }
  list.push(
    opts.waterInExpenses
      ? {
          service: "Agua",
          provider: "Aguas Cordobesas",
          guideId: "agua",
          payer: "Incluido en expensas",
          ownershipChange: "No aplica",
        }
      : {
          service: "Agua",
          provider: "Aguas Cordobesas",
          guideId: "agua",
          payer: "Inquilino",
          ownershipChange: "Consultar con ZF",
        },
  );
  return list;
};

const costs = (rent: number, expenses: number | null): CostItem[] => [
  { label: "Alquiler mensual", amount: rent, currency: "ARS", kind: "confirmado", note: "Valor de ejemplo" },
  {
    label: "Expensas",
    amount: expenses,
    currency: "ARS",
    kind: "estimado",
    note: expenses === null ? "No corresponde" : "Varían mes a mes según el consorcio",
  },
  {
    label: "Servicios (luz, gas, agua)",
    amount: null,
    currency: "ARS",
    kind: "estimado",
    note: "Según consumo",
  },
  {
    label: "Depósito en garantía",
    amount: null,
    currency: "ARS",
    kind: "estimado",
    note: "Condiciones a confirmar por ZF",
  },
  {
    label: "Honorarios inmobiliarios",
    amount: null,
    currency: "ARS",
    kind: "estimado",
    note: "Condiciones a confirmar por ZF",
  },
];

const areas = (plan: FloorPlan) => plan.coveredArea + plan.semiCoveredArea;

const ILLUSTRATIVE = { label: "Disponible (ilustrativo)", illustrative: true } as const;

const plan1 = oneBedroomPlan({
  notes: {
    cocina: "Nicho para heladera: 0,75 m de ancho × 1,90 m de alto (dato de ejemplo).",
    dormitorio: "Placard de 1,60 m de frente sobre la pared del pasillo.",
    balcon: "Baranda de vidrio; toma exterior.",
  },
});
const plan2 = twoBedroomPlan({ sx: 1.04, sy: 1.02, secondBath: true });
const plan3 = oneBedroomPlan({ sx: 0.97, sy: 1.05, balcony: false });
const plan4 = studioPlan({ notes: { cocina: "Anafe eléctrico; el edificio no tiene gas natural." } });
const plan5 = twoBedroomPlan({ sx: 0.98, sy: 1.0, balcony: false });
const plan6 = oneBedroomPlan({ sx: 0.92, sy: 0.95, balcony: true });
const plan7 = twoBedroomPlan({ sx: 1.06, sy: 1.05, balcony: true });

export const DEMO_PROPERTIES: Property[] = [
  {
    id: "demo-01",
    slug: "departamento-1-dormitorio-balcon-nueva-cordoba",
    isDemo: true,
    title: "Departamento 1 dormitorio con balcón",
    type: "Departamento",
    neighborhood: "Nueva Córdoba",
    addressDisplay: "Nueva Córdoba, Córdoba Capital · ubicación aproximada",
    approxLocation: { lat: -31.4255, lng: -64.187 },
    rent: { amount: 480000, currency: "ARS" },
    expenses: { amount: 85000, currency: "ARS" },
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    totalArea: areas(plan1),
    hasBalcony: true,
    orientation: "Noreste",
    floor: "6.º piso",
    petsAllowed: null,
    description:
      "Departamento luminoso a pocas cuadras del Parque Sarmiento y de la zona universitaria. Living con salida a balcón, cocina separada y dormitorio con placard. Ideal para una persona o pareja que se muda a Córdoba.",
    features: ["Balcón", "Placard", "Cocina separada", "Ascensor", "Agua caliente central"],
    photos: [
      p("ref-living-ventanal", "Living con ventanal hacia el balcón", REF),
      p("dormitorio-blanco", "Dormitorio con cama doble y ventana"),
      p("cocina-blanca", "Cocina con alacenas blancas"),
      p("bano-moderno", "Baño con mampara de vidrio"),
      p("ref-balcon", "Balcón con vista a la ciudad", REF),
    ],
    plan: plan1,
    tour3dUrl: null,
    videoUrl: null,
    costs: costs(480000, 85000),
    services: services({ waterInExpenses: true }),
    availability: ILLUSTRATIVE,
    publishedAt: "2026-11-08",
  },
  {
    id: "demo-02",
    slug: "departamento-2-dormitorios-nueva-cordoba",
    isDemo: true,
    title: "Departamento 2 dormitorios, 2 baños",
    type: "Departamento",
    neighborhood: "Nueva Córdoba",
    addressDisplay: "Nueva Córdoba, Córdoba Capital · ubicación aproximada",
    approxLocation: { lat: -31.4268, lng: -64.1852 },
    rent: { amount: 620000, currency: "ARS" },
    expenses: { amount: 110000, currency: "ARS" },
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    totalArea: areas(plan2),
    hasBalcony: true,
    orientation: "Norte",
    floor: "9.º piso",
    petsAllowed: true,
    description:
      "Amplio departamento con dos dormitorios, baño completo y baño en suite. Living comedor con balcón al norte. Edificio con amenities y seguridad.",
    features: ["Balcón", "Baño en suite", "Amenities", "Seguridad 24 h", "Acepta mascotas"],
    photos: [
      p("living-cuero", "Living comedor amplio con sillón de cuero"),
      p("cocina-oscura", "Cocina integrada con muebles oscuros"),
      p("dormitorio-claro", "Dormitorio principal claro"),
      p("dormitorio-gris", "Segundo dormitorio con escritorio"),
      p("bano-blanco", "Baño con ventana"),
    ],
    plan: plan2,
    tour3dUrl: null,
    videoUrl: null,
    costs: costs(620000, 110000),
    services: services(),
    availability: ILLUSTRATIVE,
    publishedAt: "2026-11-10",
  },
  {
    id: "demo-03",
    slug: "departamento-1-dormitorio-guemes",
    isDemo: true,
    title: "Departamento 1 dormitorio",
    type: "Departamento",
    neighborhood: "Güemes",
    addressDisplay: "Güemes, Córdoba Capital · ubicación aproximada",
    approxLocation: { lat: -31.427, lng: -64.194 },
    rent: { amount: 455000, currency: "ARS" },
    expenses: { amount: 70000, currency: "ARS" },
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    totalArea: areas(plan3),
    hasBalcony: false,
    orientation: "Este",
    floor: "3.er piso",
    petsAllowed: false,
    description:
      "Departamento reciclado en Güemes, cerca del Paseo de las Artes y de la calle Belgrano. Cocina con estantes abiertos y dormitorio con buena luz de mañana.",
    features: ["Reciclado", "Cocina separada", "Luz de mañana"],
    photos: [
      p("living-amplio", "Living con sillón y ventanales"),
      p("cocina-estantes", "Cocina con estantes abiertos"),
      p("dormitorio-naranja", "Dormitorio con cama doble"),
      p("bano-gris", "Baño moderno en tonos grises"),
    ],
    plan: plan3,
    tour3dUrl: null,
    videoUrl: null,
    costs: costs(455000, 70000),
    services: services(),
    availability: ILLUSTRATIVE,
    publishedAt: "2026-11-05",
  },
  {
    id: "demo-04",
    slug: "monoambiente-general-paz",
    isDemo: true,
    title: "Monoambiente con cocina separada",
    type: "Monoambiente",
    neighborhood: "General Paz",
    addressDisplay: "General Paz, Córdoba Capital · ubicación aproximada",
    approxLocation: { lat: -31.4085, lng: -64.17 },
    rent: { amount: 310000, currency: "ARS" },
    expenses: { amount: 45000, currency: "ARS" },
    rooms: 1,
    bedrooms: 0,
    bathrooms: 1,
    totalArea: areas(plan4),
    hasBalcony: false,
    orientation: "Oeste",
    floor: "2.º piso",
    petsAllowed: null,
    description:
      "Monoambiente práctico en General Paz, sobre una calle tranquila y cerca de bares y comercios. Cocina separada con anafe eléctrico.",
    features: ["Cocina separada", "Anafe eléctrico", "Bajas expensas"],
    photos: [
      p("living-simple", "Ambiente principal con sillón y cómoda"),
      p("cocina-comedor", "Cocina con barra"),
      p("living-azul", "Ambiente con sillón azul y piso de madera"),
    ],
    plan: plan4,
    tour3dUrl: null,
    videoUrl: null,
    costs: costs(310000, 45000),
    services: services({ gas: false }),
    availability: ILLUSTRATIVE,
    publishedAt: "2026-11-02",
  },
  {
    id: "demo-05",
    slug: "departamento-2-dormitorios-alta-cordoba",
    isDemo: true,
    title: "Departamento 2 dormitorios",
    type: "Departamento",
    neighborhood: "Alta Córdoba",
    addressDisplay: "Alta Córdoba, Córdoba Capital · ubicación aproximada",
    approxLocation: { lat: -31.396, lng: -64.185 },
    rent: { amount: 520000, currency: "ARS" },
    expenses: { amount: 60000, currency: "ARS" },
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    totalArea: areas(plan5),
    hasBalcony: false,
    orientation: "Sur",
    floor: "1.er piso",
    petsAllowed: true,
    description:
      "Departamento de dos dormitorios en un edificio bajo de Alta Córdoba. Barrio residencial con buena conexión de colectivos al centro.",
    features: ["Edificio bajo", "Acepta mascotas", "Cocina separada"],
    photos: [
      p("edificio-balcones", "Frente de edificio residencial de baja altura"),
      p("living-calido", "Living con luz natural"),
      p("cocina-isla", "Cocina con mesada de mármol"),
      p("comedor-verde", "Comedor con sillas verdes"),
    ],
    plan: plan5,
    tour3dUrl: null,
    videoUrl: null,
    costs: costs(520000, 60000),
    services: services(),
    availability: ILLUSTRATIVE,
    publishedAt: "2026-10-30",
  },
  {
    id: "demo-06",
    slug: "departamento-1-dormitorio-centro",
    isDemo: true,
    title: "Departamento 1 dormitorio con balcón",
    type: "Departamento",
    neighborhood: "Centro",
    addressDisplay: "Centro, Córdoba Capital · ubicación aproximada",
    approxLocation: { lat: -31.417, lng: -64.184 },
    rent: { amount: 400000, currency: "ARS" },
    expenses: { amount: 75000, currency: "ARS" },
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    totalArea: areas(plan6),
    hasBalcony: true,
    orientation: "Noroeste",
    floor: "11.º piso",
    petsAllowed: false,
    description:
      "Departamento en el centro, a metros de la peatonal y de las principales líneas de transporte. Balcón con vista abierta.",
    features: ["Balcón", "Vista abierta", "Cerca del transporte"],
    photos: [
      p("living-cocina-integrada", "Living con cocina integrada"),
      p("living-luminoso", "Living luminoso con ventanales"),
      p("living-sillon-celeste", "Rincón de estar con sillón celeste"),
    ],
    plan: plan6,
    tour3dUrl: null,
    videoUrl: null,
    costs: costs(400000, 75000),
    services: services({ waterInExpenses: true }),
    availability: ILLUSTRATIVE,
    publishedAt: "2026-11-09",
  },
  {
    id: "demo-07",
    slug: "departamento-2-dormitorios-balcon-cofico",
    isDemo: true,
    title: "Departamento 2 dormitorios con balcón",
    type: "Departamento",
    neighborhood: "Cofico",
    addressDisplay: "Cofico, Córdoba Capital · ubicación aproximada",
    approxLocation: { lat: -31.4, lng: -64.18 },
    rent: { amount: 580000, currency: "ARS" },
    expenses: { amount: 90000, currency: "ARS" },
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    totalArea: areas(plan7),
    hasBalcony: true,
    orientation: "Noreste",
    floor: "4.º piso",
    petsAllowed: true,
    description:
      "Departamento amplio en Cofico, cerca del Parque de las Tejas y del centro. Dos dormitorios, living comedor con balcón y lavadero.",
    features: ["Balcón", "Lavadero", "Acepta mascotas", "Living amplio"],
    photos: [
      p("living-plantas", "Living con plantas y biblioteca"),
      p("comedor-madera", "Comedor con mesa de madera"),
      p("living-biblioteca", "Living con biblioteca y sillón verde"),
    ],
    plan: plan7,
    tour3dUrl: null,
    videoUrl: null,
    costs: costs(580000, 90000),
    services: services(),
    availability: ILLUSTRATIVE,
    publishedAt: "2026-11-07",
  },
];

/** Barrios con su descripción para la sección de ubicación (texto general, sin cifras inventadas). */
export const NEIGHBORHOOD_INFO: Record<string, string> = {
  "Nueva Córdoba":
    "Barrio céntrico y universitario, con el Parque Sarmiento, el Paseo del Buen Pastor y gran oferta de comercios.",
  Güemes: "Barrio tradicional con ferias, anticuarios y vida nocturna, junto a la Cañada.",
  "General Paz": "Barrio residencial con calles arboladas, bares y comercios, al este del centro.",
  "Alta Córdoba": "Barrio residencial al norte del río Suquía, con casas antiguas y edificios bajos.",
  Centro:
    "Casco histórico con la peatonal, oficinas, comercios y la mayor concentración de transporte público.",
  Cofico: "Barrio residencial cercano al centro y a Alta Córdoba, con edificios bajos y medianos.",
};
