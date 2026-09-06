"""Validation gates. Every extraction must clear these before it reaches the
warehouse, whatever tier produced it — including an LLM tier.

The reconciliation gate is the important one and it is specific to this domain:
bid tabs, cost certifications and HUD-92331-B schedules all carry a stated
total. That total is a free checksum on the whole extraction.
"""
from __future__ import annotations

from dataclasses import dataclass, field

from .ladder import Extraction, to_number


@dataclass
class GateResult:
    passed: bool
    checks: list[dict] = field(default_factory=list)

    def add(self, name: str, ok: bool, **detail):
        self.checks.append({"check": name, "ok": ok, **detail})
        if not ok:
            self.passed = False

    def failures(self) -> list[str]:
        return [c["check"] for c in self.checks if not c["ok"]]


# Range gates per unit. Anything outside is a parse error until proven otherwise.
UNIT_RANGES = {
    "LB": (0.20, 25.00),
    "CY": (60.0, 900.0),
    "TON": (20.0, 4000.0),
    "LF": (2.0, 5000.0),
    "SF": (1.0, 2000.0),
    "EA": (10.0, 500000.0),
}


def check(
    ex: Extraction,
    *,
    expect_columns: int | None = None,
    numeric_columns: list[int] | None = None,
    qty_col: int | None = None,
    price_col: int | None = None,
    amount_col: int | None = None,
    unit_col: int | None = None,
    stated_total: float | None = None,
    min_rows: int = 1,
) -> GateResult:
    g = GateResult(passed=True)

    g.add("rows_present", len(ex.rows) >= min_rows, rows=len(ex.rows))

    if expect_columns is not None:
        widths = {len(r) for r in ex.rows}
        shape_ok = widths == {expect_columns}
        g.add("column_count", shape_ok, expected=expect_columns,
              seen=sorted(widths))
        if not shape_ok:
            # Column-indexed checks below would read the wrong fields. Fail the
            # whole extraction rather than run them against a misaligned table.
            g.add("shape_precondition", False,
                  note="column-indexed gates not run; shape mismatch")
            return g

    if numeric_columns:
        for ci in numeric_columns:
            vals = [to_number(r[ci]) if ci < len(r) else None for r in ex.rows]
            parsed = sum(v is not None for v in vals)
            rate = parsed / len(vals) if vals else 0.0
            g.add(f"numeric_parse_col{ci}", rate >= 0.98,
                  parse_rate=round(rate, 4), n=len(vals))

    # quantity x unit price == amount, row by row. Catches column misalignment
    # that every other check would sail past.
    if None not in (qty_col, price_col, amount_col):
        bad = []
        for i, r in enumerate(ex.rows):
            q, p, a = (to_number(r[qty_col]), to_number(r[price_col]),
                       to_number(r[amount_col]))
            if None in (q, p, a):
                continue
            if abs(q * p - a) > max(0.02, abs(a) * 0.001):
                bad.append({"row": i, "q": q, "p": p, "amount": a, "q*p": q * p})
        g.add("row_arithmetic", not bad, bad_rows=bad[:5], n_bad=len(bad))

    # extracted amounts sum to the total printed on the document
    if stated_total is not None and amount_col is not None:
        got = sum(v for v in (to_number(r[amount_col]) for r in ex.rows)
                  if v is not None)
        # Absolute, cents-scale. A proportional tolerance on a multi-million
        # total is large enough to hide a whole missing line item.
        tol = 0.01 * max(1, len(ex.rows))
        ok = abs(got - stated_total) <= tol
        g.add("reconciles_to_stated_total", ok,
              extracted=round(got, 2), stated=stated_total,
              delta=round(got - stated_total, 2), tolerance=tol)

    if unit_col is not None and price_col is not None:
        out = []
        for i, r in enumerate(ex.rows):
            unit = (r[unit_col] or "").strip().upper()
            p = to_number(r[price_col])
            lo_hi = UNIT_RANGES.get(unit)
            if p is None or not lo_hi:
                continue
            lo, hi = lo_hi
            if not (lo <= p <= hi):
                out.append({"row": i, "unit": unit, "price": p, "range": [lo, hi]})
        g.add("unit_price_in_range", not out, outliers=out[:5], n=len(out))

    return g
