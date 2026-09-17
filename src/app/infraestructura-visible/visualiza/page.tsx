import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { DepartmentGeoJSON } from "@/lib/colombia-map";
import {
  Visualiza,
  type CentroInnovacionRow,
  type Departamento,
  type HacinamientoRow,
  type IdcRow,
  type IpmRow,
  type Saber11Row,
  type ViasRow,
} from "@/components/infraestructura-visible/visualiza/Visualiza";
import type { PuntoCategoria } from "@/components/infraestructura-visible/visualiza/PuntosLeafletMap";

export const metadata: Metadata = {
  title: "Visualiza",
  description:
    "Mapa interactivo de Colombia por departamento y por puntos de interés: pobreza, vías, competitividad, Saber 11, hospitales, colegios y más.",
};

function readJson<T>(relPath: string): T {
  const full = join(process.cwd(), "public/data/infraestructura-visible", relPath);
  return JSON.parse(readFileSync(full, "utf-8")) as T;
}

export default function VisualizaPage() {
  const geojson = readJson<DepartmentGeoJSON>("colombia-departamentos.geo.json");
  const departamentos = readJson<Departamento[]>("departamentos.json");
  const ipm = readJson<IpmRow[]>("ipm.json");
  const vias = readJson<ViasRow[]>("vias.json");
  const idc = readJson<IdcRow[]>("idc.json");
  const saber11 = readJson<Saber11Row[]>("saber11.json");
  const hacinamiento = readJson<HacinamientoRow[]>("hacinamiento.json");
  const centrosInnovacion = readJson<CentroInnovacionRow[]>("centros-innovacion.json");
  const puntosCategorias = readJson<PuntoCategoria[]>("puntos/manifest.json");

  return (
    <section className="relative pt-10 sm:pt-14 pb-24 sm:pb-32 px-5 sm:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-yellow-ink">Visualiza</span>
          <h1 className="text-4xl sm:text-5xl font-semibold text-black tracking-tight text-balance mt-2 mb-5">
            Colombia, departamento por departamento
          </h1>
          <p className="text-lg text-foreground-secondary leading-relaxed">
            Explora los indicadores por departamento, o cambia a &ldquo;Puntos de interés&rdquo;
            para ver la ubicación real de hospitales, colegios, universidades, bibliotecas y
            centros de reclusión en todo el país. Datos recuperados del proyecto original
            Infraestructura
            Visible.
          </p>
        </div>

        <Visualiza
          geojson={geojson}
          departamentos={departamentos}
          ipm={ipm}
          vias={vias}
          idc={idc}
          saber11={saber11}
          hacinamiento={hacinamiento}
          centrosInnovacion={centrosInnovacion}
          puntosCategorias={puntosCategorias}
        />
      </div>
    </section>
  );
}
