export interface LabZone {
  id: string;
  label: string;
  description: string;
  accent: string;
}

export const labZones: LabZone[] = [
  {
    id: "computo",
    label: "Cómputo para IA",
    description:
      "Servidores y GPUs dedicados al entrenamiento y evaluación de modelos de aprendizaje automático sobre datos urbanos y de infraestructura.",
    accent: "#ffde00",
  },
  {
    id: "analisis",
    label: "Estaciones de análisis de datos",
    description:
      "Puestos de trabajo para procesar imágenes satelitales, datos abiertos de ciudad y series de tiempo de sensores.",
    accent: "#ffde00",
  },
  {
    id: "instrumentacion",
    label: "Banco de instrumentación y sensores",
    description:
      "Montaje de ensayos físicos instrumentados — como el proyecto Mesa Vibratoria — con adquisición de datos en tiempo real.",
    accent: "#ffde00",
  },
  {
    id: "colaboracion",
    label: "Sala de colaboración",
    description:
      "Espacio para trabajo interdisciplinario con otros grupos del departamento, entidades públicas y aliados del sector privado.",
    accent: "#ffde00",
  },
  {
    id: "visualizacion",
    label: "Muro de visualización",
    description:
      "Pantalla para comunicar hallazgos, mapas y tableros de datos a tomadores de decisión y comunidades académicas.",
    accent: "#ffde00",
  },
  {
    id: "robots",
    label: "Robots",
    description:
      "Robots móviles e instrumentados para inspección de estructuras, captura de datos en campo y apoyo en tareas de construcción.",
    accent: "#ffde00",
  },
  {
    id: "drones",
    label: "Drones",
    description:
      "Captura aérea para inspección de puentes y viaductos, y generación de gemelos digitales desde el aire.",
    accent: "#ffde00",
  },
  {
    id: "camaras",
    label: "Cámaras",
    description:
      "Estaciones de captura visual y fotogrametría para alimentar los modelos de visión por computador del laboratorio.",
    accent: "#ffde00",
  },
];
