"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Building2, Waves, Scan } from "lucide-react";
import { easeApple } from "@/lib/motion";
import { AmbianceStage, type ProjectTheme } from "./projects/AmbianceStage";
import { CasaVibratoria } from "./projects/CasaVibratoria";
import { GeodataRioSinu } from "./projects/GeodataRioSinu";
import { CiamAR } from "./projects/CiamAR";

interface Project extends ProjectTheme {
  teaser: string;
  content: React.ReactNode;
}

const projects: Project[] = [
  {
    id: "casa-vibratoria",
    index: "01",
    eyebrow: "Modernización de infraestructura",
    title: "Casa Vibratoria",
    status: "Prototipo funcional",
    teaser: "Sensores en una casa a escala, sacudida en la mesa vibratoria del CIAM.",
    icon: Building2,
    glowPosition: "25% 75%",
    iconPosition: "-right-12 -bottom-16 sm:-right-8 sm:-bottom-20",
    content: <CasaVibratoria />,
  },
  {
    id: "geodata-rio-sinu",
    index: "02",
    eyebrow: "Recursos y riesgo ambiental",
    title: "Geodata Río Sinú",
    status: "Prototipo funcional",
    teaser: "Mapa 3D de la cuenca del río Sinú, con perfiles de elevación y capas hidrográficas.",
    icon: Waves,
    glowPosition: "75% 25%",
    iconPosition: "-left-10 -bottom-16 sm:-left-6 sm:-bottom-20",
    content: <GeodataRioSinu />,
  },
  {
    id: "ciamar",
    index: "03",
    eyebrow: "Modernización de infraestructura",
    title: "ciamAR",
    status: "En desarrollo",
    teaser: "Modelos del Laboratorio Sísmico CIAM en realidad aumentada, vía código QR.",
    icon: Scan,
    glowPosition: "50% 30%",
    iconPosition: "right-1/2 translate-x-1/2 -bottom-20",
    content: <CiamAR />,
  },
];

export function Proyectos() {
  const [activeId, setActiveId] = useState(projects[0].id);
  const active = projects.find((p) => p.id === activeId) ?? projects[0];

  return (
    <section id="proyectos" className="relative py-24 sm:py-32 px-5 sm:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="max-w-2xl mb-14">
          <h1 className="text-4xl sm:text-5xl font-semibold text-black tracking-tight text-balance mb-5">
            Proyectos del laboratorio
          </h1>
          <p className="text-lg text-foreground-secondary leading-relaxed">
            Portafolio de iniciativas aplicadas del laboratorio y del Laboratorio CIAM, del
            Departamento de Ingeniería Civil y Ambiental.
          </p>
        </div>

        <div role="tablist" aria-label="Proyectos del laboratorio" className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {projects.map((p) => {
            const isActive = p.id === activeId;
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`proyecto-panel-${p.id}`}
                onClick={() => setActiveId(p.id)}
                className={`text-left p-5 rounded-2xl border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                  isActive ? "bg-black border-black" : "bg-white border-border-soft hover:border-border-strong"
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-4 ${
                    isActive ? "bg-yellow/15" : "bg-background-subtle"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-yellow" : "text-black"}`} strokeWidth={1.75} />
                </span>
                <span className={`block text-[15px] font-semibold mb-1.5 ${isActive ? "text-white" : "text-black"}`}>
                  {p.title}
                </span>
                <span className={`block text-[13px] leading-relaxed ${isActive ? "text-white/60" : "text-foreground-secondary"}`}>
                  {p.teaser}
                </span>
              </button>
            );
          })}
        </div>

        <AmbianceStage project={active} />

        <motion.div
          key={active.id}
          id={`proyecto-panel-${active.id}`}
          role="tabpanel"
          aria-label={active.title}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: easeApple }}
          className="mt-10 p-6 sm:p-10 rounded-2xl bg-background-subtle border border-border-soft"
        >
          {active.content}
        </motion.div>
      </div>
    </section>
  );
}
