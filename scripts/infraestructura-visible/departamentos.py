"""Normalized department code/name crosswalk — the single source of truth
every build_*.py script joins against.

Built directly from the Colombia GeoJSON's own DPTO/NOMBRE_DPT properties
(the join *target*), rather than typed out by hand, so it can never drift
from the geometry the frontend actually renders.
"""

import json
import re
import unicodedata
from pathlib import Path

# The raw recovered dataset lives outside this repo on purpose (see this
# folder's README.md) — never copy it into SinergIA/public wholesale.
RAW_DATA_ROOT = Path(r"C:\Users\LuisPc\ColombiaDataAnalytics")
GEOJSON_SRC = RAW_DATA_ROOT / "00.ENTR" / "0019 - Saber_11_Mapa" / "Colombia.geo.json"


def normalize_codigo(raw_code) -> str:
    """Normalize any department-code column (int, float, or numeric string)
    to the 2-digit zero-padded string used everywhere in this pipeline and
    in the GeoJSON's own `DPTO` property."""
    return str(int(float(raw_code))).zfill(2)


def load_crosswalk() -> list[dict]:
    """Returns [{codigo, nombreGeojson}, ...] for all 33 departments."""
    with open(GEOJSON_SRC, encoding="utf-8") as f:
        gj = json.load(f)
    rows = []
    for feat in gj["features"]:
        props = feat["properties"]
        rows.append(
            {
                "codigo": normalize_codigo(props["DPTO"]),
                "nombreGeojson": props["NOMBRE_DPT"],
            }
        )
    rows.sort(key=lambda r: r["codigo"])
    return rows


def codigo_set() -> set[str]:
    return {r["codigo"] for r in load_crosswalk()}


def normalize_nombre(s: str) -> str:
    """Uppercase, accent-stripped, punctuation-stripped department name —
    the point-of-interest shapefiles each spell department names
    differently (accents present/absent, commas instead of periods,
    inconsistent casing), so exact-string matching against any one of them
    fails constantly. This is the common ground every source can be
    reduced to before comparing."""
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")
    s = s.upper()
    s = re.sub(r"[^A-Z ]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def codigo_by_nombre() -> dict:
    """Maps a `normalize_nombre()`-normalized department name -> codigo,
    built from the crosswalk's own (already ALL-CAPS/unaccented) names."""
    return {normalize_nombre(r["nombreGeojson"]): r["codigo"] for r in load_crosswalk()}


# A few sources have outright misspellings that no accent/punctuation
# normalization fixes (e.g. Universidades.shp has "Santader" for
# "Santander") — corrected by hand since they're one-off typos, not a
# pattern worth generalizing into fuzzy matching.
_TYPO_FIXES = {
    "SANTADER": "SANTANDER",
}


def codigo_from_nombre(raw_nombre: str, lookup: dict) -> str | None:
    """Resolves a department name from any of these messy source files to
    its 2-digit codigo. Bogotá and San Andrés get their own exact strings
    in almost every source (e.g. "Bogotá, D.C.", "Bogotá D,C,", vs. the
    geojson's actual "SANTAFE DE BOGOTA D.C" — no normalization makes those
    equal), so they're matched by substring before falling back to exact
    match on the rest."""
    norm = normalize_nombre(raw_nombre)
    if "BOGOTA" in norm:
        return "11"
    if "SAN ANDRES" in norm:
        return "88"
    norm = _TYPO_FIXES.get(norm, norm)
    if norm in lookup:
        return lookup[norm]
    # Some sources drop the leading "LA "/"EL " article ("Guajira" instead
    # of "La Guajira") — retry as a substring match against the crosswalk's
    # own names before giving up.
    matches = [codigo for name, codigo in lookup.items() if norm in name or name in norm]
    return matches[0] if len(matches) == 1 else None


def warn_unmatched(source_name: str, codes_in_source: set[str]) -> None:
    """Log (never silently drop) any code present in a source file but
    absent from the 33-department crosswalk, and vice versa."""
    valid = codigo_set()
    unmatched = codes_in_source - valid
    if unmatched:
        print(f"  [WARN] {source_name}: {len(unmatched)} code(s) not in crosswalk: {sorted(unmatched)}")
    missing = valid - codes_in_source
    if missing:
        print(f"  [WARN] {source_name}: {len(missing)} crosswalk department(s) have no data: {sorted(missing)}")


if __name__ == "__main__":
    cw = load_crosswalk()
    print(f"Crosswalk: {len(cw)} departments")
    for r in cw:
        print(f"  {r['codigo']}  {r['nombreGeojson']}")
