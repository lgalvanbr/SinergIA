import Link from "next/link";
import { noticias } from "./content/noticias";

export function Noticias() {
  return (
    <section className="relative pt-10 sm:pt-14 pb-24 sm:pb-32 px-5 sm:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-yellow-ink">Noticias</span>
          <h1 className="text-4xl sm:text-5xl font-semibold text-black tracking-tight text-balance mt-2 mb-5">
            Últimas actualizaciones
          </h1>
        </div>

        <div className="space-y-6">
          {noticias.map((n) => (
            <Link
              key={n.slug}
              href={`/infraestructura-visible/noticias/${n.slug}`}
              className="block p-6 sm:p-8 rounded-2xl bg-background-subtle border border-border-soft hover:border-border-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              <time className="text-xs font-medium text-foreground-secondary" dateTime={n.date}>
                {new Date(n.date).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
              </time>
              <h2 className="text-2xl font-semibold text-black tracking-tight mt-2 mb-3">{n.title}</h2>
              <p className="text-[15px] text-foreground-secondary leading-relaxed">{n.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
