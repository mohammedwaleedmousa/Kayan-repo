import React from 'react';
import DCLogic from '../../home/DCLogic.js';

const CYCLE_AR = [
  'مساحة مشتركة تفتح بلا مقابل',
  'مكاتب مرنة تحجز باليوم',
  'غرف تغلق حين يحتاج العمل صمتا',
  'قاعة تتسع للقاء وللورشة',
  'مقهى يفتح من الصباح'
];

export default class HubArLogic extends DCLogic {
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
      h.style.borderBottomColor = on ? 'rgba(42,29,12,.14)' : 'rgba(42,29,12,.18)';
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
        this.setState(s => ({ i: (s.i + 1) % CYCLE_AR.length }));
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
    this.scan();
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
    el.querySelectorAll('[data-reveal]:not([data-on])').forEach((n) => {
      if (n.getBoundingClientRect().top < window.innerHeight * 0.94) { n.setAttribute('data-on', ''); return; }
      this.io.observe(n);
    });
  }
  componentWillUnmount() {
    if (this.io) this.io.disconnect();
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
      showLatin: this.props.showLatin !== false,
      cycleText: CYCLE_AR[i],
      cycleKey: 'c' + i,
      rail0: rail(0), rail1: rail(1), rail2: rail(2), rail3: rail(3), rail4: rail(4),
      ringState: this.state.playing ? 'on' : 'off',
      soundLabel: this.state.playing ? 'يعزف الآن' : 'اسمع نغمة المكان',
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