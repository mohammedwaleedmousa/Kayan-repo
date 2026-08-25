import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeLogic from './HomeLogic.js';
import HomeTemplate from './HomeTemplate.jsx';
import { isInternalHomeHref, routeForHomeHref } from './homeRoutes.js';
import { ensureScript } from '../native/NativeDcPage.jsx';
import './home.css';

const HOME_SCRIPTS = [
  '/legacy/yemen-map.js',
  '/legacy/kayan-mark.js',
  '/legacy/kayan-compass.js',
];

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
    let active = true;
    document.body.classList.add('home-native');
    document.documentElement.lang = logic.state.lang;
    document.documentElement.dir = logic.state.lang === 'en' ? 'ltr' : 'rtl';
    document.title = 'كيان — خلف كل نجاح، كيان';
    HOME_SCRIPTS.reduce((chain, src) => chain.then(() => ensureScript(src)), Promise.resolve())
      .then(() => {
        if (!active) return;
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
      active = false;
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
