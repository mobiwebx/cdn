/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { n as caretBackSharp, o as arrowDown } from './index6.js';
import { c as config, b as getIonMode, a as isPlatform } from './ionic-global.js';
import { E as ENABLE_HTML_CONTENT_DEFAULT, a as sanitizeDOMString } from './config.js';
import { d as defineCustomElement$2, S as SPINNERS } from './spinner.js';
import { d as defineCustomElement$3 } from './icon.js';

const RefresherContent = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.customHTMLEnabled = config.get('innerHTMLTemplatesEnabled', ENABLE_HTML_CONTENT_DEFAULT);
  }
  componentWillLoad() {
    if (this.pullingIcon === undefined) {
      const mode = getIonMode(this);
      const overflowRefresher = this.el.style.webkitOverflowScrolling !== undefined ? 'lines' : arrowDown;
      this.pullingIcon = config.get('refreshingIcon', mode === 'ios' && isPlatform('mobile') ? config.get('spinner', overflowRefresher) : 'circular');
    }
    if (this.refreshingSpinner === undefined) {
      const mode = getIonMode(this);
      this.refreshingSpinner = config.get('refreshingSpinner', config.get('spinner', mode === 'ios' ? 'lines' : 'circular'));
    }
  }
  renderPullingText() {
    const { customHTMLEnabled, pullingText } = this;
    if (customHTMLEnabled) {
      return h("div", { class: "refresher-pulling-text", innerHTML: sanitizeDOMString(pullingText) });
    }
    return h("div", { class: "refresher-pulling-text" }, pullingText);
  }
  renderRefreshingText() {
    const { customHTMLEnabled, refreshingText } = this;
    if (customHTMLEnabled) {
      return h("div", { class: "refresher-refreshing-text", innerHTML: sanitizeDOMString(refreshingText) });
    }
    return h("div", { class: "refresher-refreshing-text" }, refreshingText);
  }
  render() {
    const pullingIcon = this.pullingIcon;
    const hasSpinner = pullingIcon != null && SPINNERS[pullingIcon] !== undefined;
    const mode = getIonMode(this);
    return (h(Host, { class: mode }, h("div", { class: "refresher-pulling" }, this.pullingIcon && hasSpinner && (h("div", { class: "refresher-pulling-icon" }, h("div", { class: "spinner-arrow-container" }, h("ion-spinner", { name: this.pullingIcon, paused: true }), mode === 'md' && this.pullingIcon === 'circular' && (h("div", { class: "arrow-container" }, h("ion-icon", { icon: caretBackSharp })))))), this.pullingIcon && !hasSpinner && (h("div", { class: "refresher-pulling-icon" }, h("ion-icon", { icon: this.pullingIcon, lazy: false }))), this.pullingText !== undefined && this.renderPullingText()), h("div", { class: "refresher-refreshing" }, this.refreshingSpinner && (h("div", { class: "refresher-refreshing-icon" }, h("ion-spinner", { name: this.refreshingSpinner }))), this.refreshingText !== undefined && this.renderRefreshingText())));
  }
  get el() { return this; }
}, [0, "ion-refresher-content", {
    "pullingIcon": [1025, "pulling-icon"],
    "pullingText": [1, "pulling-text"],
    "refreshingSpinner": [1025, "refreshing-spinner"],
    "refreshingText": [1, "refreshing-text"]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["ion-refresher-content", "ion-icon", "ion-spinner"];
  components.forEach(tagName => { switch (tagName) {
    case "ion-refresher-content":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, RefresherContent);
      }
      break;
    case "ion-icon":
      if (!customElements.get(tagName)) {
        defineCustomElement$3();
      }
      break;
    case "ion-spinner":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const IonRefresherContent = RefresherContent;
const defineCustomElement = defineCustomElement$1;

export { IonRefresherContent, defineCustomElement };
