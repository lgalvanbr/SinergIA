"""Índice de Pobreza Multidimensional (IPM) por departamento -> JSON."""

import json

import pandas as pd

from departamentos import RAW_DATA_ROOT, normalize_codigo, warn_unmatched

SRC = RAW_DATA_ROOT / "00.ENTR" / "0017 - Cob. Educ y Pobr" / "20191021_IPM_deptos.csv"
OUT = "../../public/data/infraestructura-visible/ipm.json"


def main():
    df = pd.read_csv(SRC, encoding="latin-1")
    # Rename positionally — the source header has a BOM on the first column
    # and an embedded newline inside the last one, both fragile to match by
    # literal name.
    df.columns = ["cod_depto", "depto", "total", "cabeceras", "rural_disperso"]

    df["codigo"] = df["cod_depto"].apply(normalize_codigo)
    warn_unmatched("IPM", set(df["codigo"]))

    def n(v):
        # pandas NaN (e.g. San Andrés has no "rural disperso" population
        # category at all) -> JSON null, not the bare `NaN` token Python's
        # json module writes by default, which isn't valid JSON and breaks
        # JSON.parse on the frontend.
        return None if pd.isna(v) else v

    rows = [
        {
            "codigo": r.codigo,
            "total": n(r.total),
            "cabeceras": n(r.cabeceras),
            "ruralDisperso": n(r.rural_disperso),
        }
        for r in df.itertuples()
    ]

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2, allow_nan=False)

    print(f"Wrote {OUT}: {len(rows)} departments")


if __name__ == "__main__":
    main()
