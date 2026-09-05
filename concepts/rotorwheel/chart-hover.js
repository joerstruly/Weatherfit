
/* power-curve hover readout */
(function () {
  var svg = document.getElementById('pwr'); if (!svg) return;
  var D = __CHARTDATA__;
  var hit = document.getElementById('pwr-hit'), grp = document.getElementById('pwr-hover');
  var cross = document.getElementById('pwr-cross'), d1 = document.getElementById('pwr-d1'), d2 = document.getElementById('pwr-d2');
  var bg = document.getElementById('pwr-tipbg'), t0 = document.getElementById('pwr-t0'), t1 = document.getElementById('pwr-t1'), t2 = document.getElementById('pwr-t2');
  if (!hit || !grp) return;
  function px(k) { return D.x0 + (k / D.xmax) * (D.x1 - D.x0); }
  function py(w) { return D.y1 - (w / D.ymax) * (D.y1 - D.y0); }
  function show(on) { grp.setAttribute('opacity', on ? '1' : '0'); }
  function move(ev) {
    var r = svg.getBoundingClientRect();
    var x = (ev.clientX - r.left) / r.width * 900;
    var kmh = Math.max(0, Math.min(D.xmax, (x - D.x0) / (D.x1 - D.x0) * D.xmax));
    var i = Math.round(kmh / D.step);
    var pa = D.a[i], pb = D.b[i];
    if (pa === undefined && pb === undefined) { show(false); return; }
    show(true);
    var cx = px(i * D.step);
    cross.setAttribute('x1', cx); cross.setAttribute('x2', cx);
    if (pa !== undefined) { d1.setAttribute('opacity', '1'); d1.setAttribute('cx', cx); d1.setAttribute('cy', py(pa)); }
    else d1.setAttribute('opacity', '0');
    if (pb !== undefined) { d2.setAttribute('opacity', '1'); d2.setAttribute('cx', cx); d2.setAttribute('cy', py(pb)); }
    else d2.setAttribute('opacity', '0');
    t0.textContent = Math.round(i * D.step) + ' km/h';
    t1.textContent = 'rotors alone   ' + (pa === undefined ? 'beyond top speed' : Math.round(pa) + ' kW');
    t2.textContent = '+ 4 m span     ' + (pb === undefined ? 'beyond top speed' : Math.round(pb) + ' kW');
    var bx = cx + 14, w = 186;
    if (bx + w > D.x1) bx = cx - 14 - w;
    var by = D.y0 + 84;
    bg.setAttribute('x', bx); bg.setAttribute('y', by); bg.setAttribute('width', w);
    t0.setAttribute('x', bx + 12); t0.setAttribute('y', by + 18);
    t1.setAttribute('x', bx + 12); t1.setAttribute('y', by + 35);
    t2.setAttribute('x', bx + 12); t2.setAttribute('y', by + 51);
  }
  hit.addEventListener('pointermove', move);
  hit.addEventListener('pointerdown', move);
  hit.addEventListener('pointerleave', function () { show(false); });
})();
