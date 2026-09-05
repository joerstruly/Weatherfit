# Project GYRO — home service robot concept

- `SPEC.md` — the specification (source of truth)
- `visuals/fig1.svg … fig6.svg` — dimensioned figures, generated from one model
- `index.html` — the spec rendered as a single themed page with the figures inline
- `tools/gen_figures.py` — regenerates the figures: `python3 tools/gen_figures.py visuals /tmp/inline`
- `tools/build_page.py` — renders SPEC.md to index.html: `python3 tools/build_page.py SPEC.md /tmp/inline index.html`
- `tools/viewer.js` — self-contained Canvas renderer of the dimensioned model (exterior, cutaway, magazine, exploded); inlined into index.html at build
- `visuals/render-*.png` — stills captured from the viewer at 1400×1000
