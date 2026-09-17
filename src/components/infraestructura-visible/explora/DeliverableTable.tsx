"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export interface DeliverableRow {
  codigo: string | null;
  titulo: string;
  alcance: string | null;
  temas: string[];
  variables: string[];
  fuentes: string[];
}

/** A handful of deliverables already have a live page elsewhere on the
 * site — the rest show their index entry with no visualization yet. */
const LINKED_CODES: Record<string, string> = {
  "14": "/infraestructura-visible/visualiza",
  "17": "/infraestructura-visible/visualiza",
  "18": "/infraestructura-visible/visualiza",
  "19": "/infraestructura-visible/visualiza",
  "38": "/infraestructura-visible/visualiza",
};

export function DeliverableTable({ rows }: { rows: DeliverableRow[] }) {
  const [query, setQuery] = useState("");
  const [alcance, setAlcance] = useState<"todos" | "INTERNACIONAL" | "NACIONAL">("todos");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (alcance !== "todos" && r.alcance !== alcance) return false;
      if (!q) return true;
      return (
        r.titulo.toLowerCase().includes(q) ||
        r.temas.some((t) => t.toLowerCase().includes(q)) ||
        r.variables.some((v) => v.toLowerCase().includes(q))
      );
    });
  }, [rows, query, alcance]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título, tema o variable…"
          className="flex-1 px-4 py-2.5 rounded-xl border border-border-soft text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        />
        <div className="flex gap-2">
          {(["todos", "INTERNACIONAL", "NACIONAL"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAlcance(a)}
              className={`px-4 py-2.5 rounded-xl border text-[13px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                alcance === a ? "bg-black border-black text-white" : "bg-white border-border-soft text-foreground-secondary hover:text-black"
              }`}
            >
              {a === "todos" ? "Todos" : a === "INTERNACIONAL" ? "Internacional" : "Nacional"}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[13px] text-foreground-secondary mb-4">
        {filtered.length} de {rows.length} análisis
      </p>

      <ul className="divide-y divide-border-soft border-t border-b border-border-soft">
        {filtered.map((r, i) => {
          const href = r.codigo ? LINKED_CODES[r.codigo] : undefined;
          return (
            <li key={`${r.codigo}-${i}`} className="py-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {r.codigo && <span className="text-xs font-mono text-foreground-secondary/70">#{r.codigo}</span>}
                  {r.alcance && (
                    <span className="text-[10px] font-medium uppercase tracking-wide text-foreground-secondary/70">
                      {r.alcance}
                    </span>
                  )}
                </div>
                <p className="text-[15px] font-medium text-black leading-snug">{r.titulo}</p>
                {r.temas.length > 0 && (
                  <p className="text-[13px] text-foreground-secondary mt-1">{r.temas.join(" · ")}</p>
                )}
              </div>
              {href ? (
                <Link
                  href={href}
                  className="shrink-0 text-[13px] font-medium text-black underline decoration-yellow decoration-4 underline-offset-4 hover:decoration-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded"
                >
                  Ver mapa
                </Link>
              ) : (
                <span className="shrink-0 text-[13px] text-foreground-secondary/60">Sin visualización</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
