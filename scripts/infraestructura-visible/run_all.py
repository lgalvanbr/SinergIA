"""Runs the full Infraestructura Visible data pipeline in order. Rerun this
whenever the source dataset changes — see README.md."""

import subprocess
import sys

STEPS = [
    "build_geojson.py",
    "build_departamentos.py",
    "build_ipm.py",
    "build_vias.py",
    "build_idc.py",
    "build_hacinamiento.py",
    "build_saber11.py",
    "build_centros_innovacion.py",
    "build_puntos.py",
    "build_explora_index.py",
    "build_biblioteca.py",  # depends on build_explora_index.py's output — must run after it
]

for step in STEPS:
    print(f"\n=== {step} ===")
    result = subprocess.run([sys.executable, step])
    if result.returncode != 0:
        print(f"FAILED at {step}, stopping.")
        sys.exit(1)

print("\nAll steps completed.")
