"""Entidades de I+D+i reconocidas por Colciencias, contadas por departamento
-> JSON. New dataset not used in the v1 build — genuine UTF-8 source file
(same quirk as Deptos_Region.csv: reading as latin-1 would double-encode)."""

import json

import pandas as pd

from departamentos import RAW_DATA_ROOT, normalize_codigo, warn_unmatched

SRC = RAW_DATA_ROOT / "00.ENTR" / "0039 - Mapa Centros Innov" / "20191127_Centros_Colciencias.csv"
OUT = "../../public/data/infraestructura-visible/centros-innovacion.json"


def main():
    df = pd.read_csv(SRC, encoding="utf-8-sig")
    df["codigo"] = df["Cod_Depto"].apply(normalize_codigo)
    warn_unmatched("CentrosInnovacion", set(df["codigo"]))

    counts = df.groupby("codigo").size()
    rows = [{"codigo": codigo, "total": int(total)} for codigo, total in counts.items()]
    rows.sort(key=lambda r: r["codigo"])

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2, allow_nan=False)

    print(f"Wrote {OUT}: {len(rows)} departments with at least one entity ({len(df)} entities total)")


if __name__ == "__main__":
    main()
