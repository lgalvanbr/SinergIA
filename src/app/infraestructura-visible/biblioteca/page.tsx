import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Biblioteca, type DocumentoRow } from "@/components/infraestructura-visible/Biblioteca";

export const metadata: Metadata = {
  title: "Biblioteca",
  description: "Los informes originales del proyecto Infraestructura Visible, disponibles para descargar.",
};

export default function BibliotecaPage() {
  const full = join(process.cwd(), "public/data/infraestructura-visible/biblioteca.json");
  const documentos = JSON.parse(readFileSync(full, "utf-8")) as DocumentoRow[];

  return <Biblioteca documentos={documentos} />;
}
