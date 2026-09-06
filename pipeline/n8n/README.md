# n8n workflows

| File | Covers |
|---|---|
| `w1_w3_watch_archive_extract.json` | W1 watch → W2 archive → W3 extract. Importable. |
| `W4_template_synthesis.md` | W4 design, OpenRouter request shape, guardrails. |

## Import

Settings → Import from file. Then set credentials and these environment variables:

| Variable | Purpose |
|---|---|
| `MANIFEST_URL` | Raw URL of `research/construction-cost-data-sources/sources.csv` |
| `CADENCE_BUCKET` | `annual` / `quarterly` / `monthly` / `continuous` — one workflow instance per bucket |
| `ARTIFACT_BUCKET` | S3/R2 bucket for raw artifacts |
| `PARSER_URL` | Base URL of the parser service |

## Two things the workflow does deliberately

**The licence gate is enforced in the manifest node**, before any fetch, so no downstream node can
bypass it. Sources whose licence bars redistribution are watched for change but their bytes are
never retained.

**Only object keys cross node boundaries after the archive step.** n8n carries binary through the
chain; a 40 MB scanned assessor manual will exhaust memory in queue mode. The parser service reads
from the object store itself.
