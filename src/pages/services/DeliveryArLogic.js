import React from 'react';
import DCLogic from '../../home/DCLogic.js';

export default class DeliveryArLogic extends DCLogic {
  constructor(props) {
    super(props);
    this.root = React.createRef();
    this.hdr = React.createRef();
  }
  componentDidMount() {
    const el = this.root.current;
    if (!el) return;
    const hero = el.querySelector('[data-hero]');
    const onScroll = () => {
      const h = this.hdr.current;
      if (!h) return;
      const on = hero ? hero.getBoundingClientRect().top < -30 : false;
      h.style.background = on ? 'rgba(7,32,48,.94)' : 'transparent';
      h.style.borderBottomColor = on ? 'rgba(250,246,236,.14)' : 'transparent';
      h.style.backdropFilter = on ? 'blur(16px)' : 'none';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    this.onScroll = onScroll;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.props.motion === false || reduce) return;
    el.setAttribute('data-mo', '');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.setAttribute('data-on', ''); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    el.querySelectorAll('[data-reveal]').forEach((n) => io.observe(n));
    this.io = io;
  }
  componentWillUnmount() {
    if (this.io) this.io.disconnect();
    if (this.onScroll) window.removeEventListener('scroll', this.onScroll, { capture: true });
  }
  renderVals() {
    const tier = this.props.defaultTier || 'S2';
    return {
      rootRef: this.root,
      hdrRef: this.hdr,
      showLatin: this.props.showLatin !== false,
      isS1: tier === 'S1',
      isS2: tier === 'S2',
      isS3: tier === 'S3'
    };
  }
}