export function DepartmentPanel({
  nombre,
  value,
  unidad,
  formatValue,
  descripcion,
  fuente,
  extra,
}: {
  nombre: string | null;
  value: number | null;
  unidad: string;
  formatValue: (v: number) => string;
  descripcion: string;
  fuente: string;
  extra?: { label: string; value: string }[];
}) {
  return (
    <div className="p-6 rounded-2xl bg-background-subtle border border-border-soft min-h-[220px]">
      {nombre ? (
        <>
          <h3 className="text-lg font-semibold text-black mb-1">{nombre}</h3>
          {value === null ? (
            <p className="text-sm text-foreground-secondary">Sin dato disponible para este departamento.</p>
          ) : (
            <>
              <p className="text-3xl font-semibold text-black mb-1">
                {formatValue(value)}
                <span className="text-sm font-normal text-foreground-secondary ml-1.5">{unidad}</span>
              </p>
              {extra && extra.length > 0 && (
                <dl className="mt-4 space-y-1.5 text-sm">
                  {extra.map((e) => (
                    <div key={e.label} className="flex items-baseline justify-between gap-4">
                      <dt className="text-foreground-secondary">{e.label}</dt>
                      <dd className="text-black font-medium">{e.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <p className="text-sm text-foreground-secondary leading-relaxed mb-4">{descripcion}</p>
          <p className="text-[13px] text-foreground-secondary/70">
            Pasa el cursor o toca un departamento en el mapa para ver su dato.
          </p>
        </>
      )}
      <p className="mt-5 pt-4 border-t border-border-soft text-[11px] text-foreground-secondary/70">
        Fuente: {fuente}
      </p>
    </div>
  );
}
