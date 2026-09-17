import { Download } from "lucide-react";

export interface DocumentoRow {
  codigo: string;
  titulo: string;
  archivo: string;
  tamanoKB: number;
}

export function Biblioteca({ documentos }: { documentos: DocumentoRow[] }) {
  return (
    <section className="relative pt-10 sm:pt-14 pb-24 sm:pb-32 px-5 sm:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-yellow-ink">Biblioteca</span>
          <h1 className="text-4xl sm:text-5xl font-semibold text-black tracking-tight text-balance mt-2 mb-5">
            Informes originales
          </h1>
          <p className="text-lg text-foreground-secondary leading-relaxed">
            Los {documentos.length} capítulos de informe recuperados del proyecto original, en su
            formato de origen. Con el tiempo iremos convirtiendo los más relevantes a páginas de
            lectura directa.
          </p>
        </div>

        <ul className="divide-y divide-border-soft border-t border-b border-border-soft">
          {documentos.map((d) => (
            <li key={d.codigo} className="py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-xs font-mono text-foreground-secondary/70">#{d.codigo}</span>
                <p className="text-[15px] font-medium text-black leading-snug">{d.titulo}</p>
              </div>
              <a
                href={`/documentos/infraestructura-visible/${d.archivo}`}
                download
                className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border-soft text-[13px] font-medium text-black hover:border-border-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                <Download className="w-3.5 h-3.5" />
                {d.tamanoKB} KB
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
