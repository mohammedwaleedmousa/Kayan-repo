import React from 'react';
import DCLogic from '../../home/DCLogic.js';

const K4Y_ROUTES = ['k4y','campaigns','souq','audit','steps','canvas','solar','malqaf','cold','scars','canopy','library','guild','nisaa','protocol'];

const STAGES = [
  { code: 'Z-00 · STANDBY', text: 'الفرقة في وضع الاستعداد. العمل منجز بالكامل ولم يعلن. لا نشرة، ولا طلب تمويل، ولا موعد معلن.', en: 'The pod stands by. The work is finished and unannounced — no press release, no funding appeal, no published date.' },
  { code: 'Z-01 · BLACKOUT', text: 'ينقطع التيار عن كريتر. حدث يومي، وهو نافذة التشغيل التي انتظرتها الفرقة.', en: 'The grid drops in Crater. A daily event — and the operating window the pod was waiting for.' },
  { code: 'Z-02 · PATHS LIVE', text: 'تضيء الخطوات. كيلومتران من الممرات تعمل بلا شبكة، بصبغة شحنت بضوء النهار.', en: 'The steps light up. Two kilometres of pathways running off-grid, on pigment charged by daylight.' },
  { code: 'Z-03 · WALL LIVE', text: 'في اللحظة نفسها يشتغل جدار الضوء على مبنى يشرف على المسار. عرض مدته ثلاثون دقيقة، يعاد حتى الفجر.', en: 'At the same moment the Canvas of Light comes up on a building overlooking the route. A thirty-minute reel, looped until dawn.' },
  { code: 'Z-04 · DROP', text: 'تدفع فرق الإعلام مادة مدتها ستون ثانية إلى القنوات. لم يطلب تمويل، ولم ينتظر إعلان. عمل خمسين موثقا في أربعة عشر يوما.', en: 'The media pods push a sixty-second cut to the channels. No funding was requested, no announcement awaited. Fifty verified talents, fourteen days.' }
];

export default class K4yLogic extends DCLogic {
  // English leads on this wing. A stored choice wins; kyn-lang is the site-wide key,
  // so a visitor who picked a language elsewhere keeps it when they arrive here.
  static initialLang() {
    try {
      const shared = localStorage.getItem('kyn-lang');
      if (shared === 'ar' || shared === 'en') return shared;
      const own = localStorage.getItem('k4y-lang');
      if (own === 'ar' || own === 'en') return own;
    } catch (e) {}
    return 'en';
  }

  state = { route: null, drop: 0, playing: false, night: 0, mov: 0, ba: 'before', lang: K4yLogic.initialLang() };

  componentDidMount() {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.motionOn = (this.props.motion ?? true) && !reduce;
    if (this.motionOn) document.documentElement.setAttribute('data-mo', '1');

    this.onHash = () => this.readHash(true);
    window.addEventListener('hashchange', this.onHash);
    this.readHash(false);

    this.onClick = (e) => {
      const el = e.target && e.target.closest ? e.target.closest('[data-act]') : null;
      if (!el) return;
      const act = el.getAttribute('data-act');
      if (act === 'drop') this.runDrop();
      else if (act === 'night') this.setState(s => ({ night: s.night ? 0 : 1 }));
      else if (act === 'mov') this.setState({ mov: Number(el.getAttribute('data-mov')) || 0 });
      else if (act === 'lang') {
        const v = el.getAttribute('data-langset') || 'ar';
        this.setState({ lang: v });
        // Write both: the wing's own key and the site-wide one, so the choice travels.
        try { localStorage.setItem('k4y-lang', v); localStorage.setItem('kyn-lang', v); } catch (e) {}
      }
      else if (act === 'ba') this.setState({ ba: el.getAttribute('data-baset') || 'before' });
    };
    document.addEventListener('click', this.onClick);
    this.reveal();

    this.queue = () => { if (this._t) clearTimeout(this._t); this._t = setTimeout(() => this.reveal(), 60); };
    if ('MutationObserver' in window) {
      this.mo = new MutationObserver(this.queue);
      this.mo.observe(document.body, { childList: true, subtree: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState && prevState.route !== this.state.route) window.scrollTo(0, 0);
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = requestAnimationFrame(() => this.reveal());
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.onHash);
    document.removeEventListener('click', this.onClick);
    if (this.io) this.io.disconnect();
    if (this.mo) this.mo.disconnect();
    (this.timers || []).forEach(clearTimeout);
  }

  readHash(isNav) {
    const raw = (location.hash || '').replace(/^#\/?/, '').split('?')[0].trim();
    const next = K4Y_ROUTES.indexOf(raw) >= 0 ? raw : (this.props.defaultRoute || 'k4y');
    if (next !== this.state.route) this.setState({ route: next });
    if (isNav) window.scrollTo(0, 0);
  }

  runDrop() {
    (this.timers || []).forEach(clearTimeout);
    this.timers = [];
    if (this.state.drop !== 0) { this.setState({ drop: 0, playing: false }); return; }
    this.setState({ drop: 0, playing: true });
    const beats = [1, 2, 3, 4];
    const gap = this.motionOn ? 1500 : 400;
    beats.forEach((b, i) => {
      this.timers.push(setTimeout(() => this.setState({ drop: b, playing: b < 4 }), 700 + i * gap));
    });
  }

  pointer() {
    if (this._pm) return;
    const glow = () => document.querySelector('[data-glow]');
    const layers = () => Array.from(document.querySelectorAll('[data-parax]'));
    let raf = 0, tx = 0, ty = 0;
    // Glow follows the cursor with eased smoothing, one layout read + one write per frame.
    const fine = !window.matchMedia || window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    let cx = 0, cy = 0, gx = 0, gy = 0, gSeed = false, gIn = null, gRaf = 0;
    const glowStep = () => {
      gRaf = 0;
      const g = glow();
      if (!g || !this.motionOn) return;
      const host = g.parentElement.getBoundingClientRect();
      const lx = cx - host.left, ly = cy - host.top;
      if (!gSeed) { gx = lx; gy = ly; gSeed = true; }
      gx += (lx - gx) * 0.11;
      gy += (ly - gy) * 0.11;
      g.style.transform = 'translate3d(' + gx.toFixed(2) + 'px,' + gy.toFixed(2) + 'px,0)';
      const inside = ly > -60 && ly < host.height + 60;
      if (inside !== gIn) { gIn = inside; g.style.opacity = inside ? '1' : '0'; }
      if (Math.abs(lx - gx) > 0.4 || Math.abs(ly - gy) > 0.4) gRaf = requestAnimationFrame(glowStep);
    };
    this._pm = (e) => {
      if (!this.motionOn) return;
      cx = e.clientX; cy = e.clientY;
      if (fine && !gRaf) gRaf = requestAnimationFrame(glowStep);
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        layers().forEach((n) => {
          const d = parseFloat(n.getAttribute('data-parax')) || 0;
          n.style.transform = 'translate3d(' + (-tx * d * 9).toFixed(2) + 'px,' + (-ty * d * 7).toFixed(2) + 'px,0)';
        });
      });
    };
    window.addEventListener('pointermove', this._pm, { passive: true });
    this._sc = () => {
      const bar = document.querySelector('[data-progress]');
      if (!bar) return;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
    };
    window.addEventListener('scroll', this._sc, { passive: true });
  }

  reveal() {
    this.pointer();
    if (this.io) this.io.disconnect();
    const nodes = document.querySelectorAll('[data-reveal]');
    if (!this.motionOn || !('IntersectionObserver' in window)) {
      nodes.forEach(n => n.setAttribute('data-on', ''));
      return;
    }
    this.io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute('data-on', '');
        this.io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
    nodes.forEach((n, i) => {
      n.style.transitionDelay = Math.min(i % 6, 5) * 45 + 'ms';
      if (n.getBoundingClientRect().top < window.innerHeight) n.setAttribute('data-on', '');
      else this.io.observe(n);
    });
  }

  renderVals() {
    const r = this.state.route || this.props.defaultRoute || 'k4y';
    const s = STAGES[this.state.drop] || STAGES[0];
    return {
      route: r,
      dropStage: String(this.state.drop),
      stageCode: s.code,
      stageText: this.state.lang === 'en' ? (s.en || s.text) : s.text,
      langCode: this.state.lang,
      lang: this.state.lang,
      nightOn: String(this.state.night),
      movIdx: String(this.state.mov),
      baMode: this.state.ba,
      atK4y: r === 'k4y', atCampaigns: r === 'campaigns', atSouq: r === 'souq', atAudit: r === 'audit',
      atSteps: r === 'steps', atCanvas: r === 'canvas', atSolar: r === 'solar', atMalqaf: r === 'malqaf',
      atCold: r === 'cold', atScars: r === 'scars', atCanopy: r === 'canopy', atLibrary: r === 'library', atGuild: r === 'guild',
      atNisaa: r === 'nisaa', atProtocol: r === 'protocol'
    };
  }
}