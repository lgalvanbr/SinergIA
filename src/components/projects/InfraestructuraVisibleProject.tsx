import Link from "next/link";
import { ExternalLink } from "lucide-react";

const features = [
  "6 capas de indicadores departamentales: pobreza (IPM), densidad vial, competitividad (IDC), Saber 11, hacinamiento carcelario y centros de innovación",
  "Mapa de puntos de interés con más de 50.000 ubicaciones reales: hospitales, colegios, universidades, bibliotecas y centros de reclusión",
  "Mapas interactivos sobre OpenStreetMap, con agrupación (clustering) de puntos que respeta los límites departamentales",
  "Sección Explora con el índice completo de 356 entregables del proyecto original",
  "Biblioteca con los 18 capítulos del informe técnico original, disponibles para descarga",
];

const stack = ["Next.js", "Leaflet", "Python / GeoPandas", "GeoJSON"];

export function InfraestructuraVisibleProject() {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
        <span className="text-sm text-foreground-secondary">Modernización de infraestructura · Grupo GeoSI</span>
        <span className="text-sm font-medium text-black">Prototipo funcional</span>
      </div>

      <h3 className="text-2xl font-semibold text-black mt-1 mb-4">Infraestructura Visible</h3>

      <p className="text-[15px] sm:text-base text-foreground-secondary leading-relaxed max-w-2xl mb-8">
        Plataforma de datos de infraestructura de Colombia, liderada originalmente por el profesor
        Mauricio Sánchez-Silva y reconocida con el premio &ldquo;Dejar Huella&rdquo; de la
        Universidad de los Andes por su apoyo al programa Obras por Impuestos. El sitio original
        dejó de mantenerse; este proyecto lo revive dentro de SinergIA con los datos recuperados
        del equipo de investigación GeoSI.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_14rem] gap-8 mb-8">
        <div>
          <h4 className="text-sm font-semibold text-black mb-3">Qué incluye</h4>
          <ul className="space-y-2.5">
            {features.map((f) => (
              <li key={f} className="text-[15px] text-foreground-secondary leading-relaxed pl-4 border-l-2 border-yellow">
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-black mb-3">En cifras</h4>
          <div className="mb-6">
            <span className="block text-3xl font-semibold text-black">33</span>
            <span className="text-sm text-foreground-secondary">departamentos con datos</span>
          </div>
          <h4 className="text-sm font-semibold text-black mb-3">Stack técnico</h4>
          <div className="flex flex-wrap gap-2">
            {stack.map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full border border-border-strong text-foreground-secondary">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded live preview — selecting this project shows the real, working
          sub-site right here instead of just linking out to it. The iframe'd
          page carries its own nav (Visualiza/Explora/Biblioteca/...), so this
          panel alone lets a visitor actually browse it without leaving
          /proyectos. */}
      <div className="rounded-2xl border border-border-soft overflow-hidden bg-background-subtle">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-soft bg-white">
          <span className="text-xs font-medium text-foreground-secondary">
            infraestructura-visible/visualiza
          </span>
          <Link
            href="/infraestructura-visible"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-black hover:text-yellow-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded"
          >
            Abrir en pantalla completa
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
        <iframe
          src="/infraestructura-visible/visualiza"
          title="Infraestructura Visible"
          loading="lazy"
          className="w-full h-[640px] sm:h-[760px] border-0 block"
        />
      </div>
    </div>
  );
}
