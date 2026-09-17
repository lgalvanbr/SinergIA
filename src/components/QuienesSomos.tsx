import { Mail, ExternalLink } from "lucide-react";
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
    logo: null,
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
    logo: null,
  },
  {
    acronym: "SUR",
    name: "Grupo de Estudios en Sostenibilidad Urbana y Regional",
    desc: "Planeación urbana y regional, movilidad y transporte, calidad ambiental, modelación espacial y hábitat sostenible.",
    director: "PhD. Álvaro Rodríguez Valencia",
    url: "https://sur.uniandes.edu.co/",
    logo: null,
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

function ProfileCard({
  photo,
  eyebrow,
  name,
  desc,
  lines,
  facts,
  links,
}: {
  photo?: string;
  eyebrow: string;
  name: string;
  desc: string[];
  lines: string[];
  facts: { label: string; value: string }[];
  links: { label: string; href: string }[];
}) {
  return (
    <div className="py-8 border-b border-black/10 last:border-b-0">
      <div className="flex items-start gap-5 mb-4">
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element -- matches the plain <img> pattern already used for research-group logos in this file
          <img
            src={photo}
            alt={name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover flex-shrink-0 border border-black/10"
          />
        )}
        <div>
          <p className="text-xs font-medium tracking-[0.14em] uppercase text-yellow-ink mb-2">
            {eyebrow}
          </p>
          <h3 className="text-xl font-semibold text-black">{name}</h3>
        </div>
      </div>
      <div className="mb-6 max-w-2xl space-y-3">
        {desc.map((p, i) => (
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
            {lines.map((line) => (
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
          {facts.map((f) => (
            <div key={f.label}>
              <p className="text-xs font-medium tracking-[0.1em] uppercase text-foreground-secondary">
                {f.label}
              </p>
              <p className="text-[15px] text-black">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-6 mt-6 border-t border-black/10">
        {links.map((link) => (
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
    </div>
  );
}

const tabs: TabItem[] = [
  {
    id: "mision-vision",
    label: "Misión y visión",
    content: (
      <div className="max-w-2xl space-y-8 text-[15px] sm:text-base text-foreground-secondary leading-relaxed">
        <div>
          <p className="text-xs font-medium tracking-[0.14em] uppercase text-yellow-ink mb-3">
            Misión
          </p>
          <p>
            Desarrollar y aplicar inteligencia artificial para apoyar decisiones más sostenibles en
            ciudades e infraestructura, en estrecha colaboración con la ingeniería civil y
            ambiental. Partimos de problemas reales del territorio — no de la tecnología por sí
            misma — y construimos modelos y herramientas que un tomador de decisiones pueda usar.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-[0.14em] uppercase text-yellow-ink mb-3">
            Visión
          </p>
          <p>
            Ser un referente en investigación aplicada que conecta la inteligencia artificial con
            los retos reales de la modernización urbana y la sostenibilidad territorial en la
            región. Queremos que la Universidad de los Andes sea un punto de encuentro entre la
            academia, el sector público y el privado alrededor de estos temas.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "equipo",
    label: "Equipo",
    content: (
      <div className="max-w-3xl">
        <div className="border-t border-black/10">
          <ProfileCard
            photo="/team/nelly-garcia.jpg"
            eyebrow="Profesora asistente"
            name="Nelly García López"
            desc={[
              "Investiga en la intersección de informática de la construcción, gerencia de proyectos y principios lean, con énfasis en cómo el modelado y la visualización pueden resolver problemas prácticos de entrega de proyectos de construcción. Hace parte del grupo IN2GECO del departamento.",
            ]}
            lines={[
              "Informática de la construcción y BIM (Building Information Modeling)",
              "Construcción industrializada y Construcción 4.0/5.0",
              "Lean construction y sistemas de producción",
              "Sostenibilidad del entorno construido",
            ]}
            facts={[
              { label: "Doctorado", value: "Stanford University" },
              { label: "Maestría", value: "Stanford University · Universidad de los Andes" },
              { label: "Pregrado", value: "Universidad de los Andes" },
              { label: "Grupo de investigación", value: "IN2GECO" },
            ]}
            links={[
              { label: "ne-garci@uniandes.edu.co", href: "mailto:ne-garci@uniandes.edu.co" },
              {
                label: "Perfil en el departamento",
                href: "https://civilyambiental.uniandes.edu.co/en/professors/nelly-paola-garcia-lopez",
              },
            ]}
          />
          <ProfileCard
            photo="/team/juan-sebastian-hernandez.jpg"
            eyebrow="Profesor asistente"
            name="Juan Sebastián Hernández Suárez"
            desc={[
              "Juan Sebastián es ingeniero civil con maestría en Ingeniería - Recursos Hidráulicos de la Universidad Nacional de Colombia, y doctor en Ingeniería de Biosistemas de Michigan State University. Recientemente fue investigador posdoctoral en la Universidad de Stanford, estudiando mercados de agua y sus efectos sobre la salud de los ecosistemas acuáticos. En Colombia ha trabajado con el Ministerio de Ambiente y Desarrollo Sostenible y la Autoridad Nacional de Licencias Ambientales en temas de caudales ambientales, regulación hídrica y gestión integral del agua.",
              "Como profesor asistente de la Universidad de los Andes, continúa utilizando modelación numérica, inteligencia artificial, sistemas de información geográfica y métodos evolucionarios de optimización multiobjetivo para entender y simular sistemas humanos y naturales acoplados en un contexto de variabilidad y cambio climático — con el fin de asistir la toma de decisiones multicriterio, el diseño de infraestructura civil y la formulación de políticas públicas. Le interesan particularmente las dinámicas multisectoriales en la intersección entre seguridad hídrica, alimentaria y energética, infraestructura civil y biodiversidad.",
              "Dirige los laboratorios de Geomática y de Hidráulica del departamento. Dicta Sistemas de Información Geográfica en pregrado, y modelación de sistemas y procesos hidrológicos, modelación de hidrosistemas y gestión de recursos hídricos en los programas de posgrado.",
            ]}
            lines={[
              "Modelación hidrológica y de sistemas de recursos hídricos",
              "Seguridad hídrica, alimentaria y energética, e infraestructura civil",
              "Optimización multiobjetivo e inteligencia artificial aplicadas al agua",
              "Modelación de mercados de derechos de agua y sistemas de información geográfica",
            ]}
            facts={[
              { label: "Doctorado", value: "Michigan State University (Biosystems Eng.)" },
              { label: "Posdoctorado", value: "Stanford University" },
              { label: "Maestría", value: "Universidad Nacional de Colombia" },
              { label: "Dirige", value: "Laboratorios de Geomática e Hidráulica" },
            ]}
            links={[
              {
                label: "js.hernandezs@uniandes.edu.co",
                href: "mailto:js.hernandezs@uniandes.edu.co",
              },
              { label: "Perfil académico", href: "https://academia.uniandes.edu.co/js.hernandezs" },
            ]}
          />
        </div>

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
              className="grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-3 sm:gap-6 p-5 border-r border-b border-black/10"
            >
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                {g.logo ? (
                  <img
                    src={g.logo}
                    alt={`Logo de ${g.acronym}`}
                    className="h-8 w-auto max-w-[7rem] object-contain object-left"
                  />
                ) : (
                  <div className="flex items-center justify-center h-8 px-2 border border-black/10 rounded text-[11px] font-semibold tracking-wide text-black">
                    {g.acronym}
                  </div>
                )}
                <dt className="text-base font-semibold text-black">{g.acronym}</dt>
              </div>
              <dd className="text-[15px] text-foreground-secondary leading-relaxed">
                <span className="text-black">{g.name}.</span> {g.desc}{" "}
                <span className="text-foreground-secondary/80">Dirige {g.director}.</span>
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
    <section id="quienes-somos" className="relative py-24 sm:py-32 px-5 sm:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="max-w-2xl mb-16">
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

        <Tabs items={tabs} groupId="quienes-somos" label="Secciones de quiénes somos" />
      </div>
    </section>
  );
}
