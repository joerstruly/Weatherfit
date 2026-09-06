# W4 — Template synthesis via OpenRouter

Fires only when the deterministic ladder fails its gates. The model **proposes a recipe; it never supplies data.**

## Flow

```
synthesis_queue
   → GET /page-text  (parser service: text + word coords, or a 200dpi page PNG)
   → OpenRouter chat/completions, response_format = json_schema (strict)
   → candidate template JSON
   → POST /extract  with the CANDIDATE TEMPLATE  ← deterministic re-run
   → gates pass?
        yes → open PR adding templates/<id>.json   (human reviews the geometry)
        no  → human queue, with the gate failures attached
```

The re-run is the load-bearing step. Whatever the model returns, the number that reaches the
warehouse is produced by `extract_template()` and must satisfy `row_arithmetic` and
`reconciles_to_stated_total`. A hallucinated column boundary produces a failed gate, not a bad row.

## Request shape

`POST https://openrouter.ai/api/v1/chat/completions`

```jsonc
{
  "model": "anthropic/claude-opus-5",
  "models": ["anthropic/claude-opus-5", "google/gemini-3-pro"],   // fallback routing
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "extraction_template",
      "strict": true,
      "schema": {
        "type": "object", "additionalProperties": false,
        "required": ["id", "y_tolerance", "columns", "gates"],
        "properties": {
          "id": {"type": "string"},
          "header_row_contains": {"type": "string"},
          "stop_row_contains":   {"type": "string"},
          "y_tolerance": {"type": "number"},
          "columns": {
            "type": "array", "minItems": 2,
            "items": {
              "type": "object", "additionalProperties": false,
              "required": ["name", "x0", "x1", "type"],
              "properties": {
                "name": {"type": "string"},
                "x0": {"type": "number"}, "x1": {"type": "number"},
                "type": {"type": "string", "enum": ["string", "number", "date"]}
              }
            }
          },
          "gates": {
            "type": "object", "additionalProperties": false,
            "required": ["expect_columns", "numeric_columns"],
            "properties": {
              "expect_columns": {"type": "integer"},
              "numeric_columns": {"type": "array", "items": {"type": "integer"}},
              "qty_col":    {"type": ["integer", "null"]},
              "price_col":  {"type": ["integer", "null"]},
              "amount_col": {"type": ["integer", "null"]},
              "unit_col":   {"type": ["integer", "null"]}
            }
          }
        }
      }
    }
  },
  "messages": [
    {"role": "system", "content": "You write extraction templates for a construction cost database. You are given the word-level text of one PDF page with x/y coordinates. Return ONLY a column geometry. Never transcribe or infer cell values — a deterministic parser will re-read the page using your geometry, and its output is checked against the document's own stated total. Set x0/x1 to the whitespace corridors BETWEEN columns, not to the text edges, so slightly wider values in other editions still fall inside their column. If the table has a quantity, unit price and amount column, you MUST identify them in gates so the arithmetic check can run."},
    {"role": "user", "content": "<word list with coordinates, plus the page bbox>"}
  ]
}
```

## Why this is cheap

One call per **layout**, not per document. Michigan's assessor manual has editions back to 2014
under the same design — one template reads all of them. A five-year DOT series is one call.
Across the whole catalog: roughly 60 distinct layouts × ~50k input tokens ≈ **$20–50, once.**

## Guardrails

- **Never** let W4 write to the warehouse. Its only outputs are a template file and a queue row.
- Templates land via **pull request**. A column geometry is four numbers; a human can check it in
  seconds against a rendered page, and that review is the audit trail.
- Store the model, model version and the prompt hash on the template. When a template later
  produces a bad extraction you need to know what wrote it.
- If two consecutive editions of the same source need new templates, the layout is unstable —
  flag the source rather than accumulating near-duplicate templates.

## Model choice

| Role | Shape | Suggested |
|---|---|---|
| Template synthesis | Rare, hard, high leverage | `anthropic/claude-opus-5` ($5/$25 per MTok first-party) |
| Routing / header mapping | High volume, easy, checkable | `anthropic/claude-haiku-4-5` ($1/$5) |
| Two-model value cross-check | Only for scanned one-offs | Two **different families** — same model twice agreeing proves nothing |

OpenRouter adds a margin over first-party rates; price the actual route before committing.
Structured-output support varies by model, so pin models that implement strict mode rather
than assuming it.
