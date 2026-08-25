const legacyHrefRoutes = new Map([
  ['kayan home.dc.html', '/'],
  ['kayan record.dc.html', '/record'],
  ['kayan seal.dc.html', '/seal'],
  ['kayan charter.dc.html', '/charter'],
  ['kayan journey.dc.html', '/journey'],
  ['kayan for clients.dc.html', '/clients'],
  ['kayan client profile.dc.html', '/clients/account'],
  ['kayan for talent.dc.html', '/talent'],
  ['kayan talent profile.dc.html', '/talent/profile'],
  ['kayan toolkit - scoping form.dc.html', '/tools/scope'],
  ['line i - managed delivery.dc.html', '/lines/delivery'],
  ['line i - managed delivery en.dc.html', '/en/lines/delivery'],
  ['line i - ready products.dc.html', '/lines/products'],
  ['line ii - the hub and cafe.dc.html', '/lines/hub'],
  ['line ii - the hub and cafe en.dc.html', '/en/lines/hub'],
  ['kayan hub.html', '/hub-location'],
  ['line iii - the forge.dc.html', '/lines/forge'],
  ['line iii - the forge en.dc.html', '/en/lines/forge'],
  ['civic wing - kayan for yemen.dc.html', '/k4y'],
  ['kayan people.dc.html', '/people'],
  ['kayan planet.dc.html', '/planet'],
  ['kayan legal.dc.html', '/legal'],
  ['kayan atlas.html', '/atlas'],
  ['kayan dimension.html', '/voyage'],
  ['kayan access.dc.html', '/access'],
  ['kayan apply.dc.html', '/apply'],
  ['kayan portal.dc.html', '/portal'],
  ['kayan space - client.dc.html', '/space/client'],
  ['kayan space - talent.dc.html', '/space/talent'],
  ['kayan pod room.dc.html', '/pod'],
  ['kayan admin.dc.html', '/admin'],
]);

export function routeForHomeHref(href) {
  if (!href || href.startsWith('#')) return href || '/';
  if (/^(?:https?:|mailto:|tel:)/i.test(href)) return href;

  const [fileAndQuery, hash = ''] = href.split('#');
  const [file, query = ''] = fileAndQuery.split('?');
  const route = legacyHrefRoutes.get(decodeURIComponent(file).toLocaleLowerCase());
  if (!route) return href;
  return `${route}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
}

export function isInternalHomeHref(href) {
  return typeof href === 'string' && href.startsWith('/');
}
