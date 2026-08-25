/* ═══════════════════════════════════════════════════════════════════════════
   KAYAN MARK · <kayan-mark>
   The official Kayan bird, as vector — traced 1:1 from the master artwork
   (kayan_logo_bw_transparent.png) by contour extraction at full resolution.
   Three shapes, exactly as drawn:
     · chevron-outer  — the far wing, the deepest tone
     · chevron-blade  — the near wing sweeping up, the tone that catches light
     · tail-wedge     — the tail, the mid tone
   Nothing here is an interpretation. The geometry is the artwork.

   <kayan-mark line="md" width="520" flock="3" motion="glide" glow></kayan-mark>

   line      gold ivory cream ink md rp hub forge k4y            (default gold)
   width     number (px) or any CSS length                       (default 100%)
   flock     1 2 3 5 7  — echelon formation, lead + receding      (default 1)
   motion    still glide soar                                     (default still)
   entrance  none settle — 900ms arrival, blur to sharp            (default none)
   glow      halo behind the lead mark
   flat      one solid tone instead of the dimensional ramp
   tone      deep mid bright lift ink  — force a single tone
   facing    left right                                           (default left)
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  if (window.__kayanMark) return;
  window.__kayanMark = true;

  var VB = '0 0 1000 851.06';
  var AR = 1000 / 851.06;

  var D = {
    outer: 'M431.21 0L432.62 0L432.62 266.67L235.46 439.72L205.67 466.67L188.65 485.11L222.7 529.08L310.64 626.95L520.57 851.06L513.48 845.39L468.09 819.86L395.74 773.05L333.33 727.66L303.55 703.55L211.35 619.86L0 411.35L14.18 395.74L117.73 299.29L336.17 87.94Z',
    blade: 'M919.15 15.6L920.57 17.02L913.48 41.13L910.64 45.39L902.13 78.01L892.2 107.8L873.76 151.77L841.13 214.18L828.37 234.04L808.51 259.57L777.3 290.78L724.82 330.5L641.13 384.4L514.89 460.99L470.92 490.78L448.23 509.22L428.37 529.08L412.77 551.77L407.09 564.54L402.84 585.82L402.84 600L407.09 624.11L418.44 655.32L439.72 697.87L462.41 737.59L482.27 765.96L431.21 707.8L381.56 646.81L265.25 486.52L290.78 463.83L313.48 446.81L357.45 407.09L390.07 382.98L422.7 354.61L590.07 229.79L741.84 124.82Z',
    tail:  'M634.04 462.41L638.3 462.41L757.45 574.47L882.27 686.52L1000 795.74L706.38 796.5L692.2 787.23L470.92 567.38L470.92 564.54L478.01 561.7L509.22 540.43L568.79 504.96Z'
  };

  /* Per-line ramps. deep = far wing, mid = tail, bright = near wing,
     lift = the specular edge the gradient carries into. */
  var LINES = {
    gold:  { shade:'#3E2E08', deep:'#6E5418', mid:'#A8802A', bright:'#E9C96B', lift:'#F7E7B9', glow:'233,201,107' },
    ivory: { shade:'#5C5341', deep:'#8C7F63', mid:'#B9AE96', bright:'#EFE8D6', lift:'#FFFDF6', glow:'239,232,214' },
    cream: { shade:'#7E7358', deep:'#B4A98F', mid:'#DCD3BE', bright:'#FAF6EC', lift:'#FFFFFF', glow:'250,246,236' },
    ink:   { shade:'#010A09', deep:'#021A18', mid:'#052E2B', bright:'#17544C', lift:'#2C6C62', glow:'5,46,43'      },
    md:    { shade:'#06253E', deep:'#0D3F66', mid:'#2A76B8', bright:'#7FC3F2', lift:'#D3E8FA', glow:'62,158,234'   },
    rp:    { shade:'#032E29', deep:'#064A44', mid:'#0E8E7F', bright:'#3FD9BE', lift:'#BFF3E8', glow:'63,217,190'   },
    hub:   { shade:'#38230A', deep:'#6B4310', mid:'#B8891A', bright:'#F0C25C', lift:'#FCE9BC', glow:'240,194,92'   },
    forge: { shade:'#4E120A', deep:'#8A2418', mid:'#D0402F', bright:'#FF8A6B', lift:'#FFD0BE', glow:'255,98,80'    },
    k4y:   { shade:'#052617', deep:'#0A3F24', mid:'#17703F', bright:'#4FBF77', lift:'#C6EFD5', glow:'79,191,119'   }
  };

  /* Echelon formations. The LEAD is always the element's own box — width="520"
     means a 520px lead bird, whatever the flock size. Followers trail into the
     surrounding air (overflow visible), receding fast the way real distance reads.
     x/y are multiples of the lead's width, y positive = down. */
  var FLOCKS = {
    1: [ {x:0,    y:0,     s:1,     o:1,   r:0,  p:0   } ],
    2: [ {x:0,    y:0,     s:1,     o:1,   r:0,  p:0   },
         {x:1.17, y:0.26,  s:0.300, o:0.50,r:-6, p:1.5 } ],
    3: [ {x:0,    y:0,     s:1,     o:1,   r:0,  p:0   },
         {x:1.15, y:0.28,  s:0.310, o:0.52,r:-6, p:1.4 },
         {x:1.70, y:0.02,  s:0.190, o:0.30,r:5,  p:2.7 } ],
    5: [ {x:0,    y:0,     s:1,     o:1,   r:0,  p:0   },
         {x:1.13, y:0.30,  s:0.310, o:0.54,r:-6, p:1.3 },
         {x:1.65, y:-0.02, s:0.200, o:0.34,r:5,  p:2.3 },
         {x:2.01, y:0.26,  s:0.130, o:0.22,r:-4, p:3.3 },
         {x:2.27, y:0.06,  s:0.085, o:0.13,r:3,  p:4.2 } ],
    7: [ {x:0,    y:0,     s:1,     o:1,   r:0,  p:0   },
         {x:1.13, y:0.30,  s:0.310, o:0.56,r:-6, p:1.2 },
         {x:1.65, y:-0.02, s:0.200, o:0.36,r:5,  p:2.2 },
         {x:2.01, y:0.26,  s:0.130, o:0.24,r:-4, p:3.1 },
         {x:2.27, y:0.06,  s:0.085, o:0.15,r:3,  p:3.9 },
         {x:2.45, y:0.21,  s:0.058, o:0.10,r:-3, p:4.6 },
         {x:2.59, y:0.11,  s:0.040, o:0.07,r:2,  p:5.2 } ]
  };

  var uid = 0;

  var SHEET = [
    ':host{display:block;position:relative;line-height:0;--kw:100%}',
    ':host([hidden]){display:none}',
    '.stage{position:relative;width:var(--kw);overflow:visible}',
    '.bed{width:100%;height:0;padding-bottom:85.106%}',
    '.unit{position:absolute;transform-origin:50% 50%;will-change:transform}',
    '.unit svg{display:block;width:100%;height:auto;overflow:visible}',
    '.halo{position:absolute;pointer-events:none;border-radius:50%}',
    '@keyframes kmGlide{0%,100%{transform:translate3d(0,0,0) rotate(var(--r,0deg))}',
    '50%{transform:translate3d(0,calc(-1 * var(--amp,10px)),0) rotate(var(--r,0deg))}}',
    '@keyframes kmSoar{0%{transform:translate3d(0,0,0) rotate(var(--r,0deg))}',
    '32%{transform:translate3d(calc(-0.5 * var(--amp,10px)),calc(-1.15 * var(--amp,10px)),0) rotate(calc(var(--r,0deg) - 1.6deg))}',
    '64%{transform:translate3d(calc(0.28 * var(--amp,10px)),calc(0.42 * var(--amp,10px)),0) rotate(calc(var(--r,0deg) + 1deg))}',
    '100%{transform:translate3d(0,0,0) rotate(var(--r,0deg))}}',
    '@keyframes kmHalo{0%,100%{opacity:.52}50%{opacity:.92}}',
    '@keyframes kmSettle{0%{opacity:0;transform:translate3d(14%,10%,0) scale(1.05) rotate(var(--r,0deg));filter:blur(10px)}',
    '100%{opacity:1;transform:translate3d(0,0,0) scale(1) rotate(var(--r,0deg));filter:blur(0)}}',
    '.glide{animation:kmGlide var(--dur,9s) ease-in-out infinite;animation-delay:var(--ph,0s)}',
    '.soar{animation:kmSoar var(--dur,13s) cubic-bezier(.4,0,.5,1) infinite;animation-delay:var(--ph,0s)}',
    '.haloon{animation:kmHalo 9s ease-in-out infinite}',
    '.settle{animation:kmSettle .9s cubic-bezier(.16,.84,.24,1) var(--sd,0s) both}',
    '@media (prefers-reduced-motion:reduce){.glide,.soar,.haloon,.settle{animation:none!important}',
    '.settle{opacity:1!important;filter:none!important;transform:rotate(var(--r,0deg))!important}}'
  ].join('');

  var sheet = null;
  function adopt(root) {
    if (typeof CSSStyleSheet !== 'undefined' && 'adoptedStyleSheets' in Document.prototype) {
      if (!sheet) { sheet = new CSSStyleSheet(); sheet.replaceSync(SHEET); }
      root.adoptedStyleSheets = [sheet];
    } else {
      var s = document.createElement('style'); s.textContent = SHEET; root.appendChild(s);
    }
  }

  function esc(v) { return String(v).replace(/[&<>"]/g, function (c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]; }); }

  function cssLen(v) {
    if (v == null || v === '') return null;
    return /^[\d.]+$/.test(String(v).trim()) ? v + 'px' : String(v);
  }

  class KayanMark extends HTMLElement {
    static get observedAttributes() {
      return ['line','width','flock','motion','entrance','glow','flat','tone','facing','amp','delay','ramp'];
    }
    constructor() { super(); this.attachShadow({ mode: 'open' }); adopt(this.shadowRoot); this._id = ++uid; }
    connectedCallback() {
      if (!this.hasAttribute('role') && !this.hasAttribute('aria-label')) this.setAttribute('aria-hidden','true');
      this._render();
    }
    attributeChangedCallback() { if (this.shadowRoot.childNodes.length) this._render(); }

    _render() {
      var a = function (n, d) { var v = this.getAttribute(n); return v == null || v === '' ? d : v; }.bind(this);
      var key   = a('line','gold');
      var C0    = LINES[key] || LINES.gold;
      /* ramp="dark" shifts the whole ladder one rung down — the on-light-ground
         variant: a burnished mark on the line's own colour field. */
      var C     = a('ramp','light') === 'dark'
        ? { shade:C0.shade, deep:C0.shade, mid:C0.deep, bright:C0.mid, lift:C0.mid, glow:C0.glow }
        : C0;
      var flat  = this.hasAttribute('flat');
      var tone  = a('tone', null);
      var n     = parseInt(a('flock','1'), 10);
      var F     = FLOCKS[n] || FLOCKS[1] ;
      var motion= a('motion','still');
      var ent   = a('entrance','none');
      var glow  = this.hasAttribute('glow');
      var mirror= a('facing','left') === 'right';
      var w     = cssLen(a('width', null));
      var amp   = a('amp', null);
      var delay = parseFloat(a('delay','0')) || 0;
      var gid   = 'km' + this._id;

      /* The element's box IS the lead mark. Followers trail outside it. */
      var fills;
      if (flat || tone) {
        var t = tone && C[tone] ? C[tone] : (tone === 'currentColor' ? 'currentColor' : C.bright);
        fills = { outer: t, blade: t, tail: t };
      } else {
        fills = { outer: 'url(#' + gid + 'o)', blade: 'url(#' + gid + 'b)', tail: 'url(#' + gid + 't)' };
      }

      var defs = (flat || tone) ? '' :
        '<defs>' +
          '<linearGradient id="' + gid + 'o" x1="0" y1="1" x2="0.72" y2="0" gradientUnits="objectBoundingBox">' +
            '<stop offset="0" stop-color="' + C.deep + '"/><stop offset="1" stop-color="' + C.mid + '"/></linearGradient>' +
          '<linearGradient id="' + gid + 'b" x1="0.05" y1="1" x2="0.92" y2="0.04" gradientUnits="objectBoundingBox">' +
            '<stop offset="0" stop-color="' + C.mid + '"/><stop offset="0.52" stop-color="' + C.bright + '"/>' +
            '<stop offset="1" stop-color="' + C.lift + '"/></linearGradient>' +
          '<linearGradient id="' + gid + 't" x1="0" y1="0" x2="1" y2="0.85" gradientUnits="objectBoundingBox">' +
            '<stop offset="0" stop-color="' + C.bright + '"/><stop offset="1" stop-color="' + C.mid + '"/></linearGradient>' +
        '</defs>';

      var svg = '<svg viewBox="' + VB + '" shape-rendering="geometricPrecision" focusable="false" aria-hidden="true">' +
        defs +
        '<path d="' + D.outer + '" fill="' + fills.outer + '"/>' +
        '<path d="' + D.tail  + '" fill="' + fills.tail  + '"/>' +
        '<path d="' + D.blade + '" fill="' + fills.blade + '"/>' +
      '</svg>';

      var motionCls = motion === 'glide' ? ' glide' : motion === 'soar' ? ' soar' : '';
      var entCls    = ent === 'settle' ? ' settle' : '';

      var units = F.map(function (u, i) {
        var st = [
          'left:' + (u.x * 100).toFixed(3) + '%',
          'top:' + (u.y * 100).toFixed(3) + '%',
          'width:' + (u.s * 100).toFixed(3) + '%',
          'opacity:' + u.o,
          '--r:' + u.r + 'deg',
          '--amp:' + (amp ? cssLen(amp) : (u.s * 2.4).toFixed(2) + '%'),
          '--dur:' + (motion === 'soar' ? (12 + i * 1.7) : (8.4 + i * 1.35)).toFixed(2) + 's',
          '--ph:' + (-u.p).toFixed(2) + 's',
          '--sd:' + (delay + i * 0.11).toFixed(2) + 's'
        ].join(';');
        return '<div class="unit' + motionCls + entCls + '" style="' + st + '">' + svg + '</div>';
      }).join('');

      var halo = glow
        ? '<div class="halo haloon" style="left:-16%;top:-13%;width:132%;padding-bottom:132%;' +
          'background:radial-gradient(closest-side,rgba(' + C.glow + ',.30),rgba(' + C.glow + ',.09) 50%,transparent 72%)"></div>'
        : '';

      this.shadowRoot.querySelectorAll(':not(style)').forEach(function (el) { el.remove(); });
      var host = document.createElement('div');
      host.className = 'stage';
      if (w) this.style.setProperty('--kw', w);
      if (mirror) host.style.transform = 'scaleX(-1)';
      host.innerHTML = halo + '<div class="bed"></div>' + units;
      this.shadowRoot.appendChild(host);
    }
  }

  /* Static markup helper — for print/export paths that cannot run custom elements. */
  window.KayanMarkSVG = function (line, tone) {
    var C = LINES[line] || LINES.gold;
    var t = (tone && C[tone]) || C.bright;
    return '<svg viewBox="' + VB + '" fill="' + t + '" shape-rendering="geometricPrecision" aria-hidden="true">' +
      '<path d="' + D.outer + '"/><path d="' + D.tail + '"/><path d="' + D.blade + '"/></svg>';
  };
  window.KayanMarkPaths = D;
  window.KayanMarkLines = LINES;

  if (!customElements.get('kayan-mark')) customElements.define('kayan-mark', KayanMark);
})();
