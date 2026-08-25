import React from 'react';
import DCLogic from '../../home/DCLogic.js';

const STAGES = [
  { code: '01', name: 'التصميم', phase: 'قبل فتح الباب', owner: 'قائد المصنع', ownerCode: 'FRG-LEAD',
    what: 'يصمم الفوج ومنهجه على حاجة أعلن عنها السوق — تخصص مسمى، لا مادة عامة. ولا يفتح باب حتى تصطف خلفه جهة راعية.',
    items: ['تؤكد الحاجة مع مشتر أو جهة راعية', 'يكتب المنهج على المعيار', 'يقيد المدربون بتقييماتهم', 'تثبت المقاعد والمواعيد والمعايير'],
    auto: 'يشتق المنهج من المعيار المضبوط ويفتح قيد الفوج، فتكتب كل مرحلة لاحقة في ملف واحد.' },
  { code: '02', name: 'الاستقطاب', phase: 'فتح الباب', owner: 'منسق الفوج', ownerCode: 'FRG-COORD',
    what: 'تفتح الطلبات ويعمل على الاستقطاب في المدينة — لا يترك لمن صادف منشورا. وتنشر المعايير مع الإعلان.',
    items: ['يمتد الوصول عبر الشركاء والملتقى', 'تلتقط الطلبات في نموذج واحد', 'تنشر المعايير ولا تخفى'],
    auto: 'يغذي نموذج الالتحاق قائمة متقدمين واحدة، بختم زمني على كل طلب.' },
  { code: '03', name: 'الاختيار', phase: 'فتح الباب', owner: 'منسق الفوج', ownerCode: 'FRG-COORD',
    what: 'يختار المشاركون على المعايير المنشورة، ويكتب سبب كل قرار. يزن الاختيار الالتزام كما يزن الاستعداد، لأن المقعد مدعوم ويتوقع إتمامه.',
    items: ['تفرز الطلبات على المعايير', 'يسبب القرار في القيد', 'تعرض المقاعد وتؤكد'],
    auto: 'الفرز وسجل الاختيار، فيراجع القرار بعد أشهر إن لزم.' },
  { code: '04', name: 'الالتحاق', phase: 'فتح الباب', owner: 'منسق الفوج', ownerCode: 'FRG-COORD',
    what: 'تؤكد المقاعد ويتشكل الفوج. يوقع كل مشارك اتفاق التحاق يبين ما البرنامج، وما المتوقع منه، وما الذي يقع في الختام.',
    items: ['يوقع اتفاق الالتحاق', 'يثبت موقف الرسوم — صفر على المقعد المرعي', 'يقفل الكشف'],
    auto: 'قيد الالتحاق والكشف، وعليهما تدار مرحلتا الحضور والتقييم.' },
  { code: '05', name: 'التنفيذ', phase: 'التنفيذ', owner: 'المدرب والمرشد', ownerCode: 'FRG-TRAIN',
    what: 'يجرى البرنامج. تقدم الجلسات على المنهج، ويرافقها الإرشاد، ويحفظ ما ينتجه كل مشارك دليلا — فهو ما يقرؤه التقييم.',
    items: ['تقدم الجلسات على المنهج', 'يؤخذ الحضور في كل جلسة', 'يقيد الإرشاد', 'يحفظ إنتاج المشارك دليلا'],
    auto: 'تتبع الحضور وسجل الجلسات؛ ينبه المدرب إلى المتأخر بدل اكتشافه في الختام.' },
  { code: '06', name: 'التقييم', phase: 'التنفيذ', owner: 'مقيم مستقل', ownerCode: 'FRG-TRAIN',
    what: 'يقيم المشاركون على المعيار المنشور بيد من لم يقدم الجلسات. تعلن النتائج نطاقات بمعنى مكتوب — لا درجات مجردة — ولكل نتيجة تظلم واحد.',
    items: ['يستكمل التقييم على المعيار', 'تقيد النتيجة مسببة', 'تبلغ الملاحظات إلى المشارك', 'يبين طريق التظلم'],
    auto: 'سجل التقييم ونتائجه، تكتب مباشرة على قيد الشخص.' },
  { code: '07', name: 'التخرج', phase: 'الخروج', owner: 'قائد المصنع', ownerCode: 'FRG-LEAD',
    what: 'يتم الفوج من اجتاز. الإتمام واقعة تقيد — ومذكرة الجاهزية المرافقة هي ما يعني المرحلة التالية، لا الحفل.',
    items: ['يؤكد التخرج على المعيار', 'يقيد الإتمام في السجل', 'تدون الجاهزية لكل تخصص'],
    auto: 'قيد التخرج ووثيقة إتمام تشير إلى السجل ولا تحل محله.' },
  { code: '08', name: 'التوثيق', phase: 'التسليم', owner: 'قائد المصنع ← التوثيق', ownerCode: 'FRG-LEAD',
    what: 'يدخل الخريجون خط التوثيق ذاته الذي يدخله كل مسجل لدى كيان. يسلم المصنع الدليل، ولا يقرر النتيجة.',
    items: ['الهوية والوثائق', 'الفحص على قوائم العقوبات', 'تقييم الحرفة والمهمة العملية', 'المقابلة ثم قرار مسبب'],
    auto: 'التسليم إلى التوثيق وإنشاء قيد الكفاءة، فلا يعاد إدخال شيء ولا يضيع شيء بين الاثنين.' },
  { code: '09', name: 'التتبع', phase: 'بعد الفوج', owner: 'الرعاية والشراكات', ownerCode: 'FRG-SPON',
    what: 'يتابع ما وقع بعد ذلك: التكليف، والدخل، و— بموافقة — القصة. هذا مقياس الخط الحقيقي، والأساس الأمين الوحيد لتقرير الجهة الراعية.',
    items: ['يقيد التكليف أو التوظيف', 'يلتقط أثر الدخل', 'تؤخذ القصة بموافقة', 'يصدر تقرير الراعي على إيقاع معلوم'],
    auto: 'متتبع النتائج وتقرير الراعي، يجمعان من القيود لا من الذاكرة.' }
];

const TIERS = [
  { tier: 'T0', name: 'مسجل', asserts: 'يوجد قيد. ولا يثبت شيء بعد.',
    evidence: 'استكمل التسجيل وقبلت الشروط.', decision: 'آلي.', validity: 'حتى يحل غيره محله.',
    unlocks: 'قيد وطريق — الخطوات المحددة التي ترفع صاحبها.', not: 'لا يظهر للعملاء بأي صورة.' },
  { tier: 'T1', name: 'موثق الهوية', asserts: 'شخص حقيقي يمكن الوصول إليه، بلغ السن النظامية وقبل شروطنا.',
    evidence: 'فحصت وثائق الهوية والأهلية، وأكد التواصل، وخلا فحص العقوبات من الموانع.', decision: 'موظف توثيق.', validity: '24 شهرا، ثم إعادة فحص للوثائق.',
    unlocks: 'يظهر داخليا؛ ويجوز النظر فيه لأدوار تدريبية تحت إشراف.', not: 'لا تثبت به قدرة لأحد.' },
  { tier: 'T2', name: 'مقيم القدرة', asserts: 'أثبت كفاءة في تخصص مسمى واحد على الأقل.',
    evidence: 'T1، وتقييم حرفة مجتاز في تخصص، وفرز كفايات أساسية، وملف أعمال أو مهمة عملية.', decision: 'موظف توثيق بمدخلات المقيم.', validity: '18 شهرا لكل تخصص.',
    unlocks: 'يجوز تقديمه للعملاء ضمن فريق؛ ويجوز أن يشغل أدوار مساهم.', not: 'لا حق له في أن يختار.' },
  { tier: 'T3', name: 'مثبت التسليم', asserts: 'سلم عملا حقيقيا عبر كيان، وقبله عميل.',
    evidence: 'T2، وتكليفات مقبولة بلا نزاع قائم، وجهة تزكية موثقة واحدة على الأقل، وتزكية قائد فريق.', decision: 'معتمدان اثنان.', validity: '12 شهرا تتجدد بالتسليم.',
    unlocks: 'يجوز أن يراجع ويقود مسارات عمل؛ ويسمى للعملاء صاحب خبرة.', not: 'لا حق له في قيادة فريق.' },
  { tier: 'T4', name: 'معتمد كيان', asserts: 'تضع كيان اسمها خلف هذا الشخص.',
    evidence: 'T3 مستمرا، وتدقيق ملف الأعمال، وقيادة عمل مسلم، وإسهام في الآخرين مراجعة أو إرشادا، وسجل سلوك نظيف.', decision: 'معتمدان، أحدهما بمستوى تنفيذي.', validity: '12 شهرا، بمراجعة سنوية.',
    unlocks: 'يجوز أن يقود الفرق ويمثل كيان أمام العملاء.', not: 'ولا حق له في العمل بعد.' }
];

const INTAKE = {
  'Open': { label: 'INTAKE OPEN · COHORT 01', dot: '#FF6250', border: 'rgba(255,98,80,.5)', text: '#FF8A6B', cta: 'قدم إلى الفوج' },
  'Closing soon': { label: 'INTAKE CLOSING · COHORT 01', dot: '#FFB627', border: 'rgba(255,182,39,.5)', text: '#FFB627', cta: 'قدم قبل الإغلاق' },
  'Closed': { label: 'INTAKE CLOSED · NEXT COHORT ANNOUNCED HERE', dot: 'rgba(250,246,236,.55)', border: 'rgba(250,246,236,.28)', text: 'rgba(250,246,236,.7)', cta: 'انضم إلى قائمة الفوج التالي' }
};

export default class ForgeArLogic extends DCLogic {
  constructor(props) {
    super(props);
    this.root = React.createRef();
    this.hdr = React.createRef();
    this.brand = React.createRef();
    this.prog = React.createRef();
    this.idx = React.createRef();
    this.ember = React.createRef();
    this.state = { stage: 0, tier: 2, playing: false, flipped: false };
  }

  initIndex() {
    const el = this.root.current, nav = this.idx.current;
    if (!el || !nav) return;
    const items = Array.from(nav.querySelectorAll('[data-ifor]'));
    const fit = () => { nav.style.display = window.innerWidth >= 1180 ? 'flex' : 'none'; };
    fit();
    window.addEventListener('resize', fit, { passive: true });
    this.onFit = fit;
    const set = (id) => {
      items.forEach((a) => {
        const on = a.getAttribute('data-ifor') === id;
        const dot = a.querySelector('[data-idot]');
        const lab = a.querySelector('[data-ilabel]');
        if (dot) { dot.style.background = on ? '#FF6250' : '#DCCFB4'; dot.style.transform = on ? 'scale(1.5)' : 'none'; }
        if (lab) { lab.style.opacity = on ? '1' : '0'; lab.style.transform = on ? 'none' : 'translateX(-6px)'; lab.style.color = on ? '#D0402F' : '#8A8272'; }
      });
    };
    const secs = items.map((a) => el.querySelector('#' + a.getAttribute('data-ifor'))).filter(Boolean);
    this.idxIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) set(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    secs.forEach((s) => this.idxIo.observe(s));
    set('top');
  }

  initCounters() {
    const el = this.root.current;
    if (!el) return;
    const nodes = Array.from(el.querySelectorAll('[data-count]'));
    if (!nodes.length) return;
    this.cntIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        this.cntIo.unobserve(e.target);
        const to = parseInt(e.target.getAttribute('data-count'), 10) || 0;
        const t0 = performance.now(), dur = 900 + Math.min(600, to * 4);
        const step = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          e.target.textContent = String(Math.round(to * eased));
          if (p < 1) requestAnimationFrame(step);
        };
        e.target.textContent = '0';
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    nodes.forEach((n) => this.cntIo.observe(n));
  }

  initMagnets() {
    const el = this.root.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const mags = Array.from(el.querySelectorAll('[data-mag]'));
    if (!mags.length) return;
    let pending = null, raf = 0;
    const apply = () => {
      raf = 0;
      const e = pending;
      if (!e) return;
      for (let i = 0; i < mags.length; i++) {
        const m = mags[i];
        const r = m.getBoundingClientRect();
        if (!r.width) continue;
        const dx = e.x - (r.left + r.width / 2), dy = e.y - (r.top + r.height / 2);
        if (Math.abs(dx) < r.width / 2 + 52 && Math.abs(dy) < r.height / 2 + 52) {
          m.style.translate = (dx * 0.12).toFixed(1) + 'px ' + (dy * 0.17).toFixed(1) + 'px';
          m.style.setProperty('--sx', (((e.x - r.left) / r.width) * 100).toFixed(1) + '%');
          m.style.setProperty('--sy', (((e.y - r.top) / r.height) * 100).toFixed(1) + '%');
        } else if (m.style.translate) {
          m.style.translate = '';
        }
      }
    };
    const onMove = (ev) => {
      pending = { x: ev.clientX, y: ev.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    this.magnets = { onMove: onMove, stop: () => { if (raf) cancelAnimationFrame(raf); } };
  }

  initCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const ring = document.createElement('div');
    ring.setAttribute('data-cur', '');
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring);
    let x = -100, y = -100, tx = -100, ty = -100, raf = 0, shown = false;
    const tick = () => {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      ring.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      raf = (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; x = tx; y = ty; ring.style.opacity = '1'; }
      const hot = e.target && e.target.closest && e.target.closest('a,button,[role="tab"]');
      if (hot) ring.setAttribute('data-hot', ''); else ring.removeAttribute('data-hot');
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onOut = (e) => { if (!e.relatedTarget) { ring.style.opacity = '0'; shown = false; } };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerout', onOut, { passive: true });
    this.cursor = { ring: ring, onMove: onMove, onOut: onOut, stop: () => { if (raf) cancelAnimationFrame(raf); } };
  }

  initBurst() {
    const cv = document.createElement('canvas');
    cv.setAttribute('data-burst', '');
    cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    if (!ctx) { cv.remove(); return; }
    let raf = 0;
    const P = [];
    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(window.innerWidth * dpr);
      cv.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const frame = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i];
        p.vy += 0.05; p.vx *= 0.986; p.vy *= 0.986;
        p.x += p.vx; p.y += p.vy; p.life -= 0.016;
        if (p.life <= 0) { P.splice(i, 1); continue; }
        const a = p.life * p.a, r = p.r * (0.6 + p.life * 0.8);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
        g.addColorStop(0, 'rgba(255,' + p.g + ',' + p.b + ',' + a.toFixed(3) + ')');
        g.addColorStop(1, 'rgba(255,' + p.g + ',' + p.b + ',0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, r * 4, 0, 6.2832); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      raf = P.length ? requestAnimationFrame(frame) : 0;
    };
    const spawn = (x, y, n) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.2832, s = 0.8 + Math.random() * 3.3, hot = Math.random() > 0.62;
        P.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.15,
          r: 0.6 + Math.random() * 1.5, life: 0.55 + Math.random() * 0.6,
          a: 0.45 + Math.random() * 0.5, g: hot ? 208 : 112, b: hot ? 172 : 84 });
      }
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onDown = (e) => { if (e.isPrimary !== false) spawn(e.clientX, e.clientY, 15); };
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('resize', size, { passive: true });
    this.spawnBurst = spawn;
    this.burst = { cv: cv, onDown: onDown, size: size, stop: () => { if (raf) cancelAnimationFrame(raf); } };
  }

  initSmoothScroll() {
    const el = this.root.current;
    if (!el) return;
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const onClick = (e) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      const a = e.target && e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const hdrH = this.hdr.current ? this.hdr.current.getBoundingClientRect().height : 74;
      const from = window.scrollY;
      const to = Math.max(0, from + target.getBoundingClientRect().top - (id === 'top' ? 0 : hdrH - 1));
      const dist = Math.abs(to - from);
      if (dist < 4) return;
      const dur = Math.min(1150, Math.max(430, dist * 0.4));
      const t0 = performance.now();
      if (this.scrollRaf) cancelAnimationFrame(this.scrollRaf);
      const step = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        window.scrollTo(0, from + (to - from) * ease(k));
        if (k < 1) { this.scrollRaf = requestAnimationFrame(step); }
        else { this.scrollRaf = 0; if (window.history && history.replaceState) history.replaceState(null, '', '#' + id); }
      };
      this.scrollRaf = requestAnimationFrame(step);
    };
    el.addEventListener('click', onClick);
    this.smooth = { el: el, onClick: onClick };
  }

  initEmbers() {
    const cv = this.ember.current, el = this.root.current;
    if (!cv || !el) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const hero = cv.parentElement;
    let w = 0, h = 0, dpr = 1, raf = 0, running = false;
    const pt = { x: -1, y: -1 };
    let draft = 0, lastY = window.scrollY;
    const N = window.innerWidth < 760 ? 34 : 68;
    const P = [];
    const seed = (p, first) => {
      p.x = Math.random() * w;
      p.y = first ? Math.random() * h : h + Math.random() * 40;
      p.r = 0.5 + Math.random() * 1.7;
      p.vy = -(0.16 + Math.random() * 0.42);
      p.vx = (Math.random() - 0.5) * 0.22;
      p.a = 0.16 + Math.random() * 0.5;
      p.ph = Math.random() * 6.28;
      p.hot = Math.random() > 0.72;
    };
    for (let i = 0; i < N; i++) { const p = {}; seed(p, true); P.push(p); }
    const size = () => {
      dpr = Math.min(2.5, window.devicePixelRatio || 1);
      const r = hero.getBoundingClientRect();
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < P.length; i++) {
        const p = P[i];
        p.ph += 0.03;
        p.y += p.vy - draft * (0.4 + p.r * 0.5);
        p.x += p.vx + Math.sin(p.ph) * 0.22;
        if (pt.x >= 0) {
          const dx = p.x - pt.x, dy = p.y - pt.y, d2 = dx * dx + dy * dy;
          if (d2 < 26000) {
            const f = (1 - d2 / 26000) * 0.5;
            p.x += (dx / (Math.sqrt(d2) + 6)) * f * 2.6;
            p.y -= f * 1.1;
          }
        }
        if (p.y < -20 || p.x < -30 || p.x > w + 30) seed(p, false);
        const flick = 0.72 + Math.sin(p.ph * 2.1) * 0.28;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5.2);
        const col = p.hot ? '255,190,150' : '255,110,86';
        g.addColorStop(0, 'rgba(' + col + ',' + (p.a * flick).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(' + col + ',0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5.2, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      draft *= 0.9;
      raf = running ? requestAnimationFrame(frame) : 0;
    };
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; };
    this.emberIo = new IntersectionObserver(([e]) => { e.isIntersecting ? start() : stop(); }, { threshold: 0 });
    this.emberIo.observe(hero);
    const onResize = () => size();
    window.addEventListener('resize', onResize, { passive: true });
    const onPt = (e) => {
      const r = hero.getBoundingClientRect();
      if (e.clientY > r.top && e.clientY < r.bottom) { pt.x = e.clientX - r.left; pt.y = e.clientY - r.top; }
      else { pt.x = -1; pt.y = -1; }
    };
    window.addEventListener('pointermove', onPt, { passive: true });
    const onDraft = () => {
      const y = window.scrollY;
      draft = Math.max(-1.6, Math.min(1.6, draft + (y - lastY) * 0.014));
      lastY = y;
    };
    window.addEventListener('scroll', onDraft, { passive: true });
    this.stopEmbers = () => {
      stop();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPt);
      window.removeEventListener('scroll', onDraft);
    };
  }

  componentDidMount() {
    const el = this.root.current;
    if (!el) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setHdr = (on) => {
      const h = this.hdr.current;
      if (!h) return;
      h.style.background = on ? 'rgba(250,246,236,.93)' : 'transparent';
      h.style.borderBottomColor = on ? 'rgba(46,15,10,.14)' : 'transparent';
      h.style.backdropFilter = on ? 'blur(16px)' : 'none';
      if (this.brand.current) this.brand.current.style.color = on ? '#2E0F0A' : '#FAF6EC';
      el.querySelectorAll('[data-hlink]').forEach((a) => { a.style.color = on ? 'rgba(46,15,10,.74)' : 'rgba(250,246,236,.72)'; });
      const pill = el.querySelector('[data-hpill]');
      if (pill) {
        pill.style.color = on ? 'rgba(46,15,10,.66)' : 'rgba(250,246,236,.66)';
        pill.style.borderColor = on ? 'rgba(46,15,10,.28)' : 'rgba(250,246,236,.32)';
      }
    };
    setHdr(false);
    const hero = el.querySelector('[data-hero]');
    if (hero) {
      const sentinel = document.createElement('div');
      sentinel.style.cssText = 'position:absolute;top:40px;left:0;width:1px;height:1px;pointer-events:none;';
      hero.appendChild(sentinel);
      this.hdrIo = new IntersectionObserver(([e]) => setHdr(!e.isIntersecting), { threshold: 0 });
      this.hdrIo.observe(sentinel);
    }

    const onScroll = () => {
      const p = this.prog.current;
      if (!p) return;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      p.style.width = (h > 0 ? Math.min(100, Math.max(0, (window.scrollY / h) * 100)) : 0) + '%';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    this.onScroll = onScroll;

    this.initIndex();

    const rail = el.querySelector('[data-rail]');
    if (rail) {
      const onKey = (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const d = e.key === 'ArrowLeft' ? 1 : -1;
        this.setState((s) => ({ stage: (s.stage + d + 9) % 9 }));
      };
      rail.addEventListener('keydown', onKey);
      this.railKey = { rail: rail, fn: onKey };
    }

    if (this.props.motion === false || reduce) return;
    el.setAttribute('data-mo', '');
    this.initCounters();
    this.initEmbers();
    this.initSmoothScroll();
    this.initMagnets();
    this.initCursor();
    this.initBurst();
    this.io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.setAttribute('data-on', ''); this.io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    this.scan();
    this.initPointer();
  }

  initPointer() {
    const el = this.root.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const birds = Array.from(el.querySelectorAll('[data-bird]'));
    const heat = this.props.heat === false ? [] : Array.from(el.querySelectorAll('[data-heat]')).map((sec) => ({
      sec: sec, glow: sec.querySelector('[data-glow]'), x: 0, y: 0, tx: 0, ty: 0, on: false
    })).filter((h) => h.glow);
    if (!birds.length && !heat.length) return;

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
      heat.forEach((h) => {
        h.x += (h.tx - h.x) * 0.14;
        h.y += (h.ty - h.y) * 0.14;
        if (Math.abs(h.tx - h.x) > 0.4 || Math.abs(h.ty - h.y) > 0.4) live = true;
        h.glow.style.transform = 'translate3d(' + h.x.toFixed(1) + 'px,' + h.y.toFixed(1) + 'px,0)';
      });
      idle = live ? 0 : idle + 1;
      raf = idle < 40 ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => { idle = 0; if (!raf) raf = requestAnimationFrame(tick); };

    const onMove = (e) => {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      const nx = (e.clientX - cx) / cx, ny = (e.clientY - cy) / cy;
      birds.forEach((b, i) => {
        const d = parseFloat(b.getAttribute('data-bird')) || 1;
        st[i].tx = nx * 18 * d;
        st[i].ty = ny * 12 * d;
      });
      heat.forEach((h) => {
        const r = h.sec.getBoundingClientRect();
        const inside = e.clientY > r.top - 120 && e.clientY < r.bottom + 120;
        if (inside) {
          h.tx = e.clientX - r.left;
          h.ty = e.clientY - r.top;
          if (!h.on) { h.on = true; h.glow.style.opacity = '1'; h.x = h.tx; h.y = h.ty; }
        } else if (h.on) { h.on = false; h.glow.style.opacity = '0'; }
      });
      wake();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    this.onMove = onMove;
    this.stopRaf = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
  }

  scan() {
    const el = this.root.current;
    if (!el || !this.io) return;
    el.querySelectorAll('[data-reveal]:not([data-on])').forEach((n) => {
      if (n.getBoundingClientRect().top < window.innerHeight * 0.94) { n.setAttribute('data-on', ''); return; }
      this.io.observe(n);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    this.scan();
    if (prevState && prevState.stage !== this.state.stage) {
      const rail = this.root.current && this.root.current.querySelector('[data-rail]');
      const btn = rail && rail.children[this.state.stage];
      if (rail && btn) {
        const target = btn.offsetLeft - (rail.clientWidth - btn.offsetWidth) / 2;
        rail.scrollTo({ left: target, behavior: 'smooth' });
      }
    }
  }

  componentWillUnmount() {
    if (this.io) this.io.disconnect();
    if (this.idxIo) this.idxIo.disconnect();
    if (this.cntIo) this.cntIo.disconnect();
    if (this.emberIo) this.emberIo.disconnect();
    if (this.stopEmbers) this.stopEmbers();
    if (this.onFit) window.removeEventListener('resize', this.onFit);
    if (this.railKey) this.railKey.rail.removeEventListener('keydown', this.railKey.fn);
    if (this.hdrIo) this.hdrIo.disconnect();
    if (this.onScroll) window.removeEventListener('scroll', this.onScroll);
    if (this.onMove) window.removeEventListener('pointermove', this.onMove);
    if (this.stopRaf) this.stopRaf();
    if (this.magnets) { window.removeEventListener('pointermove', this.magnets.onMove); this.magnets.stop(); }
    if (this.cursor) {
      window.removeEventListener('pointermove', this.cursor.onMove);
      window.removeEventListener('pointerout', this.cursor.onOut);
      this.cursor.stop(); this.cursor.ring.remove();
    }
    if (this.burst) {
      window.removeEventListener('pointerdown', this.burst.onDown);
      window.removeEventListener('resize', this.burst.size);
      this.burst.stop(); this.burst.cv.remove();
    }
    if (this.smooth) this.smooth.el.removeEventListener('click', this.smooth.onClick);
    if (this.scrollRaf) cancelAnimationFrame(this.scrollRaf);
    clearTimeout(this.stopT);
    if (this.ctx && this.ctx.close) this.ctx.close();
  }

  playStrike() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return 0;
    if (!this.ctx) this.ctx = new AC();
    const ctx = this.ctx;
    if (ctx.state === 'suspended') ctx.resume();
    const t0 = ctx.currentTime + 0.04;
    const gap = 0.33;
    const hit = (t, gainPeak) => {
      const noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.18), ctx.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
      const src = ctx.createBufferSource();
      src.buffer = noise;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = 2400; bp.Q.value = 1.4;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(gainPeak * 0.5, t);
      ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      src.connect(bp).connect(ng).connect(ctx.destination);
      src.start(t);
      [1840, 2760, 4130].forEach((f, k) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(gainPeak / (k + 1.6), t + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42 - k * 0.08);
        osc.connect(g).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.5);
      });
    };
    hit(t0, 0.11);
    hit(t0 + gap, 0.07);
    return gap + 0.5;
  }

  renderVals() {
    const si = this.state.stage;
    const ti = this.state.tier;
    const s = STAGES[si];
    const intake = INTAKE[this.props.intake] || INTAKE['Open'];
    return {
      rootRef: this.root, hdrRef: this.hdr, brandRef: this.brand, progRef: this.prog,
      idxRef: this.idx, emberRef: this.ember,
      stageProgress: Math.round(((si + 1) / STAGES.length) * 100) + '%',
      prevStage: () => this.setState((st) => ({ stage: (st.stage + STAGES.length - 1) % STAGES.length })),
      nextStage: () => this.setState((st) => ({ stage: (st.stage + 1) % STAGES.length })),
      flipT: this.state.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      flipLabel: this.state.flipped ? 'أعد الوجه' : 'اقلب البطاقة',
      toggleFlip: () => this.setState((st) => ({ flipped: !st.flipped })),
      showLatin: this.props.showLatin !== false,
      intakeLabel: intake.label, intakeDot: intake.dot, intakeBorder: intake.border, intakeText: intake.text,
      applyLabel: intake.cta,
      stages: STAGES.map((st, i) => ({
        code: st.code, name: st.name, sel: i === si,
        bg: i === si ? 'rgba(255,98,80,.18)' : 'rgba(250,246,236,.05)',
        bd: i === si ? '#FF6250' : 'rgba(250,246,236,.16)',
        fg: i === si ? '#FAF6EC' : 'rgba(250,246,236,.8)',
        num: i === si ? '#FF6250' : 'rgba(250,246,236,.45)',
        pick: () => this.setState({ stage: i })
      })),
      stageKey: 'st' + si,
      stageNum: s.code, stageName: s.name, stagePhase: s.phase, stageWhat: s.what,
      stageOwner: s.owner, stageOwnerCode: s.ownerCode, stageItems: s.items, stageAuto: s.auto,
      tiers: TIERS.map((t, i) => ({
        tier: t.tier, name: t.name, asserts: t.asserts, evidence: t.evidence, decision: t.decision,
        validity: t.validity, unlocks: t.unlocks, not: t.not,
        sel: i === ti,
        glyph: i === ti ? '–' : '+',
        bg: i === ti ? '#FFFFFF' : '#FBF8F0',
        bar: i <= ti ? '#FF6250' : '#DCCFB4',
        code: i === ti ? '#D0402F' : '#8A8272',
        pick: () => this.setState({ tier: i === ti ? -1 : i })
      })),
      strikeState: this.state.playing ? 'on' : 'off',
      strikeLabel: this.state.playing ? 'تطرق الآن' : 'اسمع الطرقة',
      toggleStrike: (e) => {
        if (this.state.playing) return;
        const dur = this.playStrike();
        if (!dur) return;
        if (this.spawnBurst && e && e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          this.spawnBurst(cx, cy, 20);
          setTimeout(() => this.spawnBurst && this.spawnBurst(cx, cy, 14), 330);
        }
        this.setState({ playing: true });
        clearTimeout(this.stopT);
        this.stopT = setTimeout(() => this.setState({ playing: false }), dur * 1000);
      }
    };
  }
}