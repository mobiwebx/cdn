/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { readTask, writeTask, proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { b as getIonMode } from './ionic-global.js';
import { f as findIonContent, p as printIonContentErrorMsg, g as getScrollElement } from './index8.js';
import { c as createKeyboardController } from './keyboard-controller.js';
import { h as clamp } from './helpers.js';

const handleFooterFade = (scrollEl, baseEl) => {
  readTask(() => {
    const scrollTop = scrollEl.scrollTop;
    const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
    /**
     * Toolbar background will fade
     * out over fadeDuration in pixels.
     */
    const fadeDuration = 10;
    /**
     * Begin fading out maxScroll - 30px
     * from the bottom of the content.
     * Also determine how close we are
     * to starting the fade. If we are
     * before the starting point, the
     * scale value will get clamped to 0.
     * If we are after the maxScroll (rubber
     * band scrolling), the scale value will
     * get clamped to 1.
     */
    const fadeStart = maxScroll - fadeDuration;
    const distanceToStart = scrollTop - fadeStart;
    const scale = clamp(0, 1 - distanceToStart / fadeDuration, 1);
    writeTask(() => {
      baseEl.style.setProperty('--opacity-scale', scale.toString());
    });
  });
};

const footerIosCss = "ion-footer{display:block;position:relative;-ms-flex-order:1;order:1;width:100%;z-index:10}ion-footer.footer-toolbar-padding ion-toolbar:last-of-type{padding-bottom:var(--ion-safe-area-bottom, 0)}.footer-ios ion-toolbar:first-of-type{--border-width:0.55px 0 0}@supports ((-webkit-backdrop-filter: blur(0)) or (backdrop-filter: blur(0))){.footer-background{left:0;right:0;top:0;bottom:0;position:absolute;-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px)}.footer-translucent-ios ion-toolbar{--opacity:.8}}.footer-ios.ion-no-border ion-toolbar:first-of-type{--border-width:0}.footer-collapse-fade ion-toolbar{--opacity-scale:inherit}";

const footerMdCss = "ion-footer{display:block;position:relative;-ms-flex-order:1;order:1;width:100%;z-index:10}ion-footer.footer-toolbar-padding ion-toolbar:last-of-type{padding-bottom:var(--ion-safe-area-bottom, 0)}.footer-md::before{left:0;top:-2px;bottom:auto;background-position:left 0 top 0;position:absolute;width:100%;height:2px;background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAHBAMAAADzDtBxAAAAD1BMVEUAAAAAAAAAAAAAAAAAAABPDueNAAAABXRSTlMUCS0gBIh/TXEAAAAaSURBVAjXYxCEAgY4UIICBmMogMsgFLtAAQCNSwXZKOdPxgAAAABJRU5ErkJggg==\");background-repeat:repeat-x;content:\"\"}[dir=rtl] .footer-md::before,:host-context([dir=rtl]) .footer-md::before{left:unset;right:unset;right:0}[dir=rtl] .footer-md::before,:host-context([dir=rtl]) .footer-md::before{background-position:right 0 top 0}.footer-md.ion-no-border::before{display:none}";

const Footer = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.keyboardCtrl = null;
    this.keyboardVisible = false;
    /**
     * If `true`, the footer will be translucent.
     * Only applies when the mode is `"ios"` and the device supports
     * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
     *
     * Note: In order to scroll content behind the footer, the `fullscreen`
     * attribute needs to be set on the content.
     */
    this.translucent = false;
    this.checkCollapsibleFooter = () => {
      const mode = getIonMode(this);
      if (mode !== 'ios') {
        return;
      }
      const { collapse } = this;
      const hasFade = collapse === 'fade';
      this.destroyCollapsibleFooter();
      if (hasFade) {
        const pageEl = this.el.closest('ion-app,ion-page,.ion-page,page-inner');
        const contentEl = pageEl ? findIonContent(pageEl) : null;
        if (!contentEl) {
          printIonContentErrorMsg(this.el);
          return;
        }
        this.setupFadeFooter(contentEl);
      }
    };
    this.setupFadeFooter = async (contentEl) => {
      const scrollEl = (this.scrollEl = await getScrollElement(contentEl));
      /**
       * Handle fading of toolbars on scroll
       */
      this.contentScrollCallback = () => {
        handleFooterFade(scrollEl, this.el);
      };
      scrollEl.addEventListener('scroll', this.contentScrollCallback);
      handleFooterFade(scrollEl, this.el);
    };
  }
  componentDidLoad() {
    this.checkCollapsibleFooter();
  }
  componentDidUpdate() {
    this.checkCollapsibleFooter();
  }
  connectedCallback() {
    this.keyboardCtrl = createKeyboardController((keyboardOpen) => {
      this.keyboardVisible = keyboardOpen; // trigger re-render by updating state
    });
  }
  disconnectedCallback() {
    if (this.keyboardCtrl) {
      this.keyboardCtrl.destroy();
    }
  }
  destroyCollapsibleFooter() {
    if (this.scrollEl && this.contentScrollCallback) {
      this.scrollEl.removeEventListener('scroll', this.contentScrollCallback);
      this.contentScrollCallback = undefined;
    }
  }
  render() {
    const { translucent, collapse } = this;
    const mode = getIonMode(this);
    const tabs = this.el.closest('ion-tabs');
    const tabBar = tabs === null || tabs === void 0 ? void 0 : tabs.querySelector(':scope > ion-tab-bar');
    return (h(Host, { role: "contentinfo", class: {
        [mode]: true,
        // Used internally for styling
        [`footer-${mode}`]: true,
        [`footer-translucent`]: translucent,
        [`footer-translucent-${mode}`]: translucent,
        ['footer-toolbar-padding']: !this.keyboardVisible && (!tabBar || tabBar.slot !== 'bottom'),
        [`footer-collapse-${collapse}`]: collapse !== undefined,
      } }, mode === 'ios' && translucent && h("div", { class: "footer-background" }), h("slot", null)));
  }
  get el() { return this; }
  static get style() { return {
    ios: footerIosCss,
    md: footerMdCss
  }; }
}, [36, "ion-footer", {
    "collapse": [1],
    "translucent": [4],
    "keyboardVisible": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["ion-footer"];
  components.forEach(tagName => { switch (tagName) {
    case "ion-footer":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, Footer);
      }
      break;
  } });
}

const IonFooter = Footer;
const defineCustomElement = defineCustomElement$1;

export { IonFooter, defineCustomElement };
