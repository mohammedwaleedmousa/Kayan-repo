// kayan-compass.js — البوصلة: shared site menu + ⌘K palette + golden scroll thread + page-footprint chip (SWDM v4).
// Mount: <script src="./kayan-compass.js"></script> in helmet, <kayan-compass current="home"></kayan-compass> in body.
(function () {
  if (customElements.get('kayan-compass')) return;
  var PAGES = [
    { k: 'home',    ar: 'الدار',            en: 'Home',             hint: 'حيث يبدأ كل شيء',            href: 'Kayan Home.dc.html' },
    { k: 'charter', ar: 'الميثاق',          en: 'The Charter',      hint: 'من نحن، وبأي المواد نحكم',   href: 'Kayan Charter.dc.html' },
    { k: 'journey', ar: 'الرحلة',           en: 'The Journey',      hint: 'من أول رسالة إلى محضر الاستلام', href: 'Kayan Journey.dc.html' },
    { k: 'line1',   ar: 'التسليم المدار',   en: 'Managed Delivery', hint: 'تشتري النتيجة لا الساعات',   href: 'Line I - Managed Delivery.dc.html', hrefEn: 'Line I - Managed Delivery EN.dc.html' },
    { k: 'line2',   ar: 'الملتقى والمقهى',  en: 'The Hub & Café',   hint: 'هنا تعمل عدن',               href: 'Line II - The Hub and Cafe.dc.html', hrefEn: 'Line II - The Hub and Cafe EN.dc.html' },
    { k: 'line3',   ar: 'التكوين المهني',   en: 'The Forge',        hint: 'حيث تصاغ المهارة وتقاس',     href: 'Line III - The Forge.dc.html', hrefEn: 'Line III - The Forge EN.dc.html' },
    { k: 'k4y',     ar: 'كيان لليمن',       en: 'Kayan for Yemen',  hint: 'يد للمدينة — تطوع يقيد',     href: 'Civic Wing - Kayan for Yemen.dc.html' },
    { k: 'clients', ar: 'للعملاء',          en: 'For clients',      hint: 'سعر مكتوب وضمان ممول',       href: 'Kayan for Clients.dc.html' },
    { k: 'talent',  ar: 'للكفاءات',         en: 'For talent',       hint: 'سجل يبنى بالدليل',           href: 'Kayan for Talent.dc.html' },
    { k: 'apply',   ar: 'التسجيل',          en: 'Registration',     hint: 'أقم على قدرتك دليلا',        href: 'Kayan Apply.dc.html' },
    { k: 'portal',  ar: 'البوابة',          en: 'The Portal',       hint: 'حيث تدار العلاقة',           href: 'Kayan Portal.dc.html' },
    { k: 'record',  ar: 'السجل العام',      en: 'Public record',    hint: 'تحقق من قيد، بلا حساب',      href: 'Kayan Record.dc.html' }
  ];
  var CSS = ''
    + ':host{all:initial}'
    + '*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}'
    + '.thread{position:fixed;top:0;left:0;height:2.5px;width:0;z-index:2147483000;background:linear-gradient(90deg,#C9A227,#E9C96B);transition:width .15s linear;pointer-events:none}'
    + '.fab{position:fixed;bottom:22px;z-index:2147483001;width:56px;height:56px;border-radius:50%;border:1px solid rgba(233,201,107,.55);cursor:pointer;'
    + 'background:radial-gradient(circle at 30% 28%,#0A3B36,#03201D 72%);color:#E9C96B;display:flex;align-items:center;justify-content:center;'
    + 'box-shadow:0 10px 30px rgba(0,0,0,.35),inset 0 0 0 1px rgba(3,32,29,.6);transition:transform .18s cubic-bezier(.23,1,.32,1),box-shadow .18s ease}'
    + '.fab:hover{transform:translateY(-2px) rotate(12deg);box-shadow:0 16px 38px rgba(201,162,39,.3)}'
    + '.fab:active{transform:scale(.94)}'
    + '.fab svg{display:block}'
    + '.veil{position:fixed;inset:0;z-index:2147483002;background:rgba(3,32,29,.965);backdrop-filter:blur(14px);display:flex;flex-direction:column;'
    + 'opacity:0;pointer-events:none;transition:opacity .26s ease}'
    + '.veil[data-on]{opacity:1;pointer-events:auto}'
    + '.head{display:flex;align-items:center;gap:14px;padding:20px clamp(18px,4vw,44px);border-bottom:1px solid rgba(201,162,39,.22)}'
    + '.brand{font-family:Alexandria,IBM Plex Sans Arabic,sans-serif;font-weight:600;font-size:16px;color:#E9C96B;letter-spacing:.02em}'
    + '.kbd{font-family:IBM Plex Mono,monospace;font-size:9.5px;letter-spacing:.16em;color:rgba(250,246,236,.45);border:1px solid rgba(250,246,236,.2);border-radius:6px;padding:4px 8px}'
    + '.x{margin-inline-start:auto;width:44px;height:44px;border-radius:50%;border:1px solid rgba(250,246,236,.3);background:transparent;color:#FAF6EC;font-size:17px;cursor:pointer}'
    + '.x:hover{border-color:#E9C96B;color:#E9C96B}'
    + '.q{margin:18px clamp(18px,4vw,44px) 4px;background:rgba(250,246,236,.06);border:1px solid rgba(250,246,236,.18);border-radius:12px;padding:13px 16px;'
    + 'color:#FAF6EC;font-family:IBM Plex Sans Arabic,sans-serif;font-size:14.5px;outline:none;min-height:44px}'
    + '.q:focus{border-color:#C9A227}'
    + '.q::placeholder{color:rgba(250,246,236,.35)}'
    + '.grid{flex:1;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,270px),1fr));gap:10px;align-content:start;padding:16px clamp(18px,4vw,44px) 40px}'
    + '.it{display:flex;flex-direction:column;gap:5px;text-decoration:none;border:1px solid rgba(250,246,236,.14);border-radius:14px;padding:15px 17px;'
    + 'transition:border-color .16s ease,background .16s ease,transform .16s cubic-bezier(.23,1,.32,1)}'
    + '.it:hover,.it[data-sel]{border-color:#C9A227;background:rgba(201,162,39,.09);transform:translateY(-1.5px)}'
    + '.it b{font-family:Alexandria,IBM Plex Sans Arabic,sans-serif;font-weight:600;font-size:15.5px;color:#FAF6EC}'
    + '.it[data-cur] b{color:#E9C96B}'
    + '.it small{font-size:11.5px;line-height:1.8;color:rgba(250,246,236,.55)}'
    + '.it .en{font-family:IBM Plex Mono,monospace;font-size:9px;letter-spacing:.18em;color:rgba(233,201,107,.7);text-transform:uppercase}'
    + '.foot{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:14px clamp(18px,4vw,44px);border-top:1px solid rgba(201,162,39,.22)}'
    + '.back{border:1px solid rgba(250,246,236,.25);background:transparent;color:rgba(250,246,236,.75);border-radius:99px;padding:9px 18px;font-family:IBM Plex Sans Arabic,sans-serif;font-size:12.5px;cursor:pointer}'
    + '.back:hover{border-color:#E9C96B;color:#E9C96B}'
    + '.sig{font-family:Alexandria,IBM Plex Sans Arabic,sans-serif;font-weight:300;font-size:13px;color:rgba(250,246,236,.55)}'
    + '.fp{position:fixed;bottom:24px;z-index:2147483000;display:flex;align-items:center;gap:9px;padding:8px 15px 8px 10px;border-radius:99px;'    + 'background:linear-gradient(160deg,rgba(10,59,54,.96),rgba(3,32,29,.96));border:1px solid rgba(126,224,184,.4);text-decoration:none;cursor:pointer;'
    + 'font-family:IBM Plex Mono,monospace;font-size:10px;letter-spacing:.06em;color:#7CE0B8;opacity:0;transform:translateY(8px);'
    + 'box-shadow:0 10px 30px rgba(0,0,0,.35);'
    + 'transition:opacity .5s ease,transform .5s cubic-bezier(.23,1,.32,1),border-color .3s ease,box-shadow .3s ease}'
    + '.fp[data-on]{opacity:1;transform:none}'
    + '.fp:hover{transform:translateY(-2px);border-color:rgba(126,224,184,.75);box-shadow:0 14px 34px rgba(0,0,0,.45)}'
    + '.fp[data-over]{border-color:rgba(201,107,74,.6);color:#F0B9A0}'
    + '.fp[data-over]:hover{border-color:#F0B9A0}'
    + '.fp .ring{width:26px;height:26px;flex:none;transform:rotate(-90deg)}'
    + '.fp .ring .bg{fill:none;stroke:rgba(126,224,184,.16);stroke-width:2.6}'
    + '.fp[data-over] .ring .bg{stroke:rgba(240,185,160,.16)}'
    + '.fp .ring .fg{fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round;stroke-dasharray:56.55;stroke-dashoffset:56.55;transition:stroke-dashoffset .9s cubic-bezier(.23,1,.32,1)}'
    + '.fp .col{display:flex;flex-direction:column;gap:1px;line-height:1.3}'
    + '.fp b{font-weight:600;font-size:10.5px;direction:ltr;unicode-bidi:isolate}'
    + '.fp small{font-family:IBM Plex Sans Arabic,sans-serif;font-size:9.5px;letter-spacing:0;color:inherit;opacity:.8}'
    + '.fp .mb{font-size:8px;letter-spacing:.1em;opacity:.55;direction:ltr;unicode-bidi:isolate}'
    + '@media (max-width:560px),(max-height:700px){.fp{display:none}}'
    + '@media (prefers-reduced-motion:reduce){.fp,.fp .ring .fg{transition:none}}'
    + '@media (prefers-reduced-motion:reduce){.veil,.it,.fab,.thread{transition:none}}';
  var ICON = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">'
    + '<circle cx="12" cy="12" r="10" stroke="#E9C96B" stroke-width="1.2" opacity=".55"/>'
    + '<path d="M12 3.6 13.6 10.4 20.4 12 13.6 13.6 12 20.4 10.4 13.6 3.6 12 10.4 10.4Z" fill="#E9C96B"/></svg>';
  function KayanCompass() { return Reflect.construct(HTMLElement, [], KayanCompass); }
  KayanCompass.prototype = Object.create(HTMLElement.prototype);
  KayanCompass.prototype.constructor = KayanCompass;
  KayanCompass.prototype.connectedCallback = function () {
    if (this._init) return; this._init = true;
    var self = this, cur = this.getAttribute('current') || '';
    var rtl = true;
    try { var dn = document.querySelector('[dir]'); rtl = ((dn && dn.getAttribute('dir')) || document.documentElement.getAttribute('dir') || 'rtl') !== 'ltr'; } catch (e) {}
    var lang = 'ar'; try { lang = localStorage.getItem('kyn-lang') === 'en' ? 'en' : 'ar'; } catch (e) {}
    var sh = this.attachShadow({ mode: 'open' });
    var st = document.createElement('style'); st.textContent = CSS; sh.appendChild(st);
    var thread = document.createElement('div'); thread.className = 'thread'; sh.appendChild(thread);
    var fab = document.createElement('button'); fab.className = 'fab'; fab.type = 'button';
    fab.setAttribute('aria-label', 'البوصلة — قائمة الموقع (Ctrl+K)'); fab.title = 'البوصلة · Ctrl+K'; fab.innerHTML = ICON;
    if (rtl) { fab.style.left = '22px'; fab.style.right = 'auto'; } else { fab.style.right = '22px'; fab.style.left = 'auto'; }
    sh.appendChild(fab);
    var veil = document.createElement('div'); veil.className = 'veil'; veil.dir = 'rtl'; veil.setAttribute('role', 'dialog'); veil.setAttribute('aria-label', 'قائمة الموقع');
    veil.innerHTML = '<div class="head"><span class="brand">البوصلة</span><span class="kbd">CTRL / ⌘ + K</span><button class="x" type="button" aria-label="إغلاق">✕</button></div>'
      + '<input class="q" type="text" placeholder="اكتب لتصل — الدار، الرحلة، التسجيل…" aria-label="بحث في الصفحات">'
      + '<div class="grid"></div>'
      + '<div class="foot"><button class="back" type="button">↩ عودة إلى الصفحة السابقة</button><span class="sig">خلف كل نجاح، كيان</span></div>';
    sh.appendChild(veil);
    var grid = veil.querySelector('.grid'), q = veil.querySelector('.q');
    function render(filter) {
      var f = (filter || '').trim().toLowerCase();
      grid.innerHTML = '';
      PAGES.forEach(function (p) {
        var hay = (p.ar + ' ' + p.en + ' ' + p.hint).toLowerCase();
        if (f && hay.indexOf(f) < 0) return;
        var a = document.createElement('a'); a.className = 'it';
        a.href = (lang === 'en' && p.hrefEn) ? p.hrefEn : p.href;
        if (p.k === cur) a.setAttribute('data-cur', '');
        a.innerHTML = '<span class="en">' + p.en + (p.k === cur ? ' · HERE' : '') + '</span><b>' + p.ar + '</b><small>' + p.hint + '</small>';
        grid.appendChild(a);
      });
      var first = grid.querySelector('.it'); if (first) first.setAttribute('data-sel', '');
    }
    function open() { render(''); veil.setAttribute('data-on', ''); q.value = ''; setTimeout(function () { try { q.focus(); } catch (e) {} }, 60); }
    function close() { veil.removeAttribute('data-on'); }
    fab.addEventListener('click', function () { veil.hasAttribute('data-on') ? close() : open(); });
    veil.querySelector('.x').addEventListener('click', close);
    veil.addEventListener('click', function (e) { if (e.target === veil) close(); });
    veil.querySelector('.back').addEventListener('click', function () { if (history.length > 1) history.back(); else location.href = 'Kayan Home.dc.html'; });
    q.addEventListener('input', function () { render(q.value); });
    q.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var sel = grid.querySelector('[data-sel]') || grid.querySelector('.it'); if (sel) location.href = sel.href; } });
    this._key = function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); veil.hasAttribute('data-on') ? close() : open(); }
      else if (e.key === 'Escape' && veil.hasAttribute('data-on')) close();
    };
    this._scroll = function () {
      var d = document.documentElement, max = d.scrollHeight - d.clientHeight;
      thread.style.width = max > 4 ? (Math.min(100, (d.scrollTop || document.body.scrollTop) / max * 100) + '%') : '0';
    };
    window.addEventListener('keydown', this._key);
    window.addEventListener('scroll', this._scroll, { passive: true });
    this._scroll();
    /* footprint chip — measured transfer of THIS page vs the Planet floor (1 g CO₂e/view).
       SWDM v4: g = bytes/1e9 × 0.81 kWh/GB × 494 g/kWh. Cross-origin entries without
       Timing-Allow-Origin report 0 — the chip counts what the browser can see (≈). */
    if (this.getAttribute('footprint') !== 'off' && window.performance && performance.getEntriesByType) {
      var fp = document.createElement('a'); fp.className = 'fp';
      fp.href = 'Kayan Planet.dc.html';
      if (rtl) { fp.style.left = '88px'; fp.style.right = 'auto'; } else { fp.style.right = '88px'; fp.style.left = 'auto'; }
      fp.setAttribute('aria-label', lang === 'en' ? 'Page carbon footprint — see Kayan Planet' : 'بصمة الصفحة الكربونية — مفصلة في صفحة الكوكب');
      fp.innerHTML = '<svg class="ring" viewBox="0 0 22 22" aria-hidden="true"><circle class="bg" cx="11" cy="11" r="9"></circle><circle class="fg" cx="11" cy="11" r="9"></circle></svg>'
        + '<span class="col"><b>…</b><small></small><span class="mb"></span></span>';
      sh.appendChild(fp);
      var fg = fp.querySelector('.fg'), valEl = fp.querySelector('b'), vEl = fp.querySelector('small'), mbEl = fp.querySelector('.mb');
      var C = 56.55;
      var runs = 0;
      var measure = function () {
        var bytes = 0, list = performance.getEntriesByType('resource'), k;
        for (k = 0; k < list.length; k++) bytes += (list[k].transferSize || list[k].encodedBodySize || list[k].decodedBodySize || 0);
        var nav = performance.getEntriesByType('navigation');
        if (nav && nav[0]) bytes += (nav[0].transferSize || nav[0].encodedBodySize || 0);
        if (!bytes) return;
        var g = bytes / 1e9 * 0.81 * 494, over = g > 1;
        var pct = Math.min(1, g / 1);
        fg.style.strokeDashoffset = (C * (1 - pct)).toFixed(2);
        valEl.textContent = '≈ ' + (g < 0.095 ? g.toFixed(2) : g.toFixed(1)) + ' g CO₂e';
        vEl.textContent = lang === 'en' ? (over ? 'over the 1 g floor' : 'within the 1 g floor')
                                        : (over ? 'فوق حد الغرام' : 'ضمن حد الغرام');
        mbEl.textContent = (bytes / 1e6).toFixed(2) + ' MB · ' + Math.round(pct * 100) + '%';
        if (over) fp.setAttribute('data-over', ''); else fp.removeAttribute('data-over');
        fp.title = lang === 'en'
          ? 'Measured transfer of this visit vs Kayan\u2019s 1 g CO\u2082e/view budget (SWDM v4: 0.81 kWh/GB \u00d7 494 g/kWh)'
          : 'النقل المقيس لهذه الزيارة مقابل حد كيان: 1 g CO₂e للزيارة (SWDM v4)';
        fp.setAttribute('data-on', '');
      };
      var tick = function () { runs++; measure(); if (runs < 5) setTimeout(tick, runs * 4000); };
      if ('PerformanceObserver' in window) { try { new PerformanceObserver(function(){ measure(); }).observe({ type: 'resource' }); } catch (e) {} }
      if (document.readyState === 'complete') setTimeout(tick, 1200);
      else window.addEventListener('load', function () { setTimeout(tick, 1200); }, { once: true });
    }
  };
  KayanCompass.prototype.disconnectedCallback = function () {
    window.removeEventListener('keydown', this._key);
    window.removeEventListener('scroll', this._scroll);
  };
  customElements.define('kayan-compass', KayanCompass);
})();
