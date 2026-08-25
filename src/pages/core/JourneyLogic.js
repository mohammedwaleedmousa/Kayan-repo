import React from 'react';
import DCLogic from '../../home/DCLogic.js';

export default class JourneyLogic extends DCLogic {
  state = { stage: 0, q: 0, name: '', phone: '', spec: '', vPhase: 0, escrow: 0, refused: false, armed: false, lang: JourneyLogic.initialLang() };

  // English leads on first visit. A language chosen anywhere else on the site
  // (kyn-lang) still travels here and wins.
  static initialLang() {
    try { const v = localStorage.getItem('kyn-lang'); if (v === 'ar' || v === 'en') return v; } catch (e) {}
    return 'en';
  }
  root = { current: null };
  E(ar, en) { return this.state.lang === 'en' ? en : ar; }
  _syncDir() {
    const el = this.root && this.root.current; if (!el) return;
    const en = this.state.lang === 'en';
    el.setAttribute('data-lang', en ? 'en' : 'ar');
    el.setAttribute('dir', en ? 'ltr' : 'rtl');
    el.style.fontFamily = en ? "'Instrument Sans','IBM Plex Sans Arabic',sans-serif" : "'IBM Plex Sans Arabic',sans-serif";
  }
  componentDidMount() { this._syncDir(); }
  componentDidUpdate(pp, ps) { if (!ps || ps.lang !== this.state.lang) this._syncDir(); }
  setLang(v) {
    if (v === this.state.lang) return;
    try { localStorage.setItem('kyn-lang', v); } catch (e) {}
    this.setState({ lang: v });
  }

  reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion:reduce)').matches;
  componentWillUnmount() { if (this._ac) this._ac.close(); }

  // ---------- sonic: same engine and the same maqam as the master document ----------
  ac() { if (!this.state.armed) return null; if (!this._ac) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; this._ac = new C(); } if (this._ac.state === 'suspended') this._ac.resume(); return this._ac; }
  bus() {
    if (this._out) return;
    const ac = this._ac, m = ac.createGain(); m.gain.value = 0.15;
    const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 150;
    const dly = ac.createDelay(); dly.delayTime.value = 0.112;
    const fb = ac.createGain(); fb.gain.value = 0.2;
    const wet = ac.createGain(); wet.gain.value = 0.26;
    m.connect(hp); hp.connect(ac.destination); hp.connect(dly); dly.connect(fb); fb.connect(dly); dly.connect(wet); wet.connect(ac.destination);
    this._out = m;
  }
  deg() { const d = 587.33, c = n => d * Math.pow(2, n / 1200); return { drone: d / 4, low: d / 2, d: d, n3: c(347), g: c(500), a: c(700), oct: c(1200), high: c(1200) * 1.5 }; }
  pluck(f, t0, dur, gain, type) {
    const ac = this._ac, o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(), g2 = ac.createGain(), lp = ac.createBiquadFilter();
    o.type = type || 'triangle'; o.frequency.value = f;
    o2.type = 'sawtooth'; o2.frequency.value = f * 2.002; g2.gain.value = 0.12;
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(3600, t0); lp.frequency.exponentialRampToValueAtTime(1200, t0 + dur);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(gain, t0 + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(this._out);
    o.start(t0); o2.start(t0); o.stop(t0 + dur + 0.05); o2.stop(t0 + dur + 0.05);
  }
  drone(f, t0, dur, gain) {
    const ac = this._ac, o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(gain, t0 + 0.25); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(this._out); o.start(t0); o.stop(t0 + dur + 0.05);
  }
  fire(name) {
    const ac = this.ac(); if (!ac) return;
    this.bus();
    const t = ac.currentTime + 0.03, k = this.deg();
    if (name === 'verify') { this.pluck(k.a, t, 0.2, 0.15); this.pluck(k.oct, t + 0.08, 0.3, 0.12); }
    if (name === 'tier') { [k.d, k.n3, k.a, k.oct].forEach((f, i) => this.pluck(f, t + i * 0.09, 0.6, 0.15)); this.pluck(k.high, t + 0.4, 0.7, 0.06, 'sine'); }
    if (name === 'accept') { [[k.d, 0], [k.g, 0.09], [k.a, 0.18], [k.oct, 0.3]].forEach(x => this.pluck(x[0], t + x[1], 1.3, 0.13)); this.drone(k.drone, t, 2.0, 0.085); }
    if (name === 'halt') { this.pluck(k.n3, t, 0.42, 0.13); this.pluck(k.d, t + 0.13, 0.5, 0.11); }
  }

  // ---------- seal: the same derivation as KYN-SEAL-01 ----------
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
    const b = Array.from(new TextEncoder().encode(str)), bitLen = b.length * 8;
    b.push(0x80); while (b.length % 64 !== 56) b.push(0);
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
        const S1 = rr(e,6) ^ rr(e,11) ^ rr(e,25), ch = (e & f) ^ (~e & g);
        const t1 = (h + S1 + ch + K[j] + w[j]) | 0;
        const S0 = rr(a,2) ^ rr(a,13) ^ rr(a,22), mj = (a & bb) ^ (a & c) ^ (bb & c);
        const t2 = (S0 + mj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = bb; bb = a; a = (t1 + t2) | 0;
      }
      const add = [a,bb,c,d,e,f,g,h];
      H = H.map((v, k2) => (v + add[k2]) | 0);
    }
    return H.map(v => (v >>> 0).toString(16).padStart(8, '0')).join('').toUpperCase();
  }
  runs(hex, cell) {
    const bit = i => (parseInt(hex[i >> 2], 16) >> (3 - (i & 3))) & 1;
    const N = 11, W = [0.30, 0.46, 0.64, 0.84], out = [];
    for (let r = 0; r < N; r++) {
      const hgt = W[(bit(66 + r * 2) << 1) | bit(66 + r * 2 + 1)] * cell, on = [];
      for (let c = 0; c < N; c++) on.push(bit(r * 6 + (c <= 5 ? c : 10 - c)));
      let c = 0, any = false;
      while (c < N) {
        if (on[c]) { const s = c; while (c < N && on[c]) c++;
          out.push({ x: +(s*cell).toFixed(2), y: +(r*cell + (cell-hgt)/2).toFixed(2), w: +((c-s)*cell - cell*0.2).toFixed(2), h: +hgt.toFixed(2), rx: +Math.min(hgt/2, cell*0.16).toFixed(2) });
          any = true;
        } else c++;
      }
      if (!any) out.push({ x: +(cell*0.9).toFixed(2), y: +(r*cell + cell/2 - cell*0.045).toFixed(2), w: +(cell*9.2).toFixed(2), h: +(cell*0.09).toFixed(2), rx: 0.5 });
    }
    return out;
  }

  qs() {
    return [
      { key: 'name', label: this.E('ما اسمك كما هو في وثيقتك الرسمية؟', 'What is your name as it appears on your official document?'), hint: this.E('الاسم الرباعي', 'Full four-part name'), why: this.E('يقيد الاسم كما في الوثيقة ليطابق ما يظهر على البطاقة وفي المحاضر. ولا يعدل بعد صدور الفئة إلا بقرار مسبب.', 'The name is entered as on the document so it matches the card and the records. After a tier is issued it is amended only by reasoned decision.') },
      { key: 'phone', label: this.E('رقم يصلك عليه واتساب', 'A number that reaches you on WhatsApp'), hint: '+967 …', why: this.E('التكليفات وقرارات القبول ترسل على هذا الرقم. ولا يستعمل في تسويق، ولا يشارك مع عميل قبل اعتماد التكليف.', 'Assignments and acceptance decisions are sent to this number. It is not used for marketing, and is not shared with a client before an assignment is approved.') },
      { key: 'spec', label: this.E('ما تخصصك الدقيق؟', 'What is your exact specialisation?'), hint: this.E('مثال: تصميم واجهات', 'e.g. interface design'), why: this.E('يبنى عليه الترشيح للفرق. الوصف الدقيق يرفع فرصك أكثر من الوصف الواسع.', 'Pod nomination is built on it. A precise description raises your chances more than a broad one.') }
    ];
  }

  renderVals() {
    const s = this.state, Q = this.qs(), cur = Q[Math.min(s.q, 2)];
    const stage = s.stage;
    const name = s.name || this.E('نورا سعيد باسلامة', 'Noura Saeed Baslama');
    const regId = 'A7F3-0142';

    const stages = this.E(['التسجيل','التوثيق','الفئة','التكليف','الضمان','محضر الاستلام','الصرف'], ['Registration','Verification','Tier','Assignment','Escrow','Acceptance record','Payment']);
    const rail = stages.map((label, i) => {
      const on = i === stage, done = i < stage;
      return {
        no: String(i + 1).padStart(2, '0'), label, cur: on ? 'step' : 'false',
        onAttr: on ? '' : null, w: on ? '600' : '400',
        fg: on ? '#052E2B' : (done ? '#0E6E66' : '#7C8A83'),
        go: () => this.setState({ stage: i, refused: false })
      };
    });

    // append-only register log, built from how far the flow has come
    const L = [];
    const push = (t, what, by, fg) => L.push({ t, what, by, fg: fg || 'rgba(250,246,236,.9)' });
    if (stage >= 0 && s.q > 0) push('09:41:02', this.E('فتح ملف تسجيل', 'Registration file opened'), 'SELF · WHATSAPP ENTRY');
    if (s.q >= 1 || stage >= 1) push('09:41:38', this.E('قيد الاسم: ', 'Name entered: ') + name, 'SELF');
    if (s.q >= 2 || stage >= 1) push('09:42:10', this.E('قيد قناة الاتصال', 'Contact channel entered'), 'SELF');
    if (stage >= 1) push('09:42:44', this.E('اكتمل ملف التسجيل — ثلاثة حقول', 'Registration file complete — three fields'), 'SELF');
    if (stage >= 1 && s.vPhase >= 1) push('09:43:01', this.E('فحص آلي: أربعة محاور مستوفاة، ومحور يحتاج مراجعة', 'Automated check: four axes met, one axis needs review'), 'SYSTEM · NIGHTLY COMPUTE');
    if (stage >= 2) push('11:20:16', this.E('اعتماد التوثيق ومنح الفئة الأولى', 'Verification approved and tier one granted'), this.E('POS-TAL-VER · اعتماد إنسان', 'POS-TAL-VER · HUMAN APPROVAL'));
    if (stage >= 2) push('11:20:17', this.E('إصدار بطاقة وفتح صفحة سجل عامة', 'Card issued and a public record page opened'), 'SYSTEM');
    if (stage >= 3) push('14:02:55', this.E('ترشيح لفريق تنفيذ على العقد MD-2026-204', 'Nominated to a delivery pod on contract MD-2026-204'), 'SYSTEM · MATCHING');
    if (stage >= 4) push('14:19:03', this.E('قبول التكليف وتثبيت حصة الدور', 'Assignment accepted and the role share fixed'), 'SELF');
    if (stage >= 4) push('14:51:40', this.E('إيداع المستحق كاملا في حساب الضمان', 'Full amount deposited into the escrow account'), 'CLIENT · TADAMON ESCROW');
    if (stage >= 5) push('2026-07-18', this.E('تسليم المخرجات للمراجعة', 'Deliverables handed over for review'), 'SELF');
    if (s.refused) push('2026-07-19', this.E('رد بتحفظ — نقص ملف الأصول المفتوحة', 'Returned with reservation — open-source asset file missing'), this.E('POS-DEL-QA · قرار مسبب', 'POS-DEL-QA · REASONED DECISION'), '#FF9A8F');
    if (stage >= 6) push('2026-07-21', this.E('قبول التسليم كاملا وتحرير محضر الاستلام', 'Handover accepted in full and the acceptance record drawn up'), 'CLIENT + POS-DEL-QA', '#7FE7DA');
    if (stage >= 6) push('2026-07-21', this.E('ختم المحضر وقيده في السلسلة', 'Record sealed and entered in the chain'), 'SYSTEM · KYN-SEAL-01', '#7FE7DA');
    if (stage >= 6) push('2026-07-21', this.E('الإفراج عن المستحق وصرفه', 'Amount released and paid'), 'FINANCE · ESCROW RELEASE', '#7FE7DA');
    if (!L.length) push('—', this.E('لم يقيد شيء بعد. السجل يبدأ عند أول إدخال.', 'Nothing is entered yet. The register begins at the first entry.'), 'AWAITING', 'rgba(250,246,236,.55)');

    // Number the entries and flag the newest, so the panel reads as a live ledger.
    const total = L.length;
    L.forEach((r, i) => { r.n = String(i + 1).padStart(2, '0'); r.isNew = i === total - 1 && total > 1; r.newAttr = r.isNew ? '' : null; });

    const escStages = [
      { label: this.E('غير ممول', 'Unfunded'), at: '—' },
      { label: this.E('ممول ومحجوز', 'Funded and held'), at: '14:51' },
      { label: this.E('قيد المراجعة', 'Under review'), at: '07-18' },
      { label: this.E('مفرج عنه', 'Released'), at: '07-21' }
    ];
    const escIdx = stage >= 6 ? 3 : (stage >= 5 ? 2 : (stage >= 4 ? 1 : 0));
    const escSteps = escStages.map((e, i) => ({
      label: e.label, at: i <= escIdx ? e.at : '—',
      dot: i < escIdx ? '#0E6E66' : (i === escIdx ? '#12B5A4' : '#DCD3BE'),
      fg: i <= escIdx ? '#052E2B' : '#8E9A94'
    }));

    const axesBase = this.E(['الهوية','المهارة','السجل','السلوك','الطاقة'], ['Identity','Skill','Record','Conduct','Capacity']);
    const axes = axesBase.map((n, i) => {
      let st = this.E('لم يفحص', 'Not examined'), fg = '#6E675A', bg = '#F0EDE3';
      if (s.vPhase >= 1) {
        if (i === 2) { st = this.E('مراجعة إنسان', 'Human review'); fg = '#8A6A12'; bg = '#FFF3D6'; }
        else { st = this.E('مستوف', 'Met'); fg = '#0E6E66'; bg = '#E4F2EE'; }
      }
      if (s.vPhase >= 2) { st = this.E('مستوف', 'Met'); fg = '#0E6E66'; bg = '#E4F2EE'; }
      return { name: n, state: st, fg, bg };
    });

    // Hashed from the Arabic source text in both languages, so the seal does not change with the UI language.
    const sealHash = this.sha256('KYN|MHD|' + regId + '|T1|2026-07-21|MD-2026-204|أربع صفحات هبوط وملف أصول ودليل استعمال');

    const rules = this.E([
      ['التسجيل يسأل ولا يستجوب', 'ثمانية عشر شاشة، سؤال واحد في كل شاشة، وسبب ظاهر لكل سؤال. ويجوز الوقوف والعودة دون فقد ما أدخل.'],
      ['الآلة تمرر، والإنسان يرد', 'الفحص الليلي يرشح، ولا يرد أحدا. والرد يصدر عن موقع مسمى بسبب مكتوب ومهلة تظلم.'],
      ['الفئة تصدر ولا تشترى', 'وتسقط بالخمول درجة واحدة قابلة للاسترداد. وهذا مكتوب قبل التسجيل لا بعده.'],
      ['نطاق قبل عمل', 'لا تعرض دعوة بلا نطاق مكتوب ومعايير قبول قابلة للقياس ومدة محددة.'],
      ['المال يودع قبل اليوم الأول', 'حساب الضمان التزام لا إيراد. ولا يبدأ عمل على وعد بالدفع.'],
      ['المحضر يسبق الصرف', 'لا يصرف مستحق قبل قيده. والقيد يختم، والختم يشتق من نص المحضر.'],
      ['الصرف يقيد مدته', 'عدد الأيام بين القبول والصرف يقيد وينشر شهريا، سواء أحسن أم ساء.']
    ], [
      ['Registration asks; it does not interrogate', 'Eighteen screens, one question each, and a stated reason for every question. You may stop and return without losing what you entered.'],
      ['The machine passes; a person refuses', 'The nightly check nominates and refuses no one. A refusal issues from a named post with a written reason and a term of appeal.'],
      ['A tier is issued, not bought', 'It falls one recoverable step through dormancy. This is written before registration, not after.'],
      ['Scope before work', 'No call is shown without a written scope, measurable acceptance criteria, and a fixed term.'],
      ['The money is deposited before day one', 'The escrow account is an obligation, not revenue. No work begins on a promise to pay.'],
      ['The record precedes payment', 'No amount is paid before it is entered. The entry is sealed, and the seal derives from the text of the record.'],
      ['Payment time is recorded', 'The number of days between acceptance and payment is entered and published monthly, whether it flatters us or not.']
    ]);
    const rule = rules[Math.min(stage, 6)];

    const advance = (to, cue) => { if (cue) this.fire(cue); this.setState({ stage: to, refused: false }); };

    return {
      armLabel: s.armed ? this.E('الصوت مفعل — اضغط للإطفاء', 'Sound on — tap to mute') : this.E('تفعيل الصوت لهذه الجلسة', 'Enable sound for this session'),
      armBg: s.armed ? '#12B5A4' : 'transparent',
      armFg: s.armed ? '#04211F' : '#12B5A4',
      toggleArm: () => { const n = !s.armed; this.setState({ armed: n }); if (n) { setTimeout(() => { this.ac(); }, 0); } },
      reset: () => this.setState({ stage: 0, q: 0, name: '', phone: '', spec: '', vPhase: 0, refused: false }),

      rootRef: this.root,
      isAr: s.lang !== 'en', isEn: s.lang === 'en',
      arBg: s.lang !== 'en' ? '#E9C96B' : 'transparent',
      arFg: s.lang !== 'en' ? '#03201D' : 'rgba(250,246,236,.72)',
      enBg: s.lang === 'en' ? '#E9C96B' : 'transparent',
      enFg: s.lang === 'en' ? '#03201D' : 'rgba(250,246,236,.72)',
      setAr: () => this.setLang('ar'),
      setEn: () => this.setLang('en'),

      rail, log: L, regId, regName: name,
      logCount: this.E(total + ' قيدا', total + (total === 1 ? ' ENTRY' : ' ENTRIES')),
      escHeld: escIdx === 1 || escIdx === 2,
      escState: escStages[escIdx].label,
      escPct: [4, 46, 66, 100][escIdx] + '%',
      escBar: escIdx === 3 ? '#12B5A4' : (escIdx === 0 ? '#6E675A' : '#0E6E66'),
      escFg: escIdx === 3 ? '#7FE7DA' : 'rgba(250,246,236,.8)',
      escNote: escIdx === 0 ? this.E('لا يبدأ عمل قبل ورود المستحق كاملا.', 'No work begins before the full amount arrives.') : (escIdx === 3 ? this.E('صرف بعد ثلاثة أيام من قيد المحضر.', 'Paid three days after the record was entered.') : this.E('المبلغ محجوز — لا لكيان ولا للعميل.', 'The amount is held — for neither Kayan nor the client.')),
      ruleTitle: rule[0], ruleBody: rule[1],

      screenTag: ['REGISTRATION','VERIFICATION','TIER','POD CALL','ESCROW','HANDOVER','SETTLED'][stage],
      isS0: stage === 0, isS1: stage === 1, isS2: stage === 2, isS3: stage === 3, isS4: stage === 4, isS5: stage === 5, isS6: stage === 6,

      qCount: this.E('السؤال ' + (s.q + 1) + ' من ٣', 'QUESTION ' + (s.q + 1) + ' OF 3'),
      qLabel: cur.label, qHint: cur.hint, qWhy: cur.why,
      qValue: s[cur.key] || '',
      qBtn: s.q === 2 ? this.E('إنهاء التسجيل', 'Finish registration') : this.E('التالي', 'Next'),
      setQ: e => this.setState({ [cur.key]: e.target.value }),
      nextQ: () => { this.fire('verify'); if (s.q < 2) this.setState({ q: s.q + 1 }); else this.setState({ stage: 1 }); },

      axes,
      vNote: s.vPhase === 0 ? this.E('يجري الفحص الآلي ليلا على كل ملف مكتمل. وهو يرشح فقط.', 'The automated check runs nightly on every complete file. It only nominates.')
        : (s.vPhase === 1 ? this.E('مر الفحص الآلي. محور السجل يحتاج قرار إنسان — لأن الآلة يجوز لها أن تمرر، ولا يجوز لها أن ترد.', 'The automated check passed. The record axis needs a human decision, because the machine may pass but may not refuse.')
        : this.E('اعتمد التوثيق. صدر القرار عن الموقع POS-TAL-VER وقيد باسمه.', 'Verification is approved. The decision issued from post POS-TAL-VER and is entered in its name.')),
      vBtn: s.vPhase === 0 ? this.E('إجراء الفحص الآلي', 'Run the automated check') : (s.vPhase === 1 ? this.E('عرض على POS-TAL-VER', 'Refer to POS-TAL-VER') : this.E('استلام الفئة', 'Receive the tier')),
      vAct: () => {
        if (s.vPhase === 0) { this.fire('verify'); this.setState({ vPhase: 1 }); }
        else if (s.vPhase === 1) { this.setState({ vPhase: 2 }); }
        else { this.fire('tier'); this.setState({ stage: 2 }); }
      },

      strata: [0,1,2,3,4,5,6], strataGap: '19px',
      tierCode: this.E('T1 · معرف', 'T1 · IDENTIFIED'),
      tierBody: this.E('الفئة الأولى تتيح الانضمام إلى فريق تحت إشراف. وصفحة سجلك مفتوحة للعامة من الآن، بلا دخول ولا رسوم.', 'Tier one allows joining a supervised pod. Your record page is public from now, with no login and no fee.'),
      toS3: () => advance(3),
      toS4: () => advance(4),
      toS5: () => advance(5),

      escSteps,
      refused: s.refused,
      doAccept: () => { this.fire('accept'); this.setState({ stage: 6, refused: false }); },
      doRefuse: () => { this.fire('halt'); this.setState({ refused: true }); },

      sealRuns: this.runs(sealHash, 11), sealBox: '0 0 121 121', sealShort: sealHash.slice(0, 8)
    };
  }
}