import { useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fileToRoute } from './routes.js';

const LEGACY_ROOT = '/legacy/';

function routeForHref(href, baseUrl) {
  if (!href || href.startsWith('#')) return null;

  let url;
  try {
    url = new URL(href, baseUrl);
  } catch {
    return null;
  }

  if (url.origin !== window.location.origin) return null;
  const marker = '/legacy/';
  const markerAt = url.pathname.toLowerCase().indexOf(marker);
  if (markerAt < 0) return null;

  const file = decodeURIComponent(url.pathname.slice(markerAt + marker.length));
  const route = fileToRoute.get(file.toLocaleLowerCase());
  return route ? `${route}${url.search}${url.hash}` : null;
}

export default function LegacyPage({ file }) {
  const frameRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const source = `${LEGACY_ROOT}${encodeURIComponent(file)}${location.search}`;

  const connectFrame = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    let doc;
    try {
      doc = frame.contentDocument;
    } catch {
      return undefined;
    }
    if (!doc) return undefined;

    if (doc.title) document.title = doc.title;

    const frameWindow = frame.contentWindow;
    frameWindow.KAYAN_SUPABASE_READY = window.KAYAN_SUPABASE_READY;
    frameWindow.KAYAN_SUPABASE_CONFIG = window.KAYAN_SUPABASE_CONFIG;
    if (window.KAYAN_SUPABASE) frameWindow.KAYAN_SUPABASE = window.KAYAN_SUPABASE;

    window.KAYAN_SUPABASE_READY?.then((client) => {
      if (!client || frameRef.current !== frame) return;
      frameWindow.KAYAN_SUPABASE = client;
      frameWindow.dispatchEvent(new frameWindow.CustomEvent('kayan:supabase-ready'));
    });

    const loadedRoute = routeForHref(frameWindow.location.href, window.location.href);
    if (loadedRoute && loadedRoute.split(/[?#]/)[0] !== location.pathname) {
      navigate(loadedRoute);
      return undefined;
    }

    const onClick = (event) => {
      const anchor = event.target.closest?.('a[href]');
      if (!anchor || event.defaultPrevented || event.button > 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const route = routeForHref(anchor.getAttribute('href'), frameWindow.location.href);
      if (!route) return;
      event.preventDefault();
      navigate(route);
    };

    doc.addEventListener('click', onClick);
    return () => doc.removeEventListener('click', onClick);
  }, [location.pathname, navigate]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    frame.addEventListener('load', connectFrame);
    return () => frame.removeEventListener('load', connectFrame);
  }, [connectFrame]);

  return (
    <iframe
      ref={frameRef}
      className="legacy-page"
      src={source}
      title={`Kayan — ${file}`}
      allow="camera; microphone; geolocation; clipboard-write"
    />
  );
}
