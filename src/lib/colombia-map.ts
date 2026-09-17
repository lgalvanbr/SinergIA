export type DepartmentProperties = { codigo: string; nombre: string };
export type DepartmentFeature = GeoJSON.Feature<GeoJSON.Geometry, DepartmentProperties>;
export type DepartmentGeoJSON = GeoJSON.FeatureCollection<GeoJSON.Geometry, DepartmentProperties>;

/** codigo (2-digit DANE code, e.g. "05") -> numeric value for that department. */
export type DepartmentValues = Record<string, number>;

const RAMP_START = { r: 0x1f, g: 0x1f, b: 0x1c }; // brand ink, #1F1F1C
const RAMP_END = { r: 0xff, g: 0xde, b: 0x00 }; // brand yellow, #ffde00
const BUCKET_COUNT = 5;

function lerpColor(t: number): string {
  const r = Math.round(RAMP_START.r + (RAMP_END.r - RAMP_START.r) * t);
  const g = Math.round(RAMP_START.g + (RAMP_END.g - RAMP_START.g) * t);
  const b = Math.round(RAMP_START.b + (RAMP_END.b - RAMP_START.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

/** Quantile bucket breakpoints over the department values present (ignores
 * missing departments — they're rendered separately as "sin dato"). */
export function quantileBreaks(values: number[], buckets = BUCKET_COUNT): number[] {
  const sorted = [...values].sort((a, b) => a - b);
  const breaks: number[] = [];
  for (let i = 1; i < buckets; i++) {
    const idx = Math.floor((sorted.length - 1) * (i / buckets));
    breaks.push(sorted[idx]);
  }
  return breaks;
}

/** Fixed swatches for the legend — same ramp `getFillColor` uses. */
export function legendSwatches(buckets = BUCKET_COUNT): string[] {
  return Array.from({ length: buckets }, (_, i) => lerpColor(i / (buckets - 1)));
}

export function getFillColor(value: number, breaks: number[]): string {
  let bucket = 0;
  for (const b of breaks) {
    if (value > b) bucket += 1;
  }
  const buckets = breaks.length + 1;
  return lerpColor(bucket / (buckets - 1));
}

export const NO_DATA_FILL = "#f5f5f7"; // --background-subtle
