"""Hacinamiento carcelario por departamento (agosto 2019) -> JSON."""

import json

import pandas as pd

from departamentos import RAW_DATA_ROOT, normalize_codigo, warn_unmatched

SRC = RAW_DATA_ROOT / "00.ENTR" / "0013 -  Hacnmt_Car_Nac" / "2019_10_11_Hacin_Depto.csv"
OUT = "../../public/data/infraestructura-visible/hacinamiento.json"


def main():
    df = pd.read_csv(SRC, encoding="latin-1")
    df.columns = [str(c).lstrip("﻿\xef\xbb\xbf") for c in df.columns]

    df["codigo"] = df["COD_DEPTO"].apply(normalize_codigo)
    warn_unmatched("Hacinamiento", set(df["codigo"]))

    rows = [
        {
            "codigo": r.codigo,
            "capacidad": r.Capacidad,
            "poblacion": r.Poblacion,
            "hacinamiento": r.Hacinamiento,
            # already a ratio (e.g. 0.72 = 72% overcapacity) in the source
            "porcentajeHacinamiento": r._6,
        }
        for r in df.itertuples()
    ]

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2, allow_nan=False)

    print(f"Wrote {OUT}: {len(rows)} departments")


if __name__ == "__main__":
    main()
