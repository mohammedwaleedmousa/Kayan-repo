export default class DCLogic {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
  }

  setState(update, callback) {
    const previous = this.state;
    const patch = typeof update === 'function' ? update(previous, this.props) : update;
    this.state = { ...previous, ...patch };
    this.__notify?.(previous, callback);
  }

  forceUpdate(callback) {
    this.__notify?.(this.state, callback);
  }
}
