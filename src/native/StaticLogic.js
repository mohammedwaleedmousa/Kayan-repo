import React from 'react';
import DCLogic from '../home/DCLogic.js';

export default class StaticLogic extends DCLogic {
  constructor(props) { super(props); this.root = React.createRef(); }
  renderVals() { return { rootRef: this.root }; }
}
