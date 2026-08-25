import React from 'react';
import DCLogic from '../../home/DCLogic.js';

export default class PodLogic extends DCLogic {
  constructor(props){
    super(props);
    let auth=null;try{auth=JSON.parse(localStorage.getItem('kyn-auth-v1')||'null');}catch(e){}
    this.auth=(auth&&auth.v===1&&auth.role==='talent')?auth:null;
    let pod=null;try{pod=JSON.parse(localStorage.getItem('kyn-pod-041')||'null');}catch(e){}
    const unlocked=(()=>{try{return sessionStorage.getItem('kyn-pod-open')==='POD-26-041';}catch(e){return false;}})();
    this.state={unlocked:!!this.auth&&unlocked,code:'',err:'',view:'board',newTask:'',newLog:'',draft:'',pod:(pod&&pod.v===1)?pod:this.seed(),now:Date.now()};
    if(!(pod&&pod.v===1))this.persist(this.state.pod);
  }
  seed(){const d=n=>new Date(Date.now()-n*864e5).toISOString().slice(0,10);
    return {v:1,deadline:Date.now()+12*864e5,gate:6,checks:[true,true,false,false,false],gateAsked:false,
      tasks:[{id:1,t:'قوالب الورقية الرسمية: ترويسة وظرف وبطاقة',lane:1,owner:'عمر'},{id:2,t:'أغلفة الحسابات الاجتماعية بثلاث نسب',lane:1,owner:'مريم'},{id:3,t:'توقيع البريد الإلكتروني بنسختيه',lane:2,owner:'سلمى'},{id:4,t:'تجهيز الملفات المصدر وتسميتها النظامية',lane:0,owner:'مريم'},{id:5,t:'دليل الهوية النهائي',lane:3,owner:'سلمى'},{id:6,t:'اتجاهات الهوية الثلاثة',lane:3,owner:'سلمى'}],
      log:[{t:d(0),who:'Salma',x:'رفع توقيع البريد إلى المراجعة الداخلية؛ تبقى مطابقة مقاسات الطباعة.'},{t:d(1),who:'Omar',x:'أنجزت الترويسة بصيغتيها وسلمت لمريم لضبط ملفات المصدر.'},{t:d(2),who:'Kayan QA',x:'اجتاز دليل الهوية بوابة الجودة ورفع لمراجعة العميل.'},{t:d(4),who:'Salma',x:'ثبت مع مدير التسليم أن جولة التصويب تشمل التطبيقات لا الدليل.'}],
      chat:[{who:'سلمى — قائدة الفريق',t:'09:12',x:'صباح الخير. اليوم نقفل توقيع البريد ونفتح بند الأغلفة. عمر، الترويسة عندك؟',me:false,lead:true},{who:'عمر — مساهم رئيس',t:'09:15',x:'جاهزة بصيغتين، رفعتها في الملفات باسم البند. أنتقل للأغلفة بعد الظهر.',me:false,lead:false},{who:'مريم — مساهمة صاعدة',t:'09:21',x:'أضبط ملفات المصدر على التسمية النظامية وأسلم نهاية اليوم.',me:false,lead:false},{who:'سلمى — قائدة الفريق',t:'09:24',x:'ممتاز. تذكير: لا يرفع شيء للمراجعة قبل اكتمال بنود الحراسة الخمسة.',me:false,lead:true}],
      files:[{name:'دليل الهوية النهائي v3',ext:'PDF',meta:'GUIDE-V3 · 18MB · '+d(1),st:'لدى العميل',c:'#E9C96B'},{name:'اتجاهات الهوية الثلاثة',ext:'PDF',meta:'DIR-V2 · 9MB · '+d(9),st:'مقبول بمحضر',c:'#7CE0B8'},{name:'ترويسة رسمية — صيغتان',ext:'AI',meta:'APP-LTR-V1 · 4MB · '+d(1),st:'قيد العمل',c:'#B9A8E8'},{name:'محضر استلام البند الأول',ext:'PDF',meta:'ACCEPT-01 · موقع · '+d(2),st:'أرشيف',c:'rgba(241,236,255,.5)'}]};}
  persist(p){try{localStorage.setItem('kyn-pod-041',JSON.stringify(p));}catch(e){}}
  up(fn){const p=JSON.parse(JSON.stringify(this.state.pod));fn(p);this.persist(p);this.setState({pod:p});}
  unlock(){const c=this.state.code.trim().toUpperCase();
    if(c==='POD-26-041'||c==='KY-J-26-00417'){try{sessionStorage.setItem('kyn-pod-open','POD-26-041');}catch(e){}this.setState({unlocked:true,err:''});}
    else this.setState({err:'لا يطابق الرقم تكليفًا قائمًا لعضويتك. يتحقق من رقم الفريق أو رقم التكليف كما وردا في إشعار الإسناد.'});}
  componentDidMount(){this.tick=setInterval(()=>this.setState({now:Date.now()}),60000);}
  componentWillUnmount(){clearInterval(this.tick);}
  renderVals(){
    const {unlocked,view,pod}=this.state,me=this.auth;
    if(!me||!unlocked){return {gate:true,open:false,noAuth:!me,hasAuth:!!me,
      initial:me?me.name.trim()[0]:'',authName:me?me.name:'',authId:me?me.id:'',
      code:this.state.code,setCode:e=>this.setState({code:e.target.value,err:''}),
      codeKey:e=>{if(e.key==='Enter')this.unlock();},err:this.state.err,unlock:()=>this.unlock()};}
    const msLeft=Math.max(0,pod.deadline-this.state.now),dd=Math.floor(msLeft/864e5),hh=Math.floor(msLeft%864e5/36e5);
    const laneNames=['قيد التجهيز','قيد التنفيذ','للمراجعة الداخلية','مقبول'];
    const laneHd=['#B9A8E8','#E9C96B','#7CC0F4','#7CE0B8'];
    const gateTips=['إشارة','استيعاب','توضيح','نطاق موقع','فرز وامتثال','تشكيل الفريق','جاهزية التسليم','مراجعة العميل','قبول ومحضر','صرف وضمانة'];
    const checkTexts=['طابق كل بند تعريف الاكتمال نصًا','راجع عضو ثان كل ملف قبل الرفع','سميت الملفات بالتسمية النظامية وأرقام الإصدار','خلت التسليمات من بيانات تجريبية أو حقوق غير مرخصة','دونت اليوميات حتى تاريخه'];
    const done=pod.checks.filter(Boolean).length,allDone=done===5;
    return {gate:false,open:true,
      members:[{i:'س',tip:'سلمى — قائدة الفريق T3 · متصلة',bg:'linear-gradient(135deg,#C9A227,#E9C96B)',fg:'#052E2B',dot:'#7CE0B8'},{i:'ع',tip:'عمر — مساهم رئيس T2 · متصل',bg:'#5B4A8E',fg:'#F1ECFF',dot:'#7CE0B8'},{i:'م',tip:'مريم — مساهمة صاعدة T1 · تعود ظهرًا',bg:'#3A2F5C',fg:'#D8CCF6',dot:'#E9C96B'}],
      countdown:dd+'d '+String(hh).padStart(2,'0')+'h',leave:()=>{try{sessionStorage.removeItem('kyn-pod-open');}catch(e){}this.setState({unlocked:false,code:''});},
      gates:gateTips.map((tip,i)=>({id:'G'+i,tip,bar:i<pod.gate?'#7CE0B8':i===pod.gate?'linear-gradient(90deg,#B9A8E8,#D8CCF6)':'rgba(185,168,232,.15)',fg:i===pod.gate?'#D8CCF6':i<pod.gate?'#7CE0B8':'rgba(241,236,255,.35)'})),
      tabs:[['board','لوحة البنود'],['log','اليوميات'],['chat','قناة الفريق'],['gatetab','حراسة البوابة'],['files','الملفات والتوزيع']].map(([id,label])=>({label,go:()=>this.setState({view:id}),bg:view===id?'linear-gradient(135deg,#B9A8E8,#D8CCF6)':'transparent',fg:view===id?'#140E26':'rgba(241,236,255,.7)',bd:view===id?'#B9A8E8':'#3A2F5C'})),
      vBoard:view==='board',vLog:view==='log',vChat:view==='chat',vGateTab:view==='gatetab',vFiles:view==='files',
      lanes:laneNames.map((name,li)=>({name,hd:laneHd[li],isFirst:li===0,count:String(pod.tasks.filter(t=>t.lane===li).length),
        tasks:pod.tasks.filter(t=>t.lane===li).map(t=>({t:t.t,owner:t.owner,canBack:li>0&&li<3,canFwd:li<3,
          fwd:()=>this.up(p=>{const k=p.tasks.find(x=>x.id===t.id);k.lane++;if(k.lane===3)p.log.unshift({t:new Date().toISOString().slice(0,10),who:me.name.split(' ')[0],x:'رفع «'+k.t+'» للمراجعة الداخلية.'});}),
          back:()=>this.up(p=>{p.tasks.find(x=>x.id===t.id).lane--;})}))})),
      newTask:this.state.newTask,setNewTask:e=>this.setState({newTask:e.target.value}),
      newTaskKey:e=>{if(e.key==='Enter')this.addTask();},addTask:()=>this.addTask(),
      newLog:this.state.newLog,setNewLog:e=>this.setState({newLog:e.target.value}),
      newLogKey:e=>{if(e.key==='Enter')this.addLog();},addLog:()=>this.addLog(),
      logEntries:pod.log,
      chat:pod.chat.map(m=>({who:m.who,t:m.t,x:m.x,side:m.me?'start':'end',align:m.me?'flex-start':'flex-end',bg:m.me?'linear-gradient(135deg,#5B4A8E,#7A66B8)':'#140E26',fg:'#F1ECFF',nameC:m.lead?'#E9C96B':'#B9A8E8'})),
      draft:this.state.draft,setDraft:e=>this.setState({draft:e.target.value}),
      draftKey:e=>{if(e.key==='Enter')this.send();},send:()=>this.send(),
      checksDone:String(done),
      checks:checkTexts.map((x,i)=>{const on=pod.checks[i];return {x,tap:()=>this.up(p=>{p.checks[i]=!p.checks[i];p.gateAsked=false;}),
        bd:on?'rgba(126,224,184,.5)':'#3A2F5C',bg:on?'rgba(126,224,184,.06)':'transparent',fg:on?'#CFF3E2':'rgba(241,236,255,.8)',
        boxBd:on?'#7CE0B8':'#3A2F5C',boxBg:on?'#7CE0B8':'transparent',mark:on?'✓':''};}),
      askGate:()=>{if(allDone)this.up(p=>{p.gateAsked=true;p.log.unshift({t:new Date().toISOString().slice(0,10),who:me.name.split(' ')[0],x:'قدم طلب فتح البوابة G6 بعد اكتمال بنود الحراسة.'});});},
      gateAsked:pod.gateAsked,gateCur:allDone?'pointer':'not-allowed',
      gateBtnLabel:pod.gateAsked?'قدم الطلب — بانتظار الفاحص':'طلب فتح البوابة G6',
      gateBtnBg:allDone?(pod.gateAsked?'rgba(126,224,184,.15)':'linear-gradient(135deg,#B9A8E8,#D8CCF6)'):'rgba(185,168,232,.1)',
      gateBtnFg:allDone?(pod.gateAsked?'#7CE0B8':'#140E26'):'rgba(241,236,255,.35)',
      gateAnim:allDone&&!pod.gateAsked?'kGlow 2.4s infinite':'none',
      files:pod.files,
      split:[{name:'سلمى العمودي',role:'قائدة T3',pct:'40%'},{name:'عمر باحميد',role:'مساهم رئيس T2',pct:'35%'},{name:'مريم السقاف',role:'مساهمة صاعدة T1',pct:'25%'}],
    };
  }
  addTask(){const t=this.state.newTask.trim();if(!t)return;this.up(p=>{p.tasks.push({id:Date.now(),t,lane:0,owner:this.auth.name.split(' ')[0]});});this.setState({newTask:''});}
  addLog(){const x=this.state.newLog.trim();if(!x)return;this.up(p=>{p.log.unshift({t:new Date().toISOString().slice(0,10),who:this.auth.name.split(' ')[0],x});});this.setState({newLog:''});}
  send(){const x=this.state.draft.trim();if(!x)return;this.up(p=>{p.chat.push({who:this.auth.name.split(' ')[0]+' — أنت',t:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),x,me:true,lead:false});});this.setState({draft:''});}
}