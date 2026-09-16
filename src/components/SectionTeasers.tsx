"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { easeApple } from "@/lib/motion";

const teasers = [
  {
    href: "/proyectos",
    title: "Proyectos",
    desc: "Portafolio de iniciativas aplicadas del laboratorio en ciudades y territorio.",
  },
  {
    href: "/quienes-somos",
    title: "Quiénes somos",
    desc: "Misión, visión y la comunidad detrás de SinergIA.",
  },
  {
    href: "/laboratorio",
    title: "Laboratorio",
    desc: "Capacidades de cómputo, datos y modelado del laboratorio.",
  },
  {
    href: "/investigacion",
    title: "Investigación",
    desc: "Nuestras líneas de investigación aplicada.",
  },
];

export function SectionTeasers() {
  return (
    <section className="relative py-24 sm:py-28 px-5 sm:px-8 bg-white border-t border-black/10">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: easeApple }}
        className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 border-t border-l border-black/10"
      >
        {teasers.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="p-8 border-r border-b border-black/10 hover:bg-background-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:-outline-offset-2"
          >
            <h3 className="text-lg font-semibold text-black mb-2">{t.title}</h3>
            <p className="text-[15px] text-foreground-secondary leading-relaxed">{t.desc}</p>
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
