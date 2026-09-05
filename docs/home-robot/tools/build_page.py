#!/usr/bin/env python3
"""Render docs/home-robot/SPEC.md into a themed single-page HTML with inline SVG figures."""
import re, sys, os, html

MD = sys.argv[1]; INLINE_DIR = sys.argv[2]; OUT = sys.argv[3]
src = open(MD, encoding="utf-8").read().split("\n")

def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
    t = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", t)
    return t

out = []
i = 0
fig_n = 0
toc = []
title = ""
meta_rows = []
while i < len(src):
    line = src[i]
    if line.startswith("# "):
        title = line[2:].strip(); i += 1; continue
    if line.startswith("## "):
        h = line[3:].strip(); hid = "s" + re.sub(r"[^a-z0-9]+", "-", h.lower()).strip("-")
        toc.append((hid, h)); out.append(f'<h2 id="{hid}">{inline(h)}</h2>'); i += 1; continue
    if line.startswith("### "):
        out.append(f"<h3>{inline(line[4:].strip())}</h3>"); i += 1; continue
    if line.startswith("|"):
        rows = []
        while i < len(src) and src[i].startswith("|"):
            rows.append([c.strip() for c in src[i].strip().strip("|").split("|")]); i += 1
        header, body = rows[0], rows[2:]
        # the document title block: first table right after the title
        if not out and not meta_rows:
            meta_rows = body; continue
        cls = ' class="kv"' if all(h == "" for h in header) else ""
        t = [f"<div class=\"tw\"><table{cls}>"]
        if not cls:
            t.append("<thead><tr>" + "".join(f"<th>{inline(c)}</th>" for c in header) + "</tr></thead>")
        t.append("<tbody>")
        for r in body:
            t.append("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>")
        t.append("</tbody></table></div>")
        out.append("".join(t)); continue
    m = re.match(r"!\[(.*)\]\((visuals/fig(\d)\.svg)\)", line)
    if m:
        fig_n += 1
        cap = m.group(1); n = m.group(3)
        svgtxt = open(os.path.join(INLINE_DIR, f"fig{n}.svg"), encoding="utf-8").read()
        cap_html = inline(cap)
        cap_html = re.sub(r"^Figure (\d)\.", r'<span class="fignum">Figure \1</span>', cap_html)
        out.append(f'<figure class="fig">{svgtxt}<figcaption>{cap_html}</figcaption></figure>')
        i += 1; continue
    if line.startswith("> "):
        block = []
        while i < len(src) and src[i].startswith("> "):
            block.append(src[i][2:]); i += 1
        txt = " ".join(block)
        txt = re.sub(r"^\*\*Review note\.\*\*\s*", "", txt)
        out.append(f'<aside class="note"><span class="note-label">Design review note</span><p>{inline(txt)}</p></aside>'); continue
    if re.match(r"^\d+\. ", line):
        items = []
        while i < len(src) and re.match(r"^\d+\. ", src[i]):
            items.append(re.sub(r"^\d+\. ", "", src[i])); i += 1
        out.append("<ol>" + "".join(f"<li>{inline(x)}</li>" for x in items) + "</ol>"); continue
    if line.startswith("- "):
        items = []
        while i < len(src) and src[i].startswith("- "):
            items.append(src[i][2:]); i += 1
        out.append("<ul>" + "".join(f"<li>{inline(x)}</li>" for x in items) + "</ul>"); continue
    if line.strip() == "":
        i += 1; continue
    para = [line]; i += 1
    while i < len(src) and src[i].strip() and not re.match(r"^(#|\||!\[|> |- |\d+\. )", src[i]):
        para.append(src[i]); i += 1
    out.append(f"<p>{inline(' '.join(para))}</p>")

body_html = "\n".join(out)
meta_html = "".join(f'<div class="tb-cell"><span class="tb-k">{inline(k)}</span><span class="tb-v">{inline(v)}</span></div>' for k, v in meta_rows if k != "Visuals")
toc_html = "".join(f'<a href="#{hid}">{inline(h)}</a>' for hid, h in toc)
name, _, sub = title.partition(" — ")

page = f"""<title>{html.escape(name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
<style>
:root {{
  color-scheme: light;
  --paper:#F5F6F3; --paper-2:#ECEDE8; --ink:#1F2A33; --ink-2:#4A5560; --muted:#6B7680; --line:#D2D6D0; --line-2:#B9BFB8;
  --accent:#1C7FA8; --accent-ink:#155F7E; --amber:#B8700A; --amber-soft:rgba(184,112,10,.10);
  --shell:#ECEBE3; --shell-2:#E0DFD5; --ball:#2B3540;
  --display:"Barlow Condensed", "Arial Narrow", "Helvetica Neue", Arial, sans-serif;
  --serif:"Source Serif 4", Georgia, "Times New Roman", serif;
  --mono:"IBM Plex Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}}
@media (prefers-color-scheme: dark) {{
  :root:not([data-theme="light"]) {{
    color-scheme: dark;
    --paper:#161B20; --paper-2:#1E252C; --ink:#E6E8E4; --ink-2:#C2C8CD; --muted:#98A2AB; --line:#2E363D; --line-2:#3E474F;
    --accent:#2A93BE; --accent-ink:#7CC4E0; --amber:#C2831C; --amber-soft:rgba(194,131,28,.14);
    --shell:#2A323A; --shell-2:#343D46; --ball:#0E1216;
  }}
}}
:root[data-theme="dark"] {{
  color-scheme: dark;
  --paper:#161B20; --paper-2:#1E252C; --ink:#E6E8E4; --ink-2:#C2C8CD; --muted:#98A2AB; --line:#2E363D; --line-2:#3E474F;
  --accent:#2A93BE; --accent-ink:#7CC4E0; --amber:#C2831C; --amber-soft:rgba(194,131,28,.14);
  --shell:#2A323A; --shell-2:#343D46; --ball:#0E1216;
}}
* {{ box-sizing:border-box; }}
body {{ background:var(--paper); color:var(--ink); font-family:var(--serif); font-size:17px; line-height:1.55; margin:0; }}
a {{ color:var(--accent-ink); text-decoration:none; }}
a:hover, a:focus-visible {{ text-decoration:underline; }}
:focus-visible {{ outline:2px solid var(--accent); outline-offset:2px; }}

/* title block, drawn like an engineering drawing's */
.tb {{ border-top:3px solid var(--ink); border-bottom:1px solid var(--ink); margin:0 auto; max-width:1040px; padding:22px 24px 0; }}
.tb-head {{ display:flex; flex-wrap:wrap; align-items:baseline; justify-content:space-between; gap:8px 24px; }}
.tb h1 {{ font-family:var(--display); font-weight:700; font-size:clamp(40px,7vw,68px); line-height:.95; letter-spacing:-.01em; margin:0; text-wrap:balance; }}
.tb h1 small {{ display:block; font-weight:500; font-size:.42em; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); margin-bottom:6px; }}
.tb .sub {{ font-family:var(--display); font-weight:500; font-size:clamp(20px,2.6vw,26px); color:var(--ink-2); margin:0; }}
.tb-grid {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); border-top:1px solid var(--line-2); margin-top:18px; }}
.tb-cell {{ padding:10px 12px 12px 0; border-right:1px solid var(--line); display:flex; flex-direction:column; gap:2px; }}
.tb-cell + .tb-cell {{ padding-left:12px; }}
.tb-cell:last-child {{ border-right:0; }}
.tb-k {{ font-family:var(--mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); }}
.tb-v {{ font-family:var(--mono); font-size:13.5px; color:var(--ink); }}

.toc {{ max-width:1040px; margin:0 auto; padding:14px 24px; display:flex; flex-wrap:wrap; gap:6px 18px; border-bottom:1px solid var(--line); font-family:var(--mono); font-size:12px; }}
.toc a {{ color:var(--ink-2); }}

main {{ max-width:1040px; margin:0 auto; padding:24px 24px 80px; }}
main > p, main > ul, main > ol, main > h3 {{ max-width:68ch; }}
h2 {{ font-family:var(--display); font-weight:700; font-size:34px; line-height:1.05; letter-spacing:-.005em; margin:56px 0 14px; padding-top:18px; border-top:1px solid var(--ink); text-wrap:balance; }}
h2:first-child {{ margin-top:16px; border-top:0; padding-top:0; }}
h3 {{ font-family:var(--display); font-weight:600; font-size:22px; letter-spacing:.01em; margin:30px 0 8px; }}
p {{ margin:0 0 14px; }}
ul, ol {{ padding-left:1.3em; margin:0 0 16px; }}
li {{ margin:0 0 8px; }}
li::marker {{ font-family:var(--mono); font-size:13px; color:var(--muted); }}
code {{ font-family:var(--mono); font-size:.85em; background:var(--paper-2); padding:1px 5px; border-radius:3px; }}
strong {{ font-weight:600; }}

.tw {{ overflow-x:auto; margin:8px 0 22px; }}
table {{ border-collapse:collapse; width:100%; font-size:14.5px; line-height:1.4; }}
th {{ text-align:left; font-family:var(--mono); font-weight:500; font-size:11.5px; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); padding:8px 12px 8px 0; border-bottom:1px solid var(--ink); vertical-align:bottom; }}
td {{ padding:8px 12px 8px 0; border-bottom:1px solid var(--line); vertical-align:top; font-variant-numeric:tabular-nums; }}
td:first-child {{ font-family:var(--mono); font-size:13px; color:var(--ink); min-width:12ch; }}
tr:last-child td {{ border-bottom:1px solid var(--line-2); }}
table.kv td:first-child {{ color:var(--muted); width:14ch; }}
tbody tr:has(strong) td {{ border-top:1px solid var(--ink); }}

.note {{ margin:22px 0 26px; padding:14px 18px 6px; background:var(--amber-soft); max-width:74ch; }}
.note-label {{ display:block; font-family:var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--amber); margin-bottom:6px; }}
.note p {{ font-size:16px; }}

.fig {{ margin:18px 0 26px; padding:16px 0 0; border-top:1px solid var(--line-2); }}
.fig svg {{ max-width:100%; height:auto; display:block; font-family:var(--mono); color:var(--ink); }}
.fig figcaption {{ font-family:var(--serif); font-size:14.5px; color:var(--ink-2); max-width:78ch; margin-top:10px; }}
.fignum {{ font-family:var(--mono); font-size:12px; letter-spacing:.06em; text-transform:uppercase; color:var(--accent-ink); margin-right:8px; }}

/* figure vocabulary (inline SVG classes) */
.fig .ink {{ fill:none; stroke:currentColor; stroke-width:1.5; stroke-linejoin:round; stroke-linecap:round; }}
.fig .ink2 {{ fill:none; stroke:currentColor; stroke-width:2.2; stroke-linejoin:round; stroke-linecap:round; }}
.fig .shell {{ fill:var(--shell); stroke:currentColor; stroke-width:1.5; stroke-linejoin:round; }}
.fig .shell2 {{ fill:var(--shell-2); stroke:currentColor; stroke-width:1.5; stroke-linejoin:round; }}
.fig .ball {{ fill:var(--ball); stroke:currentColor; stroke-width:1.5; }}
.fig .hi {{ fill:var(--accent); stroke:none; }}
.fig .hiink {{ fill:none; stroke:var(--accent); stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }}
.fig .hifill {{ fill:var(--accent); fill-opacity:.18; stroke:var(--accent); stroke-width:1.5; }}
.fig .amb {{ fill:var(--amber); stroke:none; }}
.fig .ambink {{ fill:none; stroke:var(--amber); stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }}
.fig .ambfill {{ fill:var(--amber); fill-opacity:.22; stroke:var(--amber); stroke-width:1.5; }}
.fig .dim {{ fill:none; stroke:var(--muted); stroke-width:1; }}
.fig .dimt {{ fill:var(--muted); font-size:12px; }}
.fig .lbl {{ fill:currentColor; font-size:13px; }}
.fig .lblb {{ fill:currentColor; font-size:13px; font-weight:600; }}
.fig .cap {{ fill:currentColor; font-size:14px; font-weight:600; letter-spacing:.04em; }}
.fig .muted {{ fill:var(--muted); font-size:12px; }}
.fig .grid {{ stroke:var(--line); stroke-width:1; }}
.fig .ghost {{ fill:none; stroke:currentColor; stroke-width:1.2; stroke-dasharray:4 4; opacity:.55; }}
.fig .hatch {{ stroke:currentColor; stroke-width:1.2; }}
.fig .bar-h {{ fill:var(--accent); }}
.fig .bar-r {{ fill:var(--amber); }}
.fig marker path[fill="#6B7680"] {{ fill:var(--muted); }}

footer {{ max-width:1040px; margin:0 auto; padding:18px 24px 40px; border-top:1px solid var(--ink); font-family:var(--mono); font-size:12px; color:var(--muted); display:flex; flex-wrap:wrap; gap:8px 24px; justify-content:space-between; }}
@media (max-width:640px) {{ body {{ font-size:16px; }} h2 {{ font-size:28px; }} }}
@media (prefers-reduced-motion: no-preference) {{ html {{ scroll-behavior:smooth; }} }}
</style>
<header class="tb">
  <div class="tb-head">
    <h1><small>Concept design specification</small>{html.escape(name)}</h1>
    <p class="sub">{html.escape(sub)}</p>
  </div>
  <div class="tb-grid">{meta_html}<div class="tb-cell"><span class="tb-k">Sheet</span><span class="tb-v">1 of 1 · {fig_n} figures</span></div></div>
</header>
<nav class="toc" aria-label="Sections">{toc_html}</nav>
<main>
{body_html}
</main>
<footer><span>{html.escape(name)} · rev 0.1 · all dimensions mm</span><span>Source: docs/home-robot/SPEC.md · figures generated from one dimensioned model</span></footer>
"""
open(OUT, "w", encoding="utf-8").write(page)
print(OUT, len(page))
