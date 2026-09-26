export function CiamAR() {
  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
        <span className="text-sm text-foreground-secondary">Modernización de infraestructura · Laboratorio CIAM</span>
        <span className="text-sm font-medium text-foreground-secondary">En desarrollo</span>
      </div>

      <h3 className="text-2xl font-semibold text-black mt-1 mb-4">ciamAR</h3>

      <p className="text-[15px] sm:text-base text-foreground-secondary leading-relaxed mb-6">
        Visor 3D y de realidad aumentada (WebAR) para modelos del Laboratorio Sísmico CIAM:
        estructuras, puentes, vías, túneles e hidráulica, con catálogo de modelos y proyección en
        AR desde el celular vía código QR, sin necesidad de instalar una app.
      </p>

      <a
        href="https://ciam-ar.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[15px] font-medium text-black underline decoration-yellow decoration-4 underline-offset-4 hover:decoration-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded"
      >
        Abrir ciamAR
      </a>
    </div>
  );
}
