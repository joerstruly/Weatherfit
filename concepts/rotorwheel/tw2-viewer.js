// TW-2 FERRET — interactive concept model (three.js r128).
// Scrub the four-beat transformation, or jump to drive / flight / cruise.
(function () {
  var host = document.getElementById('v3d');
  if (!host) return;
  if (!window.THREE) { host.textContent = '3D library did not load.'; return; }
  var T = window.THREE, IN = 0.0254;

  var W = host.clientWidth || 900, H = Math.round(W * 0.56);
  var renderer = new T.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.outputEncoding = T.sRGBEncoding;
  host.appendChild(renderer.domElement);

  var scene = new T.Scene();
  scene.background = new T.Color(0xd6dccf);
  scene.fog = new T.Fog(0xd6dccf, 36, 90);
  var camera = new T.PerspectiveCamera(34, W / H, 0.1, 300);

  scene.add(new T.HemisphereLight(0xeaf0f6, 0x6e6a58, 0.9));
  var sun = new T.DirectionalLight(0xfff3df, 1.1);
  sun.position.set(9, 14, 7); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -11; sun.shadow.camera.right = 11;
  sun.shadow.camera.top = 11; sun.shadow.camera.bottom = -11;
  sun.shadow.bias = -0.0006;
  scene.add(sun);

  var ground = new T.Mesh(new T.PlaneGeometry(120, 120), new T.MeshStandardMaterial({ color: 0xb4ab8f, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  var grid = new T.GridHelper(60, 60, 0x8f886f, 0xa49d85); grid.position.y = 0.004; scene.add(grid);

  var hullMat   = new T.MeshStandardMaterial({ color: 0x59634a, roughness: 0.75, metalness: 0.05, side: T.DoubleSide });
  var alloyMat  = new T.MeshStandardMaterial({ color: 0x9fa49a, roughness: 0.42, metalness: 0.7 });
  var tireMat   = new T.MeshStandardMaterial({ color: 0x191b17, roughness: 0.97 });
  var darkMat   = new T.MeshStandardMaterial({ color: 0x23261f, roughness: 0.9 });
  var orangeMat = new T.MeshStandardMaterial({ color: 0xe8571f, roughness: 0.5 });
  var hotMat    = new T.MeshStandardMaterial({ color: 0x8a5445, roughness: 0.7, emissive: 0x2a0d04 });
  var tiMat     = new T.MeshStandardMaterial({ color: 0xbfc3c6, roughness: 0.3, metalness: 0.85 });
  var glassMat  = new T.MeshPhysicalMaterial({ color: 0x9dc0d8, transparent: true, opacity: 0.42, roughness: 0.08, side: T.DoubleSide });
  var suitMat   = new T.MeshStandardMaterial({ color: 0x3a3d33, roughness: 0.9 });

  // ---------- dimensions ----------
  var L = 198 * IN, HW = 30 * IN, BODY_H = 42 * IN, CLEAR = 16 * IN;
  var WB = 120 * IN, HALF_TRACK = 46 * IN, SLIDE = 22 * IN;
  var R_TIRE = 30 * IN, R_FAN = 26 * IN, TIRE_W = 16 * IN;
  var AXLE_Y = R_TIRE;

  var vehicle = new T.Group(); scene.add(vehicle);
  var body = new T.Group(); vehicle.add(body);

  // ---------- hull ----------
  function hullProfile(t) {          // t: 0 nose -> 1 tail; returns [halfWidth, topY, botY]
    var grow = Math.pow(Math.min(t / 0.34, 1), 0.55);          // prow opens quickly
    var taper = t > 0.90 ? 1 - 0.75 * Math.pow((t - 0.90) / 0.10, 1.6) : 1;
    var w = HW * Math.max(grow * taper, 0.004);
    var hgt = BODY_H * Math.max(Math.pow(Math.min(t / 0.30, 1), 0.5) * taper, 0.004);
    var bot = CLEAR + BODY_H * 0.05 * Math.sin(t * Math.PI);
    return [w, bot + hgt, bot];
  }
  (function buildHull() {
    var NS = 48, NR = 14, pos = [], idx = [], row = 2 * NR;
    for (var i = 0; i <= NS; i++) {
      var t = i / NS, p = hullProfile(t), w = p[0], top = p[1], bot = p[2];
      var cy = (top + bot) / 2, ry = (top - bot) / 2;
      for (var j = 0; j < 2 * NR; j++) {
        var a = (j / (2 * NR)) * Math.PI * 2, n = 2.6;          // superellipse: vehicle-like section
        var ca = Math.cos(a), sa = Math.sin(a);
        var sx = Math.sign(ca) * Math.pow(Math.abs(ca), 2 / n);
        var sy = Math.sign(sa) * Math.pow(Math.abs(sa), 2 / n);
        pos.push(t * L, cy + ry * sy, w * sx);
      }
    }
    for (var i2 = 0; i2 < NS; i2++) for (var j2 = 0; j2 < row; j2++) {
      var p0 = i2 * row + j2, p1 = i2 * row + (j2 + 1) % row;
      var q0 = p0 + row, q1 = p1 + row;
      idx.push(p0, q0, p1, p1, q0, q1);
    }
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    g.setIndex(idx); g.computeVertexNormals();
    var m = new T.Mesh(g, hullMat); m.castShadow = true; m.receiveShadow = true; body.add(m);
  })();

  // shoulder line = slide-rail housing
  [-1, 1].forEach(function (s) {
    var rail = new T.Mesh(new T.BoxGeometry(L * 0.62, 5 * IN, 4 * IN), alloyMat);
    rail.castShadow = true;
    rail.position.set(L * 0.5, CLEAR + BODY_H * 0.72, s * (HW * 0.93));
    body.add(rail);
    var stripe = new T.Mesh(new T.BoxGeometry(L * 0.62, 1.4 * IN, 0.8 * IN), orangeMat);
    stripe.position.set(L * 0.5, CLEAR + BODY_H * 0.72, s * (HW * 0.93 + 2.1 * IN));
    body.add(stripe);
    // flank reaction channel
    var ch = new T.Mesh(new T.BoxGeometry(L * 0.3, 10 * IN, 3 * IN), darkMat);
    ch.position.set(L * 0.5, CLEAR + BODY_H * 0.22, s * (HW * 0.86));
    body.add(ch);
  });

  // canopy + crew
  var canX = L * 0.44, canTop = hullProfile(0.44)[1];
  var can = new T.Mesh(new T.SphereGeometry(1, 36, 22), glassMat);
  can.scale.set(30 * IN, 15 * IN, 26 * IN);
  can.position.set(canX, canTop - 2 * IN, 0); body.add(can);
  [-14 * IN, 14 * IN].forEach(function (z) {
    var hl = new T.Mesh(new T.SphereGeometry(5 * IN, 18, 12), new T.MeshStandardMaterial({ color: 0x5b6150, roughness: 0.6 }));
    hl.position.set(canX - 2 * IN, canTop + 2 * IN, z); body.add(hl);
    var to = new T.Mesh(new T.BoxGeometry(13 * IN, 15 * IN, 13 * IN), suitMat);
    to.position.set(canX + 4 * IN, canTop - 9 * IN, z); body.add(to);
  });
  var sensor = new T.Mesh(new T.SphereGeometry(3.5 * IN, 14, 10), darkMat);
  sensor.position.set(6 * IN, CLEAR + BODY_H * 0.35, 0); body.add(sensor);

  // ---------- turbine-wheel module ----------
  var mods = [];
  function buildModule(xw, side) {
    var slide = new T.Group();                       // translates outboard
    slide.position.set(xw, AXLE_Y, side * HALF_TRACK);
    body.add(slide);
    var roll = new T.Group(); slide.add(roll);       // rotates about fore-aft axis
    var pitchG = new T.Group(); roll.add(pitchG);    // cruise tilt

    var ax = -side;                                  // fan axis: inboard
    var tire = new T.Mesh(new T.TorusGeometry(R_TIRE - 2.6 * IN, 2.6 * IN, 16, 56), tireMat);
    tire.castShadow = true; pitchG.add(tire);
    var rim = new T.Mesh(new T.CylinderGeometry(R_FAN + 1.6 * IN, R_FAN + 1.6 * IN, TIRE_W, 56, 1, true), alloyMat);
    rim.rotation.x = Math.PI / 2; pitchG.add(rim);
    var duct = new T.Mesh(new T.CylinderGeometry(R_FAN, R_FAN, TIRE_W * 0.9, 56, 1, true), new T.MeshStandardMaterial({ color: 0x23261f, roughness: 0.9, side: T.DoubleSide }));
    duct.rotation.x = Math.PI / 2; pitchG.add(duct);

    var fan = new T.Group(); fan.position.z = ax * 2 * IN; pitchG.add(fan);
    for (var k = 0; k < 12; k++) {
      var b = new T.Mesh(new T.BoxGeometry(R_FAN * 0.80, 6 * IN, 1.4 * IN), orangeMat);
      b.position.x = R_FAN * 0.58;
      var g = new T.Group(); g.rotation.z = k * Math.PI / 6; g.add(b); fan.add(g);
    }
    var hub = new T.Mesh(new T.CylinderGeometry(7 * IN, 7 * IN, TIRE_W, 20), alloyMat);
    hub.rotation.x = Math.PI / 2; pitchG.add(hub);

    // core protruding outboard, behind a titanium spinner
    var core = new T.Mesh(new T.CylinderGeometry(6.5 * IN, 7.5 * IN, 14 * IN, 22), hotMat);
    core.rotation.x = Math.PI / 2; core.position.z = -ax * 13 * IN; pitchG.add(core);
    var spin = new T.Mesh(new T.ConeGeometry(6.8 * IN, 5.5 * IN, 24), tiMat);
    spin.rotation.x = -ax * Math.PI / 2; spin.position.z = -ax * 22 * IN; pitchG.add(spin);
    // exhaust, inboard
    var exh = new T.Mesh(new T.CylinderGeometry(3.4 * IN, 4.4 * IN, 7 * IN, 16), darkMat);
    exh.rotation.x = Math.PI / 2; exh.position.z = ax * 11 * IN; pitchG.add(exh);

    mods.push({ slide: slide, roll: roll, pitch: pitchG, fan: fan, side: side, xw: xw });
  }
  [[0, 1], [0, -1], [WB, 1], [WB, -1]].forEach(function (m) {
    buildModule(L * 0.20 + m[0], m[1]);
  });

  // ---------- choreography ----------
  function lerp(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }
  function seg(p, a, b) { return Math.max(0, Math.min(1, (p - a) / (b - a))); }
  // p: 0 = standing/spooled, 1 = airborne.  cruise: extra forward tilt
  function pose(p, cruise) {
    var rollDeg = lerp(0, 38, seg(p, 0.14, 0.50)) + lerp(0, 57, seg(p, 0.72, 1.0));
    var slideM  = SLIDE * seg(p, 0.50, 0.72);
    var lift    = lerp(0, 1.5, seg(p, 0.90, 1.0));
    var spin    = p > 0.02 ? 1 : 0;
    var pitchDeg = cruise * 20 * seg(p, 0.95, 1.0);
    var aoa = cruise * 3 * seg(p, 0.95, 1.0);
    return { roll: rollDeg, slide: slideM, lift: lift, spin: spin, pitch: pitchDeg, aoa: aoa };
  }

  var target = { p: 1, cruise: 1 }, cur = { p: 1, cruise: 1 }, spinA = 0;
  var D2R = Math.PI / 180;
  function apply(st) {
    vehicle.position.y = st.lift;
    body.rotation.z = -st.aoa * D2R;
    for (var i = 0; i < mods.length; i++) {
      var m = mods[i];
      m.slide.position.z = m.side * (HALF_TRACK + st.slide);
      m.roll.rotation.x = -m.side * st.roll * D2R;
      m.pitch.rotation.y = -m.side * st.pitch * D2R;
      m.fan.rotation.z = (i % 2 ? -1 : 1) * spinA;
    }
    spinA += st.spin * 0.45;
  }

  // ---------- UI ----------
  var panel = host.parentNode;
  var slider = panel.querySelector('[data-scrub]');
  var btns = panel.querySelectorAll('[data-mode]');
  var beatOut = panel.querySelector('[data-beat]');
  var BEATS = [[0, '01 · SPOOL — cores running, wheels vertical, thrust turned aft'],
               [0.14, '02 · ROLL-IN — tops tip inboard, thrust swings down'],
               [0.50, '03 · SLIDE-OUT — modules translate outboard, track widens'],
               [0.72, '04 · ROLL-OUT — discs go flat, the vehicle lifts'],
               [1.0, 'CRUISE — discs pitched forward, hull level']];
  function beatLabel(p, cruise) {
    if (cruise && p > 0.99) return BEATS[4][1];
    for (var i = BEATS.length - 2; i >= 0; i--) if (p >= BEATS[i][0]) return BEATS[i][1];
    return BEATS[0][1];
  }
  function setMode(name) {
    if (name === 'drive')  { target.p = 0; target.cruise = 0; }
    if (name === 'flight') { target.p = 1; target.cruise = 0; }
    if (name === 'cruise') { target.p = 1; target.cruise = 1; }
    for (var i = 0; i < btns.length; i++)
      btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-mode') === name ? 'true' : 'false');
  }
  for (var bi = 0; bi < btns.length; bi++)
    btns[bi].addEventListener('click', function (e) { setMode(e.currentTarget.getAttribute('data-mode')); });
  if (slider) slider.addEventListener('input', function () {
    target.p = cur.p = parseFloat(slider.value) / 100; target.cruise = 0;
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', 'false');
  });
  setMode('cruise');

  // ---------- orbit ----------
  var theta = -0.9, phi = 1.06, dist = 11.5, tgt = new T.Vector3(L * 0.52, 1.3, 0), drag = null;
  function updateCam() {
    camera.position.set(tgt.x + dist * Math.sin(phi) * Math.cos(theta),
                        tgt.y + dist * Math.cos(phi),
                        tgt.z + dist * Math.sin(phi) * Math.sin(theta));
    camera.lookAt(tgt);
  }
  var el = renderer.domElement;
  el.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, y: e.clientY }; el.setPointerCapture(e.pointerId); });
  el.addEventListener('pointermove', function (e) {
    if (!drag) return;
    theta -= (e.clientX - drag.x) * 0.007;
    phi = Math.max(0.18, Math.min(1.5, phi - (e.clientY - drag.y) * 0.005));
    drag = { x: e.clientX, y: e.clientY };
  });
  el.addEventListener('pointerup', function () { drag = null; });
  el.addEventListener('wheel', function (e) { e.preventDefault(); dist = Math.max(7, Math.min(40, dist * (1 + e.deltaY * 0.001))); }, { passive: false });
  el.style.cursor = 'grab'; el.style.touchAction = 'none';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function frame() {
    var k = reduce ? 1 : 0.055;
    cur.p += (target.p - cur.p) * k;
    cur.cruise += (target.cruise - cur.cruise) * k;
    apply(pose(cur.p, cur.cruise));
    if (slider && !drag) slider.value = Math.round(cur.p * 100);
    if (beatOut) beatOut.textContent = beatLabel(cur.p, cur.cruise > 0.5);
    updateCam();
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  window.addEventListener('resize', function () {
    var w2 = host.clientWidth; if (!w2) return;
    var h2 = Math.round(w2 * 0.56);
    renderer.setSize(w2, h2); camera.aspect = w2 / h2; camera.updateProjectionMatrix();
  });
  frame();
})();
