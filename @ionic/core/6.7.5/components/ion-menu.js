/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, createEvent, Build, h, Host } from '@stencil/core/internal/client';
import { c as config, b as getIonMode } from './ionic-global.js';
import { g as getTimeGivenProgression } from './cubic-bezier.js';
import { G as GESTURE_CONTROLLER } from './gesture-controller.js';
import { l as isEndSide, i as inheritAriaAttributes, m as assert, h as clamp } from './helpers.js';
import { m as menuController } from './index4.js';
import { h as getOverlay } from './overlays.js';
import { d as defineCustomElement$2 } from './backdrop.js';

const menuIosCss = ":host{--width:304px;--min-width:auto;--max-width:auto;--height:100%;--min-height:auto;--max-height:auto;--background:var(--ion-background-color, #fff);left:0;right:0;top:0;bottom:0;display:none;position:absolute;contain:strict}:host(.show-menu){display:block}.menu-inner{left:0;right:auto;top:0;bottom:0;-webkit-transform:translateX(-9999px);transform:translateX(-9999px);display:-ms-flexbox;display:flex;position:absolute;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:justify;justify-content:space-between;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);background:var(--background);contain:strict}[dir=rtl] .menu-inner,:host-context([dir=rtl]) .menu-inner{left:unset;right:unset;left:auto;right:0}:host(.menu-side-start) .menu-inner{--ion-safe-area-right:0px;right:auto;left:0}:host(.menu-side-end) .menu-inner{--ion-safe-area-left:0px;right:0;left:auto;}ion-backdrop{display:none;opacity:0.01;z-index:-1}@media (max-width: 340px){.menu-inner{--width:264px}}:host(.menu-type-reveal){z-index:0}:host(.menu-type-reveal.show-menu) .menu-inner{-webkit-transform:translate3d(0,  0,  0);transform:translate3d(0,  0,  0)}:host(.menu-type-overlay){z-index:1000}:host(.menu-type-overlay) .show-backdrop{display:block;cursor:pointer}:host(.menu-pane-visible){width:var(--width);min-width:var(--min-width);max-width:var(--max-width)}:host(.menu-pane-visible) .menu-inner{left:0;right:0;width:auto;-webkit-transform:none !important;transform:none !important;-webkit-box-shadow:none !important;box-shadow:none !important}:host(.menu-pane-visible) ion-backdrop{display:hidden !important;}:host(.menu-type-push){z-index:1000}:host(.menu-type-push) .show-backdrop{display:block}";

const menuMdCss = ":host{--width:304px;--min-width:auto;--max-width:auto;--height:100%;--min-height:auto;--max-height:auto;--background:var(--ion-background-color, #fff);left:0;right:0;top:0;bottom:0;display:none;position:absolute;contain:strict}:host(.show-menu){display:block}.menu-inner{left:0;right:auto;top:0;bottom:0;-webkit-transform:translateX(-9999px);transform:translateX(-9999px);display:-ms-flexbox;display:flex;position:absolute;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:justify;justify-content:space-between;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);background:var(--background);contain:strict}[dir=rtl] .menu-inner,:host-context([dir=rtl]) .menu-inner{left:unset;right:unset;left:auto;right:0}:host(.menu-side-start) .menu-inner{--ion-safe-area-right:0px;right:auto;left:0}:host(.menu-side-end) .menu-inner{--ion-safe-area-left:0px;right:0;left:auto;}ion-backdrop{display:none;opacity:0.01;z-index:-1}@media (max-width: 340px){.menu-inner{--width:264px}}:host(.menu-type-reveal){z-index:0}:host(.menu-type-reveal.show-menu) .menu-inner{-webkit-transform:translate3d(0,  0,  0);transform:translate3d(0,  0,  0)}:host(.menu-type-overlay){z-index:1000}:host(.menu-type-overlay) .show-backdrop{display:block;cursor:pointer}:host(.menu-pane-visible){width:var(--width);min-width:var(--min-width);max-width:var(--max-width)}:host(.menu-pane-visible) .menu-inner{left:0;right:0;width:auto;-webkit-transform:none !important;transform:none !important;-webkit-box-shadow:none !important;box-shadow:none !important}:host(.menu-pane-visible) ion-backdrop{display:hidden !important;}:host(.menu-type-overlay) .menu-inner{-webkit-box-shadow:4px 0px 16px rgba(0, 0, 0, 0.18);box-shadow:4px 0px 16px rgba(0, 0, 0, 0.18)}";

const iosEasing = 'cubic-bezier(0.32,0.72,0,1)';
const mdEasing = 'cubic-bezier(0.0,0.0,0.2,1)';
const iosEasingReverse = 'cubic-bezier(1, 0, 0.68, 0.28)';
const mdEasingReverse = 'cubic-bezier(0.4, 0, 0.6, 1)';
const focusableQueryString = '[tabindex]:not([tabindex^="-"]), input:not([type=hidden]):not([tabindex^="-"]), textarea:not([tabindex^="-"]), button:not([tabindex^="-"]), select:not([tabindex^="-"]), .ion-focusable:not([tabindex^="-"])';
const Menu = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.ionWillOpen = createEvent(this, "ionWillOpen", 7);
    this.ionWillClose = createEvent(this, "ionWillClose", 7);
    this.ionDidOpen = createEvent(this, "ionDidOpen", 7);
    this.ionDidClose = createEvent(this, "ionDidClose", 7);
    this.ionMenuChange = createEvent(this, "ionMenuChange", 7);
    this.lastOnEnd = 0;
    this.blocker = GESTURE_CONTROLLER.createBlocker({ disableScroll: true });
    this.isAnimating = false;
    this._isOpen = false;
    this.inheritedAttributes = {};
    this.handleFocus = (ev) => {
      /**
       * Overlays have their own focus trapping listener
       * so we do not want the two listeners to conflict
       * with each other. If the top-most overlay that is
       * open does not contain this ion-menu, then ion-menu's
       * focus trapping should not run.
       */
      const lastOverlay = getOverlay(document);
      if (lastOverlay && !lastOverlay.contains(this.el)) {
        return;
      }
      this.trapKeyboardFocus(ev, document);
    };
    this.isPaneVisible = false;
    this.isEndSide = false;
    /**
     * If `true`, the menu is disabled.
     */
    this.disabled = false;
    /**
     * Which side of the view the menu should be placed.
     */
    this.side = 'start';
    /**
     * If `true`, swiping the menu is enabled.
     */
    this.swipeGesture = true;
    /**
     * The edge threshold for dragging the menu open.
     * If a drag/swipe happens over this value, the menu is not triggered.
     */
    this.maxEdgeStart = 50;
  }
  typeChanged(type, oldType) {
    const contentEl = this.contentEl;
    if (contentEl) {
      if (oldType !== undefined) {
        contentEl.classList.remove(`menu-content-${oldType}`);
      }
      contentEl.classList.add(`menu-content-${type}`);
      contentEl.removeAttribute('style');
    }
    if (this.menuInnerEl) {
      // Remove effects of previous animations
      this.menuInnerEl.removeAttribute('style');
    }
    this.animation = undefined;
  }
  disabledChanged() {
    this.updateState();
    this.ionMenuChange.emit({
      disabled: this.disabled,
      open: this._isOpen,
    });
  }
  sideChanged() {
    this.isEndSide = isEndSide(this.side);
  }
  swipeGestureChanged() {
    this.updateState();
  }
  async connectedCallback() {
    // TODO: connectedCallback is fired in CE build
    // before WC is defined. This needs to be fixed in Stencil.
    if (typeof customElements !== 'undefined' && customElements != null) {
      await customElements.whenDefined('ion-menu');
    }
    if (this.type === undefined) {
      this.type = config.get('menuType', 'overlay');
    }
    if (!Build.isBrowser) {
      this.disabled = true;
      return;
    }
    const content = this.contentId !== undefined ? document.getElementById(this.contentId) : null;
    if (content === null) {
      console.error('Menu: must have a "content" element to listen for drag events on.');
      return;
    }
    if (this.el.contains(content)) {
      console.error(`Menu: "contentId" should refer to the main view's ion-content, not the ion-content inside of the ion-menu.`);
    }
    this.contentEl = content;
    // add menu's content classes
    content.classList.add('menu-content');
    this.typeChanged(this.type, undefined);
    this.sideChanged();
    // register this menu with the app's menu controller
    menuController._register(this);
    this.gesture = (await import('./index2.js')).createGesture({
      el: document,
      gestureName: 'menu-swipe',
      gesturePriority: 30,
      threshold: 10,
      blurOnStart: true,
      canStart: (ev) => this.canStart(ev),
      onWillStart: () => this.onWillStart(),
      onStart: () => this.onStart(),
      onMove: (ev) => this.onMove(ev),
      onEnd: (ev) => this.onEnd(ev),
    });
    this.updateState();
  }
  componentWillLoad() {
    this.inheritedAttributes = inheritAriaAttributes(this.el);
  }
  async componentDidLoad() {
    this.ionMenuChange.emit({ disabled: this.disabled, open: this._isOpen });
    this.updateState();
  }
  async disconnectedCallback() {
    /**
     * The menu should be closed when it is
     * unmounted from the DOM.
     * This is an async call, so we need to wait for
     * this to finish otherwise contentEl
     * will not have MENU_CONTENT_OPEN removed.
     */
    await this.close(false);
    this.blocker.destroy();
    menuController._unregister(this);
    if (this.animation) {
      this.animation.destroy();
    }
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
    this.animation = undefined;
    this.contentEl = undefined;
  }
  onSplitPaneChanged(ev) {
    this.isPaneVisible = ev.detail.isPane(this.el);
    this.updateState();
  }
  onBackdropClick(ev) {
    // TODO(FW-2832): type (CustomEvent triggers errors which should be sorted)
    if (this._isOpen && this.lastOnEnd < ev.timeStamp - 100) {
      const shouldClose = ev.composedPath ? !ev.composedPath().includes(this.menuInnerEl) : false;
      if (shouldClose) {
        ev.preventDefault();
        ev.stopPropagation();
        this.close();
      }
    }
  }
  onKeydown(ev) {
    if (ev.key === 'Escape') {
      this.close();
    }
  }
  /**
   * Returns `true` is the menu is open.
   */
  isOpen() {
    return Promise.resolve(this._isOpen);
  }
  /**
   * Returns `true` is the menu is active.
   *
   * A menu is active when it can be opened or closed, meaning it's enabled
   * and it's not part of a `ion-split-pane`.
   */
  isActive() {
    return Promise.resolve(this._isActive());
  }
  /**
   * Opens the menu. If the menu is already open or it can't be opened,
   * it returns `false`.
   */
  open(animated = true) {
    return this.setOpen(true, animated);
  }
  /**
   * Closes the menu. If the menu is already closed or it can't be closed,
   * it returns `false`.
   */
  close(animated = true) {
    return this.setOpen(false, animated);
  }
  /**
   * Toggles the menu. If the menu is already open, it will try to close, otherwise it will try to open it.
   * If the operation can't be completed successfully, it returns `false`.
   */
  toggle(animated = true) {
    return this.setOpen(!this._isOpen, animated);
  }
  /**
   * Opens or closes the button.
   * If the operation can't be completed successfully, it returns `false`.
   */
  setOpen(shouldOpen, animated = true) {
    return menuController._setOpen(this, shouldOpen, animated);
  }
  focusFirstDescendant() {
    const { el } = this;
    const firstInput = el.querySelector(focusableQueryString);
    if (firstInput) {
      firstInput.focus();
    }
    else {
      el.focus();
    }
  }
  focusLastDescendant() {
    const { el } = this;
    const inputs = Array.from(el.querySelectorAll(focusableQueryString));
    const lastInput = inputs.length > 0 ? inputs[inputs.length - 1] : null;
    if (lastInput) {
      lastInput.focus();
    }
    else {
      el.focus();
    }
  }
  trapKeyboardFocus(ev, doc) {
    const target = ev.target;
    if (!target) {
      return;
    }
    /**
     * If the target is inside the menu contents, let the browser
     * focus as normal and keep a log of the last focused element.
     */
    if (this.el.contains(target)) {
      this.lastFocus = target;
    }
    else {
      /**
       * Otherwise, we are about to have focus go out of the menu.
       * Wrap the focus to either the first or last element.
       */
      /**
       * Once we call `focusFirstDescendant`, another focus event
       * will fire, which will cause `lastFocus` to be updated
       * before we can run the code after that. We cache the value
       * here to avoid that.
       */
      this.focusFirstDescendant();
      /**
       * If the cached last focused element is the same as the now-
       * active element, that means the user was on the first element
       * already and pressed Shift + Tab, so we need to wrap to the
       * last descendant.
       */
      if (this.lastFocus === doc.activeElement) {
        this.focusLastDescendant();
      }
    }
  }
  async _setOpen(shouldOpen, animated = true) {
    // If the menu is disabled or it is currently being animated, let's do nothing
    if (!this._isActive() || this.isAnimating || shouldOpen === this._isOpen) {
      return false;
    }
    this.beforeAnimation(shouldOpen);
    await this.loadAnimation();
    await this.startAnimation(shouldOpen, animated);
    this.afterAnimation(shouldOpen);
    return true;
  }
  async loadAnimation() {
    // Menu swipe animation takes the menu's inner width as parameter,
    // If `offsetWidth` changes, we need to create a new animation.
    const width = this.menuInnerEl.offsetWidth;
    if (width === this.width && this.animation !== undefined) {
      return;
    }
    this.width = width;
    // Destroy existing animation
    if (this.animation) {
      this.animation.destroy();
      this.animation = undefined;
    }
    // Create new animation
    this.animation = await menuController._createAnimation(this.type, this);
    if (!config.getBoolean('animated', true)) {
      this.animation.duration(0);
    }
    this.animation.fill('both');
  }
  async startAnimation(shouldOpen, animated) {
    const isReversed = !shouldOpen;
    const mode = getIonMode(this);
    const easing = mode === 'ios' ? iosEasing : mdEasing;
    const easingReverse = mode === 'ios' ? iosEasingReverse : mdEasingReverse;
    const ani = this.animation
      .direction(isReversed ? 'reverse' : 'normal')
      .easing(isReversed ? easingReverse : easing)
      .onFinish(() => {
      if (ani.getDirection() === 'reverse') {
        ani.direction('normal');
      }
    });
    if (animated) {
      await ani.play();
    }
    else {
      ani.play({ sync: true });
    }
  }
  _isActive() {
    return !this.disabled && !this.isPaneVisible;
  }
  canSwipe() {
    return this.swipeGesture && !this.isAnimating && this._isActive();
  }
  canStart(detail) {
    // Do not allow swipe gesture if a modal is open
    const isModalPresented = !!document.querySelector('ion-modal.show-modal');
    if (isModalPresented || !this.canSwipe()) {
      return false;
    }
    if (this._isOpen) {
      return true;
    }
    else if (menuController._getOpenSync()) {
      return false;
    }
    return checkEdgeSide(window, detail.currentX, this.isEndSide, this.maxEdgeStart);
  }
  onWillStart() {
    this.beforeAnimation(!this._isOpen);
    return this.loadAnimation();
  }
  onStart() {
    if (!this.isAnimating || !this.animation) {
      assert(false, 'isAnimating has to be true');
      return;
    }
    // the cloned animation should not use an easing curve during seek
    this.animation.progressStart(true, this._isOpen ? 1 : 0);
  }
  onMove(detail) {
    if (!this.isAnimating || !this.animation) {
      assert(false, 'isAnimating has to be true');
      return;
    }
    const delta = computeDelta(detail.deltaX, this._isOpen, this.isEndSide);
    const stepValue = delta / this.width;
    this.animation.progressStep(this._isOpen ? 1 - stepValue : stepValue);
  }
  onEnd(detail) {
    if (!this.isAnimating || !this.animation) {
      assert(false, 'isAnimating has to be true');
      return;
    }
    const isOpen = this._isOpen;
    const isEndSide = this.isEndSide;
    const delta = computeDelta(detail.deltaX, isOpen, isEndSide);
    const width = this.width;
    const stepValue = delta / width;
    const velocity = detail.velocityX;
    const z = width / 2.0;
    const shouldCompleteRight = velocity >= 0 && (velocity > 0.2 || detail.deltaX > z);
    const shouldCompleteLeft = velocity <= 0 && (velocity < -0.2 || detail.deltaX < -z);
    const shouldComplete = isOpen
      ? isEndSide
        ? shouldCompleteRight
        : shouldCompleteLeft
      : isEndSide
        ? shouldCompleteLeft
        : shouldCompleteRight;
    let shouldOpen = !isOpen && shouldComplete;
    if (isOpen && !shouldComplete) {
      shouldOpen = true;
    }
    this.lastOnEnd = detail.currentTime;
    // Account for rounding errors in JS
    let newStepValue = shouldComplete ? 0.001 : -0.001;
    /**
     * stepValue can sometimes return a negative
     * value, but you can't have a negative time value
     * for the cubic bezier curve (at least with web animations)
     */
    const adjustedStepValue = stepValue < 0 ? 0.01 : stepValue;
    /**
     * Animation will be reversed here, so need to
     * reverse the easing curve as well
     *
     * Additionally, we need to account for the time relative
     * to the new easing curve, as `stepValue` is going to be given
     * in terms of a linear curve.
     */
    newStepValue +=
      getTimeGivenProgression([0, 0], [0.4, 0], [0.6, 1], [1, 1], clamp(0, adjustedStepValue, 0.9999))[0] || 0;
    const playTo = this._isOpen ? !shouldComplete : shouldComplete;
    this.animation
      .easing('cubic-bezier(0.4, 0.0, 0.6, 1)')
      .onFinish(() => this.afterAnimation(shouldOpen), { oneTimeCallback: true })
      .progressEnd(playTo ? 1 : 0, this._isOpen ? 1 - newStepValue : newStepValue, 300);
  }
  beforeAnimation(shouldOpen) {
    assert(!this.isAnimating, '_before() should not be called while animating');
    // this places the menu into the correct location before it animates in
    // this css class doesn't actually kick off any animations
    this.el.classList.add(SHOW_MENU);
    /**
     * We add a tabindex here so that focus trapping
     * still works even if the menu does not have
     * any focusable elements slotted inside. The
     * focus trapping utility will fallback to focusing
     * the menu so focus does not leave when the menu
     * is open.
     */
    this.el.setAttribute('tabindex', '0');
    if (this.backdropEl) {
      this.backdropEl.classList.add(SHOW_BACKDROP);
    }
    // add css class and hide content behind menu from screen readers
    if (this.contentEl) {
      this.contentEl.classList.add(MENU_CONTENT_OPEN);
      /**
       * When the menu is open and overlaying the main
       * content, the main content should not be announced
       * by the screenreader as the menu is the main
       * focus. This is useful with screenreaders that have
       * "read from top" gestures that read the entire
       * page from top to bottom when activated.
       * This should be done before the animation starts
       * so that users cannot accidentally scroll
       * the content while dragging a menu open.
       */
      this.contentEl.setAttribute('aria-hidden', 'true');
    }
    this.blocker.block();
    this.isAnimating = true;
    if (shouldOpen) {
      this.ionWillOpen.emit();
    }
    else {
      this.ionWillClose.emit();
    }
  }
  afterAnimation(isOpen) {
    var _a;
    assert(this.isAnimating, '_before() should be called while animating');
    // keep opening/closing the menu disabled for a touch more yet
    // only add listeners/css if it's enabled and isOpen
    // and only remove listeners/css if it's not open
    // emit opened/closed events
    this._isOpen = isOpen;
    this.isAnimating = false;
    if (!this._isOpen) {
      this.blocker.unblock();
    }
    if (isOpen) {
      // emit open event
      this.ionDidOpen.emit();
      /**
       * Move focus to the menu to prepare focus trapping, as long as
       * it isn't already focused. Use the host element instead of the
       * first descendant to avoid the scroll position jumping around.
       */
      const focusedMenu = (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.closest('ion-menu');
      if (focusedMenu !== this.el) {
        this.el.focus();
      }
      // start focus trapping
      document.addEventListener('focus', this.handleFocus, true);
    }
    else {
      // remove css classes and unhide content from screen readers
      this.el.classList.remove(SHOW_MENU);
      /**
       * Remove tabindex from the menu component
       * so that is cannot be tabbed to.
       */
      this.el.removeAttribute('tabindex');
      if (this.contentEl) {
        this.contentEl.classList.remove(MENU_CONTENT_OPEN);
        /**
         * Remove aria-hidden so screen readers
         * can announce the main content again
         * now that the menu is not the main focus.
         */
        this.contentEl.removeAttribute('aria-hidden');
      }
      if (this.backdropEl) {
        this.backdropEl.classList.remove(SHOW_BACKDROP);
      }
      if (this.animation) {
        this.animation.stop();
      }
      // emit close event
      this.ionDidClose.emit();
      // undo focus trapping so multiple menus don't collide
      document.removeEventListener('focus', this.handleFocus, true);
    }
  }
  updateState() {
    const isActive = this._isActive();
    if (this.gesture) {
      this.gesture.enable(isActive && this.swipeGesture);
    }
    // Close menu immediately
    if (!isActive && this._isOpen) {
      // close if this menu is open, and should not be enabled
      this.forceClosing();
    }
    if (!this.disabled) {
      menuController._setActiveMenu(this);
    }
    assert(!this.isAnimating, 'can not be animating');
  }
  forceClosing() {
    assert(this._isOpen, 'menu cannot be closed');
    this.isAnimating = true;
    const ani = this.animation.direction('reverse');
    ani.play({ sync: true });
    this.afterAnimation(false);
  }
  render() {
    const { isEndSide, type, disabled, isPaneVisible, inheritedAttributes } = this;
    const mode = getIonMode(this);
    return (h(Host, { role: "navigation", "aria-label": inheritedAttributes['aria-label'] || 'menu', class: {
        [mode]: true,
        [`menu-type-${type}`]: true,
        'menu-enabled': !disabled,
        'menu-side-end': isEndSide,
        'menu-side-start': !isEndSide,
        'menu-pane-visible': isPaneVisible,
      } }, h("div", { class: "menu-inner", part: "container", ref: (el) => (this.menuInnerEl = el) }, h("slot", null)), h("ion-backdrop", { ref: (el) => (this.backdropEl = el), class: "menu-backdrop", tappable: false, stopPropagation: false, part: "backdrop" })));
  }
  get el() { return this; }
  static get watchers() { return {
    "type": ["typeChanged"],
    "disabled": ["disabledChanged"],
    "side": ["sideChanged"],
    "swipeGesture": ["swipeGestureChanged"]
  }; }
  static get style() { return {
    ios: menuIosCss,
    md: menuMdCss
  }; }
}, [33, "ion-menu", {
    "contentId": [513, "content-id"],
    "menuId": [513, "menu-id"],
    "type": [1025],
    "disabled": [1028],
    "side": [513],
    "swipeGesture": [4, "swipe-gesture"],
    "maxEdgeStart": [2, "max-edge-start"],
    "isPaneVisible": [32],
    "isEndSide": [32],
    "isOpen": [64],
    "isActive": [64],
    "open": [64],
    "close": [64],
    "toggle": [64],
    "setOpen": [64]
  }, [[16, "ionSplitPaneVisible", "onSplitPaneChanged"], [2, "click", "onBackdropClick"], [0, "keydown", "onKeydown"]]]);
const computeDelta = (deltaX, isOpen, isEndSide) => {
  return Math.max(0, isOpen !== isEndSide ? -deltaX : deltaX);
};
const checkEdgeSide = (win, posX, isEndSide, maxEdgeStart) => {
  if (isEndSide) {
    return posX >= win.innerWidth - maxEdgeStart;
  }
  else {
    return posX <= maxEdgeStart;
  }
};
const SHOW_MENU = 'show-menu';
const SHOW_BACKDROP = 'show-backdrop';
const MENU_CONTENT_OPEN = 'menu-content-open';
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["ion-menu", "ion-backdrop"];
  components.forEach(tagName => { switch (tagName) {
    case "ion-menu":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, Menu);
      }
      break;
    case "ion-backdrop":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const IonMenu = Menu;
const defineCustomElement = defineCustomElement$1;

export { IonMenu, defineCustomElement };
