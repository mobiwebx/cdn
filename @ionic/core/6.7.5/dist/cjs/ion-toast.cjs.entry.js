/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-cbf0b508.js');
const ionicGlobal = require('./ionic-global-b4ea2adc.js');
const config = require('./config-803b8420.js');
const index$1 = require('./index-79605113.js');
const overlays = require('./overlays-279bc1a4.js');
const theme = require('./theme-e6fec71e.js');
const animation = require('./animation-766087ba.js');
const helpers = require('./helpers-ebc49e0f.js');
require('./hardware-back-button-bae6e13a.js');
require('./index-823295fd.js');

/**
 * iOS Toast Enter Animation
 */
const iosEnterAnimation = (baseEl, position) => {
  const baseAnimation = animation.createAnimation();
  const wrapperAnimation = animation.createAnimation();
  const root = helpers.getElementRoot(baseEl);
  const wrapperEl = root.querySelector('.toast-wrapper');
  const bottom = `calc(-10px - var(--ion-safe-area-bottom, 0px))`;
  const top = `calc(10px + var(--ion-safe-area-top, 0px))`;
  wrapperAnimation.addElement(wrapperEl);
  switch (position) {
    case 'top':
      wrapperAnimation.fromTo('transform', 'translateY(-100%)', `translateY(${top})`);
      break;
    case 'middle':
      const topPosition = Math.floor(baseEl.clientHeight / 2 - wrapperEl.clientHeight / 2);
      wrapperEl.style.top = `${topPosition}px`;
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
    default:
      wrapperAnimation.fromTo('transform', 'translateY(100%)', `translateY(${bottom})`);
      break;
  }
  return baseAnimation.easing('cubic-bezier(.155,1.105,.295,1.12)').duration(400).addAnimation(wrapperAnimation);
};

/**
 * iOS Toast Leave Animation
 */
const iosLeaveAnimation = (baseEl, position) => {
  const baseAnimation = animation.createAnimation();
  const wrapperAnimation = animation.createAnimation();
  const root = helpers.getElementRoot(baseEl);
  const wrapperEl = root.querySelector('.toast-wrapper');
  const bottom = `calc(-10px - var(--ion-safe-area-bottom, 0px))`;
  const top = `calc(10px + var(--ion-safe-area-top, 0px))`;
  wrapperAnimation.addElement(wrapperEl);
  switch (position) {
    case 'top':
      wrapperAnimation.fromTo('transform', `translateY(${top})`, 'translateY(-100%)');
      break;
    case 'middle':
      wrapperAnimation.fromTo('opacity', 0.99, 0);
      break;
    default:
      wrapperAnimation.fromTo('transform', `translateY(${bottom})`, 'translateY(100%)');
      break;
  }
  return baseAnimation.easing('cubic-bezier(.36,.66,.04,1)').duration(300).addAnimation(wrapperAnimation);
};

/**
 * MD Toast Enter Animation
 */
const mdEnterAnimation = (baseEl, position) => {
  const baseAnimation = animation.createAnimation();
  const wrapperAnimation = animation.createAnimation();
  const root = helpers.getElementRoot(baseEl);
  const wrapperEl = root.querySelector('.toast-wrapper');
  const bottom = `calc(8px + var(--ion-safe-area-bottom, 0px))`;
  const top = `calc(8px + var(--ion-safe-area-top, 0px))`;
  wrapperAnimation.addElement(wrapperEl);
  switch (position) {
    case 'top':
      wrapperEl.style.top = top;
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
    case 'middle':
      const topPosition = Math.floor(baseEl.clientHeight / 2 - wrapperEl.clientHeight / 2);
      wrapperEl.style.top = `${topPosition}px`;
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
    default:
      wrapperEl.style.bottom = bottom;
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
  }
  return baseAnimation.easing('cubic-bezier(.36,.66,.04,1)').duration(400).addAnimation(wrapperAnimation);
};

/**
 * md Toast Leave Animation
 */
const mdLeaveAnimation = (baseEl) => {
  const baseAnimation = animation.createAnimation();
  const wrapperAnimation = animation.createAnimation();
  const root = helpers.getElementRoot(baseEl);
  const wrapperEl = root.querySelector('.toast-wrapper');
  wrapperAnimation.addElement(wrapperEl).fromTo('opacity', 0.99, 0);
  return baseAnimation.easing('cubic-bezier(.36,.66,.04,1)').duration(300).addAnimation(wrapperAnimation);
};

const toastIosCss = ":host{--border-width:0;--border-style:none;--border-color:initial;--box-shadow:none;--min-width:auto;--width:auto;--min-height:auto;--height:auto;--max-height:auto;--white-space:normal;left:0;top:0;display:block;position:absolute;width:100%;height:100%;outline:none;color:var(--color);font-family:var(--ion-font-family, inherit);contain:strict;z-index:1001;pointer-events:none}:host-context([dir=rtl]){left:unset;right:unset;right:0}:host(.overlay-hidden){display:none}:host(.ion-color){--button-color:inherit;color:var(--ion-color-contrast)}:host(.ion-color) .toast-button-cancel{color:inherit}:host(.ion-color) .toast-wrapper{background:var(--ion-color-base)}.toast-wrapper{border-radius:var(--border-radius);left:var(--start);right:var(--end);width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);background:var(--background);-webkit-box-shadow:var(--box-shadow);box-shadow:var(--box-shadow)}[dir=rtl] .toast-wrapper,:host-context([dir=rtl]) .toast-wrapper{left:unset;right:unset;left:var(--end);right:var(--start)}.toast-container{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;pointer-events:auto;height:inherit;min-height:inherit;max-height:inherit;contain:content}.toast-layout-stacked .toast-container{-ms-flex-wrap:wrap;flex-wrap:wrap}.toast-layout-baseline .toast-content{display:-ms-flexbox;display:flex;-ms-flex:1;flex:1;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center}.toast-icon{margin-left:16px}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.toast-icon{margin-left:unset;-webkit-margin-start:16px;margin-inline-start:16px}}.toast-message{-ms-flex:1;flex:1;white-space:var(--white-space)}.toast-button-group{display:-ms-flexbox;display:flex}.toast-layout-stacked .toast-button-group{-ms-flex-pack:end;justify-content:end;width:100%}.toast-button{border:0;outline:none;color:var(--button-color);z-index:0}.toast-icon,.toast-button-icon{font-size:1.4em}.toast-button-inner{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}@media (any-hover: hover){.toast-button:hover{cursor:pointer}}:host{--background:var(--ion-color-step-50, #f2f2f2);--border-radius:14px;--button-color:var(--ion-color-primary, #3880ff);--color:var(--ion-color-step-850, #262626);--max-width:700px;--start:10px;--end:10px;font-size:14px}.toast-wrapper{margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;display:block;position:absolute;z-index:10}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.toast-wrapper{margin-left:unset;margin-right:unset;-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto}}@supports ((-webkit-backdrop-filter: blur(0)) or (backdrop-filter: blur(0))){:host(.toast-translucent) .toast-wrapper{background:rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8);-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px)}}.toast-wrapper.toast-top{-webkit-transform:translate3d(0,  -100%,  0);transform:translate3d(0,  -100%,  0);top:0}.toast-wrapper.toast-middle{opacity:0.01}.toast-wrapper.toast-bottom{-webkit-transform:translate3d(0,  100%,  0);transform:translate3d(0,  100%,  0);bottom:0}.toast-content{padding-left:15px;padding-right:15px;padding-top:15px;padding-bottom:15px}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.toast-content{padding-left:unset;padding-right:unset;-webkit-padding-start:15px;padding-inline-start:15px;-webkit-padding-end:15px;padding-inline-end:15px}}.toast-header{margin-bottom:2px;font-weight:500}.toast-button{padding-left:15px;padding-right:15px;padding-top:10px;padding-bottom:10px;height:44px;-webkit-transition:background-color, opacity 100ms linear;transition:background-color, opacity 100ms linear;border:0;background-color:transparent;font-family:var(--ion-font-family);font-size:17px;font-weight:500;overflow:hidden}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.toast-button{padding-left:unset;padding-right:unset;-webkit-padding-start:15px;padding-inline-start:15px;-webkit-padding-end:15px;padding-inline-end:15px}}.toast-button.ion-activated{opacity:0.4}@media (any-hover: hover){.toast-button:hover{opacity:0.6}}";

const toastMdCss = ":host{--border-width:0;--border-style:none;--border-color:initial;--box-shadow:none;--min-width:auto;--width:auto;--min-height:auto;--height:auto;--max-height:auto;--white-space:normal;left:0;top:0;display:block;position:absolute;width:100%;height:100%;outline:none;color:var(--color);font-family:var(--ion-font-family, inherit);contain:strict;z-index:1001;pointer-events:none}:host-context([dir=rtl]){left:unset;right:unset;right:0}:host(.overlay-hidden){display:none}:host(.ion-color){--button-color:inherit;color:var(--ion-color-contrast)}:host(.ion-color) .toast-button-cancel{color:inherit}:host(.ion-color) .toast-wrapper{background:var(--ion-color-base)}.toast-wrapper{border-radius:var(--border-radius);left:var(--start);right:var(--end);width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);background:var(--background);-webkit-box-shadow:var(--box-shadow);box-shadow:var(--box-shadow)}[dir=rtl] .toast-wrapper,:host-context([dir=rtl]) .toast-wrapper{left:unset;right:unset;left:var(--end);right:var(--start)}.toast-container{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;pointer-events:auto;height:inherit;min-height:inherit;max-height:inherit;contain:content}.toast-layout-stacked .toast-container{-ms-flex-wrap:wrap;flex-wrap:wrap}.toast-layout-baseline .toast-content{display:-ms-flexbox;display:flex;-ms-flex:1;flex:1;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center}.toast-icon{margin-left:16px}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.toast-icon{margin-left:unset;-webkit-margin-start:16px;margin-inline-start:16px}}.toast-message{-ms-flex:1;flex:1;white-space:var(--white-space)}.toast-button-group{display:-ms-flexbox;display:flex}.toast-layout-stacked .toast-button-group{-ms-flex-pack:end;justify-content:end;width:100%}.toast-button{border:0;outline:none;color:var(--button-color);z-index:0}.toast-icon,.toast-button-icon{font-size:1.4em}.toast-button-inner{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}@media (any-hover: hover){.toast-button:hover{cursor:pointer}}:host{--background:var(--ion-color-step-800, #333333);--border-radius:4px;--box-shadow:0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);--button-color:var(--ion-color-primary, #3880ff);--color:var(--ion-color-step-50, #f2f2f2);--max-width:700px;--start:8px;--end:8px;font-size:14px}.toast-wrapper{margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;display:block;position:absolute;opacity:0.01;z-index:10}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.toast-wrapper{margin-left:unset;margin-right:unset;-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto}}.toast-content{padding-left:16px;padding-right:16px;padding-top:14px;padding-bottom:14px}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.toast-content{padding-left:unset;padding-right:unset;-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px}}.toast-header{margin-bottom:2px;font-weight:500;line-height:20px}.toast-message{line-height:20px}.toast-layout-baseline .toast-button-group-start{margin-left:8px}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.toast-layout-baseline .toast-button-group-start{margin-left:unset;-webkit-margin-start:8px;margin-inline-start:8px}}.toast-layout-stacked .toast-button-group-start{margin-right:8px;margin-top:8px}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.toast-layout-stacked .toast-button-group-start{margin-right:unset;-webkit-margin-end:8px;margin-inline-end:8px}}.toast-layout-baseline .toast-button-group-end{margin-right:8px}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.toast-layout-baseline .toast-button-group-end{margin-right:unset;-webkit-margin-end:8px;margin-inline-end:8px}}.toast-layout-stacked .toast-button-group-end{margin-right:8px;margin-bottom:8px}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.toast-layout-stacked .toast-button-group-end{margin-right:unset;-webkit-margin-end:8px;margin-inline-end:8px}}.toast-button{padding-left:15px;padding-right:15px;padding-top:10px;padding-bottom:10px;position:relative;background-color:transparent;font-family:var(--ion-font-family);font-size:14px;font-weight:500;letter-spacing:0.84px;text-transform:uppercase;overflow:hidden}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.toast-button{padding-left:unset;padding-right:unset;-webkit-padding-start:15px;padding-inline-start:15px;-webkit-padding-end:15px;padding-inline-end:15px}}.toast-button-cancel{color:var(--ion-color-step-100, #e6e6e6)}.toast-button-icon-only{border-radius:50%;padding-left:9px;padding-right:9px;padding-top:9px;padding-bottom:9px;width:36px;height:36px}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.toast-button-icon-only{padding-left:unset;padding-right:unset;-webkit-padding-start:9px;padding-inline-start:9px;-webkit-padding-end:9px;padding-inline-end:9px}}@media (any-hover: hover){.toast-button:hover{background-color:rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.08)}.toast-button-cancel:hover{background-color:rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.08)}}";

const Toast = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.didPresent = index.createEvent(this, "ionToastDidPresent", 7);
    this.willPresent = index.createEvent(this, "ionToastWillPresent", 7);
    this.willDismiss = index.createEvent(this, "ionToastWillDismiss", 7);
    this.didDismiss = index.createEvent(this, "ionToastDidDismiss", 7);
    this.customHTMLEnabled = ionicGlobal.config.get('innerHTMLTemplatesEnabled', config.ENABLE_HTML_CONTENT_DEFAULT);
    this.presented = false;
    /**
     * How many milliseconds to wait before hiding the toast. By default, it will show
     * until `dismiss()` is called.
     */
    this.duration = ionicGlobal.config.getNumber('toastDuration', 0);
    /**
     * Defines how the message and buttons are laid out in the toast.
     * 'baseline': The message and the buttons will appear on the same line.
     * Message text may wrap within the message container.
     * 'stacked': The buttons containers and message will stack on top
     * of each other. Use this if you have long text in your buttons.
     */
    this.layout = 'baseline';
    /**
     * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
     */
    this.keyboardClose = false;
    /**
     * The position of the toast on the screen.
     */
    this.position = 'bottom';
    /**
     * If `true`, the toast will be translucent.
     * Only applies when the mode is `"ios"` and the device supports
     * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
     */
    this.translucent = false;
    /**
     * If `true`, the toast will animate.
     */
    this.animated = true;
    this.dispatchCancelHandler = (ev) => {
      const role = ev.detail.role;
      if (overlays.isCancel(role)) {
        const cancelButton = this.getButtons().find((b) => b.role === 'cancel');
        this.callButtonHandler(cancelButton);
      }
    };
  }
  connectedCallback() {
    overlays.prepareOverlay(this.el);
  }
  /**
   * Present the toast overlay after it has been created.
   */
  async present() {
    await overlays.present(this, 'toastEnter', iosEnterAnimation, mdEnterAnimation, this.position);
    if (this.duration > 0) {
      this.durationTimeout = setTimeout(() => this.dismiss(undefined, 'timeout'), this.duration);
    }
  }
  /**
   * Dismiss the toast overlay after it has been presented.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the toast.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the toast.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   */
  dismiss(data, role) {
    if (this.durationTimeout) {
      clearTimeout(this.durationTimeout);
    }
    return overlays.dismiss(this, data, role, 'toastLeave', iosLeaveAnimation, mdLeaveAnimation, this.position);
  }
  /**
   * Returns a promise that resolves when the toast did dismiss.
   */
  onDidDismiss() {
    return overlays.eventMethod(this.el, 'ionToastDidDismiss');
  }
  /**
   * Returns a promise that resolves when the toast will dismiss.
   */
  onWillDismiss() {
    return overlays.eventMethod(this.el, 'ionToastWillDismiss');
  }
  getButtons() {
    const buttons = this.buttons
      ? this.buttons.map((b) => {
        return typeof b === 'string' ? { text: b } : b;
      })
      : [];
    return buttons;
  }
  async buttonClick(button) {
    const role = button.role;
    if (overlays.isCancel(role)) {
      return this.dismiss(undefined, role);
    }
    const shouldDismiss = await this.callButtonHandler(button);
    if (shouldDismiss) {
      return this.dismiss(undefined, role);
    }
    return Promise.resolve();
  }
  async callButtonHandler(button) {
    if (button === null || button === void 0 ? void 0 : button.handler) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      try {
        const rtn = await overlays.safeCall(button.handler);
        if (rtn === false) {
          // if the return value of the handler is false then do not dismiss
          return false;
        }
      }
      catch (e) {
        console.error(e);
      }
    }
    return true;
  }
  renderButtons(buttons, side) {
    if (buttons.length === 0) {
      return;
    }
    const mode = ionicGlobal.getIonMode(this);
    const buttonGroupsClasses = {
      'toast-button-group': true,
      [`toast-button-group-${side}`]: true,
    };
    return (index.h("div", { class: buttonGroupsClasses }, buttons.map((b) => (index.h("button", { type: "button", class: buttonClass(b), tabIndex: 0, onClick: () => this.buttonClick(b), part: "button" }, index.h("div", { class: "toast-button-inner" }, b.icon && (index.h("ion-icon", { icon: b.icon, slot: b.text === undefined ? 'icon-only' : undefined, class: "toast-button-icon" })), b.text), mode === 'md' && (index.h("ion-ripple-effect", { type: b.icon !== undefined && b.text === undefined ? 'unbounded' : 'bounded' })))))));
  }
  renderToastMessage() {
    const { customHTMLEnabled, message } = this;
    if (customHTMLEnabled) {
      return index.h("div", { class: "toast-message", part: "message", innerHTML: config.sanitizeDOMString(message) });
    }
    return (index.h("div", { class: "toast-message", part: "message" }, message));
  }
  render() {
    const { layout, el } = this;
    const allButtons = this.getButtons();
    const startButtons = allButtons.filter((b) => b.side === 'start');
    const endButtons = allButtons.filter((b) => b.side !== 'start');
    const mode = ionicGlobal.getIonMode(this);
    const wrapperClass = {
      'toast-wrapper': true,
      [`toast-${this.position}`]: true,
      [`toast-layout-${layout}`]: true,
    };
    const role = allButtons.length > 0 ? 'dialog' : 'status';
    /**
     * Stacked buttons are only meant to be
     *  used with one type of button.
     */
    if (layout === 'stacked' && startButtons.length > 0 && endButtons.length > 0) {
      index$1.printIonWarning('This toast is using start and end buttons with the stacked toast layout. We recommend following the best practice of using either start or end buttons with the stacked toast layout.', el);
    }
    return (index.h(index.Host, Object.assign({ "aria-live": "polite", "aria-atomic": "true", role: role, tabindex: "-1" }, this.htmlAttributes, { style: {
        zIndex: `${60000 + this.overlayIndex}`,
      }, class: theme.createColorClasses(this.color, Object.assign(Object.assign({ [mode]: true }, theme.getClassMap(this.cssClass)), { 'overlay-hidden': true, 'toast-translucent': this.translucent })), onIonToastWillDismiss: this.dispatchCancelHandler }), index.h("div", { class: wrapperClass }, index.h("div", { class: "toast-container", part: "container" }, this.renderButtons(startButtons, 'start'), this.icon !== undefined && (index.h("ion-icon", { class: "toast-icon", part: "icon", icon: this.icon, lazy: false, "aria-hidden": "true" })), index.h("div", { class: "toast-content" }, this.header !== undefined && (index.h("div", { class: "toast-header", part: "header" }, this.header)), this.message !== undefined && this.renderToastMessage()), this.renderButtons(endButtons, 'end')))));
  }
  get el() { return index.getElement(this); }
};
const buttonClass = (button) => {
  return Object.assign({ 'toast-button': true, 'toast-button-icon-only': button.icon !== undefined && button.text === undefined, [`toast-button-${button.role}`]: button.role !== undefined, 'ion-focusable': true, 'ion-activatable': true }, theme.getClassMap(button.cssClass));
};
Toast.style = {
  ios: toastIosCss,
  md: toastMdCss
};

exports.ion_toast = Toast;
