import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Noticia } from "./content/noticias";

export function NoticiaDetail({ noticia }: { noticia: Noticia }) {
  return (
    <section className="relative pt-10 sm:pt-14 pb-24 sm:pb-32 px-5 sm:px-8 bg-white">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/infraestructura-visible/noticias"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground-secondary hover:text-black transition-colors mb-8 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
          <ChevronLeft className="w-4 h-4" />
          Noticias
        </Link>

        <time className="text-xs font-medium text-foreground-secondary" dateTime={noticia.date}>
          {new Date(noticia.date).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
        </time>
        <h1 className="text-3xl sm:text-5xl font-semibold text-black tracking-tight text-balance mt-2 mb-8">
          {noticia.title}
        </h1>

        <div className="space-y-5">
          {noticia.body.map((p, i) => (
            <p key={i} className="text-base sm:text-lg text-foreground-secondary leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
