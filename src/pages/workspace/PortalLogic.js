import React from 'react';
import DCLogic from '../../home/DCLogic.js';

export default class PortalLogic extends DCLogic {
  constructor(props){
    super(props);
    let saved=null; try{ saved=JSON.parse(localStorage.getItem('kyn-portal-v2')||'null'); }catch(e){}
    let apply=null; try{ apply=JSON.parse(localStorage.getItem('kayan-apply-v1')||'null'); }catch(e){}
    this.state = (saved && saved.v===2) ? saved : this.blank();
    this.state.apply = apply || null;
    this.state.lang = this.readLang();
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
  // Picks the Arabic or English member of a pair.
  L(ar,en){ return this.isAr()?ar:en; }
  groups(){
    return {
      orgType:[['priv','شركة خاصة','Private company'],['ngo','منظمة غير ربحية','Non-profit organisation'],['intl','وكالة أممية أو دولية','UN or international agency'],['gov','جهة حكومية','Government body'],['sole','فرد صاحب عمل','Sole proprietor']],
      sector:[['tech','تقنية واتصالات','Technology and telecoms'],['hum','عمل إنساني وتنموي','Humanitarian and development'],['trade','تجارة وتوزيع','Trade and distribution'],['fin','مال ومصارف','Finance and banking'],['health','صحة','Health'],['edu','تعليم','Education'],['infra','طاقة وبنية تحتية','Energy and infrastructure'],['media','إعلام وإبداع','Media and creative'],['pub','حكومي وعام','Government and public'],['other','أخرى','Other']],
      size:[['s1','1–10','1–10'],['s2','11–50','11–50'],['s3','51–200','51–200'],['s4','أكثر من 200','More than 200']],
      line:[['L1','الخط الأول — التسليم المدار','Line I — Managed Delivery'],['L3','الخط الثالث — التكوين المهني','Line III — Professional Forming'],['L5','الخط الخامس — الحلول الرقمية الجاهزة','Line V — Ready Digital Products'],['NA','لست متأكدا — توجهوني','Not sure — guide me']],
      budget:[['b1','أقل من 1,000$','Under $1,000'],['b2','1,000–5,000$','$1,000–5,000'],['b3','5,000–15,000$','$5,000–15,000'],['b4','15,000–50,000$','$15,000–50,000'],['b5','أكثر من 50,000$','Over $50,000'],['b6','يحدد بعد النطاق','Set after scoping']]
    };
  }
  opts(g){ const ar=this.isAr(); return this.groups()[g].map(r=>({k:r[0], l:ar?r[1]:r[2]})); }
  // Falls back to the stored string, so values saved before keys existed still read.
  lab(g,v){ if(!v) return ''; const ar=this.isAr(); const row=this.groups()[g].find(r=>r[0]===v||r[1]===v); return row?(ar?row[1]:row[2]):v; }
  blank(){
    return { v:2, view:'enter',
      c:{ stage:0, maxSeen:0, submitted:false, id:'', at:'',
        org:{name:'',type:'',sector:'',size:'',country:'',city:'',site:''},
        auth:{name:'',role:'',email:'',phone:'',proof:'',proofOk:false,codeSent:false,code:'',codeOk:false},
        comp:[false,false,false,false], final:false,
        scope:{outcome:'',line:'',deadline:'',budget:'',desc:'',files:[]},
        prog:0, accepted:false, acceptDate:'', log:[] },
      apply:null };
  }
  save(patch, cb){ this.setState(patch, ()=>{ const s={...this.state}; delete s.apply; try{ localStorage.setItem('kyn-portal-v2', JSON.stringify(s)); }catch(e){} if(cb)cb(); }); }
  today(){ return new Date().toLocaleDateString(this.isAr()?'ar-YE':'en-GB',{year:'numeric',month:'long',day:'numeric'}); }
  checkDigit(digits){ const w=[8,7,6,5,4,3,2]; let sum=0; for(let i=0;i<7;i++) sum+=w[i]*(+digits[i]||0); const r=(11-(sum%11))%11; return r===10?'X':String(r); }
  go(view){ this.save({view}, ()=>{ try{ (document.scrollingElement||document.documentElement).scrollTop=0; }catch(e){} }); }
  cStageOk(n){
    const c=this.state.c;
    switch(n){
      case 0: { const o=c.org; return o.name.trim().length>2 && o.type && o.sector && o.country.trim() && o.city.trim(); }
      case 1: { const a=c.auth; return a.name.trim().length>2 && a.role.trim() && /.+@.+\..+/.test(a.email) && a.phone.replace(/\D/g,'').length>=9 && a.proofOk && a.codeOk; }
      case 2: return c.comp.every(Boolean);
      case 3: { const s=c.scope; return s.outcome.trim().length>5 && s.line && s.deadline && s.budget && s.desc.trim().length>=30; }
      case 4: return c.final;
      default: return true;
    }
  }
  cHintFor(n){
    const ar=this.isAr();
    if(this.cStageOk(n)) return n===4 ? this.L('كل شيء مكتمل — التقديم يقيد الطلب في السجل.','Everything is complete. Submitting enters the request in the register.') : this.L('اكتملت المحطة — تقدم متى شئت.','This step is complete. Continue when you wish.');
    const mAr={0:'يلزم اسم المنشأة وصفتها وقطاعها وبلدها ومدينتها.',1:'يلزم اكتمال بيانات المفوض، وإثبات الصفة، وتأكيد الرمز.',2:'تؤشر الإقرارات الأربعة — كل واحد على حدة.',3:'يلزم اسم النتيجة والخط والموعد وحد الميزانية ووصف من 30 حرفا.',4:'يؤشر إقرار القاعدة قبل التقديم.'};
    const mEn={0:'The organisation name, legal form, sector, country and city are required.',1:'Complete the signatory details, the proof of authority, and the code confirmation.',2:'All four declarations are ticked, each one separately.',3:'The outcome, the line, the deadline, the budget ceiling and a description of 30 characters are required.',4:'The rule is acknowledged before submission.'};
    return (ar?mAr:mEn)[n]||'';
  }
  podReady(){
    const c=this.state.c;
    return c.submitted && c.prog>=3;
  }
  podData(){
    const ap=this.state.apply;
    if(ap && ap.pod && ap.pod.on && ap.pod.name && ap.pod.members && ap.pod.members.filter(m=>m.name).length>=2){
      const ms=ap.pod.members.filter(m=>m.name);
      const even=Math.floor(100/ms.length);
      return { name:this.L('فريق «','Pod “')+ap.pod.name+this.L('»','”'), code:'KY-P-26-00214', rows: ms.map((m,i)=>({name:m.name, role:m.role||this.L('منفذ','Executor'), share:(i===0?100-even*(ms.length-1):even)+'%'})) };
    }
    return { name:this.L('فريق التكليف — تشكيل كيان','Assignment pod — formed by Kayan'), code:'KY-P-26-00214', rows:this.isAr()?[
      {name:'قائد التسليم', role:'قائد — نافذة كيان', share:'40%'},
      {name:'منفذ رئيس', role:'منفذ', share:'35%'},
      {name:'مراجع مستقل', role:'مراجع جودة', share:'25%'}
    ]:[
      {name:'Delivery lead', role:'Lead — the Kayan window', share:'40%'},
      {name:'Principal executor', role:'Executor', share:'35%'},
      {name:'Independent reviewer', role:'Quality reviewer', share:'25%'}
    ]};
  }
  // One listbox for every choice field. `pick` holds the open field's key, so only
  // one list is ever open, and a chosen value closes it.
  picker(key, value, setValue){
    const opts=this.opts(key), open=this.state.pick===key;
    const hit=opts.find(o=>o.k===value);
    return {
      open, text: hit ? hit.l : this.L('— اختر —','— choose —'),
      fg: hit ? '#143C37' : '#9A8F73',
      toggle:()=>this.setState({pick: open ? null : key}),
      items: opts.map(o=>({ l:o.l, sel:o.k===value, pick:()=>{ setValue(o.k); this.setState({pick:null}); } }))
    };
  }
  renderVals(){
    const s=this.state, c=s.c, ap=s.apply;
    const applySubmitted = !!(ap && ap.submitted && ap.appId);
    const view=s.view;
    const stagesTxt=this.isAr()?['قيد المراجعة','عرض ثابت','ضمان ممول','تنفيذ','جاهز للقبول','مقبول ومقفل']:['Under review','Fixed quotation','Escrow funded','Execution','Ready for acceptance','Accepted and closed'];
    const podReady=this.podReady();
    const okNow=this.cStageOk(c.stage);
    const cRailLabels=this.isAr()?['المنشأة','المفوض','الالتزام','النتيجة','المراجعة']:['Organisation','Signatory','Compliance','Outcome','Review'];
    const pd=this.podData();
    const logPush=(arr,t)=>{ const a=[...arr]; a.unshift({d:new Date().toISOString().slice(0,10), t}); return a; };
    return {
      langCode: this.isAr()?'ar':'en',
      setLangAr:()=>this.setLang('ar'), setLangEn:()=>this.setLang('en'),
      optOrgType:this.opts('orgType'), optSector:this.opts('sector'), optSize:this.opts('size'), optLine:this.opts('line'), optBudget:this.opts('budget'),
      // Write through the app's real nested paths — c.org.* and c.scope.* — which are
      // what cStageOk() validates and what the submitted payload reads.
      pkOrgType:this.picker('orgType', c.org.type, v=>this.save({c:{...c,org:{...c.org,type:v}}})),
      pkSector:this.picker('sector', c.org.sector, v=>this.save({c:{...c,org:{...c.org,sector:v}}})),
      pkSize:this.picker('size', c.org.size, v=>this.save({c:{...c,org:{...c.org,size:v}}})),
      pkLine:this.picker('line', c.scope.line, v=>this.save({c:{...c,scope:{...c.scope,line:v}}})),
      pkBudget:this.picker('budget', c.scope.budget, v=>this.save({c:{...c,scope:{...c.scope,budget:v}}})),
      // The rule as three gates in order. Only the scope gate has a state the Portal
      // actually knows — escrow and work are post-signature, so they are labelled as
      // such rather than shown as a status that can never turn on.
      gates:[
        {code:'GATE 01 · SOW', title:this.L('نطاق مكتوب','A written scope'),
         body:this.L('يسمى المخرج وموعده ومعايير قبوله قبل أي عمل.','The deliverable, its date and its acceptance criteria are named before any work.'),
         on:this.cStageOk(3), state:this.cStageOk(3)?this.L('مستوف','Met'):this.L('في هذا الطلب','In this request')},
        {code:'GATE 02 · ESCROW', title:this.L('ضمان ممول','Funded escrow'),
         body:this.L('يودع المستحق كاملا، ولا يفرج عنه إلا بمحضر.','The full amount is deposited, and is released only on a record.'),
         on:false, state:this.L('بعد التوقيع','After signature')},
        {code:'GATE 03 · WORK', title:this.L('العمل يبدأ','Work begins'),
         body:this.L('لا يبدأ يوم عمل قبل إغلاق البوابتين قبله.','No working day starts before the two gates before it are closed.'),
         on:false, state:this.L('بعد الضمان','After escrow')}
      ].map(g=>({ code:g.code, title:g.title, body:g.body, state:g.state,
        onAttr: g.on?'':null,
        bd: g.on?'rgba(201,162,39,.5)':'rgba(250,246,236,.14)',
        bar: g.on?'linear-gradient(180deg,#C9A227,#E9C96B)':'rgba(250,246,236,.12)',
        dot: g.on?'#E9C96B':'rgba(250,246,236,.28)',
        halo: g.on?'rgba(201,162,39,.18)':'transparent',
        stateFg: g.on?'#E9C96B':'rgba(250,246,236,.5)',
        no: g.on?'#E9C96B':'rgba(250,246,236,.42)' })),
      tChoose:this.L('— اختر —','— choose —'),
      tPhOrgName:this.L('مثال: شركة الميناء للتقنية المحدودة','e.g. Al-Mina Technology Company Limited'),
      tPhCountry:this.L('اليمن · السعودية · ...','Yemen · Saudi Arabia · ...'),
      tPhCity:this.L('عدن','Aden'),
      tPhAuthRole:this.L('مدير عام · مدير مشاريع مخول','Managing director · authorised projects manager'),
      tPhOutcome:this.L('مثال: متجر إلكتروني عامل بثلاثين منتجا ودفع محلي','e.g. A working online store with thirty products and local payment'),
      tPhDesc:this.L('يكتب بلا تكلف: الوضع الحالي، والمستفيد النهائي، وأي قيود تقنية أو زمنية.','Write plainly: the current situation, the end beneficiary, and any technical or time constraints.'),
      tHomeTitle:this.L('العودة إلى الدار','Back to Home'), tMarkAlt:this.L('كيان','Kayan'),
      tReset:this.L('مسح العرض','Clear demo'), tResetTitle:this.L('يمسح بيانات العرض من هذا الجهاز فقط','Clears the demo data on this device only'),
      atEnter:view==='enter', atCApply:view==='capply', atClient:view==='client', atTalent:view==='talent', atPod:view==='pod',
      crumb: view==='enter'?'':this.L('↩ المدخل','↩ Entrance'),
      cSessOn:(()=>{ try{const a=JSON.parse(localStorage.getItem('kyn-auth-v1')||'null');return !!(a&&a.v===1&&a.role==='client');}catch(e){return false;} })(),
      cSessLine:(()=>{ try{const a=JSON.parse(localStorage.getItem('kyn-auth-v1')||'null');if(!(a&&a.v===1))return '';return this.L('تقيد هذه الوثيقة على حساب: ','This document is recorded to the account: ')+a.name+(a.org?' — '+a.org:'');}catch(e){return '';} })(),
      goEnter:()=>this.go('enter'),
      resetAll:()=>{ if(confirm(this.L('يمسح بيانات العرض في هذه البوابة (لا يمس ملف التسجيل). متابعة؟','This clears the demo data in this portal. The registration file is untouched. Continue?'))){ try{localStorage.removeItem('kyn-portal-v2');}catch(e){} this.setState({...this.blank(), apply:s.apply, lang:s.lang}); } },
      clientDoorState: c.submitted ? (this.L('مشروع قائم — ','Live project — ')+c.id+this.L(' · ادخل لوحتك ←',' · enter your dashboard ←')) : this.L('لا ملف بعد — يفتح طلب النطاق ←','No file yet — open a scope request ←'),
      talentDoorState: applySubmitted ? (this.L('مسجل — ','Registered — ')+ap.appId+this.L(' · ادخل لوحتك ←',' · enter your dashboard ←')) : this.L('لا ملف بعد — يبدأ من التسجيل ←','No file yet — start from registration ←'),
      podDoorState: this.L('تفتح بحساب الكفاءة ورقم الفريق أو التكليف ←','Opens with a talent account and a pod or assignment number ←'),
      podDoorBg: '#1D1433', podDoorBd: '#5B4A8E', podLockMark: '',
      enterClient:()=>{ let a=null; try{a=JSON.parse(localStorage.getItem('kyn-auth-v1')||'null');}catch(e){}
        if(a&&a.v===1&&a.role==='client'){
          if(c.submitted){ this.props.navigate(this.props.routeForHref('Kayan Space - Client.dc.html')); return; }
          const org={...c.org,name:c.org.name||a.org||''};
          const auth={...c.auth,name:c.auth.name||a.name||'',email:c.auth.email||a.email||''};
          this.save({c:{...c,org,auth}}, ()=>this.go('capply')); return; }
        this.go(c.submitted?'client':'capply'); },
      enterTalent:()=>{ let a=null; try{a=JSON.parse(localStorage.getItem('kyn-auth-v1')||'null');}catch(e){}
        if(a&&a.v===1&&a.role==='talent'){ this.props.navigate(this.props.routeForHref('Kayan Space - Talent.dc.html')); return; }
        if(applySubmitted) this.go('talent'); else this.props.navigate(this.props.routeForHref('Kayan Access.dc.html')); },
      enterPod:()=>{ this.props.navigate(this.props.routeForHref('Kayan Pod Room.dc.html')); },
      cRail:cRailLabels.map((l,i)=>{ const cur=c.stage===i, done=this.cStageOk(i)&&i<c.stage;
        const limit=Math.max(c.maxSeen, this.cStageOk(c.stage)?c.stage+1:c.stage);
        const locked=i>limit;
        return { no:('0'+i).slice(-2), label:l, done, locked,
          lockAttr: locked?'':null, nudgeAttr: this.state.nudge===i?'':null,
          tip: locked ? this.L('يفتح بعد استيفاء ما قبله','Opens once the steps before it are complete') : l,
          fg:cur?'#03201D':(done?'#0E6E66':'#6E675A'), bg:cur?'linear-gradient(135deg,#C9A227,#E9C96B)':(done?'#EAF4F0':'#FFFFFF'), bd:cur?'#C9A227':(done?'#BFE0D6':'#E0D6BD'),
          // A locked step used to no-op in silence. Now it says why.
          go:()=>{ if(locked){ this.setState({nudge:i}); clearTimeout(this._nt); this._nt=setTimeout(()=>this.setState({nudge:null}),360); return; }
            this.save({c:{...c,stage:i,maxSeen:Math.max(c.maxSeen,i)}}); } }; }),
      cs0:c.stage===0, cs1:c.stage===1, cs2:c.stage===2, cs3:c.stage===3, cs4:c.stage===4,
      cHint:this.cHintFor(c.stage),
      cNextLabel: c.stage===4 ? this.L('قدم الطلب — ويقيد في السجل ←','Submit the request — it is entered in the register ←') : this.L('التالي ←','Next ←'),
      cNextBg: okNow?'linear-gradient(135deg,#C9A227,#E9C96B)':'#E4DCC6', cNextFg: okNow?'#03201D':'#9A8F73', cNextCursor: okNow?'pointer':'not-allowed',
      cBack:()=>{ if(c.stage===0) this.go('enter'); else this.save({c:{...c,stage:c.stage-1}}); },
      cNext:()=>{ if(!okNow) return;
        if(c.stage<4){ this.save({c:{...c,stage:c.stage+1,maxSeen:Math.max(c.maxSeen,c.stage+1)}}); }
        else { const seq=String(10000+Math.floor(Math.random()*89999)); const id='KY-C-26-'+seq+'-'+this.checkDigit('26'+seq.slice(0,5));
          const log=logPush(c.log,this.L('قيد طلب النطاق باسم «','Scope request entered for “')+c.org.name+this.L('» — الحالة: قيد المراجعة.','” — status: under review.'));
          this.save({c:{...c,submitted:true,id,at:this.today(),prog:0,log}}, ()=>this.go('client')); } },
      cOrgName:c.org.name, setCOrgName:e=>this.save({c:{...c,org:{...c.org,name:e.target.value}}}),
      cOrgType:c.org.type, setCOrgType:e=>this.save({c:{...c,org:{...c.org,type:e.target.value}}}),
      cSector:c.org.sector, setCSector:e=>this.save({c:{...c,org:{...c.org,sector:e.target.value}}}),
      cSize:c.org.size, setCSize:e=>this.save({c:{...c,org:{...c.org,size:e.target.value}}}),
      cCountry:c.org.country, setCCountry:e=>this.save({c:{...c,org:{...c.org,country:e.target.value}}}),
      cCity:c.org.city, setCCity:e=>this.save({c:{...c,org:{...c.org,city:e.target.value}}}),
      cSite:c.org.site, setCSite:e=>this.save({c:{...c,org:{...c.org,site:e.target.value}}}),
      cAuthName:c.auth.name, setCAuthName:e=>this.save({c:{...c,auth:{...c.auth,name:e.target.value}}}),
      cAuthRole:c.auth.role, setCAuthRole:e=>this.save({c:{...c,auth:{...c.auth,role:e.target.value}}}),
      cAuthEmail:c.auth.email, setCAuthEmail:e=>this.save({c:{...c,auth:{...c.auth,email:e.target.value}}}),
      cAuthPhone:c.auth.phone, setCAuthPhone:e=>this.save({c:{...c,auth:{...c.auth,phone:e.target.value}}}),
      pickCProof:e=>{ const f=e.target.files&&e.target.files[0]; if(!f){return;}
        if(f.size>10*1048576){ this.save({c:{...c,auth:{...c.auth,proof:this.L('الملف يتجاوز 10MB.','The file exceeds 10MB.'),proofOk:false}}}); return; }
        this.save({c:{...c,auth:{...c.auth,proof:this.L('قبل: ','Accepted: ')+f.name+this.L(' — يفحص بشريا خلال يومي عمل.',' — checked by a person within two working days.'),proofOk:true}}}); },
      cProofMsg:c.auth.proof||this.L('لم يرفع بعد.','Not uploaded yet.'), cProofColor:c.auth.proofOk?'#0E6E66':(c.auth.proof?'#C0392B':'#8A7F63'),
      cCodeSent:c.auth.codeSent, cCode:c.auth.code,
      setCCode:e=>{ const v=e.target.value.replace(/\D/g,'').slice(0,4); this.save({c:{...c,auth:{...c.auth,code:v,codeOk:v==='2026'}}}); },
      sendCCode:()=>{ if(c.auth.phone.replace(/\D/g,'').length>=9) this.save({c:{...c,auth:{...c.auth,codeSent:true}}}); },
      cCodeBtnLabel:c.auth.codeOk?this.L('تأكد ✓','Confirmed ✓'):(c.auth.codeSent?this.L('أعد الإرسال','Resend'):this.L('أرسل رمز التحقق','Send the code')),
      cCodeBtnBg:c.auth.codeOk?'#2E7CBC':'transparent', cCodeBtnFg:c.auth.codeOk?'#FAF6EC':'#2E7CBC',
      cCodeHint:c.auth.codeOk?this.L('أكدت القناة — يقيد التأكيد في السجل.','The channel is confirmed and the confirmation is recorded.'):(c.auth.codeSent?this.L('أرسل رمز إلى الرقم (في بيئة العرض: 2026).','A code was sent to the number (in this demo: 2026).'):this.L('يرسل رمز للتأكد أن القناة بيد المفوض نفسه.','A code is sent to confirm the channel is held by the signatory.')),
      cComp:(this.isAr()?[
        {t:'فحص العقوبات', b:'يفحص اسم المنشأة والمفوض مقابل قوائم العقوبات الدولية قبل أي تعاقد، التزاما بالقانون.'},
        {t:'مصدر الأموال', b:'يقر بأن أموال الضمان من نشاط مشروع، وتقبل المنشأة مراجعتها عند الاقتضاء.'},
        {t:'الحياد', b:'لا يقبل تكليف يخدم طرفا في نزاع مسلح أو نشاطا حزبيا — قاعدة دار لا تفاوض عليها.'},
        {t:'معالجة البيانات', b:'تعالج بيانات الملف لغرض التعاقد حصرا، ويقيد كل حدث قيدا مؤرخا لا يعدل ولا يحذف.'}
      ]:[
        {t:'Sanctions screening', b:'The organisation and signatory names are screened against international sanctions lists before any contract, as the law requires.'},
        {t:'Source of funds', b:'The escrow funds are declared to come from lawful activity, and the organisation accepts their review where warranted.'},
        {t:'Neutrality', b:'No assignment serving a party to armed conflict or a partisan activity is accepted. A house rule, not open to negotiation.'},
        {t:'Data processing', b:'File data is processed for the purpose of contracting only, and every event is entered as a dated record that is neither amended nor deleted.'}
      ]).map((x,i)=>({ ...x, on:c.comp[i], mark:c.comp[i]?'✓':'', bd:c.comp[i]?'#0E6E66':'#C8BC9C', bg:c.comp[i]?'#0E6E66':'transparent',
        toggle:()=>{ const a=[...c.comp]; a[i]=!a[i]; this.save({c:{...c,comp:a}}); } })),
      cOutcome:c.scope.outcome||'—',
      cScopeLineLabel:this.lab('line',c.scope.line), setCOutcome:e=>this.save({c:{...c,scope:{...c.scope,outcome:e.target.value}}}),
      cLine:c.scope.line, setCLine:e=>this.save({c:{...c,scope:{...c.scope,line:e.target.value}}}),
      cDeadline:c.scope.deadline, setCDeadline:e=>this.save({c:{...c,scope:{...c.scope,deadline:e.target.value}}}),
      cBudget:c.scope.budget, setCBudget:e=>this.save({c:{...c,scope:{...c.scope,budget:e.target.value}}}),
      cDesc:c.scope.desc, setCDesc:e=>this.save({c:{...c,scope:{...c.scope,desc:e.target.value}}}),
      pickCFile:e=>{ const f=e.target.files&&e.target.files[0]; if(f){ this.save({c:{...c,scope:{...c.scope,files:[...c.scope.files,f.name]}}}); e.target.value=''; } },
      cFilesMsg: c.scope.files.length? (this.L('مرفقات: ','Attachments: ')+c.scope.files.join(' · ')) : this.L('لا مرفقات بعد.','No attachments yet.'),
      cReview:[
        {k:this.L('المنشأة','Organisation'), v:(c.org.name||'—')+' · '+this.lab('orgType',c.org.type)+' · '+this.lab('sector',c.org.sector)+' · '+(c.org.city||''), n:0},
        {k:this.L('المفوض','Signatory'), v:(c.auth.name||'—')+' · '+(c.auth.role||'')+' · '+(c.auth.email||''), n:1},
        {k:this.L('الالتزام','Compliance'), v:this.isAr()?(c.comp.filter(Boolean).length+' من 4 إقرارات مؤشرة'):(c.comp.filter(Boolean).length+' of 4 declarations ticked'), n:2},
        {k:this.L('النتيجة','Outcome'), v:(c.scope.outcome||'—')+' · '+this.lab('line',c.scope.line), n:3},
        {k:this.L('الموعد والميزانية','Deadline and budget'), v:(c.scope.deadline||'—')+' · '+(this.lab('budget',c.scope.budget)||'—'), n:3},
        {k:this.L('الوصف','Description'), v:(c.scope.desc||'—').slice(0,120), n:3}
      ].map(r=>({...r, go:()=>this.save({c:{...c,stage:r.n}}) })),
      cFinalOn:c.final, cFinalMark:c.final?'✓':'', cFinalBd:c.final?'#0E6E66':'#C8BC9C', cFinalBg:c.final?'#0E6E66':'transparent',
      toggleCFinal:()=>this.save({c:{...c,final:!c.final}}),
      cId:c.id||'KY-C-26-—', cLineTag:(()=>{const v=c.scope.line||'';return (v==='L1'||v.includes('الأول'))?'L1 · MANAGED DELIVERY':((v==='L3'||v.includes('الثالث'))?'L3 · TALENT':((v==='L5')?'L5 · READY PRODUCTS':'SCOPE'));})(),
      cStages: stagesTxt.map((t,i)=>({ t, bar: i<=c.prog?'linear-gradient(90deg,#2E7CBC,#7CC0F4)':'#E4DCC6', fg:i===c.prog?'#0A2434':'#8A7F63', w:i===c.prog?'700':'400' })),
      cStageNote:(this.isAr()?[
        'يراجع الطلب ويصاغ النطاق — يرد عرض ثابت السعر خلال خمسة أيام عمل.',
        'العرض جاهز: سعر مكتوب وموعد مسمى — بتوقيع المفوض ينتقل الملف للضمان.',
        'وقع النطاق — يمول الضمان لدى الطرف الأمين، وقبل تمويله لا يبدأ عمل.',
        'الضمان ممول والفريق مشكل — التنفيذ جار، والتقدم يقيد في السجل أولا بأول.',
        'اجتاز التسليم مراجعة كيان المستقلة — بانتظار توقيع مفوضكم محضر القبول.',
        'وقع القبول وصرف المستحق — يسري ضمان ثلاثين يوما على التسليم.'
      ]:[
        'The request is under review and the scope is being drafted. A fixed-price quotation is returned within five working days.',
        'The quotation is ready: a written price and a named date. On the signatory\u2019s signature the file moves to escrow.',
        'The scope is signed. Escrow is funded with the trustee, and no work begins before it is funded.',
        'Escrow is funded and the pod is formed. Execution is under way, and progress is entered in the register as it happens.',
        'The delivery has passed Kayan\u2019s independent review, awaiting your signatory\u2019s signature on the acceptance certificate.',
        'Acceptance is signed and the amount released. A thirty-day warranty runs on the delivery.'
      ])[c.prog]||'',
      simLabel:(this.isAr()?['(محاكاة العرض) أصدر العرض الثابت','(محاكاة العرض) وقع النطاق','(محاكاة العرض) مول الضمان','(محاكاة العرض) اعرض التسليم','بانتظار توقيعك أدناه','اكتمل — لا محاكاة بعده']:['(demo) Issue the fixed quotation','(demo) Sign the scope','(demo) Fund the escrow','(demo) Present the delivery','Awaiting your signature below','Complete — nothing further to simulate'])[c.prog]||'—',
      simAdvance:()=>{ if(c.prog>=4) return;
        const notes=this.isAr()?['أصدر عرض ثابت السعر وأرسل للمفوض.','وقع النطاق من المفوض — قيد التوقيع.','مول الضمان لدى الطرف الأمين وقيد الإيداع.','شكل فريق التنفيذ وبدأ العمل.']:['Fixed-price quotation issued and sent to the signatory.','Scope signed by the signatory; the signature is recorded.','Escrow funded with the trustee and the deposit recorded.','Execution pod formed and work begun.'];
        let log=logPush(c.log, notes[c.prog]);
        if(c.prog===2){ log=logPush(log,this.L('فتحت غرفة الفريق «','Pod room opened: “')+pd.name+this.L('».','”.')); }
        this.save({c:{...c,prog:c.prog+1,log}}); },
      cLedger: c.prog>=2 ? [
        {t:this.L('إيداع الضمان — ','Escrow deposit — ')+this.lab('budget',c.scope.budget), v:'FUNDED ✓', c:'#6FDCCE'},
        {t:this.L('محتجز حتى توقيع القبول','Held until acceptance is signed'), v:c.accepted?'RELEASED':'HELD', c:c.accepted?'#6FDCCE':'#E9C96B'},
        ...(c.accepted?[{t:this.L('صرف للمنفذين بالقسمة المعلنة','Released to the pod on the declared split'), v:'PAID ✓', c:'#6FDCCE'}]:[])
      ] : [ {t:this.L('لا إيداع بعد — يمول الضمان بعد توقيع النطاق','No deposit yet. Escrow is funded after the scope is signed'), v:'PENDING', c:'rgba(250,246,236,.5)'} ],
      cLedgerNote: c.prog>=2 ? this.L('المال لدى طرف أمين، ولا يمس قبل توقيع مفوضكم محضر القبول.','The money sits with a trustee and is untouched until your signatory signs the acceptance certificate.') : this.L('القاعدة: لا عقد، لا ضمان، لا عمل — الدفتر يفتح بأول إيداع.','The rule: no contract, no escrow, no work. The ledger opens with the first deposit.'),
      cDelivOn: c.prog===4 && !c.accepted, cDelivDone: c.accepted, cDelivIdle: c.prog<4,
      signAccept:()=>{ const end=new Date(Date.now()+30*86400000).toLocaleDateString(this.isAr()?'ar-YE':'en-GB',{month:'long',day:'numeric'});
        const log=logPush(c.log,this.L('وقع محضر القبول من المفوض — صرف المستحق وبدأ الضمان.','Acceptance certificate signed by the signatory; the amount was released and the warranty began.'));
        this.save({c:{...c,accepted:true,acceptDate:this.today(),warrantyEnd:end,prog:5,log}}); },
      cAcceptDate:c.acceptDate||'', cWarrantyEnd:c.warrantyEnd||'',
      cPodOn: c.prog>=3, podName:pd.name, podCode:pd.code, podCount:pd.rows.length, podRows:pd.rows,
      cLog: c.log.length?c.log:[{d:'—',t:this.L('لا قيود بعد.','No records yet.')}],
      cAuthNameV:c.auth.name,
      tId: applySubmitted?ap.appId:'—', tName: applySubmitted?(ap.acc&&ap.acc.name||'—'):'—',
      tCraft: applySubmitted&&ap.specs&&ap.specs[0]?('★ '+ap.specs[0].name):this.L('التخصص يقيد من التسجيل','The craft is recorded from registration'),
      tCity: applySubmitted&&ap.idn?(ap.idn.gov||''):'',
      tLadder:(this.isAr()?['1 · مسجل','2 · موثق الهوية','3 · موثق القدرة','4 · معتمد','5 · مؤتمن']:['1 · Registered','2 · Identity verified','3 · Capability verified','4 · Accredited','5 · Entrusted']).map((t,i)=>({ t, bar:i===0?'linear-gradient(90deg,#C9A227,#E9C96B)':'rgba(250,246,236,.14)', fg:i===0?'#E9C96B':'rgba(250,246,236,.5)', w:i===0?'700':'400' })),
      tLadderNote:this.L('درجتك الآن: مسجل — تصعد الثانية باكتمال فحص الهوية، والثالثة باجتياز التقييم. كل درجة تنقضي بمدتها وتجدد بالإثبات لا بالمطالبة.','Your rung now: registered. The second is reached when the identity check completes, the third on passing the assessment. Each rung expires with its term and is renewed on evidence, not on request.'),
      tSteps:[
        {t:this.L('قيد الطلب','Application entered'), d: applySubmitted?(this.L('قيد بتاريخ ','Entered on ')+(ap.submittedAt||'')+'.'):'—', dot:'#C9A227'},
        {t:this.L('فحص الهوية','Identity check'), d:this.L('الوثائق والصورة الحية لدى موظف التحقق — خلال 3 أيام عمل.','Documents and the live photograph are with the verification officer, within three working days.'), dot:'#FFFFFF'},
        {t:this.L('إفادات المزكين','Referee statements'), d: applySubmitted&&ap.refs? (ap.refs.filter(r=>r.status==='وردت الإفادة').length+this.L(' من ',' of ')+ap.refs.filter(r=>r.name).length+this.L(' وردت — تجلب آليا فور تقديمها.',' received; they are collected automatically as they are filed.')) : '—', dot: applySubmitted&&ap.refs&&ap.refs.some(r=>r.status==='وردت الإفادة')?'#C9A227':'#FFFFFF'},
        {t:this.L('التقييم','The assessment'), d:this.L('يحدد موعده بعد اكتمال الهوية والإفادات.','Its date is set once identity and statements are complete.'), dot:'#FFFFFF'},
        {t:this.L('القرار','The decision'), d:this.L('موثق، أو معلومات إضافية، أو ليس بعد — بقرار مسبب ولك تظلم خلال 21 يوما.','Verified, further information required, or not yet — by reasoned decision, with a right of appeal within 21 days.'), dot:'#FFFFFF'}
      ],
      tBanks: applySubmitted&&ap.pay?ap.pay.banks:[], tBanksOn: !!(applySubmitted&&ap.pay&&ap.pay.banks.length), tBanksOff: !(applySubmitted&&ap.pay&&ap.pay.banks.length),
      tK4y: applySubmitted&&ap.k4y&&ap.k4y.on ? (this.L('متطوع في: ','Volunteering in: ')+(ap.k4y.fields||[]).join(this.L('، ',', '))+' — '+(ap.k4y.hours||'')+'.') : this.L('لم تنضم بعد — الباب مفتوح من محطة «كيان لليمن» في التسجيل، والمشاركة لا تؤثر في تقييمك المهني.','You have not joined yet. The door is open from the “Kayan for Yemen” step in registration, and taking part does not affect your professional assessment.'),
      tK4yHours: applySubmitted&&ap.k4y&&ap.k4y.on?'0':'—',
      tLog: applySubmitted?[
        {d:'2026-08-11', t:this.L('قيد الطلب كاملا برقم ','Application entered in full under number ')+ap.appId+this.L(' — قيد مؤرخ لا يعدل.',' — a dated record, not amendable.')},
        {d:'2026-08-11', t:this.L('أكدت قناة واتساب للحساب.','The WhatsApp channel for the account was confirmed.')},
        ...(ap.refs&&ap.refs.some(r=>r.status!=='مسودة')?[{d:'2026-08-11',t:this.L('أرسلت طلبات التزكية إلى المزكين المسمين.','Reference requests were sent to the named referees.')}]:[])
      ]:[{d:'—',t:this.L('لا قيود بعد.','No records yet.')}],
      podLocked: !podReady, podOpen: podReady,
      podLockHint: c.submitted ? (this.L('حالة تكليفكم الآن: «','Your assignment status now: “')+stagesTxt[c.prog]+this.L('» — تفتح الغرفة عند بلوغ «التنفيذ».','” — the room opens on reaching “Execution”.')) : this.L('لا تكليف قائما في هذا العرض — يبدأ الطريق من بوابة العملاء.','No live assignment in this demo. The route starts at the clients\u2019 door.')
    };
  }
}
