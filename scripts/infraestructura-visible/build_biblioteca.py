"""Copies the recovered .docx report chapters into public/documentos and
writes a manifest JSON for the Biblioteca page (v1 = direct download, no
docx-to-web conversion — see project memory for that decision)."""

import json
import re
import shutil
from pathlib import Path

from departamentos import RAW_DATA_ROOT

ENTR_ROOT = RAW_DATA_ROOT / "00.ENTR"
DOCS_OUT = Path("../../public/documentos/infraestructura-visible")
MANIFEST_OUT = Path("../../public/data/infraestructura-visible/biblioteca.json")
EXPLORA_INDEX = Path("../../public/data/infraestructura-visible/explora-index.json")


def main():
    with open(EXPLORA_INDEX, encoding="utf-8") as f:
        titles_by_codigo = {row["codigo"]: row["titulo"] for row in json.load(f) if row["codigo"]}

    DOCS_OUT.mkdir(parents=True, exist_ok=True)

    entries = []
    for docx_path in sorted(ENTR_ROOT.rglob("*.docx")):
        # The deliverable folder (e.g. "0017 - Cob. Educ y Pobr") isn't
        # always the file's immediate parent — some docx live one level
        # deeper (e.g. ".../0014 - SABER 11_DEPTO_LCrit/PUB/03 0014.docx").
        # Walk up until a folder name starts with the 4-digit code.
        codigo = None
        codigo_folder_name = None
        for ancestor in docx_path.relative_to(ENTR_ROOT).parents:
            m = re.match(r"(\d{4})", ancestor.name)
            if m:
                codigo = str(int(m.group(1)))  # "0017" -> "17"
                codigo_folder_name = ancestor.name
                break
        if codigo is None:
            print(f"  [SKIP] {docx_path}: no ancestor folder has a leading code")
            continue

        titulo = titles_by_codigo.get(codigo, codigo_folder_name.split("-", 1)[-1].strip())
        out_name = f"{codigo.zfill(2)}-{re.sub(r'[^a-zA-Z0-9]+', '-', titulo.lower()).strip('-')[:60]}.docx"
        shutil.copyfile(docx_path, DOCS_OUT / out_name)

        entries.append(
            {
                "codigo": codigo,
                "titulo": titulo,
                "archivo": out_name,
                "tamanoKB": round(docx_path.stat().st_size / 1024),
            }
        )

    entries.sort(key=lambda e: int(e["codigo"]))
    with open(MANIFEST_OUT, "w", encoding="utf-8") as f:
        json.dump(entries, f, ensure_ascii=False, indent=2, allow_nan=False)

    print(f"Copied {len(entries)} documents to {DOCS_OUT}, manifest at {MANIFEST_OUT}")


if __name__ == "__main__":
    main()
