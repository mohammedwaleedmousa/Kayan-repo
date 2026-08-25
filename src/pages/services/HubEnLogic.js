import React from 'react';
import DCLogic from '../../home/DCLogic.js';

const CYCLE_EN = [
  'a shared commons open to all',
  'hot desks booked by the day',
  'rooms that close when work needs silence',
  'a hall for meetings and workshops',
  'a café open from the morning'
];

export default class HubEnLogic extends DCLogic {
  constructor(props) {
    super(props);
    this.root = React.createRef();
    this.hdr = React.createRef();
    this.state = { i: 0, playing: false };
  }
  componentDidMount() {
    const el = this.root.current;
    if (!el) return;
    const hero = el.querySelector('[data-hero]');
    const setHdr = (on) => {
      const h = this.hdr.current;
      if (!h) return;
      h.style.background = on ? 'rgba(250,246,236,.92)' : 'transparent';
      h.style.borderBottomColor = on ? 'rgba(42,29,12,.14)' : 'transparent';
      h.style.backdropFilter = on ? 'blur(16px)' : 'none';
    };
    setHdr(false);
    if (hero) {
      const sentinel = document.createElement('div');
      sentinel.style.cssText = 'position:absolute;top:30px;left:0;width:1px;height:1px;pointer-events:none;';
      hero.appendChild(sentinel);
      this.hdrIo = new IntersectionObserver(([e]) => setHdr(!e.isIntersecting), { threshold: 0 });
      this.hdrIo.observe(sentinel);
    }

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      this.timer = setInterval(() => {
        this.setState(s => ({ i: (s.i + 1) % CYCLE_EN.length }));
      }, 3200);
    }
    if (this.props.motion === false || reduce) return;
    el.setAttribute('data-mo', '');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.setAttribute('data-on', ''); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    this.io = io;
    this.bio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { this.buildOn(e.target); this.bio.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    this.scan();
    this.initCounters();
    this.initPlan();
    this.initParallax();
  }
  initParallax() {
    const el = this.root.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const birds = Array.from(el.querySelectorAll('[data-bird]'));
    if (!birds.length) return;
    const st = birds.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 }));
    let raf = 0, idle = 0;
    const tick = () => {
      let live = false;
      birds.forEach((b, i) => {
        const s = st[i];
        s.vx = (s.vx + (s.tx - s.x) * 0.11) * 0.74;
        s.vy = (s.vy + (s.ty - s.y) * 0.11) * 0.74;
        s.x += s.vx; s.y += s.vy;
        if (Math.abs(s.tx - s.x) > 0.06 || Math.abs(s.vx) > 0.06) live = true;
        b.style.transform = 'translate3d(' + s.x.toFixed(2) + 'px,' + s.y.toFixed(2) + 'px,0) rotate(' + (s.x * 0.085).toFixed(2) + 'deg)';
      });
      idle = live ? 0 : idle + 1;
      raf = idle < 40 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e) => {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      const nx = (e.clientX - cx) / cx, ny = (e.clientY - cy) / cy;
      birds.forEach((b, i) => {
        const d = parseFloat(b.getAttribute('data-bird')) || 1;
        st[i].tx = nx * 18 * d;
        st[i].ty = ny * 12 * d;
      });
      idle = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    this.onMove = onMove;
    this.stopRaf = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
  }
  componentDidUpdate() { this.scan(); }
  scan() {
    const el = this.root.current;
    if (!el || !this.io) return;
    el.querySelectorAll('[data-reveal]:not([data-on]),[data-label]:not([data-on]),[data-rails]:not([data-on]),[data-stats]:not([data-on])').forEach((n) => {
      if (n.getBoundingClientRect().top < window.innerHeight * 0.94) { n.setAttribute('data-on', ''); return; }
      this.io.observe(n);
    });
    el.querySelectorAll('[data-build]:not([data-on])').forEach((n) => {
      if (n.getBoundingClientRect().top < window.innerHeight * 0.94) this.buildOn(n);
      else this.bio.observe(n);
    });
  }
  /* modules assemble: structural edge first, ground second, content last */
  buildOn(n) {
    if (n.hasAttribute('data-on')) return;
    const d = Number(n.getAttribute('data-build-delay') || 0);
    setTimeout(() => {
      n.setAttribute('data-edge', '');
      setTimeout(() => n.setAttribute('data-on', ''), 190);
    }, d);
  }
  /* figures land on their real value — the final string is the authored one */
  initCounters() {
    const el = this.root.current; if (!el) return;
    const nodes = Array.from(el.querySelectorAll('[data-count]'));
    if (!nodes.length) return;
    const run = (n) => {
      if (n.dataset.counted) return;
      n.dataset.counted = '1';
      const final = n.textContent;
      const m = final.match(/(\D*)(\d+)(\D*)/);
      if (!m) return;
      const pre = m[1], target = Number(m[2]), post = m[3];
      const t0 = performance.now(), dur = 1100;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        n.textContent = p < 1 ? (pre + Math.round(target * e) + post) : final;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    this.cio = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { setTimeout(() => run(e.target), 520); this.cio.unobserve(e.target); } });
    }, { threshold: 0.4 });
    nodes.forEach((n) => this.cio.observe(n));
  }
  /* drafting ground drifts a few pixels with scroll — depth, not parallax */
  initPlan() {
    const el = this.root.current; if (!el) return;
    const floor = el.querySelector('#floor'); if (!floor) return;
    let raf = 0;
    this.planScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = floor.getBoundingClientRect();
        const p = Math.max(-1, Math.min(1, (window.innerHeight / 2 - r.top) / (r.height || 1)));
        floor.style.setProperty('--plan', (p * 7).toFixed(2) + 'px');
      });
    };
    window.addEventListener('scroll', this.planScroll, { passive: true });
    this.planScroll();
  }
  componentWillUnmount() {
    if (this.io) this.io.disconnect();
    if (this.bio) this.bio.disconnect();
    if (this.cio) this.cio.disconnect();
    if (this.planScroll) window.removeEventListener('scroll', this.planScroll);
    if (this.timer) clearInterval(this.timer);
    if (this.hdrIo) this.hdrIo.disconnect();
    if (this.onMove) window.removeEventListener('pointermove', this.onMove);
    if (this.stopRaf) this.stopRaf();
    if (this.ctx && this.ctx.close) this.ctx.close();
  }
  playChime() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return 0;
    if (!this.ctx) this.ctx = new AC();
    const ctx = this.ctx;
    if (ctx.state === 'suspended') ctx.resume();
    const t0 = ctx.currentTime + 0.03;
    const notes = [196.00, 261.63, 329.63];
    const step = 0.26;
    notes.forEach((f, n) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      const t = t0 + n * step;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.085, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.95);
      osc.connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.0);
    });
    return (notes.length - 1) * step + 1.0;
  }
  renderVals() {
    const i = this.state.i;
    const rail = (n) => (n === i ? '#A8710F' : '#E4D8BC');
    return {
      rootRef: this.root,
      hdrRef: this.hdr,
      showArabic: this.props.showArabic !== false,
      cycleText: CYCLE_EN[i],
      cycleKey: 'c' + i,
      rail0: rail(0), rail1: rail(1), rail2: rail(2), rail3: rail(3), rail4: rail(4),
      ringState: this.state.playing ? 'on' : 'off',
      soundLabel: this.state.playing ? 'Playing' : 'Hear the place',
      toggleSound: () => {
        if (this.state.playing) return;
        const dur = this.playChime();
        if (!dur) return;
        this.setState({ playing: true });
        clearTimeout(this.stopT);
        this.stopT = setTimeout(() => this.setState({ playing: false }), dur * 1000);
      }
    };
  }
}