import React from 'react';
import DCLogic from './DCLogic.js';

const SEAL_CANON = 'KYN|WEB|001|2026-08-13|kayanwork.com';
let SEAL_HASH = '';

export default class HomeLogic extends DCLogic {
  constructor(props) {
    super(props);
    this.root = React.createRef();
    let lang = null;
    try { lang = localStorage.getItem('kyn-lang'); } catch (e) {}
    if (lang !== 'ar' && lang !== 'en') lang = (this.props.defaultLang === 'ar') ? 'ar' : 'en';
    this.state = { lang: lang, hover: null, sel: null, flash: null, playing: false, armed: false, autoIdx: 0 };
  }

  adenHM(){ const d=new Date(Date.now()+ (3*60+new Date().getTimezoneOffset())*60000);
    return { h:String(d.getHours()).padStart(2,'0'), m:String(d.getMinutes()).padStart(2,'0'), hn:d.getHours()+d.getMinutes()/60 }; }

  sky(){ const t=this.adenHM().hn;
    if(t>=4.5&&t<6)   return {k:'fajr',  ar:'فجرًا',  en:'FAJR',    dot:'#7CC0F4', g:'radial-gradient(1100px 600px at 70% -12%,rgba(46,110,160,.20),transparent 62%),radial-gradient(800px 520px at 6% 106%,rgba(91,74,142,.14),transparent 60%)'};
    if(t>=6&&t<10)    return {k:'duha',  ar:'ضحى',    en:'MORNING', dot:'#E9C96B', g:'radial-gradient(1100px 600px at 74% -12%,rgba(233,201,107,.17),transparent 62%),radial-gradient(800px 520px at 6% 106%,rgba(18,181,164,.13),transparent 60%)'};
    if(t>=10&&t<15)   return {k:'zuhr',  ar:'ظهرًا',  en:'MIDDAY',  dot:'#F3DE9C', g:'radial-gradient(1200px 640px at 60% -16%,rgba(243,222,156,.20),transparent 64%),radial-gradient(800px 520px at 8% 108%,rgba(18,181,164,.10),transparent 60%)'};
    if(t>=15&&t<17.5) return {k:'asr',   ar:'عصرًا',  en:'ASR',     dot:'#DDA94B', g:'radial-gradient(1100px 600px at 78% -10%,rgba(201,142,39,.19),transparent 62%),radial-gradient(800px 520px at 4% 108%,rgba(201,162,39,.10),transparent 60%)'};
    if(t>=17.5&&t<19) return {k:'maghrib',ar:'مغربًا',en:'MAGHRIB', dot:'#E08D5E', g:'radial-gradient(1100px 600px at 82% -8%,rgba(201,107,74,.22),transparent 62%),radial-gradient(800px 520px at 4% 108%,rgba(91,74,142,.13),transparent 60%)'};
    return             {k:'layl',  ar:'ليلًا',  en:'NIGHT',   dot:'#6FA8DC', g:'radial-gradient(1100px 620px at 72% -14%,rgba(10,52,78,.30),transparent 64%),radial-gradient(820px 540px at 6% 108%,rgba(18,90,120,.14),transparent 62%),linear-gradient(rgba(1,10,9,.18),rgba(1,10,9,.18))'};
  }

  componentDidMount() {
    this._clk = setInterval(() => this.forceUpdate(), 30000);
    this._grail = () => {
      const rail = document.querySelector('[data-grail]'), bird = document.querySelector('[data-gbird]');
      if (!rail || !bird) return;
      if (!rail.__grailBound) { rail.__grailBound = true; rail.addEventListener('scroll', this._grail, { passive: true }); }
      const max = rail.scrollWidth - rail.clientWidth;
      const pct = max > 0 ? Math.min(1, Math.abs(rail.scrollLeft) / max) : 0;
      const box = bird.parentElement, cs = getComputedStyle(box);
      const span = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - bird.clientWidth;
      const dirSign = cs.direction === 'rtl' ? -1 : 1;
      const tf = 'translateX(' + (dirSign * pct * Math.max(0, span)).toFixed(1) + 'px)';
      let st = document.getElementById('__gbird-pos');
      if (!st) { st = document.createElement('style'); st.id = '__gbird-pos'; document.head.appendChild(st); }
      const rule = '[data-gbird]{transform:' + tf + ' !important;transition:none !important;}';
      if (st.textContent !== rule) st.textContent = rule;
    };
    this._grailDoc = (e) => { const t = e.target; if (t && t.nodeType === 1 && t.hasAttribute && t.hasAttribute('data-grail')) this._grail(); };
    document.addEventListener('scroll', this._grailDoc, { capture: true, passive: true });
    this._grailClk = setInterval(this._grail, 800);
    const railEl = document.querySelector('[data-grail]');
    if (railEl) { setTimeout(this._grail, 600); }
    if (railEl) {
      railEl.style.cursor = 'grab';
      railEl.addEventListener('dragstart', (e) => e.preventDefault());
      let drag = null, mom = null;
      const stopMom = () => { if (mom) { cancelAnimationFrame(mom); mom = null; } };
      const snapOff = () => { railEl.style.scrollSnapType = 'none'; };
      const snapOn = () => { railEl.style.scrollSnapType = ''; };
      railEl.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        stopMom(); snapOff();
        drag = { x: e.clientX, sl: railEl.scrollLeft, moved: false, id: e.pointerId, v: 0, lx: e.clientX, lt: performance.now() };
        railEl.style.cursor = 'grabbing';
      });
      railEl.addEventListener('pointermove', (e) => {
        if (!drag) return;
        const dx = e.clientX - drag.x;
        if (!drag.moved && Math.abs(dx) > 4) { drag.moved = true; try { railEl.setPointerCapture(drag.id); } catch (err) {} }
        if (drag.moved) {
          railEl.scrollLeft = drag.sl - dx;
          const now = performance.now(), dt = now - drag.lt;
          if (dt > 0) { drag.v = drag.v * 0.8 + ((e.clientX - drag.lx) / dt) * 0.2; }
          drag.lx = e.clientX; drag.lt = now;
        }
      });
      const endDrag = () => {
        if (!drag) return;
        if (drag.moved) {
          this._dragT = Date.now();
          let v = -drag.v * 16;
          const glide = () => {
            v *= 0.94;
            if (Math.abs(v) < 0.4) { snapOn(); mom = null; return; }
            railEl.scrollLeft += v;
            mom = requestAnimationFrame(glide);
          };
          if (Math.abs(v) > 1.5) { mom = requestAnimationFrame(glide); } else { snapOn(); }
        } else { snapOn(); }
        drag = null; railEl.style.cursor = 'grab';
      };
      railEl.addEventListener('pointerup', endDrag);
      railEl.addEventListener('pointercancel', endDrag);
      railEl.addEventListener('wheel', stopMom, { passive: true });
      railEl.addEventListener('click', (e) => {
        if (this._dragT && Date.now() - this._dragT < 200) { e.preventDefault(); e.stopPropagation(); }
      }, true);
    }
    const track = document.querySelector('[data-gtrack]');
    if (track && railEl) {
      track.style.cursor = 'pointer';
      track.style.touchAction = 'none';
      const scrub = (e) => {
        const r = track.getBoundingClientRect(), cs2 = getComputedStyle(track);
        const pl = parseFloat(cs2.paddingLeft), spanW = r.width - pl - parseFloat(cs2.paddingRight);
        const pct = Math.min(1, Math.max(0, (e.clientX - r.left - pl) / Math.max(1, spanW)));
        railEl.scrollLeft = pct * (railEl.scrollWidth - railEl.clientWidth);
      };
      track.addEventListener('pointerdown', (e) => {
        try { track.setPointerCapture(e.pointerId); } catch (err) {}
        scrub(e);
        const mv = (ev) => scrub(ev);
        const up = () => { track.removeEventListener('pointermove', mv); track.removeEventListener('pointerup', up); track.removeEventListener('pointercancel', up); };
        track.addEventListener('pointermove', mv);
        track.addEventListener('pointerup', up);
        track.addEventListener('pointercancel', up);
      });
    }
    const el = this.root.current;
    if (!el) return;
    el.setAttribute('dir', this.state.lang === 'en' ? 'ltr' : 'rtl');
    this._initReveals();
    el.setAttribute('data-mo', '');
    this._failsafe = setTimeout(() => this._revealAll(), 2600);
    this._onShow = () => this.setState({ flash: null }); // bfcache return: clear any stuck wipe
    window.addEventListener('pageshow', this._onShow);
    this._cycle = setInterval(() => {
      if (this.state.hover) return;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (document.hidden) return;
      this.setState((st) => ({ autoIdx: (st.autoIdx + 1) % 6 }));
    }, 3200);
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevState || prevState.lang !== this.state.lang) {
      const rEl = this.root.current;
      if (rEl) rEl.setAttribute('dir', this.state.lang === 'en' ? 'ltr' : 'rtl');
      requestAnimationFrame(() => requestAnimationFrame(() => this._revealAll()));
      clearTimeout(this._langFix);
      this._langFix = setTimeout(() => this._revealAll(), 180);
    }
  }
  componentWillUnmount() {
    if (this._clk) clearInterval(this._clk);
    const railEl2 = document.querySelector('[data-grail]');
    if (railEl2 && this._grail) railEl2.removeEventListener('scroll', this._grail);
    if (this._io) this._io.disconnect();
    if (this._failsafe) clearTimeout(this._failsafe);
    if (this._cycle) clearInterval(this._cycle);
    if (this._langFix) clearTimeout(this._langFix);
    if (this._ac) this._ac.close();
    if (this._grailDoc) document.removeEventListener('scroll', this._grailDoc, true);
    if (this._onShow) window.removeEventListener('pageshow', this._onShow);
    if (this._flashKill) clearTimeout(this._flashKill);
  }
  _initReveals() {
    const el = this.root.current;
    if (!('IntersectionObserver' in window)) { this._revealAll(); return; }
    this._io = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { en.target.setAttribute('data-on', ''); this._io.unobserve(en.target); } });
    }, { threshold: 0.1 });
    el.querySelectorAll('[data-reveal]').forEach((n, i) => {
      n.style.transitionDelay = ((i % 5) * 55) + 'ms';
      this._io.observe(n);
    });
  }
  _revealAll() {
    const el = this.root.current;
    if (!el) return;
    el.querySelectorAll('[data-reveal]:not([data-on])').forEach((n) => n.setAttribute('data-on', ''));
  }

  // ---- sonic engine (canonical registry — maqam Rast on D, from Chapter 05) ----
  ac() {
    if (!this._ac) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; this._ac = new C(); }
    if (this._ac.state === 'suspended') this._ac.resume();
    return this._ac;
  }
  bus() {
    if (this._out) return;
    const ac = this._ac;
    const master = ac.createGain(); master.gain.value = 0.42;
    const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 150;
    const dly = ac.createDelay(); dly.delayTime.value = 0.112;
    const fb = ac.createGain(); fb.gain.value = 0.2;
    const wet = ac.createGain(); wet.gain.value = 0.26;
    master.connect(hp); hp.connect(ac.destination);
    hp.connect(dly); dly.connect(fb); fb.connect(dly); dly.connect(wet); wet.connect(ac.destination);
    this._out = master;
  }
  deg() {
    const d = 587.33, c = (n) => d * Math.pow(2, n / 1200);
    return { drone: d / 4, low: d / 2, d: d, n3: c(347), g: c(500), a: c(700), n6: c(1047), oct: c(1200), high: c(1200) * 1.5 };
  }
  pluck(f, t0, dur, gain, type) {
    const ac = this._ac, o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(), g2 = ac.createGain(), lp = ac.createBiquadFilter();
    o.type = type || 'triangle'; o.frequency.value = f;
    o2.type = 'sawtooth'; o2.frequency.value = f * 2.002; g2.gain.value = 0.12;
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(3600, t0); lp.frequency.exponentialRampToValueAtTime(1200, t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(this._out);
    o.start(t0); o2.start(t0); o.stop(t0 + dur + 0.05); o2.stop(t0 + dur + 0.05);
  }
  drone(f, t0, dur, gain) {
    const ac = this._ac, o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(this._out);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  fire(name) {
    const ac = this.ac(); if (!ac) return;
    this.bus();
    const t = ac.currentTime + 0.03, k = this.deg();
    if (name === 'logo') {
      [[k.d, 0], [k.n3, 0.19], [k.a, 0.38], [k.oct, 0.6]].forEach((s) => this.pluck(s[0], t + s[1], 1.0, 0.17));
      this.drone(k.drone, t, 1.9, 0.075); this.drone(k.low, t + 0.55, 1.3, 0.05);
    }
    if (name === 'stamp') { this.pluck(k.a, t, 0.34, 0.16); this.pluck(k.oct, t + 0.14, 0.55, 0.15); this.drone(k.drone, t, 0.7, 0.05); }
  }

  lines() {
    return [
      { key: 'md', color: '#2E7CBC', deep: '#1A5F97', img: 'assets/bird-master.png', icon: 'assets/bird-master.png', code: 'LINE I · MANAGED DELIVERY',
        ar: { word: 'العهدة', name: 'التسليم المدار', tag: 'حيث يبدأ العملاء', desc: 'نطاق موقع، وضمان ممول، وفريق موثق يقوده منسق واحد، ومراجعة مستقلة قبل القبول. تطالب كيان، لا فردا.', cta: 'ادخل الخط', href: 'Line I - Managed Delivery.dc.html', alt: 'EN', altHref: 'Line I - Managed Delivery EN.dc.html', flash: 'الخط الأول · التسليم المدار' },
        en: { word: 'CUSTODY', name: 'Managed Delivery', tag: 'where clients begin', desc: 'Signed scope, funded escrow, a verified team under one coordinator, independent QA before acceptance. You hold Kayan accountable, not an individual.', cta: 'Enter the line', href: 'Line I - Managed Delivery EN.dc.html', alt: 'عربي', altHref: 'Line I - Managed Delivery.dc.html', flash: 'Line I · Managed Delivery' } },
      { key: 'rp', color: '#12B5A4', deep: '#0E6E66', img: 'assets/bird-master.png', icon: 'assets/bird-master.png', code: 'LINE I · THE SHELF',
        ar: { word: 'الرف', name: 'الرف الجاهز', tag: 'سعر ثابت ومدة معلومة', desc: 'منتجات بمخرج مكتوب وسعر ثابت ومدة معلومة. يختار المنتج، فيفتح نطاقه جاهزا للتوقيع.', cta: 'تصفح الرف', href: 'Line I - Ready Products.dc.html', alt: null, altHref: null, flash: 'الرف الجاهز' },
        en: { word: 'SHELF', name: 'Ready Products', tag: 'fixed price, known duration', desc: 'Products with a written deliverable, a fixed price and a known duration. Pick one, and its scope opens ready to sign. Catalogue in Arabic.', cta: 'Browse the shelf', href: 'Line I - Ready Products.dc.html', alt: null, altHref: null, flash: 'Ready Products' } },
      { key: 'hub', color: '#FFB627', deep: '#A8720B', img: 'assets/bird-master.png', icon: 'assets/bird-master.png', code: 'LINE II · THE HUB & CAFÉ',
        ar: { word: 'الملتقى', name: 'الهب والمقهى', tag: 'حيث تعمل عدن', desc: 'طابق عمل على كورنيش خورمكسر: كهرباء لا تنقطع، واتصال مضمون، ومقهى من أرض البن. هنا يجرى التحقق وجها لوجه.', cta: 'ادخل الخط', href: 'Line II - The Hub and Cafe.dc.html', alt: 'EN', altHref: 'Line II - The Hub and Cafe EN.dc.html', flash: 'الخط الثاني · الهب والمقهى' },
        en: { word: 'GROUND', name: 'The Hub & Café', tag: 'where Aden works', desc: 'A working floor on the Khormaksar corniche: uninterrupted power, guaranteed connectivity, and coffee from the land that first brewed it. Verification happens here, face to face.', cta: 'Enter the line', href: 'Line II - The Hub and Cafe EN.dc.html', alt: 'عربي', altHref: 'Line II - The Hub and Cafe.dc.html', flash: 'Line II · The Hub & Café' } },
      { key: 'forge', color: '#FF6250', deep: '#D0402F', img: 'assets/bird-master.png', icon: 'assets/bird-master.png', code: 'LINE III · KAYAN FORGE',
        ar: { word: 'الصقل', name: 'كيان فورج', tag: 'حيث تصنع المهارة', desc: 'أفواج يمولها رعاة وتتدرب على عمل حقيقي. المخرج تحقق يقيد في السجل، لا شهادة حضور.', cta: 'ادخل الخط', href: 'Line III - The Forge.dc.html', alt: 'EN', altHref: 'Line III - The Forge EN.dc.html', flash: 'الخط الثالث · كيان فورج' },
        en: { word: 'FORGE', name: 'Kayan Forge', tag: 'where skill is made', desc: 'Sponsor-funded cohorts trained on real work. The output is a recorded verification, not a certificate of attendance.', cta: 'Enter the line', href: 'Line III - The Forge EN.dc.html', alt: 'عربي', altHref: 'Line III - The Forge.dc.html', flash: 'Line III · Kayan Forge' } },
      { key: 'k4y', color: '#3FA75B', deep: '#2E7D44', img: 'assets/bird-master.png', icon: 'assets/bird-master.png', code: 'CIVIC WING · KAYAN FOR YEMEN',
        ar: { word: 'الأثر', name: 'كيان لليمن', tag: 'يد للمدينة', desc: 'ليست خطا رابعا، بل غاية تسري في الخطوط كلها: تطوع يقيد، ومهارة تثبت، ودخل يبدأ.', cta: 'ادخل الذراع', href: 'Civic Wing - Kayan for Yemen.dc.html', alt: null, altHref: null, flash: 'الذراع المدنية · كيان لليمن' },
        en: { word: 'TRACE', name: 'Kayan for Yemen', tag: 'a hand for the city', desc: 'Not a fourth line, but the purpose running through all of them: volunteering that is recorded, skill that is proven, income that begins.', cta: 'Enter the wing', href: 'Civic Wing - Kayan for Yemen.dc.html', alt: null, altHref: null, flash: 'Civic Wing · Kayan for Yemen' } }
    ];
  }
  sha256(str) {
    const K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    let H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    const b = Array.from(new TextEncoder().encode(str));
    const bitLen = b.length * 8;
    b.push(0x80);
    while (b.length % 64 !== 56) b.push(0);
    for (let i = 7; i >= 0; i--) b.push(Math.floor(bitLen / Math.pow(2, i * 8)) & 0xff);
    const rr = (x, n) => (x >>> n) | (x << (32 - n));
    for (let i = 0; i < b.length; i += 64) {
      const w = new Array(64);
      for (let j = 0; j < 16; j++) w[j] = (b[i+j*4] << 24) | (b[i+j*4+1] << 16) | (b[i+j*4+2] << 8) | b[i+j*4+3];
      for (let j = 16; j < 64; j++) {
        const s0 = rr(w[j-15],7) ^ rr(w[j-15],18) ^ (w[j-15] >>> 3);
        const s1 = rr(w[j-2],17) ^ rr(w[j-2],19) ^ (w[j-2] >>> 10);
        w[j] = (w[j-16] + s0 + w[j-7] + s1) | 0;
      }
      let a = H[0], bb = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (let j = 0; j < 64; j++) {
        const S1 = rr(e,6) ^ rr(e,11) ^ rr(e,25);
        const ch = (e & f) ^ (~e & g);
        const t1 = (h + S1 + ch + K[j] + w[j]) | 0;
        const S0 = rr(a,2) ^ rr(a,13) ^ rr(a,22);
        const mj = (a & bb) ^ (a & c) ^ (bb & c);
        const t2 = (S0 + mj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = bb; bb = a; a = (t1 + t2) | 0;
      }
      const add = [a,bb,c,d,e,f,g,h];
      H = H.map((v, k) => (v + add[k]) | 0);
    }
    return H.map(v => (v >>> 0).toString(16).padStart(8, '0')).join('').toUpperCase();
  }

  sealRuns(hex, cell) {
    const bit = i => (parseInt(hex[i >> 2], 16) >> (3 - (i & 3))) & 1;
    const N = 11, WT = [0.30, 0.46, 0.64, 0.84], out = [];
    for (let r = 0; r < N; r++) {
      const wv = (bit(66 + r * 2) << 1) | bit(66 + r * 2 + 1);
      const hgt = WT[wv] * cell;
      const on = [];
      for (let c = 0; c < N; c++) on.push(bit(r * 6 + (c <= 5 ? c : 10 - c)));
      let c = 0, any = false;
      while (c < N) {
        if (on[c]) {
          const s = c;
          while (c < N && on[c]) c++;
          out.push({ x:+(s*cell).toFixed(2), y:+(r*cell+(cell-hgt)/2).toFixed(2), w:+((c-s)*cell-cell*0.2).toFixed(2), h:+hgt.toFixed(2), rx:+Math.min(hgt/2,cell*0.16).toFixed(2) });
          any = true;
        } else c++;
      }
      if (!any) out.push({ x:+(cell*0.9).toFixed(2), y:+(r*cell+cell/2-cell*0.045).toFixed(2), w:+(cell*9.2).toFixed(2), h:+(cell*0.09).toFixed(2), rx:0.5 });
    }
    return out;
  }

  renderVals() {
    const gbirdTf = this.state.gbirdTf || 'translateX(0px)';
    if (!SEAL_HASH) SEAL_HASH = this.sha256(SEAL_CANON);
    const s = this.state, ar = s.lang !== 'en', en = !ar;
    const LNS = this.lines();
    const langKey = ar ? 'ar' : 'en';
    const showKey = s.hover || s.sel;
    const POS = { md: ['12.4%', '37.8%'], rp: ['73.2%', '82%'], hub: ['50%', '10.5%'], forge: ['87.6%', '37.8%'], k4y: ['26.8%', '82%'] };
    const flock = LNS.map((ln) => {
      const t = ln[langKey], active = showKey === ln.key;
      return {
        key: ln.key, img: ln.img, icon: ln.icon || ln.img, word: ar ? t.word : t.name, name: ar ? t.name : t.word,
        x: POS[ln.key][0], y: POS[ln.key][1],
        discBg: 'radial-gradient(circle at 32% 28%,' + ln.color + ',' + ln.deep + ' 82%)',
        discShadow: active ? ('0 16px 34px ' + ln.color + '73, inset 0 0 0 2px rgba(255,255,255,.4)') : '0 8px 20px rgba(5,46,43,.2), inset 0 0 0 2px rgba(255,255,255,.22)',
        discScale: active ? 'scale(1.09)' : 'none',
        wCol: active ? ln.deep : '#6E675A',
        pressed: s.sel === ln.key ? 'true' : 'false'
      };
    });
    const curLn = LNS.find((l) => l.key === showKey) || LNS[0];
    const ct = curLn[langKey];
    const cur = {
      color: curLn.color, deep: curLn.deep, img: curLn.img, code: curLn.code,
      word: ar ? ct.word : ct.name, name: ar ? ct.name : ct.word, tagWrapped: ar ? ('«' + ct.tag + '»') : ct.tag,
      desc: ct.desc, ctaLine: ct.cta + ' ' + (ar ? '←' : '→'), href: ct.href, flash: ct.flash,
      hasAlt: !!ct.alt, alt: ct.alt || '', altHref: ct.altHref || '',
      shadow: curLn.color + '59'
    };
    const setLang = (l) => {
      if (l === s.lang) return;
      try { localStorage.setItem('kyn-lang', l); } catch (e) {}
      this.setState({ lang: l });
    };
    return {
      rootRef: this.root,
      ar: ar, en: en, lang: s.lang,
      modelSteps: [
        { no: '01', ar: 'نطاق موقع', arSub: 'وثيقة فتح النطاق: ناتج محدد وموعد وميزانية.', en: 'Signed scope', enSub: 'A scope-opening file: outcome, deadline, budget.' },
        { no: '02', ar: 'إيداع الضمان', arSub: 'يودع المال التزامًا في ذمة كيان قبل البدء.', en: 'Escrow deposit', enSub: "Funds held as Kayan's obligation before work starts." },
        { no: '03', ar: 'تأليف الفريق', arSub: 'قائد مثبت وتوزيع يثبت قبل أول مهمة.', en: 'Pod composed', enSub: 'A named lead, a split fixed before the first task.' },
        { no: '04', ar: 'عشر بوابات', arSub: 'يمر التكليف بها بالترتيب، ويدون كل عبور.', en: 'Ten gates', enSub: 'Passed in order; every crossing recorded.' },
        { no: '05', ar: 'محضر استلام', arSub: 'يوقع العميل على ما استلم، بندًا بندًا.', en: 'Acceptance record', enSub: 'The client signs what was received, item by item.' },
        { no: '06', ar: 'صرف وضمانة', arSub: 'يصرف بالمحضر وحده، وتسري ضمانة ثلاثين يومًا.', en: 'Payout & warranty', enSub: 'Released only against the record; 30-day warranty runs.' }
      ],
      /* Four real micro-specs for an e-commerce build. Leadership is NOT a specialization:
         the lead is one of these four specialists, marked by a badge. */
      podNodes: [
        { x: '50%', y: '9%',   d: .15, code: 'DEV-WEB-031', ar: 'بناء واجهة المتجر', en: 'Storefront build', lead: true, badgeAr: 'قيادة · T3', badgeEn: 'Lead · T3' },
        { x: '14%', y: '31%',  d: .27, code: 'DES-UIX-014', ar: 'تصميم رحلة الشراء', en: 'Checkout journey UI', edge: 'start' },
        { x: '86%', y: '31%',  d: .39, code: 'DEV-API-018', ar: 'ربط بوابة الدفع', en: 'Payment integration', edge: 'end' },
        { x: '50%', y: '86%',  d: .51, code: 'MKT-CPY-009', ar: 'نصوص صفحات المنتج', en: 'Product page copy' }
      ].map(n => ({
        code: n.code, label: ar ? n.ar : n.en, badge: n.lead ? (ar ? n.badgeAr : n.badgeEn) : '',
        pos: 'position:absolute;' + (n.edge === 'start' ? 'left:0;transform:translateY(-50%);' : n.edge === 'end' ? 'right:0;transform:translateY(-50%);' : 'left:' + n.x + ';transform:translateX(-50%);') + 'top:' + n.y + ';max-width:42%;',
        chip: 'position:relative;display:grid;gap:2px;justify-items:center;text-align:center;border-radius:12px;background:rgba(3,32,29,.94);padding:8px 12px;min-width:86px;max-width:100%;transition-delay:' + n.d + 's;border:1px solid ' + (n.lead ? 'rgba(233,201,107,.75);box-shadow:0 0 18px rgba(233,201,107,.22)' : 'rgba(250,246,236,.28)') + ';',
        codeStyle: 'font-family:IBM Plex Mono,monospace;font-size:7.5px;letter-spacing:.1em;white-space:nowrap;color:' + (n.lead ? '#E9C96B' : 'rgba(233,201,107,.75)') + ';',
        labelStyle: 'font-size:10.5px;line-height:1.5;text-wrap:pretty;font-weight:' + (n.lead ? '600' : '400') + ';color:' + (n.lead ? '#F3DE9C' : 'rgba(250,246,236,.78)') + ';',
        badgeStyle: 'position:absolute;top:-9px;inset-inline-start:50%;transform:translateX(50%);white-space:nowrap;font-family:IBM Plex Mono,monospace;font-size:7px;letter-spacing:.12em;color:#3A2604;background:linear-gradient(135deg,#C9A227,#E9C96B);border-radius:99px;padding:2px 8px;'
      })),
      arBtnBg: ar ? '#C9A227' : 'transparent', arBtnFg: ar ? '#03201D' : 'rgba(250,246,236,.7)',
      enBtnBg: en ? '#C9A227' : 'transparent', enBtnFg: en ? '#03201D' : 'rgba(250,246,236,.7)',
      toggleAr: () => setLang('ar'),
      toggleEn: () => setLang('en'),
      portalHref: (()=>{ let a=null; try{a=JSON.parse(localStorage.getItem('kyn-auth-v1')||'null');}catch(e){}
        if(a&&a.v===1) return a.role==='client' ? 'Kayan Space - Client.dc.html' : 'Kayan Space - Talent.dc.html';
        return 'Kayan Portal.dc.html'; })(),
      portalCta: (()=>{ let a=null; try{a=JSON.parse(localStorage.getItem('kyn-auth-v1')||'null');}catch(e){}
        if(a&&a.v===1) return ar ? 'إلى لوحتي' : 'My space';
        return ar ? 'البوابة' : 'Portal'; })(),
      portalFlash: (()=>{ let a=null; try{a=JSON.parse(localStorage.getItem('kyn-auth-v1')||'null');}catch(e){}
        if(a&&a.v===1) return a.role==='client' ? (ar?'لوحة العميل':'Client Space') : (ar?'مساحة الكفاءة':'Talent Space');
        return ar ? 'بوابة كيان' : 'The Kayan Portal'; })(),
      doorClientFlash: ar ? 'للعملاء' : 'For clients',
      doorTalentFlash: ar ? 'للكفاءات' : 'For talent',
      sonicOn: this.props.sonicEnabled !== false,
      playState: s.playing ? 'on' : 'off',
      tonePressed: !!s.playing,
      toneAria: ar
        ? (s.playing ? 'إيقاف نغمة كيان — مقام رست على الدال' : 'تشغيل نغمة كيان — مقام رست على الدال')
        : (s.playing ? 'Stop the Kayan signature — maqam Rast on D' : 'Play the Kayan signature — maqam Rast on D'),
      playLogo: () => {
        if (!this.state.armed) this.setState({ armed: true });
        this.fire('logo');
        this.setState({ playing: true });
        clearTimeout(this._pt);
        this._pt = setTimeout(() => this.setState({ playing: false }), 1900);
      },
      closeKicker: 'KYN-HOME · '+String(new Date().getFullYear()),
      taglinePre: ar ? 'خلف كل نجاح، ' : 'Behind every success, a ',
      taglineWord: ar ? 'كيان.' : 'Kayan.',
      taglinePost: '',
      footCreed: ar ? 'لا عقد، لا ضمان، لا عمل. تبنى الثقة بالبوابات والمحاضر، ويقيد كل نجاح في سجله.' : 'No contract, no escrow, no work. Trust is built at the gates and recorded by name.',
      adenClock: this.adenHM().h, adenMin: this.adenHM().m,
      skyGrad: this.sky().g,
      skyDot: this.sky().dot,
      skyChip: 'ADEN ' + this.adenHM().h + ':' + this.adenHM().m + ' · ' + this.sky().en,
      skyTitle: ar ? ('عدن الآن · ' + this.adenHM().h + ':' + this.adenHM().m + ' ' + this.sky().ar + ' — سماء الصفحة على توقيتها') : ('Aden now · the page sky follows its clock'),
      solarLine: (this.sky().k==='layl'||this.sky().k==='fajr')
        ? (ar ? 'المقر يعمل الليلة من مخزون شمس النهار' : 'HQ running tonight on the day\u2019s stored sun')
        : (ar ? 'المقر يعمل الآن بكهرباء الشمس' : 'HQ running on solar right now'),
      sealLine: ar ? 'هذه النسخة مقيدة بختم' : 'This release is sealed:',
      sealShort: SEAL_HASH.slice(0, 8),
      sealRuns: this.sealRuns(SEAL_HASH, 8),
      sealBox: '0 0 88 88',
      sealAria: ar ? 'ختم قيد هذه النسخة من الموقع' : 'Computed seal of this release',
      sealLink: ar ? 'كيف يحسب الختم ←' : 'How the seal is computed →',
      charterCardTitle: ar ? 'افتح الميثاق' : 'Open the Charter',
      charterCardName: ar ? 'ميثاق كيان' : 'The Kayan Charter',
      charterCardFoot: ar ? 'خلف كل نجاح، كيان' : 'Behind every success, a Kayan.',
      charterToc: ar ? [
        { n:'00', t:'من نحن — الاسم يجيب' },
        { n:'01', t:'المهمة — بنية لاقتصاد يعمل تحت الضغط' },
        { n:'02', t:'الرؤية — الجغرافيا ليست قدرا' },
        { n:'I–IV', t:'المواد الأربع النافذة' }
      ] : [
        { n:'00', t:'Who we are — the name answers' },
        { n:'01', t:'Mission — infrastructure under pressure' },
        { n:'02', t:'Vision — geography is not destiny' },
        { n:'I–IV', t:'Four articles in force' }
      ],
      flock: flock, cur: cur, dirVal: ar ? 'rtl' : 'ltr',
      ecoFlip: ar ? 'none' : 'scaleX(-1)', ecoUnflip: ar ? 'none' : 'scaleX(-1)', gbirdTf: gbirdTf,
      leadWord: ar ? 'كيان' : 'KAYAN',
      ecoSub: ar ? 'خطوط تتكامل، وسجل واحد يجمعها.' : 'Interconnected lines. One record.',
      birdPicked: !!showKey, birdNone: !showKey,
      pickHint: ar ? 'المس طائرا — أو قف عليه — يفتح لك خبر خطه هنا.' : 'Rest on a bird — its line opens here.',
      pickBird: (e) => {
        this.setState({ sel: e.currentTarget.getAttribute('data-key') }, () => {
          setTimeout(() => {
            const v = document.querySelector('[data-view]');
            if (!v) return;
            let sc = v.parentElement;
            while (sc && !(sc.scrollHeight > sc.clientHeight + 10 && /(auto|scroll)/.test(getComputedStyle(sc).overflowY))) sc = sc.parentElement;
            const r = v.getBoundingClientRect(), vh = window.innerHeight;
            const off = r.height < vh - 180 ? Math.max(90, (vh - r.height) / 2) : 90;
            if (sc) { sc.scrollTo({ top: sc.scrollTop + r.top - off, behavior: 'smooth' }); }
            else { window.scrollTo({ top: r.top + window.pageYOffset - off, behavior: 'smooth' }); }
          }, 60);
        });
      },
      birdEnter: (e) => this.setState({ hover: e.currentTarget.getAttribute('data-key') }),
      birdLeave: () => this.setState({ hover: null }),
      flashOn: !!s.flash,
      flashBg: s.flash ? ('linear-gradient(150deg,' + s.flash.bg + ',' + s.flash.bg + 'E6 60%,#03201D 175%)') : '#03201D',
      flashName: s.flash ? s.flash.name : '',
      goLine: (e) => {
        e.preventDefault(); e.stopPropagation();
        const el = e.currentTarget;
        const href = el.getAttribute('data-href') || el.getAttribute('href');
        if (!href) return;
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) { this.props.navigate(this.props.routeForHref(href)); return; }
        if (this.state.armed) this.fire('stamp');
        this.setState({ flash: { bg: el.getAttribute('data-color') || '#C9A227', name: el.getAttribute('data-name') || '' } });
        setTimeout(() => { this.props.navigate(this.props.routeForHref(href)); }, 560);
        clearTimeout(this._flashKill);
        this._flashKill = setTimeout(() => this.setState({ flash: null }), 1600); // failsafe: never leave the wipe covering the page
      }
    };
  }
}
