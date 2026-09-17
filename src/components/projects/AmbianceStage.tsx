"use client";

import { AnimatePresence, motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { easeApple } from "@/lib/motion";

export interface ProjectTheme {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  status: string;
  icon: LucideIcon;
  /** CSS `background-position` for the radial glow — gives each project a
   * distinct silhouette even with no photography yet. */
  glowPosition: string;
  /** Tailwind position classes for the oversized icon watermark. */
  iconPosition: string;
  /** Optional real footage, added later — falls back to the CSS motif above
   * when absent, same pattern as Hero/ScrollyShowcase. */
  mediaSrc?: string;
  posterSrc?: string;
  /** Optional static image, for a project with real photography/art but no
   * video yet. Ignored when `mediaSrc` is also set (video wins). */
  imageSrc?: string;
}

/**
 * The dark "ambiance" panel behind the selected project card. No off-brand
 * hues (manual sec. 2.1.3 is black/yellow only) — each project reads as
 * distinct through glow position, icon silhouette and grid alone, so this
 * stays convincing before real project photography/video is dropped into
 * `mediaSrc`/`posterSrc`.
 */
export function AmbianceStage({ project }: { project: ProjectTheme }) {
  const Icon = project.icon;

  return (
    <div
      data-nav-theme="dark"
      className="relative h-[280px] sm:h-[360px] w-full rounded-[1.75rem] overflow-hidden bg-[#0a0b0d]"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: easeApple }}
        >
          {project.mediaSrc ? (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              poster={project.posterSrc}
            >
              <source src={project.mediaSrc} type="video/mp4" />
            </video>
          ) : project.imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- matches the plain <img> pattern already used elsewhere on this site for non-optimized real assets
            <img
              src={project.imageSrc}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
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
                  backgroundImage:
                    "radial-gradient(480px circle at var(--glow-pos), rgba(255,222,0,0.14), transparent 65%)",
                  ["--glow-pos" as string]: project.glowPosition,
                }}
              />
              <Icon
                strokeWidth={0.6}
                className={`absolute ${project.iconPosition} w-64 h-64 sm:w-80 sm:h-80 text-white/[0.07] pointer-events-none`}
              />
            </>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 text-white/50 text-[13px] font-medium">
            <span className="font-mono">{project.index}</span>
            <span className="w-8 h-px bg-white/25" />
            <span className="uppercase tracking-wider">{project.eyebrow}</span>
          </div>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              project.status === "Prototipo funcional"
                ? "bg-yellow text-black"
                : "bg-white/10 text-white/70 border border-white/15"
            }`}
          >
            {project.status}
          </span>
        </div>

        <h3 className="text-3xl sm:text-5xl font-semibold text-white tracking-tight">{project.title}</h3>
      </div>
    </div>
  );
}
