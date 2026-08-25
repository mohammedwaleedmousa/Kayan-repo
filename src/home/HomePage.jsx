import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeLogic from './HomeLogic.js';
import HomeTemplate from './HomeTemplate.jsx';
import { isInternalHomeHref, routeForHomeHref } from './homeRoutes.js';
import './home.css';

const HOME_SCRIPTS = [
  'https://unpkg.com/d3@7.9.0/dist/d3.min.js',
  'https://unpkg.com/topojson-client@3.1.0/dist/topojson-client.min.js',
  '/legacy/yemen-map.js',
  '/legacy/kayan-mark.js',
  '/legacy/kayan-compass.js',
];

function ensureScript(src) {
  const current = document.querySelector(`script[data-home-src="${src}"]`);
  if (current) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.dataset.homeSrc = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function HomePage() {
  const navigate = useNavigate();
  const [, render] = useState(0);
  const logicRef = useRef(null);
  if (!logicRef.current) {
    logicRef.current = new HomeLogic({
      defaultLang: 'en',
      sonicEnabled: true,
      navigate,
      routeForHref: routeForHomeHref,
    });
  }
  const logic = logicRef.current;
  logic.props.navigate = navigate;
  logic.__notify = (previous, callback) => {
    logic.__previousState = previous;
    logic.__callback = callback;
    render((revision) => revision + 1);
  };

  useLayoutEffect(() => {
    if (!logic.__previousState) return;
    const previous = logic.__previousState;
    logic.__previousState = null;
    logic.componentDidUpdate?.(logic.props, previous);
    const callback = logic.__callback;
    logic.__callback = null;
    callback?.();
  });

  useEffect(() => {
    document.body.classList.add('home-native');
    document.documentElement.lang = logic.state.lang;
    document.documentElement.dir = logic.state.lang === 'en' ? 'ltr' : 'rtl';
    document.title = 'كيان — خلف كل نجاح، كيان';
    HOME_SCRIPTS.reduce((chain, src) => chain.then(() => ensureScript(src)), Promise.resolve())
      .then(() => {
        document.querySelectorAll('kayan-compass').forEach((compass) => {
          if (!compass.shadowRoot || compass.dataset.reactRoutes) return;
          compass.dataset.reactRoutes = 'true';
          compass.shadowRoot.addEventListener('click', (event) => {
            const anchor = event.target.closest?.('a[href]');
            if (!anchor || event.defaultPrevented) return;
            const route = routeForHomeHref(anchor.getAttribute('href'));
            if (!isInternalHomeHref(route)) return;
            event.preventDefault();
            navigate(route);
          });
        });
      })
      .catch(() => {});
    logic.componentDidMount?.();

    const navigateLegacyLink = (event) => {
      const anchor = event.target.closest?.('a[href]');
      if (!anchor || event.defaultPrevented || event.button > 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const route = routeForHomeHref(anchor.getAttribute('href'));
      if (!isInternalHomeHref(route)) return;
      event.preventDefault();
      navigate(route);
    };
    document.addEventListener('click', navigateLegacyLink);
    return () => {
      document.removeEventListener('click', navigateLegacyLink);
      document.body.classList.remove('home-native');
      logic.componentWillUnmount?.();
    };
  }, [logic, navigate]);

  useEffect(() => {
    document.documentElement.lang = logic.state.lang;
    document.documentElement.dir = logic.state.lang === 'en' ? 'ltr' : 'rtl';
  }, [logic.state.lang]);

  return <HomeTemplate values={logic.renderVals()} />;
}
