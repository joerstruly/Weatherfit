/* GYRO 3D viewer — self-contained Canvas 2D renderer (no libraries).
   Geometry in millimetres, y up, origin at the floor under the ball centre.
   Builds lathe/cylinder meshes, flat-shades them, painter-sorts, draws.
   Usage: GyroViewer.mount(canvasEl, {view:'exterior'|'cutaway'|'magazine'|'exploded', ...}) */
(function () {
  "use strict";

  // ---------- geometry helpers ----------
  function lathe(profile, segs, opts) {
    // profile: [[r, y], ...] from bottom to top; returns triangles
    opts = opts || {};
    var tris = [];
    var n = profile.length;
    for (var s = 0; s < segs; s++) {
      var a0 = (s / segs) * Math.PI * 2, a1 = ((s + 1) / segs) * Math.PI * 2;
      var c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);
      for (var i = 0; i < n - 1; i++) {
        var pa = profile[i], pb = profile[i + 1];
        var A = [pa[0] * c0, pa[1], pa[0] * s0], B = [pa[0] * c1, pa[1], pa[0] * s1];
        var C = [pb[0] * c1, pb[1], pb[0] * s1], D = [pb[0] * c0, pb[1], pb[0] * s0];
        if (pa[0] > 0.01 || pb[0] > 0.01) {
          if (pa[0] > 0.01) tris.push([A, B, C]);
          if (pb[0] > 0.01) tris.push([A, C, D]);
        }
      }
    }
    return tris;
  }
  function annulus(rIn, rOut, y0, y1, segs) {
    // closed ring: outer wall, inner wall, top, bottom
    var p = [[rOut, y0], [rOut, y1], [rIn, y1], [rIn, y0], [rOut, y0]];
    return lathe(p, segs);
  }
  function cylinderAlong(p0, p1, r, segs, capped) {
    // cylinder from p0 to p1 with radius r
    var ax = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
    var L = Math.hypot(ax[0], ax[1], ax[2]); ax = [ax[0] / L, ax[1] / L, ax[2] / L];
    var up = Math.abs(ax[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
    var u = cross(up, ax); u = norm(u); var v = cross(ax, u);
    var tris = [];
    for (var s = 0; s < segs; s++) {
      var a0 = (s / segs) * Math.PI * 2, a1 = ((s + 1) / segs) * Math.PI * 2;
      var o0 = [u[0] * Math.cos(a0) * r + v[0] * Math.sin(a0) * r, u[1] * Math.cos(a0) * r + v[1] * Math.sin(a0) * r, u[2] * Math.cos(a0) * r + v[2] * Math.sin(a0) * r];
      var o1 = [u[0] * Math.cos(a1) * r + v[0] * Math.sin(a1) * r, u[1] * Math.cos(a1) * r + v[1] * Math.sin(a1) * r, u[2] * Math.cos(a1) * r + v[2] * Math.sin(a1) * r];
      var A = add(p0, o0), B = add(p0, o1), C = add(p1, o1), D = add(p1, o0);
      tris.push([A, C, B]); tris.push([A, D, C]);
      if (capped) { tris.push([p0, B, A]); tris.push([p1, D, C]); }
    }
    return tris;
  }
  function box(cx, y0, y1, cz, w, d) {
    var x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2;
    var P = function (x, y, z) { return [x, y, z]; };
    var a = P(x0, y0, z0), b = P(x1, y0, z0), c = P(x1, y0, z1), d0 = P(x0, y0, z1);
    var e = P(x0, y1, z0), f = P(x1, y1, z0), g = P(x1, y1, z1), h = P(x0, y1, z1);
    return [[a, c, b], [a, d0, c], [e, f, g], [e, g, h], [a, b, f], [a, f, e], [b, c, g], [b, g, f], [c, d0, h], [c, h, g], [d0, a, e], [d0, e, h]];
  }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function rotY(p, a) { var c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[2] * s, p[1], p[0] * s + p[2] * c]; }

  // ---------- materials ----------
  var M = {
    shell:   { c: [0.925, 0.92, 0.89], spec: 0.25, shin: 40, cut: true },
    shell2:  { c: [0.86, 0.855, 0.82], spec: 0.25, shin: 40, cut: true },
    ball:    { c: [0.16, 0.20, 0.25], spec: 0.9, shin: 80 },
    ring:    { c: [0.11, 0.50, 0.66], spec: 0.5, shin: 30, emit: 0.35 },
    mast:    { c: [0.55, 0.57, 0.60], spec: 0.6, shin: 60 },
    alu:     { c: [0.72, 0.73, 0.74], spec: 0.5, shin: 50 },
    dark:    { c: [0.25, 0.27, 0.30], spec: 0.3, shin: 30 },
    amber:   { c: [0.72, 0.44, 0.06], spec: 0.3, shin: 30 },
    head:    { c: [0.30, 0.32, 0.35], spec: 0.35, shin: 30 },
    headS:   { c: [0.55, 0.60, 0.62], spec: 0.2, shin: 20 },
    headY:   { c: [0.85, 0.70, 0.25], spec: 0.2, shin: 20 },
    headB:   { c: [0.20, 0.45, 0.60], spec: 0.2, shin: 20 },
    coupler: { c: [0.80, 0.82, 0.84], spec: 0.8, shin: 90 },
    tank:    { c: [0.55, 0.75, 0.85], spec: 0.6, shin: 60 },
    tankG:   { c: [0.60, 0.62, 0.55], spec: 0.5, shin: 60 },
    batt:    { c: [0.20, 0.22, 0.26], spec: 0.2, shin: 20 },
    pcb:     { c: [0.10, 0.35, 0.28], spec: 0.3, shin: 30 },
    foot:    { c: [0.72, 0.44, 0.06], spec: 0.3, shin: 30 },
    frame:   { c: [0.22, 0.24, 0.27], spec: 0.3, shin: 30 },
    glass:   { c: [0.80, 0.86, 0.90], spec: 0.9, shin: 120, cut: true }
  };

  // ---------- the robot ----------
  var SEG = 64;
  var TIERS = [
    { name: "A", y0: 470, y1: 550, len: 70, slots: 12, r: 26 },
    { name: "B", y0: 550, y1: 670, len: 110, slots: 12, r: 26 },
    { name: "C", y0: 670, y1: 830, len: 150, slots: 10, r: 29 }
  ];
  var MAG_RIN = 82, MAG_ROUT = 165;

  function buildModel(opt) {
    var parts = []; // {tris, mat, group}
    var explode = opt.explode || 0;    // mm separation between tiers
    var push = opt.push || 0;          // 0..1 head ejection at hatch
    var hatchTier = 1;                  // tier B presents
    function P(tris, mat, group) { parts.push({ tris: tris, mat: mat, group: group }); }

    // ball
    P(lathe(sphereProfile(140, 140, 24), SEG, {}), M.ball, "ball");
    // skirt shell
    P(lathe([[130, 110], [176, 140], [205, 200], [212, 280], [205, 330], [190, 340]], SEG), M.shell, "shell");
    // mid body
    var mid = lathe([[190, 340], [200, 420], [205, 520], [203, 620], [195, 720], [182, 810], [167, 880]], SEG);
    mid = mid.filter(function (t) {
      var cx = (t[0][0] + t[1][0] + t[2][0]) / 3, cy = (t[0][1] + t[1][1] + t[2][1]) / 3, cz = (t[0][2] + t[1][2] + t[2][2]) / 3;
      var inDoor = cy > 462 && cy < 846 && cz > 0 && Math.abs(Math.atan2(cx, cz)) < 0.19;
      return !(inDoor && (opt.cut || push > 0));
    });
    P(mid, M.shell, "shell");
    // door frame (dark reveal) behind the opening
    if (opt.cut || push > 0) P(box(0, 462, 846, 186, 84, 6), M.frame, "shell");
    // turret
    P(lathe([[167, 880], [200, 893], [218, 905], [220, 920], [216, 932], [212, 934], [212, 944], [216, 946], [220, 955], [200, 972], [130, 980]], SEG), M.shell2, "shell");
    // head dome
    P(lathe([[130, 980], [130, 1035], [128, 1042]], SEG), M.shell, "shell");
    P(lathe([[128, 1042], [128, 1058]], SEG), M.ring, "shell");
    P(lathe([[128, 1058], [130, 1065], [129, 1095], [118, 1122], [92, 1142], [50, 1152], [0, 1152]], SEG), M.shell, "shell");
    // skirt lip rubber
    P(lathe([[128, 104], [134, 110]], SEG), M.dark, "shell");

    // ---- internals ----
    // mast
    P(lathe([[70, 340], [70, 1000]], 32), M.mast, "int");
    P(lathe([[74, 830], [74, 880]], 32), M.alu, "int");
    // battery annulus in skirt
    P(annulus(150, 196, 150, 320, 48), M.batt, "int");
    // omniwheels
    for (var w = 0; w < 3; w++) {
      var a = w * Math.PI * 2 / 3 + Math.PI / 6;
      var cen = rotY([0, 300, 0], 0);
      var dir = [Math.cos(a), 0, Math.sin(a)];
      var c0 = [dir[0] * 150, 235, dir[2] * 150];
      var tang = [-dir[2], 0, dir[0]];
      var p0 = add(c0, [tang[0] * -14, 0, tang[2] * -14]), p1 = add(c0, [tang[0] * 14, 0, tang[2] * 14]);
      P(cylinderAlong(p0, p1, 24, 20, true), M.dark, "int");
    }
    // tanks 350-460 : clean (front-left) / grey (front-right) as annular halves
    P(annulus(92, 168, 352, 458, 48), M.tank, "int");
    // divider plates
    P(box(0, 350, 460, 0, 336, 4), M.alu, "int");
    // magazine tiers
    var yoff = 0;
    for (var t = 0; t < TIERS.length; t++) {
      var T = TIERS[t];
      var y0 = T.y0 + yoff, y1 = T.y1 + yoff;
      // floor plate + hub + outer lip
      P(annulus(MAG_RIN, MAG_ROUT, y0, y0 + 6, 48), M.alu, "mag" + t);
      P(annulus(MAG_RIN, MAG_RIN + 10, y0, y1 - 8, 48), M.alu, "mag" + t);
      P(annulus(MAG_ROUT - 4, MAG_ROUT, y0, y0 + 12, 48), M.dark, "mag" + t);
      // ring gear teeth hint on the hub
      P(annulus(MAG_RIN + 10, MAG_RIN + 14, y0 + 8, y0 + 20, 48), M.dark, "mag" + t);
      // heads: vertical revolver pockets at radius 125, coupler up
      var RP = 125;
      for (var s = 0; s < T.slots; s++) {
        var ang = (s / T.slots) * Math.PI * 2 + Math.PI / 2; // slot 0 at the hatch (+z)
        var ux = Math.cos(ang), uz = Math.sin(ang);
        var isHatch = (t === hatchTier && s === 0);
        var rc = RP + (isHatch ? push * 125 : 0);
        var hx = ux * rc, hz = uz * rc;
        var yb = y0 + 8, yt = yb + T.len;
        var mat = (s % 4 === 0) ? M.headS : (s % 4 === 1) ? M.headY : (s % 4 === 2) ? M.head : M.headB;
        // pocket sleeve (stays in the drum)
        P(cylinderAlong([ux * RP, y0 + 6, uz * RP], [ux * RP, y0 + 6 + T.len * 0.8, uz * RP], T.r + 4, 24, true), M.dark, "mag" + t);
        // head body, then coupler collar on top
        P(cylinderAlong([hx, yb, hz], [hx, yt - 14, hz], T.r, 24, true), mat, "mag" + t);
        P(cylinderAlong([hx, yt - 14, hz], [hx, yt - 4, hz], 19, 16, true), M.coupler, "mag" + t);
        P(cylinderAlong([hx, yt - 4, hz], [hx, yt, hz], 21, 16, true), M.dark, "mag" + t);
        // radial keyway from pocket to the rim
        var k0 = [ux * (RP + T.r), y0 + 6, uz * (RP + T.r)], k1 = [ux * (MAG_ROUT - 2), y0 + 6, uz * (MAG_ROUT - 2)];
        P(cylinderAlong(k0, k1, 3, 6, false), M.dark, "mag" + t);
      }
      yoff += explode;
    }
    // hatch column (front, +z) : ejector rail + tambour door guide
    if (!explode) {
      P(box(0, 468, 836, 176, 26, 12), M.alu, "int");
      // UV-C strip on back column
      P(box(0, 480, 820, -172, 24, 6), M.ring, "int");
      // compute stack 835-878
      P(annulus(80, 160, 836, 878, 48), M.pcb, "int");
    }
    // feet (stowed) in skirt
    for (var f = 0; f < 3; f++) {
      var fa = f * Math.PI * 2 / 3 + Math.PI / 2;
      var fx = Math.cos(fa) * 186, fz = Math.sin(fa) * 186;
      P(cylinderAlong([fx, 160, fz], [fx, 300, fz], 9, 12, true), M.foot, "int");
    }
    return parts;
  }
  function sphereProfile(r, cy, n) {
    var p = [];
    for (var i = 0; i <= n; i++) { var a = -Math.PI / 2 + (i / n) * Math.PI; p.push([r * Math.cos(a), cy + r * Math.sin(a)]); }
    return p;
  }

  // ---------- renderer ----------
  var PRESETS = {
    exterior: { az: 0.55, el: 0.28, dist: 3400, target: [0, 600, 0], cut: false, explode: 0, push: 0, fov: 26 },
    cutaway:  { az: 0.30, el: 0.20, dist: 3100, target: [0, 600, 0], cut: true, explode: 0, push: 0, fov: 26 },
    magazine: { az: 0.35, el: 0.24, dist: 1750, target: [0, 650, 0], cut: true, explode: 0, push: 1, fov: 26 },
    exploded: { az: 0.35, el: 0.40, dist: 2100, target: [0, 760, 0], cut: true, explode: 90, push: 0, fov: 26 }
  };

  function Viewer(canvas, opts) {
    this.canvas = canvas; this.ctx = canvas.getContext("2d");
    this.state = Object.assign({}, PRESETS.exterior, PRESETS[opts.view] || {}, opts);
    this.state.target = (PRESETS[opts.view] || PRESETS.exterior).target.slice();
    this.theme = opts.theme || "light";
    this.rebuild();
    this.bind();
    this.resize();
  }
  Viewer.prototype.rebuild = function () {
    this.parts = buildModel({ explode: this.state.explode, push: this.state.push, cut: this.state.cut });
  };
  Viewer.prototype.setPreset = function (name) {
    var p = PRESETS[name]; if (!p) return;
    this.state = Object.assign({}, this.state, p); this.state.target = p.target.slice();
    this.rebuild(); this.draw();
  };
  Viewer.prototype.resize = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = this.canvas.clientWidth || 800, h = this.canvas.clientHeight || 600;
    this.canvas.width = Math.round(w * dpr); this.canvas.height = Math.round(h * dpr);
    this.dpr = dpr; this.draw();
  };
  Viewer.prototype.bind = function () {
    var self = this, drag = null;
    this.canvas.addEventListener("pointerdown", function (e) { drag = { x: e.clientX, y: e.clientY, az: self.state.az, el: self.state.el }; self.canvas.setPointerCapture(e.pointerId); });
    this.canvas.addEventListener("pointermove", function (e) {
      if (!drag) return;
      self.state.az = drag.az + (e.clientX - drag.x) * 0.008;
      self.state.el = Math.max(-0.2, Math.min(1.3, drag.el + (e.clientY - drag.y) * 0.006));
      self.draw();
    });
    this.canvas.addEventListener("pointerup", function () { drag = null; });
    this.canvas.addEventListener("wheel", function (e) { e.preventDefault(); self.state.dist = Math.max(700, Math.min(6000, self.state.dist * (e.deltaY > 0 ? 1.1 : 0.9))); self.draw(); }, { passive: false });
    window.addEventListener("resize", function () { self.resize(); });
  };
  Viewer.prototype.draw = function () {
    var ctx = this.ctx, W = this.canvas.width, H = this.canvas.height, st = this.state;
    var dark = this.theme === "dark";
    // background
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    var bg = ctx.createLinearGradient(0, 0, 0, H);
    if (dark) { bg.addColorStop(0, "#1e252c"); bg.addColorStop(1, "#12171c"); } else { bg.addColorStop(0, "#f7f8f5"); bg.addColorStop(1, "#e3e6e0"); }
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // camera
    var ce = Math.cos(st.el), se = Math.sin(st.el), ca = Math.cos(st.az), sa = Math.sin(st.az);
    var eye = [st.target[0] + st.dist * ce * sa, st.target[1] + st.dist * se, st.target[2] + st.dist * ce * ca];
    var fwd = norm(sub(st.target, eye)); var right = norm(cross(fwd, [0, 1, 0])); var up = cross(right, fwd);
    var f = 1 / Math.tan((st.fov * Math.PI / 180) / 2);
    var aspect = W / H;
    function proj(p) {
      var d = sub(p, eye); var x = dot(d, right), y = dot(d, up), z = dot(d, fwd);
      return [W / 2 + (x / z) * f / aspect * (W / 2), H / 2 - (y / z) * f * (H / 2), z];
    }
    // lights
    var L1 = norm([0.45, 0.85, 0.55]), L2 = norm([-0.7, 0.25, -0.4]);
    var view = norm(sub(eye, [0, 0, 0]));

    // ground shadow
    var g = proj([0, 0, 0]);
    var rr = (280 * f) / (st.dist) * (W / 2) / aspect;
    ctx.save(); ctx.translate(g[0], g[1]); ctx.scale(1, Math.max(0.15, se * 0.9));
    var sh = ctx.createRadialGradient(0, 0, 0, 0, 0, rr);
    sh.addColorStop(0, dark ? "rgba(0,0,0,0.55)" : "rgba(30,40,50,0.35)"); sh.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI * 2); ctx.fill(); ctx.restore();

    // collect triangles
    var list = [];
    var cutAng = st.az + 1.0; // removed half lies right-of-front as seen from the camera
    var cutAxis = [Math.sin(cutAng), 0, Math.cos(cutAng)];
    for (var pi = 0; pi < this.parts.length; pi++) {
      var part = this.parts[pi], mat = part.mat;
      var isShell = part.group === "shell";
      for (var ti = 0; ti < part.tris.length; ti++) {
        var t = part.tris[ti];
        var cx = (t[0][0] + t[1][0] + t[2][0]) / 3, cy = (t[0][1] + t[1][1] + t[2][1]) / 3, cz = (t[0][2] + t[1][2] + t[2][2]) / 3;
        if (st.cut && mat.cut) {
          // remove the half of the shell facing the camera-right side: keep triangles whose centroid lies behind the cut plane through the axis
          var sdist = cx * cutAxis[0] + cz * cutAxis[2];
          if (sdist > 0) continue;
        }
        if (!st.cut && !isShell && part.group !== "ball") continue; // internals hidden when the shell is intact
        var n = norm(cross(sub(t[1], t[0]), sub(t[2], t[0])));
        var toEye = norm(sub(eye, [cx, cy, cz]));
        var facing = dot(n, toEye);
        if (facing < 0) {
          if (!(st.cut && mat.cut)) continue; // back-face cull closed parts
          n = [-n[0], -n[1], -n[2]]; // shell interior: flip normal, render darker
        }
        var p0 = proj(t[0]), p1 = proj(t[1]), p2 = proj(t[2]);
        if (p0[2] <= 1 || p1[2] <= 1 || p2[2] <= 1) continue;
        var depth = (p0[2] + p1[2] + p2[2]) / 3;
        // shading
        var diff = Math.max(0, dot(n, L1)) * 0.85 + Math.max(0, dot(n, L2)) * 0.35;
        var h1 = norm(add(L1, toEye)); var spec = Math.pow(Math.max(0, dot(n, h1)), mat.shin) * mat.spec;
        var amb = dark ? 0.30 : 0.42;
        var k = (amb + diff * 0.62) * (0.78 + 0.22 * Math.abs(facing));
        if (facing < 0) k *= 0.7;
        var c = mat.c;
        var rgb = [Math.min(1, c[0] * k + spec + (mat.emit || 0)), Math.min(1, c[1] * k + spec + (mat.emit || 0)), Math.min(1, c[2] * k + spec + (mat.emit || 0))];
        list.push({ d: depth, p: [p0, p1, p2], col: "rgb(" + (rgb[0] * 255 | 0) + "," + (rgb[1] * 255 | 0) + "," + (rgb[2] * 255 | 0) + ")" });
      }
    }
    list.sort(function (a, b) { return b.d - a.d; });
    ctx.lineJoin = "round"; ctx.lineWidth = 0.7;
    for (var i = 0; i < list.length; i++) {
      var q = list[i];
      ctx.fillStyle = q.col; ctx.strokeStyle = q.col;
      ctx.beginPath(); ctx.moveTo(q.p[0][0], q.p[0][1]); ctx.lineTo(q.p[1][0], q.p[1][1]); ctx.lineTo(q.p[2][0], q.p[2][1]); ctx.closePath();
      ctx.fill(); ctx.stroke();
    }
    // scale bar (500 mm at the target depth)
    var s0 = proj([st.target[0] - 250, 0, st.target[2]]), s1 = proj([st.target[0] + 250, 0, st.target[2]]);
    var px = Math.hypot(s1[0] - s0[0], s1[1] - s0[1]);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.strokeStyle = dark ? "#98A2AB" : "#6B7680"; ctx.fillStyle = ctx.strokeStyle; ctx.lineWidth = 1.5 * this.dpr;
    var bx = 24 * this.dpr, by = H - 28 * this.dpr;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + px, by); ctx.moveTo(bx, by - 5 * this.dpr); ctx.lineTo(bx, by + 5 * this.dpr); ctx.moveTo(bx + px, by - 5 * this.dpr); ctx.lineTo(bx + px, by + 5 * this.dpr); ctx.stroke();
    ctx.font = (11 * this.dpr) + "px 'IBM Plex Mono', ui-monospace, monospace";
    ctx.fillText("500 mm", bx, by - 9 * this.dpr);
  };

  window.GyroViewer = {
    mount: function (canvas, opts) { return new Viewer(canvas, opts || {}); },
    presets: Object.keys(PRESETS)
  };
})();
