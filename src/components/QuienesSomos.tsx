"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Mail, ExternalLink } from "lucide-react";
import { easeApple } from "@/lib/motion";
import { Tabs, type TabItem } from "./Tabs";

const researchGroups = [
  {
    acronym: "IN2GECO",
    name: "Grupo de Investigación en Ingeniería y Gerencia de la Construcción",
    desc: "Sistemas de integración de proyectos, sostenibilidad del entorno construido, producción y calidad, e innovación en gerencia de proyectos de construcción.",
    director: "PhD. José Alberto Guevara Maldonado",
    // ingeco.uniandes.edu.co (sitio oficial citado por el departamento) está caído; se enlaza
    // la página del grupo dentro del sitio de la Facultad de Ingeniería como alternativa estable.
    url: "https://ingenieria.uniandes.edu.co/es/vicedecanatura-investigacion-innovacion/investigacion/grupos-investigacion",
    logo: "/logos-grupos/in2geco.png",
  },
  {
    acronym: "GeoIngenIA",
    name: "Geomática e IA en Sistemas Ambientales y de Infraestructura Sostenible",
    desc: "Grupo de investigación que aplica geomática e inteligencia artificial al análisis de sistemas ambientales y de infraestructura — percepción remota, datos geoespaciales y modelos de IA para entender y gestionar el territorio.",
    logo: "/logos-grupos/geoingenia.png",
  },
  {
    acronym: "CIMOC",
    name: "Centro de Investigación en Materiales y Obras Civiles",
    desc: "Análisis, diseño y comportamiento de materiales e infraestructura vial; desarrollo de nuevas tecnologías y herramientas de análisis y diseño.",
    director: "PhD. Juan Carlos Reyes Ortiz",
    url: "https://cimoc.uniandes.edu.co/",
    logo: "/logos-grupos/cimoc.png",
  },
  {
    acronym: "GEOSI",
    name: "Grupo de Investigación en Geomateriales y Sistemas de Infraestructura",
    desc: "Comportamiento mecánico de suelos, rocas y materiales granulares; estructuras geotécnicas; modelación estocástica de sistemas de infraestructura.",
    director: "PhD. Miguel Ángel Cabrera",
    url: "https://geosi.uniandes.edu.co/",
    logo: null,
  },
  {
    acronym: "CIIA",
    name: "Centro de Investigaciones en Ingeniería Ambiental",
    desc: "Calidad del aire, hidrosistemas y ecosistemas, manejo de residuos sólidos y peligrosos, hidrología y variabilidad climática, y salud ambiental.",
    director: "PhD. Ricardo Morales Betancourt",
    url: "https://ciia.uniandes.edu.co/",
    logo: "/logos-grupos/ciia.svg",
  },
  {
    acronym: "CIACUA",
    name: "Centro de Investigaciones en Acueductos y Alcantarillados",
    desc: "Investigación aplicada en recursos hídricos e infraestructura de acueducto, alcantarillado y sistemas de agua potable y saneamiento.",
    director: "Prof. Juan Guillermo Saldarriaga Valderrama",
    url: "https://ciacua.uniandes.edu.co/",
    logo: "/logos-grupos/ciacua.png",
  },
  {
    acronym: "SUR",
    name: "Grupo de Estudios en Sostenibilidad Urbana y Regional",
    desc: "Planeación urbana y regional, movilidad y transporte, calidad ambiental, modelación espacial y hábitat sostenible.",
    director: "PhD. Álvaro Rodríguez Valencia",
    url: "https://sur.uniandes.edu.co/",
    logo: null,
  },
  {
    acronym: "COLIVRI",
    name: "Colaboratorio de Interacción, Visualización, Robótica y Sistemas Autónomos",
    desc: "Espacio colaborativo interdepartamental para realidad virtual y aumentada, interfaces humano-máquina, procesamiento de imágenes y robótica — 250 m² de equipos de conectividad, cómputo, visualización, robótica e interacción.",
    url: "https://colivri.uniandes.edu.co/",
    logo: "/logos-grupos/colivri.png",
  },
];

const physicalLabs = [
  "Modelos Estructurales (ML-029)",
  "Calidad del Aire (ML-417)",
  "Biorreactores (ML-419)",
  "Hidráulica y Sistemas de Alcantarillado (ML-033/034)",
  "Análisis Químico Instrumental (ML-421)",
  "Análisis Químico Ambiental (ML-415)",
  "Modelos Geotécnicos (ML-038)",
  "Análisis Mecánico de Pavimentos (ML-031)",
  "Suelos (ML-106)",
];

interface TeamMember {
  id: string;
  photo: string;
  eyebrow: string;
  name: string;
  desc: string[];
  lines: string[];
  facts: { label: string; value: string }[];
  links: { label: string; href: string }[];
  groupLogo?: { src: string; alt: string };
}

const team: TeamMember[] = [
  {
    id: "nelly-garcia",
    photo: "/team/nelly-garcia.jpg",
    eyebrow: "Profesora asistente",
    name: "Nelly García López",
    desc: [
      "Investiga cómo las personas, los procesos y las tecnologías interactúan para mejorar la colaboración, el desempeño de los proyectos y la sostenibilidad del entorno construido. Su trabajo integra ingeniería y gestión de la construcción, gestión de procesos y tecnología, a lo largo del diseño, la construcción y la operación. Hace parte del grupo IN2GECO del Departamento de Ingeniería Civil y Ambiental.",
    ],
    lines: [
      "Informática de la construcción, BIM y gemelos digitales",
      "Lean construction y sistemas de producción",
      "Construcción industrializada y Construcción 4.0/5.0",
      "Economía circular y sostenibilidad del entorno construido",
    ],
    facts: [
      { label: "Doctorado", value: "Stanford University" },
      { label: "Maestría", value: "Stanford University · Uniandes" },
      { label: "Pregrado", value: "Universidad de los Andes" },
      { label: "Grupo de investigación", value: "IN2GECO" },
    ],
    links: [
      { label: "ne-garci@uniandes.edu.co", href: "mailto:ne-garci@uniandes.edu.co" },
      {
        label: "Perfil en el departamento",
        href: "https://civilyambiental.uniandes.edu.co/en/professors/nelly-paola-garcia-lopez",
      },
    ],
    groupLogo: { src: "/logos-grupos/in2geco.png", alt: "IN2GECO, Investigación en Ingeniería y Gerencia de la Construcción" },
  },
  {
    id: "juan-sebastian-hernandez",
    photo: "/team/juan-sebastian-hernandez.jpg",
    eyebrow: "Profesor asistente",
    name: "Juan Sebastián Hernández Suárez",
    desc: [
      "Juan Sebastián es ingeniero civil con maestría en Ingeniería - Recursos Hidráulicos de la Universidad Nacional de Colombia, y doctor en Ingeniería de Biosistemas de Michigan State University. Recientemente fue investigador posdoctoral en la Universidad de Stanford, estudiando mercados de agua y sus efectos sobre la salud de los ecosistemas acuáticos. En Colombia ha trabajado con el Ministerio de Ambiente y Desarrollo Sostenible y la Autoridad Nacional de Licencias Ambientales en temas de caudales ambientales, regulación hídrica y gestión integral del agua.",
      "Como profesor asistente de la Universidad de los Andes, continúa utilizando modelación numérica, inteligencia artificial, sistemas de información geográfica y métodos evolucionarios de optimización multiobjetivo para entender y simular sistemas humanos y naturales acoplados en un contexto de variabilidad y cambio climático — con el fin de asistir la toma de decisiones multicriterio, el diseño de infraestructura civil y la formulación de políticas públicas. Le interesan particularmente las dinámicas multisectoriales en la intersección entre seguridad hídrica, alimentaria y energética, infraestructura civil y biodiversidad.",
      "Dirige los laboratorios de Geomática y de Hidráulica del departamento. Dicta Sistemas de Información Geográfica en pregrado, y modelación de sistemas y procesos hidrológicos, modelación de hidrosistemas y gestión de recursos hídricos en los programas de posgrado. Hace parte del grupo de investigación GeoIngenIA.",
    ],
    lines: [
      "Modelación hidrológica y de sistemas de recursos hídricos",
      "Seguridad hídrica, alimentaria y energética, e infraestructura civil",
      "Optimización multiobjetivo e inteligencia artificial aplicadas al agua",
      "Modelación de mercados de derechos de agua y sistemas de información geográfica",
    ],
    facts: [
      { label: "Doctorado", value: "Michigan State University (Biosystems Eng.)" },
      { label: "Posdoctorado", value: "Stanford University" },
      { label: "Maestría", value: "Universidad Nacional de Colombia" },
      { label: "Dirige", value: "Laboratorios de Geomática e Hidráulica" },
      { label: "Grupo de investigación", value: "GeoIngenIA" },
    ],
    links: [
      { label: "js.hernandezs@uniandes.edu.co", href: "mailto:js.hernandezs@uniandes.edu.co" },
      { label: "Perfil académico", href: "https://academia.uniandes.edu.co/js.hernandezs" },
    ],
    groupLogo: { src: "/logos-grupos/geoingenia.png", alt: "GeoIngenIA, Geomática e IA en Sistemas Ambientales y de Infraestructura Sostenible" },
  },
  {
    id: "luis-carlos-galvan",
    photo: "/team/luis-galvan.jpg",
    eyebrow: "Asistente graduado de investigación",
    name: "Luis Carlos Galvan",
    desc: [
      "Ingeniero civil con conocimientos en ingeniería de sistemas y robótica. Actualmente cursa la Maestría en Inteligencia Artificial y Datos aplicada a infraestructura del Departamento de Ingeniería Civil y Ambiental. Hace parte del grupo de investigación IN2GECO (Ingeniería y Gerencia de la Construcción).",
      "Apoya al laboratorio con investigación y conocimientos avanzados en inteligencia artificial y desarrollo web — incluyendo la construcción de este sitio y de la plataforma Infraestructura Visible.",
    ],
    lines: [
      "Inteligencia artificial aplicada a infraestructura y ciudades",
      "Desarrollo web y visualización de datos geoespaciales",
      "Ingeniería de sistemas y robótica",
      "Modelos de datos e infraestructura de información",
    ],
    facts: [
      { label: "Pregrado", value: "Ingeniería Civil" },
      { label: "Maestría (en curso)", value: "IA y Datos aplicada a Infraestructura" },
      { label: "Conocimientos", value: "Ingeniería de sistemas · Robótica" },
      { label: "Enfoque", value: "Inteligencia artificial · Desarrollo web" },
      { label: "Grupo de investigación", value: "IN2GECO" },
    ],
    links: [
      { label: "l.galvan@uniandes.edu.co", href: "mailto:l.galvan@uniandes.edu.co" },
      { label: "GitHub", href: "https://github.com/lgalvanbr" },
    ],
    groupLogo: { src: "/logos-grupos/in2geco.png", alt: "IN2GECO, Investigación en Ingeniería y Gerencia de la Construcción" },
  },
  {
    id: "juan-sebastian-geoingenia",
    photo: "/team/colega-geoingenia.jpg",
    eyebrow: "Asistente graduado de investigación",
    name: "Juan Sebastián Rodríguez",
    desc: [
      "Ingeniero electrónico con conocimientos y experiencia en ingeniería de sistemas, automatización industrial, inteligencia artificial y ciencia de datos. Su experiencia integra el desarrollo de soluciones tecnológicas, incluyendo construcción y gestión de bases de datos, desarrollo de aplicaciones web y análisis de información, utilizando tecnologías como HTML, Python y herramientas de procesamiento de datos.",
      "Actualmente desarrolla investigación en áreas relacionadas con inteligencia artificial, Deep Learning, análisis de datos e integración de tecnologías de captura y análisis espacial, incluyendo el uso de sensores LiDAR e información geoespacial para el desarrollo de soluciones aplicadas a la ingeniería. Hace parte del grupo de investigación GeoIngenIA.",
    ],
    lines: [
      "Inteligencia artificial y Deep Learning",
      "Ciencia de datos y análisis de información",
      "Automatización industrial e ingeniería de sistemas",
      "Captura y análisis espacial: sensores LiDAR e información geoespacial",
    ],
    facts: [
      { label: "Maestría", value: "Ingeniería de la Información — Uniandes" },
      { label: "Pregrado", value: "Ing. Electrónica — U. Santo Tomás, Tunja" },
      { label: "Grupo de investigación", value: "GeoIngenIA" },
      { label: "Conocimientos", value: "Bases de datos · Desarrollo web · Python" },
    ],
    links: [],
    groupLogo: { src: "/logos-grupos/geoingenia.png", alt: "GeoIngenIA, Geomática e IA en Sistemas Ambientales y de Infraestructura Sostenible" },
  },
];

/**
 * Same "selectable card grid + detail panel below" pattern already used for
 * /proyectos (see Proyectos.tsx + AmbianceStage) — reused here on purpose so
 * the team grid stays a UNIFORM height (just a portrait photo + name/role)
 * no matter how long any one person's bio is, instead of stretching or
 * cramping neighboring cards to match whichever bio happens to be longest.
 */
function TeamShowcase() {
  const [activeId, setActiveId] = useState(team[0].id);
  const active = team.find((p) => p.id === activeId) ?? team[0];

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {team.map((p) => {
          const isActive = p.id === activeId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveId(p.id)}
              aria-pressed={isActive}
              className={`text-left rounded-2xl overflow-hidden border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                isActive ? "border-black" : "border-border-soft hover:border-border-strong"
              }`}
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-background-subtle">
                {/* eslint-disable-next-line @next/next/no-img-element -- matches the plain <img> pattern already used for research-group logos in this file */}
                <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className={`p-3 sm:p-4 ${isActive ? "bg-black" : "bg-white"}`}>
                <p
                  className={`text-[11px] font-medium tracking-[0.1em] uppercase mb-1 ${
                    isActive ? "text-yellow" : "text-yellow-ink"
                  }`}
                >
                  {p.eyebrow}
                </p>
                <h3
                  className={`text-[13px] sm:text-[15px] font-semibold leading-snug ${
                    isActive ? "text-white" : "text-black"
                  }`}
                >
                  {p.name}
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      <motion.div
        key={active.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: easeApple }}
        className="p-6 sm:p-8 rounded-2xl bg-background-subtle border border-border-soft"
      >
        <div className="mb-6 max-w-2xl space-y-3">
          {active.desc.map((p, i) => (
            <p key={i} className="text-[15px] sm:text-base text-foreground-secondary leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_14rem] gap-8">
          <div>
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-foreground-secondary mb-3">
              Líneas de investigación
            </p>
            <ul className="space-y-2">
              {active.lines.map((line) => (
                <li
                  key={line}
                  className="pl-4 border-l-2 border-yellow text-[15px] text-foreground-secondary leading-relaxed"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            {active.groupLogo && (
              <div className="pb-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- matches the plain <img> pattern already used for research-group logos in this file */}
                <img
                  src={active.groupLogo.src}
                  alt={active.groupLogo.alt}
                  className="max-h-24 max-w-full h-auto w-auto mix-blend-multiply"
                />
              </div>
            )}
            {active.facts.map((f) => (
              <div key={f.label}>
                <p className="text-xs font-medium tracking-[0.1em] uppercase text-foreground-secondary">
                  {f.label}
                </p>
                <p className="text-[15px] text-black">{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        {active.links.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-6 mt-6 border-t border-black/10">
            {active.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className="inline-flex items-center gap-1.5 text-[15px] font-medium text-black underline decoration-yellow decoration-4 underline-offset-4 hover:decoration-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded"
              >
                {link.href.startsWith("mailto:") ? (
                  <Mail className="w-4 h-4" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                {link.label}
              </a>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

const tabs: TabItem[] = [
  {
    id: "equipo",
    label: "Equipo",
    content: (
      <div>
        <TeamShowcase />

        <div className="pt-8">
          <p className="text-[15px] sm:text-base text-foreground-secondary leading-relaxed mb-4">
            El resto del equipo — estudiantes, investigadores y aliados que se suman al
            laboratorio — se irá publicando aquí a medida que se confirme su participación.
          </p>
          <a
            href="mailto:sinergia@uniandes.edu.co"
            className="inline-flex items-center gap-2 text-[15px] font-medium text-black underline decoration-yellow decoration-4 underline-offset-4 hover:decoration-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded"
          >
            <Mail className="w-4 h-4" />
            Escríbenos si quieres unirte
          </a>
        </div>
      </div>
    ),
  },
  {
    id: "colaboracion",
    label: "Colaboración",
    content: (
      <div className="max-w-3xl">
        <p className="text-[15px] sm:text-base text-foreground-secondary leading-relaxed mb-8 max-w-2xl">
          SinergIA trabaja de la mano de los centros y grupos de investigación del Departamento de
          Ingeniería Civil y Ambiental, y se apoya en su infraestructura de laboratorios físicos
          para validar los modelos que desarrolla.
        </p>

        <p className="text-xs font-medium tracking-[0.1em] uppercase text-foreground-secondary mb-3">
          Grupos y centros de investigación del departamento
        </p>
        <dl className="border-t border-l border-black/10 mb-10">
          {researchGroups.map((g) => (
            <div
              key={g.acronym}
              className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-3 sm:gap-6 p-5 border-r border-b border-black/10"
            >
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                {g.logo ? (
                  <>
                    <dt className="sr-only">{g.acronym}</dt>
                    {/* eslint-disable-next-line @next/next/no-img-element -- matches the plain <img> pattern already used for research-group logos in this file */}
                    <img
                      src={g.logo}
                      alt={`Logo de ${g.acronym}`}
                      className="w-40 max-w-full max-h-20 object-contain object-left"
                    />
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center h-8 px-2 border border-black/10 rounded text-[11px] font-semibold tracking-wide text-black">
                      {g.acronym}
                    </div>
                    <dt className="text-base font-semibold text-black">{g.acronym}</dt>
                  </>
                )}
              </div>
              <dd className="text-[15px] text-foreground-secondary leading-relaxed">
                <span className="text-black">{g.name}.</span> {g.desc}
                {g.director && (
                  <>
                    {" "}
                    <span className="text-foreground-secondary/80">Dirige {g.director}.</span>
                  </>
                )}
                {g.url && (
                  <div className="mt-2">
                    <a
                      href={g.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-black underline decoration-yellow decoration-4 underline-offset-4 hover:decoration-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Sitio web
                    </a>
                  </div>
                )}
              </dd>
            </div>
          ))}
        </dl>

        <p className="text-xs font-medium tracking-[0.1em] uppercase text-foreground-secondary mb-3">
          Laboratorios físicos del departamento
        </p>
        <ul className="flex flex-wrap gap-2 mb-8">
          {physicalLabs.map((lab) => (
            <li
              key={lab}
              className="text-[13px] text-foreground-secondary border border-black/10 rounded-full px-3 py-1.5"
            >
              {lab}
            </li>
          ))}
        </ul>

        <p className="text-[15px] sm:text-base text-foreground-secondary leading-relaxed max-w-2xl">
          Estamos abiertos a alianzas con otras facultades de la Universidad, entidades distritales
          y nacionales, y empresas interesadas en aplicar IA a sus propios retos de infraestructura
          y sostenibilidad.
        </p>
      </div>
    ),
  },
  {
    id: "impacto",
    label: "Impacto",
    content: (
      <div className="max-w-2xl space-y-4 text-[15px] sm:text-base text-foreground-secondary leading-relaxed">
        <p>
          Buscamos que cada proyecto se traduzca en herramientas y evidencia útil para quienes
          toman decisiones sobre el territorio y la infraestructura.
        </p>
        <p>
          Priorizamos resultados que puedan adoptarse por entidades públicas o privadas, no solo
          publicaciones académicas.
        </p>
      </div>
    ),
  },
];

export function QuienesSomos() {
  return (
    <section id="quienes-somos" className="relative py-24 sm:py-32 px-5 sm:px-8 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="relative max-w-2xl mb-16">
          {/* eslint-disable-next-line @next/next/no-img-element -- matches the plain <img> pattern already used elsewhere on this site for non-optimized real assets */}
          <img
            src="/brand/sinergia-logo-horizontal.webp"
            alt=""
            className="hidden sm:block absolute top-1/2 -translate-y-1/2 left-full ml-8 h-24 lg:h-32 w-auto invert opacity-[0.08] pointer-events-none select-none"
          />
          <h1 className="text-4xl sm:text-5xl font-semibold text-black tracking-tight text-balance mb-5">
            Investigación en IA desde la ingeniería civil y ambiental
          </h1>
          <p className="text-lg text-foreground-secondary leading-relaxed">
            SinergIA reúne investigadores, estudiantes y aliados del Departamento de Ingeniería
            Civil y Ambiental de la Universidad de los Andes alrededor de un mismo objetivo: usar
            la inteligencia artificial como herramienta para ciudades más sostenibles y una
            infraestructura mejor gestionada.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 pb-16 mb-16 border-b border-black/10">
          <div>
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-yellow-ink mb-3">
              Misión
            </p>
            <p className="text-[15px] sm:text-base text-foreground-secondary leading-relaxed">
              Desarrollar y aplicar inteligencia artificial para apoyar decisiones más sostenibles
              en ciudades e infraestructura, en estrecha colaboración con la ingeniería civil y
              ambiental. Partimos de problemas reales del territorio — no de la tecnología por sí
              misma — y construimos modelos y herramientas que un tomador de decisiones pueda usar.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-yellow-ink mb-3">
              Visión
            </p>
            <p className="text-[15px] sm:text-base text-foreground-secondary leading-relaxed">
              Ser un referente en investigación aplicada que conecta la inteligencia artificial con
              los retos reales de la modernización urbana y la sostenibilidad territorial en la
              región. Queremos que la Universidad de los Andes sea un punto de encuentro entre la
              academia, el sector público y el privado alrededor de estos temas.
            </p>
          </div>
        </div>

        <Tabs items={tabs} groupId="quienes-somos" label="Secciones de quiénes somos" />
      </div>
    </section>
  );
}
