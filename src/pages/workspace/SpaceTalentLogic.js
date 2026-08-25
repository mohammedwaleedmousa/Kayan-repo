import React from 'react';
import DCLogic from '../../home/DCLogic.js';

export default class SpaceTalentLogic extends DCLogic {
  constructor(props){
    super(props);
    let auth=null;try{auth=JSON.parse(localStorage.getItem('kyn-auth-v1')||'null');}catch(e){}
    this.auth=(auth&&auth.v===1&&auth.role==='talent')?auth:null;
    this.key=this.auth?('kyn-tws-'+this.auth.id):null;
    let ws=null;if(this.key){try{ws=JSON.parse(localStorage.getItem(this.key)||'null');}catch(e){}}
    this.state={view:'overview',ws:(ws&&ws.v===1)?ws:{v:1,avail:true,week:[1,1,1,0,1,1,0],applied:[]}};
    if(this.key&&!(ws&&ws.v===1))this.persist(this.state.ws);
  }
  persist(ws){if(this.key){try{localStorage.setItem(this.key,JSON.stringify(ws));}catch(e){}}}
  up(fn){const ws=JSON.parse(JSON.stringify(this.state.ws));fn(ws);this.persist(ws);this.setState({ws});}
  logout(){try{localStorage.removeItem('kyn-auth-v1');}catch(e){}this.props.navigate(this.props.routeForHref('Kayan Access.dc.html'));}
  renderVals(){
    if(!this.auth)return {locked:true,open:false};
    const {view,ws}=this.state,me=this.auth,tier=me.tier||2;
    const tierNames=['T0 مسجل','T1 معرف','T2 موثق','T3 مثبت','T4 مؤتمن'];
    const tierDescs=['فتح الملف وما اكتمل التحقق بعد.','صدرت بطاقتك؛ تشارك في فريق بإشراف.','مساهم رئيس بنطاق أسعار معتمد؛ اسمك يبنى بالمحاضر.','يقود فريقًا ويراجع عمل غيره ويدرّس في المصهر.','يواجه العميل دون إشراف ويؤلف الفرق.'];
    const nexts=['التالي: اكتمال التحقق تصدر به البطاقة (T1).','التالي إلى T2: اجتياز اختبار التخصص واكتمال جهتي التزكية.','التالي إلى T3: محضران موقعان بتقييم ٤٫٥ فأعلى وقيادة بند تحت إشراف — بقي محضر واحد.','التالي إلى T4: اثنا عشر شهرًا دون إخلال وتزكية من قائدين مثبتين.','بلغت أعلى السلم؛ يحفظ المقام بالانتظام، والخمول ينزل درجة قابلة للاسترداد.'];
    const navDefs=[['overview','نظرة عامة',''],['pods','تكليفاتي','1'],['calls','نداءات الفرق','3'],['earn','المستحقات',''],['record','سجل الإنجاز',''],['verify','التحقق',''],['k4y','كيان لليمن',''],['profile','الملف والجاهزية','']];
    const titles={overview:'أهلًا، '+(me.name.split(' ')[0]||''),pods:'تكليفاتي',calls:'نداءات الفرق',earn:'المستحقات',record:'سجل الإنجاز',verify:'محاور التحقق الخمسة',k4y:'كيان لليمن',profile:'الملف والجاهزية'};
    const days=['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'];
    const callDefs=[{id:'CALL-26-052',title:'موقع تعريفي لعيادة أسنان',need:'مطلوب: مطور واجهات + محرر محتوى',floor:'T2',closes:'بعد يومين'},{id:'CALL-26-054',title:'حملة إطلاق لمتجر تمور',need:'مطلوب: مصمم اجتماعي + كاتب إعلاني',floor:'T1',closes:'بعد أربعة أيام'},{id:'CALL-26-057',title:'ترجمة تقرير مانحين ٦٠ صفحة',need:'مطلوب: مترجم قانوني + مدقق',floor:'T2',closes:'غدًا'}];
    return {locked:false,open:true,
      navItems:navDefs.map(([id,label,badge])=>({label,badge,go:()=>this.setState({view:id}),bg:view===id?'rgba(233,201,107,.14)':'transparent',fg:view===id?'#E9C96B':'rgba(250,246,236,.66)'})),
      initial:(me.name||'؟').trim()[0],userName:me.name,userId:me.id,userEmail:me.email,userSpec:'تصميم الهوية البصرية',logout:()=>this.logout(),
      crumb:'TALENT SPACE · '+me.id,pageTitle:titles[view],
      toggleAvail:()=>this.up(w=>{w.avail=!w.avail;}),
      availLabel:ws.avail?'جاهز لتكليف جديد':'خارج الجاهزية',availDot:ws.avail?'#0E6E66':'#C96B4A',
      availBg:ws.avail?'rgba(14,110,102,.08)':'#EDE5D2',availBd:ws.avail?'#0E6E66':'#E0D6BD',availFg:ws.avail?'#0E6E66':'#7A8B85',
      vOverview:view==='overview',vPods:view==='pods',vCalls:view==='calls',vEarn:view==='earn',vRecord:view==='record',vVerify:view==='verify',vK4y:view==='k4y',vProfile:view==='profile',
      tierName:tierNames[tier],tierDesc:tierDescs[tier],tierNext:nexts[tier],
      tiers:tierNames.map((name,i)=>({name,bar:i<tier?'#C9A227':i===tier?'linear-gradient(90deg,#C9A227,#E9C96B)':'rgba(233,201,107,.15)',fg:i<=tier?'#E9C96B':'rgba(250,246,236,.4)'})),
      statCards:[{k:'SIGNED RECORDS',v:'7',sub:'محاضر استلام موقعة في سجلك'},{k:'QUALITY AVG',v:'4.7 / 5',sub:'متوسط تقييم بوابات الجودة'},{k:'ON-TIME',v:'100%',sub:'التزام المواعيد عبر التكليفات'}],
      podDays:'12',
      myPods:[{code:'POD-26-041',name:'فريق سنّار — هوية مصنع أغذية',meta:'دورك: قائدة الفريق · نصيبك 40% · البند الجاري: التطبيقات',active:true,closed:false,bd:'#5B4A8E',closeNote:''},{code:'POD-26-017',name:'فريق مرجان — متجر إلكتروني لحرفيات',meta:'دورك: مساهمة رئيسة · أغلق بمحضر نهائي وتقييم 4.8',active:false,closed:true,bd:'#E0D6BD',closeNote:'أغلق بقبول نهائي ✓'}],
      calls:callDefs.map(c=>{const applied=ws.applied.includes(c.id);
        return {...c,btnLabel:applied?'سجل اهتمامك ✓':'تسجيل الاهتمام',btnBg:applied?'#EDE5D2':'linear-gradient(135deg,#C9A227,#E9C96B)',btnFg:applied?'#8F7218':'#052E2B',
          apply:()=>{if(!applied)this.up(w=>{w.applied.push(c.id);});}};}),
      payouts:[{t:'26-08-02',x:'نصيبك من البند الأول — هوية مصنع أغذية (POD-26-041)',amt:'+$240'},{t:'26-07-18',x:'التصفية النهائية — متجر الحرفيات (POD-26-017)',amt:'+$520'},{t:'26-06-30',x:'الدفعة الأولى — متجر الحرفيات (POD-26-017)',amt:'+$380'}],
      record:[{title:'متجر إلكتروني لحرفيات عدن',meta:'POD-26-017 · مساهمة رئيسة · سلم في موعده',score:'4.8',quote:'«التزام كامل بالنطاق والموعد، وجودة أعلى من المتوقع.» — من محضر الاستلام الموقع'},{title:'هوية مقهى على الكورنيش',meta:'POD-25-090 · مساهمة · سلم في موعده',score:'4.6',quote:'«قراءة دقيقة للمكان وروحه.» — من محضر الاستلام الموقع'},{title:'حملة توظيف لمنظمة محلية',meta:'POD-25-063 · مساهمة صاعدة · سلم في موعده',score:'4.7',quote:'«صياغات محكمة وتجاوب سريع مع الملاحظات.» — من محضر الاستلام الموقع'}],
      axes:[{name:'الهوية',note:'وثيقة رسمية + مطابقة حية؛ حذفت الصور وحفظت البصمة الرقمية.',st:'موثقة',bg:'#0E6E66',fg:'#EAF7F0'},{name:'المهارة',note:'اختبار التخصص الرئيس مجتاز بدرجة ٨٦٪.',st:'موثقة',bg:'#0E6E66',fg:'#EAF7F0'},{name:'سجل العمل',note:'سبعة محاضر موقعة؛ يتجدد تلقائيًا مع كل قبول.',st:'موثقة',bg:'#0E6E66',fg:'#EAF7F0'},{name:'السلوك',note:'جهتا تزكية وردت إفادتهما؛ لا وقائع سلبية.',st:'موثقة',bg:'#0E6E66',fg:'#EAF7F0'},{name:'القدرة',note:'الجاهزية المعلنة ٥ أيام أسبوعيًا؛ تحدث من الملف.',st:'تحدث دوريًا',bg:'#EDE5D2',fg:'#8F7218'}],
      k4yHours:'34',
      k4yOps:[{t:'سبت رقمي لمدارس كريتر',x:'تدريب معلمين على أدوات الصف الرقمي — تحسب الساعات في بطاقتك.'},{t:'دليل أعمال لسوق الطويلة',x:'توثيق محال السوق القديمة وبناء أدلتها الرقمية.'}],
      week:days.map((name,i)=>({name,tap:()=>this.up(w=>{w.week[i]=w.week[i]?0:1;}),bg:ws.week[i]?'#052E2B':'#FAF6EC',fg:ws.week[i]?'#E9C96B':'#7A8B85',bd:ws.week[i]?'#052E2B':'#E0D6BD'})),
    };
  }
}
