import React from 'react';
import DCLogic from '../../home/DCLogic.js';

export default class PeopleLogic extends DCLogic {
  constructor(props){
    super(props);
    let apps=null;try{apps=JSON.parse(localStorage.getItem('kyn-people-apps-v1')||'null');}catch(e){}
    let cbox=null;try{cbox=JSON.parse(localStorage.getItem('kyn-contact-v1')||'null');}catch(e){}
    this.state={lang:this.readLang(),applyFor:null,fName:'',fContact:'',fNote:'',fErr:'',sent:(apps&&apps.v===1)?apps.sent:{},
      cDoor:'people',cName:'',cChan:'',cMsg:'',cErr:'',cRcpt:(cbox&&cbox.v===1)?cbox.last:null};
  }
  // English leads on first visit; the site-wide key wins once a choice is made.
  readLang(){
    try{ const v=localStorage.getItem('kyn-lang'); if(v==='ar'||v==='en') return v; }catch(e){}
    return 'en';
  }
  setLang(v){
    try{ localStorage.setItem('kyn-lang', v); }catch(e){}
    this.setState({lang:v});
  }
  isAr(){ return this.state.lang!=='en'; }
  L(ar,en){ return this.isAr()?ar:en; }
  cSend(){const {cDoor,cName,cChan,cMsg}=this.state;const ar=this.isAr();
    if(cName.trim().length<3||cChan.trim().length<6||cMsg.trim().length<10){this.setState({cErr:this.L('تستكمل الحقول الثلاثة قبل القيد: الاسم، وقناة الرد، ورسالة من سطر فأكثر.','Complete all three fields before logging: name, reply channel, and a message of at least one line.')});return;}
    const doors={people:{t:ar?'شؤون الفريق':'People affairs',days:3},intern:{t:ar?'التدريب الداخلي':'Internship',days:5},media:{t:ar?'الإعلام والشراكات':'Media & partnerships',days:5},other:{t:ar?'أمر آخر':'Something else',days:5}};
    const d=doors[cDoor],due=new Date(Date.now()+d.days*864e5);
    const rcpt={id:'REG-26-'+String(Date.now()).slice(-6),door:d.t,due:due.toLocaleDateString(ar?'ar-YE':'en-GB',{weekday:'long',month:'long',day:'numeric'}),at:new Date().toISOString()};
    try{const prev=JSON.parse(localStorage.getItem('kyn-contact-v1')||'null');const list=(prev&&prev.v===1&&prev.list)||[];
      list.unshift({...rcpt,name:cName.trim(),chan:cChan.trim(),msg:cMsg.trim(),doorKey:cDoor});
      localStorage.setItem('kyn-contact-v1',JSON.stringify({v:1,last:rcpt,list}));}catch(e){}
    this.setState({cRcpt:rcpt,cErr:''});}
  persistSent(sent){try{localStorage.setItem('kyn-people-apps-v1',JSON.stringify({v:1,sent}));}catch(e){}}
  openForm(code){this.setState({applyFor:code,fErr:''});
    setTimeout(()=>{const el=document.getElementById('apply-form');if(el){const y=el.getBoundingClientRect().top+window.pageYOffset-80;window.scrollTo({top:y,behavior:'smooth'});}},80);}
  submitApp(){const {applyFor,fName,fContact,fNote,sent}=this.state;
    if(fName.trim().length<5||fContact.trim().length<6||fNote.trim().length<10){this.setState({fErr:this.L('تستكمل الحقول الثلاثة: الاسم الكامل، وقناة تواصل صحيحة، وخلاصة لا تقل عن سطر.','Complete all three fields: full name, a valid contact channel, and a summary of at least one line.')});return;}
    const id='APP-'+applyFor+'-'+String(Date.now()).slice(-5);
    const ns={...sent,[applyFor]:{id,name:fName.trim(),contact:fContact.trim(),note:fNote.trim(),at:new Date().toISOString().slice(0,10)}};
    this.persistSent(ns);this.setState({sent:ns,fErr:''});}
  renderVals(){
    const st=this.state;
    const ar=this.isAr();
    const jobMeta={'POS-DEL-COOR':this.L('منسق تسليم','Delivery Coordinator'),'POS-FRG-OPS':this.L('مشرف تشغيل المصهر','Forge Operations Supervisor'),'POS-FIN-ESC':this.L('محاسب حساب الضمان','Escrow Accountant'),'GEN-POOL':this.L('قائمة الجاهزية','Readiness list')};
    const cur=st.applyFor,curSent=cur?st.sent[cur]:null;
    const filed=Object.keys(st.sent||{}).map(k=>({t:jobMeta[k]||k,id:st.sent[k].id,at:st.sent[k].at}));
    return {
      langCode: ar?'ar':'en',
      setLangAr:()=>this.setLang('ar'), setLangEn:()=>this.setLang('en'),
      tMarkAlt: this.L('كيان','Kayan'),
      filed,hasFiled:filed.length>0,filedCount:String(filed.length).padStart(2,'0'),
      openPool:()=>this.openForm('GEN-POOL'),
      poolBtn:st.sent['GEN-POOL']?this.L('ملفك محفوظ ✓','Your file is on record ✓'):this.L('إيداع الملف','Submit your file'),
      formOn:!!cur,formTitle:cur?jobMeta[cur]:'',formCode:cur||'',
      formMail:'mailto:people@kayanwork.com?subject='+encodeURIComponent((cur?jobMeta[cur]:'')+' — '+(cur||'')),
      notSent:!curSent,sentOk:!!curSent,sentId:curSent?curSent.id:'',
      fNamePh:this.L('الاسم الرباعي','Your full name'),
      fNotePh:this.L('سطران يكفيان: أين عملت، وما الذي تحسنه — أو رابط ملفك.','Two lines are enough: where you\'ve worked, what you\'re good at — or a link to your portfolio.'),
      fName:st.fName,setFName:e=>this.setState({fName:e.target.value,fErr:''}),
      fContact:st.fContact,setFContact:e=>this.setState({fContact:e.target.value,fErr:''}),
      fNote:st.fNote,setFNote:e=>this.setState({fNote:e.target.value,fErr:''}),
      fErr:st.fErr,submitApp:()=>this.submitApp(),
      cDoors:(ar?[['people','شؤون الفريق','يجيب مسؤول شؤون الفريق خلال ثلاثة أيام عمل.'],['intern','التدريب الداخلي','يجيب مشرف المصهر والتدريب خلال خمسة أيام عمل.'],['media','الإعلام والشراكات','تجيب إدارة الاتصال خلال خمسة أيام عمل.'],['other','أمر آخر','يوجه إلى صاحب الشأن ويرد خلال خمسة أيام عمل.']]:[['people','People affairs','The people affairs officer replies within three business days.'],['intern','Internship','The Forge and training supervisor replies within five business days.'],['media','Media & partnerships','Communications management replies within five business days.'],['other','Something else','Routed to the right person, who replies within five business days.']]).map(([k,t,note])=>({t,note,tap:()=>this.setState({cDoor:k,cErr:''}),bd:st.cDoor===k?'#E9C96B':'rgba(233,201,107,.22)',bg:st.cDoor===k?'rgba(233,201,107,.14)':'rgba(250,246,236,.03)',fg:st.cDoor===k?'#FAF6EC':'rgba(250,246,236,.68)',dot:st.cDoor===k?'#E9C96B':'rgba(250,246,236,.25)'})),
      cSla:(ar?{people:'الرد كتابة خلال ٣ أيام عمل',intern:'الرد كتابة خلال ٥ أيام عمل',media:'الرد كتابة خلال ٥ أيام عمل',other:'الرد كتابة خلال ٥ أيام عمل'}:{people:'Written reply within 3 business days',intern:'Written reply within 5 business days',media:'Written reply within 5 business days',other:'Written reply within 5 business days'})[st.cDoor],
      cNamePh:this.L('اسمك الكامل','Your full name'),
      cMsgPh:this.L('قل حاجتك بلا مقدمات — تصل إلى صاحب الشأن لا إلى صندوق عام.','Say what you need, no preamble — it reaches the right person, not a general inbox.'),
      cName:st.cName,setCName:e=>this.setState({cName:e.target.value,cErr:''}),
      cChan:st.cChan,setCChan:e=>this.setState({cChan:e.target.value,cErr:''}),
      cMsg:st.cMsg,setCMsg:e=>this.setState({cMsg:e.target.value,cErr:''}),
      cErr:st.cErr,cSend:()=>this.cSend(),
      cNotSent:!st.cRcpt,cSentOk:!!st.cRcpt,
      cRcptId:st.cRcpt?st.cRcpt.id:'',cRcptDoor:st.cRcpt?st.cRcpt.door:'',cRcptDue:st.cRcpt?st.cRcpt.due:'',
      cAgain:()=>this.setState({cRcpt:null,cMsg:'',cErr:''}),
      ledger: ar?[
        {v:'100%',u:'من العقود',k:'عقود مكتوبة',src:'دفتر العقود',q:'Q2 2026',x:'لا يعمل أحد بتكليف شفهي؛ العقد قبل اليوم الأول.'},
        {v:'4',u:'ساعات أسبوعيًا',k:'تعلم محمي داخل الدوام',src:'جدول الدوام',q:'Q2 2026',x:'محجوزة لكل فرد ولا تصادرها المواعيد.'},
        {v:'14',u:'يومًا حدًا أقصى',k:'قرارات التعيين مسببة',src:'سجل التعيين',q:'Q2 2026',x:'من المقابلة إلى القرار المكتوب؛ والصمت ليس قرارًا.'},
        {v:'4',u:'ساعات شهريًا',k:'ساعات مدنية مدفوعة',src:'بطاقة الموظف',q:'Q2 2026',x:'يؤديها كل موظف عبر كيان لليمن وتحسب في بطاقته.'}
      ]:[
        {v:'100%',u:'of contracts',k:'Written contracts',src:'Contracts ledger',q:'Q2 2026',x:'No one works on a verbal assignment; the contract comes before day one.'},
        {v:'4',u:'hours a week',k:'Protected learning time',src:'Duty roster',q:'Q2 2026',x:'Reserved for every person; no deadline can claim it.'},
        {v:'14',u:'days, maximum',k:'Reasoned hiring decisions',src:'Hiring record',q:'Q2 2026',x:'From interview to written decision; silence is not a decision.'},
        {v:'4',u:'hours a month',k:'Paid civic hours',src:'Employee record',q:'Q2 2026',x:'Served by every employee through Kayan for Yemen and logged on their record.'}
      ],
      arc: ar?[
        {w:'W01 – W02',t:'الالتحاق والقراءة',x:'يقرأ المتدرب معايير التسليم وبوابات الجودة، ويسلم ملخصًا مكتوبًا يوقعه مشرفه.'},
        {w:'W03 – W06',t:'اليد الثانية',x:'يلحق بتكليف قائم مساعدًا: يحضر المحاضر، ويحرر الملاحظات، ويتابع البنود المفتوحة.'},
        {w:'W07 – W10',t:'بند باسمه',x:'يسند إليه بند من نطاق العمل يمر ببوابة جودة باسمه، لا باسم مشرفه.'},
        {w:'W11 – W12',t:'المحضر والقرار',x:'يرفع المشرف تقييمًا مسببًا موقعًا، ويعرض مقعد ثابت أو تزكية مكتوبة.'}
      ]:[
        {w:'W01 – W02',t:'Onboarding and reading',x:'The intern reads the delivery standards and quality gates, and submits a written summary signed by their supervisor.'},
        {w:'W03 – W06',t:'Second hand',x:'Joins a live assignment as an assistant: attending minutes, drafting notes, and tracking open items.'},
        {w:'W07 – W10',t:'A line item of their own',x:'Assigned a line item from the scope of work that passes a quality gate under their own name, not their supervisor\'s.'},
        {w:'W11 – W12',t:'Record and decision',x:'The supervisor files a signed, reasoned evaluation, and either a permanent seat or a written reference is offered.'}
      ],
      charter: ar?[
        {n:'01',t:'عقد مكتوب لكل يد',x:'لا يبدأ عمل إلا بعقد مكتوب يبين الأجر والمهام والإجازة؛ والتكليف الشفهي لا ينشئ حقًا ولا يسقطه.'},
        {n:'02',t:'نطاق أجر معلن',x:'تنشر نطاقات الأجور داخليًا لكل موقع؛ ويعلل كل موضع داخل النطاق كتابة عند التعيين والترقية.'},
        {n:'03',t:'قرارات مسببة',x:'كل قرار يمس شخصًا — تعيينًا أو تقييمًا أو إنهاء — يصدر مكتوبًا مسببًا باسم صاحبه، ولصاحب الشأن تظلم واحد.'},
        {n:'04',t:'طاقة الشمس وراحة العقل',x:'يعمل المقر بكهرباء شمسية لا تنقطع؛ وساعات العمل تحترم الصلاة والراحة، والسهر المزمن عيب تشغيل لا بطولة.'},
        {n:'05',t:'تعلم له وقت محجوز',x:'لكل فرد أربع ساعات تعلم أسبوعية محمية داخل الدوام، ومقعد في دورات المصهر بلا رسوم.'}
      ]:[
        {n:'01',t:'A written contract for every hire',x:'No one starts work without a written contract stating pay, duties, and leave; a verbal assignment creates no right and voids none.'},
        {n:'02',t:'A published pay range',x:'Pay ranges are published internally for every role; where an offer lands within the range is justified in writing at hire and at promotion.'},
        {n:'03',t:'Reasoned decisions',x:'Every decision that affects a person — hiring, evaluation, or termination — is issued in writing, reasoned, and signed by name; the person concerned has one right of appeal.'},
        {n:'04',t:'Solar power and a rested mind',x:'The office runs on uninterrupted solar power; working hours respect prayer and rest, and chronic overwork is treated as an operating fault, not a badge of honour.'},
        {n:'05',t:'Learning with protected time',x:'Every person gets four protected learning hours a week within working hours, plus a free seat in Forge courses.'}
      ],
      internFacts: ar?[
        {v:'١٢',k:'أسبوعًا',x:'ثلاثة أشهر كاملة داخل فرق قائمة، لا في قاعة منفصلة.'},
        {v:'١ : ١',k:'مشرف لكل متدرب',x:'مثبت من درجة T3 فأعلى يرافق المتدرب ويوقع تقييمه.'},
        {v:'بند',k:'يسلم باسمه',x:'يخرج المتدرب وفي سجله بند حقيقي مر ببوابة جودة.'},
        {v:'٤',k:'مسارات',x:'إدارة التسليم، التصميم، الهندسة، والمجتمع والمصهر.'}
      ]:[
        {v:'12',k:'weeks',x:'Three full months inside live teams, not a separate classroom.'},
        {v:'1 : 1',k:'supervisor per intern',x:'A permanent staff member at grade T3 or above accompanies the intern and signs their evaluation.'},
        {v:'Line item',k:'delivered under their name',x:'The intern leaves with a real line item on their record that passed a quality gate.'},
        {v:'4',k:'tracks',x:'Delivery management, design, engineering, and community & Forge.'}
      ],
      tracks: ar?[
        {c:'TR-DEL',n:'إدارة التسليم — تنسيق الفرق والبوابات والمحاضر'},
        {c:'TR-DSG',n:'التصميم — هوية وواجهات ومطبوعات تحت مراجعة مثبت'},
        {c:'TR-ENG',n:'الهندسة — مواقع ومتاجر وأنظمة صغيرة بمعايير التسليم'},
        {c:'TR-COM',n:'المجتمع والمصهر — تشغيل الدفعات والفعاليات والرعاة'}
      ]:[
        {c:'TR-DEL',n:'Delivery management — coordinating teams, gates, and minutes'},
        {c:'TR-DSG',n:'Design — identity, interfaces, and print, reviewed by a permanent staff member'},
        {c:'TR-ENG',n:'Engineering — sites, stores, and small systems, built to delivery standard'},
        {c:'TR-COM',n:'Community & Forge — running cohorts, events, and sponsors'}
      ],
      jobs:(ar?[
        {c:'POS-DEL-COOR',t:'منسق تسليم',x:'يدير يوميات ثلاثة تكليفات متوازية: البوابات والمحاضر وقنوات العملاء؛ عين اللوحة وأذن الفريق.',loc:'عدن — المقر',type:'دوام كامل',band:'BAND-B2'},
        {c:'POS-FRG-OPS',t:'مشرف تشغيل المصهر',x:'يشغل دفعات التدريب: الجداول والقاعات والعتاد وتقارير الرعاة؛ ويحرس معيار «لا شهادة بلا بند مسلم».',loc:'عدن — المقر',type:'دوام كامل',band:'BAND-B1'},
        {c:'POS-FIN-ESC',t:'محاسب حساب الضمان',x:'يمسك دفاتر الضمان: الإيداع والصرف بمحاضر الاستلام والمطابقة الشهرية؛ دقة لا تقبل التقريب.',loc:'عدن — هجين',type:'دوام كامل',band:'BAND-B2'}
      ]:[
        {c:'POS-DEL-COOR',t:'Delivery Coordinator',x:'Runs the daily rhythm of three parallel assignments — gates, minutes, and client channels: the eyes on the board and the ears of the team.',loc:'Aden — HQ',type:'Full-time',band:'BAND-B2'},
        {c:'POS-FRG-OPS',t:'Forge Operations Supervisor',x:'Runs training cohorts: schedules, rooms, equipment, and sponsor reports — guarding the standard of “no certificate without a delivered line item.”',loc:'Aden — HQ',type:'Full-time',band:'BAND-B1'},
        {c:'POS-FIN-ESC',t:'Escrow Accountant',x:'Keeps the escrow books: deposits and releases against acceptance certificates, with monthly reconciliation — precision with no rounding.',loc:'Aden — Hybrid',type:'Full-time',band:'BAND-B2'}
      ]).map(j=>({...j,open:()=>this.openForm(j.c),btn:st.sent[j.c]?this.L('رشحت ✓','Applied ✓'):this.L('تقدم للشاغر','Apply for role')})),
      hiring: ar?[
        {n:'01',t:'ملف يقرأ كاملًا',x:'يقرأ إنسان كل ملف؛ لا فرز آليًا يسقط أحدًا.'},
        {n:'02',t:'تمرين من صميم العمل',x:'ساعتان على مهمة حقيقية مأجورة الأثر إن استخدمت.'},
        {n:'03',t:'مقابلة واحدة عميقة',x:'مع المدير المباشر وزميل مستقبلي؛ بلا جولات استنزاف.'},
        {n:'04',t:'قرار خلال أسبوعين',x:'يبلغ كتابة مسببًا؛ والصمت ليس قرارًا عندنا.'}
      ]:[
        {n:'01',t:'A file read in full',x:'A person reads every file; no automated filter screens anyone out.'},
        {n:'02',t:'A real-work exercise',x:'Two hours on a genuine task, paid if its output is used.'},
        {n:'03',t:'One in-depth interview',x:'With the direct manager and a future colleague — no attrition rounds.'},
        {n:'04',t:'A decision within two weeks',x:'Communicated in writing, with reasons — silence is not a decision here.'}
      ]
    };
  }
  componentDidMount(){
    const io='IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target);}}),{threshold:.1}):null;
    document.querySelectorAll('[data-reveal]').forEach(el=>io?io.observe(el):el.classList.add('on'));
    setTimeout(()=>document.querySelectorAll('[data-reveal]').forEach(el=>el.classList.add('on')),2600);
    this._sheen=e=>{const t=e.target.closest&&e.target.closest('[data-sheen]');if(!t)return;
      const r=t.getBoundingClientRect();t.style.setProperty('--mx',(e.clientX-r.left)+'px');t.style.setProperty('--my',(e.clientY-r.top)+'px');};
    document.addEventListener('pointermove',this._sheen,{passive:true});
  }
  componentWillUnmount(){document.removeEventListener('pointermove',this._sheen);}
}