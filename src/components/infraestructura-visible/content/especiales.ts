export interface Especial {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  body: string[];
  relatedHref: string;
  relatedLabel: string;
}

export const especiales: Especial[] = [
  {
    slug: "competitividad-regional",
    title: "Lo que separa a Bogotá del resto del país",
    eyebrow: "Competitividad",
    summary:
      "El Índice Departamental de Competitividad 2018 pone a Bogotá casi 50 puntos por delante del departamento peor ubicado. Los datos muestran dónde está esa brecha.",
    body: [
      "El Índice Departamental de Competitividad (IDC), construido por el Consejo Privado de Competitividad y el CEPEC de la Universidad del Rosario, resume en un solo puntaje —de 0 a 100— qué tan bien está posicionado cada departamento en factores como instituciones, infraestructura, salud, educación y sofisticación empresarial.",
      "En la edición 2018, Bogotá encabeza el listado con 83,4 puntos, seguida de Antioquia (67,0), Santander (63,0), Atlántico (61,4) y Valle del Cauca (61,3). En el otro extremo están los departamentos de la Amazonía y la Orinoquía: Amazonas (35,2), Guainía (30,6), Chocó (30,0), Vaupés (27,5) y Vichada, último con 26,2 puntos.",
      "La brecha entre el primer y el último lugar es de 57,2 puntos — Bogotá compite, en la práctica, en una liga distinta a la de buena parte del territorio nacional.",
      "Un patrón se repite entre los departamentos mejor ubicados (fuera de Bogotá, que por su naturaleza de ciudad-departamento es un caso aparte): tienden a tener una red vial primaria y secundaria mucho más densa. Caldas, Risaralda y Cundinamarca — todos en el top 10 de competitividad — superan los 170 km de vía por cada 1.000 km² de territorio. Amazonas, Guainía y Vaupés, en el fondo de la tabla de competitividad, no llegan ni a 2 km por cada 1.000 km².",
      "No es una prueba de causalidad, pero sí es exactamente el tipo de correlación que el proyecto original Infraestructura Visible buscaba hacer visible: la infraestructura y el desarrollo económico avanzan juntos, o se quedan juntos.",
    ],
    relatedHref: "/infraestructura-visible/visualiza",
    relatedLabel: "Ver competitividad y densidad vial en el mapa",
  },
  {
    slug: "vias-y-pobreza",
    title: "Vías y pobreza: el patrón que confirman los datos",
    eyebrow: "Infraestructura y pobreza",
    summary:
      "Los tres departamentos con menor densidad vial del país también están entre los cinco con mayor pobreza multidimensional. La coincidencia no es casualidad.",
    body: [
      "El Índice de Pobreza Multidimensional (IPM) del DANE mide, más allá del ingreso, si un hogar tiene acceso a educación, salud, condiciones de vivienda adecuadas y trabajo formal. En 2018, los departamentos con mayor pobreza multidimensional eran Guainía (65,0%), Vaupés (59,4%), Vichada (55,0%), La Guajira (51,4%) y Chocó (45,1%). En el extremo opuesto, Bogotá (4,4%), San Andrés (8,9%) y Cundinamarca (11,5%) tienen la menor incidencia.",
      "Cuando se cruza esa lista con la densidad de la red vial primaria y secundaria por departamento, la coincidencia es difícil de ignorar: Guainía, Vaupés y Chocó — tres de los cinco departamentos más pobres del país — están también entre los cinco con menor densidad vial de Colombia, todos por debajo de 8,2 km de vía por cada 1.000 km² de territorio.",
      "Este cruce fue, de hecho, uno de los análisis originales del proyecto Infraestructura Visible (entregable '0018 — Densidad de vías vs. Pobreza'). La lectura que proponía entonces el equipo del profesor Mauricio Sánchez-Silva sigue siendo válida hoy: sin una red vial que conecte un territorio, es mucho más difícil que la actividad económica, los servicios públicos y las oportunidades lleguen a él.",
      "Es también, casi punto por punto, la región donde se ha concentrado buena parte del trabajo del equipo de Infraestructura Visible en el programa Obras por Impuestos — vías terciarias, puentes y saneamiento en municipios ZOMAC — precisamente los territorios que estos datos señalan como los más desconectados del resto del país.",
    ],
    relatedHref: "/infraestructura-visible/visualiza",
    relatedLabel: "Ver pobreza y densidad vial en el mapa",
  },
];
