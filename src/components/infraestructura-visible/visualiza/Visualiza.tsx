"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { HeartPulse, Route, TrendingUp, GraduationCap, Building, Lightbulb } from "lucide-react";
import { easeApple } from "@/lib/motion";
import { legendSwatches, quantileBreaks, type DepartmentGeoJSON } from "@/lib/colombia-map";
import { DatasetSwitcher, type DatasetTabInfo } from "./DatasetSwitcher";
import { DepartmentPanel } from "./DepartmentPanel";
import { RankingList } from "./RankingList";
import type { PuntoCategoria } from "./PuntosLeafletMap";

// Leaflet touches `window`/`document` at import time, so both map
// components must be client-only, never server-rendered.
const ColombiaLeafletMap = dynamic(() => import("./ColombiaLeafletMap").then((m) => m.ColombiaLeafletMap), {
  ssr: false,
  loading: () => <div className="h-[680px] rounded-2xl bg-background-subtle animate-pulse" />,
});
const PuntosLeafletMap = dynamic(() => import("./PuntosLeafletMap").then((m) => m.PuntosLeafletMap), {
  ssr: false,
  loading: () => <div className="h-[680px] rounded-2xl bg-background-subtle animate-pulse" />,
});

export interface Departamento {
  codigo: string;
  nombre: string;
  region: string | null;
}
export interface IpmRow {
  codigo: string;
  total: number;
  cabeceras: number;
  ruralDisperso: number;
}
export interface ViasRow {
  codigo: string;
  areaKm2: number;
  redPrimariaKm: number;
  redSecundariaKm: number;
  densidadKm1000km2: number;
}
export interface IdcRow {
  codigo: string;
  puntajeGeneral: number;
}
export interface Saber11Row {
  codigo: string;
  estudiantes: number;
  puntGlobal: number;
  puntLecturaCritica: number;
  puntMatematicas: number;
}
export interface HacinamientoRow {
  codigo: string;
  capacidad: number;
  poblacion: number;
  hacinamiento: number;
  porcentajeHacinamiento: number;
}
export interface CentroInnovacionRow {
  codigo: string;
  total: number;
}

export function Visualiza({
  geojson,
  departamentos,
  ipm,
  vias,
  idc,
  saber11,
  hacinamiento,
  centrosInnovacion,
  puntosCategorias,
}: {
  geojson: DepartmentGeoJSON;
  departamentos: Departamento[];
  ipm: IpmRow[];
  vias: ViasRow[];
  idc: IdcRow[];
  saber11: Saber11Row[];
  hacinamiento: HacinamientoRow[];
  centrosInnovacion: CentroInnovacionRow[];
  puntosCategorias: PuntoCategoria[];
}) {
  const nombrePorCodigo = useMemo(
    () => Object.fromEntries(departamentos.map((d) => [d.codigo, d.nombre])),
    [departamentos]
  );

  const datasets = useMemo(() => {
    const ipmByCodigo = Object.fromEntries(ipm.map((r) => [r.codigo, r]));
    const viasByCodigo = Object.fromEntries(vias.map((r) => [r.codigo, r]));
    const saberByCodigo = Object.fromEntries(saber11.map((r) => [r.codigo, r]));
    const hacinByCodigo = Object.fromEntries(hacinamiento.map((r) => [r.codigo, r]));
    const centrosByCodigo = Object.fromEntries(centrosInnovacion.map((r) => [r.codigo, r.total]));
    // Unlike the other datasets, an absent department here means a real,
    // verified zero (no Colciencias-recognized entity) — not an
    // unmeasured gap — so every department gets an explicit 0 rather than
    // being left out and rendered as "sin dato".
    const centrosValues = Object.fromEntries(departamentos.map((d) => [d.codigo, centrosByCodigo[d.codigo] ?? 0]));

    return {
      pobreza: {
        id: "pobreza",
        label: "Pobreza (IPM)",
        icon: HeartPulse,
        unidad: "% IPM",
        descripcion:
          "Índice de Pobreza Multidimensional por departamento (DANE, 2018) — porcentaje de hogares en condición de pobreza multidimensional.",
        fuente: "DANE",
        values: Object.fromEntries(ipm.map((r) => [r.codigo, r.total])),
        formatValue: (v: number) => v.toFixed(1),
        extraFor: (codigo: string) => {
          const r = ipmByCodigo[codigo];
          if (!r) return undefined;
          return [
            { label: "Cabeceras", value: `${r.cabeceras.toFixed(1)}%` },
            { label: "Rural disperso", value: `${r.ruralDisperso.toFixed(1)}%` },
          ];
        },
      },
      vias: {
        id: "vias",
        label: "Densidad vial",
        icon: Route,
        unidad: "km / 1.000 km²",
        descripcion:
          "Densidad de la red vial primaria y secundaria por departamento (Ministerio de Transporte / DANE).",
        fuente: "Ministerio de Transporte, DANE",
        values: Object.fromEntries(vias.map((r) => [r.codigo, r.densidadKm1000km2])),
        formatValue: (v: number) => v.toFixed(1),
        extraFor: (codigo: string) => {
          const r = viasByCodigo[codigo];
          if (!r) return undefined;
          return [
            { label: "Red primaria", value: `${r.redPrimariaKm.toFixed(0)} km` },
            { label: "Red secundaria", value: `${r.redSecundariaKm.toFixed(0)} km` },
          ];
        },
      },
      idc: {
        id: "idc",
        label: "Competitividad (IDC)",
        icon: TrendingUp,
        unidad: "/ 100",
        descripcion:
          "Índice Departamental de Competitividad 2018 — puntaje general del Consejo Privado de Competitividad / CEPEC-Universidad del Rosario.",
        fuente: "Índice Departamental de Competitividad, 2018",
        values: Object.fromEntries(idc.map((r) => [r.codigo, r.puntajeGeneral])),
        formatValue: (v: number) => v.toFixed(1),
        extraFor: () => undefined,
      },
      saber11: {
        id: "saber11",
        label: "Saber 11 (promedio)",
        icon: GraduationCap,
        unidad: "/ 500",
        descripcion:
          "Puntaje global promedio en las pruebas Saber 11 (colegios públicos, 2019-1) por departamento del colegio, calculado a partir de la microdata de ICFES.",
        fuente: "ICFES — microdata Saber 11, 2019-1",
        values: Object.fromEntries(saber11.map((r) => [r.codigo, r.puntGlobal])),
        formatValue: (v: number) => v.toFixed(0),
        extraFor: (codigo: string) => {
          const r = saberByCodigo[codigo];
          if (!r) return undefined;
          return [
            { label: "Lectura crítica", value: r.puntLecturaCritica.toFixed(0) },
            { label: "Matemáticas", value: r.puntMatematicas.toFixed(0) },
            { label: "Estudiantes", value: r.estudiantes.toLocaleString("es-CO") },
          ];
        },
      },
      hacinamiento: {
        id: "hacinamiento",
        label: "Hacinamiento carcelario",
        icon: Building,
        unidad: "% sobre capacidad",
        descripcion:
          "Hacinamiento en establecimientos penitenciarios por departamento (INPEC, agosto 2019) — porcentaje de población reclusa por encima de la capacidad instalada.",
        fuente: "INPEC, agosto 2019",
        values: Object.fromEntries(hacinamiento.map((r) => [r.codigo, r.porcentajeHacinamiento * 100])),
        formatValue: (v: number) => `${v.toFixed(0)}%`,
        extraFor: (codigo: string) => {
          const r = hacinByCodigo[codigo];
          if (!r) return undefined;
          return [
            { label: "Capacidad", value: r.capacidad.toLocaleString("es-CO") },
            { label: "Población reclusa", value: r.poblacion.toLocaleString("es-CO") },
          ];
        },
      },
      centrosInnovacion: {
        id: "centrosInnovacion",
        label: "Centros de innovación",
        icon: Lightbulb,
        unidad: "entidades",
        descripcion:
          "Entidades reconocidas por Colciencias como centros de investigación, desarrollo tecnológico o unidades de I+D+i de empresa, por departamento (2019). La mayoría del país no tiene ninguna reconocida.",
        fuente: "Colciencias, 2019",
        values: centrosValues,
        formatValue: (v: number) => v.toFixed(0),
        extraFor: () => undefined,
      },
    };
  }, [ipm, vias, idc, saber11, hacinamiento, centrosInnovacion, departamentos]);

  const [mode, setMode] = useState<"departamentos" | "puntos">("departamentos");
  const [activeId, setActiveId] = useState<keyof typeof datasets>("pobreza");
  const [hoveredCodigo, setHoveredCodigo] = useState<string | null>(null);
  const [selectedCodigo, setSelectedCodigo] = useState<string | null>(null);

  const active = datasets[activeId];
  const displayCodigo = hoveredCodigo ?? selectedCodigo;
  const breaks = useMemo(() => quantileBreaks(Object.values(active.values)), [active.values]);
  const swatches = useMemo(() => legendSwatches(), []);

  const tabs: DatasetTabInfo[] = Object.values(datasets).map((d) => ({ id: d.id, label: d.label, icon: d.icon }));

  return (
    <div>
      <div role="tablist" aria-label="Modo de visualización" className="inline-flex p-1 rounded-full bg-background-subtle border border-border-soft mb-6">
        {(
          [
            ["departamentos", "Por departamento"],
            ["puntos", "Puntos de interés"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
              mode === id ? "bg-black text-white" : "text-foreground-secondary hover:text-black"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "puntos" ? (
        <PuntosLeafletMap geojson={geojson} categorias={puntosCategorias} />
      ) : (
        <>
          <DatasetSwitcher
            options={tabs}
            activeId={activeId}
            onChange={(id) => {
              setActiveId(id as keyof typeof datasets);
              setSelectedCodigo(null);
            }}
          />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-6">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: easeApple }}
          className="p-4 sm:p-6 rounded-2xl bg-background-subtle border border-border-soft"
        >
          <ColombiaLeafletMap
            geojson={geojson}
            datasetId={active.id}
            values={active.values}
            nombrePorCodigo={nombrePorCodigo}
            unidad={active.unidad}
            formatValue={active.formatValue}
            hoveredCodigo={hoveredCodigo}
            selectedCodigo={selectedCodigo}
            onHover={setHoveredCodigo}
            onSelect={(codigo) => setSelectedCodigo((cur) => (cur === codigo ? null : codigo))}
          />

          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span className="text-[11px] text-foreground-secondary">Menor</span>
            <div className="flex h-2.5 rounded-full overflow-hidden">
              {swatches.map((c, i) => (
                <span key={i} style={{ backgroundColor: c }} className="w-8 h-full" />
              ))}
            </div>
            <span className="text-[11px] text-foreground-secondary">Mayor</span>
            <span className="text-[11px] text-foreground-secondary/70 ml-2">
              · rango: {active.formatValue(breaks[0] ?? 0)}–{active.formatValue(breaks[breaks.length - 1] ?? 0)}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-foreground-secondary/70 ml-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-background-subtle border border-dashed border-border-strong" />
              Sin dato
            </span>
          </div>
        </motion.div>

        <div className="flex flex-col gap-6">
          <DepartmentPanel
            nombre={displayCodigo ? (nombrePorCodigo[displayCodigo] ?? null) : null}
            value={displayCodigo ? (active.values[displayCodigo] ?? null) : null}
            unidad={active.unidad}
            formatValue={active.formatValue}
            descripcion={active.descripcion}
            fuente={active.fuente}
            extra={displayCodigo ? active.extraFor(displayCodigo) : undefined}
          />

          <RankingList
            rows={Object.entries(active.values).map(([codigo, value]) => ({
              codigo,
              nombre: nombrePorCodigo[codigo] ?? codigo,
              value,
            }))}
            formatValue={active.formatValue}
            unidad={active.unidad}
            hoveredCodigo={hoveredCodigo}
            selectedCodigo={selectedCodigo}
            onHover={setHoveredCodigo}
            onSelect={(codigo) => setSelectedCodigo((cur) => (cur === codigo ? null : codigo))}
          />
        </div>
      </div>
        </>
      )}
    </div>
  );
}
