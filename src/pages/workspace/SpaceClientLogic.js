import React from 'react';
import DCLogic from '../../home/DCLogic.js';

export default class SpaceClientLogic extends DCLogic {
  constructor(props){
    super(props);
    let auth=null;try{auth=JSON.parse(localStorage.getItem('kyn-auth-v1')||'null');}catch(e){}
    this.auth=(auth&&auth.v===1&&auth.role==='client')?auth:null;
    this.key=this.auth?('kyn-cws-'+this.auth.id):null;
    let ws=null;if(this.key){try{ws=JSON.parse(localStorage.getItem(this.key)||'null');}catch(e){}}
    this.state={view:'overview',ws:ws&&ws.v===1?ws:this.seedWs(),signName:'',draft:'',coText:''};
    if(this.key&&!(ws&&ws.v===1))this.persist(this.state.ws);
  }
  seedWs(){const now=Date.now(),d=n=>new Date(now-n*864e5).toISOString().slice(0,10);
    return {v:1,jobId:'KY-J-26-00417',scopeTitle:'هوية بصرية متكاملة لمصنع أغذية',pod:'فريق سنّار',lead:'سلمى أحمد العمودي — T3',price:2400,fee:'ضمن السعر — شريحة مطمأن إليها S2',deadlineTs:now+12*864e5,stage:3,
      dod:['دليل هوية كامل: الشعار وقواعده والألوان والخطوط','تطبيقات: ورقية رسمية، توقيع بريد، أغلفة حسابات','ملفات مصدر قابلة للتحرير وتسليم منظم','جولة تصويب واحدة ضمن النطاق'],
      ledger:[{t:d(9),x:'إيداع كامل قيمة النطاق في حساب الضمان',amt:'+$2,400',c:'#7CE0B8'},{t:d(2),x:'صرف مقابل البند الأول بمحضر استلام موقع',amt:'−$600',c:'#F0B9A0'}],
      held:1800,
      deliv:[{id:1,name:'اتجاهات الهوية الثلاثة',note:'قبل بمحضر استلام موقع — '+d(2),st:'accepted'},{id:2,name:'دليل الهوية النهائي',note:'رفعه الفريق للمراجعة أمس — تراجع خلال خمسة أيام عمل',st:'review'},{id:3,name:'التطبيقات والملفات المصدر',note:'قيد التنفيذ لدى الفريق',st:'wip'}],
      cos:[],
      msgs:[{who:'مدير التسليم — كيان',x:'رفع الفريق دليل الهوية النهائي إلى بند المراجعة. ينتظر قراركم: قبول بالمحضر أو طلب تصويب.',t:d(1),side:'them'},{who:'أنت',x:'وصل الدليل، تجري مراجعته لدى الإدارة.',t:d(1),side:'me'}],
      log:[{t:d(1),x:'رفع دليل الهوية النهائي للمراجعة'},{t:d(2),x:'وقع محضر استلام البند الأول وصرف مستحقه من الضمان'},{t:d(6),x:'اجتياز بوابة الجودة الداخلية للاتجاه المختار'},{t:d(9),x:'مول حساب الضمان وبدأ العمل'}],
      accepted:false,warrantyEnd:null};}
  persist(ws){if(this.key){try{localStorage.setItem(this.key,JSON.stringify(ws));}catch(e){}}}
  up(fn){const ws=JSON.parse(JSON.stringify(this.state.ws));fn(ws);this.persist(ws);this.setState({ws});}
  logout(){try{localStorage.removeItem('kyn-auth-v1');}catch(e){}this.props.navigate(this.props.routeForHref('Kayan Access.dc.html'));}
  fmtD(ts){return new Date(ts).toLocaleDateString('ar-YE',{month:'long',day:'numeric'});}
  renderVals(){
    const locked=!this.auth;
    if(locked)return {locked:true,open:false};
    const {view,ws}=this.state,me=this.auth;
    const daysLeft=Math.max(0,Math.ceil((ws.deadlineTs-Date.now())/864e5));
    const stageNames=['فتح النطاق','التوقيع','تمويل الضمان','التنفيذ','المراجعة والقبول','الضمانة'];
    const stages=stageNames.map((name,i)=>({name,bar:i<ws.stage?'#2E7CBC':i===ws.stage?'linear-gradient(90deg,#2E7CBC,#7CC0F4)':'rgba(124,192,244,.18)',fg:i<=ws.stage?'#BFE0F8':'rgba(250,246,236,.4)'}));
    const navDefs=[['overview','نظرة عامة',''],['scope','نطاق العمل',''],['escrow','حساب الضمان',''],['deliv','التسليمات',String(ws.deliv.filter(x=>x.st==='review').length||'')],['change','أوامر التغيير',String(ws.cos.length||'')],['msgs','الرسائل',''],['docs','المستندات',''],['settings','الإعدادات','']];
    const titles={overview:'مرحبًا، '+(me.name.split(' ')[0]||''),scope:'نطاق العمل',escrow:'حساب الضمان',deliv:'التسليمات والقبول',change:'أوامر التغيير',msgs:'قناة المشروع',docs:'المستندات',settings:'الإعدادات'};
    const stChip={0:['قيد الفتح','#EDE5D2','#8F7218'],1:['قيد التوقيع','#EDE5D2','#8F7218'],2:['بانتظار التمويل','#EDE5D2','#8F7218'],3:['قيد التنفيذ','#0E6E66','#EAF7F0'],4:['قيد المراجعة','#C9A227','#052E2B'],5:['في الضمانة','#2E7CBC','#EAF3FB']}[ws.stage]||['قائم','#EDE5D2','#8F7218'];
    const delivMap=d=>{const map={accepted:['مقبول','#0E6E66','#EAF7F0','#BFE3D2'],review:['بانتظار قرارك','#C9A227','#052E2B','#C9A227'],wip:['قيد التنفيذ','#EDE5D2','#8F7218','#E0D6BD']}[d.st];
      return {name:d.name,note:d.note,status:map[0],chipBg:map[1],chipFg:map[2],bd:map[3],canAccept:d.st==='review',
        accept:()=>{if(!this.state.signName.trim()){alert('يدخل اسم صاحب صفة التوقيع توقيعًا.');return;}
          this.up(w=>{const it=w.deliv.find(x=>x.id===d.id);it.st='accepted';it.note='قبل بمحضر استلام موقع باسم '+this.state.signName.trim();
            const remaining=w.deliv.filter(x=>x.st!=='accepted').length;
            const rel=remaining===0?w.held:Math.min(600,w.held);
            w.held-=rel;w.ledger.push({t:new Date().toISOString().slice(0,10),x:'صرف مقابل «'+it.name+'» بمحضر استلام موقع',amt:'−$'+rel.toLocaleString('en'),c:'#F0B9A0'});
            w.log.unshift({t:new Date().toISOString().slice(0,10),x:'وقع محضر استلام «'+it.name+'» وبدأت ضمانة الثلاثين يومًا للبند'});
            if(w.deliv.every(x=>x.st==='accepted')){w.stage=5;w.accepted=true;w.warrantyEnd=Date.now()+30*864e5;}});
          this.setState({signName:''});},
        reject:()=>this.up(w=>{const it=w.deliv.find(x=>x.id===d.id);it.st='wip';it.note='أعيد للفريق بطلب تصويب ضمن الجولة المقررة';w.log.unshift({t:new Date().toISOString().slice(0,10),x:'طلب تصويب على «'+it.name+'» ضمن جولة النطاق'});})};};
    const warrantyBig=ws.warrantyEnd?String(Math.max(0,Math.ceil((ws.warrantyEnd-Date.now())/864e5)))+' يومًا':'٣٠ يومًا';
    return {locked:false,open:true,
      navItems:navDefs.map(([id,label,badge])=>({label,badge,go:()=>this.setState({view:id}),bg:view===id?'rgba(124,192,244,.14)':'transparent',fg:view===id?'#BFE0F8':'rgba(250,246,236,.66)'})),
      userName:me.name,userId:me.id,userOrg:me.org||'—',userEmail:me.email,logout:()=>this.logout(),
      crumb:'CLIENT SPACE · '+ws.jobId,pageTitle:titles[view],jobId:ws.jobId,
      stageChip:stChip[0],stageChipBg:stChip[1],stageChipFg:stChip[2],
      vOverview:view==='overview',vScope:view==='scope',vEscrow:view==='escrow',vDeliv:view==='deliv',vChange:view==='change',vMsgs:view==='msgs',vDocs:view==='docs',vSettings:view==='settings',
      scopeTitle:ws.scopeTitle,podName:ws.pod,podLead:ws.lead,deadline:this.fmtD(ws.deadlineTs),daysLeft:String(daysLeft),
      stages,stagesCount:stages.length,
      nextAction:ws.deliv.some(x=>x.st==='review')?'بانتظارك: بند «دليل الهوية النهائي» في المراجعة — يقبل بمحضر استلام أو يعاد بطلب تصويب من تبويب التسليمات.':ws.accepted?'اكتمل القبول. تسري ضمانة الثلاثين يومًا؛ أي ملاحظة ضمنها تعالج دون كلفة.':'العمل يجري على البند التالي؛ لا إجراء مطلوبًا منك الآن.',
      escrowAmt:'$'+ws.held.toLocaleString('en'),escrowPct:Math.round(ws.held/ws.price*100)+'%',
      escrowLine:'من أصل $'+ws.price.toLocaleString('en')+' — يصرف بمحاضر الاستلام فقط',
      delivDone:String(ws.deliv.filter(x=>x.st==='accepted').length),delivTotal:String(ws.deliv.length),
      warrantyBig,warrantyLine:ws.warrantyEnd?'سارية حتى انقضاء المدة — تعالج الملاحظات دون كلفة':'تبدأ لكل بند من توقيع محضره',
      logView:ws.log.slice(0,5),
      sowFacts:[{k:'النتيجة',v:ws.scopeTitle},{k:'الموعد',v:this.fmtD(ws.deadlineTs)},{k:'القيمة',v:'$'+ws.price.toLocaleString('en')+' — '+ws.fee},{k:'الفريق',v:ws.pod+' · '+ws.lead}],
      dod:ws.dod,ledger:ws.ledger,escrowHeld:'$'+ws.held.toLocaleString('en'),
      deliverables:ws.deliv.map(delivMap),signName:this.state.signName,setSignName:e=>this.setState({signName:e.target.value}),
      coText:this.state.coText,setCoText:e=>this.setState({coText:e.target.value}),
      submitCo:()=>{const t=this.state.coText.trim();if(!t)return;this.up(w=>{w.cos.unshift({id:'CO-'+String(w.cos.length+1).padStart(2,'0'),x:t,t:new Date().toISOString().slice(0,10),st:'قيد التقدير'});w.log.unshift({t:new Date().toISOString().slice(0,10),x:'قدم طلب أمر تغيير — يعاد تقدير الأثر على السعر والموعد'});});this.setState({coText:''});},
      changeOrders:ws.cos,
      msgs:ws.msgs.map(m=>({...m,side:m.side==='me'?'start':'end',bg:m.side==='me'?'#0E6E66':'#EDE5D2',fg:m.side==='me'?'#FAF6EC':'#052E2B'})),
      draft:this.state.draft,setDraft:e=>this.setState({draft:e.target.value}),
      draftKey:e=>{if(e.key==='Enter')this.sendMsg();},sendMsg:()=>this.sendMsg(),
      docs:[{name:'نطاق العمل الموقع',ext:'PDF',meta:'SOW · '+ws.jobId,st:'موقع'},{name:'إشعار تمويل حساب الضمان',ext:'PDF',meta:'ESCROW NOTICE',st:'صادر'},{name:'محضر استلام — البند الأول',ext:'PDF',meta:'ACCEPTANCE 01',st:'موقع'},{name:'شهادة الضمانة',ext:'PDF',meta:'WARRANTY CERT',st:ws.accepted?'صادرة':'تصدر عند القبول الكامل'}],
    };
  }
  sendMsg(){const t=this.state.draft.trim();if(!t)return;
    this.up(w=>{w.msgs.push({who:'أنت',x:t,t:new Date().toISOString().slice(0,10),side:'me'});});
    this.setState({draft:''});
    setTimeout(()=>this.up(w=>{w.msgs.push({who:'مدير التسليم — كيان',x:'وصلت رسالتكم وسجلت في ملف المشروع؛ يوافيكم الرد خلال يوم عمل.',t:new Date().toISOString().slice(0,10),side:'them'});}),900);}
}
