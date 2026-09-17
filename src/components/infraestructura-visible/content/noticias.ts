export interface Noticia {
  slug: string;
  title: string;
  date: string; // ISO
  summary: string;
  body: string[];
}

export const noticias: Noticia[] = [
  {
    slug: "vuelve-infraestructura-visible",
    title: "Infraestructura Visible vuelve",
    date: "2026-09-16",
    summary:
      "El sitio original se cayó por falta de mantenimiento del dominio. El dataset sobrevivió, y con autorización del profesor Mauricio Sánchez-Silva, el proyecto vuelve a estar en línea — ahora dentro de SinergIA.",
    body: [
      "Infraestructura Visible nació como una iniciativa del profesor Mauricio Sánchez-Silva y el grupo de investigación GeoSI (Geomateriales y Sistemas de Infraestructura) del Departamento de Ingeniería Civil y Ambiental de la Universidad de los Andes. Su propósito era simple de enunciar y difícil de lograr: recolectar, centralizar y poner a disposición del público la información dispersa que distintas entidades del Estado colombiano manejan sobre infraestructura, y cruzarla con indicadores socioeconómicos — pobreza, educación, cobertura de servicios — para entender qué tanto la infraestructura del país realmente llega a donde más se necesita.",
      "El proyecto tuvo un impacto real y verificable. Durante varios años, el equipo apoyó el programa 'Obras por Impuestos' revisando y viabilizando más de 150 iniciativas en municipios ZOMAC — zonas especialmente afectadas por el conflicto armado —, entre ellas la construcción de puentes en el Catatumbo, vías terciarias, plantas de tratamiento de agua, sistemas de alcantarillado y saneamiento en colegios rurales. Ese trabajo le valió al proyecto el reconocimiento 'Dejar Huella' de la Universidad de los Andes, en la categoría de Proyectos de Investigación y Creación.",
      "Pero el sitio público, infraestructuravisible.org, dejó de mantenerse. El dominio venció y hoy ya ni siquiera resuelve — cualquiera que intente visitarlo se encuentra con un error de conexión, no con una página de error. El equipo de investigación detrás del proyecto nunca dejó de existir (el grupo GeoSI sigue activo), pero la cara pública del proyecto, y con ella el acceso libre a los datos que tanto trabajo costó recolectar, desapareció.",
      "Este es el regreso. Con la autorización del profesor Sánchez-Silva para usar el dataset original — recuperado íntegramente de un archivo que, por una descarga interrumpida, llegó a estar técnicamente corrupto — Infraestructura Visible vuelve a estar en línea. Esta vez no como un dominio aparte, sino como una sección dentro del sitio del Laboratorio SinergIA, con quien comparte tanto la casa (el Departamento de Ingeniería Civil y Ambiental) como la convicción de que los datos de infraestructura del país deberían ser fáciles de encontrar, entender y usar.",
      "Lo que hoy está disponible — el mapa interactivo en Visualiza, el índice completo de análisis originales en Explora, los primeros Especiales y los informes descargables en Biblioteca — es apenas el punto de partida. El plan es seguir ampliando el proyecto con datos actualizados y nuevos cruces, honrando el trabajo original y, con suerte, evitando que vuelva a apagarse.",
    ],
  },
];
