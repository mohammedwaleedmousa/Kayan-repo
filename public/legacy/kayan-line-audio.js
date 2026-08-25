// kayan-line-audio.js — «اسمع الخط»: a short sonic signature per line, maqam Rast on D (same vocabulary as the Home overture).
// Mount: <script src="./kayan-line-audio.js"></script> in helmet, <kayan-line-audio motif="md|hub|forge|k4y" accent="#2E7CBC"></kayan-line-audio> in body.
(function () {
  if (customElements.get('kayan-line-audio')) return;
  var BASE = 293.66; // D4
  var C = function (cents) { return BASE * Math.pow(2, cents / 1200); };
  // [startSec, cents (or [chord]), durSec, gain, octaveMult]
  var MOTIFS = {
    md:    { total: 2.6, notes: [[0, 0, .5, .8, 1], [.42, 500, .5, .75, 1], [.84, 700, .55, .8, 1], [1.3, 1200, 1.2, .9, 1], [1.3, 700, 1.2, .45, 1]] },
    hub:   { total: 2.8, notes: [[0, 0, 1.9, .6, 1], [.14, 347, 1.75, .5, 1], [.3, 700, 1.6, .5, 1], [.52, 1200, 1.5, .55, 1], [1.5, 500, 1.2, .4, 1]] },
    forge: { total: 2.4, notes: [[0, 0, .16, .95, .5], [.3, 700, .14, .8, 1], [.6, 0, .16, .95, .5], [.9, 700, .14, .8, 1], [1.2, 1200, 1.1, .85, 1], [1.2, 0, 1.1, .5, .5]] },
    k4y:   { total: 3.0, notes: [[0, 1200, .6, .7, 1], [.5, 700, .6, .6, 1], [1.0, 347, .7, .6, 1], [1.6, 0, 1.3, .8, 1], [1.6, 700, 1.3, .35, 1]] }
  };
  function LineAudio() { return Reflect.construct(HTMLElement, [], LineAudio); }
  LineAudio.prototype = Object.create(HTMLElement.prototype);
  LineAudio.prototype.constructor = LineAudio;
  LineAudio.prototype.connectedCallback = function () {
    if (this._init) return; this._init = true;
    var self = this;
    var motif = MOTIFS[this.getAttribute('motif')] || MOTIFS.md;
    var accent = this.getAttribute('accent') || '#C9A227';
    var lang = 'en'; try { var lv = localStorage.getItem('kyn-lang'); lang = lv === 'ar' ? 'ar' : 'en'; } catch (e) {}
    var inline = this.hasAttribute('inline');
    var sh = this.attachShadow({ mode: 'open' });
    var st = document.createElement('style');
    st.textContent = ':host{all:initial;display:block}'
      + (inline
          ? '.wrap{display:flex;align-items:center;gap:14px;padding:0}.wrap>div{display:flex;align-items:center;gap:14px;flex-wrap:wrap}'
          : '.wrap{display:flex;justify-content:center;padding:34px 16px 40px}')
      + '.btn{display:inline-flex;align-items:center;gap:11px;cursor:pointer;background:transparent;border:1.5px solid ' + accent + ';color:' + accent + ';'
      + 'border-radius:99px;padding:13px 26px;font-family:"IBM Plex Sans Arabic","Alexandria",sans-serif;font-size:14px;font-weight:600;min-height:46px;'
      + 'transition:transform 160ms cubic-bezier(.23,1,.32,1),box-shadow .2s ease}'
      + '.btn:hover{box-shadow:0 8px 26px ' + accent + '33}'
      + '.btn:active{transform:scale(.97)}'
      + '.btn:focus-visible{outline:2px solid ' + accent + ';outline-offset:3px}'
      + '.bars{display:inline-flex;align-items:flex-end;gap:2.5px;height:16px}'
      + '.bars i{width:2.5px;background:' + accent + ';height:30%;border-radius:2px}'
      + '.on .bars i{animation:eq .7s ease-in-out infinite alternate}'
      + '.on .bars i:nth-child(2){animation-delay:.12s}.on .bars i:nth-child(3){animation-delay:.24s}.on .bars i:nth-child(4){animation-delay:.36s}'
      + '@keyframes eq{from{height:22%}to{height:100%}}'
      + '.note{font-family:"IBM Plex Mono",monospace;font-size:9px;letter-spacing:.18em;color:' + accent + ';opacity:.65;' + (inline ? '' : 'margin-top:10px;text-align:center') + '}'
      + '@media (prefers-reduced-motion:reduce){.on .bars i{animation:none}}';
    sh.appendChild(st);
    var wrap = document.createElement('div'); wrap.className = 'wrap'; wrap.dir = lang === 'en' ? 'ltr' : 'rtl';
    var inner = document.createElement('div');
    var btn = document.createElement('button'); btn.className = 'btn'; btn.type = 'button';
    var label = this.getAttribute(lang === 'en' ? 'label-en' : 'label-ar')
      || (lang === 'en' ? 'Hear the line' : 'اسمع الخط');
    btn.innerHTML = '<span class="bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="t">' + label + '</span>';
    btn.setAttribute('aria-label', label);
    var note = document.createElement('div'); note.className = 'note';
    note.textContent = this.getAttribute('note') || 'MAQAM RAST ON D · KAYAN SIGNATURE';
    inner.appendChild(btn); inner.appendChild(note); wrap.appendChild(inner); sh.appendChild(wrap);
    var playing = false;
    btn.addEventListener('click', function () {
      if (playing) return;
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      if (!self._ctx) self._ctx = new AC();
      var ctx = self._ctx; if (ctx.state === 'suspended') ctx.resume();
      var now = ctx.currentTime + 0.04;
      var master = ctx.createGain(); master.gain.value = 0.16;
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
      master.connect(lp); lp.connect(ctx.destination);
      motif.notes.forEach(function (n) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'triangle'; o.frequency.value = C(n[1]) * (n[4] || 1);
        var t0 = now + n[0], t1 = t0 + n[2];
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(n[3], t0 + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t1);
        o.connect(g); g.connect(master);
        o.start(t0); o.stop(t1 + 0.05);
      });
      playing = true; btn.classList.add('on');
      var t = btn.querySelector('.t'); t.textContent = lang === 'en' ? 'Playing…' : 'يصدح…';
      setTimeout(function () { playing = false; btn.classList.remove('on'); t.textContent = label; }, motif.total * 1000);
    });
  };
  customElements.define('kayan-line-audio', LineAudio);
})();
