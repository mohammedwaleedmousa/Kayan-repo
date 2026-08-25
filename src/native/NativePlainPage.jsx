import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NativeTemplate from './NativeTemplate.jsx';
import { ensureScript } from './NativeDcPage.jsx';
import { isInternalHomeHref, routeForHomeHref } from '../home/homeRoutes.js';

export default function NativePlainPage({ template, styles, title, scripts = [], stylesheets = [], scriptText, mount, language = false }) {
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    document.body.classList.add('home-native');
    document.title = title;
    if (language) {
      let value = 'en';
      try { value = localStorage.getItem('kyn-lang') || 'en'; } catch {}
      if (!['ar', 'en'].includes(value)) value = 'en';
      document.documentElement.dataset.lang = value;
      document.documentElement.lang = value;
      document.documentElement.dir = value === 'en' ? 'ltr' : 'rtl';
    }
    const links = stylesheets.map((href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = href; link.dataset.nativeStylesheet = href;
      document.head.appendChild(link); return link;
    });
    let dispose;
    const start = setTimeout(() => {
      scripts.reduce((chain, src) => chain.then(() => ensureScript(src)), Promise.resolve())
        .then(() => {
          if (!active) return;
          dispose = mount?.() || (scriptText ? new Function(scriptText)() : undefined);
        })
        .catch(() => {});
    }, 0);
    const onClick = (event) => {
      const langButton = event.target.closest?.('[data-native-lang]');
      if (langButton && window.__setLang) { window.__setLang(langButton.dataset.nativeLang); return; }
      const anchor = event.target.closest?.('a[href]');
      if (!anchor || event.defaultPrevented || event.button > 0) return;
      const route = routeForHomeHref(anchor.getAttribute('href'));
      if (!isInternalHomeHref(route)) return;
      event.preventDefault(); navigate(route);
    };
    document.addEventListener('click', onClick);
    return () => {
      active = false;
      document.removeEventListener('click', onClick);
      clearTimeout(start);
      document.body.classList.remove('home-native');
      links.forEach((link) => link.remove());
      dispose?.();
    };
  }, [language, mount, navigate, scriptText, scripts, stylesheets, title]);
  return <><style>{styles}</style><NativeTemplate values={{}} templateSource={template} /></>;
}
