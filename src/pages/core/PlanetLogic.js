import React from 'react';
import DCLogic from '../../home/DCLogic.js';

export default class PlanetLogic extends DCLogic {
  constructor(props){ super(props); this.state={bytes:0,lang:this.readLang()}; }
  // English leads on first visit; the site-wide key wins once a choice is made.
  readLang(){
    try{ const v=localStorage.getItem('kyn-lang'); if(v==='ar'||v==='en') return v; }catch(e){}
    return 'en';
  }
  setLang(v){ try{ localStorage.setItem('kyn-lang', v); }catch(e){} this.setState({lang:v}); }
  isAr(){ return this.state.lang!=='en'; }
  L(ar,en){ return this.isAr()?ar:en; }
  renderVals(){
    const ar=this.isAr();
    const mb=this.state.bytes/1e6;                      /* decimal MB, matches transfer sizes */
    const grams=this.state.bytes/1e9*0.81*494;          /* SWDM v4: GB × 0.81 kWh/GB × 494 gCO₂e/kWh — same formula as the site-wide compass chip */
    const shown=this.state.bytes?Math.max(grams,0.01):0;
    const grade=!this.state.bytes?'…':grams<=0.095?'A+':grams<=0.186?'A':grams<=0.341?'B':grams<=0.493?'C':grams<=0.656?'D':'F';
    const good=grams<=0.341;
    const deg=Math.min(280,Math.round(grams/1*280));
    return {
      langCode: ar?'ar':'en',
      setLangAr:()=>this.setLang('ar'), setLangEn:()=>this.setLang('en'),
      tMarkAlt: this.L('كيان','Kayan'),
      mb:this.state.bytes?mb.toFixed(2):'…',
      grams:this.state.bytes?shown.toFixed(2):'…',
      grade,gradeColor:good?'#8FD0A0':'#E9C96B',
      gaugeColor:good?'#8FD0A0':'#E9C96B',
      gaugeDeg:(this.state.bytes?Math.max(deg,8):8)+'deg',
      ourBar:this.state.bytes?Math.min(100,Math.round(grams/0.98*100))+'%':'4%',
      commits: ar?[
        {c:'ENV-01',t:'مقر يعمل بالشمس',x:'كهرباء المقر على الكورنيش شمسية بتخزين يغني عن المولدات في التشغيل اليومي؛ والديزل استثناء يدون كل تشغيل له.',proof:'الإثبات: عداد الطاقة يعرض في صالة المقر'},
        {c:'ENV-02',t:'ويب خفيف بميزانية معلنة',x:'لكل صفحة ميزانية وزن، والخطوط والصور تضغط قبل النشر، ولا تشغيل تلقائيًا لصوت أو مرئي. يقاس الأثر بالعداد أعلاه.',proof:'الإثبات: العداد الحي في هذه الصفحة'},
        {c:'ENV-03',t:'عقود بلا ورق',x:'النطاق والمحاضر والقرارات توقع رقميًا وتؤرشف ببصمة تحقق؛ ولا يطبع إلا ما ألزم به القانون.',proof:'الإثبات: سجل المحاضر الرقمية في البوابة'},
        {c:'ENV-04',t:'عتاد يعمر مرتين',x:'تجدد الأجهزة بالإصلاح قبل الشراء، وما استبدل يهيأ ويسلم عهدة لمتدربي المصهر بدل أن يرمى.',proof:'الإثبات: سجل العهد في إدارة المقر'},
        {c:'ENV-05',t:'عمل عن بعد يوفر الطريق',x:'نموذجنا يقرب العمل من أصحابه بدل نقلهم إليه؛ فينخفض التنقل وتبقى القيمة في المحافظات.',proof:'الإثبات: توزيع الكفاءات في خريطة الموهبة'},
        {c:'ENV-06',t:'ماء وبرودة بلا إسراف',x:'تكييف بضبط مركزي ومواعيد، وتبريد ماء بلا قوارير أحادية الاستخدام في صالات المقر.',proof:'الإثبات: سياسة التشغيل المنشورة داخليًا'}
      ]:[
        {c:'ENV-01',t:'A headquarters that runs on the sun',x:'Power at the Corniche headquarters is solar with storage that removes generators from daily operation; diesel is the exception, and every run of it is logged.',proof:'Proof: the energy meter on display in the headquarters hall'},
        {c:'ENV-02',t:'A light web on a published budget',x:'Every page carries a weight budget, fonts and images are compressed before publishing, and no audio or video autoplays. The footprint is measured by the meter above.',proof:'Proof: the live meter on this page'},
        {c:'ENV-03',t:'Contracts without paper',x:'Scopes, minutes, and decisions are signed digitally and archived with a verification hash; nothing is printed except what the law requires.',proof:'Proof: the digital minutes register in the portal'},
        {c:'ENV-04',t:'Hardware that serves twice',x:'Devices are renewed by repair before purchase, and whatever is replaced is refurbished and issued as custody to Forge trainees rather than discarded.',proof:'Proof: the custody register held by headquarters administration'},
        {c:'ENV-05',t:'Remote work that spares the road',x:'Our model brings the work to the people instead of moving people to it; travel falls and the value stays in the governorates.',proof:'Proof: the distribution of skills on the talent map'},
        {c:'ENV-06',t:'Water and cooling without waste',x:'Air conditioning under central control and on a schedule, and chilled water with no single-use bottles in the headquarters halls.',proof:'Proof: the operations policy published internally'}
      ],
      sdgs: ar?[
        {n:'1',bg:'#E5243B',t:'القضاء على الفقر',x:'دخل موثق يصل أصحابه عبر قنوات رسمية، من عمل لا من إعانة.'},
        {n:'5',bg:'#FF3A21',t:'المساواة بين الجنسين',x:'إدماج النساء في صلب الفرق، وطابق آمن، وحملة «هي تسلم».'},
        {n:'7',bg:'#FCC30B',t:'طاقة نظيفة بكلفة معقولة',x:'مقر يعمل بالشمس ويتيح كهرباءه ومكاتبه لمن لا كهرباء له.'},
        {n:'8',bg:'#A21942',t:'العمل اللائق ونمو الاقتصاد',x:'عقود مكتوبة وأرضية أسعار لا ينزل عنها وتوزيع معلن قبل العمل.'},
        {n:'13',bg:'#3F7E44',t:'العمل المناخي',x:'ميزانية انبعاث معلنة للويب وتشغيل شمسي وعتاد يعمر.'},
        {n:'16',bg:'#00689D',t:'مؤسسات قوية وعدالة',x:'تحقق منضبط، قرارات مسببة باسم أصحابها، وحق تظلم مكتوب.'},
        {n:'17',bg:'#19486A',t:'الشراكات لتحقيق الأهداف',x:'رعاة يمولون الدفعات وشركاء استقرار يبنى معهم على اتفاق موقع.'}
      ]:[
        {n:'1',bg:'#E5243B',t:'No poverty',x:'Documented income that reaches the people who earned it through formal channels, from work and not from aid.'},
        {n:'5',bg:'#FF3A21',t:'Gender equality',x:'Women in the core of the teams, a secure floor, and the “She Delivers” campaign.'},
        {n:'7',bg:'#FCC30B',t:'Affordable and clean energy',x:'A headquarters that runs on solar and opens its power and its desks to those with no electricity.'},
        {n:'8',bg:'#A21942',t:'Decent work and economic growth',x:'Written contracts, a price floor nothing goes below, and a split declared before the work begins.'},
        {n:'13',bg:'#3F7E44',t:'Climate action',x:'A published emissions budget for the web, solar operation, and hardware built to last.'},
        {n:'16',bg:'#00689D',t:'Peace, justice and strong institutions',x:'Disciplined verification, reasoned decisions signed by name, and a written right of appeal.'},
        {n:'17',bg:'#19486A',t:'Partnerships for the goals',x:'Sponsors funding the tranches and stability partners built with on a signed agreement.'}
      ]
    };
  }
  componentDidMount(){
    const io='IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target);}}),{threshold:.1}):null;
    document.querySelectorAll('[data-reveal]').forEach(el=>io?io.observe(el):el.classList.add('on'));
    setTimeout(()=>document.querySelectorAll('[data-reveal]').forEach(el=>el.classList.add('on')),2600);
    /* Live meter: count what the browser actually transferred (cache hits = 0, correctly),
       then KEEP counting as lazy images/fonts arrive, so the number converges on the truth. */
    const calc=()=>{let t=0;
      const nav=performance.getEntriesByType('navigation');if(nav&&nav[0])t+=nav[0].transferSize||nav[0].encodedBodySize||0;
      performance.getEntriesByType('resource').forEach(r=>{t+=r.transferSize||r.encodedBodySize||r.decodedBodySize||0;});
      return t;};
    this._settled=false;
    const settle=()=>{try{
      const target=calc()||1;
      if(this._settled||(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)){this._settled=true;this.setState({bytes:target});return;}
      this._settled=true;
      const t0=performance.now(),D=1100,ease=t=>1-Math.pow(1-t,3);
      const step=now=>{const p=Math.min(1,(now-t0)/D);this.setState({bytes:Math.max(1,target*ease(p))});if(p<1)requestAnimationFrame(step);else this.setState({bytes:target});};
      requestAnimationFrame(step);
    }catch(e){this.setState({bytes:1});}};
    setTimeout(settle,1400);
    if('PerformanceObserver'in window){try{
      this._po=new PerformanceObserver(()=>{if(this._settled)this.setState({bytes:calc()||1});});
      this._po.observe({type:'resource'});
    }catch(e){}}
    setTimeout(()=>{if(this._settled)this.setState({bytes:calc()||1});},8000);
  }
  componentWillUnmount(){if(this._po){try{this._po.disconnect();}catch(e){}}}
}