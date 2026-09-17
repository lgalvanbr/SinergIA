const features = [
  "Adquisición en tiempo real de datos de instrumentación (LabVIEW → API Flask)",
  "Visualización 3D paramétrica: el histórico de cada sensor mueve y deforma el modelo",
  "Simulación de eventos sísmicos con detección automática de la ventana del evento",
  "Reproducción de ensayos guardados, con control de velocidad (0.5x–16x)",
  "Comparación entre sensores para estimar deriva relativa piso a piso",
];

const stack = ["Python / Flask", "LabVIEW", "Three.js / WebGL", "GLTF", "Vercel", "Render"];

export function MesaVibratoria() {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
        <span className="text-sm text-foreground-secondary">
          Modernización de infraestructura · Laboratorio CIAM
        </span>
        <span className="text-sm font-medium text-black">Prototipo funcional</span>
      </div>

      <h3 className="text-2xl font-semibold text-black mt-1 mb-4">Mesa Vibratoria</h3>

      <p className="text-[15px] sm:text-base text-foreground-secondary leading-relaxed max-w-2xl mb-8">
        Modelo a escala de una casa de dos pisos, instrumentado con sensores y sometido a ensayos
        en la mesa vibratoria del Laboratorio CIAM (Departamento de Ingeniería Civil y Ambiental).
        Los datos de instrumentación se transmiten en tiempo real a un visor 3D que reproduce,
        sensor por sensor, cómo se mueve y deforma la estructura durante un sismo simulado.
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
          <h4 className="text-sm font-semibold text-black mb-3">En el modelo</h4>
          <div className="mb-6">
            <span className="block text-3xl font-semibold text-black">47</span>
            <span className="text-sm text-foreground-secondary">sensores instrumentados</span>
          </div>
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
          href="https://casa-vibratoria.vercel.app/modelo3d.html"
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
