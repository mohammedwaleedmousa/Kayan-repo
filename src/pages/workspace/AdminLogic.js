import React from 'react';
import DCLogic from '../../home/DCLogic.js';
import { getStaffSession, hasCapability, signInStaff, signOut } from '../../auth/session.ts';
import { convertClientFile, listClientFiles } from '../../services/clientEngagements.ts';

export default class AdminLogic extends DCLogic {
  state = { signedIn: false, role: 'auditor', view: 'overview', selT: 0, selC: 0, selE: 0, selP: 0, toast: '', clientFiles: [], email: '', password: '', busy: false };
  toastTimer = null;
  alive = false;
  componentDidMount() { this.alive = true; void this.restoreSession(); }
  componentWillUnmount() { this.alive = false; clearTimeout(this.toastTimer); }
  async restoreSession() {
    try {
      const session = await getStaffSession();
      if (!this.alive || !session) return;
      this.setState({ signedIn: true, role: session.staff.role, adminName: session.user.display_name }, () => void this.loadClientFiles());
    } catch (error) { this.say(error.message || 'تعذر تحميل جلسة الإدارة.'); }
  }
  async loadClientFiles() {
    try { const clientFiles = await listClientFiles(); if (this.alive) this.setState({ clientFiles, selC: 0 }); }
    catch (error) { this.say(error.message || 'تعذر تحميل ملفات العملاء.'); }
  }
  async enter() {
    if (this.state.busy) return;
    this.setState({ busy: true });
    try {
      const session = await signInStaff(this.state.email.trim(), this.state.password);
      if (this.alive) this.setState({ signedIn: true, role: session.staff.role, adminName: session.user.display_name, password: '', busy: false }, () => void this.loadClientFiles());
    } catch (error) { if (this.alive) this.setState({ busy: false }, () => this.say(error.message || 'تعذر تسجيل الدخول.')); }
  }
  async logout() { await signOut(); if (this.alive) this.setState({ signedIn: false, role: 'auditor', clientFiles: [] }); }
  async actConvert(clientFile) {
    if (!clientFile || !hasCapability(this.state.role, 5) || this.state.busy) return;
    this.setState({ busy: true });
    try {
      const result = await convertClientFile(clientFile.id);
      await this.loadClientFiles();
      if (this.alive) this.setState({ busy: false }, () => this.say(`حُول الملف إلى الارتباط ${result.engagement_code}.`));
    } catch (error) { if (this.alive) this.setState({ busy: false }, () => this.say(error.message || 'تعذر تحويل الملف.')); }
  }
  say(msg) {
    clearTimeout(this.toastTimer);
    this.setState({ toast: msg });
    this.toastTimer = setTimeout(() => this.setState({ toast: '' }), 2800);
  }
  renderVals() {
    const S = this.state;
    const signedIn = S.signedIn;
    const role = S.role;
    const view = S.view;
    const roles = [
      { k: 'sys', label: 'مدير النظام' },
      { k: 'registrar', label: 'أمين السجل' },
      { k: 'clientdesk', label: 'مكتب العملاء' },
      { k: 'escrow', label: 'أمين الضمان' },
      { k: 'delivery', label: 'مشرف التسليم' },
      { k: 'compliance', label: 'لجنة الالتزام' },
      { k: 'people', label: 'مكتب الناس' },
      { k: 'editor', label: 'محرر المحتوى' },
      { k: 'auditor', label: 'مدقق قراءة' }
    ];
    const CAPS = [
      { label: 'قراءة لوحات التشغيل', allow: ['sys','registrar','clientdesk','escrow','delivery','compliance','people','editor','auditor'] },
      { label: 'مراجعة طلبات المواهب', allow: ['sys','registrar','compliance'] },
      { label: 'قبول طلب وإصدار رقم', allow: ['sys','registrar'] },
      { label: 'رفض بقرار مسبب / تظلمات', allow: ['sys','compliance'] },
      { label: 'مراجعة ملفات العملاء', allow: ['sys','clientdesk'] },
      { label: 'تحويل ملف إلى ارتباط', allow: ['sys','clientdesk'] },
      { label: 'صرف من حساب الضمان', allow: ['sys','escrow'] },
      { label: 'اعتماد بوابات الجودة', allow: ['sys','delivery'] },
      { label: 'الرد باسم السجل', allow: ['sys','people'] },
      { label: 'نشر المحتوى', allow: ['sys','editor'] },
      { label: 'إدارة الحسابات والأدوار', allow: ['sys'] },
      { label: 'تعديل الإعدادات', allow: ['sys'] }
    ];
    const can = (i) => CAPS[i].allow.includes(role);
    const canDecide = can(2), canReject = can(3), canConvert = can(5), canRelease = can(6), canGate = can(7), canReply = can(8), canPublish = can(9), canUsers = can(10), canSettings = can(11);
    const nav = (key, label, badge) => ({
      label, badge: badge || false,
      bg: view === key ? 'rgba(201,162,39,.16)' : 'transparent',
      fg: view === key ? '#E9C96B' : 'rgba(250,246,236,.72)',
      go: () => this.setState({ view: key })
    });
    const titles = {
      overview: { t: 'مكتب السجل', c: 'ADMIN / OVERVIEW' },
      talent: { t: 'سجل المواهب', c: 'ADMIN / TALENT REGISTRY' },
      clients: { t: 'ملفات العملاء', c: 'ADMIN / CLIENT FILES' },
      escrow: { t: 'الضمان والارتباطات', c: 'ADMIN / ESCROW LEDGER' },
      pods: { t: 'الفرق والبوابات', c: 'ADMIN / PODS AND GATES' },
      people: { t: 'الناس والرسائل', c: 'ADMIN / PEOPLE DESK' },
      content: { t: 'المحتوى', c: 'ADMIN / CONTENT' },
      users: { t: 'الحسابات والأدوار', c: 'ADMIN / USERS AND ROLES' },
      audit: { t: 'سجل التدقيق', c: 'ADMIN / AUDIT LOG' },
      settings: { t: 'الإعدادات', c: 'ADMIN / SETTINGS' }
    };
    const chipGold = { cbg: 'rgba(201,162,39,.14)', cfg: '#8F7218' };
    const chipMint = { cbg: 'rgba(14,110,102,.1)', cfg: '#0E6E66' };
    const chipWarn = { cbg: 'rgba(201,107,74,.12)', cfg: '#A9532F' };
    const rowSel = { bd: '#C9A227', bg: '#FFFDF4' };
    const rowDef = { bd: '#E3D9C2', bg: '#F4EEDD' };
    const tData = [
      { id: 'KY-T-26-00219-4', name: 'أروى باوزير', spec: 'تصميم واجهات · DES-UIX-014', st: '14/14', chip: 'جاهز للقرار', ...chipGold, meta: 'عدن · AR C2 · EN B2 · مرجعان', axes: [ {n:'الهوية', w:'100%', v:'موثقة'}, {n:'التخصص', w:'82%', v:'اختبار 82/100'}, {n:'اللغة', w:'75%', v:'AR C2 · EN B2'}, {n:'المراجع', w:'100%', v:'وردت 2/2'}, {n:'السلوك', w:'90%', v:'إقرار موقع'} ] },
      { id: 'KY-T-26-00224-9', name: 'همام السقاف', spec: 'تطوير ويب · DEV-WEB-003', st: '14/14', chip: 'جاهز للقرار', ...chipGold, meta: 'المكلا · AR C2 · EN B1 · مرجعان', axes: [ {n:'الهوية', w:'100%', v:'موثقة'}, {n:'التخصص', w:'88%', v:'اختبار 88/100'}, {n:'اللغة', w:'62%', v:'AR C2 · EN B1'}, {n:'المراجع', w:'100%', v:'وردت 2/2'}, {n:'السلوك', w:'90%', v:'إقرار موقع'} ] },
      { id: 'KY-T-26-00231-2', name: 'سماح الحوثري', spec: 'محاسبة · FIN-ACC-021', st: '12/14', chip: 'نواقص', ...chipWarn, meta: 'تعز · وثيقتان ناقصتان', axes: [ {n:'الهوية', w:'100%', v:'موثقة'}, {n:'التخصص', w:'70%', v:'بانتظار الاختبار'}, {n:'اللغة', w:'75%', v:'AR C2 · EN B2'}, {n:'المراجع', w:'50%', v:'وردت 1/2'}, {n:'السلوك', w:'0%', v:'لم يوقع'} ] },
      { id: 'KY-T-26-00236-0', name: 'مازن العبسي', spec: 'مونتاج فيديو · MED-VID-007', st: '13/14', chip: 'قيد التحقق', ...chipMint, meta: 'عدن · فحص الهوية جار', axes: [ {n:'الهوية', w:'60%', v:'قيد الفحص'}, {n:'التخصص', w:'79%', v:'اختبار 79/100'}, {n:'اللغة', w:'62%', v:'AR C2 · EN B1'}, {n:'المراجع', w:'100%', v:'وردت 2/2'}, {n:'السلوك', w:'90%', v:'إقرار موقع'} ] },
      { id: 'KY-T-26-00240-7', name: 'ريم باشراحيل', spec: 'ترجمة قانونية · LNG-TRL-005', st: '14/14', chip: 'جاهز للقرار', ...chipGold, meta: 'عدن · AR C2 · EN C1 · ثلاثة مراجع', axes: [ {n:'الهوية', w:'100%', v:'موثقة'}, {n:'التخصص', w:'91%', v:'اختبار 91/100'}, {n:'اللغة', w:'95%', v:'AR C2 · EN C1'}, {n:'المراجع', w:'100%', v:'وردت 3/3'}, {n:'السلوك', w:'90%', v:'إقرار موقع'} ] },
      { id: 'KY-T-26-00243-1', name: 'باسل شمسان', spec: 'تسويق أداء · MKT-PRF-011', st: '9/14', chip: 'قيد التحقق', ...chipMint, meta: 'صنعاء · المحطة العاشرة جارية', axes: [ {n:'الهوية', w:'100%', v:'موثقة'}, {n:'التخصص', w:'40%', v:'لم يختبر'}, {n:'اللغة', w:'75%', v:'AR C2 · EN B2'}, {n:'المراجع', w:'0%', v:'لم تطلب'}, {n:'السلوك', w:'0%', v:'لم يوقع'} ] }
    ];
    const tRows = tData.map((t, i) => ({ ...t, ...(i === (S.selT) ? rowSel : rowDef), open: () => this.setState({ selT: i }) }));
    const selT = tData[S.selT] || tData[0];
    const cData = S.clientFiles.map((file) => ({
      ...file, id: file.file_code, dbId: file.id, org: file.organisation_name, line: file.line,
      budget: file.budget_cents == null ? '—' : new Intl.NumberFormat('en', { style: 'currency', currency: file.currency }).format(file.budget_cents / 100),
      chip: file.status === 'converted' ? 'تم التحويل' : 'بانتظار التحويل', ...(file.status === 'converted' ? chipMint : chipGold),
      mail: file.contact_email || '—', scope: typeof file.scope?.summary === 'string' ? file.scope.summary : file.title,
    }));
    const cRows = cData.map((c, i) => ({ ...c, ...(i === S.selC ? rowSel : rowDef), open: () => this.setState({ selC: i }) }));
    const selC = cData[S.selC] || { id: '—', org: '—', line: '—', scope: '—', mail: '—' };
    const eData = [
      { job: 'KY-J-26-00417', org: 'مؤسسة الميناء للتجارة', pod: 'POD-26-041', held: '$2,400', rel: '$600', stage: 'التنفيذ 3/5', bal: '$2,400', ledger: [ {t:'إيداع ضمان النطاق', at:'02 AUG', amt:'+$3,000', c:'#7CE0B8'}, {t:'صرف البند D-01 بمحضر موقع', at:'11 AUG', amt:'−$600', c:'#F0B9A0'} ] },
      { job: 'KY-J-26-00421', org: 'شركة بحر العرب للملاحة', pod: 'POD-26-044', held: '$7,200', rel: '$0', stage: 'التجهيز 2/5', bal: '$7,200', ledger: [ {t:'إيداع ضمان النطاق', at:'09 AUG', amt:'+$7,200', c:'#7CE0B8'} ] },
      { job: 'KY-J-26-00409', org: 'مستشفى الأمل — عدن', pod: 'POD-26-038', held: '$0', rel: '$1,200', stage: 'ضمانة إلى 02 SEP', bal: '$0', ledger: [ {t:'إيداع ضمان النطاق', at:'12 JUL', amt:'+$1,200', c:'#7CE0B8'}, {t:'صرف كامل بمحضر ختامي', at:'03 AUG', amt:'−$1,200', c:'#F0B9A0'} ] },
      { job: 'KY-J-26-00415', org: 'مطاعم لذة عدن', pod: 'POD-26-040', held: '$650', rel: '$0', stage: 'المراجعة 4/5', bal: '$650', ledger: [ {t:'إيداع ضمان النطاق', at:'28 JUL', amt:'+$650', c:'#7CE0B8'} ] }
    ];
    const eRows = eData.map((e, i) => ({ ...e, ...(i === S.selE ? rowSel : rowDef), open: () => this.setState({ selE: i }) }));
    const selE = eData[S.selE] || eData[0];
    const pData = [
      { code: 'POD-26-041', job: 'KY-J-26-00417', gate: 'G4', gi: 4, checks: '5/5', req: 'بانتظار الاعتماد', reqc: '#8F7218', lead: 'سلمى العمودي' },
      { code: 'POD-26-044', job: 'KY-J-26-00421', gate: 'G2', gi: 2, checks: '3/5', req: 'لا طلب — الفحوص ناقصة', reqc: '#4A6B64', lead: 'أمجد نعمان' },
      { code: 'POD-26-040', job: 'KY-J-26-00415', gate: 'G7', gi: 7, checks: '5/5', req: 'بانتظار الاعتماد', reqc: '#8F7218', lead: 'ريم باشراحيل' },
      { code: 'POD-26-038', job: 'KY-J-26-00409', gate: 'G9', gi: 9, checks: '5/5', req: 'مقفل — ضمانة سارية', reqc: '#0E6E66', lead: 'مازن العبسي' }
    ];
    const pRows = pData.map((p, i) => ({ ...p, ...(i === S.selP ? rowSel : rowDef), open: () => this.setState({ selP: i }) }));
    const selP = pData[S.selP] || pData[0];
    const selPgates = Array.from({ length: 10 }, (_, i) => ({
      n: 'G' + i,
      bar: i < selP.gi ? '#7CE0B8' : i === selP.gi ? 'linear-gradient(90deg,#C9A227,#E9C96B)' : 'rgba(250,246,236,.14)',
      fg: i === selP.gi ? '#E9C96B' : 'rgba(250,246,236,.5)'
    }));
    const jobApps = [
      { id: 'APP-26-0192', name: 'همام السقاف', pos: 'POS-03 منسق مجتمع', due: 'يستحق 17 AUG', duec: '#A9532F' },
      { id: 'APP-26-0195', name: 'نور الدين قاسم', pos: 'POS-01 مهندس تسليم', due: 'يستحق 19 AUG', duec: '#8F7218' },
      { id: 'APP-26-0197', name: 'أسماء العطاس', pos: 'POS-02 منتج محتوى', due: 'يستحق 20 AUG', duec: '#8F7218' },
      { id: 'APP-26-0201', name: 'وليد المفلحي', pos: 'ترشح عام', due: 'أجيب ✓', duec: '#0E6E66' }
    ];
    const inbox = [
      { id: 'REG-26-0455', door: 'باب العملاء', sub: 'استفسار عن نطاق متجر', due: 'خلال 48 ساعة', duec: '#A9532F', bd: '#C9A227', bg: '#FFFDF4' },
      { id: 'REG-26-0456', door: 'باب المواهب', sub: 'تصحيح بيانات تخصص', due: 'خلال 3 أيام', duec: '#8F7218', ...rowDef },
      { id: 'REG-26-0452', door: 'باب الشركاء', sub: 'رعاية دفعة الصقل', due: 'أجيب ✓', duec: '#0E6E66', ...rowDef },
      { id: 'REG-26-0449', door: 'باب الصحافة', sub: 'طلب مقابلة', due: 'أجيب ✓', duec: '#0E6E66', ...rowDef }
    ];
    const rpRows = [
      { code: 'RP-F-002', name: 'قائمة رقمية للمطاعم', price: '$650', st: 'منشور', ...chipMint },
      { code: 'RP-F-009', name: 'نظام حجز مواعيد', price: '$1,200', st: 'منشور', ...chipMint },
      { code: 'RP-F-012', name: 'متجر إلكتروني جاهز', price: '$900', st: 'منشور', ...chipMint },
      { code: 'RP-R-021', name: 'بوابة تتبع شحنات', price: '$3k–5k', st: 'مسودة', ...chipGold }
    ];
    const admins = [
      { name: 'م. عبدالرحمن باصرة', role: 'مدير النظام', tfa: 'مفعل', tfac: '#0E6E66', last: 'TODAY 09:12' },
      { name: 'سعاد العولقي', role: 'أمين السجل', tfa: 'مفعل', tfac: '#0E6E66', last: 'TODAY 08:47' },
      { name: 'خالد بن بريك', role: 'أمين الضمان', tfa: 'مفعل', tfac: '#0E6E66', last: '13 AUG 16:03' },
      { name: 'هالة مقبل', role: 'مكتب الناس', tfa: 'مفعل', tfac: '#0E6E66', last: 'TODAY 10:21' },
      { name: 'مراجع خارجي', role: 'مدقق قراءة', tfa: 'مفعل', tfac: '#0E6E66', last: '07 AUG 11:00' }
    ];
    const matrix = CAPS.map((cap) => ({
      label: cap.label,
      cells: roles.map((r) => cap.allow.includes(r.k) ? { t: '✓', c: '#8F7218' } : { t: '—', c: '#C9BFA6' })
    }));
    const audit = [
      { at: '14 AUG 12:41', actor: 'registrar·s.awlaqi', t: 'قُبل طلب وأصدر الرقم KY-T-26-00219-4', obj: 'talent_applications', h: '9f2c…→b7a1' },
      { at: '14 AUG 11:58', actor: 'escrow·k.binbreik', t: 'صُرف $600 مقابل البند D-01 — KY-J-26-00417', obj: 'escrow_ledger', h: 'b7a1…→e33d' },
      { at: '14 AUG 11:12', actor: 'delivery·admin', t: 'اعتمد العبور إلى G4 — POD-26-041', obj: 'gate_requests', h: 'e33d…→17c9' },
      { at: '14 AUG 10:05', actor: 'people·h.maqbel', t: 'أجيبت الرسالة REG-26-0452 وختمت بالرقم', obj: 'contact_messages', h: '17c9…→a04f' },
      { at: '13 AUG 17:22', actor: 'sys·a.basurrah', t: 'عُدل دور حساب: هالة مقبل ← مكتب الناس', obj: 'admin_users', h: 'a04f…→5d2b' },
      { at: '13 AUG 16:03', actor: 'auth·gateway', t: 'دخول موفق بتوثيق ثنائي — خالد بن بريك', obj: 'sessions', h: '5d2b…→c881' },
      { at: '13 AUG 14:47', actor: 'compliance·cmte', t: 'رُفض طلب بقرار مسبب وبلغ كتابة — KY-T-26-00208-6', obj: 'talent_applications', h: 'c881…→f16a' },
      { at: '13 AUG 09:30', actor: 'system·backup', t: 'اكتملت النسخة الاحتياطية اليومية واختبر الاسترجاع', obj: 'backups', h: 'f16a…→90ee' }
    ];
    const auditFilters = [
      { t: 'الكل', bg: '#052E2B', fg: '#E9C96B', bd: '#052E2B' },
      { t: 'الضمان', bg: '#FAF6EC', fg: '#33544D', bd: '#E0D6BD' },
      { t: 'السجل', bg: '#FAF6EC', fg: '#33544D', bd: '#E0D6BD' },
      { t: 'البوابات', bg: '#FAF6EC', fg: '#33544D', bd: '#E0D6BD' },
      { t: 'الدخول والحسابات', bg: '#FAF6EC', fg: '#33544D', bd: '#E0D6BD' }
    ];
    const settingCards = [
      { code: 'SLA', title: 'مهل الرد', rows: [ {k:'باب العملاء', v:'3 أيام عمل'}, {k:'باب المواهب', v:'5 أيام عمل'}, {k:'الترشحات', v:'أسبوع واحد'} ] },
      { code: 'AUTH', title: 'الدخول والأمان', rows: [ {k:'صلاحية رمز OTP', v:'10 دقائق'}, {k:'قفل المحاولات', v:'5 / 15 دقيقة'}, {k:'جلسة الإدارة', v:'8 ساعات'}, {k:'التوثيق الثنائي', v:'إلزامي'} ] },
      { code: 'PAYOUT', title: 'قنوات الصرف', rows: [ {k:'البنوك المرخصة', v:'القناة الأولى'}, {k:'المحافظ', v:'بسقف شهري'}, {k:'النقد', v:'لا يعتمد'} ] },
      { code: 'BACKUP', title: 'النسخ الاحتياطي', rows: [ {k:'الجدولة', v:'يوميًا 02:00'}, {k:'آخر نسخة', v:'اليوم ✓'}, {k:'آخر استرجاع مجرب', v:'07 AUG'} ] },
      { code: 'FLAGS', title: 'أعلام الميزات', rows: [ {k:'الأطلس الحي', v:'يعمل'}, {k:'الرحلة ثلاثية الأبعاد', v:'تعمل'}, {k:'وضع الصيانة', v:'مطفأ'} ] },
      { code: 'LOCALE', title: 'اللغة والتوقيت', rows: [ {k:'لغة المصدر', v:'العربية'}, {k:'السطر الثاني', v:'English'}, {k:'التوقيت', v:'Asia/Aden'} ] }
    ];
    const kpis = [
      { code: 'APPLICATIONS', v: '14', label: 'طلبات قيد المراجعة', d: 'أقدمها منذ 3 أيام' },
      { code: 'CLIENT FILES', v: '6', label: 'ملفات نطاق مفتوحة', d: 'منها 2 بانتظار الإيداع' },
      { code: 'ESCROW HELD', v: '$10,250', label: 'أرصدة محتجزة', d: 'عبر 4 ارتباطات قائمة' },
      { code: 'GATES', v: '2', label: 'طلبات اعتماد بوابات', d: 'G4 و G7' },
      { code: 'SLA', v: '2', label: 'رسائل قرب الاستحقاق', d: 'أقربها خلال 48 ساعة' },
      { code: 'WARRANTY', v: '1', label: 'ضمانة سارية', d: 'تنقضي 02 SEP' }
    ];
    const qDefs = [
      { label: 'طلبات مواهب جاهزة للقرار', n: '3', v: 'talent', cap: 2 },
      { label: 'ملفات عملاء بانتظار التحويل', n: '2', v: 'clients', cap: 5 },
      { label: 'أوامر صرف مستوفاة الشروط', n: '1', v: 'escrow', cap: 6 },
      { label: 'بوابات بانتظار الاعتماد', n: '2', v: 'pods', cap: 7 },
      { label: 'رسائل تستحق الرد', n: '2', v: 'people', cap: 8 }
    ];
    const queues = qDefs.map((q) => {
      const act = can(q.cap);
      return { label: q.label, n: q.n, go: () => this.setState({ view: q.v }),
        bg: act ? '#F4EEDD' : '#EDE5D2', fg: act ? '#052E2B' : '#7A8B85',
        tag: act ? 'يخصك ←' : 'قراءة فقط', tagc: act ? '#8F7218' : '#9AA8A2' };
    });
    const capsChips = CAPS.map((c, i) => ({ c, i })).filter((x) => x.i > 0 && x.c.allow.includes(role)).map((x) => x.c.label);
    const capsNone = capsChips.length === 0;
    const ladder = [
      { id: 'KY-T-26-00088-1', name: 'سلمى العمودي', spec: 'إدارة تسليم', tier: 'T3', note: 'قائدة الفريق', noteCode: 'POD-26-041' },
      { id: 'KY-T-26-00102-7', name: 'ريم باشراحيل', spec: 'ترجمة قانونية', tier: 'T2', note: 'قائدة مرشحة — يلزم T3' },
      { id: 'KY-T-26-00117-3', name: 'مازن العبسي', spec: 'مونتاج فيديو', tier: 'T1', note: 'خامل منذ 40 يومًا' }
    ];
    const refRows = [
      { name: 'جهة التزكية الأولى — مدير سابق', st: 'وردت 11 AUG', stc: '#0E6E66', pend: false },
      { name: 'جهة التزكية الثانية — عميل موثق', st: 'بانتظار الرد', stc: '#A9532F', pend: true }
    ];
    const posRows = [
      { code: 'POS-01', title: 'مهندس تسليم', loc: 'عدن — حضوري', close: 'يغلق 28 AUG', st: 'مفتوح', ...chipMint },
      { code: 'POS-02', title: 'منتج محتوى', loc: 'عدن — حضوري', close: 'يغلق 30 AUG', st: 'مفتوح', ...chipMint },
      { code: 'POS-03', title: 'منسق مجتمع', loc: 'عدن — حضوري', close: 'أغلق 10 AUG', st: 'مغلق', ...chipWarn }
    ];
    const callRows = [
      { code: 'CALL-26-011', need: 'تطوير ويب', ref: 'DEV-WEB · KY-J-26-00421', tier: 'T2+', int: '4 مهتمون', st: 'مفتوح', ...chipMint },
      { code: 'CALL-26-012', need: 'تصميم واجهات', ref: 'DES-UIX · RP-F-012', tier: 'T1+', int: '7 مهتمون', st: 'يغلق غدًا', ...chipGold }
    ];
    const memberRows = [
      { name: 'سلمى العمودي', role: 'قائدة — T3', share: '45%' },
      { name: 'همام السقاف', role: 'تطوير — T2', share: '30%' },
      { name: 'أروى باوزير', role: 'تصميم — T2', share: '25%' }
    ];
    const canRefs = can(1), noRefs = !can(1);
    const canTier = can(2), noTier = !can(2);
    const canPodsOps = can(7), noPodsOps = !can(7);
    const canPeopleOps = can(8), noPeopleOps = !can(8);
    return {
      gateOn: !signedIn, shellOn: signedIn,
      capsChips, capsNone,
      ladder, refRows, posRows, callRows, memberRows,
      canRefs, noRefs, canTier, noTier, canPodsOps, noPodsOps, canPeopleOps, noPeopleOps,
      actRefMark: () => this.say('قيدت التزكية ووسم الملف بالاكتمال.'),
      actTierUp: () => this.say('رفعت الدرجة بقرار مسبب وقيدت في سجل التدقيق.'),
      actTierDown: () => this.say('خفضت الدرجة بقرار مسبب وبلغ صاحبها كتابة.'),
      actClosePos: () => this.say('أغلقت الوظيفة — لا تغلق قبل أسبوعين من نشرها.'),
      actK4y: () => this.say('قيدت ساعات K4Y بعد التحقق وانعكست في ملف الموهبة.'),
      actCloseCall: () => this.say('أغلق النداء وأبلغ المهتمون المطابقون.'),
      actMembers: () => this.say('عدلت العضوية — يبقى القائد بدرجة T3 أو أعلى.'),
      role, roles, setRole: () => {},
      email: S.email, password: S.password, setEmail: (e) => this.setState({ email: e.target.value }), setPassword: (e) => this.setState({ password: e.target.value }),
      enter: () => void this.enter(),
      logout: () => void this.logout(),
      adminName: S.adminName || '—',
      roleLabel: (roles.find((r) => r.k === role) || roles[0]).label,
      crumb: titles[view].c, pageTitle: titles[view].t,
      navOps: [ nav('overview','نظرة عامة'), nav('talent','سجل المواهب','14'), nav('clients','ملفات العملاء','6'), nav('escrow','الضمان والارتباطات'), nav('pods','الفرق والبوابات','2') ],
      navDesks: [ nav('people','الناس والرسائل','6'), nav('content','المحتوى') ],
      navGov: [ nav('users','الحسابات والأدوار'), nav('audit','سجل التدقيق'), nav('settings','الإعدادات') ],
      vOverview: view === 'overview', vTalent: view === 'talent', vClients: view === 'clients', vEscrow: view === 'escrow', vPods: view === 'pods', vPeople: view === 'people', vContent: view === 'content', vUsers: view === 'users', vAudit: view === 'audit', vSettings: view === 'settings',
      kpis, queues, feed: audit.slice(0, 5), goAudit: (e) => { e.preventDefault(); this.setState({ view: 'audit' }); },
      tRows, selTid: selT.id, selTname: selT.name, selTmeta: selT.meta, selTaxes: selT.axes,
      canDecide, noDecide: !canDecide, canReject, noReject: !canReject,
      cRows, selCid: selC.id, selCorg: selC.org, selCline: selC.line, selCscope: selC.scope, selCmail: selC.mail,
      canConvert, noConvert: !canConvert,
      eRows, selEjob: selE.job, selEledger: selE.ledger, selEbal: selE.bal,
      canRelease, noRelease: !canRelease,
      pRows, selPcode: selP.code, selPlead: selP.lead, selPgates, selPchecks: [ 'التسليمات مطابقة لنطاق العمل', 'اجتازت المراجعة الداخلية', 'الوثائق مرفوعة ومسماة', 'لا ملاحظة مفتوحة من العميل', 'أقر قائد الفريق بالجاهزية' ],
      canGate, noGate: !canGate,
      jobApps, inbox, canReply, noReply: !canReply,
      rpRows, canPublish, noPublish: !canPublish,
      admins, matrix, canUsers,
      audit, auditFilters,
      settingCards, canSettings, noSettings: !canSettings,
      actApprove: () => this.say('قُبل الطلب وقيد القرار في سجل التدقيق باسم أمين السجل.'),
      actReject: () => this.say('رُفض الطلب بقرار مسبب وبلغ كتابة. يفتح باب التظلم 21 يومًا.'),
      actConvert: () => void this.actConvert(S.clientFiles[S.selC]),
      actRelease: () => this.say('صُرف $600 مقابل البند D-02 وقيد باسم أمين الضمان.'),
      actGate: () => this.say('اعتمد العبور إلى G5 وقيد باسم مشرف التسليم.'),
      actReply: () => this.say('أرسل الرد مختومًا برقم القيد REG-26-0455.'),
      actPublish: () => this.say('نُشر التعديل وقيد في سجل التدقيق.'),
      actInvite: () => this.say('أرسلت دعوة بحساب وظيفي — يفعل التوثيق الثنائي قبل أول دخول.'),
      actDanger: () => this.say('منطقة الحذر تطلب توثيقًا ثنائيًا إضافيًا.'),
      toastOn: !!S.toast, toastMsg: S.toast
    };
  }
}
