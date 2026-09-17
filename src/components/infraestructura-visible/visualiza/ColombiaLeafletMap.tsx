"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L, { type Layer, type GeoJSON as LeafletGeoJSONType, type Path } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { DepartmentGeoJSON } from "@/lib/colombia-map";
import { getFillColor, quantileBreaks, NO_DATA_FILL } from "@/lib/colombia-map";

export function ColombiaLeafletMap({
  geojson,
  datasetId,
  values,
  nombrePorCodigo,
  unidad,
  formatValue,
  hoveredCodigo,
  selectedCodigo,
  onHover,
  onSelect,
}: {
  geojson: DepartmentGeoJSON;
  /** Used only as a React `key` to force the GeoJSON layer to remount (and
   * re-apply its `style`/tooltip content) when the active dataset changes
   * — react-leaflet's `GeoJSON` doesn't re-run `style` on prop changes
   * otherwise. Cheap at 33 polygons. */
  datasetId: string;
  values: Record<string, number>;
  nombrePorCodigo: Record<string, string>;
  unidad: string;
  formatValue: (v: number) => string;
  hoveredCodigo: string | null;
  selectedCodigo: string | null;
  onHover: (codigo: string | null) => void;
  onSelect: (codigo: string) => void;
}) {
  const breaks = useMemo(() => quantileBreaks(Object.values(values)), [values]);
  const geoJsonRef = useRef<LeafletGeoJSONType | null>(null);
  // Fit the actual data extent instead of guessing a center/zoom by hand —
  // robust to the container's aspect ratio and correct if the geojson ever
  // changes (e.g. a future department added).
  const bounds = useMemo(() => L.geoJSON(geojson).getBounds(), [geojson]);

  const styleFor = (codigo: string, isActive: boolean) => {
    const value = values[codigo];
    const hasData = value !== undefined;
    return {
      fillColor: hasData ? getFillColor(value, breaks) : NO_DATA_FILL,
      fillOpacity: hasData ? 0.75 : 0.5,
      color: isActive ? "#7a6100" : "#ffffff",
      weight: isActive ? 2.5 : 1,
      dashArray: hasData ? undefined : "3 3",
    };
  };

  // React to hover/select changes coming from OUTSIDE the map (e.g. the
  // ranking list) without remounting the whole layer.
  useEffect(() => {
    const layer = geoJsonRef.current;
    if (!layer) return;
    layer.eachLayer((l) => {
      const path = l as Path & { feature?: GeoJSON.Feature<GeoJSON.Geometry, { codigo: string }> };
      const codigo = path.feature?.properties.codigo;
      if (!codigo) return;
      const isActive = codigo === hoveredCodigo || codigo === selectedCodigo;
      path.setStyle(styleFor(codigo, isActive));
      if (isActive) path.bringToFront();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredCodigo, selectedCodigo, values, breaks]);

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [12, 12] }}
      minZoom={4}
      maxZoom={12}
      scrollWheelZoom
      style={{ height: 680, width: "100%", borderRadius: "1rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON
        key={datasetId}
        ref={geoJsonRef}
        data={geojson}
        style={(feature) => styleFor(feature?.properties?.codigo, false)}
        onEachFeature={(feature: GeoJSON.Feature<GeoJSON.Geometry, { codigo: string; nombre: string }>, layer: Layer) => {
          const codigo = feature.properties.codigo;
          const nombre = nombrePorCodigo[codigo] ?? feature.properties.nombre;
          const value = values[codigo];
          const label =
            value !== undefined
              ? `<strong>${nombre}</strong><br/>${formatValue(value)} ${unidad}`
              : `<strong>${nombre}</strong><br/>Sin dato`;
          layer.bindTooltip(label, { sticky: true });
          layer.on({
            mouseover: () => onHover(codigo),
            mouseout: () => onHover(null),
            click: () => onSelect(codigo),
          });
        }}
      />
    </MapContainer>
  );
}
