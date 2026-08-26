import React from 'react';
import DCLogic from '../../home/DCLogic.js';
import { registerClient, signInClient, verifyClientSignup } from '../../auth/session.ts';

export default class AccessLogic extends DCLogic {
  constructor(props){
    super(props);
    let lang=null;try{lang=localStorage.getItem('kyn-lang');}catch(e){}
    if(lang!=='ar'&&lang!=='en')lang='en';
    let pf={email:'',org:'',name:''};
    try{const p=JSON.parse(localStorage.getItem('kyn-portal-v2')||'null');
      if(p&&p.c){pf.email=(p.c.auth&&p.c.auth.email)||'';pf.org=(p.c.org&&p.c.org.name)||'';pf.name=(p.c.auth&&p.c.auth.name)||'';}}catch(e){}
    this.state={lang,tab:'in',role:'client',email:pf.email,pw:'',pwShow:false,org:pf.org,name:pf.name,otp:'',otpAsked:false,errKey:'',busy:false,wipe:null};
    this.seed();
  }
  cd(d7){const w=[8,7,6,5,4,3,2];let s=0;for(let i=0;i<7;i++)s+=w[i]*(+d7[i]||0);const r=(11-(s%11))%11;return r===10?'X':String(r);}
  loadAcc(){try{const a=JSON.parse(localStorage.getItem('kyn-accounts-v1')||'null');if(a&&a.v===1)return a;}catch(e){}return {v:1,clients:[],talents:[]};}
  saveAcc(a){try{localStorage.setItem('kyn-accounts-v1',JSON.stringify(a));}catch(e){}}
  seed(){const a=this.loadAcc();
    const ex=a.talents.find(t=>t.email==='talent@demo.kayan');
    if(ex){ if((ex.tier||0)<3)ex.tier=3; }
    else a.talents.push({id:'KY-T-26-00088-'+this.cd('2600088'),name:'سلمى أحمد العمودي',email:'talent@demo.kayan',pw:'kayan2026',tier:3,spec:'تصميم الهوية البصرية',at:new Date().toISOString()});
    this.saveAcc(a);}
  session(role,acc){try{localStorage.setItem('kyn-auth-v1',JSON.stringify({v:1,role,id:acc.id,name:acc.name,org:acc.org||'',email:acc.email,tier:acc.tier||0,at:new Date().toISOString()}));}catch(e){}}
  depart(role){const ar=this.state.lang==='ar';
    const url=role==='client'?'Kayan Space - Client.dc.html':'Kayan Space - Talent.dc.html';
    const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce){this.props.navigate(this.props.routeForHref(url));return;}
    this.setState({wipe:{t:role==='client'?(ar?'تفتح لوحة مشروعك…':'Opening your project board…'):(ar?'تفتح مساحتك…':'Opening your space…'),s:role==='client'?'CLIENT SPACE':'TALENT SPACE'}});
    setTimeout(()=>{this.props.navigate(this.props.routeForHref(url));},560);
    clearTimeout(this._wipeKill);
    this._wipeKill=setTimeout(()=>this.setState({wipe:null}),1600);}
  componentDidMount(){
    this._onShow=()=>this.setState({wipe:null});
    window.addEventListener('pageshow',this._onShow);}
  componentWillUnmount(){
    window.removeEventListener('pageshow',this._onShow);
    clearTimeout(this._wipeKill);}
  async signIn(){const {role,email,pw}=this.state;const e=email.trim().toLowerCase();
    if(!e||!pw){this.setState({errKey:'both'});return;}
    if(role==='client'){
      this.setState({busy:true,errKey:''});
      try{await signInClient(e,pw);this.setState({busy:false});this.depart('client');}
      catch(error){this.setState({busy:false,errKey:'noClient'});}
      return;
    }
    const a=this.loadAcc();
    let t=a.talents.find(x=>x.email.toLowerCase()===e&&x.pw===pw);
    if(!t){try{const ap=JSON.parse(localStorage.getItem('kayan-apply-v1')||'null');
      if(ap&&ap.submitted&&ap.acc&&(ap.acc.email||'').toLowerCase()===e&&ap.acc.pw===pw){t={id:ap.appId,name:ap.acc.name||ap.idn&&ap.idn.legal||'كفاءة مسجلة',email:e,pw,tier:1};a.talents.push({...t,at:new Date().toISOString()});this.saveAcc(a);}}catch(err){}}
    if(!t){this.setState({errKey:'noTalent'});return;}
    this.session('talent',t);this.depart('talent');}
  async signUpClient(){const {org,name,email,pw,otpAsked,otp}=this.state;
    if(!org.trim()||!name.trim()||!email.trim()||pw.length<8){this.setState({errKey:'fields'});return;}
    const e=email.trim().toLowerCase();this.setState({busy:true,errKey:''});
    try{
      if(!otpAsked){await registerClient(e,pw,name.trim(),org.trim());this.setState({otpAsked:true,busy:false});return;}
      await verifyClientSignup(e,otp.replace(/\s/g,''));this.setState({busy:false});this.depart('client');
    }catch(error){this.setState({busy:false,errKey:otpAsked?'otp':'exists'});}}
  pwScore(){const p=this.state.pw;let s=0;if(p.length>=8)s++;if(/[A-Za-z]/.test(p)&&/\d/.test(p))s++;if(p.length>=12||/[^A-Za-z0-9]/.test(p))s++;return s;}
  renderVals(){
    const st=this.state,{tab,role}=st,ar=st.lang==='ar',t=(a,e)=>ar?a:e;
    let sess=null;try{sess=JSON.parse(localStorage.getItem('kyn-auth-v1')||'null');}catch(e){}
    if(sess&&sess.v!==1)sess=null;
    const on={bg:'#FAF6EC',fg:'#052E2B',sh:'0 6px 14px -8px rgba(5,46,43,.4)'},off={bg:'transparent',fg:'#7A8B85',sh:'none'};
    const sc=this.pwScore(),bars=['#E0D6BD','#E0D6BD','#E0D6BD'];for(let i=0;i<sc;i++)bars[i]=sc===1?'#C96B4A':sc===2?'#C9A227':'#0E6E66';
    const errs={
      both:t('يدخل البريد وكلمة المرور معًا.','Enter both email and password.'),
      noClient:t('تعذر الدخول: البيانات غير مطابقة لحساب عميل. يعاد التحقق من البريد وكلمة المرور.','Sign-in failed: no client account matches. Check the email and password.'),
      noTalent:t('تعذر الدخول: البيانات غير مطابقة لحساب كفاءة. من سجل عبر محطة التسجيل يدخل ببريد محطة الحساب وكلمتها.','Sign-in failed: no talent account matches. If you registered via the application, use the email and password from its Account station.'),
      fields:t('تستكمل الحقول كلها، وكلمة المرور ثمانية أحرف فأكثر.','Complete every field; password must be 8+ characters.'),
      otp:t('الرمز غير مطابق. في نموذج العرض الرمز 2026.','Code mismatch. In this working model the code is 2026.'),
      exists:t('يوجد حساب بهذا البريد. يدخل من تبويب الدخول.','An account exists for this email. Use the Sign in tab.')
    };
    const setLang=l=>{try{localStorage.setItem('kyn-lang',l);}catch(e){}this.setState({lang:l});};
    return {
      dirVal:ar?'rtl':'ltr',
      toAr:()=>setLang('ar'),toEn:()=>setLang('en'),
      arBg:ar?'#C9A227':'transparent',arFg:ar?'#052E2B':'#8F7218',
      enBg:!ar?'#C9A227':'transparent',enFg:!ar?'#052E2B':'#8F7218',
      tPortal:t('البوابة','Portal'),tJourney:t('رحلة التكليف','The journey'),
      heroPre:t('باب واحد، ','One door, '),heroBold:t('ومفتاحان.','two keys.'),
      heroBody:t('يدخل العميل إلى لوحة مشروعه، وتدخل الكفاءة إلى مساحة عملها. تحفظ الجلسة على هذا الجهاز، وتقفل بخروجك.','Clients enter their project board; talent enters its workspace. The session is kept on this device and closed when you sign out.'),
      roleCards:[
        {i:'C',bg:'#0A2434',fg:'#7CC0F4',t:t('العملاء','Clients'),x:t('يتابع النطاق وحساب الضمان والتسليمات، ويوقع محضر الاستلام من لوحته.','Track scope, escrow and deliverables; sign acceptance records from the board.'),link:''},
        {i:'T',bg:'#052E2B',fg:'#E9C96B',t:t('الكفاءات','Talent'),x:t('تدير تكليفاتها ومستحقاتها وسلم ثقتها، وتفتح غرف فرقها عند قيام التكليف.','Manage engagements, dues and the trust ladder; open pod rooms while work is live.'),link:''},
        {i:'P',bg:'#1D1433',fg:'#B9A8E8',t:t('غرفة الفريق','Pod Room'),x:t('تفتح بحساب الكفاءة ورقم الفريق أو رقم التكليف —','Opens with a talent account plus the pod or job number —'),link:t('من هنا','enter here')}
      ],
      demoTitle:t('نموذج العرض','working model'),
      demoNote:t('تستبدل هذه المفاتيح عند الربط بالخادم؛ رمز التحقق في نموذج العرض','These keys are replaced at server wiring; the demo verification code is'),
      hasSession:!!sess,sessLead:t('جلسة قائمة:','Active session:'),sessName:sess?sess.name:'',
      sessRole:sess?(sess.role==='client'?t('لوحة العميل','Client Space'):t('مساحة الكفاءة','Talent Space')):'',
      sessGo:t('إلى لوحتي ←','My space →'),sessBye:t('خروج','Sign out'),
      goSpace:()=>{if(sess)this.depart(sess.role);},
      sessOut:()=>{try{localStorage.removeItem('kyn-auth-v1');}catch(e){}this.forceUpdate();},
      tabIn:()=>this.setState({tab:'in',errKey:'',otpAsked:false}),tabUp:()=>this.setState({tab:'up',errKey:'',otpAsked:false}),
      tabInBg:tab==='in'?on.bg:off.bg,tabInFg:tab==='in'?on.fg:off.fg,tabInSh:tab==='in'?on.sh:off.sh,
      tabUpBg:tab==='up'?on.bg:off.bg,tabUpFg:tab==='up'?on.fg:off.fg,tabUpSh:tab==='up'?on.sh:off.sh,
      tSignIn:t('الدخول','Sign in'),tSignUp:t('حساب جديد','New account'),
      roleClient:()=>this.setState({role:'client',errKey:''}),roleTalent:()=>this.setState({role:'talent',errKey:''}),
      roleCBg:role==='client'?'#0A2434':'transparent',roleCFg:role==='client'?'#7CC0F4':'#4A6B64',
      roleTBg:role==='talent'?'#052E2B':'transparent',roleTFg:role==='talent'?'#E9C96B':'#4A6B64',
      tClient:t('عميل','Client'),tTalent:t('كفاءة','Talent'),
      showIn:tab==='in',showUpClient:tab==='up'&&role==='client',showUpTalent:tab==='up'&&role==='talent',
      lEmail:t('البريد الإلكتروني','Email'),lPw:t('كلمة المرور','Password'),
      email:st.email,setEmail:e=>this.setState({email:e.target.value,errKey:''}),
      pw:st.pw,setPw:e=>this.setState({pw:e.target.value,errKey:''}),
      pwKey:e=>{if(e.key==='Enter')this.signIn();},
      pwType:st.pwShow?'text':'password',pwEye:st.pwShow?t('إخفاء','Hide'):t('إظهار','Show'),
      pwEyeAria:t('إظهار كلمة المرور','Show password'),togglePw:()=>this.setState({pwShow:!st.pwShow}),
      org:st.org,setOrg:e=>this.setState({org:e.target.value,errKey:''}),
      name:st.name,setName:e=>this.setState({name:e.target.value,errKey:''}),
      otp:st.otp,setOtp:e=>this.setState({otp:e.target.value,errKey:''}),otpAsked:st.otpAsked,
      err:st.errKey?errs[st.errKey]:'',
      inCta:role==='client'?t('دخول العميل ←','Client sign-in →'):t('دخول الكفاءة ←','Talent sign-in →'),
      forgotLine:t('نسيت كلمة المرور؟ يرسل رابط الاستعادة إلى بريدك —','Forgot the password? A recovery link is sent to your email —'),
      forgotTail:t('تفعل عند الربط بالخادم.','enabled at server wiring.'),
      upNote1:t('يفتح الحساب باسم من يملك','The account opens in the name of whoever holds'),
      upNoteB:t('صفة التوقيع','signing authority'),
      upNote2:t('؛ فبه يوقع النطاق ومحضر الاستلام.','; they sign the scope and the acceptance records.'),
      lOrg:t('اسم الجهة','Organization'),phOrg:t('مؤسسة الميناء للتجارة','Port Trading Est.'),
      lName:t('اسم صاحب صفة التوقيع','Signing authority — full name'),phName:t('الاسم الرباعي','Full legal name'),
      phPw:t('ثمانية أحرف فأكثر','8+ characters'),
      lOtp:t('رمز التحقق المرسل إلى بريدك','Verification code sent to your email'),
      pwBar1:bars[0],pwBar2:bars[1],pwBar3:bars[2],
      pwHint:sc===0?t('ثمانية أحرف فأكثر','8+ characters'):sc===1?t('ضعيفة — تضاف أرقام وحروف','Weak — add letters and digits'):sc===2?t('مقبولة','Acceptable'):t('قوية','Strong'),
      upClientCta:st.otpAsked?t('تأكيد الرمز وفتح الحساب','Confirm code and open the account'):t('إرسال رمز التحقق','Send verification code'),
      legalPre:t('بإنشاء الحساب تقر بقراءة','By opening the account you confirm reading the'),
      legalWord:t('الأحكام','Terms'),
      legalPost:t('. لا يبدأ عمل قبل نطاق موقع وضمان ممول.','. No work starts before a signed scope and a funded escrow.'),
      talTitle:t('حساب الكفاءة يبنى بالتحقق، لا بالنموذج.','A talent account is built by verification, not by a form.'),
      talBody:t('يفتح ملفك عبر محطة التسجيل: هوية، تخصص، إثباتات، جهتا تزكية. عند الإرسال يصدر رقمك','Your file opens through the application stations: identity, specialty, proofs, two referees. On submission your ID is issued'),
      talBody2:t(' ويصبح بريدك وكلمة مرورك مفتاح الدخول هنا.',' and your email + password become your key here.'),
      talCta:t('ابدأ التسجيل — ١٤ محطة','Start the application — 14 stations'),
      talBack:t('سجلت من قبل؟ ادخل من تبويب','Already applied? Use the'),
      talBack2:t(' ببريدك وكلمة مرور محطة الحساب.',' tab with your Account-station email and password.'),
      privLine:t('تحفظ الجلسة على هذا الجهاز فقط. تحذف صور الوثائق بعد التحقق ويحتفظ بالبصمة الرقمية —','The session lives on this device only. Document images are deleted after verification; only the digital fingerprint is kept —'),
      privLink:t('سياسة البيانات','Data policy'),
      footTag:t('خلف كل نجاح، كيان.','Behind every success, a Kayan.'),
      wipeOn:!!st.wipe,wipeText:st.wipe?st.wipe.t:'',wipeSub:st.wipe?st.wipe.s:'',
      doSignIn:()=>this.signIn(),doSignUpClient:()=>this.signUpClient(),
    };
  }
}
