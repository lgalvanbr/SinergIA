import Link from "next/link";
import { especiales } from "./content/especiales";

export function Especiales() {
  return (
    <section className="relative pt-10 sm:pt-14 pb-24 sm:pb-32 px-5 sm:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-yellow-ink">Especiales</span>
          <h1 className="text-4xl sm:text-5xl font-semibold text-black tracking-tight text-balance mt-2 mb-5">
            Análisis a profundidad
          </h1>
          <p className="text-lg text-foreground-secondary leading-relaxed">
            Cruces de varios indicadores a la vez, con los números reales detrás de cada lectura.
          </p>
        </div>

        <div className="space-y-6">
          {especiales.map((e) => (
            <Link
              key={e.slug}
              href={`/infraestructura-visible/especiales/${e.slug}`}
              className="block p-6 sm:p-8 rounded-2xl bg-background-subtle border border-border-soft hover:border-border-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-yellow-ink">{e.eyebrow}</span>
              <h2 className="text-2xl font-semibold text-black tracking-tight mt-2 mb-3">{e.title}</h2>
              <p className="text-[15px] text-foreground-secondary leading-relaxed">{e.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
