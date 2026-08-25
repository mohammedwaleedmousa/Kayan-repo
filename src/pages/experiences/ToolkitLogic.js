import React from 'react';
import DCLogic from '../../home/DCLogic.js';

export default class ToolkitLogic extends DCLogic {
  state = { client: '', rep: '', segment: 'A — International institution', tier: 'S2 — Assured (default)', product: 'Brand Starter · 10 days', milestones: '1', deliverables: '', windowDays: 10, urgency: 'Standard window', copied: false };
  renderVals() {
    const s = this.state;
    const set = k => e => this.setState({ [k]: e.target.value, copied: false });
    const lines = s.deliverables.split('\n').map(l => l.trim()).filter(Boolean);
    const dl = lines.length ? lines.map((l, i) => (i + 1) + '. ' + l).join('\n') : '1. — (list deliverables, each with its acceptance test)';
    const ms = { '1': 'One milestone: full amount funded before work begins.', '2': 'Two milestones: midpoint and final, each funded before its work begins.', '3': 'Three staged milestones, each funded before its work begins.' }[s.milestones];
    const summary =
      'CLIENT: ' + (s.client || '—') + '\nREPRESENTATIVE (sole approver): ' + (s.rep || '—') +
      '\nSEGMENT: ' + s.segment + '\nPROMISE: ' + s.tier + '\nBASE: ' + s.product +
      '\n\nDELIVERABLES & ACCEPTANCE TESTS\n' + dl +
      '\n\nWINDOW: ' + (s.windowDays || '—') + ' working days from funding · ' + s.urgency +
      '\nREVISIONS: two rounds within scope; further changes by signed Change Request (KAY-CON-003)' +
      '\nREVIEW: independent quality review before submission; five-working-day client window; documented silence is acceptance' +
      '\nMILESTONES: ' + ms;
    const fundingNote =
      'Work begins when two things exist together:\n1. This scope, signed by both parties.\n2. The first milestone funded in the protected account, proof verified by Kayan finance.\nFunds release only on your written acceptance (or the contracted window lapsing), on two named Kayan signatures. Price per the governed price card; never below the calculated floor.';
    const tierNote = s.tier.indexOf('S3') === 0
      ? 'S3 is not offered until the liability and insurance position settles. Record the request, quote S2, and log the S3 interest for the register.'
      : 'Contributor rates are set independently of this price and disclosed. Segment D pricing carries the reported cross-subsidy line.';
    const refCode = 'KAY-A07 · ' + new Date().toISOString().slice(0, 10);
    return {
      client: s.client, rep: s.rep, segment: s.segment, tier: s.tier, product: s.product,
      milestones: s.milestones, deliverables: s.deliverables, windowDays: s.windowDays, urgency: s.urgency,
      setClient: set('client'), setRep: set('rep'), setSegment: set('segment'), setTier: set('tier'),
      setProduct: set('product'), setMilestones: set('milestones'), setDeliverables: set('deliverables'),
      setWindowDays: set('windowDays'), setUrgency: set('urgency'),
      summary, fundingNote, tierNote, refCode,
      copyLabel: s.copied ? 'Copied ✓' : 'Copy summary + funding note',
      copySummary: () => { navigator.clipboard.writeText(summary + '\n\n' + fundingNote).then(() => this.setState({ copied: true })); },
      resetForm: () => this.setState({ client: '', rep: '', deliverables: '', windowDays: 10, milestones: '1', urgency: 'Standard window', tier: 'S2 — Assured (default)', copied: false })
    };
  }
}