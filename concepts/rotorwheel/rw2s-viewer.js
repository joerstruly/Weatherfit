// RW-2S two-seat rotorwheel — interactive 3D concept model (three.js r128).
// Modes: drive / hover / cruise. Drag to orbit, wheel to zoom.
(function () {
  var host = document.getElementById('v3d');
  if (!host) return;
  if (!window.THREE) { host.textContent = '3D library did not load.'; return; }
  var T = window.THREE;

  var W = host.clientWidth || 900, H = Math.round(W * 0.58);
  var renderer = new T.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.outputEncoding = T.sRGBEncoding;
  host.appendChild(renderer.domElement);

  var scene = new T.Scene();
  scene.background = new T.Color(0xd6dccf);
  scene.fog = new T.Fog(0xd6dccf, 30, 70);

  var camera = new T.PerspectiveCamera(36, W / H, 0.1, 200);

  scene.add(new T.HemisphereLight(0xeaf0f6, 0x6e6a58, 0.85));
  var sun = new T.DirectionalLight(0xfff3df, 1.15);
  sun.position.set(7, 11, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -9; sun.shadow.camera.right = 9;
  sun.shadow.camera.top = 9; sun.shadow.camera.bottom = -9;
  sun.shadow.bias = -0.0006;
  scene.add(sun);

  var ground = new T.Mesh(new T.PlaneGeometry(90, 90), new T.MeshStandardMaterial({ color: 0xb4ab8f, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  var grid = new T.GridHelper(40, 40, 0x8f886f, 0xa49d85); grid.position.y = 0.004; scene.add(grid);

  var hullMat = new T.MeshStandardMaterial({ color: 0x55613f, roughness: 0.6, metalness: 0.08, side: T.DoubleSide });
  var darkMat = new T.MeshStandardMaterial({ color: 0x23261f, roughness: 0.9 });
  var tireMat = new T.MeshStandardMaterial({ color: 0x1c1e1a, roughness: 0.95 });
  var rimMat = new T.MeshStandardMaterial({ color: 0x9a9e95, roughness: 0.35, metalness: 0.75, side: T.DoubleSide });
  var orange = new T.MeshStandardMaterial({ color: 0xe8571f, roughness: 0.5 });
  var glass = new T.MeshPhysicalMaterial({ color: 0x9dc0d8, transparent: true, opacity: 0.45, roughness: 0.08, metalness: 0, side: T.DoubleSide });
  var suitMat = new T.MeshStandardMaterial({ color: 0x3a3d33, roughness: 0.9 });

  // ---- hull: delta lifting body, lofted from a cambered thick section ----
  var L = 4.6, HW = 0.75, SWEEP = 1.2;
  function section(t, c) {           // t = chord fraction, c = local chord; returns [upper, lower]
    var x = t;
    var th = 5 * 0.16 * (0.2969 * Math.sqrt(x) - 0.1260 * x - 0.3516 * x * x + 0.2843 * x * x * x - 0.1015 * x * x * x * x);
    var cam = 0.04 * 4 * x * (1 - x);
    return [(cam + th) * c, (cam - th * 0.5) * c];
  }
  function chordAt(a) { var le = SWEEP * Math.pow(a, 1.15); var te = L - 0.25 * a * a; return [le, Math.max(te - le, 0.05)]; }
  var NS = 56, NC = 44, pos = [], idx = [], row = 2 * NC + 1;
  for (var i = 0; i <= NS; i++) {
    var s = -1 + 2 * i / NS, a = Math.abs(s), lc = chordAt(a), le = lc[0], c = lc[1];
    var tip = 1 - 0.88 * Math.pow(a, 7);
    for (var j = 0; j <= 2 * NC; j++) {
      var t, up; if (j <= NC) { t = j / NC; up = true; } else { t = 1 - (j - NC) / NC; up = false; }
      var tt = 0.5 - 0.5 * Math.cos(Math.PI * t);
      var yy = section(tt, c); var y = (up ? yy[0] : yy[1]) * tip;
      pos.push(le + tt * c, y, s * HW);
    }
  }
  for (var i2 = 0; i2 < NS; i2++) for (var j2 = 0; j2 < 2 * NC; j2++) {
    var p = i2 * row + j2, q = p + row; idx.push(p, q, p + 1, p + 1, q, q + 1);
  }
  var hg = new T.BufferGeometry();
  hg.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
  hg.setIndex(idx); hg.computeVertexNormals();
  var nAttr = hg.getAttribute('normal'), midTop = ((NS / 2) | 0) * row + ((NC / 2) | 0);
  if (nAttr.getY(midTop) < 0) { hg.setIndex(idx.slice().reverse()); hg.computeVertexNormals(); }
  hg.computeBoundingBox();
  var belly = hg.boundingBox.min.y;

  var vehicle = new T.Group(); scene.add(vehicle);
  var body = new T.Group(); vehicle.add(body);   // body: pitched for AoA
  var hull = new T.Mesh(hg, hullMat); hull.castShadow = true; hull.receiveShadow = true; body.add(hull);
  function topAt(x, z) { var a = Math.abs(z) / HW, lc = chordAt(a); var t = (x - lc[0]) / lc[1]; if (t < 0 || t > 1) return 0; return section(t, lc[1])[0] * (1 - 0.88 * Math.pow(a, 7)); }

  // canopy + crew
  var canX = 2.3, canTop = topAt(canX, 0);
  var canopy = new T.Mesh(new T.SphereGeometry(1, 40, 24), glass);
  canopy.scale.set(0.66, 0.44, 0.58); canopy.position.set(canX, canTop - 0.02, 0); body.add(canopy);
  [-0.28, 0.28].forEach(function (z) {
    var helmet = new T.Mesh(new T.SphereGeometry(0.15, 20, 14), new T.MeshStandardMaterial({ color: 0x5b6150, roughness: 0.6 }));
    helmet.position.set(canX - 0.05, canTop + 0.16, z); body.add(helmet);
    var torso = new T.Mesh(new T.BoxGeometry(0.34, 0.42, 0.36), suitMat);
    torso.position.set(canX + 0.05, canTop - 0.16, z); body.add(torso);
  });
  // mast / sensor
  var sensor = new T.Mesh(new T.SphereGeometry(0.09, 16, 12), darkMat); sensor.position.set(0.32, topAt(0.32, 0) + 0.02, 0); body.add(sensor);

  // ---- embedded lift fans with inlet doors ----
  var doors = [];
  function liftFan(x) {
    var r = 0.85, y = topAt(x, 0);
    var ring = new T.Mesh(new T.TorusGeometry(r, 0.045, 10, 64), rimMat);
    ring.rotation.x = Math.PI / 2; ring.position.set(x, y + 0.015, 0); body.add(ring);
    var disc = new T.Mesh(new T.CircleGeometry(r - 0.02, 48), darkMat);
    disc.rotation.x = -Math.PI / 2; disc.position.set(x, y - 0.06, 0); body.add(disc);
    var fan = new T.Group(); fan.position.set(x, y - 0.03, 0); body.add(fan);
    for (var k = 0; k < 7; k++) {
      var b = new T.Mesh(new T.BoxGeometry(0.72, 0.02, 0.11), orange);
      b.position.x = 0.42; var g = new T.Group(); g.rotation.y = k * 2 * Math.PI / 7; g.add(b); fan.add(g);
    }
    var hub = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.1, 20), rimMat); hub.position.set(x, y - 0.02, 0); body.add(hub);
    // louvered inlet: 7 slats hinged on lateral axes, closed flush in drive mode
    var NSL = 7, slatW = 2 * r / NSL;
    for (var si = 0; si < NSL; si++) {
      var hinge = new T.Group(); hinge.position.set(x - r + slatW * (si + 0.5), y + 0.03, 0); body.add(hinge);
      var half = Math.sqrt(Math.max(r * r - Math.pow(x - hinge.position.x, 2), 0.05));
      var slat = new T.Mesh(new T.BoxGeometry(slatW * 0.95, 0.02, 2 * half), hullMat); slat.castShadow = true;
      hinge.add(slat);
      doors.push({ g: hinge, sd: 1 });
    }
    return fan;
  }
  var fans = [];   // Rev D: no hull fans — the four rotor-wheels carry all the lift
  // exhaust stub
  var exh = new T.Mesh(new T.CylinderGeometry(0.11, 0.13, 0.3, 16), darkMat); exh.rotation.z = Math.PI / 2; exh.position.set(L + 0.1, topAt(L - 0.15, 0) * 0.45 + 0.05, 0); body.add(exh);
  var exh2 = exh.clone(); exh2.position.z = 0.3; body.add(exh2); exh.position.z = -0.3;

  // ---- rotor-wheels: flip (about fore-aft axis) then pitch (about lateral axis) ----
  var wheels = [];
  function wheelModule(xw, side, rear) {
    var zp = side * (HW + 0.05), yp = 0.30;      // identical outrigger pivots front and rear
    var br = new T.Mesh(new T.BoxGeometry(0.22, 0.16, 0.5), hullMat); br.castShadow = true; br.position.set(xw, 0.24, side * 0.58); body.add(br);
    var flip = new T.Group(); flip.position.set(xw, yp, zp); body.add(flip);
    var wc = new T.Vector3(0, (belly + 0.25) - yp, side * (HW + 0.24) - zp);   // axle 0.70 m above ground = belly + 0.25 in body coords
    var len = wc.length();
    var arm = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, len, 12), rimMat);
    arm.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), wc.clone().normalize());
    arm.position.copy(wc).multiplyScalar(0.5); arm.castShadow = true; flip.add(arm);
    var pitch = new T.Group(); pitch.position.copy(wc); flip.add(pitch);
    var tire = new T.Mesh(new T.TorusGeometry(0.6, 0.1, 18, 56), tireMat); tire.castShadow = true; pitch.add(tire);
    var rim = new T.Mesh(new T.CylinderGeometry(0.55, 0.55, 0.3, 56, 1, true), rimMat); rim.rotation.x = Math.PI / 2; pitch.add(rim);
    var duct = new T.Mesh(new T.CylinderGeometry(0.53, 0.53, 0.26, 56, 1, true), darkMat); duct.rotation.x = Math.PI / 2; pitch.add(duct);
    var hub = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.3, 20), rimMat); hub.rotation.x = Math.PI / 2; pitch.add(hub);
    var stages = [];
    [-0.075, 0.075].forEach(function (dz, si) {
      var st = new T.Group(); st.position.z = dz; pitch.add(st);
      for (var k = 0; k < 7; k++) {
        var b = new T.Mesh(new T.BoxGeometry(0.42, 0.15, 0.02), orange); b.position.x = 0.31;
        var g = new T.Group(); g.rotation.z = k * 2 * Math.PI / 7 + si * 0.45; g.add(b); st.add(g);
      }
      stages.push({ g: st, dir: si ? -1 : 1 });
    });
    wheels.push({ flip: flip, pitch: pitch, side: side, stages: stages, hub: hub });
  }
  [1.1, 3.9].forEach(function (xw) { wheelModule(xw, -1, false); wheelModule(xw, 1, false); });

  body.position.y = -belly + 0.45;   // belly 0.45 m above ground in drive mode

  // ---- modes ----
  var modes = {
    drive:  { lift: 0.0, aoa: 0, flip: 0, pitch: 0, doors: 0, spin: 0 },
    hover:  { lift: 1.4, aoa: 0, flip: 95, pitch: 0, doors: 1, spin: 1 },
    cruise: { lift: 2.0, aoa: 4, flip: 95, pitch: 22, doors: 1, spin: 1 }   // Rev E: hull level-to-nose-up so the body lifts; discs only ~22° forward
  };
  var cur = { lift: 2.0, aoa: 4, flip: 95, pitch: 22, doors: 1, spin: 1 }, target = modes.cruise;
  function setMode(name) {
    target = modes[name];
    var bs = host.parentNode.querySelectorAll('[data-mode]');
    for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', bs[i].getAttribute('data-mode') === name ? 'true' : 'false');
  }
  var btns = host.parentNode.querySelectorAll('[data-mode]');
  for (var bi = 0; bi < btns.length; bi++) btns[bi].addEventListener('click', function (e) { setMode(e.currentTarget.getAttribute('data-mode')); });
  setMode('cruise');

  // ---- orbit ----
  var theta = -0.9, phi = 1.05, dist = 12.0, tgt = new T.Vector3(L * 0.5, 1.7, 0), drag = null;
  function updateCam() {
    camera.position.set(tgt.x + dist * Math.sin(phi) * Math.cos(theta), tgt.y + dist * Math.cos(phi), tgt.z + dist * Math.sin(phi) * Math.sin(theta));
    camera.lookAt(tgt);
  }
  var el = renderer.domElement;
  el.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, y: e.clientY }; el.setPointerCapture(e.pointerId); });
  el.addEventListener('pointermove', function (e) { if (!drag) return; theta -= (e.clientX - drag.x) * 0.007; phi = Math.max(0.25, Math.min(1.5, phi - (e.clientY - drag.y) * 0.005)); drag = { x: e.clientX, y: e.clientY }; });
  el.addEventListener('pointerup', function () { drag = null; });
  el.addEventListener('wheel', function (e) { e.preventDefault(); dist = Math.max(6, Math.min(30, dist * (1 + e.deltaY * 0.001))); }, { passive: false });
  el.style.cursor = 'grab'; el.style.touchAction = 'none';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var d2r = Math.PI / 180, spinA = 0;
  function frame() {
    var k = reduce ? 1 : 0.06;
    for (var key in cur) cur[key] += (target[key] - cur[key]) * k;
    vehicle.position.y = cur.lift;
    body.rotation.z = -cur.aoa * d2r;          // nose-up: nose is at x=0, tail at +x
    for (var i = 0; i < wheels.length; i++) {
      var w = wheels[i];
      w.flip.rotation.x = -w.side * cur.flip * d2r;
      w.pitch.rotation.y = -w.side * cur.pitch * d2r;
      for (var s = 0; s < w.stages.length; s++) w.stages[s].g.rotation.z = w.stages[s].dir * spinA;
    }
    for (var d = 0; d < doors.length; d++) doors[d].g.rotation.z = cur.doors * 62 * d2r;
    for (var f = 0; f < fans.length; f++) fans[f].rotation.y = spinA * 0.7;
    spinA += cur.spin * 0.35;
    updateCam();
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  window.addEventListener('resize', function () { var w2 = host.clientWidth; if (!w2) return; var h2 = Math.round(w2 * 0.58); renderer.setSize(w2, h2); camera.aspect = w2 / h2; camera.updateProjectionMatrix(); });
  frame();
})();
