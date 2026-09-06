"""Seed cost.source from sources.csv — the catalog IS the ingestion manifest.

    python3 seed_sources.py ../../research/construction-cost-data-sources/sources.csv

Re-runnable: upserts on id, and never clobbers pipeline control columns that an
operator may have changed by hand (watch_enabled, schedule_bucket).
"""
from __future__ import annotations

import csv
import os
import re
import sys

import psycopg  # psycopg[binary] >= 3.1

# Licences that bar redistribution. These sources are still WATCHED for change,
# but their bytes are never retained. Enforced again in the fetch workflow.
NO_STORE = re.compile(
    r"subscription|proprietary|commercial|marshall|licen[cs]ed|members?\b|paid|gated",
    re.I,
)

BUCKETS = [
    ("continuous", r"continuous|real-?time|daily|per letting|per opening|weekly"),
    ("monthly",    r"monthly"),
    ("quarterly",  r"quarterly"),
    ("annual",     r"annual|biennial|periodic|irregular|on revision"),
    ("static",     r"static|one-?off|discontinued|n/a"),
]


def bucket(cadence: str) -> str | None:
    c = (cadence or "").lower()
    for name, pat in BUCKETS:
        if re.search(pat, c):
            return name
    return "annual" if c.strip() else None


UPSERT = """
insert into cost.source (
  id, tier, category, subcategory, source_name, publisher, url, covers,
  unit_type, geo_granularity, cadence, lag, format, access_method,
  all_bidders_or_awarded, history_depth, license, verification,
  verification_note, notes, may_store, schedule_bucket
) values (
  %(id)s, %(tier)s, %(category)s, %(subcategory)s, %(source)s, %(publisher)s,
  %(url)s, %(covers)s, %(unit_type)s, %(geo_granularity)s, %(cadence)s, %(lag)s,
  %(format)s, %(access_method)s, %(all_bidders_or_awarded)s, %(history_depth)s,
  %(license)s, %(verification)s, %(verification_note)s, %(notes)s,
  %(may_store)s, %(schedule_bucket)s
)
on conflict (id) do update set
  tier = excluded.tier, category = excluded.category,
  subcategory = excluded.subcategory, source_name = excluded.source_name,
  publisher = excluded.publisher, url = excluded.url, covers = excluded.covers,
  unit_type = excluded.unit_type, geo_granularity = excluded.geo_granularity,
  cadence = excluded.cadence, lag = excluded.lag, format = excluded.format,
  access_method = excluded.access_method,
  all_bidders_or_awarded = excluded.all_bidders_or_awarded,
  history_depth = excluded.history_depth, license = excluded.license,
  verification = excluded.verification,
  verification_note = excluded.verification_note, notes = excluded.notes,
  may_store = excluded.may_store,
  updated_at = now()
-- watch_enabled and schedule_bucket are intentionally NOT overwritten: an
-- operator may have tuned them, and the CSV should not silently revert that.
"""


def main(path: str) -> int:
    dsn = os.environ["SUPABASE_DB_URL"]  # session-mode/direct connection
    rows = list(csv.DictReader(open(path, newline="")))
    n_store, n_skip = 0, 0
    with psycopg.connect(dsn) as conn, conn.cursor() as cur:
        for r in rows:
            tier = r.get("tier", "").strip()
            may_store = not NO_STORE.search(r.get("license", "") or "")
            n_store += may_store
            n_skip += not may_store
            cur.execute(UPSERT, {
                **{k: (v.strip() or None) for k, v in r.items()},
                "tier": int(tier) if tier.isdigit() else None,
                "may_store": may_store,
                "schedule_bucket": bucket(r.get("cadence", "")),
            })
        conn.commit()
    print(f"upserted {len(rows)} sources — {n_store} storable, "
          f"{n_skip} watch-only (licence gate)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "sources.csv"))
