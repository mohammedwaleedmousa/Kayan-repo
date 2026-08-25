import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NativeTemplate from './NativeTemplate.jsx';
import { isInternalHomeHref, routeForHomeHref } from '../home/homeRoutes.js';

const loadedScripts = new Map();

function ensureScript(src) {
  if (loadedScripts.has(src)) return loadedScripts.get(src);
  const promise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-native-src="${src}"]`);
    if (existing) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.dataset.nativeSrc = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  loadedScripts.set(src, promise);
  return promise;
}

function bridgeShadowLinks(navigate) {
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
}

export default function NativeDcPage({ Logic, template, styles, scripts = [], props = {}, title }) {
  const navigate = useNavigate();
  const [, render] = useState(0);
  const logicRef = useRef(null);
  if (!logicRef.current) logicRef.current = new Logic({ ...props, navigate, routeForHref: routeForHomeHref });
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
    if (title) document.title = title;
    scripts.reduce((chain, src) => chain.then(() => ensureScript(src)), Promise.resolve())
      .then(() => bridgeShadowLinks(navigate)).catch(() => {});
    logic.componentDidMount?.();
    const onLink = (event) => {
      const anchor = event.target.closest?.('a[href]');
      if (!anchor || event.defaultPrevented || event.button > 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const route = routeForHomeHref(anchor.getAttribute('href'));
      if (!isInternalHomeHref(route)) return;
      event.preventDefault();
      navigate(route);
    };
    document.addEventListener('click', onLink);
    return () => {
      document.removeEventListener('click', onLink);
      document.body.classList.remove('home-native');
      logic.componentWillUnmount?.();
    };
  }, [logic, navigate, scripts, title]);

  return <><style>{styles}</style><NativeTemplate values={logic.renderVals?.() || { rootRef: logic.root }} templateSource={template} /></>;
}
