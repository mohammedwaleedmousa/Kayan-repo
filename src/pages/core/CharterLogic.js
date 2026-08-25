import React from 'react';
import DCLogic from '../../home/DCLogic.js';

export default class CharterLogic extends DCLogic {
  constructor(props){
    super(props);
    this.root = React.createRef();
    let lang = null;
    try { lang = localStorage.getItem('kyn-lang'); } catch(e) {}
    if (lang !== 'ar' && lang !== 'en') lang = 'en';
    this.state = { lang };
  }
  componentDidMount(){
    const el = this.root.current; if (!el) return;
    this._initReveals();
    el.setAttribute('data-mo','');
    this._failsafe = setTimeout(()=>this._revealAll(), 2600);
  }
  componentDidUpdate(){ this._initReveals(); }
  componentWillUnmount(){ if(this._io) this._io.disconnect(); clearTimeout(this._failsafe); }
  _initReveals(){
    const el = this.root.current; if (!el) return;
    if (!('IntersectionObserver' in window)) { this._revealAll(); return; }
    if (!this._io) this._io = new IntersectionObserver((ents)=>{
      ents.forEach((en)=>{ if(en.isIntersecting){ en.target.setAttribute('data-on',''); this._io.unobserve(en.target); } });
    }, { threshold: 0.1 });
    el.querySelectorAll('[data-reveal]:not([data-on])').forEach((n)=>this._io.observe(n));
  }
  _revealAll(){
    const el = this.root.current; if (!el) return;
    el.querySelectorAll('[data-reveal]').forEach((n)=>n.setAttribute('data-on',''));
  }
  renderVals(){
    const s = this.state, ar = s.lang !== 'en', en = !ar;
    const t = (a,e)=> ar ? a : e;
    return {
      rootRef: this.root, ar, en, dirVal: ar ? 'rtl' : 'ltr',
      langBtn: ar ? 'EN' : 'ع',
      toggleLang: ()=>{ const l = ar ? 'en' : 'ar'; try{ localStorage.setItem('kyn-lang', l); }catch(e){} this.setState({lang:l}, ()=>{ this._revealAll(); }); },
      tPage: t('الميثاق','The Charter'),
      tLines: t('الخطوط','The lines'), tJourney: t('الرحلة','The journey'), tApply: t('التسجيل','Registration'), tPortal: t('البوابة','The portal'),
      tHome: t('الدار','Home'), tClients: t('للعملاء','For clients'), tTalent: t('للكفاءات','For talent'),
      heroT1: t('نص واحد يحكم','One text governs'),
      heroT2: t('كل تعامل','every engagement'),
      heroSub: t('من نحن، وما مهمتنا ورؤيتنا، وبأي المواد نحكم — جمعت في وثيقة واحدة تقرأ في دقائق، ويحتكم إليها في كل خلاف.','Who we are, our mission and vision, and the four articles we govern by — one document, read in minutes, ruling in every dispute.'),
      nextT: t('قرأت الميثاق. أين بعده؟','You have read the Charter. Where next?'),
      footLine: t('خلف كل نجاح، كيان','Behind every success, a Kayan.'),
      nextDoors: [
        { tag:'THE JOURNEY', t: t('الرحلة','The journey'), b: t('كيف يمضي التكليف من أول رسالة إلى محضر الاستلام.','How an engagement travels from first message to acceptance.'), cta: t('اتبع الرحلة ←','Follow it →'), href:'Kayan Journey.dc.html' },
        { tag:'REGISTRATION', t: t('التسجيل','Registration'), b: t('عشر محطات تقيم بها حضورك وتقيم على قدرتك دليلا.','Ten stations that put your capability on the record.'), cta: t('ابدأ التسجيل ←','Begin →'), href:'Kayan Apply.dc.html' },
        { tag:'THE PORTAL', t: t('البوابة','The portal'), b: t('حيث تدار العلاقة بعد التسجيل: ملف، وتكليفات، وسجل.','Where the relationship lives after sign-up: file, engagements, record.'), cta: t('ادخل البوابة ←','Enter →'), href:'Kayan Portal.dc.html' }
      ]
    };
  }
}