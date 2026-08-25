import React from 'react';
import DCLogic from '../../home/DCLogic.js';

const ROWS_AR = [
  { k:'scope', tag:'LINE 01 · SCOPE', title:'نطاق محدد',
    body:'يكتب المخرج بالعدد والصيغة: كم صفحة، كم منشورا، أي ملفات، بأي لغة. ما لم يكتب لا يعد داخلا، وما كتب لا يسقط.',
    rule:'لا يعرض سعر قبل تحرير النطاق.' },
  { k:'price', tag:'LINE 02 · PRICE', title:'سعر ثابت',
    body:'السعر معلن على النطاق، ولا يتغير ما لم يتغير النطاق بأمر تغيير موقع منك. لا ساعات تحتسب، ولا فاتورة تفاجئك.',
    rule:'أمر التغيير يسعر قبل تنفيذه، لا بعده.' },
  { k:'date', tag:'LINE 03 · DATE', title:'تاريخ ملزم',
    body:'الميقات يعد من اكتمال مدخلاتك أنت، لا من تاريخ الطلب. وتأخر المدخلات يحرك التاريخ بمقداره، ويقيد.',
    rule:'التأخير من جانب كيان يعالج بما نص عليه العقد.' },
  { k:'team', tag:'LINE 04 · TEAM', title:'فريق مسمى',
    body:'يقيد في أمر العمل من ينفذ ومن يراجع ومن يقود، بالاسم والصفة. ولا يبدل أحدهم دون إشعارك.',
    rule:'المراجعة المستقلة خارج الفريق، وتجاز من حصة كيان.' }
];
const ROWS_EN = [
  { k:'scope', tag:'LINE 01 · SCOPE', title:'Defined scope',
    body:'The deliverable is written in counts and formats: how many pages, how many posts, which files, in which language. What is not written is not included; what is written does not lapse.',
    rule:'No price is shown before the scope is drafted.' },
  { k:'price', tag:'LINE 02 · PRICE', title:'Fixed price',
    body:'The price is published against the scope and does not change unless the scope changes by a change order you sign. No billable hours, no surprise invoice.',
    rule:'A change order is priced before it is executed, not after.' },
  { k:'date', tag:'LINE 03 · DATE', title:'Binding date',
    body:'The clock runs from the completion of your inputs, not from the order date. Late inputs move the date by their measure — and it is recorded.',
    rule:"Delay on Kayan's side is remedied as the contract provides." },
  { k:'team', tag:'LINE 04 · TEAM', title:'Named team',
    body:'The work order names who delivers, who reviews, and who leads — by name and role. None is replaced without notice to you.',
    rule:"Independent review sits outside the team and is paid from Kayan's share." }
];

const RAIL_AR = [
  { n:'01', t:'تحرر النطاق', b:'تكتب المخرجات بالعدد والصيغة والميقات، وتوقع. وعليه وحده يقاس التسليم.' },
  { n:'02', t:'تودع القيمة', b:'تودع في حساب ضمان مخصص، لا في حساب تشغيل. ولا يبدأ عمل قبل الإيداع.' },
  { n:'03', t:'ينفذ الفريق', b:'يسمى الفريق في أمر العمل، ويبدأ العد من اكتمال مدخلاتك.' },
  { n:'04', t:'تجيز المراجعة', b:'تقرأ مراجعة مستقلة المخرج قبل خروجه، وترد ما لا يطابق النطاق.' },
  { n:'05', t:'تستلم وتقبل', b:'تستلم، ولك خمسة أيام للقبول أو الاعتراض المسبب. وعلى القبول يفرج عن المستحق.' }
];
const RAIL_EN = [
  { n:'01', t:'Scope is drafted', b:'Deliverables are written in counts, formats and dates — and you sign. Delivery is measured against it alone.' },
  { n:'02', t:'Value is deposited', b:'Into a dedicated escrow account, not an operating account. No work starts before the deposit.' },
  { n:'03', t:'The pod delivers', b:'The team is named in the work order; the clock starts when your inputs are complete.' },
  { n:'04', t:'Review clears it', b:'An independent review reads the deliverable before it leaves, and returns whatever misses the scope.' },
  { n:'05', t:'You receive and accept', b:'You have five days to accept or object with cause. On acceptance, the dues are released.' }
];

const NEEDS_AR = [
  { k:'brand', label:'هوية وتصميم' }, { k:'web', label:'موقع أو متجر' },
  { k:'social', label:'تسويق ووسائل تواصل' }, { k:'content', label:'محتوى وصياغة' },
  { k:'trans', label:'ترجمة ووثائق' }, { k:'donor', label:'مقترحات وتقارير مانحين' },
  { k:'data', label:'بيانات وبحوث' }, { k:'media', label:'إنتاج إعلامي' },
  { k:'events', label:'فعاليات وتنظيم' }, { k:'other', label:'غير ذلك' }
];
const NEEDS_EN = [
  { k:'brand', label:'Brand & design' }, { k:'web', label:'Website or store' },
  { k:'social', label:'Marketing & social' }, { k:'content', label:'Content & copy' },
  { k:'trans', label:'Translation & documents' }, { k:'donor', label:'Donor proposals & reports' },
  { k:'data', label:'Data & research' }, { k:'media', label:'Media production' },
  { k:'events', label:'Events & logistics' }, { k:'other', label:'Other' }
];

const STEPS_AR = [
  { tag:'STEP 01 · WHO', title:'من أنت', hint:'يفتح الحساب باسم الجهة المتعاقدة، لا باسم الشخص وحده.',
    fields:[
      { k:'org',  label:'اسم الجهة', ph:'اسم الشركة أو المنظمة، أو اسمك إن كنت فردا', req:true },
      { k:'type', label:'صفة الجهة', type:'select', options:['فرد','منشأة صغيرة أو متوسطة','شركة','منظمة أو أمم متحدة','جهة حكومية','مغترب خارج اليمن'] },
      { k:'name', label:'اسم المسؤول عن التواصل', ph:'الاسم والصفة', req:true },
      { k:'country', label:'بلد التعاقد', ph:'اليمن، السعودية، الإمارات…', req:true }
    ] },
  { tag:'STEP 02 · CONTACT', title:'كيف نصلك', hint:'يقيد في العقد بريد واحد يعتد به في الإشعارات.',
    fields:[
      { k:'email', label:'البريد الإلكتروني', ph:'name@example.com', req:true },
      { k:'phone', label:'رقم الهاتف مع مفتاح الدولة', ph:'٩٦٧٧٧…', req:true },
      { k:'lang',  label:'لغة المراسلة', type:'select', options:['العربية','الإنجليزية','كلتاهما'] },
      { k:'hours', label:'أنسب وقت للاتصال', type:'select', options:['صباحا','بعد الظهر','مساء','أي وقت'] }
    ] },
  { tag:'STEP 03 · NEED', title:'ما تحتاجه', hint:'صف النتيجة التي تريد بلوغها. النطاق يحرر عليها بعد الاتصال.', need:true,
    fields:[
      { k:'outcome', label:'النتيجة التي تريدها', ph:'أريد أن يصل مقترحنا إلى المانح قبل الثلاثين من الشهر', type:'area', req:true },
      { k:'when',    label:'الموعد الذي تحتاجها فيه', type:'select', options:['خلال ٤٨ ساعة','خلال أسبوع','خلال شهر','لم يتحدد بعد'] }
    ] },
  { tag:'STEP 04 · SETTLEMENT', title:'كيف تدفع', hint:'الإيداع في حساب ضمان مخصص. لا يطلب قبل توقيعك على النطاق.',
    fields:[
      { k:'band',   label:'حد الإنفاق المتوقع', type:'select', options:['دون ٥٠٠ دولار','٥٠٠ إلى ١٥٠٠','١٥٠٠ إلى ٥٠٠٠','فوق ٥٠٠٠','لم يتحدد بعد'] },
      { k:'method', label:'وسيلة الإيداع', type:'select', options:['حوالة بنكية','حوالة محلية','بطاقة','ترتيب مع جهة تمويل'] },
      { k:'vat',    label:'الرقم الضريبي أو رقم التسجيل', ph:'اتركه فارغا إن لم ينطبق' },
      { k:'note',   label:'شرط تعاقدي يلزم ذكره', ph:'قالب المانح، سياسة مشتريات، متطلب امتثال', type:'area' }
    ] }
];
const STEPS_EN = [
  { tag:'STEP 01 · WHO', title:'Who you are', hint:'The account opens in the name of the contracting entity, not the individual alone.',
    fields:[
      { k:'org',  label:'Entity name', ph:'Company or organization name — or your own if an individual', req:true },
      { k:'type', label:'Entity type', type:'select', options:['Individual','Small or medium business','Company','NGO or UN agency','Government body','Yemeni abroad'] },
      { k:'name', label:'Contact person', ph:'Name and role', req:true },
      { k:'country', label:'Country of contract', ph:'Yemen, Saudi Arabia, UAE…', req:true }
    ] },
  { tag:'STEP 02 · CONTACT', title:'How we reach you', hint:'One email is recorded in the contract for formal notices.',
    fields:[
      { k:'email', label:'Email', ph:'name@example.com', req:true },
      { k:'phone', label:'Phone with country code', ph:'+967 7…', req:true },
      { k:'lang',  label:'Correspondence language', type:'select', options:['Arabic','English','Both'] },
      { k:'hours', label:'Best time to call', type:'select', options:['Morning','Afternoon','Evening','Any time'] }
    ] },
  { tag:'STEP 03 · NEED', title:'What you need', hint:'Describe the outcome you want to reach. The scope is drafted on it after the call.', need:true,
    fields:[
      { k:'outcome', label:'The outcome you want', ph:'We need our proposal in front of the donor by the 30th', type:'area', req:true },
      { k:'when',    label:'When you need it', type:'select', options:['Within 48 hours','Within a week','Within a month','Not set yet'] }
    ] },
  { tag:'STEP 04 · SETTLEMENT', title:'How you pay', hint:'Deposits go to a dedicated escrow account. Nothing is requested before you sign the scope.',
    fields:[
      { k:'band',   label:'Expected spend band', type:'select', options:['Under $500','$500–1,500','$1,500–5,000','Above $5,000','Not set yet'] },
      { k:'method', label:'Deposit method', type:'select', options:['Bank transfer','Local exchange transfer','Card','Arrangement with a funder'] },
      { k:'vat',    label:'Tax or registration number', ph:'Leave empty if not applicable' },
      { k:'note',   label:'A contractual condition we must know', ph:'Donor template, procurement policy, compliance requirement', type:'area' }
    ] }
];

const NEXT_AR = [
  { t:'اتصال لتحرير النطاق', w:'يوم عمل' },
  { t:'مسودة النطاق والسعر', w:'٤٨ ساعة' },
  { t:'التوقيع ثم الإيداع', w:'عند رضاك' },
  { t:'فتح الأمر وبدء العد', w:'بعد الإيداع' }
];
const NEXT_EN = [
  { t:'A call to draft the scope', w:'1 working day' },
  { t:'Scope draft and price', w:'48 hours' },
  { t:'Signature, then deposit', w:'when satisfied' },
  { t:'Order opens, clock starts', w:'after deposit' }
];

const SEEDS_AR = ['أريد موقعا يقبل الحجوزات','أريد مقترحا جاهزا للمانح','أريد هوية كاملة لمشروع جديد','أريد فريقا يدير حساباتي شهريا'];
const SEEDS_EN = ['A website that takes bookings','A donor-ready proposal','A full identity for a new venture','A team to run my accounts monthly'];

export default class ClientsLogic extends DCLogic {
  constructor(props) {
    super(props);
    this.root = React.createRef();
    this.door2 = React.createRef();
    this.card = React.createRef();
    let lang = null;
    try { lang = localStorage.getItem('kyn-lang'); } catch (e) {}
    if (lang !== 'ar' && lang !== 'en') lang = (this.props.defaultLang === 'ar') ? 'ar' : 'en';
    this.state = { lang: lang, row:'scope', demo:'RP-002', step:0, done:false, ref:'', form:{}, need:{}, errs:{}, outcome:'' };
  }

  _syncDir() {
    const el = this.root.current;
    if (el) el.setAttribute('dir', this.state.lang === 'en' ? 'ltr' : 'rtl');
  }
  _initLive() {
    const root = this.root.current; if (!root) return;
    const els = [...root.querySelectorAll('[data-station]')];
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      els.forEach(el => el.setAttribute('data-live', '')); return;
    }
    this._liveIo = new IntersectionObserver(es => es.forEach(x => {
      if (!x.isIntersecting) return;
      const el = x.target, i = els.indexOf(el);
      setTimeout(() => el.setAttribute('data-live', ''), Math.max(0, i) * 90);
      this._liveIo.unobserve(el);
    }), { threshold: 0.15, rootMargin: '0px 0px -12% 0px' });
    els.forEach(el => this._liveIo.observe(el));
  }
  componentDidMount() {
    this._syncDir();
    setTimeout(() => this._initLive(), 60);
    this._docClick = (e) => {
      if (!this.state.openSel) return;
      const host = this.root.current;
      if (!host) return;
      const inSel = e.target.closest && e.target.closest('[data-sel]');
      if (!inSel) this.setState({ openSel: null });
    };
    document.addEventListener('click', this._docClick, true);
    this._initRev();
    this._initStagger();
    this._initSeq();
    this._rowCycle = setInterval(() => {
      if (document.hidden) return;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (this._rowHold && Date.now() - this._rowHold < 12000) return;
      const panel = this.root.current ? this.root.current.querySelector('[data-cardpanel]') : null;
      if (panel) { const r = panel.getBoundingClientRect(); if (r.bottom < 0 || r.top > window.innerHeight) return; }
      const keys = ['scope', 'price', 'date', 'team'];
      this.setState({ row: keys[(keys.indexOf(this.state.row) + 1) % keys.length] });
    }, 3800);
    try {
      const raw = localStorage.getItem('kayan.client.draft');
      if (raw) { const d = JSON.parse(raw); if (d && typeof d === 'object') this.setState({ form:d.form||{}, need:d.need||{}, step:d.step||0 }); }
    } catch (e) {}
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevState || prevState.lang !== this.state.lang) {
      this._syncDir();
      setTimeout(() => { this._revealAllRev(); if (this._seqApply) this._seqApply(); }, 60);
    }
    if (prevState && (prevState.step !== this.state.step || prevState.done !== this.state.done)) {
      const root = this.root.current;
      const box = root ? root.querySelector('#open [data-stagger]') : null;
      if (box) { box.removeAttribute('data-on'); void box.offsetWidth; requestAnimationFrame(() => box.setAttribute('data-on', '')); }
    }
    if (prevState && prevState.row !== this.state.row) {
      const el = this.root.current ? this.root.current.querySelector('[data-cardfade]') : null;
      if (el) { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = 'kRow .5s cubic-bezier(.2,.7,.2,1) both'; }
    }
    if (this._seqApply) this._seqApply();
  }
  componentWillUnmount() {
    if (this._liveIo) this._liveIo.disconnect();
    if (this._docClick) document.removeEventListener('click', this._docClick, true);
    if (this._io) this._io.disconnect();
    if (this._sio) this._sio.disconnect();
    if (this._sFail) clearTimeout(this._sFail);
    if (this._revFail) clearTimeout(this._revFail);
    if (this._rowCycle) clearInterval(this._rowCycle);
    if (this._seqScroll) window.removeEventListener('scroll', this._seqScroll);
    if (this._seqSize) window.removeEventListener('resize', this._seqSize);
    if (this._seqRaf) cancelAnimationFrame(this._seqRaf);
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
    const play = (box) => box.setAttribute('data-on', '');
    if (!('IntersectionObserver' in window) || reduce) { boxes.forEach(play); return; }
    this._sio = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { play(en.target); this._sio.unobserve(en.target); } });
    }, { threshold: 0.15 });
    boxes.forEach((b) => this._sio.observe(b));
    this._sFail = setTimeout(() => boxes.forEach(play), 6000);
  }
  _revealAllRev() {
    const root = this.root.current; if (!root) return;
    root.querySelectorAll('[data-rev]:not([data-on])').forEach((n) => n.setAttribute('data-on', ''));
    root.querySelectorAll('[data-stagger]:not([data-on])').forEach((n) => n.setAttribute('data-on', ''));
  }
  _initSeq() {
    const root = this.root.current; if (!root) return;
    this._seqs = [];
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.querySelectorAll('[data-seq]').forEach((s) => {
      const track = s.querySelector('[data-seq-track]');
      const box = s.querySelector('[data-seq-items]');
      if (!track || !box || reduce) return;
      this._seqs.push({ track, box });
    });
    if (!this._seqs.length) return;
    this._seqSize = () => this._seqs.forEach((q) => {
      const n = q.box.children.length || 1;
      const sticky = q.track.firstElementChild;
      const h = (sticky ? sticky.offsetHeight : window.innerHeight);
      q.track.style.height = (h + n * Math.min(260, window.innerHeight * 0.34)) + 'px';
    });
    this._seqSize();
    setTimeout(() => { this._seqSize(); if (this._seqApply) this._seqApply(); }, 400);
    window.addEventListener('resize', this._seqSize);
    this._seqApply = () => {
      this._seqs.forEach((q) => {
        const r = q.track.getBoundingClientRect();
        const sticky = q.track.firstElementChild;
        const top = sticky ? parseFloat(getComputedStyle(sticky).top) || 0 : 0;
        const total = r.height - (sticky ? sticky.offsetHeight : window.innerHeight);
        const p = total > 1 ? Math.min(1, Math.max(0, (top - r.top) / total)) : 1;
        const items = Array.from(q.box.children);
        const n = items.length; if (!n) return;
        const settled = p > 0.96;
        let newest = 0;
        items.forEach((it, i) => { if (p >= (i / n) * 0.92) newest = i; });
        items.forEach((it, i) => {
          const on = i <= newest;
          it.style.transition = 'opacity .5s cubic-bezier(.2,.7,.2,1),transform .5s cubic-bezier(.2,.7,.2,1),filter .5s ease';
          it.style.opacity = on ? ((settled || i === newest) ? '1' : '.8') : '0';
          it.style.transform = on ? 'none' : 'translateY(22px)';
          it.style.filter = on ? 'none' : 'blur(3px)';
        });
      });
    };
    this._seqScroll = () => {
      if (this._seqRaf) return;
      this._seqRaf = requestAnimationFrame(() => { this._seqRaf = 0; this._seqApply(); });
    };
    window.addEventListener('scroll', this._seqScroll, { passive: true });
    this._seqApply();
  }
  persist(patch) {
    const n = { form:this.state.form, need:this.state.need, step:this.state.step, ...patch };
    try { localStorage.setItem('kayan.client.draft', JSON.stringify(n)); } catch (e) {}
  }
  setField = (k, v) => {
    const form = { ...this.state.form, [k]: v };
    const errs = { ...this.state.errs }; delete errs[k];
    this.setState({ form, errs });
    this.persist({ form });
  };
  validate() {
    const arL = this.state.lang !== 'en';
    const STEPS = arL ? STEPS_AR : STEPS_EN;
    const s = STEPS[this.state.step], errs = {};
    (s.fields || []).forEach(f => {
      const v = (this.state.form[f.k] || '').trim();
      if (f.req && !v) errs[f.k] = arL ? 'حقل مطلوب' : 'Required';
      else if (f.k === 'email' && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) errs[f.k] = arL ? 'بريد غير صحيح' : 'Invalid email';
      else if (f.k === 'phone' && v && v.replace(/\D/g,'').length < 8) errs[f.k] = arL ? 'رقم غير مكتمل' : 'Incomplete number';
    });
    this.setState({ errs });
    return Object.keys(errs).length === 0;
  }

  renderVals() {
    const st = this.state;
    const arL = st.lang !== 'en', enL = !arL;
    const STEPS = arL ? STEPS_AR : STEPS_EN;
    const ROWS = arL ? ROWS_AR : ROWS_EN;
    const step = STEPS[st.step];
    const row = ROWS.find(r => r.k === st.row) || ROWS[0];
    const last = st.step === STEPS.length - 1;
    const fixed = (window.KAYAN_RP && window.KAYAN_RP.fixed) || [];
    const pick = ['RP-002','RP-001','RP-012','RP-009'].map(c => fixed.find(f => f.code === c)).filter(Boolean);
    const cur = pick.find(p => p.code === st.demo) || pick[0] || null;
    const ar = n => String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);

    const fields = (step.fields || []).map(f => {
      const err = st.errs[f.k];
      const isSelect = f.type === 'select', isArea = f.type === 'area';
      const val = st.form[f.k] || (isSelect ? f.options[0] : '');
      const open = st.openSel === f.k;
      return {
        k:f.k, label:f.label, ph:f.ph || '', options:f.options || [],
        value: val,
        isSelect, isArea, isText: !isSelect && !isArea,
        selBtn: 'all:unset;cursor:pointer;box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;height:52px;padding:14px 16px;background:#fff;border-radius:12px;font-size:14px;font-weight:500;color:#0C2A28;border:1px solid ' + (open ? '#12B5A4;box-shadow:0 0 0 3px rgba(18,181,164,.16)' : '#E0D8C6'),
        caret: 'flex:none;width:8px;height:8px;border-right:1.6px solid #0A6F68;border-bottom:1.6px solid #0A6F68;transform:rotate(' + (open ? '-135deg' : '45deg') + ') translateY(' + (open ? '2px' : '-2px') + ');transition:transform .28s cubic-bezier(.23,1,.32,1)',
        panel: 'position:absolute;z-index:20;inset-inline:0;top:calc(100% + 8px);background:#FFFFFF;border:1px solid rgba(7,27,26,.12);border-radius:14px;box-shadow:0 22px 48px -18px rgba(5,49,45,.35);padding:6px;display:grid;gap:2px;max-height:264px;overflow:auto;transform-origin:top;transition:opacity .22s ease,transform .26s cubic-bezier(.23,1,.32,1),visibility .26s;' +
          (open ? 'opacity:1;visibility:visible;transform:translateY(0) scale(1)' : 'opacity:0;visibility:hidden;transform:translateY(-6px) scale(.985)'),
        optionRows: (f.options || []).map(o => ({
          k: f.k, v: o,
          style: 'all:unset;cursor:pointer;box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;padding:11px 13px;border-radius:9px;font-size:13.5px;transition:background .18s ease;' +
            (o === val ? 'background:rgba(18,181,164,.12);color:#0A6F68;font-weight:600' : 'color:#3C514F'),
          tick: 'flex:none;font-size:12px;color:#12B5A4;opacity:' + (o === val ? '1' : '0')
        })),
        wrap: 'display:block;min-width:0' + (isArea ? ';grid-column:1/-1' : ''),
        err: err || '',
        errStyle: 'display:block;font-size:11.5px;margin-top:6px;color:#C0563C;min-height:14px;opacity:' + (err ? '1' : '0')
      };
    });

    const setLang = (l) => {
      if (l === st.lang) return;
      try { localStorage.setItem('kyn-lang', l); } catch (e) {}
      this.setState({ lang: l, errs: {} });
    };

    return {
      rootRef: this.root,
      door2Ref: this.door2,
      door2Move: (e) => {
        const el = this.door2.current; if (!el) return;
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', (nx * 100) + '%');
        el.style.setProperty('--my', (ny * 100) + '%');
        el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - ny) * 2.2).toFixed(2) + 'deg) rotateY(' + ((nx - 0.5) * 2.6).toFixed(2) + 'deg) translateY(-2px)';
        const g = el.querySelector('[data-door2glow]'); if (g) g.style.opacity = '1';
      },
      door2Leave: () => {
        const el = this.door2.current; if (!el) return;
        el.style.transform = 'none';
        const g = el.querySelector('[data-door2glow]'); if (g) g.style.opacity = '0';
      },
      ar: arL, en: enL,
      toggleAr: () => setLang('ar'),
      toggleEn: () => setLang('en'),
      arBtnBg: arL ? '#12B5A4' : 'transparent', arBtnFg: arL ? '#04302C' : 'rgba(244,239,226,.7)',
      enBtnBg: enL ? '#12B5A4' : 'transparent', enBtnFg: enL ? '#04302C' : 'rgba(244,239,226,.7)',
      arrowChar: arL ? '←' : '→',
      gatewayTag: arL ? 'AR' : 'EN',

      demo: cur ? {
        code: cur.code, name: cur.ar, price: '$' + cur.usd,
        priceAr: ar(cur.usd) + ' دولارا' + (cur.unit === '/mo' ? ' شهريا' : ''),
        days: cur.daysAr,
        scope: (cur.recAr && cur.recAr[0]) || ''
      } : { code:'RP-002', name:'موقع إلكتروني احترافي', price:'$1200', priceAr:'١٢٠٠ دولارا', days:'٢١ يوما', scope:'موقع متجاوب ٥–٧ صفحات، ثنائي اللغة' },
      demoChips: pick.map(p => ({
        k: p.code, label: p.ar.length > 22 ? p.ar.slice(0, 21) + '…' : p.ar,
        style: 'all:unset;cursor:pointer;border-radius:99px;padding:5px 11px;font-size:11px;transition:background .25s ease,color .25s ease,border-color .25s ease;border:1px solid ' +
          (p.code === st.demo ? '#12B5A4;background:#12B5A4;color:#04302C' : 'rgba(7,27,26,.16);color:#4A5F5D')
      })),
      pickDemo: (e) => this.setState({ demo: e.currentTarget.getAttribute('data-k') }),

      rows: ROWS.map(r => ({
        k:r.k, title:r.title, tag:r.tag,
        btn: 'all:unset;cursor:pointer;box-sizing:border-box;display:block;width:100%;padding:16px 18px;border-radius:14px;transition:background .3s ease,border-color .3s ease,transform .3s cubic-bezier(.23,1,.32,1);border:1px solid ' +
          (r.k === st.row ? '#12B5A4;background:#fff;transform:translateX(' + (arL ? '-4px' : '4px') + ')' : 'rgba(7,27,26,.10);background:#F4EFE2'),
        dot: 'width:9px;height:9px;border-radius:99px;flex:none;background:' + (r.k === st.row ? '#12B5A4' : 'rgba(7,27,26,.18)')
      })),
      row,
      pickRow: (e) => { this._rowHold = Date.now(); this.setState({ row: e.currentTarget.getAttribute('data-k') }); },
      rail: arL ? RAIL_AR : RAIL_EN,

      outcome: st.outcome,
      outcomePh: arL ? 'أريد أن يصل مقترحنا إلى المانح قبل الثلاثين من الشهر' : 'We need our proposal in front of the donor by the 30th',
      seeds: arL ? SEEDS_AR : SEEDS_EN,
      onOutcome: (e) => this.setState({ outcome: e.currentTarget.value }),
      pickSeed: (e) => this.setState({ outcome: e.currentTarget.getAttribute('data-t') }),
      scopeLabel: st.outcome.trim()
        ? (arL ? 'احمل هذه النتيجة إلى تحرير النطاق' : 'Carry this outcome into scoping')
        : (arL ? 'اذهب إلى تحرير النطاق' : 'Go to scoping'),
      scopeHref: 'Kayan Toolkit - Scoping Form.dc.html' + (st.outcome.trim() ? '?outcome=' + encodeURIComponent(st.outcome.trim()) : ''),

      dots: STEPS.map((s, i) => ({
        style: 'width:' + (i === st.step && !st.done ? '26px' : '8px') + ';height:8px;border-radius:99px;transition:width .45s cubic-bezier(.23,1,.32,1),background-color .45s ease;background:' +
          (st.done || i < st.step ? '#12B5A4' : i === st.step ? '#0A6F68' : 'rgba(7,27,26,.16)')
      })),
      pct: (st.done ? 100 : Math.round((st.step / STEPS.length) * 100)) + '%',
      stepTag: step.tag, stepTitle: step.title, stepHint: step.hint,
      stepCount: arL ? ('الخطوة ' + (st.step + 1) + ' من ' + STEPS.length) : ('Step ' + (st.step + 1) + ' of ' + STEPS.length),
      nextLabel: last ? (arL ? 'افتح الحساب' : 'Open the account') : (arL ? 'التالي' : 'Next'),
      backLabel: arL ? 'السابق' : 'Back',
      needPrompt: arL ? 'ما الذي تحتاجه الآن؟ اختر ما ينطبق.' : 'What do you need now? Pick all that apply.',
      doneChip: arL ? 'حساب مفتوح' : 'Account open',
      isNeed: !!step.need,
      fields,
      needs: (arL ? NEEDS_AR : NEEDS_EN).map(n => ({
        k:n.k, label:n.label,
        style: 'all:unset;cursor:pointer;border-radius:99px;padding:8px 15px;font-size:12.5px;transition:background .25s ease,color .25s ease,border-color .25s ease;border:1px solid ' +
          (st.need[n.k] ? '#12B5A4;background:#12B5A4;color:#04302C' : 'rgba(7,27,26,.16);background:#fff;color:#4A5F5D')
      })),
      toggleNeed: (e) => {
        const k = e.currentTarget.getAttribute('data-k');
        const need = { ...this.state.need, [k]: !this.state.need[k] };
        this.setState({ need }); this.persist({ need });
      },
      onField: (e) => this.setField(e.currentTarget.getAttribute('data-k'), e.currentTarget.value),
      stepKey: 'step-' + st.step,
      cardRef: this.card,
      cardMove: (e) => {
        const el = this.card.current; if (!el) return;
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--fx', ((e.clientX - r.left) / r.width * 100) + '%');
        el.style.setProperty('--fy', ((e.clientY - r.top) / r.height * 100) + '%');
        const g = el.querySelector('[data-cardglow]'); if (g) g.style.opacity = '1';
      },
      cardLeave: () => {
        const el = this.card.current; if (!el) return;
        const g = el.querySelector('[data-cardglow]'); if (g) g.style.opacity = '0';
      },
      toggleSel: (e) => {
        const k = e.currentTarget.getAttribute('data-k');
        this.setState({ openSel: this.state.openSel === k ? null : k });
      },
      chooseOpt: (e) => {
        const k = e.currentTarget.getAttribute('data-k'), v = e.currentTarget.getAttribute('data-v');
        this.setState({ openSel: null });
        this.setField(k, v);
      },
      done: st.done, ref: st.ref, nextSteps: arL ? NEXT_AR : NEXT_EN,
      backStyle: 'background:transparent;border:1px solid rgba(7,27,26,.18);color:#3C514F;font-size:14px;padding:12px 22px;border-radius:99px;cursor:pointer;transition:opacity .3s ease,border-color .2s ease;opacity:' + (st.step === 0 ? '.35' : '1'),
      back: () => {
        if (this.state.step === 0) return;
        const step = this.state.step - 1;
        const body = this.root.current ? this.root.current.querySelector('[data-stepbody]') : null;
        const go = () => { this.setState({ step, errs:{}, openSel:null }); this.persist({ step }); };
        if (body && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
          body.setAttribute('data-leaving', ''); setTimeout(go, 200);
        } else go();
      },
      next: () => {
        if (!this.validate()) return;
        if (last) {
          const ref = 'CLI-' + String(Math.floor(Math.random() * 9000) + 1000);
          const rec = { ...this.state.form, needs:Object.keys(this.state.need).filter(k => this.state.need[k]), ref, at:new Date().toISOString(), status:'قيد تحرير النطاق' };
          try { localStorage.setItem('kayan.client', JSON.stringify(rec)); localStorage.removeItem('kayan.client.draft'); } catch (e) {}
          this.setState({ done:true, ref });
        } else {
          const step = this.state.step + 1;
          const body = this.root.current ? this.root.current.querySelector('[data-stepbody]') : null;
          const go = () => { this.setState({ step, openSel: null }); this.persist({ step }); };
          if (body && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
            body.setAttribute('data-leaving', ''); setTimeout(go, 200);
          } else go();
        }
      },
      reset: () => { this.setState({ done:false, step:0, form:{}, need:{}, errs:{}, ref:'' }); try { localStorage.removeItem('kayan.client.draft'); } catch (e) {} }
    };
  }
}