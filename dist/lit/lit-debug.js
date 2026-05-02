import { LitElement } from './lit-core.min.js';
// // local copy of RELEASE 3.0.1 of
// https://www.jsdelivr.com/package/gh/lit/dist

class DebugLitElement extends LitElement {
  constructor() {
    super();

    // Wrap dispatchEvent → log alle custom events
    const origDispatch = this.dispatchEvent;
    this.dispatchEvent = (event) => {
      console.debug(`[${this.tagName.toLowerCase()}] dispatchEvent:`, {
        type: event.type,
        detail: event.detail
      });
      return origDispatch.call(this, event);
    };
  }
  willUpdate(changedProperties){
    super.willUpdate();
  }
  update(changedProperties)
  {
    super.update(changedProperties);
  }

  updated(changedProps) {
    changedProps.forEach((oldValue, key) => {
      const newValue = this[key];
      console.debug(`[${this.tagName.toLowerCase()}] property "${key}" changed:`, {
        old: oldValue,
        new: newValue
      });
    });

    if (super.updated) {
      super.updated(changedProps);
    }
  }

  render() {
    console.debug(`[${this.tagName.toLowerCase()}] render() triggered`);
    return super.render();
  }
}

// Exporteren als “LitElement” zodat je het kunt gebruiken als drop-in replacement
export { DebugLitElement as LitElement };
