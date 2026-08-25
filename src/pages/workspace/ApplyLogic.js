import React from 'react';
import DCLogic from '../../home/DCLogic.js';

const S_AR={"x0":"التسجيل","x1":"البوابة","x2":"للكفاءات","x3":"مسح المسودة","x4":"قبل أول حقل،","x5":"ست حقائق","x6":"يقرأ كل بند ثم يؤشر عليه. التسجيل أول فعل في علاقة تقوم على الصدق من الطرفين، ولذلك يبدأ بميثاقه لا بنموذجه.","x7":"ميثاق الصدق وقواعد العلاقة","x8":"بالوصول إلى نهاية النص وتأشير الإقرار أدناه، يقيد قبولك بالميثاق قيدا مؤرخا في سجلك.","x9":"أقر بأن ما سأدونه صحيح، وأن أي تحقق يجرى على بيانات أدليت بها أنا مسؤول عنها.","x10":"سؤالا فهم — إجابتان قبل المتابعة","x11":"هل يخصص التحقق عملا لمن يجتازه؟","x12":"متى يبدأ أي عمل عبر كيان؟","x13":"ابدأ التسجيل ←","x14":"حساب واحد،","x15":"وقناة مؤكدة","x16":"يفتح الحساب بأقل قدر من البيانات، ويؤكد رقم واتساب لأنه قناة التواصل التشغيلي الأولى في عدن.","x17":"لماذا نسأل: يطلب الاسم كما تحب أن تخاطب، ويؤكد الرقم كي لا يسجل أحد باسمك، ويبقى البريد قناة احتياطا للمستندات.","x18":"الاسم المعروف به مهنيا","x19":"رقم واتساب","x20":"البريد الإلكتروني","x21":"كلمة مرور","x22":"تأكيد القناة","x23":"→ السابق","x24":"التالي ←","x25":"الهوية","x26":"تتحقق مرة واحدة","x27":"تدخل البيانات كما وردت في الوثيقة حرفيا. تحذف صور الوثائق بعد اكتمال التحقق ويحتفظ ببصمة رقمية تثبت أنه جرى.","x28":"الاسم الرباعي كما في الوثيقة","x29":"تاريخ الميلاد","x30":"الجنس كما في الوثيقة","x31":"— اختر —","x32":"ذكر","x33":"أنثى","x34":"الجنسية","x35":"المحافظة (الإقامة الحالية)","x36":"المدينة أو المديرية","x37":"بلد الإقامة","x38":"نوع الوثيقة","x39":"رقم الوثيقة","x40":"تاريخ انتهاء الوثيقة","x41":"صورة الوثيقة — الوجه الأمامي","x42":"JPG أو PNG أو PDF · حد أدنى 800 بكسل عرضا · حد أقصى 10MB · حروف الوثيقة مقروءة دون وهج.","x43":"صورة الوثيقة — الوجه الخلفي","x44":"يقبل «لا يوجد وجه خلفي» لجواز السفر — يترك الحقل عندها فارغا.","x45":"الصورة الحية — إثبات أن خلف الطلب إنسانا","x46":"التقاط","x47":"أو رفع صورة عند تعذر الكاميرا","x48":"ظروف عملك،","x49":"كما هي","x50":"المؤهل العلمي","x51":"ثانوية أو أقل","x52":"دبلوم مهني","x53":"بكالوريوس","x54":"ماجستير","x55":"دكتوراه","x56":"تعلم ذاتي موثق بالأعمال","x57":"سنوات الخبرة","x58":"أقل من سنة","x59":"1–3 سنوات","x60":"3–5 سنوات","x61":"5–10 سنوات","x62":"أكثر من 10 سنوات","x63":"وضعك الحالي","x64":"متفرغ للعمل الحر","x65":"موظف وأعمل جزئيا","x66":"طالب","x67":"باحث عن أول فرصة","x68":"صاحب منشأة صغيرة","x69":"الساعات المتاحة أسبوعيا","x70":"أقل من 10","x71":"35 فأكثر","x72":"جهاز العمل الرئيس","x73":"حاسوب محمول","x74":"حاسوب مكتبي","x75":"لوحي","x76":"هاتف فقط","x77":"لا جهاز حاليا — سأعمل من الهب","x78":"الاتصال بالإنترنت","x79":"ألياف أو DSL منزلي","x80":"شبكة جوال 4G","x81":"ستارلينك أو أقمار","x82":"مقهى أو مساحة عمل","x83":"متقطع وغير مستقر","x84":"احتياط الكهرباء","x85":"طاقة شمسية ببطارية","x86":"مولد خاص أو مشترك","x87":"بطارية UPS فقط","x88":"لا احتياط","x89":"خطتك عند الانقطاع الطويل","x90":"أعمل من هب كيان — الكورنيش","x91":"مقهى أو مساحة بديلة","x92":"منزل قريب مجهز","x93":"لا خطة بعد","x94":"ماذا تجيد؟","x95":"سمه بدقة","x96":"ابحث عن عملك — بالاسم أو الأداة أو الوصف","x97":"+ إضافة","x98":"اقترح إضافته","x99":"اقتراحات قيدت للمراجعة:","x100":"— كل بحث بلا نتيجة يحسن القائمة لمن بعدك.","x101":"أو تصفح الأسر العشرين:","x102":"اجعله الرئيس","x103":"إزالة","x104":"تقديرك لنفسك فيه:","x105":"اللغات،","x106":"ومستواها كيف يثبت","x107":"اللغة","x108":"المستوى","x109":"طريقة الإثبات","x110":"الشهادة (صورة أو PDF)","x111":"+ لغة أخرى","x112":"القول يثبت","x113":"بالدليل","x114":"صيغ مقبولة: PDF · JPG · PNG · DOCX — حتى 10MB للملف","x115":"نوع المستند","x116":"الجهة المصدرة","x117":"سنة الإصدار","x118":"روابط أعمال منشورة (اختياري):","x119":"+ رابط آخر","x120":"فرد،","x121":"أم فريق جاهز؟","x122":"أسجل فردا","x123":"تبقى عضوية الفرق ممكنة لاحقا — تشكل كيان فرقا لكل تكليف.","x124":"أسجل فريقا جاهزا","x125":"فريق قائم بأعضائه واسمه — يدعى كل عضو لإكمال تسجيله الفردي.","x126":"اسم الفريق","x127":"قسمة المستحقات المعلنة","x128":"واتساب","x129":"الدور","x130":"قائد","x131":"منفذ","x132":"مراجع","x133":"متدرب","x134":"+ عضو","x135":"يد","x136":"للمدينة","x137":"— إن شئت","x138":"نعم — سجلني متطوعا","x139":"ساعة تطوع تقيد باسمك، ومكانة تبنى في سجل المدينة.","x140":"ليس الآن","x141":"يبقى الباب مفتوحا من بوابتك متى شئت.","x142":"مجالات التطوع (واحد فأكثر):","x143":"الساعات المتاحة شهريا","x144":"حتى 4 ساعات","x145":"4–8 ساعات","x146":"8–16 ساعة","x147":"أكثر من 16 ساعة","x148":"خبرة تطوع سابقة (اختياري)","x149":"أين يمكنك الحضور ميدانيا؟","x150":"لم التطوع؟ — سطر واحد يكفي (اختياري)","x151":"من يشهد","x152":"لعملك؟","x153":"تجلب الإفادة آليا فور تقديمها","x154":"الاسم","x155":"صفته تجاهك","x156":"الجهة","x157":"هاتف أو واتساب","x158":"بريد إلكتروني","x159":"عمل محدد جمعكما — سؤال المصداقية الأول","x160":"+ مزك ثالث","x161":"أرسل طلبات التزكية","x162":"محاكاة ورود الإفادات ↺","x163":"أين","x164":"يصرف مستحقك؟","x165":"تختار مصرفا أو أكثر مما يعمل في عدن، ويكمل لكل مصرف اسم الحساب ورقمه. تقبل المحافظ قناة ثانوية.","x166":"المصارف (اختيار متعدد):","x167":"اسم صاحب الحساب (كما في المصرف)","x168":"رقم الحساب / IBAN","x169":"الفرع (اختياري)","x170":"محافظ إلكترونية (اختياري — قناة ثانوية):","x171":"ثلاث عشرة موافقة —","x172":"كل واحدة على حدة","x173":"لا موافقة جامعة ولا صندوق واحد يبتلع كل شيء. تقرأ كل موافقة بغرضها، ويؤشر عليها منفردة. الواجبة شرط للمعالجة، والاختيارية قرارك الحر ويمكن سحبها من بوابتك في أي وقت.","x174":"إلى المراجعة ←","x175":"قبل التوقيع،","x176":"نظرة أخيرة","x177":"يراجع كل بند، ويعدل ما يلزم من زر «تعديل». بعد التقديم يقيد الملف في السجل قيدا مؤرخا لا يعدل — وما يستجد يضاف قيدا جديدا.","x178":"تعديل","x179":"أقر باطلاعي على","x180":"الشروط والأحكام","x181":"و","x182":"سياسة الخصوصية","x183":"، وأوافق على معالجة بياناتي للتحقق ومطابقة التكليفات وحفظ السجل، وفق","x184":"مواد حماية البيانات","x185":"يقيد هذا الإقرار بتاريخه في سجلك، ويجوز سحب الموافقة بطلب يرفع إلى مسؤول حماية البيانات.","x186":"قدم الطلب — ويقيد في السجل ←","x187":"قيد طلبك.","x188":"من هنا يبدأ السجل.","x189":"بطاقتك تفتح عند الطبقة صفر","x190":"تصدر البطاقة عن السجل لا عن الطلب: تفتح فارغة، ويكتب أول سطر فيها عند قبول أول عمل. وترتقي طبقتها بما يقبل، لا بالأقدمية.","x191":"كيف تكتسب سطورها ←","x192":"ما الذي يحدث الآن؟","x193":"تذكرة أخيرة، كما في أول النموذج: التحقق يثبت قدرتك ولا يخصص عملا. حين يلائم تكليف قدرتك وجاهزيتك، تخاطب على واتساب من رقم كيان الرسمي.","x194":"ادخل بوابتك ←","x195":"العودة إلى الدار","x196":"خلف كل نجاح، كيان","x197":"الدار","x198":"عن كيان","x199":"الشروط والخصوصية","x200":"يمسح مسودة التسجيل من هذا الجهاز فقط","x201":"محطات التسجيل","x202":"مثال: م. سارة أحمد","x203":"ثمانية أحرف فأكثر","x204":"الاسم الأول، الأب، الجد، اللقب","x205":"يمنية","x206":"مثال: خورمكسر","x207":"مثال: السعودية","x208":"الصورة الحية الملتقطة","x209":"مثال: ترجمة عقود · Flutter · محاسبة منح · خياطة","x210":"جامعة عدن · مركز تدريب · جهة عمل","x211":"إزالة الرابط","x212":"مثال: استوديو المعلا","x213":"مثال: القائد 40% والعضوان 30% لكل","x214":"جهة أو حملة شاركت فيها","x215":"يكتب بلا تكلف","x216":"اسم المزكي","x217":"اسم المنظمة أو الشركة","x218":"مثال: أنجزت تحت إشرافه ترجمة تقرير المسح الصحي لمنظمة كذا، مارس 2025","x219":"في بيئة العرض: يحاكي ورود الإفادات وجلبها الآلي","x220":"مثال: عدن — المعلا","y0":"لماذا نسأل: تثبت الهوية قبل أي شيء آخر لأن كل ما يبنى بعدها — القدرة والسجل والصرف — ينسب إليها. تاريخ الميلاد والجنس يطلبان كما في الوثيقة لأغراض المطابقة حصرا، ولا يظهران في ملفك للعملاء.","y1":"تلتقط الصورة من الكاميرا مباشرة لا من الاستوديو: وجه كامل، إضاءة أمامية، دون نظارة شمسية أو كمامة. تفحص الآلة الوضوح والإضاءة وملامح الوجه،","y2":"ولا يرفض طلب آليا أبدا — القرار السلبي يتخذه إنسان مسمى بسبب مكتوب.","y3":"تسأل هذه الأسئلة لأن التكليف الناجح في عدن يخطط حول الكهرباء والاتصال لا رغما عنهما. الإجابة الصادقة ترفع فرص التكليف، لا تنقصها.","y4":"لا تحجب هذه الإجابات أحدا عن التسجيل. انقطاع الكهرباء ظرف لا سلوك، والقدرة على مواصلة العمل رغم الانقطاع تسمى عندنا «استمرارية متكيفة» وهي كفاءة تحسب لك.","y5":"اثنتا عشرة أسرة مهنية، وتحتها ثلاثة وستون تخصصا، لكل تخصص رمزه المقيد. يختار تخصص رئيس واحد يقاس عليه التقييم، وحتى أربعة ثانوية. البحث يصل بثلاث خطوات على الأكثر.","y6":"لماذا نسأل: التخصص الرئيس يحدد أدوات تقييمك، والمجالات الدقيقة تحدد كيف يراك العملاء في خرائط القدرات. التقدير الذاتي يوجه صعوبة الأسئلة ويقيس معايرتك لنفسك — لا يحسم درجتك.","y7":"لم يعثر على تطابق. عملك موجود وإن غاب اسمه عن قوائمنا — يقترح المصطلح ويدخل قائمة التوسعة، ويبلغ صاحبه بالنتيجة.","y8":"التقدير الذاتي يقرأ مع نتيجتك لاحقا: من قدر نفسه بدقة تحسب له «معايرة» عالية — وهي عند العملاء لا تقل قيمة عن المهارة نفسها.","y9":"يعلن المستوى على السلم الأوروبي المرجعي (A1–C2)، ويحدد طريق إثباته: إقرار ذاتي يقاس أثناء التقييم، أو شهادة معتمدة ترفع، أو اختبار كيان الكتابي والمقابلة.","y10":"لماذا نسأل: تكليفات كثيرة تحسم بلغة التقرير أو لغة العميل. المستوى المعلن يقيد كما هو، ثم يقاس — والفارق بين المعلن والمقاس جزء من معايرتك.","y11":"ترفع الشهادات الجامعية والتدريبية وشهادات الخبرة وعينات الأعمال، ويصنف كل مستند بنوعه وجهته وسنته. الروابط تقبل لملفات الأعمال المنشورة.","y12":"لماذا نسأل: لا يشترط مؤهل بعينه للتسجيل — لكن كل ورقة صحيحة تختصر عليك خطوات القياس، وكل عينة عمل تربط اسمك بمنجز يرى.","y13":"من اعتاد العمل مع زملاء بعينهم يسجل فريقه «فريقا جاهزا»: من اثنين إلى ستة، باسم واحد وقائد واحد، ويعتمد وحدة واحدة بعد تحقق كل عضو. يظهر الفريق في خرائط العرض كوحدة، وتوزع مستحقاته بقسمة يعلنها قائده قبل أي عمل.","y14":"قواعد الاعتماد: يتحقق كل عضو فرديا أولا؛ يفضل أن يكون القائد في الدرجة الثالثة فأعلى؛ ويقاس الفريق كوحدة عند أول تكليف. نزاع الفريق يرفعه القائد إلى كيان — لا إلى العميل أبدا.","y15":"«كيان لليمن» ذراع مدنية تطوعية: ساعات تطوع موثقة تقيد في بطاقتك وتبني مكانة، ولا تقابل بمال. المشاركة اختيارية بالكامل ولا تؤثر في تقييمك المهني إيجابا أو سلبا.","y16":"كيف تعمل التزكية: يرسل لكل مزك رابط آمن بلا حساب، بالعربية أو الإنجليزية، صالح 14 يوما مع تذكير في الأيام 3 و7 و12.","y17":"وتقيد في ملفك — لا يطلع عليها المتقدم، وتفحص عينة من الإفادات هاتفيا كل شهر.","y18":"لماذا نجمع هذا الآن: تطلب بيانات الصرف مرة واحدة، ولا تستخدم إلا عند أول مستحق، ولا يطلع عليها غير موظفي الصرف. يصرف عبر القنوات الرسمية حصرا — لا حوالات شخصية ولا عملات رقمية. "};
const S_EN={"x0":"Registration","x1":"The portal","x2":"For talent","x3":"Clear the draft","x4":"Before the first field,","x5":"six facts","x6":"Read each clause, then tick it. Registration is the first act in a relationship built on candour from both sides, so it opens with its charter and not with its form.","x7":"The charter of candour and the rules of the relationship","x8":"On reaching the end of the text and ticking the acknowledgement below, your acceptance of the charter is entered, dated, in your record.","x9":"I acknowledge that what I enter is correct, and that any verification is run on data I supplied and am answerable for.","x10":"Two comprehension questions — both answered before proceeding","x11":"Does verification assign work to whoever passes it?","x12":"When does any work through Kayan begin?","x13":"Begin registration →","x14":"One account,","x15":"one confirmed channel","x16":"The account opens on the least possible data, and a WhatsApp number is confirmed because it is the first operational channel in Aden.","x17":"Why this is asked: the name is requested as you wish to be addressed, the number is confirmed so no one registers in your name, and email remains a reserve channel for documents.","x18":"The name you are known by professionally","x19":"WhatsApp number","x20":"Email address","x21":"Password","x22":"Channel confirmation","x23":"← Back","x24":"Next →","x25":"Identity","x26":"verified once","x27":"Enter the data exactly as it appears on the document. Document images are deleted once verification is complete, and a digital fingerprint is retained to prove it took place.","x28":"Full four-part name as on the document","x29":"Date of birth","x30":"Sex as on the document","x31":"— select —","x32":"Male","x33":"Female","x34":"Nationality","x35":"Governorate (current residence)","x36":"City or district","x37":"Country of residence","x38":"Document type","x39":"Document number","x40":"Document expiry date","x41":"Document image — front","x42":"JPG, PNG or PDF · minimum 800 pixels wide · maximum 10MB · the document's text legible, without glare.","x43":"Document image — reverse","x44":"“No reverse side” is accepted for a passport — the field is then left empty.","x45":"Live capture — proof a person stands behind the application","x46":"Capture","x47":"or upload an image if the camera is unavailable","x48":"Your working conditions,","x49":"as they are","x50":"Educational qualification","x51":"Secondary or below","x52":"Vocational diploma","x53":"Bachelor's","x54":"Master's","x55":"Doctorate","x56":"Self-taught, evidenced by work","x57":"Years of experience","x58":"Under a year","x59":"1–3 years","x60":"3–5 years","x61":"5–10 years","x62":"Over 10 years","x63":"Your current situation","x64":"Full-time freelance","x65":"Employed, working part-time","x66":"Student","x67":"Seeking a first opportunity","x68":"Small-business owner","x69":"Hours available weekly","x70":"Under 10","x71":"35 or more","x72":"Primary working device","x73":"Laptop","x74":"Desktop","x75":"Tablet","x76":"Phone only","x77":"No device at present — I will work from the Hub","x78":"Internet connection","x79":"Home fibre or DSL","x80":"4G mobile network","x81":"Starlink or satellite","x82":"Café or workspace","x83":"Intermittent and unstable","x84":"Power backup","x85":"Solar with battery","x86":"Private or shared generator","x87":"UPS battery only","x88":"No backup","x89":"Your plan during a long outage","x90":"Work from the Kayan Hub — the Corniche","x91":"A café or alternative space","x92":"An equipped home nearby","x93":"No plan yet","x94":"What can you do?","x95":"Name it precisely","x96":"Search for your work — by name, tool or description","x97":"+ Add","x98":"Propose adding it","x99":"Proposals entered for review:","x100":"— every search without a result improves the list for whoever comes after you.","x101":"Or browse the twenty families:","x102":"Make it primary","x103":"Remove","x104":"Your own rating in it:","x105":"Languages,","x106":"and how the level is proven","x107":"Language","x108":"Level","x109":"Method of proof","x110":"Certificate (image or PDF)","x111":"+ Another language","x112":"A claim is established","x113":"by evidence","x114":"Accepted formats: PDF · JPG · PNG · DOCX — up to 10MB per file","x115":"Document kind","x116":"Issuing body","x117":"Year of issue","x118":"Links to published work (optional):","x119":"+ Another link","x120":"An individual,","x121":"or a ready pod?","x122":"Register as an individual","x123":"Pod membership remains possible later — Kayan forms pods for each engagement.","x124":"Register a ready pod","x125":"An existing pod with its members and its name — each member is invited to complete their own registration.","x126":"Pod name","x127":"The declared split of dues","x128":"WhatsApp","x129":"Role","x130":"Lead","x131":"Practitioner","x132":"Reviewer","x133":"Trainee","x134":"+ Member","x135":"A hand","x136":"for the city","x137":"— if you wish","x138":"Yes — register me as a volunteer","x139":"Volunteer hours entered in your name, and standing built in the city's record.","x140":"Not now","x141":"The door stays open from your portal whenever you wish.","x142":"Fields of volunteering (one or more):","x143":"Hours available monthly","x144":"Up to 4 hours","x145":"4–8 hours","x146":"8–16 hours","x147":"Over 16 hours","x148":"Prior volunteering experience (optional)","x149":"Where can you attend in the field?","x150":"Why volunteer? — one line is enough (optional)","x151":"Who vouches","x152":"for your work?","x153":"The statement is fetched automatically the moment it is submitted","x154":"Name","x155":"Their relation to you","x156":"Organisation","x157":"Phone or WhatsApp","x158":"Email","x159":"A specific engagement that brought you together — the first credibility question","x160":"+ Third referee","x161":"Send the reference requests","x162":"Simulate statements arriving ↺","x163":"Where","x164":"are your dues released?","x165":"Select one or more of the banks operating in Aden, and complete the account name and number for each. Wallets are accepted as a secondary channel.","x166":"Banks (multiple selection):","x167":"Account holder's name (as held at the bank)","x168":"Account number / IBAN","x169":"Branch (optional)","x170":"Electronic wallets (optional — secondary channel):","x171":"Thirteen consents —","x172":"each one on its own","x173":"No blanket consent and no single box that swallows everything. Each consent is read with its purpose and ticked on its own. The required ones are a condition of processing; the optional ones are your free decision and may be withdrawn from your portal at any time.","x174":"To review →","x175":"Before signing,","x176":"a final look","x177":"Review each item and amend what is needed from the “Edit” button. After submission the file is entered in the register, dated and unamendable — anything new is added as a fresh entry.","x178":"Edit","x179":"I acknowledge that I have read the","x180":"terms and conditions","x181":"and the","x182":"privacy policy","x183":", and I consent to my data being processed for verification, engagement matching and record-keeping, under the","x184":"data-protection articles","x185":"This acknowledgement is entered with its date in your record, and consent may be withdrawn by a request raised to the data-protection officer.","x186":"Submit the application — entered in the register →","x187":"Your application is entered.","x188":"The record begins here.","x189":"Your card opens at tier zero","x190":"The card is issued by the register, not by the application: it opens empty, and its first line is written when the first engagement is accepted. Its tier rises by what is accepted, not by seniority.","x191":"How its lines are earned →","x192":"What happens now?","x193":"A final reminder, as at the start of the form: verification establishes your capability and does not assign work. When an engagement suits your capability and readiness, you are contacted on WhatsApp from Kayan's official number.","x194":"Enter your portal →","x195":"Back to the home page","x196":"Behind every success, a Kayan.","x197":"Home","x198":"About Kayan","x199":"Terms and privacy","x200":"Clears the registration draft from this device only","x201":"Registration stations","x202":"e.g. Eng. Sarah Ahmed","x203":"Eight characters or more","x204":"Given name, father's, grandfather's, family name","x205":"Yemeni","x206":"e.g. Khormaksar","x207":"e.g. Saudi Arabia","x208":"The live capture taken","x209":"e.g. contract translation · Flutter · grant accounting · tailoring","x210":"University of Aden · a training centre · an employer","x211":"Remove the link","x212":"e.g. Al-Mualla Studio","x213":"e.g. lead 40%, the two members 30% each","x214":"A body or campaign you took part in","x215":"Written plainly","x216":"The referee's name","x217":"The organisation or company name","x218":"e.g. under their supervision I delivered the translation of the health survey report for such-and-such organisation, March 2025","x219":"In the demo environment: simulates statements arriving and being fetched automatically","x220":"e.g. Aden — Al-Mualla","y0":"Why this is asked: identity is established before anything else, because everything built after it — capability, record and payment — is attributed to it. Date of birth and sex are requested as they appear on the document, for matching purposes only, and do not appear in your client-facing profile.","y1":"The image is taken from the camera directly, not from a studio: full face, front lighting, no sunglasses or mask. The machine checks sharpness, lighting and facial features,","y2":"and no application is ever rejected automatically — a negative decision is taken by a named person, with a written reason.","y3":"These questions are asked because a successful engagement in Aden plans around power and connectivity rather than against them. A candid answer raises your chances of engagement; it does not lower them.","y4":"None of these answers bars anyone from registering. A power outage is a circumstance, not a behaviour, and the ability to keep working through it is what we call “adaptive continuity” — a competence counted in your favour.","y5":"Twelve professional families, sixty-three specialisations beneath them, each carrying its own registered code. Select one primary specialisation, against which assessment is measured, and up to four secondary. The search reaches it in three steps at most.","y6":"Why this is asked: the primary specialisation determines your assessment instruments, and the registered code determines how clients see you on capability maps. The self-rating guides the difficulty of the questions and measures how well you calibrate yourself — it does not settle your grade.","y7":"No match found. Your work exists even if its name is absent from our lists — propose the term and it enters the expansion list, with the outcome reported back to whoever proposed it.","y8":"The self-rating is read alongside your result later: whoever rated themselves accurately is credited with high “calibration” — worth no less to clients than the skill itself.","y9":"The level is declared on the Common European Framework scale (A1–C2), and its route of proof specified: a self-declaration measured during assessment, an accredited certificate uploaded, or Kayan's written test and interview.","y10":"Why this is asked: many engagements turn on the language of the report or the language of the client. The declared level is entered as stated, then measured — and the gap between declared and measured forms part of your calibration.","y11":"University and training certificates, experience letters and work samples are uploaded, and each document is classified by its kind, its issuer and its year. Links are accepted for published portfolios.","y12":"Why this is asked: no particular qualification is required to register — but every sound document shortens your path through measurement, and every work sample ties your name to something that can be seen.","y13":"Whoever is used to working with particular colleagues registers their team as a “ready pod”: two to six people, under one name and one lead, accredited as a single unit once each member is verified. The pod appears on offer maps as a unit, and its dues are distributed by a split its lead declares before any work.","y14":"Rules of accreditation: each member is verified individually first; the lead is preferably at the third tier or above; and the pod is measured as a unit at its first engagement. A pod dispute is raised by the lead to Kayan — never to the client.","y15":"“Kayan for Yemen” is a civic, voluntary arm: documented volunteer hours are entered on your card and build standing, and are not met with money. Participation is entirely optional and affects your professional assessment neither favourably nor adversely.","y16":"How the reference works: each referee is sent a secure link requiring no account, in Arabic or English, valid for 14 days with reminders on days 3, 7 and 12.","y17":"and entered in your file — the applicant does not see it, and a sample of statements is checked by telephone each month.","y18":"Why this is collected now: payment details are requested once, are used only at the first dues, and are seen by no one but payment staff. Payment is made through official channels exclusively — no personal transfers and no digital currencies."};

const L_AR=['التمهيد','الحساب','الهوية','الملف','التخصصات','اللغات','الإثباتات','الفريق الجاهز','كيان لليمن','المزكون','الصرف','الموافقات','المراجعة','النتيجة'];
const L_EN=['Orientation','Account','Identity','Profile','Specialisations','Languages','Evidence','Ready pod','Kayan for Yemen','Referees','Payment','Consents','Review','Outcome'];
const HINT_EN={0:'The six clauses must be ticked, the charter read to its end, candour acknowledged, and both comprehension questions answered correctly.',1:'A name, a valid WhatsApp number, an email, an 8-character password and code confirmation are required.',2:'Complete document data, an accepted front image and an accepted live capture are required.',3:'Complete the eight fields — there is no wrong answer.',4:'Select at least one primary specialisation, with three or more micro-fields and a self-rating.',5:'Add at least one language, with a level and a method of proof.',6:'Upload at least one piece of evidence, or add a link to your work.',7:'When a pod is enabled: a pod name and at least two members with complete details.',8:'Give the answer: yes with a field and hours, or \u201cnot now\u201d.',9:'Two complete referees are required, each with a specific engagement that brought you together (12 characters or more).',10:'Select at least one bank and complete the account name and number.',11:'Every required consent must be ticked — the optional ones are yours to decide.'};
const HINT_DONE_EN='This station is complete — proceed whenever you wish.';
const ACK_EN=[
 {t:'Verification does not assign work',b:'Verification establishes your capability; it does not promise you an engagement. Engagement is decided by suitability, readiness and the requirements of the work.'},
 {t:'The ladder is built for climbing',b:'Five tiers from “Registered” to “Entrusted”. No one is described as rejected; our terms are: verified, further information, or not yet.'},
 {t:'No contract, no escrow, no work',b:'No work begins through Kayan without a signed scope and funded escrow. This is your protection before it is our condition.'},
 {t:'Your data is yours',b:'You may view, correct and withdraw it. Document images are deleted once verification is complete, and only a fingerprint proving it took place is retained.'},
 {t:'The register does not forget, and does not lie',b:'Every entry is dated and unamendable. What is added is added as a fresh entry — nothing is erased from what came before.'},
 {t:'The machine screens, the human decides',b:'The machine may clear an application; a negative decision, however, is signed only by a named officer with a written reason, and may be appealed.'}
];
const COMPOSE={
  cSel:(a,n)=>a?('اختياراتك ('+n+' من 5) — الأول هو الرئيس'):('Your selections ('+n+' of 5) — the first is primary'),
  cMicro:(a,n)=>a?('المجالات الدقيقة — اختياري ('+n+' مختارة):'):('Micro-fields — optional ('+n+' selected):'),
  cPod:(a,n)=>a?('الأعضاء ('+n+' من 6) — يرسل لكل عضو رابط دعوة لإكمال تسجيله بنفسه:'):('Members ('+n+' of 6) — each is sent an invitation link to complete their own registration:'),
  cMember:(a,n)=>a?('العضو '+n):('Member '+n),
  cRef:(a,n)=>a?('المزكي '+n):('Referee '+n),
  cGrade:(a,n)=>a?('درجة '+n):('Grade '+n)
};

export default class ApplyLogic extends DCLogic {
  constructor(props){
    super(props);
    let saved=null; try{ saved=JSON.parse(localStorage.getItem('kayan-apply-v1')||'null'); }catch(e){}
    this.state = saved && saved.v===1 ? saved : this.blank();
    try{ const FAMS=(window.KAYAN_REGISTRY&&window.KAYAN_REGISTRY.families)||[];
      const ok=(x)=>{ const f=FAMS[x&&x.fi]; return !!(f && f.c===x.famC && f.specs && f.specs[x.si]); };
      if(Array.isArray(this.state.specs)){ const keep=this.state.specs.filter(ok);
        if(keep.length!==this.state.specs.length){ this.state={...this.state, specs:keep, famOpen:-1}; } } }catch(e){}
    let lg=null; try{ lg=localStorage.getItem('kyn-lang'); }catch(e){}
    this.state.lang = (lg==='en'||lg==='ar') ? lg : (props.defaultLang==='ar'?'ar':'en');
    this.rootRef = React.createRef();
    this.videoRef = React.createRef(); this.termsRef = React.createRef(); this.gridRef = React.createRef();
    this.railRef = React.createRef(); this.selfieRef = React.createRef();
    this._stream = null; this._promptTimer = null;
  }
  blank(){
    return { v:1, stage:0, maxSeen:0,
      ack:[false,false,false,false,false,false], termsDone:false, honesty:false, q1:null, q2:null,
      acc:{name:'',wa:'',email:'',pw:'',codeSent:false,code:'',codeOk:false},
      idn:{legal:'',dob:'',sex:'',nat:'يمنية',gov:'',city:'',country:'',type:'',num:'',exp:'',front:'',frontOk:false,back:'',backOk:false,selfie:'',selfieChecks:[],selfieOk:false},
      prof:{edu:'',years:'',status:'',hours:'',device:'',net:'',power:'',backup:''},
      specs:[], search:'', famOpen:-1, proposals:[],
      langs:[{lang:'العربية',level:'N',proof:'self',cert:''}],
      docs:[], links:[''],
      pod:{on:false,name:'',members:[{name:'',wa:'',role:'قائد'},{name:'',wa:'',role:'منفذ'}],split:''},
      k4y:{on:null,fields:[],hours:'',govs:[],prior:'',why:''},
      refs:[{name:'',rel:'',org:'',phone:'',email:'',work:'',status:'مسودة'},{name:'',rel:'',org:'',phone:'',email:'',work:'',status:'مسودة'}],
      pay:{banks:[],accs:{},wallets:[],note:''},
      consents:[true,true,true,true,true,true,true,true,true,false,false,false,false].map(()=>false),
      submitted:false, appId:'', submittedAt:'',
      camOn:false, camPrompt:'', savedAt:'' };
  }
  ar(){ return this.state.lang!=='en'; }
  syncDir(){ const el=this.rootRef.current; if(el) el.setAttribute('dir', this.ar()?'rtl':'ltr'); }
  setLang(l){ if(l===this.state.lang) return; try{ localStorage.setItem('kyn-lang',l); }catch(e){} this.setState({lang:l}, ()=>this.syncDir()); }
  save(patch, cb){ this.setState(patch, ()=>{ const s={...this.state}; delete s.camOn; delete s.camPrompt; delete s.lang; try{ localStorage.setItem('kayan-apply-v1', JSON.stringify(s)); }catch(e){} if(cb)cb(); }); }
  componentDidMount(){
    this.syncDir();
    this._termsHandler = ()=>{ const el=this.termsRef.current; if(el && !this.state.termsDone && el.scrollTop+el.clientHeight >= el.scrollHeight-24){ this.save({termsDone:true}); } };
    this._bindTerms();
    this._initSelects();
    this._paintSelfie();
    this._liveClause();
    this._centreStation();
  }
  componentDidUpdate(prevProps, prevState){
    this.syncDir(); this._bindTerms(); this._initSelects(); this._paintSelfie(); this._liveClause();
    if(this._closeSel && prevState && prevState.stage!==this.state.stage) this._closeSel();
    if(!prevState || prevState.stage!==this.state.stage) this._centreStation();
  }
  _centreStation(){
    const rail=this.railRef.current; if(!rail) return;
    const kids=rail.querySelectorAll('[data-stn]');
    const el=kids[this.state.stage]; if(!el) return;
    const max=Math.max(0, rail.scrollWidth-rail.clientWidth);
    const to=Math.min(max, Math.max(0, el.offsetLeft-(rail.clientWidth-el.offsetWidth)/2));
    const reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || !rail.scrollTo) rail.scrollLeft=to;
    else rail.scrollTo({left:to, behavior:'smooth'});
  }
  _bindTerms(){ const el=this.termsRef.current; if(el && !el._kb){ el._kb=true; el.addEventListener('scroll', this._termsHandler, {passive:true}); } }
  componentWillUnmount(){ this.stopCam(); this._killSel(); }

  /* Every <select> keeps its value and its React handler; only the open list is ours. */
  _initSelects(){
    if(this._selBound) return;
    this._selBound=true;
    const P=document.createElement('div');
    P.setAttribute('data-ksel-panel','');
    P.style.cssText="position:fixed;z-index:2000;display:none;box-sizing:border-box;background:#FFFFFF;border:1px solid rgba(96,55,42,.16);border-radius:14px;box-shadow:0 26px 56px -20px rgba(46,15,10,.42);padding:6px;overflow-y:auto;max-height:min(320px,52vh);transform-origin:top;opacity:0;transform:translateY(-6px) scale(.985);transition:opacity .18s ease,transform .22s cubic-bezier(.23,1,.32,1);";
    P.style.fontFamily="'IBM Plex Sans Arabic','Instrument Sans',sans-serif";
    document.body.appendChild(P);
    this._panel=P; this._openSel=null;

    const close=()=>{
      if(!this._openSel) return;
      this._openSel.removeAttribute('data-ksel-open');
      this._openSel=null;
      P.style.opacity='0'; P.style.transform='translateY(-6px) scale(.985)';
      clearTimeout(this._selHide);
      this._selHide=setTimeout(()=>{ if(!this._openSel) P.style.display='none'; },200);
    };
    this._closeSel=close;

    const open=(sel)=>{
      const rtl=(this.rootRef.current&&this.rootRef.current.getAttribute('dir'))==='rtl';
      const r=sel.getBoundingClientRect();
      P.innerHTML='';
      P.dir=rtl?'rtl':'ltr';
      Array.from(sel.options).forEach((o,i)=>{
        const on=i===sel.selectedIndex;
        const b=document.createElement('button');
        b.type='button';
        b.style.cssText='all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:44px;padding:11px 14px;border-radius:9px;font-size:14px;line-height:1.5;text-align:'+(rtl?'right':'left')+';transition:background-color .16s ease;'
          +(on?'background:rgba(208,64,47,.12);color:#B8381F;font-weight:600;':'color:#5A2A1D;');
        const t=document.createElement('span');
        t.textContent=o.textContent;
        t.style.cssText='min-width:0;overflow:hidden;text-overflow:ellipsis;'+(o.value===''?'opacity:.55;':'');
        const k=document.createElement('span');
        k.textContent=on?'✓':'';
        k.style.cssText='flex:none;font-size:11px;color:#C4381F;';
        b.appendChild(t); b.appendChild(k);
        b.addEventListener('mouseenter',()=>{ if(!on) b.style.background='rgba(208,64,47,.07)'; });
        b.addEventListener('mouseleave',()=>{ if(!on) b.style.background='transparent'; });
        b.addEventListener('click',(e)=>{
          e.preventDefault(); e.stopPropagation();
          if(sel.value!==o.value){
            sel.value=o.value;
            sel.dispatchEvent(new Event('input',{bubbles:true}));
            sel.dispatchEvent(new Event('change',{bubbles:true}));
          }
          close();
        });
        P.appendChild(b);
      });
      P.style.display='block';
      P.style.width=Math.max(r.width,190)+'px';
      P.style.left=Math.min(Math.max(8,r.left),Math.max(8,window.innerWidth-Math.max(r.width,190)-8))+'px';
      const below=window.innerHeight-r.bottom;
      const h=Math.min(P.scrollHeight+2,Math.min(320,window.innerHeight*0.52));
      if(below<h+16 && r.top>below){ P.style.top=Math.max(8,r.top-h-8)+'px'; P.style.transformOrigin='bottom'; }
      else { P.style.top=(r.bottom+8)+'px'; P.style.transformOrigin='top'; }
      requestAnimationFrame(()=>{ P.style.opacity='1'; P.style.transform='translateY(0) scale(1)'; });
      sel.setAttribute('data-ksel-open','');
      this._openSel=sel;
      this._selAt=Date.now();
      const cur=P.children[sel.selectedIndex];
      if(cur&&cur.scrollIntoView===undefined){} else if(cur){ P.scrollTop=Math.max(0,cur.offsetTop-P.clientHeight/2); }
    };

    const hit=(e)=>{ const t=e&&e.target; return (t&&t.closest)?t.closest('select'):null; };
    /* the pointer gesture that opens the list also fires click/focus/scroll —
       ignore anything arriving inside that same gesture, or the list shuts on open */
    const sameGesture=()=>Date.now()-(this._selAt||0)<400;

    this._selDown=(e)=>{
      const sel=hit(e);
      if(!sel||!this.rootRef.current||!this.rootRef.current.contains(sel)) return;
      e.preventDefault(); e.stopPropagation();
      if(this._openSel===sel){ close(); return; }
      close(); open(sel);
    };
    this._selAway=(e)=>{
      if(!this._openSel) return;
      if(P.contains(e.target)) return;
      if(hit(e)===this._openSel) return;
      if(sameGesture()) return;
      close();
    };
    this._selKey=(e)=>{ if(e.key==='Escape') close(); };
    this._selScroll=(e)=>{
      if(!this._openSel) return;
      const t=e&&e.target; if(t&&t.nodeType===1&&(t===P||P.contains(t))) return;
      if(sameGesture()) return;
      close();
    };

    this._downEv = window.PointerEvent ? 'pointerdown' : 'mousedown';
    document.addEventListener(this._downEv,this._selDown,true);
    if(this._downEv!=='mousedown'){
      this._selMouse=(e)=>{ const sel=hit(e); if(sel&&this.rootRef.current&&this.rootRef.current.contains(sel)) e.preventDefault(); };
      document.addEventListener('mousedown',this._selMouse,true);
    }
    document.addEventListener('click',this._selAway,true);
    document.addEventListener('keydown',this._selKey,true);
    window.addEventListener('scroll',this._selScroll,true);
    window.addEventListener('resize',this._selScroll);
  }
  _liveClause(){
    const box=this.termsRef.current; if(!box) return;
    if(this._clauseBox===box){ if(this._markClause) this._markClause(); return; }
    this._clauseBox=box;
    this._markClause=()=>{
      const r=box.getBoundingClientRect(), line=r.top+Math.min(120,r.height*0.34);
      let best=null,d=1e9;
      box.querySelectorAll('[data-clause]').forEach(p=>{
        const pr=p.getBoundingClientRect(), gap=Math.abs(pr.top+pr.height/2-line);
        if(gap<d){ d=gap; best=p; }
      });
      box.querySelectorAll('[data-clause][data-live]').forEach(p=>{ if(p!==best) p.removeAttribute('data-live'); });
      if(best) best.setAttribute('data-live','');
    };
    box.addEventListener('scroll',this._markClause,{passive:true});
    this._markClause();
  }
  _paintSelfie(){
    const el=this.selfieRef.current, src=this.state.idn.selfie;
    if(el && src && el.getAttribute('src')!==src) el.setAttribute('src',src);
  }
  _killSel(){
    if(!this._selBound) return;
    document.removeEventListener(this._downEv||'mousedown',this._selDown,true);
    if(this._selMouse) document.removeEventListener('mousedown',this._selMouse,true);
    document.removeEventListener('click',this._selAway,true);
    document.removeEventListener('keydown',this._selKey,true);
    window.removeEventListener('scroll',this._selScroll,true);
    window.removeEventListener('resize',this._selScroll);
    if(this._panel&&this._panel.parentNode) this._panel.parentNode.removeChild(this._panel);
    this._selBound=false;
  }
  pick(o,arK,enK){ if(!o) return ''; const v=this.ar()?o[arK]:(o[enK]||o[arK]); return v==null?'':v; }
  list(arr,arrEn){ return (this.ar()?arr:(arrEn||arr))||[]; }
  reg(){ return window.KAYAN_REGISTRY || {families:[],banks:[],wallets:[],languages:[],langLevels:[],langProof:[],governorates:[],idTypes:[],refRelations:[],consents:[],docKinds:[],refRules:'',walletNote:''}; }
  go(n){ this.stopCam(); this.save({stage:n, maxSeen:Math.max(this.state.maxSeen,n)}, ()=>{ try{ (document.scrollingElement||document.documentElement).scrollTop=0; }catch(e){} }); }
  stageOk(n){
    const s=this.state;
    switch(n){
      case 0: return s.ack.every(Boolean) && s.termsDone && s.honesty && s.q1===1 && s.q2===1;
      case 1: { const a=s.acc; return a.name.trim().length>2 && a.wa.replace(/\D/g,'').length>=9 && /.+@.+\..+/.test(a.email) && a.pw.length>=8 && a.codeOk; }
      case 2: { const i=s.idn; return i.legal.trim().split(/\s+/).length>=3 && i.dob && i.sex && i.nat && i.gov && i.type && i.num.trim().length>=4 && i.exp && i.frontOk && i.selfieOk && (i.gov!=='خارج اليمن' || i.country.trim()); }
      case 3: { const p=s.prof; return p.edu&&p.years&&p.status&&p.hours&&p.device&&p.net&&p.power&&p.backup; }
      case 4: return s.specs.length>=1 && s.specs.every(x=>x.rating>0);
      case 5: return s.langs.length>=1 && s.langs.every(l=>l.lang&&l.level&&l.proof);
      case 6: return s.docs.length>=1 || s.links.some(l=>l.trim());
      case 7: return !this.state.pod.on || (this.state.pod.name.trim() && this.state.pod.members.filter(m=>m.name.trim()&&m.wa.trim()).length>=2);
      case 8: return s.k4y.on===false || (s.k4y.on===true && s.k4y.fields.length>=1 && s.k4y.hours);
      case 9: return s.refs.filter(r=>r.name.trim()&&r.rel&&(r.phone.trim()||r.email.trim())&&r.work.trim().length>=12).length>=2;
      case 10: return s.pay.banks.length>=1 && s.pay.banks.every(b=>{const a=s.pay.accs[b]||{}; return (a.name||'').trim() && (a.num||'').trim().length>=6;});
      case 11: return this.reg().consents.every((c,i)=> !c.req || s.consents[i]) && s.consents.filter(Boolean).length>=this.reg().consents.filter(c=>c.req).length;
      case 12: return true;
      default: return true;
    }
  }
  hint(n){
    if(this.stageOk(n)) return this.ar()?'اكتملت المحطة — تقدم متى شئت.':HINT_DONE_EN;
    if(!this.ar()) return HINT_EN[n]||'';
    const m={0:'يلزم تأشير البنود الستة، وقراءة الميثاق حتى آخره، وإقرار الصدق، وإصابة سؤالي الفهم.',1:'يلزم اسم ورقم واتساب صحيح وبريد وكلمة مرور 8 أحرف وتأكيد الرمز.',2:'يلزم اكتمال بيانات الوثيقة، وصورة أمامية مقبولة، وصورة حية مقبولة.',3:'تكمل الحقول الثمانية — لا توجد إجابة خاطئة.',4:'يختار تخصص رئيس واحد على الأقل، وله ثلاثة مجالات دقيقة فأكثر وتقدير ذاتي.',5:'تضاف لغة واحدة على الأقل بمستوى وطريقة إثبات.',6:'يرفع إثبات واحد على الأقل أو يضاف رابط أعمال.',7:'عند تفعيل الفريق: اسم للفريق وعضوان مكتملا البيانات على الأقل.',8:'تحدد الإجابة: نعم مع مجال وساعات، أو «ليس الآن».',9:'يلزم مزكيان مكتملان، ولكل منهما وصف عمل محدد جمعكما (12 حرفا فأكثر).',10:'يختار مصرف واحد على الأقل ويكمل اسم الحساب ورقمه.',11:'تؤشر الموافقات الواجبة كلها — الاختيارية تعود لك.'};
    return m[n]||'';
  }
  fmtBytes(b){ return (b/1048576).toFixed(1)+'MB'; }
  checkImage(file, minW, cb){
    if(!file){ cb(false,'لم يختر ملف.'); return; }
    if(file.size>10*1048576){ cb(false,'الملف '+this.fmtBytes(file.size)+' — يتجاوز الحد 10MB.'); return; }
    if(file.type==='application/pdf'){ cb(true,'قبل ملف PDF: '+file.name+' ('+this.fmtBytes(file.size)+'). تفحص المقروئية بشريا.'); return; }
    if(!/^image\/(jpeg|png)$/.test(file.type)){ cb(false,'الصيغة غير مقبولة — يقبل JPG أو PNG أو PDF.'); return; }
    const url=URL.createObjectURL(file); const img=new Image();
    img.onload=()=>{ const w=img.naturalWidth,h=img.naturalHeight; URL.revokeObjectURL(url);
      if(w<minW&&h<minW){ cb(false,'الدقة '+w+'×'+h+' — أقل من الحد الأدنى '+minW+' بكسل. تلتقط الصورة أقرب وبإضاءة أوفر.'); }
      else cb(true,'قبلت الصورة: '+w+'×'+h+' · '+this.fmtBytes(file.size)+'.');
    };
    img.onerror=()=>{ URL.revokeObjectURL(url); cb(false,'تعذرت قراءة الصورة — يجرب ملف آخر.'); };
    img.src=url;
  }
  async startCam(){
    if(this.state.camOn){ this.stopCam(); return; }
    try{
      const st=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:960}},audio:false});
      this._stream=st; this.setState({camOn:true,camPrompt:'انظر إلى الكاميرا مباشرة'});
      setTimeout(()=>{ const v=this.videoRef.current; if(v){ v.srcObject=st; v.play().catch(()=>{}); } },60);
      const prompts=(this.ar()?['انظر إلى الكاميرا مباشرة','أدر رأسك يمينا قليلا ثم عد','ارمش مرتين','ثبت — جاهز للالتقاط']:['Look straight into the camera','Turn your head slightly right, then back','Blink twice','Hold still — ready to capture']);
      let i=0; this._promptTimer=setInterval(()=>{ i=Math.min(i+1,prompts.length-1); this.setState({camPrompt:prompts[i]}); if(i===prompts.length-1){clearInterval(this._promptTimer);} },1600);
    }catch(e){ this.setState({camOn:false,camPrompt:(this.ar()?'تعذر فتح الكاميرا — يستخدم خيار الرفع أسفل الإطار.':'The camera could not be opened — use the upload option beneath the frame.')}); }
  }
  stopCam(){ if(this._promptTimer)clearInterval(this._promptTimer); if(this._stream){ this._stream.getTracks().forEach(t=>t.stop()); this._stream=null; } if(this.state.camOn)this.setState({camOn:false,camPrompt:''}); }
  snapSelfie(){
    const v=this.videoRef.current; if(!v||!v.videoWidth){ this.setState({camPrompt:'الكاميرا لم تجهز بعد.'}); return; }
    const c=document.createElement('canvas'); const S=480; c.width=S;c.height=S; const ctx=c.getContext('2d');
    const side=Math.min(v.videoWidth,v.videoHeight); ctx.translate(S,0); ctx.scale(-1,1);
    ctx.drawImage(v,(v.videoWidth-side)/2,(v.videoHeight-side)/2,side,side,0,0,S,S);
    const data=ctx.getImageData(0,0,S,S).data; let lum=0; for(let i=0;i<data.length;i+=40){ lum+=0.299*data[i]+0.587*data[i+1]+0.114*data[i+2]; } lum/= (data.length/40);
    const checks=[]; const bright=lum>55&&lum<215; checks.push({t:'LIGHT '+(bright?'OK':'LOW'),ok:bright});
    checks.push({t:'RES 480×480 OK',ok:true});
    const finish=(faceOk,faceKnown)=>{ checks.push({t: faceKnown?('FACE '+(faceOk?'FOUND':'NOT FOUND')):'FACE — HUMAN REVIEW',ok:faceKnown?faceOk:true});
      checks.push({t:'LIVE CAPTURE',ok:true});
      const ok=bright&&(faceKnown?faceOk:true);
      this.stopCam();
      this.save({idn:{...this.state.idn,selfie:c.toDataURL('image/jpeg',.82),selfieChecks:checks,selfieOk:ok}, camPrompt: ok?'قبلت الصورة الحية.':'الصورة ملتقطة لكن الفحص لم يطمئن — يعاد الالتقاط بإضاءة أمامية.'});
    };
    if(window.FaceDetector){ new window.FaceDetector({fastMode:true}).detect(c).then(f=>finish(f.length>0,true)).catch(()=>finish(true,false)); } else finish(true,false);
  }
  pickSelfie(e){
    const f=e.target.files&&e.target.files[0];
    this.checkImage(f,600,(ok,msg)=>{
      if(!ok){ this.save({idn:{...this.state.idn,selfieOk:false,selfieChecks:[{t:'UPLOAD REJECTED',ok:false}]}, camPrompt:msg}); return; }
      const url=URL.createObjectURL(f); const img=new Image();
      img.onload=()=>{ const c=document.createElement('canvas'); const S=480; c.width=S;c.height=S; const ctx=c.getContext('2d'); const side=Math.min(img.width,img.height); ctx.drawImage(img,(img.width-side)/2,(img.height-side)/2,side,side,0,0,S,S); URL.revokeObjectURL(url);
        this.save({idn:{...this.state.idn,selfie:c.toDataURL('image/jpeg',.82),selfieChecks:[{t:'UPLOADED — HUMAN REVIEW',ok:true},{t:'RES OK',ok:true}],selfieOk:true}, camPrompt:'قبلت الصورة المرفوعة — تراجع بشريا لأنها ليست التقاطا حيا.'}); };
      img.src=url;
    });
  }
  renderVals(){
    const s=this.state, R=this.reg();
    const arL=this.ar(); const labels = arL ? L_AR : L_EN;
    const rail=labels.map((l,i)=>{ const cur=s.stage===i, done=i<13&&this.stageOk(i)&&s.maxSeen>=i&&i!==s.stage;
      const locked=i===13&&!s.submitted;
      const reached=done||cur||s.maxSeen>=i;
      const seg=(k)=>(k>=0&&s.maxSeen>k)?'#D9A56E':'#E3D5C6';
      return { no:('0'+i).slice(-2), label:l, title:l, go:()=>{ if(i<=12 || s.submitted) this.go(i); },
        aria: cur?'step':'false', cursor: locked?'not-allowed':'pointer', op: locked?'.42':(cur?'1':(reached?'.92':'.62')),
        numFg: cur?'#C4381F':(done?'rgba(126,58,24,.72)':'rgba(110,64,48,.48)'),
        lineAShow: i===0?'none':'block', lineBShow: i===labels.length-1?'none':'block',
        lineA: seg(i-1), lineB: seg(i),
        dot: cur?'13px':'11px',
        nodeBg: cur?'#D0402F':(done?'#FFFFFF':'rgba(255,255,255,.55)'),
        nodeBd: cur?'#D0402F':(done?'#C4381F':'#DCCBB9'),
        nodeSh: cur?'0 0 0 4px rgba(208,64,47,.14)':'none',
        tick: done?'✓':'', tickFg:'#C4381F',
        fg:cur?'#3C1610':(done?'#7E3A18':'#8B7565'), lw: cur?'600':'400', done };
    });
    const ackTexts=[
      {t:'التحقق لا يخصص العمل',b:'يثبت التحقق قدرتك ولا يعدك بتكليف. التكليف يقرره الملاءمة والجاهزية ومتطلبات العمل.'},
      {t:'السلم بني للصعود',b:'خمس درجات من «مسجل» إلى «مؤتمن». لا يوصف أحد بالرفض؛ الأوصاف عندنا: موثق، أو معلومات إضافية، أو ليس بعد.'},
      {t:'لا عقد، لا ضمان، لا عمل',b:'لا يبدأ عمل عبر كيان دون نطاق موقع وضمان ممول. هذه حمايتك قبل أن تكون شرطنا.'},
      {t:'البيانات تطلب مرة، ولغرض',b:'كل حقل معه سبب طلبه. تحذف صور الوثائق بعد التحقق، ويحتفظ ببصمة رقمية فقط.'},
      {t:'الصدق شرط البقاء',b:'تفحص عينات من الإفادات هاتفيا كل شهر. البيان غير الصحيح يغلق الملف بقرار مسبب.'},
      {t:'الآلة ترشح، والإنسان يحسم',b:'قد تجيز الآلة طلبا؛ أما القرار السلبي فلا يوقعه إلا موظف مسمى بسبب مكتوب، ولك تظلم واحد خلال 21 يوما.'}
    ];
    const ackSrc = arL ? ackTexts : ACK_EN;
    const ackCards=ackSrc.map((c,i)=>({ ...c, on:s.ack[i],
      no:('0'+(i+1)).slice(-2), noFg:s.ack[i]?'rgba(196,56,31,.72)':'rgba(110,64,48,.48)',
      mark:s.ack[i]?'✓':'',
      bg:s.ack[i]?'#FFF8F3':'rgba(255,255,255,.82)',
      bd:s.ack[i]?'rgba(215,79,55,.42)':'rgba(96,55,42,.13)',
      sh:s.ack[i]?'inset 3px 0 0 rgba(215,79,55,.8), 0 6px 24px rgba(61,30,20,.025)':'0 6px 24px rgba(61,30,20,.025)',
      dotBg:s.ack[i]?'#C4381F':'rgba(255,255,255,.7)', dotBd:s.ack[i]?'#C4381F':'rgba(96,55,42,.2)', dotFg:s.ack[i]?'#FFF8F3':'transparent',
      meta:s.ack[i]?'READ ✓':'MARK AS READ', metaFg:s.ack[i]?'#C4381F':'rgba(110,64,48,.42)',
      toggle:()=>{ const a=[...s.ack]; a[i]=!a[i]; this.save({ack:a}); } }));
    const compactEn=[
      'The applicant records their own particulars, attests to their accuracy, and bears the consequence of anything shown to be otherwise.',
      'One file with one number is opened for each registrant; no single person holds two files.',
      'Every event in the file is entered with its date, neither amended nor deleted, and the registrant may view their whole record.',
      'Verification assigns no work, and passing it creates no right to an engagement; engagement is a separate decision governed by suitability and readiness.',
      'No work begins without a signed scope and an escrow funded with a trustee; anything otherwise is not work through Kayan.',
      'The tiers are climbed on evidence: identity verified, then capability measured, then delivery accepted, then trust granted and renewed.',
      'Each tier lapses at its published term and is renewed by evidence, not by claim; lapsing carries no stigma.',
      'No adverse decision is taken automatically; it is signed by a named officer with a written reason, and the applicant has one appeal within twenty-one days, heard independently.',
      'Referees are contacted directly, the applicant is not shown their statements, and a sample of statements is checked by telephone each month.',
      'Images of identity documents are deleted once verification is complete, and a digital fingerprint is retained to prove it was carried out.',
      'Disbursement details are used only at the first payment due, and payment is made through official channels; no payment by personal remittance or digital currency.',
      'Every applicant is treated by what they do, not by how they are described; no social or categorical descriptions are entered in the file.',
      "The relationship is governed by Kayan's published policies and the law of the Republic of Yemen, and the Arabic version prevails on any divergence.",
      'The file may be closed at its holder\'s request at any time, and their data is deleted except what the law requires to be kept.'
    ].map((t,i)=>({n:i+1,t}));
    const compactAr=[
      'يسجل المتقدم بياناته بنفسه، ويقر بصحتها، ويتحمل أثر ما يثبت خلافه.',
      'يفتح لكل مسجل ملف واحد برقم واحد؛ ولا يجمع الشخص الواحد بين ملفين.',
      'يقيد كل حدث في الملف قيدا مؤرخا لا يعدل ولا يحذف، وللمسجل الاطلاع على سجله كاملا.',
      'لا يخصص التحقق عملا، ولا ينشئ اجتيازه حقا في تكليف؛ التكليف بقرار مستقل تحكمه الملاءمة والجاهزية.',
      'لا يبدأ عمل إلا بنطاق موقع وضمان ممول لدى طرف أمين؛ وما عدا ذلك ليس عملا عبر كيان.',
      'تصعد الدرجات بالدليل: هوية تثبت، ثم قدرة تقاس، ثم تسليم يقبل، ثم ائتمان يمنح ويجدد.',
      'تنقضي صلاحية كل درجة بمدتها المعلنة، ويجدد بالإثبات لا بالمطالبة؛ والانقضاء بلا وصم.',
      'لا يتخذ قرار سلبي آليا؛ يوقعه موظف مسمى بسبب مكتوب، وللمتقدم تظلم واحد خلال واحد وعشرين يوما ينظر باستقلال.',
      'يخاطب المزكون مباشرة، ولا يطلع المتقدم على إفاداتهم، وتفحص عينة من الإفادات هاتفيا كل شهر.',
      'تحذف صور وثائق الهوية بعد اكتمال التحقق، ويحتفظ ببصمة رقمية تثبت إجراءه.',
      'تستخدم بيانات الصرف عند أول مستحق فقط، ويصرف عبر القنوات الرسمية؛ ولا صرف عبر حوالات شخصية أو عملات رقمية.',
      'يعامل كل متقدم بما يفعل لا بما يوصف به؛ ولا تقيد في الملف أوصاف اجتماعية أو فئوية.',
      'تحكم العلاقة سياسات كيان المنشورة وقانون الجمهورية اليمنية، وتفسر النسخة العربية عند أي اختلاف.',
      'يجوز إغلاق الملف بطلب صاحبه في أي وقت، وتحذف بياناته عدا ما يوجب القانون حفظه.'
    ].map((t,i)=>({n:i+1,t}));
    const compact = arL ? compactAr : compactEn;
    const q1 = arL
      ? ['نعم، من يجتاز التحقق يضمن تكليفا.','لا — التحقق يثبت القدرة، والتكليف قرار مستقل.','يضمن أولوية دائمة في كل عمل.']
      : ['Yes — whoever passes verification is guaranteed an engagement.','No — verification establishes capability; engagement is a separate decision.','It guarantees permanent priority on every engagement.'];
    const q2 = arL
      ? ['بمجرد تقديم الطلب.','بعد توقيع النطاق وتمويل الضمان.','بعد مكالمة تعارف.']
      : ['As soon as the application is submitted.','After the scope is signed and the escrow funded.','After an introductory call.'];
    const mkQ=(arr,key,correct)=>arr.map((t,i)=>({t, pick:()=>this.save({[key]:i}), bg:s[key]===i?(i===correct?'rgba(255,98,80,.18)':'rgba(224,82,60,.14)'):'rgba(250,246,236,.05)', bd:s[key]===i?(i===correct?'#FF6250':'#E0523C'):'rgba(250,246,236,.2)', fg:'#FAF6EC'}));
    const okNow=this.stageOk(s.stage);
    const idn=s.idn, acc=s.acc, p=s.prof;
    return {
      ...(arL ? S_AR : S_EN),
      rootRef: this.rootRef,
      isAr: arL, isEn: !arL,
      pickAr: ()=>this.setLang('ar'), pickEn: ()=>this.setLang('en'),
      arBg: arL?'linear-gradient(135deg,#D0402F,#FF8A6B)':'transparent', arFg: arL?'#2E0F0A':'rgba(250,246,236,.72)',
      enBg: !arL?'linear-gradient(135deg,#D0402F,#FF8A6B)':'transparent', enFg: !arL?'#2E0F0A':'rgba(250,246,236,.72)',
      cSel: COMPOSE.cSel(arL, s.specs.length),
      cPod: COMPOSE.cPod(arL, s.pod.members.length),
      cPermNo: arL ? ('رقمك الدائم — يحفظ ويذكر في كل مراسلة. قيد الطلب بتاريخ '+s.submittedAt+'.') : ('Your permanent number — keep it and quote it in every exchange. The application was entered on '+s.submittedAt+'.'),
      gridRef:this.gridRef, rail, progressPct: Math.round((s.stage/13)*100)+'%',
      st0:s.stage===0, st1:s.stage===1, st2:s.stage===2, st3:s.stage===3,
      st4:s.stage===4, st5:s.stage===5, st6:s.stage===6, st7:s.stage===7, st8:s.stage===8, st9:s.stage===9, st10:s.stage===10, st11:s.stage===11, st12:s.stage===12, st13:s.stage===13,
      next:()=>{ const n=s.stage+1; if(n<=12 || s.submitted) this.go(n); }, back:()=>this.go(Math.max(0,s.stage-1)),
      nextBg: okNow?'linear-gradient(135deg,#D0402F,#FF8A6B)':'#E7D9CA', nextFg: okNow?'#2E0F0A':'#7E6759', nextCursor:'pointer',
      resetAll:()=>{ if(confirm('يمسح كل ما أدخل في هذا الجهاز. متابعة؟')){ try{localStorage.removeItem('kayan-apply-v1');}catch(e){} this.stopCam(); this.setState(this.blank()); } },
      ackCards, compact, termsRef:this.termsRef, railRef:this.railRef,
      scrollHint: s.termsDone?'READ ✓':'SCROLL TO END', scrollHintColor: s.termsDone?'#C4381F':'#C0412A',
      toggleHonesty:()=>{ if(s.termsDone) this.save({honesty:!s.honesty}); },
      honestyOn:s.honesty, honestyMark:s.honesty?'✓':'', honestyBoxBd:s.honesty?'#C4381F':'#CDB9A7', honestyBoxBg:s.honesty?'#C4381F':'transparent',
      honestyCursor:s.termsDone?'pointer':'not-allowed', honestyOpacity:s.termsDone?'1':'.45', honestyNote: s.termsDone?'':(arL?'(يفتح الإقرار بعد بلوغ نهاية الميثاق)':'(the acknowledgement opens once the charter is read to its end)'),
      q1opts:mkQ(q1,'q1',1), q2opts:mkQ(q2,'q2',1),
      compFeedback: (s.q1===null&&s.q2===null)?'':(!arL ? ((s.q1===1&&s.q2===1)?'Correct — that is the heart of the relationship.':'Look again: the two correct answers express that verification establishes capability, and that work begins only with a signed scope and a funded escrow.') : ( (s.q1===1&&s.q2===1)?'أصبت — هذا جوهر العلاقة.': 'يعاد النظر: الإجابتان الصحيحتان تعبران عن فصل التحقق عن التكليف، وقاعدة النطاق والضمان.')),
      st0Hint:this.hint(0), st1Hint:this.hint(1), st2Hint:this.hint(2), st3Hint:this.hint(3),
      accName:acc.name, setAccName:e=>this.save({acc:{...acc,name:e.target.value}}),
      accWa:acc.wa, setAccWa:e=>this.save({acc:{...acc,wa:e.target.value}}),
      accEmail:acc.email, setAccEmail:e=>this.save({acc:{...acc,email:e.target.value}}),
      accPw:acc.pw, setAccPw:e=>this.save({acc:{...acc,pw:e.target.value}}),
      codeSent:acc.codeSent, accCode:acc.code,
      setAccCode:e=>{ const v=e.target.value.replace(/\D/g,'').slice(0,4); this.save({acc:{...acc,code:v,codeOk:v==='2026'}}); },
      sendCode:()=>{ if(acc.wa.replace(/\D/g,'').length>=9) this.save({acc:{...acc,codeSent:true}}); },
      codeBtnLabel: acc.codeOk?(arL?'تأكد ✓':'Confirmed ✓'):(acc.codeSent?(arL?'أعد الإرسال':'Send again'):(arL?'أرسل رمز التحقق':'Send the code')),
      codeBtnBg: acc.codeOk?'#C4381F':'transparent', codeBtnFg: acc.codeOk?'#FAF6EC':'#C4381F',
      codeHint: arL
        ? (acc.codeOk?'أكدت القناة — يقيد التأكيد في سجلك.':(acc.codeSent?'أرسل رمز إلى واتساب (في بيئة العرض: 2026).':'يرسل رمز من أربعة أرقام إلى واتساب لتأكيد القناة.'))
        : (acc.codeOk?'The channel is confirmed — the confirmation is entered in your record.':(acc.codeSent?'A code was sent to WhatsApp (in this demo: 2026).':'A four-digit code is sent to WhatsApp to confirm the channel.')),
      idLegal:idn.legal, setIdLegal:e=>this.save({idn:{...idn,legal:e.target.value}}),
      idDob:idn.dob, setIdDob:e=>this.save({idn:{...idn,dob:e.target.value}}),
      idSex:idn.sex, setIdSex:e=>this.save({idn:{...idn,sex:e.target.value}}),
      idNat:idn.nat, setIdNat:e=>this.save({idn:{...idn,nat:e.target.value}}),
      idGov:idn.gov, setIdGov:e=>this.save({idn:{...idn,gov:e.target.value}}),
      idCity:idn.city, setIdCity:e=>this.save({idn:{...idn,city:e.target.value}}),
      idCountry:idn.country, setIdCountry:e=>this.save({idn:{...idn,country:e.target.value}}),
      abroadOn: idn.gov==='خارج اليمن',
      idType:idn.type, setIdType:e=>this.save({idn:{...idn,type:e.target.value}}),
      idNum:idn.num, setIdNum:e=>this.save({idn:{...idn,num:e.target.value}}),
      idExp:idn.exp, setIdExp:e=>this.save({idn:{...idn,exp:e.target.value}}),
      govOpts:R.governorates.map((g,gi)=>({v:g, t:(this.ar()?g:((R.governoratesEn||[])[gi]||g))})),
      idTypeOpts:R.idTypes.map(t=>({v:t.a, t:this.pick(t,'a','e')})),
      pickFront:e=>{ const f=e.target.files&&e.target.files[0]; this.checkImage(f,800,(ok,msg)=>this.save({idn:{...this.state.idn,front:msg,frontOk:ok}})); },
      pickBack:e=>{ const f=e.target.files&&e.target.files[0]; this.checkImage(f,800,(ok,msg)=>this.save({idn:{...this.state.idn,back:msg,backOk:ok}})); },
      frontMsg: idn.front||(arL?'لم يرفع بعد.':'Not uploaded yet.'), frontMsgColor: idn.frontOk?'#C4381F':(idn.front?'#BC3521':'#8B7565'),
      backMsg: idn.back||(arL?'اختياري لجواز السفر.':'Optional for a passport.'), backMsgColor: idn.backOk?'#C4381F':(idn.back?'#BC3521':'#8B7565'),
      videoRef:this.videoRef, videoDisp: s.camOn?'block':'none', camIdle: !s.camOn && !idn.selfie,
      selfieHas: !!idn.selfie && !s.camOn, selfieRef:this.selfieRef,
      selfieRing: idn.selfieOk?'#FF6250':(idn.selfie?'#FF8A6B':'rgba(250,246,236,.3)'),
      camPrompt:s.camPrompt|| (idn.selfieOk?(arL?'الصورة الحية مقبولة ✓':'The live photo is accepted ✓'):(arL?'الكاميرا لم تفتح بعد':'The camera is not open yet')),
      camBtnLabel: s.camOn?(arL?'إيقاف الكاميرا':'Stop the camera'):(idn.selfie?(arL?'إعادة الالتقاط':'Retake'):(arL?'فتح الكاميرا':'Open the camera')),
      camOn:s.camOn, startCam:()=>this.startCam(), snapSelfie:()=>this.snapSelfie(), pickSelfie:e=>this.pickSelfie(e),
      liveChecks: (idn.selfieChecks.length?idn.selfieChecks:[{t:'LIGHT',ok:null},{t:'RES ≥480',ok:null},{t:'FACE',ok:null},{t:'LIVE',ok:null}]).map(c=>({t:c.t, bd:c.ok===null?'rgba(250,246,236,.25)':(c.ok?'#FF6250':'#E0523C'), fg:c.ok===null?'rgba(250,246,236,.55)':(c.ok?'#FFC3B4':'#F4B5A4')})),
      pEdu:p.edu,setPEdu:e=>this.save({prof:{...p,edu:e.target.value}}), pYears:p.years,setPYears:e=>this.save({prof:{...p,years:e.target.value}}),
      pStatus:p.status,setPStatus:e=>this.save({prof:{...p,status:e.target.value}}), pHours:p.hours,setPHours:e=>this.save({prof:{...p,hours:e.target.value}}),
      pDevice:p.device,setPDevice:e=>this.save({prof:{...p,device:e.target.value}}), pNet:p.net,setPNet:e=>this.save({prof:{...p,net:e.target.value}}),
      pPower:p.power,setPPower:e=>this.save({prof:{...p,power:e.target.value}}), pBackup:p.backup,setPBackup:e=>this.save({prof:{...p,backup:e.target.value}}),
      ...this.valsSpecs(), ...this.valsLangs(), ...this.valsDocs(), ...this.valsPod(), ...this.valsK4y(), ...this.valsRefs(), ...this.valsPay(), ...this.valsConsent(), ...this.valsReview()
    };
  }
  valsSpecs(){
    const s=this.state,R=this.reg(); const q=s.search.trim();
    let results=[];
    if(q.length>=2){ R.families.forEach((f,fi)=>f.specs.forEach((sp,si)=>{ if(sp.a.includes(q)||(sp.e||'').toLowerCase().includes(q.toLowerCase())||(sp.m||[]).some(m=>(Array.isArray(m)?m.join(' '):m).toLowerCase().includes(q.toLowerCase()))) results.push({f,fi,sp,si}); })); results=results.slice(0,14); }
    const picked=s.specs;
    const addSpec=(fi,si)=>{ const f=R.families[fi],sp=f.specs[si]; if(picked.length>=5||picked.some(x=>x.fi===fi&&x.si===si))return;
      this.save({specs:[...picked,{fi,si,fam:f.a,famC:f.c,name:sp.a,en:sp.e,micros:[],rating:0}],search:''}); };
    return {
      specSearch:s.search, setSpecSearch:e=>this.save({search:e.target.value}),
      specResults:results.map(r=>({ t:this.ar()?r.sp.a:(r.sp.e||r.sp.a), sub:this.ar()?r.f.a:(r.f.e||r.f.a), code:r.f.c+'-'+('0'+(r.si+1)).slice(-2), add:()=>addSpec(r.fi,r.si) })),
      specResultsOn: results.length>0,
      noMatch: q.length>=2 && results.length===0,
      proposeTerm:()=>{ if(q){ this.save({proposals:[...s.proposals,q],search:''}); } },
      proposals:s.proposals, proposalsOn:s.proposals.length>0,
      famList:R.families.map((f,fi)=>({ c:f.c,
        a:this.ar()?f.a:(f.e||f.a),
        e:this.ar()?(f.e||''):(f.a||''),
        altDir:this.ar()?'ltr':'rtl',
        altFont:this.ar()?"'IBM Plex Mono',monospace":"'IBM Plex Sans Arabic',sans-serif",
        rule:s.famOpen===fi?'#FF8A6B':'rgba(208,64,47,.4)',
        codeFg:s.famOpen===fi?'#FF8A6B':'#C4381F',
        metaFg:s.famOpen===fi?'rgba(250,246,236,.6)':'rgba(110,64,48,.55)', n:f.specs.length, open:s.famOpen===fi,
        toggle:()=>this.save({famOpen:s.famOpen===fi?-1:fi}),
        bg:s.famOpen===fi?'#3C1610':'#FFFFFF', fg:s.famOpen===fi?'#FAF6EC':'#3A1B12', bd:s.famOpen===fi?'#3C1610':'#E3D5C6',
        specs: s.famOpen===fi ? f.specs.map((sp,si)=>{ const on=picked.some(x=>x.fi===fi&&x.si===si);
          return { t:this.ar()?sp.a:(sp.e||sp.a), code:sp.code||'', on, tick:on?'✓':'', add:()=>addSpec(fi,si) }; }) : [] })),
      pickedSpecs:picked.map((x,i)=>{ const fmy=(R.families[x.fi])||{a:x.fam,e:x.fam,specs:[]};
        const sp=(fmy.specs&&fmy.specs[x.si])||{a:x.name,e:x.en||x.name,m:[]};
        return { name:this.ar()?x.name:(sp.e||x.name), fam:this.ar()?x.fam:(fmy.e||x.fam), code:x.famC+'-'+('0'+(x.si+1)).slice(-2), primary:i===0,
          badge:this.ar()?(i===0?'رئيس':'ثانوي '+i):(i===0?'Primary':'Secondary '+i), remove:()=>{ const a=[...picked]; a.splice(i,1); this.save({specs:a}); },
          makePrimary:()=>{ const a=[...picked]; const [it]=a.splice(i,1); a.unshift(it); this.save({specs:a}); },
          hasMicros:(sp.m||[]).length>0,
          micros: (sp.m||[]).map(mm=>{ const m=Array.isArray(mm)?mm[0]:mm; const t=this.ar()?m:(Array.isArray(mm)?(mm[1]||m):m);
            return { t, on:x.micros.includes(m), toggle:()=>{ const a=[...picked]; const set=new Set(a[i].micros); set.has(m)?set.delete(m):set.add(m); a[i]={...a[i],micros:[...set]}; this.save({specs:a}); } }; }),
          microCount:x.micros.length,
          cMicro: COMPOSE.cMicro(this.ar(), x.micros.length),
          rating:[1,2,3,4,5].map(r=>({ n:r, cGrade: COMPOSE.cGrade(this.ar(), r), bd:x.rating>=r?'#D0402F':'#E3D5C6', bg:x.rating>=r?'#FDF6EC':'transparent', pick:()=>{ const a=[...picked]; a[i]={...a[i],rating:r}; this.save({specs:a}); } })),
          ratingLabel:(this.ar()?['','مبتدئ — أتعلم','أنجز بإشراف','أنجز مستقلا','أنجز وأراجع لغيري','مرجع في المجال']:['','Beginner — learning','Deliver under supervision','Deliver independently','Deliver and review for others','A reference in the field'])[x.rating]||'' };
      }),
      pickedOn:picked.length>0, specCount:picked.length, st4Hint:this.hint(4)
    };
  }
  valsLangs(){
    const s=this.state,R=this.reg();
    return {
      langRows:s.langs.map((l,i)=>({
        langOpts:R.languages.map((x,li)=>({v:x,t:this.list(R.languages,R.languagesEn)[li]||x})), lang:l.lang, setLang:e=>{const a=[...s.langs];a[i]={...l,lang:e.target.value};this.save({langs:a});},
        levelOpts:R.langLevels.map(x=>{const nm=this.pick(x,'a','e'),dd=this.pick(x,'d','eD');return {v:x.c,t:nm+(x.c!=='N'?' ('+x.c+')':'')+(dd?' — '+dd:'')};}), level:l.level, setLevel:e=>{const a=[...s.langs];a[i]={...l,level:e.target.value};this.save({langs:a});},
        proofOpts:R.langProof.map(x=>({v:x.k,t:this.pick(x,'a','e')})), proof:l.proof, setProof:e=>{const a=[...s.langs];a[i]={...l,proof:e.target.value};this.save({langs:a});},
        proofDesc:this.pick(R.langProof.find(x=>x.k===l.proof),'d','eD'),
        certOn:l.proof==='cert',
        pickCert:e=>{ const f=e.target.files&&e.target.files[0]; if(f){const a=[...s.langs];a[i]={...l,cert:f.name};this.save({langs:a});} },
        certName:l.cert||'لم ترفع شهادة بعد.',
        remove:()=>{ const a=[...s.langs]; a.splice(i,1); this.save({langs:a}); }, removable:s.langs.length>1
      })),
      addLang:()=>this.save({langs:[...s.langs,{lang:'',level:'',proof:'self',cert:''}]}),
      st5Hint:this.hint(5)
    };
  }
  valsDocs(){
    const s=this.state,R=this.reg();
    return {
      docKindOpts:R.docKinds,
      addDoc:e=>{ const f=e.target.files&&e.target.files[0]; if(!f)return;
        if(f.size>10*1048576){ alert('الملف يتجاوز 10MB'); return; }
        this.save({docs:[...s.docs,{kind:R.docKinds[0],issuer:'',year:'',file:f.name,size:this.fmtBytes(f.size)}]}); e.target.value=''; },
      docRows:s.docs.map((d,i)=>({ file:d.file, size:d.size,
        kind:d.kind, setKind:e=>{const a=[...s.docs];a[i]={...d,kind:e.target.value};this.save({docs:a});},
        issuer:d.issuer, setIssuer:e=>{const a=[...s.docs];a[i]={...d,issuer:e.target.value};this.save({docs:a});},
        year:d.year, setYear:e=>{const a=[...s.docs];a[i]={...d,year:e.target.value};this.save({docs:a});},
        remove:()=>{const a=[...s.docs];a.splice(i,1);this.save({docs:a});} })),
      docsOn:s.docs.length>0,
      linkRows:s.links.map((l,i)=>({ v:l, set:e=>{const a=[...s.links];a[i]=e.target.value;this.save({links:a});}, remove:()=>{const a=[...s.links];a.splice(i,1);this.save({links:a.length?a:['']});} })),
      addLink:()=>this.save({links:[...s.links,'']}),
      st6Hint:this.hint(6)
    };
  }
  valsPod(){
    const s=this.state,pod=s.pod;
    return {
      podOn:pod.on, podOff:!pod.on,
      podYes:()=>this.save({pod:{...pod,on:true}}), podNo:()=>this.save({pod:{...pod,on:false}}),
      podYesBg:pod.on?'#C4381F':'#FFFFFF', podYesFg:pod.on?'#FAF6EC':'#3A1B12', podNoBg:!pod.on?'#C4381F':'#FFFFFF', podNoFg:!pod.on?'#FAF6EC':'#3A1B12',
      podName:pod.name, setPodName:e=>this.save({pod:{...pod,name:e.target.value}}),
      podSplit:pod.split, setPodSplit:e=>this.save({pod:{...pod,split:e.target.value}}),
      podMembers:pod.members.map((m,i)=>({ cMember: COMPOSE.cMember(this.ar(), i+1),
        name:m.name, setName:e=>{const a=[...pod.members];a[i]={...m,name:e.target.value};this.save({pod:{...pod,members:a}});},
        wa:m.wa, setWa:e=>{const a=[...pod.members];a[i]={...m,wa:e.target.value};this.save({pod:{...pod,members:a}});},
        role:m.role, setRole:e=>{const a=[...pod.members];a[i]={...m,role:e.target.value};this.save({pod:{...pod,members:a}});},
        no:i+1, remove:()=>{const a=[...pod.members];a.splice(i,1);this.save({pod:{...pod,members:a}});}, removable:pod.members.length>2
      })),
      addMember:()=>{ if(pod.members.length<6) this.save({pod:{...pod,members:[...pod.members,{name:'',wa:'',role:'منفذ'}]}}); },
      podCount:pod.members.length, st7Hint:this.hint(7)
    };
  }
  valsK4y(){
    const s=this.state,k=s.k4y;
    const fields=['التعليم ومحو الأمية','الصحة المجتمعية','البيئة والنظافة','التراث والتوثيق','الإغاثة الرقمية','تمكين النساء اقتصاديا','تدريب الشباب','دعم ذوي الإعاقة','المياه والإصحاح','الثقافة والفنون'];
    return {
      k4yYes:()=>this.save({k4y:{...k,on:true}}), k4yNo:()=>this.save({k4y:{...k,on:false}}),
      k4yYesBg:k.on===true?'#A8431C':'#FFFFFF', k4yYesFg:k.on===true?'#FAF6EC':'#3A1B12',
      k4yNoBg:k.on===false?'#6E5C51':'#FFFFFF', k4yNoFg:k.on===false?'#FAF6EC':'#3A1B12',
      k4yOpen:k.on===true,
      k4yFields:fields.map(f=>({ t:f, on:k.fields.includes(f), toggle:()=>{ const set=new Set(k.fields); set.has(f)?set.delete(f):set.add(f); this.save({k4y:{...k,fields:[...set]}}); } })),
      k4yHours:k.hours, setK4yHours:e=>this.save({k4y:{...k,hours:e.target.value}}),
      k4yGovs:this.reg().governorates.filter(g=>g!=='خارج اليمن').map(g=>({ t:g, on:k.govs.includes(g), toggle:()=>{ const set=new Set(k.govs); set.has(g)?set.delete(g):set.add(g); this.save({k4y:{...k,govs:[...set]}}); } })),
      k4yPrior:k.prior, setK4yPrior:e=>this.save({k4y:{...k,prior:e.target.value}}),
      k4yWhy:k.why, setK4yWhy:e=>this.save({k4y:{...k,why:e.target.value}}),
      st8Hint:this.hint(8)
    };
  }
  valsRefs(){
    const s=this.state,R=this.reg();
    return {
      refRules:this.ar()?R.refRules:(R.refRulesEn||R.refRules),
      cRefRules: this.ar() ? ('مزكيان إلى ثلاثة. '+(R.refRules||'')) : ('Two to three referees. '+(R.refRulesEn||R.refRules||'')),
      refRows:s.refs.map((r,i)=>({ cRef: COMPOSE.cRef(this.ar(), i+1),
        no:i+1, name:r.name, setName:e=>{const a=[...s.refs];a[i]={...r,name:e.target.value};this.save({refs:a});},
        relOpts:this.list(R.refRelations,R.refRelationsEn), rel:r.rel, setRel:e=>{const a=[...s.refs];a[i]={...r,rel:e.target.value};this.save({refs:a});},
        org:r.org, setOrg:e=>{const a=[...s.refs];a[i]={...r,org:e.target.value};this.save({refs:a});},
        phone:r.phone, setPhone:e=>{const a=[...s.refs];a[i]={...r,phone:e.target.value};this.save({refs:a});},
        email:r.email, setEmail:e=>{const a=[...s.refs];a[i]={...r,email:e.target.value};this.save({refs:a});},
        work:r.work, setWork:e=>{const a=[...s.refs];a[i]={...r,work:e.target.value};this.save({refs:a});},
        status:this.ar()?r.status:({'مسودة':'Draft','أرسل الطلب':'Request sent','وردت الإفادة':'Statement received'}[r.status]||r.status), stBg: r.status==='وردت الإفادة'?'#FDECE5':(r.status==='أرسل الطلب'?'#FDF6EC':'#F6EFE2'),
        stFg: r.status==='وردت الإفادة'?'#C4381F':(r.status==='أرسل الطلب'?'#B8381F':'#8B7565'),
        remove:()=>{const a=[...s.refs];a.splice(i,1);this.save({refs:a});}, removable:s.refs.length>2
      })),
      addRef:()=>{ if(s.refs.length<3) this.save({refs:[...s.refs,{name:'',rel:'',org:'',phone:'',email:'',work:'',status:'مسودة'}]}); },
      refsCount:s.refs.length,
      sendRefs:()=>{ const a=s.refs.map(r=> (r.name&&r.rel&&(r.phone||r.email)&&r.work)?{...r,status:'أرسل الطلب'}:r ); this.save({refs:a}); },
      simulateFetch:()=>{ const a=s.refs.map(r=> r.status==='أرسل الطلب'?{...r,status:'وردت الإفادة'}:r ); this.save({refs:a}); },
      anySent:s.refs.some(r=>r.status!=='مسودة'),
      refStatusLabel:(st)=>this.ar()?st:({'مسودة':'Draft','أرسل الطلب':'Request sent','وردت الإفادة':'Statement received'}[st]||st),
      st9Hint:this.hint(9)
    };
  }
  valsPay(){
    const s=this.state,R=this.reg(),pay=s.pay;
    return {
      bankNote:R.meta?(this.ar()?R.meta.note:(R.meta.noteEn||R.meta.note)):'', walletNote:this.ar()?R.walletNote:(R.walletNoteEn||R.walletNote),
      bankChips:R.banks.map(b=>({ t:this.ar()?b.a:(b.e||b.a), alt:this.ar()?'':b.a, altOn:!this.ar(),
        sub:this.ar()?(b.t+(b.note?' · '+b.note:'')):((b.eT||b.t)+(b.eNote?' · '+b.eNote:'')), on:pay.banks.includes(b.a),
        toggle:()=>{ const set=new Set(pay.banks); set.has(b.a)?set.delete(b.a):set.add(b.a); this.save({pay:{...pay,banks:[...set]}}); } })),
      bankAccs:pay.banks.map(name=>{ const a=pay.accs[name]||{name:'',num:'',branch:''};
        const set=(k)=>e=>{ this.save({pay:{...pay,accs:{...pay.accs,[name]:{...a,[k]:e.target.value}}}}); };
        return { bank:name, accName:a.name, setAccName:set('name'), accNum:a.num, setAccNum:set('num'), branch:a.branch, setBranch:set('branch') }; }),
      bankAccsOn:pay.banks.length>0,
      walletChips:R.wallets.map(w=>({ t:this.ar()?w.a:(w.e||w.a), alt:this.ar()?'':w.a, altOn:!this.ar(), on:pay.wallets.includes(w.a), toggle:()=>{ const set=new Set(pay.wallets); set.has(w.a)?set.delete(w.a):set.add(w.a); this.save({pay:{...pay,wallets:[...set]}}); } })),
      st10Hint:this.hint(10)
    };
  }
  valsConsent(){
    const s=this.state,R=this.reg();
    return {
      consentRows:R.consents.map((c,i)=>({ t:this.pick(c,'t','eT'), b:this.pick(c,'b','eB'), req:c.req, tag:this.ar()?(c.req?'واجبة':'اختيارية'):(c.req?'REQUIRED':'OPTIONAL'),
        tagBg:c.req?'#3C1610':'#EBE1D2', tagFg:c.req?'#FF8A6B':'#6E5C51',
        on:s.consents[i], mark:s.consents[i]?'✓':'', boxBd:s.consents[i]?'#C4381F':'#CDB9A7', boxBg:s.consents[i]?'#C4381F':'transparent',
        toggle:()=>{ const a=[...s.consents]; a[i]=!a[i]; this.save({consents:a}); } })),
      st11Hint:this.hint(11)
    };
  }
  checkDigit(digits){ const w=[8,7,6,5,4,3,2]; let sum=0; for(let i=0;i<7;i++) sum+=w[i]*(+digits[i]||0); const r=(11-(sum%11))%11; return r===10?'X':String(r); }
  valsReview(){
    const s=this.state,R=this.reg();
    const rows=[]; const arL=this.ar();
    const stat=(st)=>arL?st:({'مسودة':'Draft','أرسل الطلب':'Request sent','وردت الإفادة':'Statement received'}[st]||st);
    const lvl=(l)=>l==='N'?(arL?'أم':'Native'):l;
    if(s.stage>=12||s.submitted){
      const K=arL
        ? ['الحساب','الهوية','الملف المهني','التخصصات','اللغات','الإثباتات','الفريق الجاهز','كيان لليمن','المزكون','الصرف','الموافقات']
        : ['Account','Identity','Professional profile','Specialisations','Languages','Evidence','Ready pod','Kayan for Yemen','Referees','Payment','Consents'];
      rows.push({k:K[0],v:s.acc.name+' · '+s.acc.wa+' · '+s.acc.email,go:()=>this.go(1)});
      const govI=(R.governorates||[]).indexOf(s.idn.gov);
      const govT=(!arL&&govI>=0&&R.governoratesEn)?R.governoratesEn[govI]:s.idn.gov;
      const tI=(R.idTypes||[]).findIndex(x=>x.a===s.idn.type);
      const tT=(!arL&&tI>=0)?(R.idTypes[tI].e||s.idn.type):s.idn.type;
      rows.push({k:K[1],v:s.idn.legal+' · '+tT+' '+s.idn.num+' · '+govT+(s.idn.gov==='خارج اليمن'?' ('+s.idn.country+')':''),go:()=>this.go(2)});
      rows.push({k:K[2],v:arL
        ? (s.prof.edu+' · خبرة '+s.prof.years+' · '+s.prof.hours+' ساعة أسبوعيا · '+s.prof.device)
        : (s.prof.edu+' · '+s.prof.years+' experience · '+s.prof.hours+' hours weekly · '+s.prof.device),go:()=>this.go(3)});
      rows.push({k:K[3],v:s.specs.map((x,i)=>{const sp=((R.families[x.fi]||{}).specs||[])[x.si]||{};const nm=arL?x.name:(sp.e||x.en||x.name);
        return (i===0?'★ ':'')+nm+' ('+x.micros.length+(arL?' دقيقا':' micro')+')';}).join(' · ')||'—',go:()=>this.go(4)});
      rows.push({k:K[4],v:s.langs.map(l=>{const li=(R.languages||[]).indexOf(l.lang);
        const nm=(!arL&&li>=0&&R.languagesEn)?R.languagesEn[li]:l.lang; return nm+' '+lvl(l.level);}).join(' · '),go:()=>this.go(5)});
      rows.push({k:K[5],v:arL
        ? (s.docs.length+' مستند · '+s.links.filter(x=>x.trim()).length+' رابط')
        : (s.docs.length+' documents · '+s.links.filter(x=>x.trim()).length+' links'),go:()=>this.go(6)});
      rows.push({k:K[6],v:s.pod.on
        ? (arL?('فريق «'+s.pod.name+'» — '+s.pod.members.filter(m=>m.name).length+' أعضاء'):('Pod "'+s.pod.name+'" — '+s.pod.members.filter(m=>m.name).length+' members'))
        : (arL?'تسجيل فردي':'Registering alone'),go:()=>this.go(7)});
      rows.push({k:K[7],v:s.k4y.on
        ? (arL?('نعم — '+s.k4y.fields.join('، ')+' · '+s.k4y.hours+' ساعة شهريا'):('Yes — '+s.k4y.fields.join(', ')+' · '+s.k4y.hours+' hours monthly'))
        : (arL?'ليس الآن':'Not now'),go:()=>this.go(8)});
      rows.push({k:K[8],v:s.refs.filter(r=>r.name).map(r=>r.name+' ('+r.rel+') — '+stat(r.status)).join(' · '),go:()=>this.go(9)});
      const bankT=(nm)=>{const b=(R.banks||[]).find(x=>x.a===nm); return (!arL&&b)?(b.e||nm):nm;};
      const walT=(nm)=>{const w=(R.wallets||[]).find(x=>x.a===nm); return (!arL&&w)?(w.e||nm):nm;};
      rows.push({k:K[9],v:s.pay.banks.map(bankT).join(' · ')+(s.pay.wallets.length?(arL?' + محافظ: ':' + wallets: ')+s.pay.wallets.map(walT).join(arL?'، ':', '):''),go:()=>this.go(10)});
      rows.push({k:K[10],v:arL
        ? (s.consents.filter(Boolean).length+' من '+R.consents.length+' (الواجبة كلها مؤشرة)')
        : (s.consents.filter(Boolean).length+' of '+R.consents.length+' (every required one ticked)'),go:()=>this.go(11)});
    }
    const dpOk=!!s.dpConsent;
    return {
      reviewRows:rows,
      toggleConsent:()=>this.save({dpConsent:!s.dpConsent}),
      consentOn:dpOk, consentMark:dpOk?'✓':'',
      consentBd:dpOk?'#C4381F':'#CDB9A7', consentBg:dpOk?'#C4381F':'transparent',
      consentHint:dpOk?'':(this.ar()?'يلزم الإقرار قبل التقديم':'The acknowledgement is required before submitting'),
      submitOff:!dpOk, submitCursor:dpOk?'pointer':'not-allowed', submitOpacity:dpOk?'1':'.45',
      submitBg:dpOk?'linear-gradient(135deg,#D0402F,#FF8A6B)':'#E7D9CA', submitFg:dpOk?'#2E0F0A':'#9C8676',
      submit:()=>{ if(!this.stageOk(11)||!this.state.dpConsent) return;
        const seq=String(10000+Math.floor(Math.random()*89999)); const yy='26'; const id='KY-T-'+yy+'-'+seq+'-'+this.checkDigit(yy+seq);
        this.save({submitted:true, appId:id, submittedAt:new Date().toLocaleDateString('ar-YE',{year:'numeric',month:'long',day:'numeric'})},()=>this.go(13)); },
      appId:s.appId||'KY-T-26-—', submittedAt:s.submittedAt,
      cardName:(s.acc&&s.acc.name)||s.accName||'اسمك',
      outcomeSteps:[
        {t:'قيد الطلب',d:'قيد كامل الملف في السجل قيدا مؤرخا.',dot:'#D0402F'},
        {t:'فحص الهوية',d:'يفحص موظف التحقق الوثائق والصورة الحية خلال 3 أيام عمل.',dot:s.submitted?'#D0402F':'#FFFFFF'},
        {t:'إفادات المزكين',d:'تجلب الإفادات آليا فور تقديمها؛ تذكيرات في الأيام 3 و7 و12، وتنقضي الدعوة بعد 14 يوما.',dot:'#FFFFFF'},
        {t:'التقييم',d:'يحدد موعد التقييم المناسب لتخصصك الرئيس — حكم موقف، وبنك مهارة، ونص كتابي، ومهمة عملية.',dot:'#FFFFFF'},
        {t:'القرار',d:'موثق، أو معلومات إضافية، أو ليس بعد — بقرار مسبب واسم موظف، ولك تظلم خلال 21 يوما.',dot:'#FFFFFF'}
      ],
      goPortal:()=>{ this.props.navigate(this.props.routeForHref('Kayan Portal.dc.html')); }
    };
  }
}
