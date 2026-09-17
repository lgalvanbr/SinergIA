"""Índice Departamental de Competitividad (IDC), puntaje general -> JSON.

The source file has ~140 sub-indicator columns (INS-*, INF-*, TIC-*, etc.);
v1 only ships the overall score. The sub-indicators stay available in the
source CSV for a future drill-down without re-processing.

Uses the **2018** rows, not 2019: the source file's `Puntaje_general` is on
the standard 0-100 IDC scale for 2018 but on an unexplained 0-10 scale for
2019 (verified: every department's 2019 value is its 2018 value divided by
~10, e.g. Bogotá 83.36 -> 8.30) — a data-quality quirk in the original 2019
export, not a bug in this script. Using 2018 avoids shipping numbers that
look wrong against the index's well-known 0-100 convention.
"""

import json

import pandas as pd

from departamentos import RAW_DATA_ROOT, normalize_codigo, warn_unmatched

SRC = RAW_DATA_ROOT / "00.ENTR" / "0038 - Mapa Col Innov" / "20191126_Base_de_datos_IDC_2019.csv"
OUT = "../../public/data/infraestructura-visible/idc.json"


def main():
    df = pd.read_csv(SRC, encoding="latin-1", na_values=["n/a", "N/A", ""])
    # A UTF-8 BOM read under latin-1 decodes to 3 separate mangled chars
    # (ï»¿) rather than a single ﻿ — strip all of them defensively.
    df.columns = [str(c).lstrip("﻿\xef\xbb\xbf") for c in df.columns]

    df = df[df["Ano"] == 2018].copy()
    df["codigo"] = df["Cod_Depto"].apply(normalize_codigo)
    warn_unmatched("IDC", set(df["codigo"]))

    rows = [
        {"codigo": r.codigo, "puntajeGeneral": r.Puntaje_general}
        for r in df.itertuples()
        if pd.notna(r.Puntaje_general)
    ]

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2, allow_nan=False)

    print(f"Wrote {OUT}: {len(rows)} departments (2018)")


if __name__ == "__main__":
    main()
