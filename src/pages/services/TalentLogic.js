import React from 'react';
import DCLogic from '../../home/DCLogic.js';

const ROWS_AR = [
  { k:'id',   tag:'LINE 01 · IDENTITY',   title:'الهوية موثقة',
    body:'يفتح الملف باسم واحد ومستند رسمي واحد. لا اسم مستعار، ولا ملف ثان لشخص واحد. والاسم الذي يقيد هو الاسم الذي يقرأه العميل.',
    rule:'يعلق الملف عند أي اختلاف بين المستند والبيانات.' },
  { k:'tier', tag:'LINE 02 · TIER',       title:'التخصص والطبقة',
    body:'تقاس القدرة في تخصص دقيق، لا في مهنة عامة. مصمم هوية ليس مصمم عرض، ومترجم عقود ليس مترجما عاما. وتقال الطبقة في التخصص الذي قيست فيه.',
    rule:'يجوز أن تحمل طبقتين في تخصصين، وتقاس كل واحدة على حدة.' },
  { k:'work', tag:'LINE 03 · RECORD',     title:'الأعمال المقبولة',
    body:'لا يقيد العمل بتسليمه، بل بقبوله. يضاف السطر على محضر قبول موقع، أو بانقضاء مهلة القبول دون اعتراض مسبب. وما رد لا يقيد.',
    rule:'لا يمحى قيد، ولا يعدل سطر بعد إثباته.' },
  { k:'civic',tag:'LINE 04 · STANDING',   title:'المكانة',
    body:'ساعات التطوع المقيدة في برامج كيان لليمن تكسب مكانة لا مالا. تظهر في البطاقة، وترجح عند تكافؤ المرشحين، ولا تشترى.',
    rule:'المكانة تكسب بالفعل المقيد، ولا تمنح ولا تباع.' }
];
const ROWS_EN = [
  { k:'id',   tag:'LINE 01 · IDENTITY',   title:'Verified identity',
    body:'A file opens under one name and one official document. No alias, and no second file for one person. The name recorded is the name the client reads.',
    rule:'The file is suspended on any mismatch between document and data.' },
  { k:'tier', tag:'LINE 02 · TIER',       title:'Specialty and tier',
    body:'Capability is measured in a narrow specialty, not a general trade. An identity designer is not a deck designer; a contracts translator is not a general translator. The tier is stated in the specialty it was measured in.',
    rule:'You may hold two tiers in two specialties; each is measured on its own.' },
  { k:'work', tag:'LINE 03 · RECORD',     title:'Accepted work',
    body:'Work is recorded on acceptance, not on delivery. The line is added against a signed acceptance record, or when the acceptance window closes without a reasoned objection. What is returned is not recorded.',
    rule:'No record is erased, and no line is amended once entered.' },
  { k:'civic',tag:'LINE 04 · STANDING',   title:'Standing',
    body:'Volunteer hours recorded in Kayan for Yemen programmes earn standing, not money. They appear on the card, they weigh when candidates are equal, and they are not for sale.',
    rule:'Standing is earned by recorded acts; it is neither granted nor sold.' }
];

const TIERS_AR = [
  { k:'T0', short:'الباب', name:'مسجل',
    body:'سجل مفتوح بلا قيد. يقيد الاسم ويفتح المسار، ولا يسند عمل، ولا تصدر بطاقة مادية.',
    needs:['فتح ملف باسم واحد','لا يشترط إثبات قدرة','قبول الميثاق'],
    note:'هذه الطبقة باب لا مقام. يخرج منها صاحبها بأول قياس.' },
  { k:'T1', short:'المدخل', name:'معرف',
    body:'هوية مثبتة وقدرة أساسية مقاسة. تسند أعمال محدودة النطاق تحت مراجعة قريبة، ويبنى بها أول سجل.',
    needs:['مستند هوية سار','عمل واحد سابق أو مخرج من برنامج في المصنع','اجتياز القياس الأساسي في التخصص'],
    note:'الغرض من هذه الطبقة أن يبدأ من لا سجل له، لا أن يبقى فيها.' },
  { k:'T2', short:'الافتراضي', name:'موثق',
    body:'الطبقة التي تسند إليها أغلب الأعمال. تنفذ نطاقا كاملا بلا إشراف لصيق، وتجيب عن جودة مخرجك أمام المراجع.',
    needs:['اجتياز القياس في التخصص','أعمال مقبولة مقيدة في السجل','جهة تزكية يمكن الرجوع إليها'],
    note:'وهي الحد الأدنى لمن ينفذ عملا يخرج إلى عميل.' },
  { k:'T3', short:'الأقدم', name:'مثبت',
    body:'يراجع عمل غيره، ويقود مخرجا معقدا، ويستشار في تحرير النطاق قبل التسعير.',
    needs:['عدد من الأعمال المقبولة في التخصص نفسه','سجل مراجعة نظيف','قياس متقدم يشمل الحكم لا الأداء وحده'],
    note:'العدد المطلوب مقرر في لائحة الطبقات، ويراجع دوريا على أول مئة قياس.' },
  { k:'T4', short:'القيادة', name:'مؤتمن',
    body:'يقود بودا كاملا، ويجيب أمام المؤسسة عن الميقات والجودة، ويوجه من هم دونه في التخصص.',
    needs:['سجل قيادة أعمال مسلمة ومقبولة','توجيه منفذين في التخصص','تقييم قيادي لا يقتصر على المخرج'],
    note:'لا ترقى إلى هذه الطبقة بالأقدمية، ولا تمنح إلا بقرار مسبب.' }
];
const TIERS_EN = [
  { k:'T0', short:'The door', name:'Registered',
    body:'An open record with no entry. The name is recorded and the path opens; no work is assigned and no physical card is issued.',
    needs:['A file opened under one name','No proof of capability required','Acceptance of the Charter'],
    note:'This tier is a door, not a standing. The first measurement moves you out of it.' },
  { k:'T1', short:'The entry', name:'Identified',
    body:'Verified identity and a measured baseline capability. Limited-scope work is assigned under close review, and a first record is built.',
    needs:['A valid identity document','One prior engagement, or an output from a Forge programme','Passing the baseline measurement in the specialty'],
    note:'This tier exists so someone with no record can begin — not so they remain in it.' },
  { k:'T2', short:'The default', name:'Verified',
    body:'The tier most work is assigned to. You deliver a full scope without close supervision, and answer for the quality of your output before the reviewer.',
    needs:['Passing the measurement in the specialty','Accepted engagements entered in the register','A referee who can be contacted'],
    note:'It is the minimum for anyone delivering work that reaches a client.' },
  { k:'T3', short:'The senior', name:'Established',
    body:'Reviews the work of others, leads a complex output, and is consulted on the scope before it is priced.',
    needs:['A number of accepted engagements in the same specialty','A clean review record','An advanced measurement covering judgement, not performance alone'],
    note:'The required number is set in the tier regulation and reviewed against the first hundred measurements.' },
  { k:'T4', short:'The lead', name:'Entrusted',
    body:'Leads a full pod, answers to the firm for date and quality, and guides those below in the specialty.',
    needs:['A record of leading delivered and accepted engagements','Guiding practitioners in the specialty','A leadership assessment not limited to output'],
    note:'This tier is not reached by seniority, and is granted only by a reasoned decision.' }
];

const RAIL_AR = [
  { n:'01', t:'يحرر النطاق', b:'يكتب المخرج بالعدد والصيغة والميقات، ويوقع. وعليه وحده يقاس التسليم لاحقا.' },
  { n:'02', t:'يودع العميل', b:'تودع القيمة في حساب الضمان قبل أن يفتح الأمر. ولا يبدأ عمل قبل الإيداع.' },
  { n:'03', t:'ينفذ البود',  b:'يسند العمل إلى منفذ ومراجع وقائد. ويبدأ العد من اكتمال مدخلات العميل.' },
  { n:'04', t:'تجيز المراجعة', b:'تقرأ المراجعة المستقلة المخرج قبل خروجه. ولا يرى العميل شيئا قبل إجازتها.' },
  { n:'05', t:'يصرف المستحق', b:'يصرف على محضر القبول، أو بانقضاء مهلة القبول دون اعتراض مسبب. ويقيد السطر في بطاقتك.' }
];
const RAIL_EN = [
  { n:'01', t:'The scope is drafted', b:'The deliverable is written in counts, formats and dates, and signed. Delivery is later measured against it alone.' },
  { n:'02', t:'The client deposits', b:'The value is placed in escrow before the order opens. No work starts before the deposit.' },
  { n:'03', t:'The pod delivers', b:'Work is assigned to a practitioner, a reviewer and a lead. The clock starts when the client\u2019s inputs are complete.' },
  { n:'04', t:'Review clears it', b:'An independent review reads the output before it leaves. The client sees nothing before it clears.' },
  { n:'05', t:'Your pay is released', b:'Released on the acceptance record, or when the window closes without a reasoned objection. The line is entered on your card.' }
];

const GATES_AR = [
  { name:'إشارة',        body:'يرد طلب العميل ويقيد برقم. لا وعد يقطع قبل القيد.' },
  { name:'استيعاب',      body:'يقرأ الطلب ويحدد ما ينقص من مدخلات قبل أي تسعير.' },
  { name:'توضيح',        body:'تستكمل المدخلات وتحسم الأسئلة المفتوحة كتابة.' },
  { name:'نطاق موقع',    body:'يحرر النطاق بالعدد والصيغة والميقات، ويوقع، وتودع القيمة في حساب الضمان.', money:true },
  { name:'فرز وامتثال',  body:'يفحص الالتزام وتجاز المباشرة. ما لا يجاز هنا لا يبدأ.' },
  { name:'تشكيل الفريق', body:'يؤلف البود ويثبت التوزيع قبل أول مهمة. لا يعدل التوزيع بأثر رجعي.' },
  { name:'جاهزية التسليم', body:'تجاز المخرجات في المراجعة المستقلة قبل أن يرى العميل شيئا.' },
  { name:'مراجعة العميل', body:'يعرض العمل، ويقيد الاعتراض المسبب إن ورد، ويرد إلى النطاق المكتوب.' },
  { name:'قبول ومحضر',   body:'يوقع محضر الاستلام بندا بندا. المحضر وحده سند الصرف.', money:true },
  { name:'صرف وضمانة',   body:'يصرف مستحقك على المحضر، ويقيد السطر في بطاقتك، وتسري الضمانة.', money:true }
];
const GATES_EN = [
  { name:'Signal',            body:'The client\u2019s request is received and given a number. No promise is made before the entry.' },
  { name:'Intake',            body:'The request is read and the missing inputs identified before any pricing.' },
  { name:'Clarification',     body:'Inputs are completed and open questions settled in writing.' },
  { name:'Signed scope',      body:'The scope is drafted in counts, formats and dates, signed, and the value deposited in escrow.', money:true },
  { name:'Screening',         body:'Compliance is checked and commencement cleared. What is not cleared here does not begin.' },
  { name:'Pod formation',     body:'The pod is assembled and the split fixed before the first task. The split is not amended retroactively.' },
  { name:'Delivery readiness',body:'Outputs are cleared in independent review before the client sees anything.' },
  { name:'Client review',     body:'The work is presented; a reasoned objection is recorded if raised, and referred to the written scope.' },
  { name:'Acceptance',        body:'The acceptance record is signed item by item. The record alone is the basis for release.', money:true },
  { name:'Release',           body:'Your pay is released against the record, the line is entered on your card, and the warranty runs.', money:true }
];

const STAGES_AR = [
  { n:'٠١', t:'البيانات الأساسية', d:'الاسم، والتخصص، والمدينة، ووسيلة الاتصال.' },
  { n:'٠٢', t:'إثبات الهوية', d:'مستند سار وصورة حية، تفحص بشريا.' },
  { n:'٠٣', t:'سجل العمل', d:'نماذج من عمل سابق، وجهة تزكية تسأل.' },
  { n:'٠٤', t:'قياس القدرة', d:'اختبار عملي في التخصص، يجيز أو يرد بقرار مسبب.' },
  { n:'٠٥', t:'القيد', d:'يفتح الملف، وتصدر بطاقة كيان بطبقتها.' }
];
const STAGES_EN = [
  { n:'01', t:'Basic data', d:'Name, specialty, city, and how to reach you.' },
  { n:'02', t:'Identity verification', d:'A valid document and a live photo, checked by a human.' },
  { n:'03', t:'Work record', d:'Samples of prior work, and a referee who is asked.' },
  { n:'04', t:'Capability measurement', d:'A practical test in the specialty; cleared or returned by a reasoned decision.' },
  { n:'05', t:'Entry', d:'The file opens, and a Kayan card is issued at its tier.' }
];

const NEEDS_AR = [
  'مستند هوية سار — بطاقة وطنية أو جواز.',
  'بريد إلكتروني ورقم هاتف عاملان.',
  'نماذج من عمل سابق تنسب إليك.',
  'اسم جهة تزكية ووسيلة الاتصال بها.'
];
const NEEDS_EN = [
  'A valid identity document — national ID or passport.',
  'A working email address and phone number.',
  'Samples of prior work attributable to you.',
  'A referee\u2019s name and how to reach them.'
];

const HERO_AR = [
  { k:'T0', name:'مسجل' }, { k:'T1', name:'معرف' }, { k:'T2', name:'موثق' },
  { k:'T3', name:'مثبت' }, { k:'T4', name:'مؤتمن' }
];
const HERO_EN = [
  { k:'T0', name:'Registered' }, { k:'T1', name:'Identified' }, { k:'T2', name:'Verified' },
  { k:'T3', name:'Established' }, { k:'T4', name:'Entrusted' }
];

export default class TalentLogic extends DCLogic {
  constructor(props) {
    super(props);
    this.root = React.createRef();
    this.glow = React.createRef();
    let lang = null;
    try { lang = localStorage.getItem('kyn-lang'); } catch (e) {}
    if (lang !== 'ar' && lang !== 'en') lang = (this.props.defaultLang === 'ar') ? 'ar' : 'en';
    this.state = { lang: lang, row:'id', tier:'T2', heroTier:'T2', gate:0 };
  }

  _syncDir() {
    const el = this.root.current;
    if (el) el.setAttribute('dir', this.state.lang === 'en' ? 'ltr' : 'rtl');
  }
  _initLive() {
    const root = this.root.current; if (!root) return;
    const els = [...root.querySelectorAll('[data-station],[data-gatepanel]')];
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      els.forEach(el => el.setAttribute('data-live', '')); return;
    }
    this._liveIo = new IntersectionObserver(es => es.forEach(x => {
      if (!x.isIntersecting) return;
      const el = x.target, i = els.indexOf(el);
      setTimeout(() => el.setAttribute('data-live', ''), el.hasAttribute('data-station') ? Math.max(0, i) * 90 : 0);
      this._liveIo.unobserve(el);
    }), { threshold: 0.15, rootMargin: '0px 0px -12% 0px' });
    els.forEach(el => this._liveIo.observe(el));
  }
  componentDidMount() {
    this._syncDir();
    this._initRev();
    setTimeout(() => this._initLive(), 60);
    this._initStagger();
    this._rowCycle = setInterval(() => {
      if (document.hidden) return;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (this._rowHold && Date.now() - this._rowHold < 12000) return;
      const panel = this.root.current ? this.root.current.querySelector('[data-cardpanel]') : null;
      if (panel) { const r = panel.getBoundingClientRect(); if (r.bottom < 0 || r.top > window.innerHeight) return; }
      const keys = ['id', 'tier', 'work', 'civic'];
      this.setState({ row: keys[(keys.indexOf(this.state.row) + 1) % keys.length] });
    }, 3800);
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevState || prevState.lang !== this.state.lang) {
      this._syncDir();
      setTimeout(() => this._revealAll(), 60);
    }
    if (prevState && prevState.row !== this.state.row) {
      const el = this.root.current ? this.root.current.querySelector('[data-cardfade]') : null;
      if (el) { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = 'kRow .5s cubic-bezier(.2,.7,.2,1) both'; }
    }
  }
  componentWillUnmount() {
    if (this._liveIo) this._liveIo.disconnect();
    if (this._io) this._io.disconnect();
    if (this._sio) this._sio.disconnect();
    if (this._revFail) clearTimeout(this._revFail);
    if (this._sFail) clearTimeout(this._sFail);
    if (this._rowCycle) clearInterval(this._rowCycle);
  }
  _initRev() {
    const root = this.root.current; if (!root) return;
    const els = Array.from(root.querySelectorAll('[data-rev]'));
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach((n) => n.setAttribute('data-on', '')); return; }
    this._io = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { en.target.setAttribute('data-on', ''); this._io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((n) => {
      const d = n.getAttribute('data-rev-delay');
      if (d) n.style.transitionDelay = d + 'ms';
      this._io.observe(n);
    });
    this._revFail = setTimeout(() => els.forEach((n) => n.setAttribute('data-on', '')), 2800);
  }
  _initStagger() {
    const root = this.root.current; if (!root) return;
    const boxes = Array.from(root.querySelectorAll('[data-stagger]'));
    if (!boxes.length) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const play = (b) => b.setAttribute('data-on', '');
    if (!('IntersectionObserver' in window) || reduce) { boxes.forEach(play); return; }
    this._sio = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { play(en.target); this._sio.unobserve(en.target); } });
    }, { threshold: 0.15 });
    boxes.forEach((b) => this._sio.observe(b));
    this._sFail = setTimeout(() => boxes.forEach(play), 6000);
  }
  _revealAll() {
    const root = this.root.current; if (!root) return;
    root.querySelectorAll('[data-rev]:not([data-on])').forEach((n) => n.setAttribute('data-on', ''));
    root.querySelectorAll('[data-stagger]:not([data-on])').forEach((n) => n.setAttribute('data-on', ''));
  }

  renderVals() {
    const st = this.state;
    const arL = st.lang !== 'en', enL = !arL;
    const ROWS = arL ? ROWS_AR : ROWS_EN;
    const TIERS = arL ? TIERS_AR : TIERS_EN;
    const GATES = arL ? GATES_AR : GATES_EN;
    const row = ROWS.find(r => r.k === st.row) || ROWS[0];
    const tier = TIERS.find(t => t.k === st.tier) || TIERS[2];

    const setLang = (l) => {
      if (l === st.lang) return;
      try { localStorage.setItem('kyn-lang', l); } catch (e) {}
      this.setState({ lang: l });
    };

    return {
      rootRef: this.root,
      ar: arL, en: enL,
      dirVal: arL ? 'rtl' : 'ltr',
      cardLang: arL ? 'ar' : 'en',
      cardName: arL ? 'نموذج' : 'Specimen',
      gatewayTag: arL ? 'AR' : 'EN',
      needsLabel: arL ? 'ما يشترط' : 'WHAT IS REQUIRED',
      freeNote: arL
        ? 'التسجيل مجاني. لا يؤخذ رسم تسجيل ولا رسم قياس، وتقتطع كيان حصتها من قيمة العمل المتعاقد عليه وحده.'
        : 'Registration is free. No registration fee and no measurement fee is taken; Kayan\u2019s share is deducted from the contracted value of the work alone.',
      toggleAr: () => setLang('ar'),
      toggleEn: () => setLang('en'),
      arBtnBg: arL ? '#C9A227' : 'transparent', arBtnFg: arL ? '#241B04' : 'rgba(244,239,226,.7)',
      enBtnBg: enL ? '#C9A227' : 'transparent', enBtnFg: enL ? '#241B04' : 'rgba(244,239,226,.7)',

      glowRef: this.glow,
      glowMove: (e) => {
        const el = this.glow.current; if (!el) return;
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', (nx * 100) + '%');
        el.style.setProperty('--my', (ny * 100) + '%');
        el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - ny) * 2).toFixed(2) + 'deg) rotateY(' + ((nx - 0.5) * 2.4).toFixed(2) + 'deg) translateY(-2px)';
        const g = el.querySelector('[data-glow]'); if (g) g.style.opacity = '1';
      },
      glowLeave: () => {
        const el = this.glow.current; if (!el) return;
        el.style.transform = 'none';
        const g = el.querySelector('[data-glow]'); if (g) g.style.opacity = '0';
      },

      cardRows: ROWS.map(r => ({
        k: r.k, title: r.title, tag: r.tag,
        btn: 'all:unset;cursor:pointer;box-sizing:border-box;display:block;width:100%;padding:16px 18px;border-radius:14px;transition:background .3s ease,border-color .3s ease,transform .3s cubic-bezier(.23,1,.32,1);border:1px solid ' +
          (r.k === st.row ? '#C9A227;background:#fff;transform:translateX(' + (arL ? '-4px' : '4px') + ')' : 'rgba(35,28,11,.10);background:#F4EFE2'),
        dot: 'width:9px;height:9px;border-radius:99px;flex:none;background:' + (r.k === st.row ? '#C9A227' : 'rgba(35,28,11,.18)')
      })),
      row,
      pickRow: (e) => { this._rowHold = Date.now(); this.setState({ row: e.currentTarget.getAttribute('data-k') }); },

      heroTier: st.heroTier,
      heroTiers: (arL ? HERO_AR : HERO_EN).map((t, i) => {
        const on = t.k === st.heroTier;
        /* T0 → T4 climb the same gold from raw ore to full leaf */
        const shades = ['#6E5A16', '#8F7218', '#B08C1E', '#C9A227', '#E9C96B'];
        /* legible on the dark hero: the ramp reads in the border and fill, the text stays light */
        const inkOff = ['rgba(244,239,226,.72)', 'rgba(246,236,206,.78)', '#E4CE93', '#EBD49B', '#F3DE9C'];
        return { k: t.k, name: t.name,
          chip: 'display:inline-flex;align-items:center;gap:6px;padding:8px 13px;border-radius:99px;cursor:pointer;transition:all .3s cubic-bezier(.23,1,.32,1);' +
            (on ? 'background:' + shades[i] + ';color:' + (i < 2 ? '#F7EFD4' : '#241B04') + ';border:1px solid ' + shades[i] + ';box-shadow:0 0 16px ' + shades[i] + '55'
                : 'background:' + shades[i] + '1F;color:' + inkOff[i] + ';border:1px solid ' + shades[i] + '88') };
      }),
      pickHeroTier: (e) => this.setState({ heroTier: e.currentTarget.getAttribute('data-k') }),

      tiers: TIERS.map((t, i) => {
        const on = t.k === st.tier;
        const shades = ['#6E5A16', '#8F7218', '#B08C1E', '#C9A227', '#E9C96B'];
        const s = shades[i];
        return {
          k: t.k, name: t.name, short: t.short, line: t.body.split('.')[0] + '.',
          card: 'all:unset;cursor:pointer;box-sizing:border-box;display:block;width:100%;min-height:168px;padding:22px 20px;border-radius:18px;transition:transform .4s cubic-bezier(.23,1,.32,1),border-color .3s ease,background .3s ease;border:1px solid ' +
            (on ? s + ';background:#2A2006;color:#F4EFE2;transform:translateY(-4px);box-shadow:0 18px 40px ' + s + '2E'
                : 'rgba(35,28,11,.10);background:linear-gradient(160deg,' + s + '14,#FBF8F0 62%)'),
          numColor: on ? s : s,
          metaColor: on ? 'rgba(244,239,226,.7)' : '#8C8371',
          bodyColor: on ? 'rgba(244,239,226,.78)' : '#4A3F27'
        };
      }),
      tier,
      pickTier: (e) => this.setState({ tier: e.currentTarget.getAttribute('data-k') }),

      rail: arL ? RAIL_AR : RAIL_EN,
      regStages: arL ? STAGES_AR : STAGES_EN,
      regNeeds: arL ? NEEDS_AR : NEEDS_EN,

      gates10: GATES.map((g, i) => {
        const on = i === st.gate, gold = !!g.money;
        const c = gold ? '#F3DE9C' : '#E9C96B';
        return { i: String(i), id: 'G' + i, name: g.name,
          node: 'width:36px;height:36px;border-radius:99px;display:grid;place-items:center;font-family:IBM Plex Mono,monospace;font-size:10.5px;letter-spacing:.04em;transition:all .3s cubic-bezier(.23,1,.32,1);' +
            (on ? (gold ? 'background:linear-gradient(135deg,#C9A227,#F3DE9C);color:#3A2604;box-shadow:0 0 18px rgba(201,162,39,.55)'
                        : 'background:#E9C96B;color:#241B04;box-shadow:0 0 18px rgba(233,201,107,.45)')
                : 'background:#2A2006;color:' + c + ';border:1px solid ' + (gold ? 'rgba(201,162,39,.55)' : 'rgba(233,201,107,.35)')),
          lbl: 'font-size:10px;line-height:1.5;text-align:center;font-weight:' + (on ? '600' : '300') + ';color:' + (on ? (gold ? '#F3DE9C' : '#E9C96B') : 'rgba(244,239,226,.55)') };
      }),
      gateSel: { id: 'G' + st.gate, name: GATES[st.gate].name, body: GATES[st.gate].body,
        accent: GATES[st.gate].money ? '#F3DE9C' : '#E9C96B' },
      pickGate: (e) => this.setState({ gate: Number(e.currentTarget.getAttribute('data-k')) })
    };
  }
}