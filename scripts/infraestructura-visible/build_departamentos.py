"""Department display names (properly accented, e.g. "Bogotá" not
"SANTAFE DE BOGOTA D.C") + natural region -> JSON, for frontend display
(the GeoJSON's own NOMBRE_DPT is ALL-CAPS/unaccented, fine for joining but
not for showing to a user)."""

import json

import pandas as pd

from departamentos import RAW_DATA_ROOT, load_crosswalk, normalize_codigo, warn_unmatched

SRC = RAW_DATA_ROOT / "00.ENTR" / "0017 - Cob. Educ y Pobr" / "Deptos_Region.csv"
OUT = "../../public/data/infraestructura-visible/departamentos.json"

REGIONS = ["Andina", "Caribe", "Amazónica", "Pacífica", "Orinoquía"]

# Unlike most other source files in this dataset (latin-1/cp1252), this
# particular CSV is genuine UTF-8 with a BOM — reading it as latin-1
# produces double-encoded mojibake ("Bogotá" -> "BogotÃ¡"). Manual fixes for
# a couple of source data quirks that would otherwise show up verbatim on
# the site: an abbreviated name and inconsistent capitalization.
NAME_FIXES = {
    "Nte. Santander": "Norte de Santander",
    "Valle del cauca": "Valle del Cauca",
}


def clean_nombre(raw: str) -> str:
    name = " ".join(raw.split())  # collapses the embedded newline in "San Andrés\ne Islas"
    return NAME_FIXES.get(name, name)


def main():
    df = pd.read_csv(SRC, encoding="utf-8-sig")
    df["codigo"] = df["COD_DEPTO"].apply(normalize_codigo)
    warn_unmatched("Departamentos", set(df["codigo"]))

    def region_for(row):
        for r in REGIONS:
            if r in df.columns and bool(row[r]):
                return r
        return None

    by_codigo = {}
    for _, row in df.iterrows():
        by_codigo[row["codigo"]] = {"nombre": clean_nombre(row["DEPTO"]), "region": region_for(row)}

    rows = []
    for cw in load_crosswalk():
        codigo = cw["codigo"]
        info = by_codigo.get(codigo)
        rows.append(
            {
                "codigo": codigo,
                "nombre": info["nombre"] if info else cw["nombreGeojson"].title(),
                "region": info["region"] if info else None,
            }
        )

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2, allow_nan=False)

    print(f"Wrote {OUT}: {len(rows)} departments")


if __name__ == "__main__":
    main()
