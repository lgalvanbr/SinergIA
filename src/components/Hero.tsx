"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Play, Pause } from "lucide-react";

import { easeApple } from "@/lib/motion";

const chips = [
  { href: "/proyectos", label: "Proyectos" },
  { href: "/laboratorio", label: "Laboratorio" },
  { href: "/investigacion", label: "Investigación" },
  { href: "/quienes-somos", label: "Quiénes somos" },
];

const focusKeywords = [
  "Ciudades sostenibles",
  "Modernización de infraestructura",
  "Movilidad urbana",
  "Gestión ambiental",
  "Gemelos digitales",
  "Datos geoespaciales",
];

/** Quiet monochrome particle network — the base layer behind the hero video,
 * so it never looks empty on the first paint or if the video fails to load. */
function useNetworkCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.max(30, Math.floor((width * height) / 15000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 1.3 + 0.6,
        });
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        if (!shouldReduceMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255,255,255,${0.09 * (1 - dist / 110)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef, shouldReduceMotion]);
}

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldReduceMotion = useReducedMotion();
  useNetworkCanvas(canvasRef);

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const playing = isPlaying && !shouldReduceMotion;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <section
        id="top"
        data-nav-theme="dark"
        className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-[#0b0c10] text-white pt-16"
      >
        {/* Base generative layer, always present */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />

        {/* Full-bleed background video */}
        {videoAvailable && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
            autoPlay={!shouldReduceMotion}
            loop
            muted
            playsInline
            preload="metadata"
            poster="/videos/hero-sinergia-poster.9ec5011f.jpg"
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoAvailable(false)}
          >
            <source src="/videos/hero-sinergia.9c3b7190.mp4" type="video/mp4" />
          </video>
        )}

        {/* Scrim for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeApple }}
          className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center py-20"
        >
          <p className="text-base sm:text-lg font-medium text-white/70 mb-2">Laboratorio</p>
          <h1 className="text-6xl sm:text-8xl font-semibold tracking-tight text-white mb-6">SinergIA</h1>

          <p className="text-2xl sm:text-3xl font-medium text-white leading-snug text-balance mb-6 max-w-3xl mx-auto">
            Inteligencia artificial para ciudades sostenibles e infraestructura resiliente.
          </p>

          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-10 text-balance">
            Investigamos desde el Departamento de Ingeniería Civil y Ambiental de la Universidad de
            los Andes, aplicando modelos de IA a la planeación urbana y a la modernización de la
            infraestructura del país.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-10">
            <Link
              href="/proyectos"
              className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center px-7 rounded-full bg-white text-black font-medium text-[15px] hover:bg-white/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Ver proyectos
            </Link>
            <Link
              href="/quienes-somos"
              className="text-[15px] font-medium text-white underline decoration-yellow decoration-4 underline-offset-4 hover:decoration-white/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              Conócenos
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {chips.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="px-4 py-1.5 rounded-full border border-white/25 text-[13px] font-medium text-white/70 hover:text-white hover:border-white/50 transition-colors cursor-pointer min-h-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {videoAvailable && videoReady && (
          <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 z-10">
            <button
              onClick={togglePlay}
              className="p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={playing ? "Pausar" : "Reproducir"}
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
          </div>
        )}
      </section>

      {/* Quiet marquee of focus areas */}
      <div className="bg-white py-8 overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[...focusKeywords, ...focusKeywords].map((k, i) => (
            <span
              key={i}
              className="flex items-center text-sm font-medium text-foreground-secondary/70 px-6 whitespace-nowrap"
            >
              {k}
              <span className="w-1 h-1 rounded-full bg-border-strong ml-6" />
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
