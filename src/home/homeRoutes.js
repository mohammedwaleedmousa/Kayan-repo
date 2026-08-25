import { fileToRoute } from '../routes.js';

export function routeForHomeHref(href) {
  if (!href || href.startsWith('#')) return href || '/';
  if (/^(?:https?:|mailto:|tel:)/i.test(href)) return href;

  const [fileAndQuery, hash = ''] = href.split('#');
  const [file, query = ''] = fileAndQuery.split('?');
  const route = fileToRoute.get(decodeURIComponent(file).toLocaleLowerCase());
  if (!route) return href;
  return `${route}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
}

export function isInternalHomeHref(href) {
  return typeof href === 'string' && href.startsWith('/');
}
