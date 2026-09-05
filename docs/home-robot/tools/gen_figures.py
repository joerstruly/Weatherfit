#!/usr/bin/env python3
"""Generate the six spec figures for Project GYRO as SVG.

Two outputs per figure:
  inline/figN.svg   - no <style>, class-based, currentColor; for embedding in HTML
  docs/.../figN.svg - standalone, with an embedded <style> and a paper background
All geometry is in millimetres scaled by S (units per mm) so dimensions stay honest.
"""
import os, sys

OUT_STANDALONE = sys.argv[1]
OUT_INLINE = sys.argv[2]
os.makedirs(OUT_STANDALONE, exist_ok=True)
os.makedirs(OUT_INLINE, exist_ok=True)

STANDALONE_STYLE = """
<style>
  svg { color:#1F2A33; font-family: "IBM Plex Mono", ui-monospace, Menlo, monospace; }
  .paper { fill:#F5F6F3; }
  .ink { fill:none; stroke:currentColor; stroke-width:1.5; stroke-linejoin:round; stroke-linecap:round; }
  .ink2 { fill:none; stroke:currentColor; stroke-width:2.2; stroke-linejoin:round; stroke-linecap:round; }
  .shell { fill:#ECEBE3; stroke:currentColor; stroke-width:1.5; stroke-linejoin:round; }
  .shell2 { fill:#E0DFD5; stroke:currentColor; stroke-width:1.5; stroke-linejoin:round; }
  .ball { fill:#2B3540; stroke:currentColor; stroke-width:1.5; }
  .hi { fill:#1C7FA8; stroke:none; }
  .hiink { fill:none; stroke:#1C7FA8; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
  .hifill { fill:#1C7FA8; fill-opacity:0.18; stroke:#1C7FA8; stroke-width:1.5; }
  .amb { fill:#B8700A; stroke:none; }
  .ambink { fill:none; stroke:#B8700A; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
  .ambfill { fill:#B8700A; fill-opacity:0.22; stroke:#B8700A; stroke-width:1.5; }
  .dim { fill:none; stroke:#6B7680; stroke-width:1; }
  .dimt { fill:#6B7680; font-size:12px; }
  .lbl { fill:currentColor; font-size:13px; }
  .lblb { fill:currentColor; font-size:13px; font-weight:600; }
  .cap { fill:currentColor; font-size:14px; font-weight:600; letter-spacing:0.04em; }
  .muted { fill:#6B7680; font-size:12px; }
  .grid { stroke:#D2D6D0; stroke-width:1; }
  .ghost { fill:none; stroke:currentColor; stroke-width:1.2; stroke-dasharray:4 4; opacity:0.55; }
  .hatch { fill:url(#hatch); stroke:currentColor; stroke-width:1.2; }
  .bar-h { fill:#1C7FA8; }
  .bar-r { fill:#B8700A; }
  .bar-idle { fill:#D2D6D0; }
</style>
"""

DEFS = """<defs>
  <marker id="{p}arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
  </marker>
  <marker id="{p}dimarr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 z" fill="#6B7680"/>
  </marker>
  <pattern id="{p}hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" stroke-width="1" opacity="0.5"/>
  </pattern>
</defs>"""


def svg(fig, w, h, body, label):
    inline = (f'<svg viewBox="0 0 {w} {h}" role="img" aria-label="{label}" '
              f'xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block">'
              + DEFS.replace("{p}", f"f{fig}") + body.replace("url(#hatch)", f"url(#f{fig}hatch)")
              .replace("url(#arr)", f"url(#f{fig}arr)").replace("url(#dimarr)", f"url(#f{fig}dimarr)") + "</svg>")
    standalone = (f'<svg viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="{label}" '
                  f'xmlns="http://www.w3.org/2000/svg">' + STANDALONE_STYLE + DEFS.replace("{p}", "")
                  + f'<rect class="paper" x="0" y="0" width="{w}" height="{h}"/>' + body + "</svg>")
    with open(os.path.join(OUT_INLINE, f"fig{fig}.svg"), "w") as f:
        f.write(inline)
    with open(os.path.join(OUT_STANDALONE, f"fig{fig}.svg"), "w") as f:
        f.write(standalone)


# ---------- shared robot profile (side view) ----------
# Ground at y=gy. All in mm converted with S. x0 = centre line.
BALL_D = 280
SKIRT_W = 420
BODY_W = 380
SHOULDER_W = 400
HEAD_W = 260
H_STOWED = 1150
MAST_STROKE = 450


def robot_side(x0, gy, S, mast=0, arms="stowed", feet=False, drop=0, cls_shell="shell"):
    """Return SVG for the robot side elevation. mast = extension in mm; drop = body lowered around the ball (Kneel)."""
    def X(mm): return x0 + mm * S
    def Y(mm): return gy - (mm - drop) * S
    r = BALL_D / 2
    parts = []
    # ball always touches the ground
    parts.append(f'<circle class="ball" cx="{X(0):.1f}" cy="{gy - r*S:.1f}" r="{r*S:.1f}"/>')
    parts.append(f'<ellipse class="ink" cx="{X(0):.1f}" cy="{gy - r*S:.1f}" rx="{r*S*0.55:.1f}" ry="{r*S:.1f}" opacity="0.35"/>')
    # skirt: covers ball from 110mm up to 330mm; widest 420 at 300
    sk_bot, sk_top = 110, 340
    sw = SKIRT_W / 2
    parts.append(
        f'<path class="{cls_shell}" d="M{X(-sw*0.62):.1f},{Y(sk_bot):.1f} '
        f'C{X(-sw*1.02):.1f},{Y(sk_bot+60):.1f} {X(-sw*1.02):.1f},{Y(sk_top-20):.1f} {X(-BODY_W/2):.1f},{Y(sk_top):.1f} '
        f'L{X(BODY_W/2):.1f},{Y(sk_top):.1f} '
        f'C{X(sw*1.02):.1f},{Y(sk_top-20):.1f} {X(sw*1.02):.1f},{Y(sk_bot+60):.1f} {X(sw*0.62):.1f},{Y(sk_bot):.1f} Z"/>')
    # feet (Plant mode outriggers)
    if feet:
        for sx in (-1, 1):
            fx = X(sx * 250); fy = Y(0)
            parts.append(f'<path class="ambink" d="M{X(sx*170):.1f},{Y(200):.1f} L{fx:.1f},{Y(30):.1f}"/>')
            parts.append(f'<rect class="amb" x="{fx - 14:.1f}" y="{fy - 8:.1f}" width="28" height="8" rx="2"/>')
    # mid body 340 -> 880 (+mast for the upper section)
    bw = BODY_W / 2
    top_fixed = 880
    parts.append(
        f'<path class="{cls_shell}" d="M{X(-bw):.1f},{Y(sk_top):.1f} '
        f'C{X(-bw*1.08):.1f},{Y(520):.1f} {X(-bw*0.98):.1f},{Y(770):.1f} {X(-bw*0.88):.1f},{Y(top_fixed):.1f} '
        f'L{X(bw*0.88):.1f},{Y(top_fixed):.1f} '
        f'C{X(bw*0.98):.1f},{Y(770):.1f} {X(bw*1.08):.1f},{Y(520):.1f} {X(bw):.1f},{Y(sk_top):.1f} Z"/>')
    # mast (visible only when extended)
    if mast > 0:
        parts.append(f'<rect class="hatch" x="{X(-70):.1f}" y="{Y(top_fixed+mast):.1f}" width="{140*S:.1f}" height="{mast*S:.1f}"/>')
    # shoulder turret 880+mast -> 980+mast
    st = top_fixed + mast
    sw2 = SHOULDER_W / 2
    parts.append(
        f'<path class="shell2" d="M{X(-bw*0.88):.1f},{Y(st):.1f} '
        f'C{X(-sw2):.1f},{Y(st+30):.1f} {X(-sw2):.1f},{Y(st+80):.1f} {X(-HEAD_W/2):.1f},{Y(st+100):.1f} '
        f'L{X(HEAD_W/2):.1f},{Y(st+100):.1f} '
        f'C{X(sw2):.1f},{Y(st+80):.1f} {X(sw2):.1f},{Y(st+30):.1f} {X(bw*0.88):.1f},{Y(st):.1f} Z"/>')
    # head dome 980+mast -> 1150+mast
    hd = st + 100
    hw = HEAD_W / 2
    parts.append(
        f'<path class="{cls_shell}" d="M{X(-hw):.1f},{Y(hd):.1f} '
        f'C{X(-hw):.1f},{Y(hd+120):.1f} {X(-hw*0.55):.1f},{Y(hd+170):.1f} {X(0):.1f},{Y(hd+170):.1f} '
        f'C{X(hw*0.55):.1f},{Y(hd+170):.1f} {X(hw):.1f},{Y(hd+120):.1f} {X(hw):.1f},{Y(hd):.1f} Z"/>')
    # sensor band (light ring)
    parts.append(f'<rect class="hi" x="{X(-hw*0.95):.1f}" y="{Y(hd+70):.1f}" width="{hw*1.9*S:.1f}" height="{6*S:.1f}" rx="2"/>')
    # arms
    if arms == "stowed":
        # arm bays: recessed lines on shoulder
        for sx in (-1, 1):
            parts.append(f'<path class="ink" d="M{X(sx*150):.1f},{Y(st+20):.1f} L{X(sx*150):.1f},{Y(st+80):.1f}" opacity="0.6"/>')
    elif arms == "work":
        # both arms out; right arm toward counter, left arm holding item
        sy = st + 50
        # right arm
        parts.append(f'<path class="ink2" d="M{X(160):.1f},{Y(sy):.1f} L{X(420):.1f},{Y(sy+40):.1f} L{X(650):.1f},{Y(sy-120):.1f}"/>')
        parts.append(f'<circle class="ink" cx="{X(420):.1f}" cy="{Y(sy+40):.1f}" r="{18*S:.1f}"/>')
        parts.append(f'<path class="ink2" d="M{X(650):.1f},{Y(sy-120):.1f} l{40*S:.1f},{-25*S:.1f} M{X(650):.1f},{Y(sy-120):.1f} l{45*S:.1f},{15*S:.1f}"/>')
        # left arm
        parts.append(f'<path class="ink2" d="M{X(-160):.1f},{Y(sy):.1f} L{X(-380):.1f},{Y(sy+120):.1f} L{X(-560):.1f},{Y(sy-60):.1f}"/>')
        parts.append(f'<circle class="ink" cx="{X(-380):.1f}" cy="{Y(sy+120):.1f}" r="{18*S:.1f}"/>')
        parts.append(f'<path class="ink2" d="M{X(-560):.1f},{Y(sy-60):.1f} l{-40*S:.1f},{-25*S:.1f} M{X(-560):.1f},{Y(sy-60):.1f} l{-45*S:.1f},{15*S:.1f}"/>')
    return "\n".join(parts)


def dim_v(x, y1, y2, text, side="r", S=1):
    """Vertical dimension line with text."""
    tx = x + (8 if side == "r" else -8)
    anchor = "start" if side == "r" else "end"
    return (f'<line class="dim" x1="{x:.1f}" y1="{y1:.1f}" x2="{x:.1f}" y2="{y2:.1f}" marker-start="url(#dimarr)" marker-end="url(#dimarr)"/>'
            f'<text class="dimt" x="{tx:.1f}" y="{(y1+y2)/2+4:.1f}" text-anchor="{anchor}">{text}</text>')


def dim_h(y, x1, x2, text):
    return (f'<line class="dim" x1="{x1:.1f}" y1="{y:.1f}" x2="{x2:.1f}" y2="{y:.1f}" marker-start="url(#dimarr)" marker-end="url(#dimarr)"/>'
            f'<text class="dimt" x="{(x1+x2)/2:.1f}" y="{y-6:.1f}" text-anchor="middle">{text}</text>')


def ext(x1, y1, x2, y2):
    return f'<line class="dim" x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke-dasharray="3 3"/>'


# ================= Figure 1: General arrangement, stowed vs extended =================
def fig1():
    W, H = 900, 620
    S = 0.30
    gy = 560
    body = []
    # ground line
    body.append(f'<line class="ink" x1="40" y1="{gy}" x2="{W-40}" y2="{gy}"/>')
    for i in range(40, W - 40, 22):
        body.append(f'<line class="grid" x1="{i}" y1="{gy}" x2="{i-8}" y2="{gy+8}"/>')
    # left: stowed
    xa = 250
    body.append(robot_side(xa, gy, S, mast=0, arms="stowed"))
    body.append(f'<text class="cap" x="{xa}" y="40" text-anchor="middle">STOWED · ROAM</text>')
    # right: extended, working
    xb = 640
    body.append(robot_side(xb, gy, S, mast=MAST_STROKE, arms="work"))
    body.append(f'<text class="cap" x="{xb}" y="40" text-anchor="middle">EXTENDED · REACH</text>')
    # dimensions - stowed
    def Y(mm): return gy - mm * S
    # overall height stowed
    body.append(ext(xa - 130 * S - 60, Y(H_STOWED), xa - 60, Y(H_STOWED)))
    body.append(dim_v(xa - 150, Y(0), Y(H_STOWED), "1150", side="l"))
    # ball dia
    body.append(dim_h(Y(0) + 34, xa - 140 * S, xa + 140 * S, "Ø280 ball"))
    # skirt width
    body.append(ext(xa - 210 * S, Y(300), xa - 210 * S, Y(0) + 62))
    body.append(ext(xa + 210 * S, Y(300), xa + 210 * S, Y(0) + 62))
    body.append(dim_h(Y(0) + 58, xa - 210 * S, xa + 210 * S, "Ø420 max"))
    # shoulder height stowed
    body.append(ext(xa + 190 * S, Y(930), xa + 110, Y(930)))
    body.append(dim_v(xa + 100, Y(0), Y(930), "930 shoulder", side="r"))
    # dims - extended
    body.append(ext(xb - 130 * S - 30, Y(H_STOWED + MAST_STROKE), xb - 120, Y(H_STOWED + MAST_STROKE)))
    body.append(dim_v(xb - 110, Y(0), Y(H_STOWED + MAST_STROKE), "1600", side="l"))
    # mast stroke
    body.append(ext(xb + 70 * S, Y(880), xb + 60, Y(880)))
    body.append(ext(xb + 70 * S, Y(880 + MAST_STROKE), xb + 60, Y(880 + MAST_STROKE)))
    body.append(dim_v(xb + 50, Y(880), Y(880 + MAST_STROKE), "450 mast stroke", side="r"))
    # reach
    body.append(dim_h(Y(1380 + 60) - 10, xb + 160 * S, xb + 690 * S, "750 reach"))
    # mass note
    body.append(f'<text class="muted" x="{W-40}" y="{H-14}" text-anchor="end">all dimensions mm · mass 42 kg dry / 45 kg wet · scale 0.3</text>')
    svg(1, W, H, "\n".join(body), "General arrangement: stowed roam posture at 1150 mm beside the extended reach posture at 1600 mm with both arms deployed")


# ================= Figure 2: Three postures / modes =================
def fig2():
    W, H = 960, 540
    S = 0.24
    gy = 450
    body = []
    body.append(f'<line class="ink" x1="30" y1="{gy}" x2="{W-30}" y2="{gy}"/>')
    cols = [170, 480, 790]
    titles = ["ROAM", "PLANT", "KNEEL"]
    subs = [("balancing on the ball", "omnidirectional · ≤1.2 m/s"),
            ("3 feet down, ball braked", "sustained push >100 N"),
            ("fault · charge · storage", "passively stable, no power")]
    def Y(mm): return gy - mm * S
    # ROAM
    x = cols[0]
    body.append(robot_side(x, gy, S, mast=0, arms="stowed"))
    body.append(f'<path class="hiink" d="M{x+70},{Y(600)} L{x+130},{Y(600)}" marker-end="url(#arr)"/>')
    body.append(f'<text class="lbl" x="{x+70}" y="{Y(600)-10}">~30 N push limit</text>')
    body.append(f'<path class="hiink" d="M{x-40},{Y(1250)} A 120 120 0 0 1 {x+40},{Y(1250)}" marker-end="url(#arr)"/>')
    body.append(f'<text class="muted" x="{x}" y="{Y(1250)-14}" text-anchor="middle">lean = force</text>')
    # PLANT
    x = cols[1]
    body.append(robot_side(x, gy, S, mast=0, arms="work", feet=True))
    body.append(f'<text class="muted" x="{x}" y="{Y(0)+30}" text-anchor="middle">Ø500 stance · ball brake on</text>')
    # KNEEL: body drops 110 mm around the ball so the skirt lip carries the load
    x = cols[2]
    body.append(robot_side(x, gy, S, mast=0, arms="stowed", drop=110))
    body.append(f'<rect class="hatch" x="{x-135}" y="{gy-5}" width="270" height="5"/>')
    body.append(f'<text class="muted" x="{x}" y="{Y(0)+30}" text-anchor="middle">skirt lip on floor · body drops 110 mm</text>')
    body.append(f'<text class="lbl" x="{x-75}" y="{Y(1250)}" text-anchor="middle">power loss → here in &lt;1 s</text>')
    for c, t, (s1, s2) in zip(cols, titles, subs):
        body.append(f'<text class="cap" x="{c}" y="40" text-anchor="middle">{t}</text>')
        body.append(f'<text class="muted" x="{c}" y="60" text-anchor="middle">{s1}</text>')
        body.append(f'<text class="muted" x="{c}" y="76" text-anchor="middle">{s2}</text>')
    # transitions
    ty = H - 30
    body.append(f'<path class="ink" d="M{cols[0]+90},{ty} L{cols[1]-90},{ty}" marker-end="url(#arr)" marker-start="url(#arr)"/>')
    body.append(f'<text class="muted" x="{(cols[0]+cols[1])/2}" y="{ty-8}" text-anchor="middle">~1.5 s either way</text>')
    body.append(f'<path class="ink" d="M{cols[1]+90},{ty} L{cols[2]-90},{ty}" marker-end="url(#arr)"/>')
    body.append(f'<text class="muted" x="{(cols[1]+cols[2])/2}" y="{ty-8}" text-anchor="middle">any fault, from either mode</text>')
    svg(2, W, H, "\n".join(body), "The three postures: Roam balancing on the ball, Plant with three outrigger feet down for high-force work, and Kneel resting on the skirt lip after a fault")


# ================= Figure 3: Cutaway / internal layout =================
def fig3():
    W, H = 1000, 660
    S = 0.40
    gy = 610
    x0 = 330
    body = []
    def X(mm): return x0 + mm * S
    def Y(mm): return gy - mm * S
    body.append(f'<line class="ink" x1="40" y1="{gy}" x2="{W-40}" y2="{gy}"/>')
    # outer silhouette (ghost) using robot_side with ghost classes: draw shell then overlay internals
    body.append(robot_side(x0, gy, S, mast=0, arms="stowed"))
    # cut: cover right half with paper-ish translucent? Instead draw internals on top of shell.
    # ball drive: three omniwheels touching the ball
    r = 140
    for ang, lab in ((-40, ""), (40, ""), (0, "")):
        import math
        a = math.radians(ang + 90)
        cx = X(math.cos(a) * (r + 22)); cy = Y(r + math.sin(a) * (r + 22))
        body.append(f'<circle class="shell2" cx="{cx:.1f}" cy="{cy:.1f}" r="{22*S:.1f}"/>')
    # feet stowed in skirt
    for sx in (-1, 1):
        body.append(f'<rect class="ambfill" x="{X(sx*188)-5:.1f}" y="{Y(300):.1f}" width="10" height="{140*S:.1f}" rx="2"/>')
    # battery: annular pack in skirt, drawn as two blocks flanking
    for sx in (-1, 1):
        body.append(f'<rect class="hifill" x="{X(sx*150)-30:.1f}" y="{Y(330):.1f}" width="60" height="{100*S:.1f}" rx="2"/>')
    # water tanks at 350-520, left clean right grey
    body.append(f'<rect class="shell2" x="{X(-170):.1f}" y="{Y(560):.1f}" width="{80*S:.1f}" height="{200*S:.1f}" rx="3"/>')
    body.append(f'<rect class="shell2" x="{X(90):.1f}" y="{Y(560):.1f}" width="{80*S:.1f}" height="{200*S:.1f}" rx="3"/>')
    # tool carousel: 560-760 centre, drum
    body.append(f'<ellipse class="ambfill" cx="{X(0):.1f}" cy="{Y(760):.1f}" rx="{130*S:.1f}" ry="{28*S:.1f}"/>')
    body.append(f'<path class="ambink" d="M{X(-130):.1f},{Y(760):.1f} L{X(-130):.1f},{Y(580):.1f} M{X(130):.1f},{Y(760):.1f} L{X(130):.1f},{Y(580):.1f}"/>')
    body.append(f'<ellipse class="ambfill" cx="{X(0):.1f}" cy="{Y(580):.1f}" rx="{130*S:.1f}" ry="{28*S:.1f}"/>')
    # tool slots (8)
    for i in range(-3, 4):
        body.append(f'<rect class="amb" x="{X(i*36)-5:.1f}" y="{Y(740):.1f}" width="10" height="{140*S:.1f}" rx="2" opacity="0.8"/>')
    # mast (telescoping column) 340 -> 880 inside
    body.append(f'<rect class="hatch" x="{X(-45):.1f}" y="{Y(880):.1f}" width="{90*S:.1f}" height="{540*S:.1f}"/>')
    # compute module behind carousel: 800-870
    body.append(f'<rect class="hifill" x="{X(-120):.1f}" y="{Y(870):.1f}" width="{240*S:.1f}" height="{55*S:.1f}" rx="2"/>')
    # turret bearing ring at 880-900
    body.append(f'<rect class="hi" x="{X(-175):.1f}" y="{Y(895):.1f}" width="{350*S:.1f}" height="{10*S:.1f}" rx="2"/>')
    # arm shoulders stowed inside turret 900-980
    for sx in (-1, 1):
        body.append(f'<rect class="shell2" x="{X(sx*120)-20:.1f}" y="{Y(975):.1f}" width="40" height="{60*S:.1f}" rx="6"/>')
    # sensor crown: 4 depth cams at head equator
    for sx in (-1, 1):
        body.append(f'<circle class="hi" cx="{X(sx*115):.1f}" cy="{Y(1060):.1f}" r="5"/>')
    body.append(f'<circle class="hi" cx="{X(0):.1f}" cy="{Y(1140):.1f}" r="5"/>')
    # snorkel port bottom-right of skirt
    body.append(f'<circle class="ambfill" cx="{X(95):.1f}" cy="{Y(215):.1f}" r="{22*S:.1f}"/>')
    # ----- callouts (right side) -----
    lx = 620
    callouts = [
        (1140, 0, "Top-down wide camera + mic array", 100),
        (1060, 115, "4× RGB-D cameras at 90° · light ring below", 130),
        (940, 140, "Arm shoulders (2× 7-DOF) in rotating turret", 160),
        (895, 175, "Turret bearing · 360° continuous", 190),
        (845, 120, "Compute · ~200 TOPS SoC, all inference local", 220),
        (670, 130, "Tool carousel · 8 quick-change heads", 260),
        (460, 170, "Clean water 1.0 L (L) · grey water 1.0 L (R)", 330),
        (300, 150, "Battery 1.2 kWh annular pack · lowest mass", 400),
        (215, 95, "Snorkel port · wet/dry vacuum hose", 440),
        (200, 188, "Outrigger feet ×3, stowed in skirt", 470),
        (160, 162, "3× omniwheel ball drive + brake", 520),
    ]
    for mm, xmm, text, ty in callouts:
        y = Y(mm)
        body.append(f'<line class="dim" x1="{X(xmm):.1f}" y1="{y:.1f}" x2="{lx-10}" y2="{ty:.1f}"/>')
        body.append(f'<circle class="ink" cx="{X(xmm):.1f}" cy="{y:.1f}" r="2.5" fill="currentColor"/>')
        body.append(f'<text class="lbl" x="{lx}" y="{ty+4}">{text}</text>')
    # left: mast label
    body.append(f'<line class="dim" x1="{X(-45):.1f}" y1="{Y(640):.1f}" x2="{X(-260):.1f}" y2="{Y(640):.1f}"/>')
    body.append(f'<text class="lbl" x="{X(-265):.1f}" y="{Y(640)-4:.1f}" text-anchor="end">telescoping mast</text>')
    body.append(f'<text class="lbl" x="{X(-265):.1f}" y="{Y(640)+12:.1f}" text-anchor="end">450 mm stroke</text>')
    body.append(f'<text class="cap" x="40" y="40">CUTAWAY · SIDE</text>')
    body.append(f'<text class="muted" x="40" y="{H-16}">heavy mass sits in the skirt around the ball; everything above the turret bearing is under 6 kg</text>')
    svg(3, W, H, "\n".join(body), "Cutaway of the body showing the omniwheel ball drive and battery low in the skirt, water tanks and tool carousel mid-body, telescoping mast, arm turret and sensor crown")


# ================= Figure 4: Tool deployment sequence =================
def fig4():
    W, H = 960, 420
    body = []
    steps = ["1 · REQUEST", "2 · INDEX", "3 · PRESENT", "4 · COUPLE", "5 · WORK"]
    xs = [95, 280, 465, 650, 835]
    body.append(f'<text class="cap" x="40" y="36">TOOL CAROUSEL · CHANGE CYCLE ≈ 4 s</text>')
    for i, (x, t) in enumerate(zip(xs, steps)):
        body.append(f'<text class="lblb" x="{x}" y="80" text-anchor="middle">{t}</text>')
        # body segment (mid-body ring) as a rounded rect
        body.append(f'<rect class="shell" x="{x-60}" y="110" width="120" height="180" rx="40"/>')
        # carousel drum inside
        body.append(f'<ellipse class="ambfill" cx="{x}" cy="150" rx="40" ry="10"/>')
        body.append(f'<ellipse class="ambfill" cx="{x}" cy="240" rx="40" ry="10"/>')
        body.append(f'<path class="ambink" d="M{x-40},150 L{x-40},240 M{x+40},150 L{x+40},240"/>')
        # slots
        for k in range(-2, 3):
            hi = (i >= 1 and k == 0)
            cls = "amb" if hi else "amb"
            op = "1" if hi else "0.35"
            body.append(f'<rect class="{cls}" x="{x+k*16-4}" y="165" width="8" height="55" rx="2" opacity="{op}"/>')
        # hatch door on right side of the body
        if i >= 2:
            body.append(f'<path class="ink" d="M{x+60},175 L{x+82},160" />')
            body.append(f'<path class="ink" d="M{x+60},215 L{x+82},230" />')
        else:
            body.append(f'<path class="ink" d="M{x+60},175 L{x+60},215" opacity="0.5"/>')
        if i == 2:
            # tool presented out of hatch
            body.append(f'<rect class="amb" x="{x+62}" y="188" width="34" height="8" rx="2"/>')
        if i >= 3:
            # hand approaches / couples
            body.append(f'<path class="ink2" d="M{x+122},122 L{x+108},166 L{x+98},192"/>')
            body.append(f'<circle class="ink" cx="{x+108}" cy="166" r="5"/>')
            body.append(f'<rect class="amb" x="{x+62 if i == 3 else x+96}" y="188" width="34" height="8" rx="2"/>')
        if i == 4:
            body.append(f'<path class="ambink" d="M{x+130},192 q 12 -10 24 0 q 12 10 24 0" />')
        # arrow to next
        if i < 4:
            body.append(f'<path class="ink" d="M{x+70},310 L{x+110},310" marker-end="url(#arr)"/>')
    notes = [("arm requests a head", "by task step"), ("drum indexes the slot", "to the hatch"), ("hatch opens, head", "pushed out 40 mm"),
             ("wrist coupler: 3-lug", "bayonet + pogo pins"), ("old head returns", "by the same cycle")]
    for x, (n1, n2) in zip(xs, notes):
        body.append(f'<text class="muted" x="{x}" y="335" text-anchor="middle">{n1}</text>')
        body.append(f'<text class="muted" x="{x}" y="351" text-anchor="middle">{n2}</text>')
    body.append(f'<text class="muted" x="40" y="{H-16}">the arm never carries a tool it cannot drop into a slot; a dropped tool is a task fault, not a hazard</text>')
    svg(4, W, H, "\n".join(body), "Five-step tool change: the arm requests a head, the drum indexes it to the hatch, presents it, the wrist couples via a bayonet with pogo pins, and the arm works")


# ================= Figure 5: Workspace envelope at a kitchen counter =================
def fig5():
    W, H = 960, 700
    S = 0.26
    gy = 640
    x0 = 330
    body = []
    def X(mm): return x0 + mm * S
    def Y(mm): return gy - mm * S
    import math
    body.append(f'<line class="ink" x1="40" y1="{gy}" x2="{W-40}" y2="{gy}"/>')
    # counter: 600 deep, 900 high, starting 250 mm in front of robot skirt edge (x = 210+250 = 460)
    cx1 = X(460)
    body.append(f'<rect class="shell2" x="{cx1:.1f}" y="{Y(900):.1f}" width="{600*S:.1f}" height="{900*S:.1f}"/>')
    body.append(f'<rect class="hatch" x="{cx1:.1f}" y="{Y(900):.1f}" width="{600*S:.1f}" height="{40*S:.1f}"/>')
    # upper cabinet: 350 deep, bottom at 1400, top at 2100 (wall side)
    body.append(f'<rect class="shell2" x="{X(710):.1f}" y="{Y(2100):.1f}" width="{350*S:.1f}" height="{700*S:.1f}"/>')
    # shelf inside cabinet
    body.append(f'<line class="ink" x1="{X(710):.1f}" y1="{Y(1750):.1f}" x2="{X(1060):.1f}" y2="{Y(1750):.1f}"/>')
    # wall
    body.append(f'<line class="ink2" x1="{X(1060):.1f}" y1="{Y(0):.1f}" x2="{X(1060):.1f}" y2="{Y(2300):.1f}"/>')
    # reach envelopes: shoulder at (160, 930) stowed and (160, 1380) extended; radius 750
    for sh, cls, lab in ((930, "hifill", "shoulder 930 · mast down"), (1380, "hifill", "shoulder 1380 · mast up")):
        cx, cy, R = X(160), Y(sh), 750 * S
        # sector from -100° to +80° relative to +x axis (up is negative y)
        a0, a1 = math.radians(-95), math.radians(85)
        p0 = (cx + R * math.cos(a0), cy + R * math.sin(a0))
        p1 = (cx + R * math.cos(a1), cy + R * math.sin(a1))
        body.append(f'<path class="{cls}" d="M{cx:.1f},{cy:.1f} L{p0[0]:.1f},{p0[1]:.1f} A{R:.1f},{R:.1f} 0 0 1 {p1[0]:.1f},{p1[1]:.1f} Z" opacity="0.9"/>')
        body.append(f'<line class="dim" x1="{cx:.1f}" y1="{cy:.1f}" x2="{X(-230):.1f}" y2="{cy:.1f}"/>')
        body.append(f'<text class="lbl" x="{X(-236):.1f}" y="{cy+4:.1f}" text-anchor="end">{lab}</text>')
    # robot ghost outline, stowed, plus extended head ghost
    body.append(robot_side(x0, gy, S, mast=0, arms="stowed"))
    body.append(f'<path class="ghost" d="M{X(-130):.1f},{Y(1600):.1f} C{X(-130):.1f},{Y(1500):.1f} {X(-70):.1f},{Y(1430):.1f} {X(0):.1f},{Y(1430):.1f} M{X(130):.1f},{Y(1600):.1f} C{X(130):.1f},{Y(1500):.1f} {X(70):.1f},{Y(1430):.1f} {X(0):.1f},{Y(1430):.1f}"/>')
    # key heights
    marks = [(900, "counter 900"), (1400, "cabinet base 1400"), (1750, "top shelf 1750"), (2100, "cabinet top 2100")]
    for mm, t in marks:
        body.append(f'<line class="dim" x1="{X(1070):.1f}" y1="{Y(mm):.1f}" x2="{X(1110):.1f}" y2="{Y(mm):.1f}"/>')
        body.append(f'<text class="dimt" x="{X(1120):.1f}" y="{Y(mm)+4:.1f}">{t}</text>')
    # floor reach note
    body.append(f'<text class="lbl" x="{X(-236):.1f}" y="{Y(120):.1f}" text-anchor="end">floor pickup:</text>')
    body.append(f'<text class="lbl" x="{X(-236):.1f}" y="{Y(120)+16:.1f}" text-anchor="end">mast down, lean 8°</text>')
    body.append(f'<text class="cap" x="40" y="32">REACH ENVELOPE · 600 mm COUNTER</text>')
    body.append(f'<text class="muted" x="40" y="{H-16}">back of the counter is reached with the mast down; the top cabinet shelf needs mast up and the skirt against the toe-kick</text>')
    svg(5, W, H, "\n".join(body), "Side view of the robot at a kitchen counter with two reach envelopes: mast down covers counter and lower cabinet, mast up reaches the 1750 mm shelf in the upper cabinet")


# ================= Figure 6: Evening-dishes timeline, human vs GYRO =================
def fig6():
    W, H = 900, 400
    body = []
    x0, x1 = 150, 860  # 0..40 min
    scale = (x1 - x0) / 40.0
    def T(m): return x0 + m * scale
    body.append(f'<text class="cap" x="40" y="36">EVENING DISHES · FAMILY OF 4 · MINUTES OF WORK BEFORE THE DISHWASHER STARTS</text>')
    # axis
    ay = 300
    for m in range(0, 41, 5):
        body.append(f'<line class="grid" x1="{T(m):.1f}" y1="70" x2="{T(m):.1f}" y2="{ay}"/>')
        body.append(f'<text class="dimt" x="{T(m):.1f}" y="{ay+18}" text-anchor="middle">{m}</text>')
    body.append(f'<text class="muted" x="{x1}" y="{ay+36}" text-anchor="end">minutes</text>')
    # Human: single lane, sequential
    human = [(0, 4, "clear table"), (4, 15, "rinse + load"), (15, 22, "hand-wash pots"), (22, 26, "wipe + dry")]
    y = 95
    body.append(f'<text class="lblb" x="{x0-12}" y="{y+16}" text-anchor="end">Human</text>')
    for a, b, t in human:
        body.append(f'<rect class="bar-h" x="{T(a)+1:.1f}" y="{y}" width="{T(b)-T(a)-2:.1f}" height="24" rx="3"/>')
        body.append(f'<text class="lbl" x="{T((a+b)/2):.1f}" y="{y+40}" text-anchor="middle">{t}</text>')
    body.append(f'<text class="lbl" x="{T(26)+8:.1f}" y="{y+16}">26 min · 26 min of attention</text>')
    # Robot: three lanes in parallel: arm L, arm R, wand
    lanes = [
        ("GYRO arm L", [(0, 3, "clear"), (3, 12, "rinse + load"), (12, 17, "pots")]),
        ("GYRO arm R", [(0, 3, "clear"), (3, 12, "rinse + load"), (12, 17, "pots")]),
        ("GYRO wand", [(3, 9, "spray counters"), (12, 16, "wipe")]),
    ]
    y = 170
    for name, segs in lanes:
        body.append(f'<text class="lblb" x="{x0-12}" y="{y+16}" text-anchor="end">{name}</text>')
        for a, b, t in segs:
            body.append(f'<rect class="bar-r" x="{T(a)+1:.1f}" y="{y}" width="{T(b)-T(a)-2:.1f}" height="24" rx="3"/>')
            body.append(f'<text class="lbl" x="{T((a+b)/2):.1f}" y="{y+16}" text-anchor="middle" fill="#F5F6F3" style="fill:#F5F6F3;font-size:11px">{t}</text>')
        y += 34
    body.append(f'<text class="lbl" x="{T(17)+8:.1f}" y="{170+16+34}">17 min · 0 min of attention</text>')
    # ratio callout
    body.append(f'<text class="muted" x="40" y="{H-30}">robot per-grasp speed assumed 0.8× human at maturity; the gain comes from three effectors working in parallel,</text>')
    body.append(f'<text class="muted" x="40" y="{H-14}">not from faster hands. The dishwasher cycle (≈2 h) is unchanged, so wall-clock to "done" barely moves.</text>')
    svg(6, W, H, "\n".join(body), "Timeline comparing 26 minutes of sequential human dishwashing against 17 minutes for the robot, whose two arms and wand work in parallel while the dishwasher cycle stays the same")


fig1(); fig2(); fig3(); fig4(); fig5(); fig6()
print("ok")
