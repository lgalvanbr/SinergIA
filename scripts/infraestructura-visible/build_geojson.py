"""Copies Colombia.geo.json into public/data, stripping unused properties
(AREA/PERIMETER/HECTARES aren't used by the frontend) to cut file size."""

import json

from departamentos import GEOJSON_SRC, normalize_codigo

OUT = "../../public/data/infraestructura-visible/colombia-departamentos.geo.json"


def main():
    with open(GEOJSON_SRC, encoding="utf-8") as f:
        gj = json.load(f)

    features = []
    for feat in gj["features"]:
        props = feat["properties"]
        features.append(
            {
                "type": "Feature",
                "properties": {
                    "codigo": normalize_codigo(props["DPTO"]),
                    "nombre": props["NOMBRE_DPT"],
                },
                "geometry": feat["geometry"],
            }
        )

    out = {"type": "FeatureCollection", "features": features}
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"), allow_nan=False)

    print(f"Wrote {OUT}: {len(features)} features")


if __name__ == "__main__":
    main()
