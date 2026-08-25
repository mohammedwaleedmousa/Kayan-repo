/* Kayan bird colour system.
   assets/bird-master.png is a single luminance plate of the photographic Kayan bird —
   the same bird, the same wing, in every line. Each line's identity is applied at render
   time by a luminance-preserving duotone: shadows fall toward the line's deep colour over
   ink, midtones sit on the deep, the body carries the bloom, highlights lift toward warm
   white. Every feather, every shadow of the original photograph survives; only hue changes.
   Hook: <img src="assets/bird-master.png" data-bird="gold|ivory|md|rp|hub|forge|k4y">
   Instance shadows stay in the element's own inline filter, e.g.
   filter:url(#kbGold) drop-shadow(0 30px 52px rgba(0,0,0,.55)) */
(function () {
  if (document.getElementById('kayan-bird-filters')) return;

  var R = {
    gold: { id: 'kbGold',
      r: '0.0235 0.0235 0.0235 0.0469 0.0738 0.1161 0.1822 0.2608 0.4175 0.571 0.6993 0.8162 0.9072 0.9695 0.9922 0.9922 0.9922',
      g: '0.0196 0.0196 0.0196 0.0361 0.0551 0.0851 0.132 0.1896 0.3134 0.4364 0.5539 0.6715 0.7893 0.9144 0.9647 0.9647 0.9647',
      b: '0.0078 0.0078 0.0078 0.0134 0.0197 0.0256 0.0308 0.0377 0.0551 0.0756 0.1213 0.2195 0.4364 0.7424 0.8706 0.8706 0.8706' },
    ivory: { id: 'kbIvory',
      r: '0.1412 0.1412 0.188 0.2547 0.3214 0.3931 0.4771 0.561 0.645 0.7208 0.7956 0.8703 0.9149 0.9485 0.9822 0.9961 0.9961',
      g: '0.1176 0.1176 0.1604 0.2214 0.2823 0.35 0.4339 0.5179 0.6019 0.6799 0.7571 0.8344 0.886 0.9284 0.9707 0.9882 0.9882',
      b: '0.0706 0.0706 0.1037 0.1508 0.198 0.2545 0.3339 0.4132 0.4926 0.5745 0.6567 0.7389 0.8075 0.871 0.9345 0.9608 0.9608' },
    md: { id: 'kbMD',
      r: '0.0361 0.0361 0.0387 0.0541 0.0693 0.0808 0.0923 0.1067 0.1365 0.1664 0.2802 0.4681 0.6469 0.8003 0.918 0.918 0.918',
      g: '0.1216 0.1216 0.1317 0.1901 0.2481 0.2919 0.3357 0.3794 0.4227 0.466 0.5469 0.6611 0.7697 0.863 0.9345 0.9345 0.9345',
      b: '0.1592 0.1592 0.1767 0.2774 0.3775 0.453 0.5286 0.6009 0.6561 0.7114 0.763 0.8116 0.8578 0.8974 0.9278 0.9278 0.9278' },
    rp: { id: 'kbRP',
      r: '0.0267 0.0267 0.0278 0.0344 0.0409 0.0458 0.0508 0.0558 0.0618 0.0678 0.1838 0.3968 0.5996 0.7736 0.9071 0.9071 0.9071',
      g: '0.1333 0.1333 0.1453 0.2147 0.2836 0.3356 0.3876 0.4481 0.5541 0.6601 0.7432 0.8062 0.866 0.9174 0.9569 0.9569 0.9569',
      b: '0.1208 0.1208 0.132 0.197 0.2616 0.3103 0.359 0.4146 0.5072 0.5998 0.6804 0.7505 0.8172 0.8745 0.9184 0.9184 0.9184' },
    hub: { id: 'kbHub',
      r: '0.1475 0.1475 0.168 0.287 0.4053 0.4945 0.5837 0.6794 0.8093 0.9391 1 1 1 1 1 1 1',
      g: '0.1365 0.1365 0.149 0.2212 0.2931 0.3473 0.4014 0.4631 0.5646 0.6661 0.7467 0.8087 0.8677 0.9184 0.9573 0.9573 0.9573',
      b: '0.0494 0.0494 0.0492 0.0477 0.0462 0.0452 0.0441 0.0498 0.0916 0.1334 0.2499 0.4324 0.6061 0.7551 0.8694 0.8694 0.8694' },
    forge: { id: 'kbForge',
      r: '0.1788 0.1788 0.2045 0.3526 0.4999 0.611 0.7221 0.8268 0.897 0.9671 1 1 1 1 1 1 1',
      g: '0.0973 0.0973 0.1034 0.1392 0.1748 0.2016 0.2284 0.259 0.3098 0.3605 0.4574 0.5949 0.7258 0.8381 0.9243 0.9243 0.9243',
      b: '0.0776 0.0776 0.0819 0.1068 0.1314 0.15 0.1686 0.1921 0.2414 0.2906 0.3911 0.5367 0.6753 0.7943 0.8855 0.8855 0.8855' },
    k4y: { id: 'kbK4Y',
      r: '0.0518 0.0518 0.0569 0.0869 0.1166 0.1391 0.1615 0.1844 0.2098 0.2352 0.3388 0.5113 0.6756 0.8166 0.9247 0.9247 0.9247',
      g: '0.1451 0.1451 0.159 0.2393 0.3191 0.3793 0.4395 0.5001 0.5628 0.6255 0.695 0.7705 0.8424 0.9041 0.9514 0.9514 0.9514',
      b: '0.0941 0.0941 0.1011 0.1412 0.1811 0.2112 0.2413 0.2721 0.3064 0.3408 0.429 0.5647 0.6939 0.8048 0.8898 0.8898 0.8898' }
  };

  var NS = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('id', 'kayan-bird-filters');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  var defs = document.createElementNS(NS, 'defs');
  svg.appendChild(defs);

  Object.keys(R).forEach(function (key) {
    var c = R[key];
    var f = document.createElementNS(NS, 'filter');
    f.setAttribute('id', c.id);
    f.setAttribute('x', '-2%'); f.setAttribute('y', '-2%');
    f.setAttribute('width', '104%'); f.setAttribute('height', '104%');
    f.setAttribute('color-interpolation-filters', 'sRGB');
    var m = document.createElementNS(NS, 'feColorMatrix');
    m.setAttribute('type', 'saturate'); m.setAttribute('values', '0');
    f.appendChild(m);
    var t = document.createElementNS(NS, 'feComponentTransfer');
    [['feFuncR', c.r], ['feFuncG', c.g], ['feFuncB', c.b]].forEach(function (p) {
      var fn = document.createElementNS(NS, p[0]);
      fn.setAttribute('type', 'table');
      fn.setAttribute('tableValues', p[1]);
      t.appendChild(fn);
    });
    f.appendChild(t);
    defs.appendChild(f);
  });

  var st = document.createElement('style');
  st.setAttribute('data-kayan-bird-filters', '');
  st.textContent = Object.keys(R).map(function (key) {
    return '[data-bird="' + key + '"]{filter:url(#' + R[key].id + ')}';
  }).join('\n');

  function mount() {
    var host = document.body || document.documentElement;
    host.insertBefore(svg, host.firstChild);
    (document.head || host).appendChild(st);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount, { once: true });
})();
