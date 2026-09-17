"""Point-of-interest datasets (hospitals, schools, libraries, universities,
prisons) with real coordinates -> lightweight JSON for the Leaflet point map.

Source: a separate OneDrive export ("PW-Indicadores socio economicos"),
extracted to a sibling folder next to the original recovered zip's contents.
These are genuine ESRI shapefiles (.shp/.dbf/.shx/.prj), read with geopandas.

Data-quality quirk found and handled here: several of these shapefiles mix
valid Colombia coordinates with a small number of rows carrying ESRI's
"null numeric" sentinel (~-1.7976931348623157e+308, i.e. -sys.float_info.max)
where geocoding originally failed — NOT what you'd expect from a "few missing
rows" (no NaN/None), so a naive dropna() would miss them entirely. Every
category below is filtered to a real Colombia bounding box
(lon -82..-66, lat -5..14) as the final safety net, regardless of the
source CRS quirks per file.

Each point also carries its department codigo (added so the frontend can
cluster strictly WITHIN a department rather than merging nearby points
across a department border — see PuntosLeafletMap.tsx). Every file spells
department names differently (or, for colegios, uses a numeric code
already) — resolved via departamentos.codigo_from_nombre()/normalize_codigo().
"""

import glob
import json
import os

import geopandas as gpd

from departamentos import codigo_by_nombre, codigo_from_nombre, normalize_codigo

PW_ROOT = r"C:\Users\LuisPc\ColombiaDataAnalytics\PW-Indicadores-socioeconomicos"
OUT_DIR = "../../public/data/infraestructura-visible/puntos"

LON_MIN, LON_MAX = -82.0, -66.0
LAT_MIN, LAT_MAX = -5.0, 14.0

MERC_X_MIN, MERC_X_MAX = -9_130_000, -7_340_000
MERC_Y_MIN, MERC_Y_MAX = -560_000, 1_580_000

NOMBRE_LOOKUP = codigo_by_nombre()


def find_shp(basename: str) -> str:
    matches = glob.glob(f"{PW_ROOT}/**/{basename}", recursive=True)
    if not matches:
        raise FileNotFoundError(basename)
    return matches[0]


def clip_degrees(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    x, y = gdf.geometry.x, gdf.geometry.y
    return gdf[(x >= LON_MIN) & (x <= LON_MAX) & (y >= LAT_MIN) & (y <= LAT_MAX)]


def write_category(
    slug: str,
    label: str,
    gdf: gpd.GeoDataFrame,
    nombre_col: str,
    municipio_col: str,
    depto_col: str,
    depto_is_code: bool,
):
    """Ships compact [lon, lat, nombre, municipio, deptoCodigo] arrays (not
    verbose per-point objects — repeating 5 JSON keys across tens of
    thousands of points adds real size for nothing)."""
    points = []
    unresolved = 0
    for _, row in gdf.iterrows():
        nombre = str(row.get(nombre_col) or "").strip() or None
        municipio = str(row.get(municipio_col) or "").strip() or None
        raw_depto = row.get(depto_col)
        if depto_is_code and raw_depto is not None:
            depto_codigo = normalize_codigo(raw_depto)
        elif raw_depto:
            depto_codigo = codigo_from_nombre(str(raw_depto), NOMBRE_LOOKUP)
        else:
            depto_codigo = None
        if depto_codigo is None:
            unresolved += 1
        points.append([round(row.geometry.x, 4), round(row.geometry.y, 4), nombre, municipio, depto_codigo])

    os.makedirs(OUT_DIR, exist_ok=True)
    out_path = f"{OUT_DIR}/{slug}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(points, f, ensure_ascii=False, separators=(",", ":"), allow_nan=False)
    print(f"  {label}: {len(points)} puntos validos -> {out_path}")
    if unresolved:
        print(f"  [WARN] {label}: {unresolved} punto(s) sin departamento resuelto")
    return len(points)


def main():
    manifest = []

    gdf = gpd.read_file(find_shp("Centros_de_Reclusion.shp"))
    gdf = clip_degrees(gdf)
    n = write_category("reclusion", "Centros de reclusión", gdf, "Nombre", "CIUDAD", "DEPARTAMEN", False)
    manifest.append({"slug": "reclusion", "label": "Centros de reclusión", "count": n})

    gdf = gpd.read_file(find_shp("Entidades_Publicas.shp"))
    gdf = clip_degrees(gdf)
    # No clean facility-name column exists in this source shapefile (its
    # "nombre" column is actually a numeric DANE code) — use the street
    # address as the identifying label instead, since it at least
    # differentiates entries within the same municipality.
    n = write_category(
        "hospitales-publicos", "Hospitales públicos", gdf, "direccion", "muniNombre", "depaNombre", False
    )
    manifest.append({"slug": "hospitales-publicos", "label": "Hospitales públicos", "count": n})

    # Hospitales privados — EPSG:3857 (meters), needs reprojecting.
    # Pre-filter in Web Mercator space before reprojecting, since the
    # sentinel value can misbehave under pyproj.
    gdf = gpd.read_file(find_shp("Privadas.shp"))
    x, y = gdf.geometry.x, gdf.geometry.y
    gdf = gdf[(x >= MERC_X_MIN) & (x <= MERC_X_MAX) & (y >= MERC_Y_MIN) & (y <= MERC_Y_MAX)]
    gdf = gdf.set_crs("EPSG:3857", allow_override=True).to_crs("EPSG:4326")
    gdf = clip_degrees(gdf)  # safety net post-reprojection
    n = write_category(
        "hospitales-privados", "Hospitales privados", gdf, "mbre", "munimbre", "Departamen", False
    )
    manifest.append({"slug": "hospitales-privados", "label": "Hospitales privados", "count": n})

    gdf = gpd.read_file(find_shp("Colegios_WGS.shp"))
    gdf = clip_degrees(gdf)
    n = write_category("colegios", "Colegios", gdf, "nombre", "municipio", "cdigodepar", True)
    manifest.append({"slug": "colegios", "label": "Colegios", "count": n})

    gdf = gpd.read_file(find_shp("Bibliotecas_Publicas.shp"))
    gdf = clip_degrees(gdf)
    n = write_category(
        "bibliotecas", "Bibliotecas públicas", gdf, "MBRE_DE_LA", "MUNICIPIO", "DEPARTAMEN", False
    )
    manifest.append({"slug": "bibliotecas", "label": "Bibliotecas públicas", "count": n})

    gdf = gpd.read_file(find_shp("Universidades.shp"))
    gdf = clip_degrees(gdf)
    n = write_category("universidades", "Universidades", gdf, "Nombre_Ins", "Municipio", "Departamen", False)
    manifest.append({"slug": "universidades", "label": "Universidades", "count": n})

    with open(f"{OUT_DIR}/manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print("\nTotal puntos:", sum(m["count"] for m in manifest))


if __name__ == "__main__":
    main()
