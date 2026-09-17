"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type { DepartmentGeoJSON } from "@/lib/colombia-map";

/** [lon, lat, nombre, municipio, deptoCodigo] — compact on purpose, see
 * scripts/infraestructura-visible/build_puntos.py. */
type PuntoTuple = [number, number, string | null, string | null, string | null];

export interface PuntoCategoria {
  slug: string;
  label: string;
  count: number;
}

// A plain HTML/CSS dot instead of Leaflet's default image-based pin —
// sidesteps the classic "marker icon 404s after bundling" problem entirely
// and stays on-brand (no arbitrary hues). Leaflet.markercluster only
// clusters real `L.Marker` instances (not `CircleMarker`, which isn't a
// Marker subclass), so this has to be a Marker with a custom icon, not a
// cheaper vector shape.
const dotIcon = L.divIcon({
  className: "",
  html: '<span style="display:block;width:9px;height:9px;border-radius:9999px;background:#7a6100;border:1.5px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.15);"></span>',
  iconSize: [9, 9],
  iconAnchor: [4.5, 4.5],
});

function clusterIcon(cluster: { getChildCount: () => number }) {
  const count = cluster.getChildCount();
  const size = count < 50 ? 32 : count < 500 ? 40 : 48;
  return L.divIcon({
    html: `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:9999px;background:#1F1F1C;color:#ffde00;font-weight:600;font-size:12px;border:2px solid white;">${count}</div>`,
    className: "",
    iconSize: [size, size],
  });
}

export function PuntosLeafletMap({
  geojson,
  categorias,
}: {
  geojson: DepartmentGeoJSON;
  categorias: PuntoCategoria[];
}) {
  const bounds = useMemo(() => L.geoJSON(geojson).getBounds(), [geojson]);
  const [activeSlug, setActiveSlug] = useState(categorias[0]?.slug);
  const [points, setPoints] = useState<PuntoTuple[] | null>(null);
  const [loading, setLoading] = useState(true);

  const active = categorias.find((c) => c.slug === activeSlug) ?? categorias[0];

  // leaflet.markercluster only clusters within a single MarkerClusterGroup
  // instance's own spatial index — rendering one group per department (
  // instead of one big group for every point) is what stops the map from
  // merging, say, a hospital cluster near a department border with the
  // neighboring department's cluster on zoom-out.
  const groupsByDepto = useMemo(() => {
    if (!points) return null;
    const groups = new Map<string, PuntoTuple[]>();
    for (const point of points) {
      const key = point[4] ?? "sin-departamento";
      const group = groups.get(key);
      if (group) group.push(point);
      else groups.set(key, [point]);
    }
    return groups;
  }, [points]);

  // `loading` starts `true` (the initial category's fetch is about to run
  // in the effect below) and is only ever changed from a plain event
  // handler (selectCategoria) or a fetch `.then()`/`.catch()` callback —
  // never synchronously at the top of an effect body.
  const selectCategoria = (slug: string) => {
    setActiveSlug(slug);
    setLoading(true);
    setPoints(null);
  };

  useEffect(() => {
    if (!activeSlug) return;
    let cancelled = false;
    fetch(`/data/infraestructura-visible/puntos/${activeSlug}.json`)
      .then((r) => r.json())
      .then((data: PuntoTuple[]) => {
        if (!cancelled) {
          setPoints(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeSlug]);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Categoría de puntos"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6"
      >
        {categorias.map((c) => {
          const isActive = c.slug === activeSlug;
          return (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => selectCategoria(c.slug)}
              className={`px-4 py-3 rounded-2xl border text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                isActive ? "bg-black border-black" : "bg-white border-border-soft hover:border-border-strong"
              }`}
            >
              <span className={`block text-[13px] font-medium ${isActive ? "text-white" : "text-black"}`}>{c.label}</span>
              <span className={`block text-[11px] ${isActive ? "text-white/60" : "text-foreground-secondary"}`}>
                {c.count.toLocaleString("es-CO")}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative p-4 sm:p-6 rounded-2xl bg-background-subtle border border-border-soft">
        <MapContainer
          bounds={bounds}
          boundsOptions={{ padding: [12, 12] }}
          minZoom={4}
          maxZoom={17}
          scrollWheelZoom
          style={{ height: 680, width: "100%", borderRadius: "0.75rem" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {groupsByDepto &&
            Array.from(groupsByDepto.entries()).map(([deptoCodigo, deptoPoints]) => (
              <MarkerClusterGroup
                key={deptoCodigo}
                chunkedLoading
                iconCreateFunction={clusterIcon}
                maxClusterRadius={60}
              >
                {deptoPoints.map(([lon, lat, nombre, municipio], i) => (
                  <Marker key={i} position={[lat, lon]} icon={dotIcon}>
                    <Popup>
                      <strong>{nombre ?? active?.label ?? "Punto"}</strong>
                      {municipio ? <><br />{municipio}</> : null}
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            ))}
        </MapContainer>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[13px] text-foreground-secondary bg-white/90 backdrop-blur px-3 py-1.5 rounded-full">
              Cargando {active?.label.toLowerCase()}…
            </span>
          </div>
        )}
      </div>

      <p className="mt-4 text-[13px] text-foreground-secondary">
        {active ? `${active.count.toLocaleString("es-CO")} ${active.label.toLowerCase()} ubicados en todo el país.` : ""}{" "}
        Acércate (zoom) para separar los grupos y ver cada ubicación; toca un punto para ver el
        detalle.
      </p>
    </div>
  );
}
