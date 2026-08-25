import React from 'react';
import DCLogic from '../../home/DCLogic.js';

export default class SealLogic extends DCLogic {
  state = {
    doc: 'محضر استلام', id: 'A7F3-0142', tier: 'T3', date: '2026-07-14',
    contract: 'MD-2026-204', scope: 'هوية بصرية كاملة ودليل استعمال', revoked: false,
    chainText: null, vRec: '', vSeal: '', copied: false
  };

  // ---------- SHA-256, pure JS so it runs offline and from file:// ----------
  sha256(str) {
    const K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    let H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    const b = Array.from(new TextEncoder().encode(str));
    const bitLen = b.length * 8;
    b.push(0x80);
    while (b.length % 64 !== 56) b.push(0);
    for (let i = 7; i >= 0; i--) b.push(Math.floor(bitLen / Math.pow(2, i * 8)) & 0xff);
    const rr = (x, n) => (x >>> n) | (x << (32 - n));
    for (let i = 0; i < b.length; i += 64) {
      const w = new Array(64);
      for (let j = 0; j < 16; j++) w[j] = (b[i+j*4] << 24) | (b[i+j*4+1] << 16) | (b[i+j*4+2] << 8) | b[i+j*4+3];
      for (let j = 16; j < 64; j++) {
        const s0 = rr(w[j-15],7) ^ rr(w[j-15],18) ^ (w[j-15] >>> 3);
        const s1 = rr(w[j-2],17) ^ rr(w[j-2],19) ^ (w[j-2] >>> 10);
        w[j] = (w[j-16] + s0 + w[j-7] + s1) | 0;
      }
      let a = H[0], bb = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (let j = 0; j < 64; j++) {
        const S1 = rr(e,6) ^ rr(e,11) ^ rr(e,25);
        const ch = (e & f) ^ (~e & g);
        const t1 = (h + S1 + ch + K[j] + w[j]) | 0;
        const S0 = rr(a,2) ^ rr(a,13) ^ rr(a,22);
        const mj = (a & bb) ^ (a & c) ^ (bb & c);
        const t2 = (S0 + mj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = bb; bb = a; a = (t1 + t2) | 0;
      }
      const add = [a,bb,c,d,e,f,g,h];
      H = H.map((v, k) => (v + add[k]) | 0);
    }
    return H.map(v => (v >>> 0).toString(16).padStart(8, '0')).join('').toUpperCase();
  }

  // ---------- the glyph: 11 strata, mirrored on one axis ----------
  N = 11;
  runs(hex, cell) {
    const bit = i => (parseInt(hex[i >> 2], 16) >> (3 - (i & 3))) & 1;
    const N = this.N, W = [0.30, 0.46, 0.64, 0.84], out = [];
    for (let r = 0; r < N; r++) {
      const wv = (bit(66 + r * 2) << 1) | bit(66 + r * 2 + 1);
      const hgt = W[wv] * cell;
      const on = [];
      for (let c = 0; c < N; c++) on.push(bit(r * 6 + (c <= 5 ? c : 10 - c)));
      let c = 0, any = false;
      while (c < N) {
        if (on[c]) {
          const s = c;
          while (c < N && on[c]) c++;
          out.push({
            x: +(s * cell).toFixed(2),
            y: +(r * cell + (cell - hgt) / 2).toFixed(2),
            w: +((c - s) * cell - cell * 0.2).toFixed(2),
            h: +hgt.toFixed(2),
            rx: +Math.min(hgt / 2, cell * 0.16).toFixed(2)
          });
          any = true;
        } else c++;
      }
      if (!any) out.push({ x: +(cell * 0.9).toFixed(2), y: +(r * cell + cell / 2 - cell * 0.045).toFixed(2), w: +(cell * 9.2).toFixed(2), h: +(cell * 0.09).toFixed(2), rx: 0.5 });
    }
    return out;
  }
  box(cell) { const s = this.N * cell; return '0 0 ' + s + ' ' + s; }

  canonical(o) {
    const t = { 'محضر استلام': 'MHD', 'قيد ترقية': 'TRQ', 'قرار مسبب': 'QRR', 'أمر تغيير': 'AMR' }[o.doc] || 'DOC';
    return ['KYN', t, o.id, o.tier, o.date, o.contract, (o.scope || '').trim()].join('|');
  }

  // ---------- the chain ----------
  seed() {
    return ['قبول التسليم الأول — هوية بصرية', 'قبول التسليم الثاني — موقع تعريفي', 'قبول التسليم الثالث — دليل تشغيل'];
  }
  chainSeals(texts) {
    let prev = '0000000000000000000000000000000000000000000000000000000000000000';
    return texts.map((t, i) => {
      const canon = 'KYN|LNK|' + String(i + 1).padStart(3, '0') + '|' + t + '|' + prev;
      const hash = this.sha256(canon);
      const row = { hash, prev, text: t };
      prev = hash;
      return row;
    });
  }

  svgString(hex, cell, ink, struck) {
    const s = this.N * cell, pad = cell * 1.1, total = s + pad * 2;
    const rs = this.runs(hex, cell).map(r =>
      '<rect x="' + (r.x + pad) + '" y="' + (r.y + pad) + '" width="' + r.w + '" height="' + r.h + '" rx="' + r.rx + '" fill="' + ink + '"/>').join('');
    const st = struck ? '<rect x="' + (pad + cell * 0.4) + '" y="' + (pad + s / 2 - cell * 0.12) + '" width="' + (s - cell * 0.8) + '" height="' + (cell * 0.24) + '" fill="#B23A31"/>' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + total + ' ' + total + '" width="' + total + '" height="' + total + '">' +
      '<rect width="' + total + '" height="' + total + '" fill="#FAF6EC"/>' + rs + st + '</svg>';
  }
  save(blob, name) {
    const u = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(u), 4000);
  }

  renderVals() {
    const s = this.state;
    const cell = 14, W = this.N * cell;

    const canon = this.canonical(s);
    const hash = this.sha256(canon);
    const short = hash.slice(0, 8);
    const gold = s.tier === 'T4';
    const ink = s.revoked ? '#8A9A94' : (gold ? '#B8891A' : '#052E2B');

    const heroHash = this.sha256(this.canonical({ doc: 'محضر استلام', id: 'A7F3-0142', tier: 'T3', date: '2026-07-14', contract: 'MD-2026-204', scope: 'هوية بصرية كاملة ودليل استعمال' }));

    const texts = s.chainText || this.seed();
    const original = this.chainSeals(this.seed()).map(r => r.hash);
    const live = this.chainSeals(texts);
    let brokenFrom = -1;
    live.forEach((r, i) => { if (brokenFrom < 0 && r.hash !== original[i]) brokenFrom = i; });

    const chain = live.map((r, i) => {
      const own = brokenFrom === i;
      const downstream = brokenFrom >= 0 && i > brokenFrom;
      const bad = own || downstream;
      return {
        no: 'ENTRY ' + String(i + 1).padStart(3, '0'),
        text: r.text,
        short: r.hash.slice(0, 8),
        prevShort: i === 0 ? 'GENESIS' : r.prev.slice(0, 8),
        runs: this.runs(r.hash, 8),
        box: this.box(8),
        status: bad ? (own ? 'قيد معدل' : 'سلسلة مكسورة') : 'مطابق',
        fg: bad ? '#FF9A8F' : '#7FE7DA',
        bg: bad ? 'rgba(178,58,49,.16)' : 'rgba(18,181,164,.12)',
        bd: bad ? 'rgba(255,154,143,.4)' : 'rgba(127,231,218,.32)',
        note: own ? 'تغير نص هذا القيد بعد إصداره، فتغير ختمه.'
          : downstream ? 'لم يمس هذا القيد، لكن ختم ما قبله تغير — فسقطت حجيته تبعا.'
          : 'يطابق الختم الصادر يوم القيد.',
        noteFg: bad ? '#FF9A8F' : 'rgba(250,246,236,.55)',
        onEdit: (e) => {
          const next = (this.state.chainText || this.seed()).slice();
          next[i] = e.target.value;
          this.setState({ chainText: next });
        }
      };
    });

    // verification
    const vr = (s.vRec || '').trim(), vs = (s.vSeal || '').trim().toUpperCase();
    let vKicker = 'AWAITING INPUT', vTitle = 'لم يقدم ما يتحقق منه', vBody = 'أدخل النص المعياري والشيفرة المطبوعة، ويجري التحقق فورا داخل هذا المتصفح.', vTone = '#6E675A', vBorder = '#E2DAC8', vRoute = 'النص المعياري مطبوع أسفل كل وثيقة مختومة بخط أحادي المسافة.', vComputed = '————————';
    if (vr) {
      const c = this.sha256(vr).slice(0, 8);
      vComputed = c;
      if (!vs) { vKicker = 'INCOMPLETE'; vTitle = 'الشيفرة غير مدخلة'; vBody = 'حسبت شيفرة النص المدخل. أدخل الشيفرة المطبوعة على الوثيقة لتتم المقارنة.'; vTone = '#8A6A12'; vBorder = '#E2DAC8'; vRoute = 'ثماني خانات، حروف وأرقام، تحت الختم مباشرة.'; }
      else if (c === vs) { vKicker = 'MATCH'; vTitle = 'الوثيقة مطابقة لختمها'; vBody = 'النص المدخل يولد الشيفرة المطبوعة نفسها. لم يمس نص هذه الوثيقة منذ ختمها.'; vTone = '#0E6E66'; vBorder = '#12B5A4'; vRoute = 'التحقق تم محليا. لم يرسل شيء إلى كيان، ولا يلزم إذنها.'; }
      else { vKicker = 'قرار مسبب · REFUSAL'; vTitle = 'لا تطابق'; vBody = 'الشيفرة المحسوبة من النص المدخل تخالف الشيفرة المطبوعة. أحد أمرين: النص نسخ ناقصا أو معدلا، أو الختم لا يخص هذه الوثيقة.'; vTone = '#8E2F27'; vBorder = '#B23A31'; vRoute = 'الطريق: اطلب النسخة الأصلية من صاحب القيد، أو راجع سطر النص المعياري حرفا حرفا. ولا يعد عدم التطابق بذاته اتهاما.'; }
    }

    return {
      heroBox: this.box(cell), heroW: W, heroRuns: this.runs(heroHash, cell), heroShort: heroHash.slice(0, 8),

      fDoc: s.doc, fId: s.id, fTier: s.tier, fDate: s.date, fContract: s.contract, fScope: s.scope, fRevoked: s.revoked,
      setDoc: e => this.setState({ doc: e.target.value }),
      setId: e => this.setState({ id: e.target.value }),
      setTier: e => this.setState({ tier: e.target.value }),
      setDate: e => this.setState({ date: e.target.value }),
      setContract: e => this.setState({ contract: e.target.value }),
      setScope: e => this.setState({ scope: e.target.value }),
      setRevoked: e => this.setState({ revoked: e.target.checked }),

      canonical: canon, mainHash: hash, mainShort: short,
      mainRuns: this.runs(hash, cell), mainBox: this.box(cell), mainW: W, mainInk: ink,
      strikeX: +(cell * 0.4).toFixed(2), strikeY: +(W / 2 - 1.5).toFixed(2), strikeW: +(W - cell * 0.8).toFixed(2),
      stateLabel: s.revoked ? 'REVOKED' : (gold ? 'TIER 4 · GOLD' : 'ACTIVE'),
      stateColor: s.revoked ? '#8E2F27' : (gold ? '#B8891A' : '#0E6E66'),

      dlSvg: () => this.save(new Blob([this.svgString(hash, 24, ink, s.revoked)], { type: 'image/svg+xml' }), 'kayan-seal-' + short + '.svg'),
      dlPng: () => {
        const str = this.svgString(hash, 24, ink, s.revoked);
        const img = new Image();
        img.onload = () => {
          const side = this.N * 24 + 24 * 2.2, cv = document.createElement('canvas');
          cv.width = cv.height = Math.round(side * 4);
          const cx = cv.getContext('2d');
          cx.imageSmoothingEnabled = false;
          cx.drawImage(img, 0, 0, cv.width, cv.height);
          cv.toBlob(b => this.save(b, 'kayan-seal-' + short + '@4x.png'), 'image/png');
        };
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(str);
      },
      copyLabel: s.copied ? 'نسخت الشيفرة' : 'نسخ الشيفرة الكاملة',
      copyHash: () => {
        const t = hash;
        const done = () => { this.setState({ copied: true }); setTimeout(() => this.setState({ copied: false }), 1800); };
        if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, done);
        else done();
      },

      chain,
      resetChain: () => this.setState({ chainText: null }),

      vRec: s.vRec, vSeal: s.vSeal,
      setVRec: e => this.setState({ vRec: e.target.value }),
      setVSeal: e => this.setState({ vSeal: e.target.value }),
      fillFromMain: () => this.setState({ vRec: canon, vSeal: short }),
      vKicker, vTitle, vBody, vTone, vBorder, vRoute, vComputed
    };
  }
}