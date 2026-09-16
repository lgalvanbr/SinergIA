"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { easeApple } from "@/lib/motion";

// The 3D scene pulls in three.js/@react-three/fiber/drei (a heavy bundle) —
// load it only on the client, once it's actually needed, so it never blocks
// first paint or adds to the initial JS a phone has to parse for this route.
const LabScene = dynamic(() => import("./lab3d/LabScene").then((m) => m.LabScene), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/10] w-full rounded-[1.75rem] border border-border-soft bg-background-subtle animate-pulse" />
  ),
});

const capabilities = [
  {
    title: "Cómputo para IA aplicada",
    desc: "Infraestructura de cómputo dedicada al entrenamiento y evaluación de modelos de aprendizaje automático sobre datos urbanos y de infraestructura.",
  },
  {
    title: "Datos geoespaciales y de sensores",
    desc: "Procesamiento de imágenes satelitales, datos abiertos de ciudad y sensórica de campo para alimentar los modelos del laboratorio.",
  },
  {
    title: "Modelado de infraestructura",
    desc: "Herramientas de modelado y simulación aplicadas a puentes, vías y edificaciones, en conjunto con otros grupos del departamento.",
  },
  {
    title: "Sostenibilidad urbana",
    desc: "Análisis del impacto ambiental y energético de decisiones urbanas, con foco en soluciones aplicables al contexto local.",
  },
  {
    title: "Colaboración interdisciplinaria",
    desc: "Trabajo conjunto con investigadores de ingeniería civil, ambiental, de sistemas y ciencias sociales.",
  },
  {
    title: "Analítica y visualización",
    desc: "Tableros y visualizaciones para comunicar hallazgos a tomadores de decisión y comunidades académicas.",
  },
];

export function Laboratorio() {
  return (
    <section id="laboratorio" className="relative py-24 sm:py-32 px-5 sm:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold text-black tracking-tight text-balance mb-5">
            Capacidades del laboratorio
          </h1>
          <p className="text-lg text-foreground-secondary leading-relaxed">
            Un espacio de trabajo interdisciplinario que combina cómputo, datos y modelado para
            convertir preguntas de ingeniería civil y ambiental en soluciones basadas en IA.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: easeApple }}
          className="mb-20"
        >
          <LabScene />
        </motion.div>

        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: easeApple }}
            className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-black/10"
          >
            {capabilities.map((cap) => (
              <div key={cap.title} className="p-7 sm:p-8 border-r border-b border-black/10">
                <h3 className="text-lg font-semibold text-black mb-2">{cap.title}</h3>
                <p className="text-[15px] text-foreground-secondary leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
