import React from 'react';
import DCLogic from '../../home/DCLogic.js';

const ORDERS = [
  { id:'o1', code:'RP-012', name:'حزمة مقترحات المانحين وتقاريرهم', price:'$900', state:'ينتظر قبولك', pct:'92%', due:'سلم في ٠٩ / ٠٨',
    stage:4,
    lines:[ { k:'النطاق', v:'مقترح جاهز للمانح، حتى ٤٠ صفحة، عربي وإنجليزي' }, { k:'السعر', v:'٩٠٠ دولار، ثابت على النطاق' }, { k:'الميقات', v:'١٢ يوما من اكتمال مدخلاتك' }, { k:'الفريق', v:'كاتب · مصمم · مترجم · مراجعة مستقلة' } ] },
  { id:'o2', code:'RP-002', name:'موقع إلكتروني احترافي', price:'$1,200', state:'جار', pct:'58%', due:'يستحق في ٢٤ / ٠٨',
    stage:3,
    lines:[ { k:'النطاق', v:'موقع متجاوب ٥–٧ صفحات، عربي من اليمين وإنجليزي' }, { k:'السعر', v:'١٢٠٠ دولار، ثابت على النطاق' }, { k:'الميقات', v:'٢١ يوما من اكتمال مدخلاتك' }, { k:'الفريق', v:'مطور · واجهة وتجربة · كاتب · مراجعة مستقلة' } ] },
  { id:'o3', code:'RP-005', name:'حزمة الترجمة الاحترافية', price:'$300', state:'مقفل', pct:'100%', due:'قبل في ٢٨ / ٠٧',
    stage:5,
    lines:[ { k:'النطاق', v:'حتى ١٠٠٠٠ كلمة، ومراجعة مترجم ثان' }, { k:'السعر', v:'٣٠٠ دولار، ثابت على النطاق' }, { k:'الميقات', v:'٧ أيام من اكتمال مدخلاتك' }, { k:'الفريق', v:'مترجم · مراجع ثان · مراجعة مستقلة' } ] }
];

const RAIL = ['حرر النطاق ووقع','أودعت القيمة في الضمان','نفذ الفريق','أجازت المراجعة المستقلة','قبلت وأفرج عن المستحق'];
const RAIL_DATES = ['٢٨ / ٠٧','٢٩ / ٠٧','٠١ / ٠٨','٠٨ / ٠٨','—'];

const LEDGER = [
  { date:'2026-08-09', t:'تسليم بانتظار قبولك · RP-012', basis:'محضر تسليم', amt:'—', kind:'none' },
  { date:'2026-08-01', t:'إيداع في حساب الضمان · RP-002', basis:'أمر عمل موقع', amt:'+$1,200', kind:'in' },
  { date:'2026-07-29', t:'إيداع في حساب الضمان · RP-012', basis:'أمر عمل موقع', amt:'+$900', kind:'in' },
  { date:'2026-07-28', t:'إفراج عن مستحق · RP-005', basis:'محضر استلام موقع', amt:'−$300', kind:'out' },
  { date:'2026-07-18', t:'إيداع في حساب الضمان · RP-005', basis:'أمر عمل موقع', amt:'+$300', kind:'in' }
];

const DOCS = [
  { t:'النطاق الموقع · RP-012', m:'وقع في ٢٩ / ٠٧ / ٢٠٢٦', k:'PDF' },
  { t:'أمر العمل · RP-012', m:'صدر في ٢٩ / ٠٧ / ٢٠٢٦', k:'PDF' },
  { t:'محضر استلام · RP-005', m:'وقع في ٢٨ / ٠٧ / ٢٠٢٦', k:'PDF' },
  { t:'فاتورة · RP-005', m:'صدرت في ٢٨ / ٠٧ / ٢٠٢٦', k:'PDF' },
  { t:'تقرير المراجعة المستقلة · RP-012', m:'صدر في ٠٨ / ٠٨ / ٢٠٢٦', k:'PDF' }
];

const TEAM = [
  { n:'ياسر المقطري', r:'قائد البود' },
  { n:'رنا باعباد', r:'كاتبة أولى' },
  { n:'عمر الشعيبي', r:'مصمم' },
  { n:'مراجعة مستقلة', r:'خارج البود' }
];

export default class ClientProfileLogic extends DCLogic {
  state = { rec:null, sel:'o1', objecting:false, objection:'', flash:'' };

  componentDidMount() {
    try { const raw = localStorage.getItem('kayan.client'); if (raw) this.setState({ rec: JSON.parse(raw) }); } catch (e) {}
  }

  renderVals() {
    const r = this.state.rec;
    const isDemo = !r;
    const orders = isDemo ? ORDERS : [];
    const cur = orders.find(o => o.id === this.state.sel) || orders[0] || null;
    const pill = (bg, fg, bd) => 'font-size:11px;padding:4px 10px;border-radius:99px;white-space:nowrap;background:' + bg + ';color:' + fg + ';border:1px solid ' + bd;

    const statePill = (s) => s === 'ينتظر قبولك'
      ? pill('rgba(221,149,32,.14)', '#9A6A0F', 'rgba(221,149,32,.34)')
      : s === 'جار' ? pill('rgba(10,111,104,.10)', '#0A6F68', 'rgba(7,27,26,.14)')
      : pill('rgba(18,181,164,.12)', '#0A6F68', 'rgba(18,181,164,.3)');

    return {
      isDemo,
      org: (r && r.org) || 'مؤسسة الأمل للتنمية',
      kind: (r && r.type) || 'منظمة غير حكومية · عدن',
      ref: (r && r.ref) || 'CLI-3182',
      status: r ? (r.status || 'قيد تحرير النطاق') : 'حساب نشط',
      statusPill: pill(r ? 'rgba(221,149,32,.18)' : 'rgba(18,181,164,.16)', r ? '#F2C868' : '#6FDCCE', r ? 'rgba(221,149,32,.4)' : 'rgba(18,181,164,.36)'),

      sum: isDemo
        ? { held:'$2,100', released:'$300', awaiting:'$900', orders:'٣' }
        : { held:'$0', released:'$0', awaiting:'$0', orders:'٠' },

      orders: orders.map(o => ({
        id:o.id, code:o.code, name:o.name, price:o.price, state:o.state, pct:o.pct, due:o.due,
        pill: statePill(o.state),
        card: 'all:unset;cursor:pointer;box-sizing:border-box;display:block;width:100%;padding:22px 20px;border-radius:18px;transition:transform .4s cubic-bezier(.23,1,.32,1),border-color .3s ease,box-shadow .35s ease;border:1px solid ' +
          (o.id === this.state.sel ? '#12B5A4;background:#fff;transform:translateY(-3px);box-shadow:0 18px 36px rgba(5,49,45,.10)' : 'rgba(7,27,26,.10);background:#FBF8F0')
      })),
      pickOrder: (e) => this.setState({ sel: e.currentTarget.getAttribute('data-k'), objecting:false }),

      order: cur ? {
        code: cur.code, name: cur.name, lines: cur.lines,
        canAccept: cur.state === 'ينتظر قبولك' && !this.state.flash,
        settled: cur.state === 'مقفل' || !!this.state.flash,
        settledNote: this.state.flash || 'قبل التسليم، وأفرج عن المستحق.',
        window: 'مهلة القبول تنتهي بعد ثلاثة أيام',
        rail: RAIL.map((t, i) => {
          const passed = i < cur.stage, at = i === cur.stage;
          return {
            t, d: RAIL_DATES[i],
            color: passed ? '#F4EFE2' : at ? '#F2C868' : 'rgba(244,239,226,.42)',
            dot: 'width:9px;height:9px;border-radius:99px;flex:none;background:' + (passed ? '#12B5A4' : at ? '#DD9520' : 'rgba(244,239,226,.2)')
          };
        })
      } : { code:'—', name:'لا أوامر بعد', lines:[], canAccept:false, settled:false, settledNote:'', window:'', rail:[] },

      objecting: this.state.objecting,
      objection: this.state.objection,
      objectLabel: this.state.objecting ? 'اصرف النظر' : 'أعترض اعتراضا مسببا',
      toggleObject: () => this.setState({ objecting: !this.state.objecting }),
      onObjection: (e) => this.setState({ objection: e.currentTarget.value }),
      accept: () => this.setState({ flash: 'قبلت التسليم. أفرج عن المستحق وقيد محضر الاستلام.', objecting:false }),
      submitObjection: () => this.setState({ flash: 'قيد اعتراضك. أوقف الإفراج حتى يعالج أو يفصل فيه.', objecting:false }),

      ledger: (isDemo ? LEDGER : []).map(l => ({
        ...l, color: l.kind === 'in' ? '#05312D' : l.kind === 'out' ? '#0A6F68' : '#8A9694'
      })),
      docs: isDemo ? DOCS : [],
      team: isDemo ? TEAM : []
    };
  }
}