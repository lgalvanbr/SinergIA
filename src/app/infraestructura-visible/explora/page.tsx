import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DeliverableTable, type DeliverableRow } from "@/components/infraestructura-visible/explora/DeliverableTable";

export const metadata: Metadata = {
  title: "Explora",
  description: "Los análisis originales del proyecto Infraestructura Visible, con sus variables y fuentes.",
};

export default function ExploraPage() {
  const full = join(process.cwd(), "public/data/infraestructura-visible/explora-index.json");
  const rows = JSON.parse(readFileSync(full, "utf-8")) as DeliverableRow[];

  return (
    <section className="relative pt-10 sm:pt-14 pb-24 sm:pb-32 px-5 sm:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-yellow-ink">Explora</span>
          <h1 className="text-4xl sm:text-5xl font-semibold text-black tracking-tight text-balance mt-2 mb-5">
            Todos los análisis
          </h1>
          <p className="text-lg text-foreground-secondary leading-relaxed">
            El índice completo del estudio original: {rows.length} análisis sobre infraestructura,
            competitividad, educación e innovación en Colombia, con sus variables y fuentes.
          </p>
        </div>

        <DeliverableTable rows={rows} />
      </div>
    </section>
  );
}
