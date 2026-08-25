import React from 'react';
import DCLogic from '../../home/DCLogic.js';

export default class DeliveryEnLogic extends DCLogic {
  constructor(props) {
    super(props);
    this.root = React.createRef();
    this.hdr = React.createRef();
  }
  componentDidMount() {
    const el = this.root.current;
    if (!el) return;
    const hero = el.querySelector('[data-hero]');
    const onScroll = () => {
      const h = this.hdr.current;
      if (!h) return;
      const on = hero ? hero.getBoundingClientRect().top < -30 : false;
      h.style.background = on ? 'rgba(7,32,48,.94)' : 'transparent';
      h.style.borderBottomColor = on ? 'rgba(250,246,236,.14)' : 'transparent';
      h.style.backdropFilter = on ? 'blur(16px)' : 'none';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    this.onScroll = onScroll;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.props.motion === false || reduce) return;
    el.setAttribute('data-mo', '');
    this._sweep = () => {
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => {
        this._raf = 0;
        const root = this.root.current;
        if (!root) return;
        const vh = window.innerHeight || 800;
        root.querySelectorAll('[data-reveal]:not([data-on])').forEach((n) => {
          const r = n.getBoundingClientRect();
          if (r.top < vh * 0.94 && r.bottom > 0) n.setAttribute('data-on', '');
        });
        root.querySelectorAll('[data-gate]:not([data-wired])').forEach((g) => {
          g.setAttribute('data-wired', '');
          const leg = root.querySelector('[data-leg="' + g.getAttribute('data-g') + '"]');
          if (!leg) return;
          g.addEventListener('mouseenter', () => leg.setAttribute('data-hot', ''));
          g.addEventListener('mouseleave', () => leg.removeAttribute('data-hot'));
        });
      });
    };
    this._neurons(el);
    window.addEventListener('scroll', this._sweep, { passive: true, capture: true });
    window.addEventListener('resize', this._sweep, { passive: true });
    this._sweep();
    this._tick = setInterval(this._sweep, 400);
    this._lattice(el);
  }
  _lattice(root) {
    const svg = root.querySelector('[data-gatesneu]');
    if (!svg || svg.childNodes.length) return;
    const NS = 'http://www.w3.org/2000/svg', W = 1200, H = 700, N = 78;
    let seed = 11;
    const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
    const pts = [];
    for (let i = 0; i < N; i++) pts.push([40 + rnd() * (W - 80), 40 + rnd() * (H - 80)]);
    const edges = [];
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const dx = pts[i][0] - pts[j][0], dy = pts[i][1] - pts[j][1];
      if (Math.sqrt(dx * dx + dy * dy) < 108) edges.push([i, j]);
    }
    const g = document.createElementNS(NS, 'g');
    edges.forEach((e) => {
      const l = document.createElementNS(NS, 'line');
      l.setAttribute('x1', pts[e[0]][0].toFixed(1)); l.setAttribute('y1', pts[e[0]][1].toFixed(1));
      l.setAttribute('x2', pts[e[1]][0].toFixed(1)); l.setAttribute('y2', pts[e[1]][1].toFixed(1));
      g.appendChild(l);
    });
    svg.appendChild(g);
    pts.forEach((p) => {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', p[0].toFixed(1)); c.setAttribute('cy', p[1].toFixed(1)); c.setAttribute('r', 1.1);
      svg.appendChild(c);
    });
    // three signals travelling the lattice, slow enough to read as circulation
    if (edges.length) {
      for (let k = 0; k < 3; k++) {
        const e = edges[(k * 9 + 4) % edges.length];
        const dot = document.createElementNS(NS, 'circle');
        dot.setAttribute('class', 'glow'); dot.setAttribute('r', 1.8); dot.setAttribute('opacity', '.85');
        svg.appendChild(dot);
        const a = pts[e[0]], b = pts[e[1]], t0 = performance.now() + k * 1300, dur = 4400;
        const step = (now) => {
          if (!svg.isConnected) return;
          if (now > t0) {
            const p = ((now - t0) % dur) / dur, q = p < 0.5 ? p * 2 : (1 - p) * 2;
            dot.setAttribute('cx', (a[0] + (b[0] - a[0]) * q).toFixed(1));
            dot.setAttribute('cy', (a[1] + (b[1] - a[1]) * q).toFixed(1));
          }
          this._latRaf = requestAnimationFrame(step);
        };
        this._latRaf = requestAnimationFrame(step);
      }
    }
    const on = () => svg.setAttribute('data-on', '');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { io.disconnect(); on(); } }), { threshold: 0.01 });
      io.observe(svg);
      setTimeout(on, 2200);
    } else on();
  }
  _neurons(el) {
    const svg = el.querySelector('[data-neurons]');
    if (!svg || svg.childElementCount) return;
    const NS = 'http://www.w3.org/2000/svg', W = 1200, H = 620, N = 32, pts = [];
    let seed = 11;
    const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
    for (let i = 0; i < N; i++) pts.push([40 + rnd() * (W - 80), 40 + rnd() * (H - 80)]);
    const edges = [];
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const dx = pts[i][0] - pts[j][0], dy = pts[i][1] - pts[j][1];
      if (Math.hypot(dx, dy) < 200) edges.push([i, j]);
    }
    const g = document.createElementNS(NS, 'g');
    svg.appendChild(g);
    edges.forEach((e, k) => {
      const l = document.createElementNS(NS, 'line');
      l.setAttribute('x1', pts[e[0]][0].toFixed(1)); l.setAttribute('y1', pts[e[0]][1].toFixed(1));
      l.setAttribute('x2', pts[e[1]][0].toFixed(1)); l.setAttribute('y2', pts[e[1]][1].toFixed(1));
      l.style.animationDelay = (k * 26 + 200) + 'ms';
      g.appendChild(l);
    });
    pts.forEach((p) => {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', p[0].toFixed(1)); c.setAttribute('cy', p[1].toFixed(1));
      c.setAttribute('r', 1.7); c.setAttribute('opacity', '.45');
      svg.appendChild(c);
    });
    if (!edges.length) return;
    for (let k = 0; k < 3; k++) {
      const e = edges[(k * 9 + 4) % edges.length], a = pts[e[0]], b = pts[e[1]];
      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('class', 'np'); dot.setAttribute('r', 2.4); dot.setAttribute('opacity', '.7');
      svg.appendChild(dot);
      const t0 = performance.now() + k * 1300, dur = 4600;
      const step = (now) => {
        if (now > t0) {
          const p = ((now - t0) % dur) / dur, q = p < .5 ? p * 2 : (1 - p) * 2;
          dot.setAttribute('cx', (a[0] + (b[0] - a[0]) * q).toFixed(1));
          dot.setAttribute('cy', (a[1] + (b[1] - a[1]) * q).toFixed(1));
        }
        this._nraf = requestAnimationFrame(step);
      };
      this._nraf = requestAnimationFrame(step);
    }
  }
  componentDidUpdate() { if (this._sweep) this._sweep(); }
  componentWillUnmount() {
    if (this._sweep) {
      window.removeEventListener('scroll', this._sweep, { capture: true });
      window.removeEventListener('resize', this._sweep);
    }
    if (this._tick) clearInterval(this._tick);
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._nraf) cancelAnimationFrame(this._nraf);
    if (this._latRaf) cancelAnimationFrame(this._latRaf);
    this._tick = 0;
    this._raf = 0;
    this._nraf = 0;
    this._latRaf = 0;
    if (this.onScroll) window.removeEventListener('scroll', this.onScroll, { capture: true });
  }
  renderVals() {
    const tier = this.props.defaultTier || 'S2';
    return {
      rootRef: this.root,
      hdrRef: this.hdr,
      showArabic: this.props.showArabic !== false,
      isS1: tier === 'S1',
      isS2: tier === 'S2',
      isS3: tier === 'S3'
    };
  }
}
