import React from 'react';
import DCLogic from '../../home/DCLogic.js';

const DEMO = {
  name: 'سارة عبدالله الحكيمي', spec: 'مصممة هوية بصرية · تصميم مطبوعات', where: 'عدن · تعمل عن بعد',
  tier: 'T2', ref: 'TAL-2417', status: 'موثقة · تسند إليها أعمال', since: 'منذ ٠٣ / ٢٠٢٦'
};

const LEDGER = [
  { code:'RP-001', name:'حزمة الهوية البصرية الكاملة', role:'منفذة', state:'مقبول', date:'2026-07-28' },
  { code:'RP-007', name:'حزمة وثائق الشركة', role:'منفذة', state:'مقبول', date:'2026-07-09' },
  { code:'RP-010', name:'حزمة افتتاح مطعم', role:'منفذة', state:'مقبول', date:'2026-06-21' },
  { code:'RP-034', name:'حزمة إيرادات الفنادق', role:'مراجعة', state:'مقبول', date:'2026-06-02' },
  { code:'RP-016', name:'تحديث الهوية وإعادة بنائها', role:'منفذة', state:'جار', date:'2026-08-05' },
  { code:'RP-003', name:'حزمة تسويق الإطلاق', role:'منفذة', state:'رد', date:'2026-05-14' }
];

const GATES = [
  { tag:'GATE 01', title:'الهوية', body:'مستند رسمي سار، مطابق للاسم المقيد في الملف.', state:'مكتمل', meta:'وثق في ٠٤ / ٠٣ / ٢٠٢٦', ok:true },
  { tag:'GATE 02', title:'القدرة', body:'قياس في التخصص الدقيق، لا في المهنة العامة.', state:'مكتمل', meta:'قيست الطبقة T2 في ١٨ / ٠٣ / ٢٠٢٦', ok:true },
  { tag:'GATE 03', title:'التزكية', body:'جهة تزكية رجع إليها وأجابت كتابة.', state:'مكتمل', meta:'رجع إليها في ٢١ / ٠٣ / ٢٠٢٦', ok:true },
  { tag:'GATE 04', title:'التعهد', body:'أربعة تعهدات موقعة: البيانات، والنطاق، والسرية، والمراجعة.', state:'مكتمل', meta:'وقع في ٢٢ / ٠٣ / ٢٠٢٦', ok:true }
];

const CIVIC = { hours: '٤٦', items: [ { t:'ورشة مهارات رقمية · خورمكسر', h:'28h' }, { t:'تصميم مواد حملة توعية', h:'18h' } ] };

const PAY = {
  paid: '$1,240', held: '$285',
  rows: [
    { t:'حزمة الهوية البصرية الكاملة', basis:'محضر قبول موقع', amt:'$310', date:'2026-07-31' },
    { t:'حزمة وثائق الشركة', basis:'محضر قبول موقع', amt:'$265', date:'2026-07-13' },
    { t:'حزمة افتتاح مطعم', basis:'انقضاء مهلة القبول', amt:'$380', date:'2026-06-29' },
    { t:'حزمة إيرادات الفنادق · مراجعة', basis:'محضر قبول موقع', amt:'$285', date:'2026-06-08' }
  ]
};

const FILTERS = [ { k:'all', label:'الكل' }, { k:'ok', label:'المقبول' }, { k:'open', label:'الجاري' } ];

export default class TalentProfileLogic extends DCLogic {
  state = { rec:null, filter:'all', shared:false };

  componentDidMount() {
    try { const raw = localStorage.getItem('kayan.talent'); if (raw) this.setState({ rec: JSON.parse(raw) }); } catch (e) {}
  }

  renderVals() {
    const r = this.state.rec;
    const isDemo = !r;
    const name = (r && r.name) || DEMO.name;
    const spec = (r && r.spec) || DEMO.spec;
    const tierRaw = (r && r.tier) || DEMO.tier;
    const tier = String(tierRaw).slice(0, 2);
    const city = (r && r.city) || '';
    const ref = (r && r.ref) || DEMO.ref;
    const status = r ? (r.status || 'قيد المراجعة') : DEMO.status;
    const verified = !r;

    const ledger = isDemo ? LEDGER : [];
    const shown = ledger.filter(e => this.state.filter === 'all' || (this.state.filter === 'ok' ? e.state === 'مقبول' : e.state === 'جار'));
    const accepted = ledger.filter(e => e.state === 'مقبول').length;
    const returned = ledger.filter(e => e.state === 'رد').length;
    const pct = ledger.length ? Math.round((accepted / (accepted + returned || 1)) * 100) + '%' : '—';

    const pill = (bg, fg, bd) => 'font-size:11px;padding:4px 10px;border-radius:99px;white-space:nowrap;background:' + bg + ';color:' + fg + ';border:1px solid ' + bd;

    return {
      isDemo, name, spec, tier, ref, status,
      where: city ? city + ' · تعمل عن بعد' : DEMO.where,
      since: verified ? DEMO.since : 'ملف جديد',
      statusPill: pill(verified ? 'rgba(18,181,164,.16)' : 'rgba(221,149,32,.18)', verified ? '#6FDCCE' : '#F2C868', verified ? 'rgba(18,181,164,.36)' : 'rgba(221,149,32,.4)'),

      cardRows: [
        { k:'الهوية', v: verified ? 'موثقة بمستند رسمي' : 'بانتظار المستند' },
        { k:'التخصص', v: spec },
        { k:'الأعمال', v: verified ? accepted + ' أعمال مقبولة' : 'لا قيد بعد' },
        { k:'المكانة', v: verified ? CIVIC.hours + ' ساعة تطوع مقيدة' : 'لا ساعات بعد' }
      ].map((x, i, a) => ({ ...x, wrap: 'display:flex;align-items:center;justify-content:space-between;gap:14px;padding:11px 0;animation:kRow .5s ' + (0.24 + i * 0.1) + 's cubic-bezier(.2,.7,.2,1) both' + (i < a.length - 1 ? ';border-bottom:1px solid rgba(7,27,26,.08)' : '') })),
      cardNote: verified ? 'لا يضاف سطر إلا بقيد، ولا يمحى قيد' : 'يفتح السجل بعد اكتمال التحقق',

      headline: [
        { n: verified ? String(accepted) : '٠', t:'عمل مقبول ومقيد', c:'#6FDCCE' },
        { n: verified ? pct : '—', t:'أجيز من أول مرة', c:'#6FDCCE' },
        { n: verified ? CIVIC.hours : '٠', t:'ساعة تطوع مقيدة', c:'#DD9520' },
        { n: tier, t:'الطبقة في التخصص', c:'#6FDCCE' }
      ],

      gates: GATES.map(g => {
        const ok = verified && g.ok;
        return {
          tag:g.tag, title:g.title, body:g.body,
          state: ok ? 'مكتمل' : 'بانتظار',
          meta: ok ? g.meta : 'يفتح بعد مراجعة الطلب',
          card: 'border-radius:18px;padding:22px 20px;min-height:186px;display:flex;flex-direction:column;transition:transform .4s cubic-bezier(.23,1,.32,1);border:1px solid ' +
            (ok ? 'rgba(7,27,26,.10);background:#FBF8F0' : 'rgba(221,149,32,.3);background:rgba(221,149,32,.07)'),
          pill: pill(ok ? 'rgba(18,181,164,.12)' : 'rgba(221,149,32,.16)', ok ? '#0A6F68' : '#9A6A0F', ok ? 'rgba(18,181,164,.3)' : 'rgba(221,149,32,.34)'),
          tagColor:'#0A6F68', bodyColor:'#3C514F', metaColor:'#8A9694', line:'rgba(7,27,26,.09)'
        };
      }),

      filters: FILTERS.map(f => ({
        k:f.k, label:f.label,
        style: 'all:unset;cursor:pointer;border-radius:99px;padding:7px 15px;font-size:12.5px;transition:background .25s ease,color .25s ease,border-color .25s ease;border:1px solid ' +
          (f.k === this.state.filter ? '#12B5A4;background:#12B5A4;color:#04302C' : 'rgba(7,27,26,.16);color:#4A5F5D')
      })),
      pickFilter: (e) => this.setState({ filter: e.currentTarget.getAttribute('data-k') }),

      ledger: shown.map(e => ({
        code:e.code, name:e.name, role:e.role, state:e.state, date:e.date,
        pill: pill(
          e.state === 'مقبول' ? 'rgba(18,181,164,.12)' : e.state === 'جار' ? 'rgba(10,111,104,.10)' : 'rgba(192,86,60,.10)',
          e.state === 'مقبول' ? '#0A6F68' : e.state === 'جار' ? '#4A5F5D' : '#B0492F',
          e.state === 'مقبول' ? 'rgba(18,181,164,.3)' : e.state === 'جار' ? 'rgba(7,27,26,.14)' : 'rgba(192,86,60,.28)'
        )
      })),
      ledgerNote: isDemo ? 'سجل نموذجي. يقيد في سجلك ما يقبل من أعمالك، بتاريخه ورمزه.' : 'لا قيد بعد. يفتح السجل بأول عمل مقبول.',

      qa: { pct: verified ? pct : '—' },
      civic: verified ? CIVIC : { hours:'٠', items: [] },
      pay: verified ? PAY : { paid:'$0', held:'$0', rows: [] },

      shareLabel: this.state.shared ? 'نسخ رابط البطاقة' : 'انسخ رابط بطاقتك',
      share: () => {
        try { navigator.clipboard.writeText(location.href); } catch (e) {}
        this.setState({ shared: true });
        clearTimeout(this._t); this._t = setTimeout(() => this.setState({ shared: false }), 2200);
      }
    };
  }
}