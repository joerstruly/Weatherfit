"""Prove the ladder + gates on three fixtures.

The point of this test is not that extraction works. It is that a WRONG
extraction is REJECTED. Tier order is only meaningful if the gates are honest.
"""
import json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
import pymupdf
from pipeline.extract.ladder import (extract_ruled, extract_stream,
                                     extract_template, has_text_layer)
from pipeline.extract import gates

HERE = pathlib.Path(__file__).parent
TMPL = json.loads((HERE.parent / "templates" / "dot_bid_item_v1.json").read_text())
G = TMPL["gates"]
GOOD_TOTAL, BAD_TOTAL = 8064073.00, 8064873.00


def evaluate(ex, stated_total):
    """Gates are applied identically to every tier. No tier gets a discount."""
    return gates.check(
        ex, min_rows=3, stated_total=stated_total,
        expect_columns=G["expect_columns"], numeric_columns=G["numeric_columns"],
        qty_col=G["qty_col"], price_col=G["price_col"],
        amount_col=G["amount_col"], unit_col=G["unit_col"])


def run(pdf, label, stated_total, expect_any_pass=True):
    doc = pymupdf.open(pdf); page = doc[0]
    print(f"\n=== {label} ===")
    print(f"    {pdf.name}   text layer: {has_text_layer(page)}")
    tiers = [("1 ruled", e) for e in extract_ruled(page)]
    tiers.append(("2 template", extract_template(page, TMPL)))
    tiers.append(("3 stream", extract_stream(page)))

    accepted = None
    for name, ex in tiers:
        r = evaluate(ex, stated_total)
        cols = len(ex.rows[0]) if ex.rows else 0
        print(f"    tier {name:12} rows={len(ex.rows):2} cols={cols}  "
              f"{'PASS' if r.passed else 'FAIL'}"
              f"{'' if r.passed else '  ' + ', '.join(r.failures())}")
        if r.passed and accepted is None:
            accepted = (name, ex, r)

    if accepted:
        name, ex, r = accepted
        rec = next((c for c in r.checks if c["check"] == "reconciles_to_stated_total"), None)
        print(f"    ACCEPTED at tier {name}")
        if rec:
            print(f"      reconciled {rec['extracted']:,.2f} == stated "
                  f"{rec['stated']:,.2f} (tol {rec['tolerance']})")
    else:
        print("    NO TIER ACCEPTED -> route to template synthesis / human queue")

    ok = (accepted is not None) == expect_any_pass
    print(f"    EXPECTATION {'met' if ok else 'VIOLATED'}")
    doc.close()
    return ok


results = [
    run(HERE / "fixtures/dot_ruled.pdf", "RULED - lines present", GOOD_TOTAL, True),
    run(HERE / "fixtures/dot_stream.pdf", "STREAM - no ruling lines", GOOD_TOTAL, True),
    run(HERE / "fixtures/dot_bad_total.pdf",
        "NEGATIVE - printed total is $800 wrong", BAD_TOTAL, False),
]
print("\n" + ("ALL EXPECTATIONS MET" if all(results) else "SOME EXPECTATIONS VIOLATED"))
sys.exit(0 if all(results) else 1)
