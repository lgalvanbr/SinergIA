"""Saber 11 (ICFES) department-level averages, aggregated from raw
student-level microdata -> JSON.

Deliberately uses the smaller "PUB" 2019-1 file (~15.5MB, 21k rows) — NEVER
the ~390MB "PUB Y PRIV" variant duplicated across several deliverable
folders, which is unnecessary for a department-average aggregation.
"""

import json

import pandas as pd

from departamentos import RAW_DATA_ROOT, normalize_codigo, warn_unmatched

SRC = (
    RAW_DATA_ROOT
    / "00.ENTR"
    / "0014 - SABER 11_DEPTO_LCrit"
    / "PUB"
    / "Saber_11__2019-1.csv"
)
OUT = "../../public/data/infraestructura-visible/saber11.json"

SCORE_COLS = [
    "PUNT_GLOBAL",
    "PUNT_LECTURA_CRITICA",
    "PUNT_MATEMATICAS",
    "PUNT_C_NATURALES",
    "PUNT_SOCIALES_CIUDADANAS",
    "PUNT_INGLES",
]


def main():
    df = pd.read_csv(
        SRC,
        encoding="latin-1",
        usecols=["COLE_COD_DEPTO_UBICACION"] + SCORE_COLS,
    )
    df["codigo"] = df["COLE_COD_DEPTO_UBICACION"].apply(normalize_codigo)
    warn_unmatched("Saber11", set(df["codigo"]))

    grouped = df.groupby("codigo").agg(
        estudiantes=("PUNT_GLOBAL", "size"),
        puntGlobal=("PUNT_GLOBAL", "mean"),
        puntLecturaCritica=("PUNT_LECTURA_CRITICA", "mean"),
        puntMatematicas=("PUNT_MATEMATICAS", "mean"),
        puntCNaturales=("PUNT_C_NATURALES", "mean"),
        puntSociales=("PUNT_SOCIALES_CIUDADANAS", "mean"),
        puntIngles=("PUNT_INGLES", "mean"),
    )
    grouped = grouped.round(1).reset_index()

    rows = grouped.to_dict(orient="records")

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2, allow_nan=False)

    print(f"Wrote {OUT}: {len(rows)} departments, {int(df.shape[0])} students total")


if __name__ == "__main__":
    main()
