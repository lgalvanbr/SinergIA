import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Especial } from "./content/especiales";

export function EspecialDetail({ especial }: { especial: Especial }) {
  return (
    <section className="relative pt-10 sm:pt-14 pb-24 sm:pb-32 px-5 sm:px-8 bg-white">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/infraestructura-visible/especiales"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground-secondary hover:text-black transition-colors mb-8 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
          <ChevronLeft className="w-4 h-4" />
          Especiales
        </Link>

        <span className="text-xs font-semibold uppercase tracking-wider text-yellow-ink">{especial.eyebrow}</span>
        <h1 className="text-3xl sm:text-5xl font-semibold text-black tracking-tight text-balance mt-2 mb-8">
          {especial.title}
        </h1>

        <div className="space-y-5">
          {especial.body.map((p, i) => (
            <p key={i} className="text-base sm:text-lg text-foreground-secondary leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-black/10">
          <Link
            href={especial.relatedHref}
            className="text-[15px] font-medium text-black underline decoration-yellow decoration-4 underline-offset-4 hover:decoration-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded"
          >
            {especial.relatedLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
