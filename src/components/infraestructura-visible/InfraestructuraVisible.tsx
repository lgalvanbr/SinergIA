"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Map, Search, Sparkles, BookOpen, Newspaper } from "lucide-react";
import { easeApple } from "@/lib/motion";

const teasers = [
  {
    href: "/infraestructura-visible/visualiza",
    title: "Visualiza",
    desc: "Mapa interactivo de Colombia: pobreza, vías, competitividad y educación por departamento.",
    icon: Map,
  },
  {
    href: "/infraestructura-visible/explora",
    title: "Explora",
    desc: "Los cerca de 60 análisis originales del proyecto, con sus variables y fuentes.",
    icon: Search,
  },
  {
    href: "/infraestructura-visible/especiales",
    title: "Especiales",
    desc: "Análisis a profundidad que cruzan varios indicadores a la vez.",
    icon: Sparkles,
  },
  {
    href: "/infraestructura-visible/biblioteca",
    title: "Biblioteca",
    desc: "Los informes originales del proyecto, disponibles para descargar.",
    icon: BookOpen,
  },
  {
    href: "/infraestructura-visible/noticias",
    title: "Noticias",
    desc: "La historia del proyecto — y de este regreso.",
    icon: Newspaper,
  },
];

export function InfraestructuraVisible() {
  return (
    <>
      <section className="relative pt-10 sm:pt-14 pb-16 px-5 sm:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-yellow-ink">
            De vuelta en línea
          </span>
          <h1 className="text-4xl sm:text-6xl font-semibold text-black tracking-tight text-balance mt-3 mb-6">
            Infraestructura Visible
          </h1>
          <p className="text-lg sm:text-xl text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
            Datos de infraestructura y desarrollo de Colombia, libres y centralizados. Un proyecto
            del profesor Mauricio Sánchez-Silva y el grupo GeoSI de Uniandes — reconstruido a
            partir del dataset original tras la caída de su sitio anterior.
          </p>
          <div className="mt-8">
            <Link
              href="/infraestructura-visible/noticias/vuelve-infraestructura-visible"
              className="text-[15px] font-medium text-black underline decoration-yellow decoration-4 underline-offset-4 hover:decoration-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded"
            >
              Lee la historia completa
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-20 px-5 sm:px-8 bg-white border-t border-black/10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: easeApple }}
          className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 border-t border-l border-black/10"
        >
          {teasers.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className="p-8 border-r border-b border-black/10 hover:bg-background-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:-outline-offset-2"
              >
                <Icon className="w-5 h-5 text-black mb-3" strokeWidth={1.75} />
                <h3 className="text-lg font-semibold text-black mb-2">{t.title}</h3>
                <p className="text-[15px] text-foreground-secondary leading-relaxed">{t.desc}</p>
              </Link>
            );
          })}
        </motion.div>
      </section>
    </>
  );
}
