"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useVideoWhenVisible } from "@/lib/useVideoWhenVisible";
import { Cpu, Bot, Gauge, Radar, Camera, Layers, type LucideIcon } from "lucide-react";

// The 3D scene pulls in three.js/@react-three/fiber/drei (a heavy bundle) —
// load it only on the client, once it's actually needed, so it never blocks
// first paint or adds to the initial JS a phone has to parse for this route.
const LabScene = dynamic(() => import("./lab3d/LabScene").then((m) => m.LabScene), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/10] w-full rounded-[1.75rem] border border-border-soft bg-background-subtle animate-pulse" />
  ),
});

interface LabCategory {
  /** Short equipment-tag code, the way physical gear in the lab actually
   * gets labeled — not decorative numbering. */
  code: string;
  label: string;
  icon: LucideIcon;
  desc: string;
  items: string[];
  /** Real footage for this category; without it the CSS fallback motif shows. */
  video?: { src: string; poster: string };
  /** One real, grounded number worth calling out on its own — not filled in
   * for every category, only where an honest figure exists. */
  stat?: { value: string; caption: string };
}

const categories: LabCategory[] = [
  {
    code: "CMP",
    label: "Cómputo",
    icon: Cpu,
    desc: "Estaciones de trabajo de alto rendimiento para entrenar y evaluar modelos de aprendizaje automático sobre datos urbanos y de infraestructura.",
    items: [
      "AMD Threadripper 9980X de 64 núcleos, 512 GB DDR5 y 2× NVIDIA RTX 6000 Ada de 48 GB",
      "AMD Threadripper PRO 9995WX de 96 núcleos, 512 GB DDR5, 2× RTX 6000 Ada y red de 100 GbE",
      "2 equipos Ryzen 9 9950X con 256 GB DDR5 y NVIDIA RTX 5090 de 32 GB",
    ],
    stat: { value: "≈574", caption: "TFLOPS FP32 de pico teórico en 6 GPUs NVIDIA repartidas en 4 equipos" },
    video: { src: "/videos/lab-computo.14208a72.mp4", poster: "/videos/lab-computo-poster.d485f28f.jpg" },
  },
  {
    code: "RBT",
    label: "Robots",
    icon: Bot,
    desc: "Robots humanoides y brazos robóticos para investigación en locomoción, interacción humano-robot y automatización de tareas de construcción.",
    items: [
      "Unitree G1, robot humanoide para locomoción y manipulación",
      "Pepper, robot social de SoftBank Robotics (desarrollado por Aldebaran)",
      "Brazo robótico Universal Robots UR3 para manipulación de precisión",
    ],
    video: { src: "/videos/lab-robots.096319ea.mp4", poster: "/videos/lab-robots-poster.8dcbbcc6.jpg" },
  },
  {
    code: "SNS",
    label: "Sensores",
    icon: Gauge,
    desc: "Sensores de vanguardia y dispositivos IoT para ensayos físicos y monitoreo estructural en tiempo real.",
    items: [
      "Microcontroladores ESP32 y computadores Raspberry Pi para adquisición y telemetría",
      "Acelerómetros, giroscopios y unidades inerciales para vibración estructural",
      "Sensores LiDAR para captura espacial de alta precisión",
    ],
    stat: { value: "47", caption: "sensores instrumentados en el proyecto Mesa Vibratoria" },
    video: { src: "/videos/lab-sensores.54e09ba0.mp4", poster: "/videos/lab-sensores-poster.df72b0eb.jpg" },
  },
  {
    code: "DRN",
    label: "Drones",
    icon: Radar,
    desc: "Flota de drones DJI, de la serie compacta a la profesional, para inspección aérea de infraestructura y sitios difíciles de alcanzar.",
    items: [
      "DJI Mavic 3 Enterprise para inspección ágil de puentes y viaductos",
      "DJI Mini para captura rápida y operación en espacios reducidos",
      "DJI Matrice 300 RTK para levantamientos de precisión",
    ],
    video: { src: "/videos/laboratorio-robotica.e98e0753.mp4", poster: "/videos/laboratorio-robotica-poster.983564cb.jpg" },
  },
  {
    code: "CAM",
    label: "Cámaras",
    icon: Camera,
    desc: "Cámaras con inteligencia artificial para detección y análisis visual de infraestructura, más captura de imágenes de campo y satelitales.",
    items: [
      "Cámaras de seguridad con IA para detección y conteo en tiempo real",
      "Visión por computador aplicada a inspección estructural",
      "Imágenes satelitales para análisis territorial",
    ],
    video: { src: "/videos/lab-camaras.d590f210.mp4", poster: "/videos/lab-camaras-poster.12a0d9b1.jpg" },
  },
  {
    code: "VAR",
    label: "Varios",
    icon: Layers,
    desc: "Colaboración interdisciplinaria, sostenibilidad urbana y herramientas de analítica y visualización.",
    items: [
      "Trabajo conjunto con ingeniería civil, ambiental, de sistemas y ciencias sociales",
      "Análisis del impacto ambiental y energético de decisiones urbanas",
      "Tableros y visualizaciones para tomadores de decisión",
    ],
    video: { src: "/videos/lab-varios.cf39d37e.mp4", poster: "/videos/lab-varios-poster.484b9417.jpg" },
  },
];

/**
 * One scroll-driven chapter: the category starts as a small floating card
 * mid-viewport and grows into a fullscreen panel purely from scroll
 * position — no click, no imperative animate() calls to fight with tab
 * throttling. `useScroll` reads real scroll progress against this chapter's
 * tall wrapper while its inner viewport stays pinned; `useSpring` smooths
 * that progress so the growth doesn't feel like it's snapping frame to
 * frame on a fast scroll.
 */
function CapabilityChapter({
  category,
  onActive,
}: {
  category: LabCategory;
  onActive: (code: string) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const Icon = category.icon;
  const [nearView, setNearView] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  useVideoWhenVisible(wrapperRef, videoRef, nearView && !shouldReduceMotion);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "1200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Raw scroll progress, not spring-smoothed — a spring chases the real
  // scroll position with a physics delay, which felt laggy on normal scroll
  // and, worse, left a visible gap after a chip jump: the overlay lifted
  // before the spring had caught up to the teleported position, so the
  // panel was still mid-animation with nothing readable on screen yet.
  const { scrollYProgress: progress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Whichever chapter currently has its progress inside (0, 1) is the one
  // filling the viewport — report it up so the nav bar can highlight it,
  // without geometry math of its own.
  useMotionValueEvent(progress, "change", (v) => {
    if (v > 0.04 && v < 0.96) onActive(category.code);
  });

  const scale = useTransform(progress, [0, 0.2], [0.62, 1]);
  const radius = useTransform(progress, [0, 0.2], [40, 0]);
  const shadowAmount = useTransform(progress, [0, 0.16], [1, 0]);
  const boxShadow = useTransform(
    shadowAmount,
    (v) => `0 ${40 * v}px ${90 * v}px rgba(0,0,0,${0.35 * v})`
  );
  // The name is on screen from the first pixel of the chapter; only the
  // detail block fades in, so there is never a stretch of scroll with
  // nothing readable.
  const detailsOpacity = useTransform(progress, [0.04, 0.16], [0, 1]);
  const detailsY = useTransform(progress, [0.04, 0.16], [20, 0]);

  return (
    <div
      ref={wrapperRef}
      id={`lab-${category.code}`}
      data-nav-theme="dark"
      className="relative h-[230vh]"
    >
      <div className="sticky top-0 h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-white">
        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : { scale, borderRadius: radius, boxShadow }
          }
          className="relative w-full h-full overflow-hidden bg-[#0a0b0d]"
        >
          {category.video ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${category.video.poster})` }}
              />
              {nearView && (
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay={!shouldReduceMotion}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster={category.video.poster}
                >
                  <source src={category.video.src} type="video/mp4" />
                </video>
              )}
            </>
          ) : (
            <>
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                  backgroundSize: "34px 34px",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "radial-gradient(720px circle at 70% 35%, rgba(255,222,0,0.16), transparent 65%)",
                }}
              />
              <Icon
                strokeWidth={0.5}
                className="absolute -right-16 bottom-0 sm:-right-6 w-[26rem] h-[26rem] sm:w-[36rem] sm:h-[36rem] text-white/[0.06] pointer-events-none"
              />
            </>
          )}
          {/* Base mood gradient plus a centered vignette sized to the text
              block — the video content underneath isn't ours to control
              frame-by-frame, so contrast has to hold regardless of what's
              playing behind the words. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/55 pointer-events-none" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(60% 55% at 50% 52%, rgba(0,0,0,0.55), transparent 72%)" }}
          />

          <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center text-center px-6 sm:px-14 py-14">
            <span className="font-mono text-white/50 text-sm mb-4">{category.code}</span>
            <h2 className="text-5xl sm:text-8xl font-bold text-white tracking-tight mb-6">{category.label}</h2>

            <motion.div
              style={shouldReduceMotion ? undefined : { opacity: detailsOpacity, y: detailsY }}
              className="flex flex-col items-center"
            >
              <p className="text-base sm:text-xl text-white/75 leading-relaxed max-w-2xl mb-8 text-balance">
                {category.desc}
              </p>

              {category.stat && (
                <div className="mb-6">
                  <div className="text-5xl sm:text-7xl font-bold text-yellow tracking-tight leading-none mb-2">
                    {category.stat.value}
                  </div>
                  <p className="text-sm text-white/60 max-w-xs mx-auto">{category.stat.caption}</p>
                </div>
              )}

              <ul className="flex flex-wrap items-start justify-center gap-x-10 gap-y-5 max-w-4xl">
                {category.items.map((item) => (
                  <li key={item} className="w-56 text-[13px] text-white/70 leading-relaxed">
                    <span className="block w-6 h-px bg-yellow mx-auto mb-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * The chip bar stays mounted the whole time the capability chapters are on
 * screen, tracking whichever one is currently filling the viewport.
 * Clicking a chip doesn't just jump the scroll position — that would cut
 * straight from one category's footage to another with no transition — it
 * fades to black, moves the scroll position underneath while hidden, then
 * fades back in already inside the target chapter. Scrolling normally
 * afterward works exactly as before, since it's still just scroll position
 * driving each chapter's progress.
 */
function LabCapabilitiesScroll() {
  const blockRef = useRef<HTMLDivElement>(null);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [navVisible, setNavVisible] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setNavVisible(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleActive = (code: string) => {
    setActiveCode((prev) => (prev === code ? prev : code));
  };

  const handleJump = (code: string) => {
    if (code === activeCode || transitioning) return;
    setTransitioning(true);
    window.setTimeout(() => {
      const el = document.getElementById(`lab-${code}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        const wrapperTop = rect.top + window.scrollY;
        const targetY = wrapperTop + 0.6 * (rect.height - window.innerHeight);
        // `scroll-behavior: smooth` is set globally (for anchor links), so
        // "auto" here would inherit that and visibly scroll through every
        // section underneath the black overlay — "instant" overrides it and
        // actually teleports.
        window.scrollTo({ top: targetY, behavior: "instant" });
      }
      setActiveCode(code);
      window.setTimeout(() => setTransitioning(false), 20);
    }, 120);
  };

  return (
    <div ref={blockRef} className="relative">
      <div
        aria-hidden={!navVisible}
        className={`fixed top-20 inset-x-0 z-40 flex justify-center px-4 transition-opacity duration-300 ${
          navVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          role="tablist"
          aria-label="Categorías del laboratorio"
          className="flex items-center gap-1.5 overflow-x-auto max-w-full px-1.5 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/15"
        >
          {categories.map((c) => {
            const CIcon = c.icon;
            const isActive = c.code === activeCode;
            return (
              <button
                key={c.code}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleJump(c.code)}
                className={`shrink-0 inline-flex items-center gap-2 pl-2.5 pr-3.5 py-1.5 rounded-full border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isActive
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white/70 border-transparent hover:bg-white/10"
                }`}
              >
                <span
                  className={`font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    isActive ? "bg-yellow text-black" : "bg-white/10 text-white/70"
                  }`}
                >
                  {c.code}
                </span>
                <CIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span className="text-[12px] font-medium hidden sm:inline">{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[200] bg-black pointer-events-none transition-opacity duration-100 ${
          transitioning ? "opacity-100" : "opacity-0"
        }`}
      />

      {categories.map((c) => (
        <CapabilityChapter key={c.code} category={c} onActive={handleActive} />
      ))}
    </div>
  );
}

export function Laboratorio() {
  return (
    <section id="laboratorio" className="relative bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-semibold text-black tracking-tight text-balance mb-5">
            Capacidades del laboratorio
          </h1>
          <p className="text-lg text-foreground-secondary leading-relaxed">
            Un espacio de trabajo interdisciplinario que combina cómputo, datos y modelado para
            convertir preguntas de ingeniería civil y ambiental en soluciones basadas en IA.
            Desplázate para recorrer cada capacidad, o salta directamente con la barra.
          </p>
        </div>
      </div>

      <LabCapabilitiesScroll />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <LabScene />
        </motion.div>
      </div>
    </section>
  );
}
