/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { b as getIonMode, c as config } from './ionic-global-c74e4951.js';
import { OVERLAY_BACK_BUTTON_PRIORITY } from './hardware-back-button-490df115.js';
import { c as componentOnReady, f as focusElement, a as addEventListener, b as removeEventListener, g as getElementRoot } from './helpers-3b390e48.js';

let lastId = 0;
const activeAnimations = new WeakMap();
const createController = (tagName) => {
  return {
    create(options) {
      return createOverlay(tagName, options);
    },
    dismiss(data, role, id) {
      return dismissOverlay(document, data, role, tagName, id);
    },
    async getTop() {
      return getOverlay(document, tagName);
    },
  };
};
const alertController = /*@__PURE__*/ createController('ion-alert');
const actionSheetController = /*@__PURE__*/ createController('ion-action-sheet');
const loadingController = /*@__PURE__*/ createController('ion-loading');
const modalController = /*@__PURE__*/ createController('ion-modal');
const pickerController = /*@__PURE__*/ createController('ion-picker');
const popoverController = /*@__PURE__*/ createController('ion-popover');
const toastController = /*@__PURE__*/ createController('ion-toast');
const prepareOverlay = (el) => {
  if (typeof document !== 'undefined') {
    connectListeners(document);
  }
  const overlayIndex = lastId++;
  el.overlayIndex = overlayIndex;
  if (!el.hasAttribute('id')) {
    el.id = `ion-overlay-${overlayIndex}`;
  }
};
const createOverlay = (tagName, opts) => {
  if (typeof window !== 'undefined' && typeof window.customElements !== 'undefined') {
    return window.customElements.whenDefined(tagName).then(() => {
      const element = document.createElement(tagName);
      element.classList.add('overlay-hidden');
      /**
       * Convert the passed in overlay options into props
       * that get passed down into the new overlay.
       */
      Object.assign(element, Object.assign(Object.assign({}, opts), { hasController: true }));
      // append the overlay element to the document body
      getAppRoot(document).appendChild(element);
      return new Promise((resolve) => componentOnReady(element, resolve));
    });
  }
  return Promise.resolve();
};
/**
 * This query string selects elements that
 * are eligible to receive focus. We select
 * interactive elements that meet the following
 * criteria:
 * 1. Element does not have a negative tabindex
 * 2. Element does not have `hidden`
 * 3. Element does not have `disabled` for non-Ionic components.
 * 4. Element does not have `disabled` or `disabled="true"` for Ionic components.
 * Note: We need this distinction because `disabled="false"` is
 * valid usage for the disabled property on ion-button.
 */
const focusableQueryString = '[tabindex]:not([tabindex^="-"]):not([hidden]):not([disabled]), input:not([type=hidden]):not([tabindex^="-"]):not([hidden]):not([disabled]), textarea:not([tabindex^="-"]):not([hidden]):not([disabled]), button:not([tabindex^="-"]):not([hidden]):not([disabled]), select:not([tabindex^="-"]):not([hidden]):not([disabled]), .ion-focusable:not([tabindex^="-"]):not([hidden]):not([disabled]), .ion-focusable[disabled="false"]:not([tabindex^="-"]):not([hidden])';
const focusFirstDescendant = (ref, overlay) => {
  let firstInput = ref.querySelector(focusableQueryString);
  const shadowRoot = firstInput === null || firstInput === void 0 ? void 0 : firstInput.shadowRoot;
  if (shadowRoot) {
    // If there are no inner focusable elements, just focus the host element.
    firstInput = shadowRoot.querySelector(focusableQueryString) || firstInput;
  }
  if (firstInput) {
    focusElement(firstInput);
  }
  else {
    // Focus overlay instead of letting focus escape
    overlay.focus();
  }
};
const isOverlayHidden = (overlay) => overlay.classList.contains('overlay-hidden');
const focusLastDescendant = (ref, overlay) => {
  const inputs = Array.from(ref.querySelectorAll(focusableQueryString));
  let lastInput = inputs.length > 0 ? inputs[inputs.length - 1] : null;
  const shadowRoot = lastInput === null || lastInput === void 0 ? void 0 : lastInput.shadowRoot;
  if (shadowRoot) {
    // If there are no inner focusable elements, just focus the host element.
    lastInput = shadowRoot.querySelector(focusableQueryString) || lastInput;
  }
  if (lastInput) {
    lastInput.focus();
  }
  else {
    // Focus overlay instead of letting focus escape
    overlay.focus();
  }
};
/**
 * Traps keyboard focus inside of overlay components.
 * Based on https://w3c.github.io/aria-practices/examples/dialog-modal/alertdialog.html
 * This includes the following components: Action Sheet, Alert, Loading, Modal,
 * Picker, and Popover.
 * Should NOT include: Toast
 */
const trapKeyboardFocus = (ev, doc) => {
  const lastOverlay = getOverlay(doc, 'ion-alert,ion-action-sheet,ion-loading,ion-modal,ion-picker,ion-popover');
  const target = ev.target;
  /**
   * If no active overlay, ignore this event.
   *
   * If this component uses the shadow dom,
   * this global listener is pointless
   * since it will not catch the focus
   * traps as they are inside the shadow root.
   * We need to add a listener to the shadow root
   * itself to ensure the focus trap works.
   */
  if (!lastOverlay || !target) {
    return;
  }
  /**
   * If the ion-disable-focus-trap class
   * is present on an overlay, then this component
   * instance has opted out of focus trapping.
   * An example of this is when the sheet modal
   * has a backdrop that is disabled. The content
   * behind the sheet should be focusable until
   * the backdrop is enabled.
   */
  if (lastOverlay.classList.contains('ion-disable-focus-trap')) {
    return;
  }
  const trapScopedFocus = () => {
    /**
     * If we are focusing the overlay, clear
     * the last focused element so that hitting
     * tab activates the first focusable element
     * in the overlay wrapper.
     */
    if (lastOverlay === target) {
      lastOverlay.lastFocus = undefined;
      /**
       * Otherwise, we must be focusing an element
       * inside of the overlay. The two possible options
       * here are an input/button/etc or the ion-focus-trap
       * element. The focus trap element is used to prevent
       * the keyboard focus from leaving the overlay when
       * using Tab or screen assistants.
       */
    }
    else {
      /**
       * We do not want to focus the traps, so get the overlay
       * wrapper element as the traps live outside of the wrapper.
       */
      const overlayRoot = getElementRoot(lastOverlay);
      if (!overlayRoot.contains(target)) {
        return;
      }
      const overlayWrapper = overlayRoot.querySelector('.ion-overlay-wrapper');
      if (!overlayWrapper) {
        return;
      }
      /**
       * If the target is inside the wrapper, let the browser
       * focus as normal and keep a log of the last focused element.
       */
      if (overlayWrapper.contains(target)) {
        lastOverlay.lastFocus = target;
      }
      else {
        /**
         * Otherwise, we must have focused one of the focus traps.
         * We need to wrap the focus to either the first element
         * or the last element.
         */
        /**
         * Once we call `focusFirstDescendant` and focus the first
         * descendant, another focus event will fire which will
         * cause `lastOverlay.lastFocus` to be updated before
         * we can run the code after that. We will cache the value
         * here to avoid that.
         */
        const lastFocus = lastOverlay.lastFocus;
        // Focus the first element in the overlay wrapper
        focusFirstDescendant(overlayWrapper, lastOverlay);
        /**
         * If the cached last focused element is the
         * same as the active element, then we need
         * to wrap focus to the last descendant. This happens
         * when the first descendant is focused, and the user
         * presses Shift + Tab. The previous line will focus
         * the same descendant again (the first one), causing
         * last focus to equal the active element.
         */
        if (lastFocus === doc.activeElement) {
          focusLastDescendant(overlayWrapper, lastOverlay);
        }
        lastOverlay.lastFocus = doc.activeElement;
      }
    }
  };
  const trapShadowFocus = () => {
    /**
     * If the target is inside the wrapper, let the browser
     * focus as normal and keep a log of the last focused element.
     */
    if (lastOverlay.contains(target)) {
      lastOverlay.lastFocus = target;
    }
    else {
      /**
       * Otherwise, we are about to have focus
       * go out of the overlay. We need to wrap
       * the focus to either the first element
       * or the last element.
       */
      /**
       * Once we call `focusFirstDescendant` and focus the first
       * descendant, another focus event will fire which will
       * cause `lastOverlay.lastFocus` to be updated before
       * we can run the code after that. We will cache the value
       * here to avoid that.
       */
      const lastFocus = lastOverlay.lastFocus;
      // Focus the first element in the overlay wrapper
      focusFirstDescendant(lastOverlay, lastOverlay);
      /**
       * If the cached last focused element is the
       * same as the active element, then we need
       * to wrap focus to the last descendant. This happens
       * when the first descendant is focused, and the user
       * presses Shift + Tab. The previous line will focus
       * the same descendant again (the first one), causing
       * last focus to equal the active element.
       */
      if (lastFocus === doc.activeElement) {
        focusLastDescendant(lastOverlay, lastOverlay);
      }
      lastOverlay.lastFocus = doc.activeElement;
    }
  };
  if (lastOverlay.shadowRoot) {
    trapShadowFocus();
  }
  else {
    trapScopedFocus();
  }
};
const connectListeners = (doc) => {
  if (lastId === 0) {
    lastId = 1;
    doc.addEventListener('focus', (ev) => {
      trapKeyboardFocus(ev, doc);
    }, true);
    // handle back-button click
    doc.addEventListener('ionBackButton', (ev) => {
      const lastOverlay = getOverlay(doc);
      if (lastOverlay === null || lastOverlay === void 0 ? void 0 : lastOverlay.backdropDismiss) {
        ev.detail.register(OVERLAY_BACK_BUTTON_PRIORITY, () => {
          return lastOverlay.dismiss(undefined, BACKDROP);
        });
      }
    });
    // handle ESC to close overlay
    doc.addEventListener('keyup', (ev) => {
      if (ev.key === 'Escape') {
        const lastOverlay = getOverlay(doc);
        if (lastOverlay === null || lastOverlay === void 0 ? void 0 : lastOverlay.backdropDismiss) {
          lastOverlay.dismiss(undefined, BACKDROP);
        }
      }
    });
  }
};
const dismissOverlay = (doc, data, role, overlayTag, id) => {
  const overlay = getOverlay(doc, overlayTag, id);
  if (!overlay) {
    return Promise.reject('overlay does not exist');
  }
  return overlay.dismiss(data, role);
};
const getOverlays = (doc, selector) => {
  if (selector === undefined) {
    selector = 'ion-alert,ion-action-sheet,ion-loading,ion-modal,ion-picker,ion-popover,ion-toast';
  }
  return Array.from(doc.querySelectorAll(selector)).filter((c) => c.overlayIndex > 0);
};
/**
 * Returns an overlay element
 * @param doc The document to find the element within.
 * @param overlayTag The selector for the overlay, defaults to Ionic overlay components.
 * @param id The unique identifier for the overlay instance.
 * @returns The overlay element or `undefined` if no overlay element is found.
 */
const getOverlay = (doc, overlayTag, id) => {
  const overlays = getOverlays(doc, overlayTag).filter((o) => !isOverlayHidden(o));
  return id === undefined ? overlays[overlays.length - 1] : overlays.find((o) => o.id === id);
};
/**
 * When an overlay is presented, the main
 * focus is the overlay not the page content.
 * We need to remove the page content from the
 * accessibility tree otherwise when
 * users use "read screen from top" gestures with
 * TalkBack and VoiceOver, the screen reader will begin
 * to read the content underneath the overlay.
 *
 * We need a container where all page components
 * exist that is separate from where the overlays
 * are added in the DOM. For most apps, this element
 * is the top most ion-router-outlet. In the event
 * that devs are not using a router,
 * they will need to add the "ion-view-container-root"
 * id to the element that contains all of their views.
 *
 * TODO: If Framework supports having multiple top
 * level router outlets we would need to update this.
 * Example: One outlet for side menu and one outlet
 * for main content.
 */
const setRootAriaHidden = (hidden = false) => {
  const root = getAppRoot(document);
  const viewContainer = root.querySelector('ion-router-outlet, ion-nav, #ion-view-container-root');
  if (!viewContainer) {
    return;
  }
  if (hidden) {
    viewContainer.setAttribute('aria-hidden', 'true');
  }
  else {
    viewContainer.removeAttribute('aria-hidden');
  }
};
const present = async (overlay, name, iosEnterAnimation, mdEnterAnimation, opts) => {
  var _a, _b;
  if (overlay.presented) {
    return;
  }
  setRootAriaHidden(true);
  overlay.presented = true;
  overlay.willPresent.emit();
  (_a = overlay.willPresentShorthand) === null || _a === void 0 ? void 0 : _a.emit();
  const mode = getIonMode(overlay);
  // get the user's animation fn if one was provided
  const animationBuilder = overlay.enterAnimation
    ? overlay.enterAnimation
    : config.get(name, mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);
  const completed = await overlayAnimation(overlay, animationBuilder, overlay.el, opts);
  if (completed) {
    overlay.didPresent.emit();
    (_b = overlay.didPresentShorthand) === null || _b === void 0 ? void 0 : _b.emit();
  }
  /**
   * When an overlay that steals focus
   * is dismissed, focus should be returned
   * to the element that was focused
   * prior to the overlay opening. Toast
   * does not steal focus and is excluded
   * from returning focus as a result.
   */
  if (overlay.el.tagName !== 'ION-TOAST') {
    focusPreviousElementOnDismiss(overlay.el);
  }
  /**
   * If the focused element is already
   * inside the overlay component then
   * focus should not be moved from that
   * to the overlay container.
   */
  if (overlay.keyboardClose && (document.activeElement === null || !overlay.el.contains(document.activeElement))) {
    overlay.el.focus();
  }
};
/**
 * When an overlay component is dismissed,
 * focus should be returned to the element
 * that presented the overlay. Otherwise
 * focus will be set on the body which
 * means that people using screen readers
 * or tabbing will need to re-navigate
 * to where they were before they
 * opened the overlay.
 */
const focusPreviousElementOnDismiss = async (overlayEl) => {
  let previousElement = document.activeElement;
  if (!previousElement) {
    return;
  }
  const shadowRoot = previousElement === null || previousElement === void 0 ? void 0 : previousElement.shadowRoot;
  if (shadowRoot) {
    // If there are no inner focusable elements, just focus the host element.
    previousElement = shadowRoot.querySelector(focusableQueryString) || previousElement;
  }
  await overlayEl.onDidDismiss();
  previousElement.focus();
};
const dismiss = async (overlay, data, role, name, iosLeaveAnimation, mdLeaveAnimation, opts) => {
  var _a, _b;
  if (!overlay.presented) {
    return false;
  }
  setRootAriaHidden(false);
  overlay.presented = false;
  try {
    // Overlay contents should not be clickable during dismiss
    overlay.el.style.setProperty('pointer-events', 'none');
    overlay.willDismiss.emit({ data, role });
    (_a = overlay.willDismissShorthand) === null || _a === void 0 ? void 0 : _a.emit({ data, role });
    const mode = getIonMode(overlay);
    const animationBuilder = overlay.leaveAnimation
      ? overlay.leaveAnimation
      : config.get(name, mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);
    // If dismissed via gesture, no need to play leaving animation again
    if (role !== GESTURE) {
      await overlayAnimation(overlay, animationBuilder, overlay.el, opts);
    }
    overlay.didDismiss.emit({ data, role });
    (_b = overlay.didDismissShorthand) === null || _b === void 0 ? void 0 : _b.emit({ data, role });
    activeAnimations.delete(overlay);
    /**
     * Make overlay hidden again in case it is being reused.
     * We can safely remove pointer-events: none as
     * overlay-hidden will set display: none.
     */
    overlay.el.classList.add('overlay-hidden');
    overlay.el.style.removeProperty('pointer-events');
    /**
     * Clear any focus trapping references
     * when the overlay is dismissed.
     */
    if (overlay.el.lastFocus !== undefined) {
      overlay.el.lastFocus = undefined;
    }
  }
  catch (err) {
    console.error(err);
  }
  overlay.el.remove();
  return true;
};
const getAppRoot = (doc) => {
  return doc.querySelector('ion-app') || doc.body;
};
const overlayAnimation = async (overlay, animationBuilder, baseEl, opts) => {
  // Make overlay visible in case it's hidden
  baseEl.classList.remove('overlay-hidden');
  const aniRoot = overlay.el;
  const animation = animationBuilder(aniRoot, opts);
  if (!overlay.animated || !config.getBoolean('animated', true)) {
    animation.duration(0);
  }
  if (overlay.keyboardClose) {
    animation.beforeAddWrite(() => {
      const activeElement = baseEl.ownerDocument.activeElement;
      if (activeElement === null || activeElement === void 0 ? void 0 : activeElement.matches('input,ion-input, ion-textarea')) {
        activeElement.blur();
      }
    });
  }
  const activeAni = activeAnimations.get(overlay) || [];
  activeAnimations.set(overlay, [...activeAni, animation]);
  await animation.play();
  return true;
};
const eventMethod = (element, eventName) => {
  let resolve;
  const promise = new Promise((r) => (resolve = r));
  onceEvent(element, eventName, (event) => {
    resolve(event.detail);
  });
  return promise;
};
const onceEvent = (element, eventName, callback) => {
  const handler = (ev) => {
    removeEventListener(element, eventName, handler);
    callback(ev);
  };
  addEventListener(element, eventName, handler);
};
const isCancel = (role) => {
  return role === 'cancel' || role === BACKDROP;
};
const defaultGate = (h) => h();
/**
 * Calls a developer provided method while avoiding
 * Angular Zones. Since the handler is provided by
 * the developer, we should throw any errors
 * received so that developer-provided bug
 * tracking software can log it.
 */
const safeCall = (handler, arg) => {
  if (typeof handler === 'function') {
    const jmp = config.get('_zoneGate', defaultGate);
    return jmp(() => {
      try {
        return handler(arg);
      }
      catch (e) {
        throw e;
      }
    });
  }
  return undefined;
};
const BACKDROP = 'backdrop';
const GESTURE = 'gesture';

export { BACKDROP as B, GESTURE as G, alertController as a, actionSheetController as b, popoverController as c, present as d, prepareOverlay as e, dismiss as f, eventMethod as g, activeAnimations as h, isCancel as i, focusFirstDescendant as j, getOverlay as k, loadingController as l, modalController as m, pickerController as p, safeCall as s, toastController as t };
