"""Deterministic PDF table extraction, tried in order of reliability.

The ladder stops at the first tier whose output passes the validation gates in
`gates.py`. An LLM is never consulted for a cell value; it is only ever asked to
*write a template* that a later deterministic run must then satisfy.

Tiers
  0  sidecar      a machine-readable version of the same document exists
  1  ruled        the table has ruling lines; recover cells from the graph
  2  template     a pinned, version-controlled column geometry for this layout
  3  stream       cluster words by x-position to infer columns
  4  ocr          no text layer; add one, then re-enter at tier 1
  5  llm          last resort, and only to synthesise a tier-2 template
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any

import pymupdf

NUM = re.compile(r"^\(?-?\$?\s*[\d,]+(?:\.\d+)?\)?$")


def to_number(s: str) -> float | None:
    """Parse a cell the way government reports write numbers, or return None."""
    if s is None:
        return None
    t = s.strip().replace("$", "").replace(",", "").replace(" ", "")
    if not t:
        return None
    neg = t.startswith("(") and t.endswith(")")
    t = t.strip("()")
    try:
        v = float(t)
    except ValueError:
        return None
    return -v if neg else v


@dataclass
class Extraction:
    tier: str
    rows: list[list[str]]
    header: list[str] | None = None
    page: int = 0
    diagnostics: dict[str, Any] = field(default_factory=dict)


# ---------------------------------------------------------------- tier 1 ----
def extract_ruled(page: pymupdf.Page) -> list[Extraction]:
    """Recover cells from ruling lines. Near-deterministic when rules exist."""
    out = []
    finder = page.find_tables(strategy="lines")
    for i, tbl in enumerate(finder.tables):
        data = [[(c or "").strip() for c in row] for row in tbl.extract()]
        if len(data) < 2:
            continue
        out.append(
            Extraction(
                tier="ruled",
                header=data[0],
                rows=data[1:],
                page=page.number,
                diagnostics={"table_index": i, "bbox": list(tbl.bbox)},
            )
        )
    return out


# ---------------------------------------------------------------- tier 2 ----
def extract_template(page: pymupdf.Page, tmpl: dict) -> Extraction:
    """Slice words into columns using pinned x-boundaries.

    `tmpl` is a small JSON object under version control:
        {"columns": [{"name": "...", "x0": 40, "x1": 130}, ...],
         "header_row_contains": "ITEM CODE",
         "stop_row_contains": "TOTAL",
         "y_tolerance": 3}
    This is the tier an LLM writes and a human reviews. It is deterministic to
    run and diffs cleanly in git.
    """
    cols = tmpl["columns"]
    ytol = tmpl.get("y_tolerance", 3)
    words = page.get_text("words")  # (x0, y0, x1, y1, word, block, line, word_no)

    lines: dict[int, list[tuple]] = {}
    for w in words:
        key = round(w[1] / ytol)
        lines.setdefault(key, []).append(w)

    rows = []
    for key in sorted(lines):
        ws = sorted(lines[key], key=lambda w: w[0])
        cells = [""] * len(cols)
        for w in ws:
            cx = (w[0] + w[2]) / 2
            for ci, c in enumerate(cols):
                if c["x0"] <= cx < c["x1"]:
                    cells[ci] = (cells[ci] + " " + w[4]).strip()
                    break
        if any(cells):
            rows.append(cells)

    header_marker = tmpl.get("header_row_contains")
    stop_marker = tmpl.get("stop_row_contains")
    start = 0
    if header_marker:
        for i, r in enumerate(rows):
            if header_marker.lower() in " ".join(r).lower():
                start = i + 1
                break
    body, trailer = [], []
    for r in rows[start:]:
        if stop_marker and stop_marker.lower() in " ".join(r).lower():
            trailer.append(r)
            continue
        body.append(r)

    return Extraction(
        tier="template",
        header=[c["name"] for c in cols],
        rows=body,
        page=page.number,
        diagnostics={"trailer_rows": trailer, "template_id": tmpl.get("id")},
    )


# ---------------------------------------------------------------- tier 3 ----
def extract_stream(page: pymupdf.Page, min_gap: float = 12.0) -> Extraction:
    """Infer columns from vertical whitespace corridors. No template needed,
    but layout-sensitive — always gate the result before trusting it."""
    words = page.get_text("words")
    if not words:
        return Extraction(tier="stream", rows=[], page=page.number)

    xs = sorted((w[0], w[2]) for w in words)
    occupied: list[list[float]] = []
    for x0, x1 in xs:
        if occupied and x0 <= occupied[-1][1]:
            occupied[-1][1] = max(occupied[-1][1], x1)
        else:
            occupied.append([x0, x1])

    bounds = [occupied[0][0] - 1]
    for a, b in zip(occupied, occupied[1:]):
        if b[0] - a[1] >= min_gap:
            bounds.append((a[1] + b[0]) / 2)
    bounds.append(occupied[-1][1] + 1)

    cols = [
        {"name": f"c{i}", "x0": bounds[i], "x1": bounds[i + 1]}
        for i in range(len(bounds) - 1)
    ]
    ex = extract_template(page, {"columns": cols, "y_tolerance": 3})
    ex.tier = "stream"
    ex.diagnostics["inferred_bounds"] = bounds
    return ex


def has_text_layer(page: pymupdf.Page) -> bool:
    return bool(page.get_text("text").strip())
