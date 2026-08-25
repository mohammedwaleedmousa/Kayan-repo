// kayan-card.js — «بطاقة كيان»: the physical Kayan Card, five tiers, one vertical format.
// Mount: <script src="./kayan-card.js"></script> in helmet, then
// <kayan-card tier="T2" name="سارة عبدالله الحكيمي" kid="KYN·TAL-2417·0001" deliveries="6" lang="ar"></kayan-card>
// Attributes: tier T0|T1|T2|T3|T4 · name · kid · role · deliveries · bar (0-100) · lang ar|en · flat (no flip) · scale
(function () {
  if (customElements.get('kayan-card')) return;

  var LOGO_DARK = 'assets/kayan-logo-dark.png';
  var LOGO_GOLD = 'assets/kayan-logo-gold.png';

  // Each tier keeps its own finish. The horizontal grain densifies as the record grows.
  var TIERS = {
    T0: {
      ar: 'مسجل', en: 'Registered', stamp: 'RECORD · EMPTY',
      face: 'linear-gradient(168deg,#E4DED1,#C6BFB0)', rail: '#B9B1A2', grain: 26,
      weave: 'repeating-linear-gradient(112deg,rgba(255,255,255,.22) 0 1px,transparent 1px 5px)',
      grainInk: 'rgba(62,58,49,.26)', word: '#3E3A31', meta: '#4F4A3F', tag: '#5C5648',
      lift: '0 1px 0 rgba(255,255,255,.55)', logo: LOGO_DARK, logoOpacity: '.88',
      back: '#3E3A31', accent: '#C6BFB0', backInk: '#F2EEE2', backMute: 'rgba(242,238,226,.72)',
      barTrack: 'rgba(242,238,226,.22)', shadow: '0 20px 50px rgba(5,46,43,.16)',
      deliveries: 0, bar: 0
    },
    T1: {
      ar: 'معرف', en: 'Identified', stamp: 'RECORD · OPENED',
      face: 'linear-gradient(168deg,#12897E,#095049)', rail: '#0E6E66', grain: 19,
      weave: 'repeating-linear-gradient(112deg,rgba(250,246,236,.09) 0 1px,transparent 1px 5px)',
      grainInk: 'rgba(250,246,236,.2)', word: '#FAF6EC', meta: 'rgba(250,246,236,.82)', tag: 'rgba(250,246,236,.7)',
      lift: '0 1px 1px rgba(0,0,0,.4)', logo: LOGO_GOLD, logoOpacity: '1',
      back: '#04332E', accent: '#12B5A4', backInk: '#FAF6EC', backMute: 'rgba(250,246,236,.72)',
      barTrack: 'rgba(250,246,236,.2)', shadow: '0 20px 52px rgba(14,110,102,.32)',
      deliveries: 2, bar: 8
    },
    T2: {
      ar: 'موثق', en: 'Verified', stamp: 'RECORD · VERIFIED',
      face: 'linear-gradient(158deg,#1ACBB7 0%,#109C8D 48%,#0A6B62 100%)', rail: '#12B5A4', grain: 13,
      weave: 'repeating-linear-gradient(112deg,rgba(250,246,236,.12) 0 1px,transparent 1px 5px)',
      grainInk: 'rgba(4,51,46,.24)', word: '#04332E', meta: '#07463F', tag: '#08514A',
      lift: '0 1px 0 rgba(255,255,255,.3)', logo: LOGO_GOLD, logoOpacity: '1',
      back: '#04332E', accent: '#12B5A4', backInk: '#FAF6EC', backMute: 'rgba(250,246,236,.72)',
      barTrack: 'rgba(250,246,236,.2)', shadow: '0 22px 56px rgba(18,181,164,.36)',
      deliveries: 6, bar: 23, tagWeight: '600'
    },
    T3: {
      ar: 'مثبت', en: 'Proven', stamp: 'RECORD · PROVEN',
      face: 'linear-gradient(158deg,#EFC95E 0%,#C9A227 46%,#9C7C14 100%)', rail: '#C9A227', grain: 9,
      weave: 'repeating-linear-gradient(104deg,rgba(255,255,255,.3) 0 .5px,rgba(0,0,0,.05) .5px 2px,transparent 2px 4px)',
      grainInk: 'rgba(59,47,6,.26)', word: '#3B2F06', meta: '#4A3B08', tag: '#5A480C',
      lift: '0 1px 0 rgba(255,255,255,.42)', logo: LOGO_DARK, logoOpacity: '1',
      back: '#3B2F06', accent: '#E9BE4B', backInk: '#FBF0D2', backMute: 'rgba(251,240,210,.75)',
      barTrack: 'rgba(251,240,210,.2)', shadow: '0 22px 56px rgba(201,162,39,.34)',
      deliveries: 14, bar: 54, tagWeight: '600'
    },
    T4: {
      ar: 'مؤتمن', en: 'Trusted', stamp: 'RECORD · TRUSTED',
      face: 'linear-gradient(168deg,#0B3F3A 0%,#052E2B 58%,#02100F 100%)',
      rail: 'linear-gradient(180deg,#E9BE4B,#12B5A4)', grain: 6,
      weave: 'repeating-linear-gradient(104deg,rgba(233,190,75,.14) 0 .5px,transparent .5px 3px)',
      grainInk: 'rgba(233,190,75,.16)', word: '#E9BE4B', meta: 'rgba(250,246,236,.84)', tag: '#E9BE4B',
      lift: '0 1px 2px rgba(0,0,0,.6)', logo: LOGO_GOLD, logoOpacity: '1',
      back: '#02100F', accent: '#E9BE4B', backInk: '#FAF6EC', backMute: 'rgba(250,246,236,.72)',
      barTrack: 'rgba(250,246,236,.18)',
      shadow: '0 26px 66px rgba(0,0,0,.5),0 0 0 1px rgba(233,190,75,.42)',
      deliveries: 24, bar: 92, tagWeight: '600', sheen: true, marks: true, motto: true
    }
  };

  var AR = {
    nameLabel: 'الاسم', accepted: 'سجل مقبول', verify: 'VERIFY · التحقق',
    deliveries: 'ACCEPTED DELIVERIES',
    note: 'تصدر هذه البطاقة عن سجل عمل موثق. صلاحيتها مرتبطة بالسجل، وتلغى بإلغائه.',
    noteT4: 'تصدر هذه البطاقة عن سجل عمل موثق. والعلامات الذهبية تمثل ساعات التطوع في كيان لليمن.',
    motto: 'خلف كل نجاح، كيان',
    flipHint: 'اقلب البطاقة لقراءة ظهرها'
  };
  var EN = {
    nameLabel: 'Name', accepted: 'accepted', verify: 'VERIFY',
    deliveries: 'ACCEPTED DELIVERIES',
    note: 'Issued from a verified work record. Its validity follows that record and lapses with it.',
    noteT4: 'Issued from a verified work record. The gold marks count volunteer hours in Kayan for Yemen.',
    motto: 'Behind every success, a Kayan.',
    flipHint: 'Flip the card to read its back'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function Card() { return Reflect.construct(HTMLElement, [], Card); }
  Card.prototype = Object.create(HTMLElement.prototype);
  Card.prototype.constructor = Card;

  Card.observedAttributes = ['tier', 'name', 'kid', 'role', 'deliveries', 'bar', 'lang', 'verify'];

  Card.prototype.attributeChangedCallback = function () { if (this._sh) this._paint(); };

  Card.prototype.connectedCallback = function () {
    if (!this._sh) this._sh = this.attachShadow({ mode: 'open' });
    this._paint();
  };

  Card.prototype._paint = function () {
    var sh = this._sh;
    var key = (this.getAttribute('tier') || 'T0').toUpperCase();
    var t = TIERS[key] || TIERS.T0;
    var lang = this.getAttribute('lang') === 'en' ? 'en' : 'ar';
    var L = lang === 'en' ? EN : AR;
    var flat = this.hasAttribute('flat');

    var name = this.getAttribute('name') || 'PH-NAME';
    var kid = this.getAttribute('kid') || 'KYN·PH-ID·0001';
    var role = this.getAttribute('role') || '';
    var dl = this.hasAttribute('deliveries') ? this.getAttribute('deliveries') : String(t.deliveries);
    var bar = this.hasAttribute('bar') ? this.getAttribute('bar') : String(t.bar);
    var verify = this.getAttribute('verify') || ('kayanwork.com/v/' + String(kid).split('·')[1] || 'PH-ID');
    var word = lang === 'en' ? t.en : t.ar;
    var note = t.marks ? (lang === 'en' ? L.noteT4 : L.noteT4) : L.note;

    var pad = lang === 'en' ? '22px 28px 22px 22px' : '22px 22px 22px 28px';

    sh.innerHTML =
      '<style>' +
      ':host{all:initial;display:block;width:264px;height:418px;}' +
      '*{box-sizing:border-box;}' +
      '.stage{width:100%;height:100%;perspective:1400px;' + (flat ? '' : 'cursor:pointer;') +
        'transition:transform 160ms cubic-bezier(.23,1,.32,1);border-radius:22px;}' +
      (flat ? '' : '.stage:active{transform:scale(.975);}') +
      '.stage:focus-visible{outline:2px solid ' + (t.accent) + ';outline-offset:4px;}' +
      '.inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;' +
        'transition:transform 700ms cubic-bezier(.22,1,.36,1);}' +
      '.stage[data-on="1"] .inner{transform:rotateY(180deg);}' +
      '.side{position:absolute;inset:0;backface-visibility:hidden;border-radius:22px;overflow:hidden;box-shadow:' + t.shadow + ';}' +
      '.back{transform:rotateY(180deg);background:' + t.back + ';}' +
      '.rail{position:absolute;inset-block:0;inset-inline-start:0;width:6px;background:' + t.rail + ';}' +
      '.body{position:absolute;inset:0;padding:' + pad + ';display:flex;flex-direction:column;}' +
      '.head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;}' +
      '.head img{height:30px;width:auto;display:block;opacity:' + t.logoOpacity + ';}' +
      '.tier{font-family:"Instrument Sans",sans-serif;font-size:10px;letter-spacing:.18em;color:' + t.tag + ';' +
        (t.tagWeight ? 'font-weight:' + t.tagWeight + ';' : '') + '}' +
      '.field{flex:1;margin:22px 0 0;position:relative;}' +
      '.grain{position:absolute;inset:0;background:repeating-linear-gradient(0deg,' + t.grainInk + ' 0 1px,transparent 1px ' + t.grain + 'px);' +
        '-webkit-mask-image:linear-gradient(180deg,transparent,#000 22%,#000 74%,transparent);' +
        'mask-image:linear-gradient(180deg,transparent,#000 22%,#000 74%,transparent);}' +
      '.stamp{position:absolute;inset-block-end:0;inset-inline-start:0;font-family:"Instrument Sans",sans-serif;' +
        'font-size:9px;letter-spacing:.16em;color:' + t.tag + ';}' +
      '.word{font-family:"Alexandria",sans-serif;font-weight:600;font-size:21px;line-height:1.2;color:' + t.word + ';text-shadow:' + t.lift + ';}' +
      '.who{font-family:"IBM Plex Sans Arabic",sans-serif;font-size:13px;color:' + t.meta + ';margin-top:3px;}' +
      '.kid{font-family:"Instrument Sans",sans-serif;font-size:10.5px;letter-spacing:.14em;color:' + t.meta + ';margin-top:11px;text-shadow:' + t.lift + ';}' +
      '.motto{font-family:"IBM Plex Sans Arabic",sans-serif;font-size:11.5px;color:#12B5A4;margin-top:8px;}' +
      '.bbody{position:absolute;inset:0;padding:' + pad + ';display:flex;flex-direction:column;justify-content:space-between;color:' + t.backInk + ';}' +
      '.vlabel{font-family:"IBM Plex Sans Arabic",sans-serif;font-size:9px;color:' + t.accent + ';}' +
      '.vurl{font-family:"Instrument Sans",sans-serif;font-size:11.5px;margin-top:7px;}' +
      '.row{display:flex;align-items:flex-end;gap:14px;}' +
      '.qr{width:70px;height:70px;flex-shrink:0;border-radius:8px;background:repeating-conic-gradient(' + t.accent + ' 0 25%,' + t.back + ' 0 50%) 0 0/12px 12px;}' +
      '.dlabel{font-family:"Instrument Sans",sans-serif;font-size:9px;letter-spacing:.16em;color:' + t.accent + ';}' +
      '.track{position:relative;height:12px;margin-top:9px;border-radius:3px;background:repeating-linear-gradient(90deg,' + t.barTrack + ' 0 3px,transparent 3px 7px);}' +
      '.fill{position:absolute;inset-block:0;inset-inline-start:0;border-radius:3px;background:repeating-linear-gradient(90deg,' + t.accent + ' 0 3px,transparent 3px 7px);}' +
      '.count{font-family:"IBM Plex Sans Arabic",sans-serif;font-size:11px;margin-top:8px;}' +
      '.note{font-family:"IBM Plex Sans Arabic",sans-serif;font-size:11.5px;line-height:1.8;color:' + t.backMute + ';}' +
      '.marks{display:flex;gap:3px;margin-bottom:9px;}' +
      '.marks i{width:16px;height:3px;border-radius:2px;background:' + t.accent + ';}' +
      '.marks i:last-child{background:rgba(233,190,75,.3);}' +
      (t.sheen ? '.sheen{position:absolute;top:0;bottom:0;width:64%;left:-12%;background:linear-gradient(100deg,transparent 20%,rgba(18,181,164,.16) 42%,rgba(233,190,75,.2) 52%,transparent 80%);animation:kSheen 4.6s ease-in-out infinite;}' +
        '@keyframes kSheen{0%,100%{transform:translateX(0)}50%{transform:translateX(150%)}}' : '') +
      (t.marks ? '.dot{position:absolute;inset-block-start:20px;inset-inline-end:54px;width:7px;height:7px;border-radius:50%;background:#E9BE4B;box-shadow:0 0 12px rgba(233,190,75,.95);}' : '') +
      '@media (prefers-reduced-motion:reduce){.inner{transition:none}.sheen{animation:none}.stage:active{transform:none}}' +
      '</style>' +

      '<div class="stage"' + (flat ? '' : ' role="button" tabindex="0" aria-pressed="false" aria-label="' + esc(word + ' — ' + name + ' — ' + L.flipHint) + '"') + ' data-on="0" dir="' + (lang === 'en' ? 'ltr' : 'rtl') + '">' +
        '<div class="inner">' +

          '<div class="side face" style="background:' + t.face + ';">' +
            '<div style="position:absolute;inset:0;background:' + t.weave + ';"></div>' +
            (t.sheen ? '<div class="sheen" aria-hidden="true"></div>' : '') +
            '<div class="rail"></div>' +
            (t.marks ? '<span class="dot" aria-hidden="true"></span>' : '') +
            '<div class="body">' +
              '<div class="head"><img src="' + t.logo + '" alt="كيان"><span class="tier" dir="ltr">' + key + '</span></div>' +
              '<div class="field"><div class="grain" aria-hidden="true"></div><div class="stamp" dir="ltr">' + t.stamp + '</div></div>' +
              '<div style="margin-top:16px;">' +
                '<div class="word">' + esc(word) + '</div>' +
                '<div class="who">' + esc(L.nameLabel) + ' ' + esc(name) + (role ? ' · ' + esc(role) : '') + '</div>' +
                '<div class="kid" dir="ltr">' + esc(kid) + '</div>' +
                (t.motto ? '<div class="motto">' + esc(L.motto) + '</div>' : '') +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div class="side back">' +
            '<div class="rail"></div>' +
            '<div class="bbody">' +
              '<div><div class="vlabel">' + esc(L.verify) + '</div><div class="vurl" dir="ltr">' + esc(verify) + '</div></div>' +
              '<div class="row">' +
                '<div class="qr" aria-hidden="true"></div>' +
                '<div style="min-width:0;">' +
                  '<div class="dlabel" dir="ltr">' + L.deliveries + '</div>' +
                  '<div class="track"><div class="fill" style="width:' + esc(bar) + '%;"></div></div>' +
                  '<div class="count">' + esc(dl) + ' · ' + esc(L.accepted) + '</div>' +
                '</div>' +
              '</div>' +
              '<div>' +
                (t.marks ? '<div class="marks" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' : '') +
                '<div class="note">' + esc(note) + '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +

        '</div>' +
      '</div>';

    if (flat) return;
    var stage = sh.querySelector('.stage');
    var flip = function () {
      var on = stage.getAttribute('data-on') === '1' ? '0' : '1';
      stage.setAttribute('data-on', on);
      stage.setAttribute('aria-pressed', on === '1' ? 'true' : 'false');
    };
    stage.addEventListener('click', flip);
    stage.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
    });
  };

  customElements.define('kayan-card', Card);
})();
