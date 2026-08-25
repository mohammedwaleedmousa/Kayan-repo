import React from 'react';
import DCLogic from '../../home/DCLogic.js';

const T = {
  ar: {
    kayan: 'كيان', indexName: 'فهرس المنتجات الجاهزة',
    navHome: 'الدار', navShelf: 'الرف الجاهز', navGates: 'البوابات', navClients: 'للعملاء', navTalent: 'للمنفذين', navMoney: 'مسار المال',
    bands: ['ميقات فوري', 'ميقات سريع', 'ميقات متوسط', 'ميقات ممتد'], bandRecurring: 'ميقات متجدد',
    cta: 'اطلب نطاق عمل',
    screenFront: 'الرف · الواجهة', screenFilters: 'الرف · المرشحات',
    h1: 'مئة وثلاثة مخرجات، كل واحد مكتوب قبل أن يباع.',
    reefGloss: 'طائر الشعاب',
    lead: 'هذا فهرس الرف كله: خمس عشرة عائلة، وسبعة أنواع من المشترين. يقرأ المخرج وميقاته أولا، ثم يفتح ما يخص طالبه. تحرر القيمة على النطاق بعد كتابته، ولا يبدأ تنفيذ قبل إيداع في حساب الضمان.',
    markAria: 'علامة الرف الجاهز في الطيران',
    shelfAria: 'فهرس الرف بالميقات',
    hint: 'مرر على شريحة، أو المسها، فيظهر مخرجها وميقاته',
    searchPh: 'ابحث عن مخرج أو رمز', reset: 'امسح المرشحات', familiesLabel: 'THE FAMILIES · 15',
    byFam: 'بالعائلة', byFast: 'بالأسرع ميقاتا', meterKey: 'الميقات',
    empty: 'لا يطابق هذا البحث شيء على الرف. جرب عائلة أخرى أو امسح المرشحات.',
    close: 'إغلاق', solvesLabel: 'ما يحل هذا المخرج', whenLabel: 'الميقات', priceLabel: 'القيمة',
    liabilityLabel: 'التبعة', liabilityVal: 'على المؤسسة لا على العميل',
    podNote: 'يسمى قبل البدء، ويقيد في محضر الاستلام',
    recLabel: 'ما يسلم، بالعدد والصيغة', boughtBy: 'يشتريه عادة', alsoFiled: 'يقيد أيضا باسم:',
    sheetNote: 'تحرر قيمة هذا المخرج على نطاقه المكتوب، ولا تصرف إلا على محضر استلام موقع.',
    orderThis: 'اطلب هذا المخرج',
    onScope: 'تحرر على النطاق',
    legend: ['حتى يومين', 'حتى أسبوع', 'حتى ثلاثة أسابيع', 'أطول', 'متجدد شهريا'],
    fastHead: 'الأسرع ميقاتا', fastHeadEn: 'BY LEAD TIME',
    fastPos: 'يرتب الرف كله بالميقات، من ثمان وأربعين ساعة إلى المتجدد شهريا.',
    allFams: 'كل العائلات', allBuyers: 'الكل',
    arrow: '←', glossFont: "'IBM Plex Sans Arabic',sans-serif", leadWidth: '46ch', leadLh: '1.95'
  },
  en: {
    kayan: 'Kayan', indexName: 'The ready-products index',
    navHome: 'Home', navShelf: 'The shelf', navGates: 'The gates', navClients: 'For clients', navTalent: 'For talent', navMoney: 'Money path',
    bands: ['Immediate lead time', 'Fast lead time', 'Medium lead time', 'Extended lead time'], bandRecurring: 'Recurring',
    cta: 'Request a scope of work',
    screenFront: 'The shelf · Front', screenFilters: 'The shelf · Filters',
    h1: 'One hundred and three deliverables, each one written before it is sold.',
    reefGloss: 'The reef bird',
    lead: 'This is the whole shelf: fifteen families and seven kinds of buyer. Read the deliverable and its lead time first, then open the one that concerns you. Value is set against the scope once it is written, and no execution begins before a deposit into the escrow account.',
    markAria: 'The ready-shelf mark in flight',
    shelfAria: 'The shelf indexed by lead time',
    hint: 'Hover or tap a bar to see its deliverable and lead time',
    searchPh: 'Search a deliverable or a code', reset: 'Clear the filters', familiesLabel: 'THE FAMILIES · 15',
    byFam: 'By family', byFast: 'By lead time', meterKey: 'Lead time',
    empty: 'Nothing on the shelf matches this search. Try another family, or clear the filters.',
    close: 'Close', solvesLabel: 'What this deliverable solves', whenLabel: 'Lead time', priceLabel: 'Value',
    liabilityLabel: 'Liability', liabilityVal: 'With the firm, not with the client',
    podNote: 'Named before work starts, and recorded in the acceptance certificate',
    recLabel: 'What is delivered, in counts and formats', boughtBy: 'Usually bought by', alsoFiled: 'Also filed as:',
    sheetNote: 'The value of this deliverable is set against its written scope, and is released only against a signed acceptance certificate.',
    orderThis: 'Request this deliverable',
    onScope: 'Set against the scope',
    legend: ['Up to two days', 'Up to a week', 'Up to three weeks', 'Longer', 'Monthly recurring'],
    fastHead: 'By lead time', fastHeadEn: 'BY LEAD TIME',
    fastPos: 'The whole shelf ordered by lead time, from forty-eight hours to monthly recurring.',
    allFams: 'All families', allBuyers: 'All',
    arrow: '→', glossFont: "'Instrument Sans',sans-serif", leadWidth: '54ch', leadLh: '1.75'
  }
};

export default class ProductsLogic extends DCLogic {
  constructor(props) {
    super(props);
    this.root = React.createRef();
    let lang = null;
    try { lang = localStorage.getItem('kyn-lang'); } catch (e) {}
    if (lang !== 'ar' && lang !== 'en') lang = (props.defaultLang === 'ar') ? 'ar' : 'en';
    this.state = { ready: false, lang: lang, q: '', fam: 'all', buyer: 'all', view: (props.defaultView === 'fast' ? 'fast' : 'fam'), open: null, read: null };
  }

  _syncDir() {
    const el = this.root.current;
    if (el) el.setAttribute('dir', this.state.lang === 'en' ? 'ltr' : 'rtl');
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevState || prevState.lang !== this.state.lang) this._syncDir();
    const s = this.state, p = prevState || {};
    // Only when the row set can have changed — `read`/`open` churn on every hover.
    if (p.q !== s.q || p.fam !== s.fam || p.buyer !== s.buyer || p.view !== s.view || p.lang !== s.lang || p.ready !== s.ready) this._reveal();
  }

  // Rows arrive with a short cascade, once each. Reads are batched ahead of writes so a
  // 100-row sweep costs one layout, and `seen` keeps a row from re-animating on every keystroke.
  _reveal() {
    const root = this.root && this.root.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    if (!this.seen) this.seen = new Set();
    const rows = root.querySelectorAll('[data-rp-row]');
    if (!rows.length) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
      rows.forEach(el => el.removeAttribute('data-rp-hide'));
      return;
    }
    if (!this._io) {
      this._io = new IntersectionObserver(es => {
        es.forEach(e => {
          if (!e.isIntersecting) return;
          const el = e.target, c = el.getAttribute('data-code');
          if (c) this.seen.add(c);
          el.style.animationDelay = '';
          el.removeAttribute('data-rp-hide');
          el.setAttribute('data-rp-seen', '');
          this._io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.01 });
    }
    const vh = window.innerHeight || 800;
    const initial = !this._didReveal;
    this._didReveal = true;
    const plan = [];
    rows.forEach(el => plan.push({ el: el, code: el.getAttribute('data-code'), top: el.getBoundingClientRect().top }));
    let k = 0;
    for (const it of plan) {
      const el = it.el, onScreen = it.top < vh - 40;
      if (onScreen || (it.code && this.seen.has(it.code))) {
        if (it.code) this.seen.add(it.code);
        if (initial && onScreen) el.style.animationDelay = Math.min(k++, 9) * 34 + 'ms';
        this._io.unobserve(el);
        el.removeAttribute('data-rp-hide');
        el.setAttribute('data-rp-seen', '');
      } else {
        // Clear any state left by a previous occupant of this reused DOM node,
        // or the finished animation would pin it visible while it should be hidden.
        el.removeAttribute('data-rp-seen');
        el.style.animationDelay = '';
        el.setAttribute('data-rp-hide', '');
        this._io.observe(el);
      }
    }
  }

  componentDidMount() {
    this._syncDir();
    this.poll = setInterval(() => {
      const D = window.KAYAN_RP;
      if (D && D.families && D.fixed && D.range) {
        clearInterval(this.poll);
        this.setState({ ready: true });
        setTimeout(() => {
          const h = (location.hash || '').replace('#', '');
          if (!h) return;
          if (h.indexOf('fam-') === 0) this.setState({ fam: h.slice(4) });
          else if (h.indexOf('buyer-') === 0) this.setState({ buyer: h.slice(6) });
          else if (this.all().some(x => x.code === h)) this.setState({ open: h });
        }, 60);
      }
    }, 40);
    this.onKey = e => { if (e.key === 'Escape' && this.state.open) this.setState({ open: null }); };
    window.addEventListener('keydown', this.onKey);
  }
  componentWillUnmount() {
    clearInterval(this.poll);
    window.removeEventListener('keydown', this.onKey);
    if (this._io) { this._io.disconnect(); this._io = null; }
  }

  data() {
    const D = window.KAYAN_RP || {};
    return { fams: D.families || [], buyers: D.buyers || [], fixed: D.fixed || [], range: D.range || [] };
  }
  all() { const d = this.data(); return d.fixed.concat(d.range); }
  fam(k) { return this.data().fams.find(x => x.k === k) || null; }
  ar() { return this.state.lang !== 'en'; }
  t() { return this.ar() ? T.ar : T.en; }
  L(o, key) { if (!o) return ''; const v = o[key + (this.ar() ? 'Ar' : 'En')]; return (v === undefined || v === null || v === '') ? (o[key + 'Ar'] || '') : v; }
  nameOf(p) { return this.ar() ? p.ar : (p.en || p.ar); }
  famName(k) { const f = this.fam(k); return f ? (this.ar() ? f.ar : (f.en || f.ar)) : ''; }
  digits(n) { return this.ar() ? String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]) : String(n); }
  count(n) { return this.ar() ? (this.digits(n) + ' مخرجا') : (n + (n === 1 ? ' deliverable' : ' deliverables')); }

  outLine(p) { const r = this.ar() ? p.recAr : (p.recEn || p.recAr); return (r && r.length) ? r[0] : this.L(p, 'get'); }
  whenLine(p) { return this.ar() ? (p.daysAr || p.timeAr || '') : (p.daysEn || p.timeEn || p.daysAr || p.timeAr || ''); }
  recurring(p) { return p.unit === '/mo' || /شهري/.test(p.daysAr || '') || /monthly/i.test(p.daysEn || ''); }

  // one comparable scale across two pricing systems: 1 = 48h, 4 = a month or more
  band(p) {
    const t = (p.daysEn || p.timeEn || '').toLowerCase();
    if (this.recurring(p)) return 4;
    if (/per cohort/.test(t)) return 3;
    if (/hour/.test(t)) return 1;
    if (/week|month/.test(t)) return 4;
    const d = t.match(/(\d+)\s*(?:–|-|to)?\s*(\d+)?\s*day/);
    if (d) { const n = +(d[2] || d[1]); return n <= 2 ? 1 : (n <= 7 ? 2 : (n <= 21 ? 3 : 4)); }
    if (/long/.test(t)) return 4;
    if (/medium/.test(t)) return 3;
    if (/short/.test(t)) return 2;
    return p.speed ? Math.min(4, Math.max(1, p.speed)) : 3;
  }
  bandColour(p) {
    if (this.recurring(p)) return '#A79F8E';
    return ['#12B5A4', '#3E9EEA', '#2E7CBC', '#1A5F97'][this.band(p) - 1];
  }
  bandWidth(p) { return [26, 48, 72, 100][this.band(p) - 1] + '%'; }
  // Row meter: four rising segments, filled up to the product's lead-time band.
  segs(p) {
    const c = this.bandColour(p);
    // Recurring has no lead time at all — a flat grey dash, never a full "slowest" staircase.
    if (this.recurring(p)) return ['5px', '5px', '5px', '5px'].map(h => ({ h: h, c: c }));
    const n = this.band(p), hs = ['4px', '6px', '8px', '10px'];
    return hs.map((h, i) => ({ h: h, c: i < n ? c : '#E4DCC8' }));
  }
  bandLabel(p) {
    const tt = this.t();
    if (this.recurring(p)) return tt.bandRecurring || '';
    return (tt.bands || [])[this.band(p) - 1] || '';
  }
  // Family barcode: one tick per product, height and colour = its band. Echoes the hero chart.
  headTicks(items) {
    const hs = ['5px', '8px', '11px', '13px'];
    return (items || []).slice(0, 44).map(p => ({
      h: this.recurring(p) ? '5px' : hs[this.band(p) - 1], c: this.bandColour(p)
    }));
  }

  price(p) {
    if (!p.usd) return { t: this.t().onScope, c: '#8B8375', f: this.ar() ? "'IBM Plex Sans Arabic',sans-serif" : "'Instrument Sans',sans-serif", dir: this.ar() ? 'rtl' : 'ltr' };
    return { t: '$' + p.usd + (p.unit || ''), c: '#0A6F68', f: "'IBM Plex Mono',monospace", dir: 'ltr' };
  }

  filtered() {
    const s = this.state;
    let list = this.all();
    if (s.fam !== 'all') list = list.filter(p => p.fam === s.fam);
    if (s.buyer !== 'all') list = list.filter(p => (p.buyers || []).indexOf(s.buyer) >= 0);
    const q = s.q.trim().toLowerCase();
    if (q) {
      list = list.filter(p => [p.code, p.ar, p.en, p.getAr, p.getEn, p.whyAr, p.whyEn, p.solvesAr, p.solvesEn, this.famName(p.fam)]
        .filter(Boolean).join(' ').toLowerCase().indexOf(q) >= 0);
    }
    const order = this.data().fams.map(f => f.k);
    if (s.view === 'fast') return list.slice().sort((a, b) => this.band(a) - this.band(b) || order.indexOf(a.fam) - order.indexOf(b.fam));
    return list.slice().sort((a, b) => order.indexOf(a.fam) - order.indexOf(b.fam));
  }

  row(p) {
    const pr = this.price(p);
    return {
      isHead: false, isRow: true,
      code: p.code, name: this.nameOf(p), out: this.outLine(p), when: this.whenLine(p),
      barW: this.bandWidth(p), barC: this.bandColour(p),
      segs: this.segs(p), bandLabel: this.bandLabel(p), headTicks: [],
      price: pr.t, priceC: pr.c, priceFont: pr.f, priceDir: pr.dir,
      on: () => this.setState({ open: p.code }),
      id: '', ar: '', en: '', count: '', pos: ''
    };
  }

  renderVals() {
    const d = this.data(), s = this.state;
    const list = this.filtered(), total = this.all().length;
    const openP = s.open ? this.all().find(p => p.code === s.open) : null;
    const tt = this.t(), arL = this.ar();
    const buyerName = k => { const b = d.buyers.find(x => x.k === k); return b ? (arL ? b.ar : (b.en || b.ar)) : k; };
    const order = d.fams.map(f => f.k);
    const compact = this.props.density === 'compact';

    // the shelf profile: every product, in family order, height = lead-time band
    const shelf = this.all().slice().sort((a, b) => order.indexOf(a.fam) - order.indexOf(b.fam));
    let lastFam = null;
    const ticks = shelf.map(p => {
      const gap = p.fam === lastFam ? '0px' : '5px';
      lastFam = p.fam;
      return {
        h: [26, 48, 72, 100][this.band(p) - 1] + '%',
        bg: this.bandColour(p),
        gap,
        aria: p.code + ' · ' + this.nameOf(p) + ' · ' + this.whenLine(p),
        on: () => this.setState({ open: p.code }),
        read: () => { if (this.state.read !== p.code) this.setState({ read: p.code }); }
      };
    });
    const readP = s.read ? this.all().find(p => p.code === s.read) : null;

    // groups: one wrapper per family, so each sticky head's containing block spans its own rows
    const groups = [];
    if (s.view === 'fast') {
      groups.push({
        id: 'fam-fast', ar: tt.fastHead, en: tt.fastHeadEn,
        count: this.count(list.length), pos: tt.fastPos,
        headTicks: this.headTicks(list), rows: list.map(p => this.row(p))
      });
    } else {
      const byFam = new Map();
      list.forEach(p => { if (!byFam.has(p.fam)) byFam.set(p.fam, []); byFam.get(p.fam).push(p); });
      const push = k => {
        const items = byFam.get(k);
        if (!items || !items.length) return;
        const f = this.fam(k);
        groups.push({
          id: 'fam-' + k,
          ar: f ? this.famName(k) : k, en: f ? f.en.toUpperCase() : '',
          count: this.count(items.length), pos: f ? this.L(f, 'pos') : '',
          headTicks: this.headTicks(items), rows: items.map(p => this.row(p))
        });
      };
      order.forEach(push);
      byFam.forEach((items, k) => { if (order.indexOf(k) < 0) push(k); });
    }

    const famCounts = d.fams.map(f => ({ f, n: this.all().filter(p => p.fam === f.k).length }));
    const maxFam = famCounts.reduce((m, x) => Math.max(m, x.n), 1);
    // Buyer counts, so the facet carries the same information the family list does.
    const buyerCounts = d.buyers.map(b => ({ b, n: this.all().filter(p => (p.buyers || []).indexOf(b.k) >= 0).length }));
    const maxBuyer = buyerCounts.reduce((m, x) => Math.max(m, x.n), 1);
    const fixedN = d.fixed.length, rangeN = d.range.length;
    const openPr = openP ? this.price(openP) : null;

    const setLang = (l) => {
      if (l === this.state.lang) return;
      try { localStorage.setItem('kyn-lang', l); } catch (e) {}
      this.setState({ lang: l });
    };
    const fastN = this.all().filter(p => this.band(p) === 1).length;

    return {
      rootRef: this.root,
      isAr: arL, isEn: !arL,
      toggleAr: () => setLang('ar'),
      toggleEn: () => setLang('en'),
      arBtnBg: arL ? '#3E9EEA' : 'transparent', arBtnFg: arL ? '#06202F' : 'rgba(250,246,236,.72)',
      enBtnBg: !arL ? '#3E9EEA' : 'transparent', enBtnFg: !arL ? '#06202F' : 'rgba(250,246,236,.72)',
      tKayan: tt.kayan, tIndexName: tt.indexName,
      tNavHome: tt.navHome,
      tNavShelf: tt.navShelf, tNavGates: tt.navGates, tNavClients: tt.navClients, tNavTalent: tt.navTalent, tNavMoney: tt.navMoney,
      tMeterKey: tt.meterKey,
      tCta: tt.cta, tScreenFront: tt.screenFront, tScreenFilters: tt.screenFilters,
      tH1: tt.h1, tReefGloss: tt.reefGloss, tLead: tt.lead, tMarkAria: tt.markAria, tShelfAria: tt.shelfAria,
      tSearchPh: tt.searchPh, tReset: tt.reset, tFamiliesLabel: tt.familiesLabel,
      tByFam: tt.byFam, tByFast: tt.byFast, tEmpty: tt.empty, tClose: tt.close,
      tSolvesLabel: tt.solvesLabel, tWhenLabel: tt.whenLabel, tPriceLabel: tt.priceLabel,
      tLiabilityLabel: tt.liabilityLabel, tLiabilityVal: tt.liabilityVal, tPodNote: tt.podNote,
      tRecLabel: tt.recLabel, tBoughtBy: tt.boughtBy, tAlsoFiled: tt.alsoFiled,
      tSheetNote: tt.sheetNote, tOrderThis: tt.orderThis,
      arrow: tt.arrow, glossFont: tt.glossFont, leadWidth: tt.leadWidth, leadLh: tt.leadLh,
      hrefShelf: arL ? 'Line I - Managed Delivery.dc.html#ready' : 'Line I - Managed Delivery EN.dc.html#risks',
      hrefGates: arL ? 'Line I - Managed Delivery.dc.html#gates' : 'Line I - Managed Delivery EN.dc.html#gates',
      hrefMoney: arL ? 'Line I - Managed Delivery.dc.html#money' : 'Line I - Managed Delivery EN.dc.html#money',
      hrefStart: arL ? 'Line I - Managed Delivery.dc.html#start' : 'Line I - Managed Delivery EN.dc.html#start',

      readLine: readP
        ? (readP.code + ' · ' + this.nameOf(readP) + ' — ' + this.whenLine(readP))
        : tt.hint,
      ticks,
      legend: ['#12B5A4', '#3E9EEA', '#2E7CBC', '#1A5F97', '#A79F8E'].map((c, i) => ({ c, t: tt.legend[i] })),
      shelfNote: arL
        ? (this.digits(fixedN) + ' بسعر ثابت · ' + this.digits(rangeN) + ' تحرر على النطاق · ' + this.digits(fastN) + ' يسلم في يومين')
        : (fixedN + ' at a fixed price · ' + rangeN + ' set against the scope · ' + fastN + ' delivered in two days'),

      q: s.q,
      onSearch: e => this.setState({ q: e.target.value }),
      reset: () => this.setState({ q: '', fam: 'all', buyer: 'all', read: null }),

      buyerRows: [{ b: { k: 'all', ar: tt.allBuyers, en: tt.allBuyers }, n: total }].concat(buyerCounts).map(x => {
        const sel = x.b.k === s.buyer || (x.b.k === 'all' && s.buyer === 'all');
        return {
          label: arL ? x.b.ar : (x.b.en || x.b.ar), n: this.digits(x.n), sel,
          bg: sel ? '#F1EAD8' : 'transparent',
          fg: sel ? '#052E2B' : '#4A6B64',
          w: sel ? '600' : '400',
          barW: Math.round((x.n / (x.b.k === 'all' ? total : maxBuyer)) * 100) + '%',
          barC: sel ? '#0E6E66' : '#D8CCAE',
          on: () => this.setState({ buyer: x.b.k === 'all' ? 'all' : x.b.k })
        };
      }),

      famRows: [{ f: { k: 'all', ar: tt.allFams, en: tt.allFams }, n: total }].concat(famCounts).map(x => {
        const sel = x.f.k === s.fam || (x.f.k === 'all' && s.fam === 'all');
        return {
          label: arL ? x.f.ar : (x.f.en || x.f.ar), n: this.digits(x.n), sel,
          bg: sel ? '#F1EAD8' : 'transparent',
          fg: sel ? '#052E2B' : '#4A6B64',
          w: sel ? '600' : '400',
          barW: Math.round((x.n / (x.f.k === 'all' ? total : maxFam)) * 100) + '%',
          barC: sel ? '#2E7CBC' : '#D8CCAE',
          on: () => this.setState({ fam: x.f.k === 'all' ? 'all' : x.f.k })
        };
      }),

      resultLine: list.length === total
        ? (arL ? ('كل الرف · ' + this.count(total)) : ('The whole shelf · ' + this.count(total)))
        : (arL ? (this.digits(list.length) + ' من ' + this.digits(total) + ' مخرجا') : (list.length + ' of ' + total + ' deliverables')),
      isEmpty: list.length === 0,
      groups,
      rowPad: compact ? '9px 12px' : '13px 14px',

      viewFam: () => this.setState({ view: 'fam' }),
      viewFast: () => this.setState({ view: 'fast' }),
      isFamView: s.view === 'fam', isFastView: s.view === 'fast',
      famViewBg: s.view === 'fam' ? '#06202F' : 'transparent',
      famViewFg: s.view === 'fam' ? '#FAF6EC' : '#4A6B64',
      fastViewBg: s.view === 'fast' ? '#06202F' : 'transparent',
      fastViewFg: s.view === 'fast' ? '#FAF6EC' : '#4A6B64',

      isOpen: !!openP,
      close: () => this.setState({ open: null }),
      stop: e => e.stopPropagation(),
      open: openP ? {
        code: openP.code, name: this.nameOf(openP), fam: this.famName(openP.fam),
        solves: this.L(openP, 'solves') || this.L(openP, 'get'),
        when: this.whenLine(openP),
        segs: this.segs(openP).map(s => ({ h: s.h, dc: s.c === '#E4DCC8' ? 'rgba(250,246,236,.22)' : s.c })),
        bandLabel: this.bandLabel(openP),
        listN: ((arL ? openP.recAr : (openP.recEn || openP.recAr)) || []).map((t, i) => ({ n: String(i + 1).padStart(2, '0'), t: t })),
        price: openPr.t, priceC: openPr.c, priceFont: openPr.f, priceDir: openPr.dir,
        hasPod: !!this.L(openP, 'pod'), pod: this.L(openP, 'pod'),
        hasList: !!((arL ? openP.recAr : (openP.recEn || openP.recAr)) || []).length,
        list: (arL ? openP.recAr : (openP.recEn || openP.recAr)) || [],
        why: this.L(openP, 'why') || this.L(openP, 'get'),
        hasBuyers: !!(openP.buyers && openP.buyers.length),
        buyerNames: (openP.buyers || []).map(buyerName),
        hasAlt: !!openP.alt, alt: openP.alt || ''
      } : {
        code: '', name: '', fam: '', solves: '', when: '', price: '', priceC: '#8B8375', priceFont: "'IBM Plex Mono',monospace", priceDir: 'ltr',
        segs: [], bandLabel: '', listN: [],
        hasPod: false, pod: '', hasList: false, list: [], why: '', hasBuyers: false, buyerNames: [], hasAlt: false, alt: ''
      }
    };
  }
}