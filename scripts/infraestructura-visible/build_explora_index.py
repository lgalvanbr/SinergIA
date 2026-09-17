"""Master deliverables index (0000_Directorio_Entregables.xlsx) -> JSON for
the Explora table. Cross-links to live Visualiza/Especiales pages are kept
as a small hand-maintained map in the frontend, not baked in here, so this
script stays a pure/re-runnable transform of the source spreadsheet."""

import json

import openpyxl

from departamentos import RAW_DATA_ROOT

SRC = RAW_DATA_ROOT / "00.ENTR" / "0000_Directorio_Entregables.xlsx"
OUT = "../../public/data/infraestructura-visible/explora-index.json"


def clean(v):
    if v is None:
        return None
    s = str(v).strip().lstrip("﻿")
    return s if s else None


def main():
    wb = openpyxl.load_workbook(SRC, data_only=True)
    ws = wb["Directorio"]

    rows = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        codigo, titulo, alcance = row[0], row[1], row[2]
        titulo = clean(titulo)
        if not titulo:
            continue  # skip blank template rows

        temas = [clean(v) for v in row[3:8] if clean(v)]
        variables = [clean(v) for v in row[8:15] if clean(v)]
        fuentes = [clean(v) for v in row[16:24] if clean(v)]

        rows.append(
            {
                "codigo": str(codigo).strip() if codigo is not None else None,
                "titulo": titulo,
                "alcance": clean(alcance),
                "temas": temas,
                "variables": variables,
                "fuentes": fuentes,
            }
        )

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2, allow_nan=False)

    print(f"Wrote {OUT}: {len(rows)} deliverables")


if __name__ == "__main__":
    main()
