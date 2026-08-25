import React from 'react';
import DCLogic from '../../home/DCLogic.js';

export default class RecordLogic extends DCLogic {
  TIERS = {
    T0: { code: 'T0', ar: 'مسجل', en: 'REGISTERED', c: '#B9B1A2', gap: 26, n: 0, note: 'سجل مفتوح، لا قيود فيه بعد' },
    T1: { code: 'T1', ar: 'معرف', en: 'IDENTIFIED', c: '#0E6E66', gap: 19, n: 2, note: 'هوية موثقة وجهة تزكية' },
    T2: { code: 'T2', ar: 'موثق', en: 'VERIFIED', c: '#12B5A4', gap: 13, n: 6, note: 'مهارة مقيسة وأعمال مقبولة' },
    T3: { code: 'T3', ar: 'مثبت', en: 'PROVEN', c: '#B8891A', gap: 9, n: 14, note: 'سجل متصل ومسؤولية فريق' },
    T4: { code: 'T4', ar: 'مؤتمن', en: 'TRUSTED', c: '#C9A227', gap: 6, n: 31, note: 'واجهة عميل ومسؤولية تسليم' }
  };
  REV_REASON = 'مخالفة نطاق العمل في العقد \u2066MD-2025-204\u2069، بقرار لجنة الالتزام.';
  RECS = {
    'A7F3-0142': { name: 'سالم عبدالله باعوم', role: 'واجهة عميل — خط التسليم المدار', tier: 'T4', opened: '2023-04-02' },
    'C1B8-0087': { name: 'رشا علي الصبري', role: 'تنفيذ ميداني — الهب، عدن', tier: 'T2', opened: '2024-08-19' },
    '3E90-0009': { name: 'مروان طه العولقي', role: 'تنفيذ ميداني', tier: 'T1', opened: '2025-01-27', revoked: { date: '2026-03-14', reason: this.REV_REASON } }
  };
  POOL = [
    { d: '2026-07-21', s: 'تمديد شبكة داخلية — 42 نقطة', ref: 'MD-2026-118', m: '118-04', h: 'a7f3c1' },
    { d: '2026-05-09', s: 'تركيب لوحات طاقة — 3 مواقع', ref: 'MD-2026-097', m: '097-02', h: '4b1e88' },
    { d: '2026-02-17', s: 'صيانة مولد 60 ك.ف.أ', ref: 'MD-2026-041', m: '041-01', h: 'd02a5f' },
    { d: '2025-11-30', s: 'تمديد كوابل — 210 م', ref: 'MD-2025-233', m: '233-03', h: '7c9048' },
    { d: '2025-09-12', s: 'تأهيل غرفة خوادم', ref: 'MD-2025-176', m: '176-05', h: 'e51b30' }
  ];

  state = {
    route: this.props.startOn || 'record',
    key: 'A7F3-0142',
    tier: this.props.tier || null,
    revoked: this.props.revoked ? { date: '2026-03-14', reason: this.REV_REASON } : null,
    drawn: false, interrupt: false, q: '', refusal: null,
    sound: false, copied: false, sharing: false, offline: false, settled: false
  };

  reduced() { return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches; }

  componentDidMount() {
    this.draw();
    this._net = () => this.setState({ offline: !navigator.onLine });
    window.addEventListener('online', this._net); window.addEventListener('offline', this._net);
    if (!navigator.onLine) this.setState({ offline: true });
    this._cut = () => {
      this.removeCut();
      if (!this.state.interrupt) this.setState({ interrupt: true });
    };
    window.addEventListener('pointerdown', this._cut, { passive: true });
    window.addEventListener('wheel', this._cut, { passive: true });
    window.addEventListener('keydown', this._cut);
    this._cutT = setTimeout(() => this.removeCut(), 1600);
  }
  removeCut() {
    if (this._cutT) { clearTimeout(this._cutT); this._cutT = null; }
    if (!this._cut) return;
    window.removeEventListener('pointerdown', this._cut);
    window.removeEventListener('wheel', this._cut);
    window.removeEventListener('keydown', this._cut);
    this._cut = null;
  }
  componentWillUnmount() {
    this.removeCut();
    clearTimeout(this._settleT);
    window.removeEventListener('online', this._net); window.removeEventListener('offline', this._net);
    if (this._ac) this._ac.close();
  }
  componentDidUpdate(prev) {
    if (prev.tier !== this.props.tier && this.props.tier) {
      this.setState({ tier: this.props.tier, key: 'A7F3-0142', drawn: false, settled: false, interrupt: false }, () => this.draw());
    }
    if (prev.revoked !== this.props.revoked) {
      this.setState({ revoked: this.props.revoked ? { date: '2026-03-14', reason: this.REV_REASON } : null });
    }
  }
  draw() {
    clearTimeout(this._settleT);
    requestAnimationFrame(() => requestAnimationFrame(() => this.setState({ drawn: true }, () => {
      this._settleT = setTimeout(() => this.setState({ settled: true }), 1300);
    })));
  }

  rec() {
    const r = this.RECS[this.state.key] || this.RECS['A7F3-0142'];
    const t = this.TIERS[this.state.tier || r.tier] || this.TIERS.T4;
    return { r: r, t: t, rev: this.state.revoked || r.revoked || null };
  }

  // ---------- one cue, consent-gated: stamp, on مقام رست ----------
  bus() {
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
    if (!this._ac) { this._ac = new C(); const g = this._ac.createGain(); g.gain.value = 0.34; g.connect(this._ac.destination); this._out = g; }
    if (this._ac.state === 'suspended') this._ac.resume();
    return this._ac;
  }
  pk(f, t0, dur, gain) {
    const ac = this._ac, o = ac.createOscillator(), g = ac.createGain(), lp = ac.createBiquadFilter();
    o.type = 'triangle'; o.frequency.value = f;
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(3600, t0); lp.frequency.exponentialRampToValueAtTime(1200, t0 + dur);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(gain, t0 + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(lp); lp.connect(g); g.connect(this._out); o.start(t0); o.stop(t0 + dur + 0.05);
  }
  stamp() {
    if (!this.state.sound || this.props.sound === false) return;
    const ac = this.bus(); if (!ac) return;
    const d = 587.33, c = n => d * Math.pow(2, n / 1200), t = ac.currentTime + 0.03;
    this.pk(c(700), t, 0.34, 0.16); this.pk(c(1200), t + 0.14, 0.55, 0.15);
  }

  goRecord(key, tier) {
    this.stamp();
    const apply = () => new Promise(res => this.setState({
      route: 'record', key: key, tier: tier || null, revoked: null, refusal: null, q: '', drawn: false, settled: false, interrupt: false
    }, res));
    if (document.startViewTransition && !this.reduced()) {
      document.startViewTransition(apply).finished.then(() => this.draw()).catch(() => this.draw());
    } else apply().then(() => this.draw());
  }

  renderVals() {
    const I = s => '\u2066' + s + '\u2069';
    const { r, t, rev } = this.rec();
    const red = this.reduced();
    const drawn = this.state.drawn || red;
    const inter = this.state.interrupt;
    const H = 132, gap = t.gap, n = Math.max(3, Math.floor(H / gap));
    const strata = Array.from({ length: n }, (_, i) => ({
      style: this.state.settled ? {
        position: 'absolute', insetInlineStart: 0, insetInlineEnd: 0, top: (i * gap) + 'px', height: '1px',
        background: t.c, opacity: rev ? .34 : .92
      } : {
        position: 'absolute', insetInlineStart: 0, insetInlineEnd: 0, top: (i * gap) + 'px', height: '1px',
        background: t.c, opacity: rev ? .34 : .92, transformOrigin: 'right',
        transform: drawn ? 'scaleX(1)' : 'scaleX(0)',
        transition: (!drawn || red) ? 'none' : ('transform ' + (inter ? 140 : 400) + 'ms cubic-bezier(.16,1,.3,1) ' + (inter ? 0 : Math.min(i * 20, 560)) + 'ms')
      }
    }));

    const accepted = t.n;
    const ledger = this.POOL.slice(0, Math.min(5, accepted)).map(e => ({ d: e.d, s: e.s, ref: 'عقد ' + I(e.ref) + ' · محضر استلام ' + I(e.m), h: '#' + e.h }));
    const id = Object.keys(this.RECS).find(k => this.RECS[k] === r) || 'A7F3-0142';

    const ent = (delay) => this.state.settled ? {} : ({
      opacity: drawn ? 1 : 0,
      transform: drawn ? 'translateY(0)' : 'translateY(8px)',
      transition: (!drawn || red) ? 'none' : ('opacity 400ms cubic-bezier(.16,1,.3,1) ' + (inter ? 0 : delay) + 'ms, transform 400ms cubic-bezier(.16,1,.3,1) ' + (inter ? 0 : delay) + 'ms')
    });

    const stateBtn = (on) => ({
      minHeight: '38px', padding: '0 14px', borderRadius: '9px', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap',
      border: '1px solid ' + (on ? 'rgba(250,246,236,.9)' : 'rgba(250,246,236,.3)'),
      background: on ? '#FAF6EC' : 'transparent', color: on ? '#052E2B' : 'rgba(250,246,236,.86)'
    });
    const curTier = this.state.tier || r.tier;
    const states = ['T0', 'T1', 'T2', 'T3', 'T4'].map(k => ({
      label: this.TIERS[k].ar,
      style: stateBtn(this.state.route === 'record' && curTier === k && !rev),
      go: () => this.setState({ route: 'record', key: 'A7F3-0142', tier: k, revoked: null, drawn: false, settled: false, interrupt: false }, () => this.draw())
    }));
    states.push({
      label: 'سجل ملغى', style: stateBtn(this.state.route === 'record' && !!rev),
      go: () => this.setState({ route: 'record', key: '3E90-0009', tier: null, revoked: null, drawn: false, settled: false, interrupt: false }, () => this.draw())
    });
    states.push({
      label: 'شاشة التحقق', style: stateBtn(this.state.route === 'lookup' && !this.state.refusal),
      go: () => this.setState({ route: 'lookup', refusal: null })
    });
    states.push({
      label: 'قرار مسبب', style: stateBtn(this.state.route === 'lookup' && !!this.state.refusal),
      go: () => this.setState({
        route: 'lookup', q: 'A7F3-9999',
        refusal: { t: 'لا سجل بهذا المعرف.', r: 'لم يصدر عن كيان سجل يحمل المعرف \u2066A7F3-9999\u2069.', a: 'تأكد من المعرف مع الجهة التي زودتك به.', n: 'لا يعني ذلك نفي العمل؛ يعني أن لا سجل صادرا عن كيان بهذا الرقم.' }
      })
    });

    const f = this.state.refusal;

    return {
      rootStyle: { minHeight: '100vh', background: '#FAF6EC', color: '#052E2B', fontFamily: "'IBM Plex Sans Arabic',sans-serif", '--tier': t.c },
      onRecord: this.state.route === 'record',
      onLookup: this.state.route === 'lookup',
      offline: this.state.offline,

      name: r.name, role: r.role, idFull: 'KYN · ' + id,
      headStyle: ent(0),
      tierRowStyle: Object.assign({ marginTop: '26px' }, ent(60)),
      tierAr: t.ar, tierCode: t.code + ' · ' + t.en, tierNote: t.note,
      tierBarStyle: { width: '30px', height: '3px', borderRadius: '2px', background: t.c, flexShrink: 0 },

      statusStyle: Object.assign({
        marginTop: '20px', padding: '16px 18px', borderRadius: '16px',
        border: '1px solid ' + (rev ? '#B23A31' : '#EDE5D2'), background: rev ? 'transparent' : '#fff'
      }, ent(120)),
      statusDotStyle: { width: '9px', height: '9px', borderRadius: '50%', background: rev ? '#B23A31' : t.c, flexShrink: 0 },
      statusWordStyle: { fontFamily: "'Alexandria',sans-serif", fontWeight: 500, fontSize: '20px', color: rev ? '#B23A31' : '#052E2B' },
      statusWord: rev ? 'ملغاة' : 'سارية',
      statusEn: rev ? 'REVOKED' : 'IN FORCE',
      statusLine: rev ? ('ألغي السجل في ' + I(rev.date) + '. يبقى القيد ظاهرا ولا يمحى.') : ('السجل قائم منذ ' + I(r.opened) + '، ولم يرد عليه اعتراض.'),
      statusReason: rev ? ('السبب: ' + rev.reason) : '',
      revoked: !!rev,

      accepted: String(accepted),
      strata: strata,
      ledger: ledger,
      noEntries: ledger.length === 0,
      chainHead: ledger.length ? ('CHAIN HEAD · 9f2c…' + ledger[0].h.slice(1)) : 'CHAIN · none',
      permalink: 'kayanwork.com/v/' + id,
      lastUpdate: ledger.length ? ledger[0].d : r.opened,

      q: this.state.q,
      onQ: e => this.setState({ q: e.target.value }),
      submit: e => {
        e.preventDefault();
        const q = (this.state.q || '').trim().toUpperCase();
        if (!/^[A-Z0-9]{4}-[0-9]{4}$/.test(q)) {
          return this.setState({ refusal: { t: 'لم يقبل الطلب.', r: 'المعرف غير مطابق للصيغة المعتمدة — أربعة رموز، شرطة، أربعة أرقام.', a: 'راجع البطاقة أو محضر الاستلام، ثم أعد الإدخال.', n: '' } });
        }
        if (!this.RECS[q]) {
          return this.setState({ refusal: { t: 'لا سجل بهذا المعرف.', r: 'لم يصدر عن كيان سجل يحمل المعرف ' + I(q) + '.', a: 'تأكد من المعرف مع الجهة التي زودتك به.', n: 'لا يعني ذلك نفي العمل؛ يعني أن لا سجل صادرا عن كيان بهذا الرقم.' } });
        }
        this.goRecord(q);
      },
      refusal: !!f,
      refusalTitle: f ? f.t : '', refusalReason: f ? f.r : '', refusalAction: f ? f.a : '', refusalNote: f ? f.n : '',

      soundOn: this.state.sound,
      soundLabel: this.state.sound ? 'الصوت مفعل' : 'تفعيل الصوت',
      soundBtnStyle: {
        minHeight: '44px', padding: '0 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap',
        border: '1px solid rgba(250,246,236,.28)', background: 'transparent', color: 'rgba(250,246,236,.8)'
      },
      toggleSound: () => this.setState({ sound: !this.state.sound }, () => this.stamp()),

      goLookup: () => this.setState({ route: 'lookup', refusal: null, q: '' }),
      doPrint: () => window.print(),
      shareLabel: this.state.sharing ? 'يجري التحضير' : 'مشاركة السجل',
      share: () => this.share(r, t, id, accepted, rev),
      badgeLabel: this.state.copied ? 'نسخت الشارة' : 'نسخ شارة الفئة',
      copyBadge: () => this.copyBadge(t, id),
      states: states
    };
  }

  async copyBadge(t, id) {
    const svg = '<a href="https://kayanwork.com/v/' + id + '"><svg xmlns="http://www.w3.org/2000/svg" width="196" height="44" viewBox="0 0 196 44" role="img" aria-label="' + t.ar + ' في كيان">' +
      '<rect width="196" height="44" rx="10" fill="#052E2B"/><rect x="16" y="20.5" width="26" height="3" rx="1.5" fill="' + t.c + '"/>' +
      '<text x="180" y="27" text-anchor="end" font-family="system-ui,sans-serif" font-size="14" fill="#FAF6EC" direction="rtl">' + t.ar + ' في كيان</text>' +
      '<text x="52" y="27" font-family="ui-monospace,monospace" font-size="10" letter-spacing="1.6" fill="' + t.c + '">' + t.code + '</text></svg></a>';
    try { await navigator.clipboard.writeText(svg); }
    catch (err) {
      const ta = document.createElement('textarea'); ta.value = svg; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e2) { }
      document.body.removeChild(ta);
    }
    this.setState({ copied: true });
    clearTimeout(this._cp); this._cp = setTimeout(() => this.setState({ copied: false }), 2200);
  }

  async share(r, t, id, accepted, rev) {
    if (this.state.sharing) return;
    this.setState({ sharing: true });
    try {
      const W = 1080, H = 1350, c = document.createElement('canvas');
      c.width = W; c.height = H;
      const x = c.getContext('2d');
      try {
        await Promise.all([
          document.fonts.load("500 84px Alexandria"), document.fonts.load("500 34px Alexandria"),
          document.fonts.load("400 30px 'IBM Plex Sans Arabic'"), document.fonts.load("500 150px 'Instrument Sans'")
        ]);
      } catch (e) { }
      x.fillStyle = '#052E2B'; x.fillRect(0, 0, W, H);
      x.strokeStyle = 'rgba(250,246,236,.16)'; x.lineWidth = 2; x.strokeRect(56, 56, W - 112, H - 112);
      const R = W - 112, L = 112;
      x.direction = 'rtl'; x.textAlign = 'right';
      x.fillStyle = '#FAF6EC'; x.font = "500 40px Alexandria, sans-serif"; x.fillText('كيان', R, 186);
      x.textAlign = 'left'; x.direction = 'ltr';
      x.fillStyle = 'rgba(250,246,236,.6)'; x.font = "500 20px 'Instrument Sans', sans-serif";
      x.fillText('PUBLIC REGISTER', L, 180);
      x.strokeStyle = 'rgba(250,246,236,.16)'; x.lineWidth = 1;
      x.beginPath(); x.moveTo(L, 226); x.lineTo(R, 226); x.stroke();

      x.direction = 'rtl'; x.textAlign = 'right';
      x.fillStyle = 'rgba(250,246,236,.66)'; x.font = "400 26px 'IBM Plex Sans Arabic', sans-serif";
      x.fillText('سجل عمل', R, 300);
      x.fillStyle = '#FAF6EC'; x.font = "500 76px Alexandria, sans-serif";
      x.fillText(r.name, R, 396);
      x.fillStyle = 'rgba(250,246,236,.72)'; x.font = "400 27px 'IBM Plex Sans Arabic', sans-serif";
      x.fillText(r.role, R, 444);

      x.fillStyle = t.c; x.fillRect(R - 116, 500, 116, 5);
      x.fillStyle = '#FAF6EC'; x.font = "500 44px Alexandria, sans-serif";
      x.fillText(t.ar, R, 578);
      x.textAlign = 'left'; x.direction = 'ltr';
      x.fillStyle = t.c; x.font = "600 22px 'Instrument Sans', sans-serif";
      x.fillText(t.code + ' · ' + t.en, L, 574);

      x.textAlign = 'right'; x.direction = 'rtl';
      x.fillStyle = '#FAF6EC'; x.font = "500 152px 'Instrument Sans', sans-serif";
      x.textAlign = 'left'; x.fillText(String(accepted), L, 800);
      x.fillStyle = 'rgba(250,246,236,.72)'; x.font = "400 27px 'IBM Plex Sans Arabic', sans-serif";
      x.direction = 'rtl'; x.textAlign = 'right'; x.fillText('تسليم مقبول', R, 770);
      x.fillStyle = rev ? '#E08A82' : 'rgba(250,246,236,.72)';
      x.fillText(rev ? 'السجل ملغى في ' + rev.date : 'السجل ساري', R, 812);

      const gy = 880, gh = 240;
      x.save(); x.beginPath(); x.rect(L, gy, R - L, gh); x.clip();
      x.fillStyle = t.c; x.globalAlpha = rev ? .34 : .9;
      const g2 = t.gap * 2.2;
      for (let i = 0; i * g2 < gh; i++) x.fillRect(L, gy + i * g2, R - L, 2);
      x.globalAlpha = 1;
      if (rev) { x.strokeStyle = '#B23A31'; x.lineWidth = 4; x.beginPath(); x.moveTo(L, gy + gh * .62); x.lineTo(R, gy + gh * .38); x.stroke(); }
      x.restore();

      x.strokeStyle = 'rgba(250,246,236,.16)'; x.lineWidth = 1;
      x.beginPath(); x.moveTo(L, 1178); x.lineTo(R, 1178); x.stroke();
      x.direction = 'ltr'; x.textAlign = 'left';
      x.fillStyle = '#FAF6EC'; x.font = "500 27px 'Instrument Sans', sans-serif";
      x.fillText('kayanwork.com/v/' + id, L, 1232);
      x.direction = 'rtl'; x.textAlign = 'right';
      x.fillStyle = 'rgba(250,246,236,.62)'; x.font = "400 24px 'IBM Plex Sans Arabic', sans-serif";
      x.fillText('تحقق بنفسك', R, 1230);

      const blob = await new Promise(res => c.toBlob(res, 'image/png'));
      const file = new File([blob], 'kayan-record-' + id + '.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'سجل عمل — كيان' });
      } else {
        const u = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = u; a.download = file.name; document.body.appendChild(a); a.click();
        document.body.removeChild(a); setTimeout(() => URL.revokeObjectURL(u), 4000);
      }
    } catch (e) { }
    this.setState({ sharing: false });
  }
}