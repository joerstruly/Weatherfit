"""Artifact upload + bulk observation load.

Two rules this module exists to enforce:

  1. Upload the bytes to Storage BEFORE inserting the artifact row. An orphaned
     object is harmless and reconcilable; a database row pointing at nothing is
     a corrupted provenance chain.
  2. Bulk-load observations with COPY over a direct connection, never row-by-row
     through PostgREST. At bid-tab volume the difference is hours versus seconds.
"""
from __future__ import annotations

import hashlib
import io
import mimetypes
import os
from dataclasses import dataclass

import boto3          # Supabase Storage speaks S3; use it for multipart
import psycopg

BUCKET = os.environ.get("ARTIFACT_BUCKET", "artifacts")


def s3():
    """Supabase Storage S3-compatible endpoint.

    Use this rather than the supabase-py client for ingestion: it gives real
    multipart upload, which matters because plenty of documents in this catalog
    are large (UFC 3-701-01 and the NAVFAC fee guide both exceed 10 MB, and
    scanned assessor manuals go well beyond that).
    """
    return boto3.client(
        "s3",
        endpoint_url=os.environ["SUPABASE_S3_ENDPOINT"],   # https://<ref>.storage.supabase.co/storage/v1/s3
        aws_access_key_id=os.environ["SUPABASE_S3_ACCESS_KEY"],
        aws_secret_access_key=os.environ["SUPABASE_S3_SECRET_KEY"],
        region_name=os.environ.get("SUPABASE_S3_REGION", "us-east-1"),
    )


@dataclass
class Stored:
    sha256: str
    path: str
    bytes: int
    content_type: str
    already_present: bool


def store_artifact(body: bytes, source_id: str, url: str,
                   content_type: str | None = None) -> Stored:
    sha = hashlib.sha256(body).hexdigest()
    ext = os.path.splitext(url.split("?")[0])[1][:10] or (
        mimetypes.guess_extension(content_type or "") or ""
    )
    path = f"raw/{source_id}/{sha}{ext}"
    ct = content_type or mimetypes.guess_type(url)[0] or "application/octet-stream"

    client = s3()
    try:
        client.head_object(Bucket=BUCKET, Key=path)
        return Stored(sha, path, len(body), ct, already_present=True)
    except client.exceptions.ClientError:
        pass

    # upload_fileobj handles multipart automatically above the threshold
    client.upload_fileobj(io.BytesIO(body), BUCKET, path,
                          ExtraArgs={"ContentType": ct})
    return Stored(sha, path, len(body), ct, already_present=False)


def record_artifact(conn, st: Stored, source_id: str, url: str,
                    http_status: int | None = None, etag: str | None = None,
                    last_modified: str | None = None) -> None:
    """Storage first, database second. Both statements in one transaction."""
    with conn.cursor() as cur:
        cur.execute("""
            insert into cost.artifact (sha256, bytes, content_type,
                                       storage_bucket, storage_path)
            values (%s,%s,%s,%s,%s)
            on conflict (sha256) do nothing
        """, (st.sha256, st.bytes, st.content_type, BUCKET, st.path))
        cur.execute("""
            insert into cost.artifact_sighting (sha256, source_id, url,
                                                http_status, etag, last_modified)
            values (%s,%s,%s,%s,%s,%s)
        """, (st.sha256, source_id, url, http_status, etag, last_modified))


OBS_COLS = ("extraction_id", "sha256", "source_id", "metric", "metric_family",
            "value", "unit", "item_code", "item_desc", "quantity",
            "geo_kind", "geo_code", "period_start", "period_end",
            "typology", "construction_type", "stories", "attrs",
            "method", "confidence", "row_index")


def copy_observations(conn, rows) -> int:
    """COPY into a temp table, then upsert. Idempotent re-runs of the same
    extraction replace rather than duplicate."""
    n = 0
    with conn.cursor() as cur:
        cur.execute("create temp table _obs (like cost.observation including defaults) "
                    "on commit drop")
        cols = ", ".join(OBS_COLS)
        with cur.copy(f"copy _obs ({cols}) from stdin") as cp:
            for r in rows:
                cp.write_row(tuple(r[c] for c in OBS_COLS))
                n += 1
        cur.execute(f"""
            insert into cost.observation ({cols})
            select {cols} from _obs
            on conflict (extraction_id, coalesce(row_index, -1), metric)
            do update set value = excluded.value, unit = excluded.unit,
                          attrs = excluded.attrs, confidence = excluded.confidence
        """)
    return n


def connect():
    """Direct / session-mode connection.

    COPY and prepared statements need session mode. Supavisor's transaction mode
    (port 6543) is right for n8n's short-lived queries and wrong here — it is the
    usual cause of 'prepared statement already exists' in Supabase pipelines.
    """
    return psycopg.connect(os.environ["SUPABASE_DB_URL"])
