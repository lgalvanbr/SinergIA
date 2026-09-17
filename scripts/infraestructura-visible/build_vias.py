"""Densidad de red vial primaria+secundaria por departamento -> JSON."""

import json

import pandas as pd

from departamentos import RAW_DATA_ROOT, normalize_codigo, warn_unmatched

SRC = RAW_DATA_ROOT / "00.ENTR" / "0018 - Den. Vias y Pobr" / "Red_Prim_Y_Sec_Depto_Km.csv"
OUT = "../../public/data/infraestructura-visible/vias.json"


def main():
    df = pd.read_csv(SRC, encoding="latin-1")
    df.columns = ["cod_depto", "area_depto_km2", "red_secundaria_km", "red_primaria_km"]

    df["codigo"] = df["cod_depto"].apply(normalize_codigo)
    warn_unmatched("Vias", set(df["codigo"]))

    df["red_total_km"] = df["red_secundaria_km"] + df["red_primaria_km"]
    # km of primary+secondary road per 1,000 km^2 — the frontend never
    # divides raw numbers itself.
    df["densidad_km_1000km2"] = (df["red_total_km"] / df["area_depto_km2"]) * 1000

    rows = [
        {
            "codigo": r.codigo,
            "areaKm2": r.area_depto_km2,
            "redPrimariaKm": r.red_primaria_km,
            "redSecundariaKm": r.red_secundaria_km,
            "densidadKm1000km2": r.densidad_km_1000km2,
        }
        for r in df.itertuples()
    ]

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2, allow_nan=False)

    print(f"Wrote {OUT}: {len(rows)} departments")


if __name__ == "__main__":
    main()
