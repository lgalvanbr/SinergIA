# Infraestructura Visible — data pipeline

Turns the raw recovered dataset at `C:\Users\LuisPc\ColombiaDataAnalytics` (outside this repo,
~1.6GB, never committed) into the small JSON/GeoJSON files the Next.js app actually reads from
`public/data/infraestructura-visible/`.

This is a **manual, rerun-when-needed step**, not part of `next build` — the source data doesn't
change on its own. Run it again only if:
- The source CSVs at `ColombiaDataAnalytics` are replaced/updated (e.g. newer Saber 11, IDC, or
  IPM releases), or
- A new `build_*.py` is added for another dataset.

## Requirements

Python 3 + `pandas` + `openpyxl` (both already available in this environment — no install needed
here; if running elsewhere, `pip install pandas openpyxl`).

## Usage

```
cd scripts/infraestructura-visible
python run_all.py
```

Or run any single `build_*.py` directly to regenerate just one output file.

## How it fits together

- `departamentos.py` is the single source of truth for the department code/name crosswalk (built
  from the GeoJSON's own 33 features) — every `build_*.py` imports `normalize_codigo()` from it
  and joins on the 2-digit zero-padded DANE code, never on department name text (source files use
  inconsistent accented/unaccented, padded/unpadded names).
- Source CSVs are **latin-1/cp1252 encoded with a UTF-8-BOM-mangled first column** in several
  files — always read with `encoding="latin-1"` and strip `"\ufeff\xef\xbb\xbf"` from column names,
  or accented characters (Bogotá, Chocó...) get corrupted.
- Each script prints a `[WARN]` line for any department code that doesn't match the crosswalk in
  either direction — never silently drops a mismatch.
- `build_saber11.py` aggregates from the ~15.5MB `Saber_11__2019-1.csv` (public-school subset,
  21k students) — deliberately NOT the ~390MB "PUB Y PRIV" file duplicated across several
  `00.ENTR/00XX/` folders, which is unnecessary for a department-average.

## Known gaps (not built — no recoverable source data)

- Power generation by department (`00.ENTR/0021`) — only exists as a chart PNG; the folder's own
  Python script is even mismatched (reads Saber 11 data by mistake).
- Toll booth count by department (`00.ENTR/0020`) — folder only contains a PNG, no data file at
  all.

Both would need fresh external sourcing (UPME/XM for energy, ANI/INVÍAS for tolls) to add later.
