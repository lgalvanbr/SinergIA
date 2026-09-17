export interface RankingRow {
  codigo: string;
  nombre: string;
  value: number;
}

export function RankingList({
  rows,
  formatValue,
  unidad,
  hoveredCodigo,
  selectedCodigo,
  onHover,
  onSelect,
}: {
  rows: RankingRow[];
  formatValue: (v: number) => string;
  unidad: string;
  hoveredCodigo: string | null;
  selectedCodigo: string | null;
  onHover: (codigo: string | null) => void;
  onSelect: (codigo: string) => void;
}) {
  const sorted = [...rows].sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-2xl bg-background-subtle border border-border-soft overflow-hidden">
      <div className="px-5 pt-4 pb-3 border-b border-border-soft flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-black">Todos los departamentos</h3>
        <span className="text-[11px] text-foreground-secondary">{unidad}</span>
      </div>
      <ol className="max-h-[420px] overflow-y-auto divide-y divide-border-soft">
        {sorted.map((r, i) => {
          const isActive = r.codigo === selectedCodigo || r.codigo === hoveredCodigo;
          return (
            <li key={r.codigo}>
              <button
                type="button"
                onMouseEnter={() => onHover(r.codigo)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onSelect(r.codigo)}
                className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:-outline-offset-2 ${
                  isActive ? "bg-yellow/15" : "hover:bg-black/[0.03]"
                }`}
              >
                <span className="text-xs font-mono text-foreground-secondary/70 w-5 shrink-0">{i + 1}</span>
                <span className={`flex-1 text-[13px] truncate ${isActive ? "text-black font-medium" : "text-black"}`}>
                  {r.nombre}
                </span>
                <span className="text-[13px] font-medium text-black tabular-nums">{formatValue(r.value)}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
