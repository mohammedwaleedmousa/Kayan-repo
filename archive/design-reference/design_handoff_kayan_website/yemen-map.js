/* yemen-map v3 — "بلد من نقاط الضوء": Yemen assembled from gold light-points, its cities scattered clearly across it.
   Geometry + place coordinates: Natural Earth via world-atlas@2.0.2 (public domain).
   No connector arcs: the country and its cities carry the frame.
   Motion: assembly radiating from Aden, staggered city arrivals, idle shimmer, lighthouse sweep, pointer lens, Aden pulse. */
(function () {
  if (customElements.get('yemen-map')) return;
  var GOLD = [233, 201, 107], GOLD_DEEP = [201, 162, 39], CREAM = 'rgba(250,246,236,';

  /* Cities: real coordinates, spread north–south–east–west plus Socotra.
     side = where the label sits relative to its marker. */
  var CITIES = [
    { k: 'aden',     lon: 45.036, lat: 12.786, hq: true, side: 'e'  },
    { k: 'sanaa',    lon: 44.206, lat: 15.354, side: 'w' },
    { k: 'taiz',     lon: 44.017, lat: 13.578, side: 'w' },
    { k: 'hudaydah', lon: 42.955, lat: 14.798, side: 'n' },
    { k: 'saada',    lon: 43.763, lat: 16.940, side: 'w' },
    { k: 'dhamar',   lon: 44.405, lat: 14.543, side: 'e' },
    { k: 'marib',    lon: 45.326, lat: 15.462, side: 'e' },
    { k: 'ataq',     lon: 46.834, lat: 14.539, side: 's' },
    { k: 'seiyun',   lon: 48.788, lat: 15.943, side: 'n' },
    { k: 'mukalla',  lon: 49.124, lat: 14.542, side: 's' },
    { k: 'ghaydah',  lon: 52.176, lat: 16.209, side: 'n' },
    { k: 'socotra',  lon: 53.980, lat: 12.600, side: 'n' }
  ];

  var LBL = {
    ar: { aden: 'عدن · المقر', sanaa: 'صنعاء', taiz: 'تعز', hudaydah: 'الحديدة', saada: 'صعدة',
          dhamar: 'ذمار', marib: 'مأرب', ataq: 'عتق', seiyun: 'سيئون', mukalla: 'المكلا',
          ghaydah: 'الغيضة', socotra: 'سقطرى',
          src: 'الحدود والإحداثيات من بيانات Natural Earth العامة' },
    en: { aden: 'ADEN · HQ', sanaa: 'Sanaa', taiz: 'Taiz', hudaydah: 'Al Hudaydah', saada: 'Saada',
          dhamar: 'Dhamar', marib: 'Marib', ataq: 'Ataq', seiyun: 'Seiyun', mukalla: 'Mukalla',
          ghaydah: 'Al Ghaydah', socotra: 'Socotra',
          src: 'Boundaries and coordinates: public-domain Natural Earth data' }
  };

  var W = 1200, H = 760;

  class YemenMap extends HTMLElement {
    static get observedAttributes() { return ['lang']; }
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML =
        '<style>' +
        ':host{display:block;}' +
        '.wrap{position:relative;width:100%;aspect-ratio:1200/760;overflow:visible;}' +
        'canvas{position:absolute;inset:0;width:100%;height:100%;display:block;}' +
        '.ov{position:absolute;inset:0;pointer-events:none;}' +
        '.ov span{position:absolute;white-space:nowrap;transition:color .25s ease,opacity .25s ease;}' +
        '.st{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:11px/1.6 "IBM Plex Mono",monospace;letter-spacing:.18em;color:rgba(250,246,236,.35);}' +
        '</style>' +
        '<div class="wrap"><div class="st">ADEN · 12.79N 45.03E</div></div>';
      this._dots = null; this._raf = 0; this._t0 = 0; this._vis = true;
      this._mx = -9999; this._my = -9999; this._tmx = -9999; this._tmy = -9999;
      this._reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this._fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    }
    connectedCallback() { this._init(); }
    disconnectedCallback() {
      if (this._raf) cancelAnimationFrame(this._raf);
      if (this._ro) this._ro.disconnect();
      if (this._io) this._io.disconnect();
    }
    attributeChangedCallback() { this._relabel(); }
    get lang() { return (this.getAttribute('lang') === 'en') ? 'en' : 'ar'; }

    async _init() {
      if (this._started) return; this._started = true;
      var tries = 0;
      while (!(window.d3 && window.topojson)) { if (++tries > 120) return this._fail(); await new Promise(function (r) { setTimeout(r, 100); }); }
      var topo;
      try { topo = await (await fetch((window.__resources && window.__resources.worldAtlas) || 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json')).json(); }
      catch (e) { return this._fail(); }
      try { this._build(topo); } catch (e) { this._fail(); }
    }
    _fail() { var st = this.shadowRoot.querySelector('.st'); if (st) st.textContent = 'MAP OFFLINE · ADEN 12.79N 45.03E'; }

    _build(topo) {
      var d3 = window.d3, tj = window.topojson, self = this;
      var all = tj.feature(topo, topo.objects.countries).features;
      var yemen = null, i;
      for (i = 0; i < all.length; i++) if (all[i].properties.name === 'Yemen') yemen = all[i];
      if (!yemen) return this._fail();
      var NB = ['Saudi Arabia', 'Oman', 'Djibouti', 'Eritrea', 'Somalia', 'Ethiopia'];
      var neighbors = all.filter(function (f) { return NB.indexOf(f.properties.name) >= 0; });
      var proj = d3.geoMercator().fitExtent([[86, 96], [W - 78, H - 82]], yemen);
      var path = d3.geoPath(proj);
      this._yemenPath = new Path2D(path(yemen));
      this._nbPath = new Path2D(neighbors.map(function (f) { return path(f); }).join(' '));

      var cities = CITIES.map(function (c) {
        var p = proj([c.lon, c.lat]);
        return { k: c.k, x: p[0], y: p[1], hq: !!c.hq, side: c.side, hov: 0 };
      });
      this._cities = cities;
      var aden = cities[0]; this._aden = [aden.x, aden.y];
      cities.forEach(function (c) { c.d = Math.hypot(c.x - aden.x, c.y - aden.y); });

      // measuring context for point-in-path tests
      var mc = document.createElement('canvas'); mc.width = 4; mc.height = 4;
      var mctx = mc.getContext('2d');

      // dot field — hex grid, kept when inside Yemen, brighter around every city
      var dots = [], step = 9.4, row = 0, x, y, j;
      for (y = 60; y < H - 20; y += 8.14, row++) {
        for (x = 50 + (row % 2 ? step / 2 : 0); x < W - 30; x += step) {
          if (!mctx.isPointInPath(this._yemenPath, x, y)) continue;
          var a = 0.21 + Math.random() * 0.15, s = 1.35 + Math.random() * 0.8;
          for (j = 0; j < cities.length; j++) {
            var dc = Math.hypot(x - cities[j].x, y - cities[j].y);
            var reach = cities[j].hq ? 40 : 27;
            if (dc < reach) { var f = 1 - dc / reach; a += (cities[j].hq ? 0.3 : 0.2) * f; s += 0.8 * f; }
          }
          var da = Math.hypot(x - aden.x, y - aden.y);
          dots.push({ x: x, y: y, a: a, s: s, ph: Math.random() * 6.283, d: da, th: Math.atan2(-(y - aden.y), x - aden.x) });
        }
      }
      this._dots = dots;

      // DOM: canvas + overlay labels
      var wrap = this.shadowRoot.querySelector('.wrap');
      wrap.querySelector('.st').remove();
      var cv = document.createElement('canvas');
      wrap.appendChild(cv);
      this._cv = cv; this._ctx = cv.getContext('2d');
      var ov = document.createElement('div'); ov.className = 'ov';
      var arabF = 'font-family:"IBM Plex Sans Arabic","Alexandria",sans-serif;';
      var OFF = 11;
      cities.forEach(function (c) {
        var sp = document.createElement('span');
        sp.setAttribute('data-t', c.k);
        var lx = c.x, ly = c.y, tf;
        if (c.side === 'e') { lx += OFF; tf = 'translate(0,-50%)'; }
        else if (c.side === 'w') { lx -= OFF; tf = 'translate(-100%,-50%)'; }
        else if (c.side === 'n') { ly -= OFF + 3; tf = 'translate(-50%,-100%)'; }
        else { ly += OFF + 3; tf = 'translate(-50%,0)'; }
        sp.style.left = (lx / W * 100) + '%';
        sp.style.top = (ly / H * 100) + '%';
        sp.style.cssText += ';transform:' + tf + ';' + arabF +
          (c.hq
            ? 'font-size:15px;font-weight:600;color:#E9C96B;text-shadow:0 1px 12px rgba(3,32,29,.9);'
            : 'font-size:12.5px;font-weight:400;color:rgba(250,246,236,.74);text-shadow:0 1px 8px rgba(3,32,29,.9);');
        ov.appendChild(sp);
        c.el = sp;
      });
      var src = document.createElement('span');
      src.setAttribute('data-t', 'src');
      src.style.left = '0'; src.style.top = '100%';
      src.style.cssText += ';transform:translate(0,-100%);margin-inline-start:8px;font-family:"IBM Plex Mono",monospace;font-size:9px;letter-spacing:.04em;color:rgba(250,246,236,.42);';
      ov.appendChild(src);
      wrap.appendChild(ov);
      this._ov = ov;
      this._relabel();

      this._ro = new ResizeObserver(function () { self._resize(); });
      this._ro.observe(wrap);
      this._resize();

      this._io = new IntersectionObserver(function (es) {
        self._vis = es[0] && es[0].isIntersecting;
        if (self._vis && !self._raf && !self._reduce) self._start();
      }, { threshold: 0.02 });
      this._io.observe(this);

      if (this._fine && !this._reduce) {
        wrap.addEventListener('pointermove', function (e) {
          var rc = wrap.getBoundingClientRect();
          self._tmx = (e.clientX - rc.left) / rc.width * W;
          self._tmy = (e.clientY - rc.top) / rc.height * H;
        });
        wrap.addEventListener('pointerleave', function () { self._tmx = -9999; self._tmy = -9999; });
      }

      if (this._reduce) { this._drawStatic(); } else { this._start(); }
    }

    _resize() {
      var wrap = this.shadowRoot.querySelector('.wrap');
      if (!wrap || !this._cv) return;
      var r = wrap.getBoundingClientRect();
      if (r.width < 10) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 3);
      this._cv.width = Math.round(r.width * dpr);
      this._cv.height = Math.round(r.height * dpr);
      this._sx = this._cv.width / W; this._sy = this._cv.height / H;
      if (this._reduce) this._drawStatic();
    }

    _start() {
      var self = this;
      if (this._raf) return;
      this._t0 = performance.now();
      var loop = function (now) {
        self._raf = 0;
        if (!self._vis || document.hidden) { self._raf = requestAnimationFrame(loop); return; }
        self._frame((now - self._t0) / 1000);
        self._raf = requestAnimationFrame(loop);
      };
      this._raf = requestAnimationFrame(loop);
    }

    /* the country: faint neighbours, a washed interior, a crisp gold coastline */
    _land(ctx, coastAlpha) {
      ctx.strokeStyle = CREAM + '.075)'; ctx.lineWidth = 1;
      ctx.stroke(this._nbPath);
      ctx.fillStyle = 'rgba(201,162,39,.075)';
      ctx.fill(this._yemenPath);
      ctx.strokeStyle = 'rgba(201,162,39,' + (0.18 * coastAlpha).toFixed(3) + ')';
      ctx.lineWidth = 6; ctx.stroke(this._yemenPath);
      ctx.strokeStyle = 'rgba(233,201,107,' + (0.68 * coastAlpha).toFixed(3) + ')';
      ctx.lineWidth = 1.45; ctx.stroke(this._yemenPath);
    }

    /* one city marker: ring + core, scaled by arrival and hover */
    _marker(ctx, c, arrive, hov, t) {
      if (arrive <= 0) return;
      var breathe = 0.5 + 0.5 * Math.sin(t * 1.15 + c.x * 0.03);
      var r = (c.hq ? 5.4 : 3.5) * arrive * (1 + 0.22 * hov);
      var ringR = r + (c.hq ? 5.5 : 4.1) + hov * 3;
      ctx.strokeStyle = 'rgba(201,162,39,' + ((c.hq ? 0.6 : 0.48) * arrive * (0.74 + 0.26 * breathe) + 0.3 * hov).toFixed(3) + ')';
      ctx.lineWidth = c.hq ? 1.6 : 1.15;
      ctx.beginPath(); ctx.arc(c.x, c.y, ringR, 0, 6.2832); ctx.stroke();
      ctx.fillStyle = c.hq
        ? 'rgba(243,222,156,' + (0.96 * arrive).toFixed(3) + ')'
        : 'rgba(240,214,130,' + ((0.9 + 0.1 * hov) * arrive).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, 6.2832); ctx.fill();
      // arrival pop: a ring that expands once and fades
      if (arrive < 1) {
        var p = 1 - arrive;
        ctx.strokeStyle = 'rgba(233,201,107,' + (0.55 * p).toFixed(3) + ')';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(c.x, c.y, ringR + (1 - p) * 16, 0, 6.2832); ctx.stroke();
      }
    }

    _frame(t) {
      var ctx = this._ctx; if (!ctx || !this._dots) return;
      ctx.setTransform(this._sx, 0, 0, this._sy, 0, 0);
      ctx.clearRect(0, 0, W, H);

      var coast = Math.max(0, Math.min(1, (t - 0.35) / 1.5));
      this._land(ctx, coast * coast * (3 - 2 * coast));

      this._mx += (this._tmx - this._mx) * 0.14;
      this._my += (this._tmy - this._my) * 0.14;

      // lighthouse sweep across the landmass sector, from Aden
      var sweep = 0.87 + 0.96 * Math.sin(t * 6.2832 / 15);
      var dots = this._dots, n = dots.length, i, d;
      for (i = 0; i < n; i++) {
        d = dots[i];
        var intro = (t * 470 - d.d) / 300; if (intro <= 0) continue; if (intro > 1) intro = 1;
        intro = intro * intro * (3 - 2 * intro);
        var a = d.a * (0.84 + 0.16 * Math.sin(t * 0.7 + d.ph));
        var dth = d.th - sweep;
        if (dth > -0.15 && dth < 0.15) a += 0.24 * (1 - Math.abs(dth) / 0.15);
        var s = d.s;
        if (this._mx > -999) {
          var dx = d.x - this._mx, dy = d.y - this._my, dd = dx * dx + dy * dy;
          if (dd < 12100) { var k = 1 - Math.sqrt(dd) / 110; a += 0.5 * k * k; s += 1.1 * k; }
        }
        a *= intro; if (a > 0.94) a = 0.94;
        ctx.fillStyle = 'rgba(' + GOLD[0] + ',' + GOLD[1] + ',' + GOLD[2] + ',' + a.toFixed(3) + ')';
        ctx.fillRect(d.x - s / 2, d.y - s / 2, s, s);
      }

      // cities: staggered arrival by distance from Aden, hover lift
      var cities = this._cities, c;
      for (i = 0; i < cities.length; i++) {
        c = cities[i];
        var av = (t - 0.7 - c.d / 470) / 0.55; av = Math.max(0, Math.min(1, av));
        av = av * av * (3 - 2 * av);
        var want = 0;
        if (this._mx > -999) {
          var hd = Math.hypot(c.x - this._mx, c.y - this._my);
          if (hd < 62) want = 1 - hd / 62;
        }
        c.hov += (want - c.hov) * 0.16;
        this._marker(ctx, c, av, c.hov, t);
        if (c.el) {
          c.el.style.opacity = av.toFixed(2);
          if (!c.hq) c.el.style.color = 'rgba(250,246,236,' + (0.74 + 0.26 * c.hov).toFixed(2) + ')';
        }
      }

      // Aden double pulse — the one place that keeps a beat
      var a0 = this._aden, ph1 = (t * 0.357) % 1, ph2 = (t * 0.357 + 0.5) % 1;
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(201,162,39,' + (0.5 * (1 - ph1)).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(a0[0], a0[1], 8 + ph1 * 30, 0, 6.2832); ctx.stroke();
      ctx.strokeStyle = 'rgba(201,162,39,' + (0.36 * (1 - ph2)).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(a0[0], a0[1], 8 + ph2 * 30, 0, 6.2832); ctx.stroke();
    }

    _drawStatic() {
      var ctx = this._ctx; if (!ctx || !this._dots) return;
      ctx.setTransform(this._sx, 0, 0, this._sy, 0, 0);
      ctx.clearRect(0, 0, W, H);
      this._land(ctx, 1);
      var dots = this._dots, i, d;
      for (i = 0; i < dots.length; i++) {
        d = dots[i];
        ctx.fillStyle = 'rgba(233,201,107,' + Math.min(0.92, d.a + 0.06).toFixed(3) + ')';
        ctx.fillRect(d.x - d.s / 2, d.y - d.s / 2, d.s, d.s);
      }
      var cities = this._cities;
      for (i = 0; i < cities.length; i++) {
        this._marker(ctx, cities[i], 1, 0, 0);
        if (cities[i].el) cities[i].el.style.opacity = '1';
      }
    }

    _relabel() {
      var ov = this._ov; if (!ov) return;
      var L = LBL[this.lang];
      var nodes = ov.querySelectorAll('[data-t]');
      for (var i = 0; i < nodes.length; i++) {
        var k = nodes[i].getAttribute('data-t');
        if (L[k]) nodes[i].textContent = L[k];
      }
    }
  }
  customElements.define('yemen-map', YemenMap);
  window.YemenMap = YemenMap;
})();
