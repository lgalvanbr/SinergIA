"use client";

import { motion } from "motion/react";
import { easeApple } from "@/lib/motion";

const lines = [
  {
    title: "IA para ciudades sostenibles",
    desc: "Modelos que apoyan la planeación urbana, el uso eficiente del suelo y la reducción del impacto ambiental de las decisiones de ciudad.",
  },
  {
    title: "Modernización de infraestructura",
    desc: "Informática de la construcción, BIM y construcción industrializada aplicadas a la entrega y el mantenimiento de proyectos de infraestructura — monitoreo, mantenimiento predictivo y gemelos digitales para extender la vida útil segura de puentes, vías y edificaciones.",
    researcher: {
      name: "Nelly Paola García López",
      note: "Profesora asistente · grupo IN2GECO — informática de la construcción, BIM y lean construction.",
    },
  },
  {
    title: "Movilidad y espacio público",
    desc: "Análisis de datos de movilidad para proponer soluciones más seguras, accesibles y eficientes en el espacio urbano.",
  },
  {
    title: "Recursos y riesgo ambiental",
    desc: "Modelación hidrológica y de sistemas de recursos hídricos aplicada a la gestión de agua, energía y riesgo ambiental, en apoyo a la resiliencia territorial.",
    researcher: {
      name: "Juan Sebastián Hernández Suárez",
      note: "Profesor asistente — seguridad hídrica, flujos ambientales y modelación de mercados de derechos de agua.",
    },
  },
];

export function Investigacion() {
  return (
    <section id="investigacion" className="relative py-24 sm:py-32 px-5 sm:px-8 bg-background-subtle">
      <div className="max-w-4xl mx-auto">
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl sm:text-5xl font-semibold text-black tracking-tight text-balance mb-5">
            Líneas de investigación
          </h1>
          <p className="text-lg text-foreground-secondary leading-relaxed">
            Cuatro frentes de trabajo que conectan la inteligencia artificial con los retos de la
            ingeniería civil y ambiental en contextos urbanos.
          </p>
        </div>

        <motion.dl
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: easeApple }}
          className="border-t border-black/10"
        >
          {lines.map((l) => (
            <div
              key={l.title}
              className="grid grid-cols-1 sm:grid-cols-[16rem_1fr] gap-2 sm:gap-8 py-8 border-b border-black/10"
            >
              <dt className="text-lg font-semibold text-black">{l.title}</dt>
              <dd className="text-[15px] sm:text-base text-foreground-secondary leading-relaxed">
                {l.desc}
                {l.researcher && (
                  <span className="block mt-3 text-[13px] text-yellow-ink">
                    {l.researcher.name} — {l.researcher.note}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </motion.dl>

        <p className="mt-10 text-sm text-foreground-secondary max-w-xl">
          Publicaciones, datasets y colaboraciones se irán enlazando aquí a medida que estén
          disponibles.
        </p>
      </div>
    </section>
  );
}
