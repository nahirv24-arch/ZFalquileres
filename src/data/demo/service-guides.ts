/**
 * Guías informativas de servicios (RF-017 a RF-019).
 * Contenido ORIENTATIVO: los requisitos exactos los define cada prestador y pueden cambiar.
 * Los sitios oficiales se verificaron (responden) el 2026-11-11; los trámites puntuales deben
 * revisarse con el prestador antes de publicar en producción (D-10).
 */
export interface ServiceGuide {
  id: "electricidad" | "gas" | "agua";
  service: string;
  provider: string;
  officialUrl: string;
  summary: string;
  whenNeeded: string;
  usualDocuments: string[];
  steps: string[];
  reviewedAt: string;
}

export const SERVICE_GUIDES: ServiceGuide[] = [
  {
    id: "electricidad",
    service: "Electricidad",
    provider: "EPEC",
    officialUrl: "https://www.epec.com.ar/",
    summary:
      "En Córdoba Capital el servicio eléctrico lo presta EPEC. Al alquilar, conviene confirmar con ZF si el suministro queda a tu nombre o si sigue a nombre del propietario.",
    whenNeeded: "Cuando el contrato indica que el inquilino es titular o responsable del servicio.",
    usualDocuments: [
      "DNI de la persona que será titular",
      "Contrato de alquiler firmado",
      "Número de cliente o suministro (figura en una factura anterior)",
    ],
    steps: [
      "Pedile a ZF una factura reciente o el número de suministro del inmueble.",
      "Ingresá al sitio oficial de EPEC y buscá la sección de trámites o atención al cliente.",
      "Elegí la gestión que corresponda (cambio de titularidad o actualización de datos) y seguí las indicaciones.",
      "Guardá el número de trámite y avisale a ZF cuando esté hecho.",
    ],
    reviewedAt: "2026-11-11",
  },
  {
    id: "gas",
    service: "Gas natural",
    provider: "Ecogas",
    officialUrl: "https://www.ecogas.com.ar/",
    summary:
      "El gas natural por red lo distribuye Ecogas. Algunos edificios no tienen gas natural: en ese caso, la ficha de la propiedad no muestra este servicio.",
    whenNeeded:
      "Solo si el inmueble tiene conexión de gas natural y el contrato lo pone a cargo del inquilino.",
    usualDocuments: [
      "DNI de la persona que será titular",
      "Contrato de alquiler firmado",
      "Número de cliente (figura en una factura anterior)",
    ],
    steps: [
      "Confirmá con ZF si el inmueble tiene gas natural y quién figura como titular.",
      "Consultá en el sitio oficial de Ecogas los canales de atención para cambios de titularidad.",
      "Presentá la documentación que te pidan y guardá el comprobante.",
    ],
    reviewedAt: "2026-11-11",
  },
  {
    id: "agua",
    service: "Agua",
    provider: "Aguas Cordobesas",
    officialUrl: "https://www.aguascordobesas.com.ar/",
    summary:
      "En la ciudad de Córdoba el agua la presta Aguas Cordobesas. En muchos edificios el agua se paga dentro de las expensas y no hace falta ningún trámite.",
    whenNeeded: "Solo si el inmueble tiene medidor propio y el contrato lo pone a cargo del inquilino.",
    usualDocuments: [
      "DNI de la persona que será titular",
      "Contrato de alquiler firmado",
      "Número de cuenta o de cliente del inmueble",
    ],
    steps: [
      "Revisá en la ficha si el agua está incluida en las expensas.",
      "Si no lo está, pedile a ZF el número de cuenta del inmueble.",
      "Consultá en el sitio oficial de Aguas Cordobesas cómo actualizar la titularidad.",
    ],
    reviewedAt: "2026-11-11",
  },
];

export const MOVING_TIPS: { title: string; text: string }[] = [
  {
    title: "Medí tus muebles antes de mudarte",
    text: "Compará el tamaño de tu heladera, cama y sillón con las medidas de cada ambiente que figuran en el plano de la ficha.",
  },
  {
    title: "Confirmá quién paga cada servicio",
    text: "La ficha indica si cada servicio lo paga el inquilino, el propietario o si está incluido en las expensas.",
  },
  {
    title: "Pedí las lecturas de los medidores",
    text: "El día de la entrega de llaves, registrá con fotos los medidores de luz, gas y agua.",
  },
  {
    title: "Consultá el reglamento del edificio",
    text: "Horarios de mudanza, uso del ascensor y mascotas: conviene saberlo antes de contratar el flete.",
  },
];
