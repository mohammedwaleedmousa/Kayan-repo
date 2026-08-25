import React, { useMemo } from 'react';
import template from './home-template.html?raw';
import { routeForHomeHref } from './homeRoutes.js';

const EVENT_NAMES = {
  onclick: 'onClick',
  oninput: 'onInput',
  onchange: 'onChange',
  onsubmit: 'onSubmit',
  onmouseenter: 'onMouseEnter',
  onmouseleave: 'onMouseLeave',
  onmousemove: 'onMouseMove',
  onfocus: 'onFocus',
  onblur: 'onBlur',
};

const ATTRIBUTE_NAMES = {
  class: 'className',
  tabindex: 'tabIndex',
  crossorigin: 'crossOrigin',
  'marker-start': 'markerStart',
  'marker-end': 'markerEnd',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  viewbox: 'viewBox',
  refx: 'refX',
  refy: 'refY',
  markerwidth: 'markerWidth',
  markerheight: 'markerHeight',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-opacity': 'strokeOpacity',
  'stroke-dashoffset': 'strokeDashoffset',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'text-anchor': 'textAnchor',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'vector-effect': 'vectorEffect',
  'fill-opacity': 'fillOpacity',
  repeatcount: 'repeatCount',
  keypoints: 'keyPoints',
  keytimes: 'keyTimes',
  calcmode: 'calcMode',
  keysplines: 'keySplines',
  preserveaspectratio: 'preserveAspectRatio',
  pathlength: 'pathLength',
};

function readPath(expression, scope) {
  const path = expression.trim().replace(/^\{\{\s*|\s*\}\}$/g, '');
  return path.split('.').reduce((value, key) => value?.[key], scope);
}

function interpolate(value, scope) {
  const exact = value.match(/^\s*\{\{\s*([^}]+)\s*\}\}\s*$/);
  if (exact) return readPath(exact[1], scope);
  return value.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, path) => {
    const resolved = readPath(path, scope);
    return resolved == null ? '' : String(resolved);
  });
}

function styleObject(cssText) {
  if (!cssText || typeof cssText !== 'string') return cssText || undefined;
  cssText = cssText.replace(/url\((['"]?)(assets|uploads)\//g, 'url($1/legacy/$2/');
  const style = {};
  for (const declaration of cssText.split(';')) {
    const separator = declaration.indexOf(':');
    if (separator < 0) continue;
    const name = declaration.slice(0, separator).trim();
    const value = declaration.slice(separator + 1).trim();
    if (!name || !value) continue;
    const reactName = name.startsWith('--')
      ? name
      : name.replace(/^-webkit-/, 'Webkit-').replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    style[reactName] = value;
  }
  return style;
}

function enhanceInteractiveStyles(props, hoverCss, activeCss) {
  const originalEnter = props.onMouseEnter;
  const originalLeave = props.onMouseLeave;
  const originalDown = props.onPointerDown;
  const originalUp = props.onPointerUp;

  if (hoverCss) {
    props.onMouseEnter = (event) => {
      event.currentTarget.dataset.reactBaseStyle = event.currentTarget.getAttribute('style') || '';
      event.currentTarget.style.cssText += `;${hoverCss}`;
      originalEnter?.(event);
    };
    props.onMouseLeave = (event) => {
      if (event.currentTarget.dataset.reactBaseStyle != null) {
        event.currentTarget.setAttribute('style', event.currentTarget.dataset.reactBaseStyle);
      }
      originalLeave?.(event);
    };
  }

  if (activeCss) {
    props.onPointerDown = (event) => {
      event.currentTarget.dataset.reactActiveStyle = event.currentTarget.getAttribute('style') || '';
      event.currentTarget.style.cssText += `;${activeCss}`;
      originalDown?.(event);
    };
    props.onPointerUp = props.onPointerCancel = (event) => {
      if (event.currentTarget.dataset.reactActiveStyle != null) {
        event.currentTarget.setAttribute('style', event.currentTarget.dataset.reactActiveStyle);
      }
      originalUp?.(event);
    };
  }
}

function renderNode(node, scope, key) {
  if (node.nodeType === Node.TEXT_NODE) {
    return interpolate(node.textContent, scope);
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const tag = node.tagName.toLowerCase();
  if (tag === 'sc-if') {
    const shown = interpolate(node.getAttribute('value') || '', scope);
    return shown ? renderChildren(node, scope, key) : null;
  }
  if (tag === 'sc-for') {
    const list = interpolate(node.getAttribute('list') || '', scope) || [];
    const alias = node.getAttribute('as') || 'item';
    return Array.from(list).map((item, index) => (
      <React.Fragment key={`${key}-row-${index}`}>
        {renderChildren(node, { ...scope, [alias]: item }, `${key}-${index}`)}
      </React.Fragment>
    ));
  }

  const props = { key };
  let hoverCss = '';
  let activeCss = '';
  for (const attribute of node.attributes) {
    const rawName = attribute.name.toLowerCase();
    const resolved = interpolate(attribute.value, scope);
    if (rawName.startsWith('hint-') || rawName === 'component-from-global-scope' || rawName === 'from') continue;
    if (rawName === 'style-hover') { hoverCss = resolved; continue; }
    if (rawName === 'style-active') { activeCss = resolved; continue; }
    if (rawName === 'style') { props.style = styleObject(resolved); continue; }
    if (rawName === 'ref') { props.ref = resolved; continue; }
    if (EVENT_NAMES[rawName]) { props[EVENT_NAMES[rawName]] = resolved; continue; }

    const name = ATTRIBUTE_NAMES[rawName] || rawName;
    if (name === 'href') props[name] = routeForHomeHref(resolved);
    else if (name === 'src' && typeof resolved === 'string' && /^(assets|uploads)\//.test(resolved)) props[name] = `/legacy/${resolved}`;
    else if (resolved === '') props[name] = '';
    else props[name] = resolved;
  }
  enhanceInteractiveStyles(props, hoverCss, activeCss);

  if (tag === 'x-import' && node.getAttribute('component-from-global-scope') === 'yemen-map') {
    return React.createElement('yemen-map', { ...props, style: { width: '100%', display: 'block' } });
  }

  return React.createElement(tag, props, ...renderChildren(node, scope, key));
}

function renderChildren(node, scope, key) {
  return Array.from(node.childNodes).map((child, index) => renderNode(child, scope, `${key}-${index}`));
}

export default function HomeTemplate({ values, templateSource = template }) {
  const documentRoot = useMemo(() => {
    const parsed = new DOMParser().parseFromString(templateSource, 'text/html');
    return parsed.body.firstElementChild;
  }, [templateSource]);
  return renderNode(documentRoot, values, 'home');
}
