"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";

/**
 * Apple-style "film" section: a tall container pins a fullscreen video while
 * the chrome stays minimal (index, eyebrow, headline, one line of copy — no
 * dashboards). Each chapter plays a real looping background clip, mounted
 * only once it's about to enter view (IntersectionObserver) so a visitor who
 * never scrolls this far never pays for the download — same instant-paint /
 * fade-in-on-canplay / hide-on-error pattern as the Hero video.
 */

interface ChapterProps {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  desc: string;
  videoSrc: string;
  posterSrc: string;
}

function ScrollChapter({ id, index, eyebrow, title, desc, videoSrc, posterSrc }: ChapterProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [nearView, setNearView] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoAvailable, setVideoAvailable] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Mount the <video> well before the pinned section reaches the
    // viewport (large rootMargin) so it has time to buffer during the
    // scroll runway leading up to it, without downloading anything for
    // chapters the visitor never scrolls to.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "800px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      id={id}
      ref={containerRef}
      data-nav-theme="dark"
      className="relative h-[200vh] sm:h-[230vh] bg-[#0a0b0d] text-white"
      style={{ touchAction: "pan-y" }}
    >
      <div
        className="sticky top-0 h-[100dvh] w-full flex items-center justify-center overflow-hidden"
        style={{ touchAction: "pan-y" }}
      >
        {/* Poster layer — instant paint, and the permanent fallback if the
            video errors or reduced-motion keeps it paused on frame one. */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${posterSrc})` }}
        />

        {nearView && videoAvailable && (
          <video
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
            autoPlay={!shouldReduceMotion}
            loop
            muted
            playsInline
            preload="auto"
            poster={posterSrc}
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoAvailable(false)}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/10 to-black/30" />

        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-14">
          <div className="flex items-center gap-3 text-white/50 text-[13px] font-medium">
            <span className="font-mono">{index}</span>
            <span className="w-8 h-px bg-white/25" />
            <span className="uppercase tracking-wider">{eyebrow}</span>
          </div>

          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-6xl font-semibold text-white tracking-tight leading-[1.05] mb-4 text-balance">
              {title}
            </h2>
            <p className="text-sm sm:text-lg text-white/75 leading-relaxed max-w-xl">{desc}</p>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40">
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </div>
    </div>
  );
}

export function ScrollyShowcase() {
  return (
    <section className="relative">
      <ScrollChapter
        id="ciudades-ia"
        index="01"
        eyebrow="Ciudades y territorio"
        title="Planeación urbana guiada por datos"
        desc="Modelos de IA aplicados a la lectura del territorio — densificación, movilidad, energía y calidad ambiental — para apoyar decisiones urbanas más sostenibles."
        videoSrc="/videos/scroll-ciudades.mp4"
        posterSrc="/videos/scroll-ciudades-poster.jpg"
      />

      <div className="bg-white py-24 sm:py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-yellow-ink">02 — A continuación</span>
          <h3 className="text-3xl sm:text-5xl font-semibold text-black tracking-tight text-balance">
            De la planeación urbana a la modernización de la infraestructura
          </h3>
          <p className="text-base sm:text-lg text-foreground-secondary max-w-xl mx-auto">
            Sigue desplazándote para ver cómo aplicamos monitoreo y modelos predictivos a la
            infraestructura civil existente.
          </p>
        </div>
      </div>

      <ScrollChapter
        id="modernizacion"
        index="02"
        eyebrow="Infraestructura y monitoreo"
        title="Modernización y monitoreo inteligente de infraestructura"
        desc="Sensores, modelos predictivos y gemelos digitales para dar seguimiento al estado de puentes, vías y edificaciones, y priorizar su mantenimiento."
        videoSrc="/videos/scroll-infraestructura.mp4"
        posterSrc="/videos/scroll-infraestructura-poster.jpg"
      />
    </section>
  );
}
