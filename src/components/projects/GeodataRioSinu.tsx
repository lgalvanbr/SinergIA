const features = [
  "Capas geográficas del área de la cuenca: subcuencas, zonas protegidas y cuerpos de agua",
  "Clasificación de cuerpos de agua (lótico / léntico) e infraestructura asociada",
  "Modelo digital de elevación (DEM) con visualización 3D del terreno en Three.js",
  "Perfil de elevación: marca dos puntos en el mapa y genera el corte transversal",
  "Carga de archivos GeoTIFF propios (hasta 205MB), procesados en el navegador sin subirlos a un servidor",
];

const stack = ["Leaflet", "Three.js", "GeoTIFF / DEM", "GeoJSON", "Vercel"];

export function GeodataRioSinu() {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
        <span className="text-sm text-foreground-secondary">
          Recursos y riesgo ambiental · Laboratorio CIAM
        </span>
        <span className="text-sm font-medium text-black">Prototipo funcional</span>
      </div>

      <h3 className="text-2xl font-semibold text-black mt-1 mb-4">Geodata Río Sinú</h3>

      <p className="text-[15px] sm:text-base text-foreground-secondary leading-relaxed max-w-2xl mb-8">
        Portal geográfico de la cuenca del río Sinú (Córdoba, Colombia): un visor de mapas con
        capas hidrográficas, ambientales y de infraestructura, más un modelo digital de elevación
        en 3D para analizar el terreno y generar perfiles de elevación del cauce y sus alrededores.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_14rem] gap-8 mb-8">
        <div>
          <h4 className="text-sm font-semibold text-black mb-3">Qué hace</h4>
          <ul className="space-y-2.5">
            {features.map((f) => (
              <li key={f} className="text-[15px] text-foreground-secondary leading-relaxed pl-4 border-l-2 border-yellow">
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-black mb-3">Stack técnico</h4>
          <div className="flex flex-wrap gap-2">
            {stack.map((s) => (
              <span
                key={s}
                className="text-xs px-2.5 py-1 rounded-full border border-border-strong text-foreground-secondary"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 pt-6 border-t border-black/10">
        <a
          href="https://casa-vibratoria.vercel.app/Rio%20Sinu/Index.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[15px] font-medium text-black underline decoration-yellow decoration-4 underline-offset-4 hover:decoration-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded"
        >
          Ver demo en vivo
        </a>
        <a
          href="https://github.com/Sebastian-Rodrigueza/Casa-vibratoria"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[15px] font-medium text-foreground-secondary hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded"
        >
          Ver repositorio
        </a>
      </div>
    </div>
  );
}
