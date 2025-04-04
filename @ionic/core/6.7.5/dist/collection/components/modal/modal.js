/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h, writeTask } from '@stencil/core';
import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { findIonContent, printIonContentErrorMsg } from '../../utils/content';
import { CoreDelegate, attachComponent, detachComponent } from '../../utils/framework-delegate';
import { raf, inheritAttributes } from '../../utils/helpers';
import { KEYBOARD_DID_OPEN } from '../../utils/keyboard/keyboard';
import { printIonWarning } from '../../utils/logging';
import { Style as StatusBarStyle, StatusBar } from '../../utils/native/status-bar';
import { GESTURE, BACKDROP, activeAnimations, dismiss, eventMethod, prepareOverlay, present, } from '../../utils/overlays';
import { getClassMap } from '../../utils/theme';
import { deepReady } from '../../utils/transition';
import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';
import { createSheetGesture } from './gestures/sheet';
import { createSwipeToCloseGesture } from './gestures/swipe-to-close';
import { setCardStatusBarDark, setCardStatusBarDefault } from './utils';
// TODO(FW-2832): types
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot - Content is placed inside of the `.modal-content` element.
 *
 * @part backdrop - The `ion-backdrop` element.
 * @part content - The wrapper element for the default slot.
 * @part handle - The handle that is displayed at the top of the sheet modal when `handle="true"`.
 */
export class Modal {
  constructor() {
    this.modalIndex = modalIds++;
    this.coreDelegate = CoreDelegate();
    this.isSheetModal = false;
    this.inheritedAttributes = {};
    this.inline = false;
    // Whether or not modal is being dismissed via gesture
    this.gestureAnimationDismissing = false;
    this.presented = false;
    /** @internal */
    this.hasController = false;
    /**
     * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
     */
    this.keyboardClose = true;
    /**
     * A decimal value between 0 and 1 that indicates the
     * point after which the backdrop will begin to fade in
     * when using a sheet modal. Prior to this point, the
     * backdrop will be hidden and the content underneath
     * the sheet can be interacted with. This value is exclusive
     * meaning the backdrop will become active after the value
     * specified.
     */
    this.backdropBreakpoint = 0;
    /**
     * The interaction behavior for the sheet modal when the handle is pressed.
     *
     * Defaults to `"none"`, which  means the modal will not change size or position when the handle is pressed.
     * Set to `"cycle"` to let the modal cycle between available breakpoints when pressed.
     *
     * Handle behavior is unavailable when the `handle` property is set to `false` or
     * when the `breakpoints` property is not set (using a fullscreen or card modal).
     */
    this.handleBehavior = 'none';
    /**
     * If `true`, the modal will be dismissed when the backdrop is clicked.
     */
    this.backdropDismiss = true;
    /**
     * If `true`, a backdrop will be displayed behind the modal.
     * This property controls whether or not the backdrop
     * darkens the screen when the modal is presented.
     * It does not control whether or not the backdrop
     * is active or present in the DOM.
     */
    this.showBackdrop = true;
    /**
     * If `true`, the modal will animate.
     */
    this.animated = true;
    /**
     * If `true`, the modal can be swiped to dismiss. Only applies in iOS mode.
     * @deprecated - To prevent modals from dismissing, use canDismiss instead.
     */
    this.swipeToClose = false;
    /**
     * If `true`, the modal will open. If `false`, the modal will close.
     * Use this if you need finer grained control over presentation, otherwise
     * just use the modalController or the `trigger` property.
     * Note: `isOpen` will not automatically be set back to `false` when
     * the modal dismisses. You will need to do that in your code.
     */
    this.isOpen = false;
    /**
     * If `true`, the component passed into `ion-modal` will
     * automatically be mounted when the modal is created. The
     * component will remain mounted even when the modal is dismissed.
     * However, the component will be destroyed when the modal is
     * destroyed. This property is not reactive and should only be
     * used when initially creating a modal.
     *
     * Note: This feature only applies to inline modals in JavaScript
     * frameworks such as Angular, React, and Vue.
     */
    this.keepContentsMounted = false;
    this.configureTriggerInteraction = () => {
      const { trigger, el, destroyTriggerInteraction } = this;
      if (destroyTriggerInteraction) {
        destroyTriggerInteraction();
      }
      if (trigger === undefined) {
        return;
      }
      const triggerEl = trigger !== undefined ? document.getElementById(trigger) : null;
      if (!triggerEl) {
        printIonWarning(`A trigger element with the ID "${trigger}" was not found in the DOM. The trigger element must be in the DOM when the "trigger" property is set on ion-modal.`, this.el);
        return;
      }
      const configureTriggerInteraction = (trigEl, modalEl) => {
        const openModal = () => {
          modalEl.present();
        };
        trigEl.addEventListener('click', openModal);
        return () => {
          trigEl.removeEventListener('click', openModal);
        };
      };
      this.destroyTriggerInteraction = configureTriggerInteraction(triggerEl, el);
    };
    this.onHandleClick = () => {
      const { sheetTransition, handleBehavior } = this;
      if (handleBehavior !== 'cycle' || sheetTransition !== undefined) {
        /**
         * The sheet modal should not advance to the next breakpoint
         * if the handle behavior is not `cycle` or if the handle
         * is clicked while the sheet is moving to a breakpoint.
         */
        return;
      }
      this.moveToNextBreakpoint();
    };
    this.onBackdropTap = () => {
      const { sheetTransition } = this;
      if (sheetTransition !== undefined) {
        /**
         * When the handle is double clicked at the largest breakpoint,
         * it will start to move to the first breakpoint. While transitioning,
         * the backdrop will often receive the second click. We prevent the
         * backdrop from dismissing the modal while moving between breakpoints.
         */
        return;
      }
      this.dismiss(undefined, BACKDROP);
    };
    this.onLifecycle = (modalEvent) => {
      const el = this.usersElement;
      const name = LIFECYCLE_MAP[modalEvent.type];
      if (el && name) {
        const ev = new CustomEvent(name, {
          bubbles: false,
          cancelable: false,
          detail: modalEvent.detail,
        });
        el.dispatchEvent(ev);
      }
    };
  }
  onIsOpenChange(newValue, oldValue) {
    if (newValue === true && oldValue === false) {
      this.present();
    }
    else if (newValue === false && oldValue === true) {
      this.dismiss();
    }
  }
  onTriggerChange() {
    this.configureTriggerInteraction();
  }
  async swipeToCloseChanged(enable) {
    if (this.gesture) {
      this.gesture.enable(enable);
    }
    else if (enable) {
      this.initSwipeToClose();
    }
  }
  breakpointsChanged(breakpoints) {
    if (breakpoints !== undefined) {
      this.sortedBreakpoints = breakpoints.sort((a, b) => a - b);
    }
  }
  connectedCallback() {
    const { configureTriggerInteraction, el } = this;
    prepareOverlay(el);
    configureTriggerInteraction();
  }
  disconnectedCallback() {
    const { destroyTriggerInteraction } = this;
    if (destroyTriggerInteraction) {
      destroyTriggerInteraction();
    }
  }
  componentWillLoad() {
    const { breakpoints, initialBreakpoint, swipeToClose, el } = this;
    this.inheritedAttributes = inheritAttributes(el, ['aria-label', 'role']);
    /**
     * If user has custom ID set then we should
     * not assign the default incrementing ID.
     */
    this.modalId = this.el.hasAttribute('id') ? this.el.getAttribute('id') : `ion-modal-${this.modalIndex}`;
    const isSheetModal = (this.isSheetModal = breakpoints !== undefined && initialBreakpoint !== undefined);
    if (isSheetModal) {
      this.currentBreakpoint = this.initialBreakpoint;
    }
    if (breakpoints !== undefined && initialBreakpoint !== undefined && !breakpoints.includes(initialBreakpoint)) {
      printIonWarning('Your breakpoints array must include the initialBreakpoint value.');
    }
    if (swipeToClose) {
      printIonWarning('swipeToClose has been deprecated in favor of canDismiss.\n\nIf you want a card modal to be swipeable, set canDismiss to `true`. In the next major release of Ionic, swipeToClose will be removed, and all card modals will be swipeable by default.');
    }
  }
  componentDidLoad() {
    /**
     * If modal was rendered with isOpen="true"
     * then we should open modal immediately.
     */
    if (this.isOpen === true) {
      raf(() => this.present());
    }
    this.breakpointsChanged(this.breakpoints);
  }
  /**
   * Determines whether or not an overlay
   * is being used inline or via a controller/JS
   * and returns the correct delegate.
   * By default, subsequent calls to getDelegate
   * will use a cached version of the delegate.
   * This is useful for calling dismiss after
   * present so that the correct delegate is given.
   */
  getDelegate(force = false) {
    if (this.workingDelegate && !force) {
      return {
        delegate: this.workingDelegate,
        inline: this.inline,
      };
    }
    /**
     * If using overlay inline
     * we potentially need to use the coreDelegate
     * so that this works in vanilla JS apps.
     * If a developer has presented this component
     * via a controller, then we can assume
     * the component is already in the
     * correct place.
     */
    const parentEl = this.el.parentNode;
    const inline = (this.inline = parentEl !== null && !this.hasController);
    const delegate = (this.workingDelegate = inline ? this.delegate || this.coreDelegate : this.delegate);
    return { inline, delegate };
  }
  /**
   * Determines whether or not the
   * modal is allowed to dismiss based
   * on the state of the canDismiss prop.
   */
  async checkCanDismiss(data, role) {
    const { canDismiss } = this;
    /**
     * TODO (FW-937) - Remove the following check in
     * the next major release of Ionic.
     */
    if (canDismiss === undefined) {
      return true;
    }
    if (typeof canDismiss === 'function') {
      return canDismiss(data, role);
    }
    return canDismiss;
  }
  /**
   * Present the modal overlay after it has been created.
   */
  async present() {
    if (this.presented) {
      return;
    }
    /**
     * When using an inline modal
     * and dismissing a modal it is possible to
     * quickly present the modal while it is
     * dismissing. We need to await any current
     * transition to allow the dismiss to finish
     * before presenting again.
     */
    if (this.currentTransition !== undefined) {
      await this.currentTransition;
    }
    /**
     * If the modal is presented multiple times (inline modals), we
     * need to reset the current breakpoint to the initial breakpoint.
     */
    this.currentBreakpoint = this.initialBreakpoint;
    const { inline, delegate } = this.getDelegate(true);
    this.usersElement = await attachComponent(delegate, this.el, this.component, ['ion-page'], this.componentProps, inline);
    await deepReady(this.usersElement);
    writeTask(() => this.el.classList.add('show-modal'));
    this.currentTransition = present(this, 'modalEnter', iosEnterAnimation, mdEnterAnimation, {
      presentingEl: this.presentingElement,
      currentBreakpoint: this.initialBreakpoint,
      backdropBreakpoint: this.backdropBreakpoint,
    });
    /* tslint:disable-next-line */
    if (typeof window !== 'undefined') {
      /**
       * This needs to be setup before any
       * non-transition async work so it can be dereferenced
       * in the dismiss method. The dismiss method
       * only waits for the entering transition
       * to finish. It does not wait for all of the `present`
       * method to resolve.
       */
      this.keyboardOpenCallback = () => {
        if (this.gesture) {
          /**
           * When the native keyboard is opened and the webview
           * is resized, the gesture implementation will become unresponsive
           * and enter a free-scroll mode.
           *
           * When the keyboard is opened, we disable the gesture for
           * a single frame and re-enable once the contents have repositioned
           * from the keyboard placement.
           */
          this.gesture.enable(false);
          raf(() => {
            if (this.gesture) {
              this.gesture.enable(true);
            }
          });
        }
      };
      window.addEventListener(KEYBOARD_DID_OPEN, this.keyboardOpenCallback);
    }
    /**
     * TODO (FW-937) - In the next major release of Ionic, all card modals
     * will be swipeable by default. canDismiss will be used to determine if the
     * modal can be dismissed. This check should change to check the presence of
     * presentingElement instead.
     *
     * If we did not do this check, then not using swipeToClose would mean you could
     * not run canDismiss on swipe as there would be no swipe gesture created.
     */
    const hasCardModal = this.presentingElement !== undefined && (this.swipeToClose || this.canDismiss !== undefined);
    /**
     * We need to change the status bar at the
     * start of the animation so that it completes
     * by the time the card animation is done.
     */
    if (hasCardModal && getIonMode(this) === 'ios') {
      // Cache the original status bar color before the modal is presented
      this.statusBarStyle = await StatusBar.getStyle();
      setCardStatusBarDark();
    }
    await this.currentTransition;
    if (this.isSheetModal) {
      this.initSheetGesture();
    }
    else if (hasCardModal) {
      this.initSwipeToClose();
    }
    this.currentTransition = undefined;
  }
  initSwipeToClose() {
    var _a;
    if (getIonMode(this) !== 'ios') {
      return;
    }
    const { el } = this;
    // All of the elements needed for the swipe gesture
    // should be in the DOM and referenced by now, except
    // for the presenting el
    const animationBuilder = this.leaveAnimation || config.get('modalLeave', iosLeaveAnimation);
    const ani = (this.animation = animationBuilder(el, { presentingEl: this.presentingElement }));
    const contentEl = findIonContent(el);
    if (!contentEl) {
      printIonContentErrorMsg(el);
      return;
    }
    const statusBarStyle = (_a = this.statusBarStyle) !== null && _a !== void 0 ? _a : StatusBarStyle.Default;
    this.gesture = createSwipeToCloseGesture(el, ani, statusBarStyle, () => {
      /**
       * While the gesture animation is finishing
       * it is possible for a user to tap the backdrop.
       * This would result in the dismiss animation
       * being played again. Typically this is avoided
       * by setting `presented = false` on the overlay
       * component; however, we cannot do that here as
       * that would prevent the element from being
       * removed from the DOM.
       */
      this.gestureAnimationDismissing = true;
      this.animation.onFinish(async () => {
        await this.dismiss(undefined, GESTURE);
        this.gestureAnimationDismissing = false;
      });
    });
    this.gesture.enable(true);
  }
  initSheetGesture() {
    const { wrapperEl, initialBreakpoint, backdropBreakpoint } = this;
    if (!wrapperEl || initialBreakpoint === undefined) {
      return;
    }
    const animationBuilder = this.enterAnimation || config.get('modalEnter', iosEnterAnimation);
    const ani = (this.animation = animationBuilder(this.el, {
      presentingEl: this.presentingElement,
      currentBreakpoint: initialBreakpoint,
      backdropBreakpoint,
    }));
    ani.progressStart(true, 1);
    const { gesture, moveSheetToBreakpoint } = createSheetGesture(this.el, this.backdropEl, wrapperEl, initialBreakpoint, backdropBreakpoint, ani, this.sortedBreakpoints, () => { var _a; return (_a = this.currentBreakpoint) !== null && _a !== void 0 ? _a : 0; }, () => this.sheetOnDismiss(), (breakpoint) => {
      if (this.currentBreakpoint !== breakpoint) {
        this.currentBreakpoint = breakpoint;
        this.ionBreakpointDidChange.emit({ breakpoint });
      }
    });
    this.gesture = gesture;
    this.moveSheetToBreakpoint = moveSheetToBreakpoint;
    this.gesture.enable(true);
  }
  sheetOnDismiss() {
    /**
     * While the gesture animation is finishing
     * it is possible for a user to tap the backdrop.
     * This would result in the dismiss animation
     * being played again. Typically this is avoided
     * by setting `presented = false` on the overlay
     * component; however, we cannot do that here as
     * that would prevent the element from being
     * removed from the DOM.
     */
    this.gestureAnimationDismissing = true;
    this.animation.onFinish(async () => {
      this.currentBreakpoint = 0;
      this.ionBreakpointDidChange.emit({ breakpoint: this.currentBreakpoint });
      await this.dismiss(undefined, GESTURE);
      this.gestureAnimationDismissing = false;
    });
  }
  /**
   * Dismiss the modal overlay after it has been presented.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the modal. For example, 'cancel' or 'backdrop'.
   */
  async dismiss(data, role) {
    var _a;
    if (this.gestureAnimationDismissing && role !== GESTURE) {
      return false;
    }
    /**
     * If a canDismiss handler is responsible
     * for calling the dismiss method, we should
     * not run the canDismiss check again.
     */
    if (role !== 'handler' && !(await this.checkCanDismiss(data, role))) {
      return false;
    }
    /**
     * We need to start the status bar change
     * before the animation so that the change
     * finishes when the dismiss animation does.
     * TODO (FW-937)
     */
    const hasCardModal = this.presentingElement !== undefined && (this.swipeToClose || this.canDismiss !== undefined);
    if (hasCardModal && getIonMode(this) === 'ios') {
      setCardStatusBarDefault(this.statusBarStyle);
    }
    /* tslint:disable-next-line */
    if (typeof window !== 'undefined' && this.keyboardOpenCallback) {
      window.removeEventListener(KEYBOARD_DID_OPEN, this.keyboardOpenCallback);
      this.keyboardOpenCallback = undefined;
    }
    /**
     * When using an inline modal
     * and presenting a modal it is possible to
     * quickly dismiss the modal while it is
     * presenting. We need to await any current
     * transition to allow the present to finish
     * before dismissing again.
     */
    if (this.currentTransition !== undefined) {
      await this.currentTransition;
    }
    const enteringAnimation = activeAnimations.get(this) || [];
    this.currentTransition = dismiss(this, data, role, 'modalLeave', iosLeaveAnimation, mdLeaveAnimation, {
      presentingEl: this.presentingElement,
      currentBreakpoint: (_a = this.currentBreakpoint) !== null && _a !== void 0 ? _a : this.initialBreakpoint,
      backdropBreakpoint: this.backdropBreakpoint,
    });
    const dismissed = await this.currentTransition;
    if (dismissed) {
      const { delegate } = this.getDelegate();
      await detachComponent(delegate, this.usersElement);
      writeTask(() => this.el.classList.remove('show-modal'));
      if (this.animation) {
        this.animation.destroy();
      }
      if (this.gesture) {
        this.gesture.destroy();
      }
      enteringAnimation.forEach((ani) => ani.destroy());
    }
    this.currentBreakpoint = undefined;
    this.currentTransition = undefined;
    this.animation = undefined;
    return dismissed;
  }
  /**
   * Returns a promise that resolves when the modal did dismiss.
   */
  onDidDismiss() {
    return eventMethod(this.el, 'ionModalDidDismiss');
  }
  /**
   * Returns a promise that resolves when the modal will dismiss.
   */
  onWillDismiss() {
    return eventMethod(this.el, 'ionModalWillDismiss');
  }
  /**
   * Move a sheet style modal to a specific breakpoint. The breakpoint value must
   * be a value defined in your `breakpoints` array.
   */
  async setCurrentBreakpoint(breakpoint) {
    if (!this.isSheetModal) {
      printIonWarning('setCurrentBreakpoint is only supported on sheet modals.');
      return;
    }
    if (!this.breakpoints.includes(breakpoint)) {
      printIonWarning(`Attempted to set invalid breakpoint value ${breakpoint}. Please double check that the breakpoint value is part of your defined breakpoints.`);
      return;
    }
    const { currentBreakpoint, moveSheetToBreakpoint, canDismiss, breakpoints } = this;
    if (currentBreakpoint === breakpoint) {
      return;
    }
    if (moveSheetToBreakpoint) {
      this.sheetTransition = moveSheetToBreakpoint({
        breakpoint,
        breakpointOffset: 1 - currentBreakpoint,
        canDismiss: canDismiss !== undefined && canDismiss !== true && breakpoints[0] === 0,
      });
      await this.sheetTransition;
      this.sheetTransition = undefined;
    }
  }
  /**
   * Returns the current breakpoint of a sheet style modal
   */
  async getCurrentBreakpoint() {
    return this.currentBreakpoint;
  }
  async moveToNextBreakpoint() {
    const { breakpoints, currentBreakpoint } = this;
    if (!breakpoints || currentBreakpoint == null) {
      /**
       * If the modal does not have breakpoints and/or the current
       * breakpoint is not set, we can't move to the next breakpoint.
       */
      return false;
    }
    const allowedBreakpoints = breakpoints.filter((b) => b !== 0);
    const currentBreakpointIndex = allowedBreakpoints.indexOf(currentBreakpoint);
    const nextBreakpointIndex = (currentBreakpointIndex + 1) % allowedBreakpoints.length;
    const nextBreakpoint = allowedBreakpoints[nextBreakpointIndex];
    /**
     * Sets the current breakpoint to the next available breakpoint.
     * If the current breakpoint is the last breakpoint, we set the current
     * breakpoint to the first non-zero breakpoint to avoid dismissing the sheet.
     */
    await this.setCurrentBreakpoint(nextBreakpoint);
    return true;
  }
  render() {
    const { handle, isSheetModal, presentingElement, htmlAttributes, handleBehavior, inheritedAttributes } = this;
    const showHandle = handle !== false && isSheetModal;
    const mode = getIonMode(this);
    const { modalId } = this;
    const isCardModal = presentingElement !== undefined && mode === 'ios';
    const isHandleCycle = handleBehavior === 'cycle';
    return (h(Host, Object.assign({ "no-router": true, tabindex: "-1" }, htmlAttributes, { style: {
        zIndex: `${20000 + this.overlayIndex}`,
      }, class: Object.assign({ [mode]: true, ['modal-default']: !isCardModal && !isSheetModal, [`modal-card`]: isCardModal, [`modal-sheet`]: isSheetModal, 'overlay-hidden': true }, getClassMap(this.cssClass)), id: modalId, onIonBackdropTap: this.onBackdropTap, onIonModalDidPresent: this.onLifecycle, onIonModalWillPresent: this.onLifecycle, onIonModalWillDismiss: this.onLifecycle, onIonModalDidDismiss: this.onLifecycle }), h("ion-backdrop", { ref: (el) => (this.backdropEl = el), visible: this.showBackdrop, tappable: this.backdropDismiss, part: "backdrop" }), mode === 'ios' && h("div", { class: "modal-shadow" }), h("div", Object.assign({
      /*
        role and aria-modal must be used on the
        same element. They must also be set inside the
        shadow DOM otherwise ion-button will not be highlighted
        when using VoiceOver: https://bugs.webkit.org/show_bug.cgi?id=247134
      */
      role: "dialog"
    }, inheritedAttributes, { "aria-modal": "true", class: "modal-wrapper ion-overlay-wrapper", part: "content", ref: (el) => (this.wrapperEl = el) }), showHandle && (h("button", { class: "modal-handle",
      // Prevents the handle from receiving keyboard focus when it does not cycle
      tabIndex: !isHandleCycle ? -1 : 0, "aria-label": "Activate to adjust the size of the dialog overlaying the screen", onClick: isHandleCycle ? this.onHandleClick : undefined, part: "handle" })), h("slot", null))));
  }
  static get is() { return "ion-modal"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "ios": ["modal.ios.scss"],
      "md": ["modal.md.scss"]
    };
  }
  static get styleUrls() {
    return {
      "ios": ["modal.ios.css"],
      "md": ["modal.md.css"]
    };
  }
  static get properties() {
    return {
      "hasController": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [{
              "name": "internal",
              "text": undefined
            }],
          "text": ""
        },
        "attribute": "has-controller",
        "reflect": false,
        "defaultValue": "false"
      },
      "overlayIndex": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [{
              "name": "internal",
              "text": undefined
            }],
          "text": ""
        },
        "attribute": "overlay-index",
        "reflect": false
      },
      "delegate": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "FrameworkDelegate",
          "resolved": "FrameworkDelegate | undefined",
          "references": {
            "FrameworkDelegate": {
              "location": "import",
              "path": "../../interface"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [{
              "name": "internal",
              "text": undefined
            }],
          "text": ""
        }
      },
      "keyboardClose": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "If `true`, the keyboard will be automatically dismissed when the overlay is presented."
        },
        "attribute": "keyboard-close",
        "reflect": false,
        "defaultValue": "true"
      },
      "enterAnimation": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "AnimationBuilder",
          "resolved": "((baseEl: any, opts?: any) => Animation) | undefined",
          "references": {
            "AnimationBuilder": {
              "location": "import",
              "path": "../../interface"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Animation to use when the modal is presented."
        }
      },
      "leaveAnimation": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "AnimationBuilder",
          "resolved": "((baseEl: any, opts?: any) => Animation) | undefined",
          "references": {
            "AnimationBuilder": {
              "location": "import",
              "path": "../../interface"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Animation to use when the modal is dismissed."
        }
      },
      "breakpoints": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "number[]",
          "resolved": "number[] | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "The breakpoints to use when creating a sheet modal. Each value in the\narray must be a decimal between 0 and 1 where 0 indicates the modal is fully\nclosed and 1 indicates the modal is fully open. Values are relative\nto the height of the modal, not the height of the screen. One of the values in this\narray must be the value of the `initialBreakpoint` property.\nFor example: [0, .25, .5, 1]"
        }
      },
      "initialBreakpoint": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "A decimal value between 0 and 1 that indicates the\ninitial point the modal will open at when creating a\nsheet modal. This value must also be listed in the\n`breakpoints` array."
        },
        "attribute": "initial-breakpoint",
        "reflect": false
      },
      "backdropBreakpoint": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "A decimal value between 0 and 1 that indicates the\npoint after which the backdrop will begin to fade in\nwhen using a sheet modal. Prior to this point, the\nbackdrop will be hidden and the content underneath\nthe sheet can be interacted with. This value is exclusive\nmeaning the backdrop will become active after the value\nspecified."
        },
        "attribute": "backdrop-breakpoint",
        "reflect": false,
        "defaultValue": "0"
      },
      "handle": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "The horizontal line that displays at the top of a sheet modal. It is `true` by default when\nsetting the `breakpoints` and `initialBreakpoint` properties."
        },
        "attribute": "handle",
        "reflect": false
      },
      "handleBehavior": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "ModalHandleBehavior",
          "resolved": "\"cycle\" | \"none\" | undefined",
          "references": {
            "ModalHandleBehavior": {
              "location": "import",
              "path": "../../interface"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "The interaction behavior for the sheet modal when the handle is pressed.\n\nDefaults to `\"none\"`, which  means the modal will not change size or position when the handle is pressed.\nSet to `\"cycle\"` to let the modal cycle between available breakpoints when pressed.\n\nHandle behavior is unavailable when the `handle` property is set to `false` or\nwhen the `breakpoints` property is not set (using a fullscreen or card modal)."
        },
        "attribute": "handle-behavior",
        "reflect": false,
        "defaultValue": "'none'"
      },
      "component": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "ComponentRef",
          "resolved": "Function | HTMLElement | null | string | undefined",
          "references": {
            "ComponentRef": {
              "location": "import",
              "path": "../../interface"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [{
              "name": "internal",
              "text": undefined
            }],
          "text": "The component to display inside of the modal."
        },
        "attribute": "component",
        "reflect": false
      },
      "componentProps": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "ComponentProps",
          "resolved": "undefined | { [key: string]: any; }",
          "references": {
            "ComponentProps": {
              "location": "import",
              "path": "../../interface"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [{
              "name": "internal",
              "text": undefined
            }],
          "text": "The data to pass to the modal component."
        }
      },
      "cssClass": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string | string[]",
          "resolved": "string | string[] | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [{
              "name": "internal",
              "text": undefined
            }],
          "text": "Additional classes to apply for custom CSS. If multiple classes are\nprovided they should be separated by spaces."
        },
        "attribute": "css-class",
        "reflect": false
      },
      "backdropDismiss": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "If `true`, the modal will be dismissed when the backdrop is clicked."
        },
        "attribute": "backdrop-dismiss",
        "reflect": false,
        "defaultValue": "true"
      },
      "showBackdrop": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "If `true`, a backdrop will be displayed behind the modal.\nThis property controls whether or not the backdrop\ndarkens the screen when the modal is presented.\nIt does not control whether or not the backdrop\nis active or present in the DOM."
        },
        "attribute": "show-backdrop",
        "reflect": false,
        "defaultValue": "true"
      },
      "animated": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "If `true`, the modal will animate."
        },
        "attribute": "animated",
        "reflect": false,
        "defaultValue": "true"
      },
      "swipeToClose": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [{
              "name": "deprecated",
              "text": "- To prevent modals from dismissing, use canDismiss instead."
            }],
          "text": "If `true`, the modal can be swiped to dismiss. Only applies in iOS mode."
        },
        "attribute": "swipe-to-close",
        "reflect": false,
        "defaultValue": "false"
      },
      "presentingElement": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "HTMLElement",
          "resolved": "HTMLElement | undefined",
          "references": {
            "HTMLElement": {
              "location": "global"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "The element that presented the modal. This is used for card presentation effects\nand for stacking multiple modals on top of each other. Only applies in iOS mode."
        }
      },
      "htmlAttributes": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "ModalAttributes",
          "resolved": "undefined | { [key: string]: any; }",
          "references": {
            "ModalAttributes": {
              "location": "import",
              "path": "../../interface"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Additional attributes to pass to the modal."
        }
      },
      "isOpen": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "If `true`, the modal will open. If `false`, the modal will close.\nUse this if you need finer grained control over presentation, otherwise\njust use the modalController or the `trigger` property.\nNote: `isOpen` will not automatically be set back to `false` when\nthe modal dismisses. You will need to do that in your code."
        },
        "attribute": "is-open",
        "reflect": false,
        "defaultValue": "false"
      },
      "trigger": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string | undefined",
          "resolved": "string | undefined",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "An ID corresponding to the trigger element that\ncauses the modal to open when clicked."
        },
        "attribute": "trigger",
        "reflect": false
      },
      "keepContentsMounted": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "If `true`, the component passed into `ion-modal` will\nautomatically be mounted when the modal is created. The\ncomponent will remain mounted even when the modal is dismissed.\nHowever, the component will be destroyed when the modal is\ndestroyed. This property is not reactive and should only be\nused when initially creating a modal.\n\nNote: This feature only applies to inline modals in JavaScript\nframeworks such as Angular, React, and Vue."
        },
        "attribute": "keep-contents-mounted",
        "reflect": false,
        "defaultValue": "false"
      },
      "canDismiss": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "undefined | boolean | ((data?: any, role?: string) => Promise<boolean>)",
          "resolved": "((data?: any, role?: string | undefined) => Promise<boolean>) | boolean | undefined",
          "references": {
            "Promise": {
              "location": "global"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Determines whether or not a modal can dismiss\nwhen calling the `dismiss` method.\n\nIf the value is `true` or the value's function returns `true`, the modal will close when trying to dismiss.\nIf the value is `false` or the value's function returns `false`, the modal will not close when trying to dismiss."
        },
        "attribute": "can-dismiss",
        "reflect": false
      }
    };
  }
  static get states() {
    return {
      "presented": {}
    };
  }
  static get events() {
    return [{
        "method": "didPresent",
        "name": "ionModalDidPresent",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted after the modal has presented."
        },
        "complexType": {
          "original": "void",
          "resolved": "void",
          "references": {}
        }
      }, {
        "method": "willPresent",
        "name": "ionModalWillPresent",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted before the modal has presented."
        },
        "complexType": {
          "original": "void",
          "resolved": "void",
          "references": {}
        }
      }, {
        "method": "willDismiss",
        "name": "ionModalWillDismiss",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted before the modal has dismissed."
        },
        "complexType": {
          "original": "OverlayEventDetail",
          "resolved": "OverlayEventDetail<any>",
          "references": {
            "OverlayEventDetail": {
              "location": "import",
              "path": "../../interface"
            }
          }
        }
      }, {
        "method": "didDismiss",
        "name": "ionModalDidDismiss",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted after the modal has dismissed."
        },
        "complexType": {
          "original": "OverlayEventDetail",
          "resolved": "OverlayEventDetail<any>",
          "references": {
            "OverlayEventDetail": {
              "location": "import",
              "path": "../../interface"
            }
          }
        }
      }, {
        "method": "ionBreakpointDidChange",
        "name": "ionBreakpointDidChange",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted after the modal breakpoint has changed."
        },
        "complexType": {
          "original": "ModalBreakpointChangeEventDetail",
          "resolved": "ModalBreakpointChangeEventDetail",
          "references": {
            "ModalBreakpointChangeEventDetail": {
              "location": "import",
              "path": "../../interface"
            }
          }
        }
      }, {
        "method": "didPresentShorthand",
        "name": "didPresent",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted after the modal has presented.\nShorthand for ionModalDidPresent."
        },
        "complexType": {
          "original": "void",
          "resolved": "void",
          "references": {}
        }
      }, {
        "method": "willPresentShorthand",
        "name": "willPresent",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted before the modal has presented.\nShorthand for ionModalWillPresent."
        },
        "complexType": {
          "original": "void",
          "resolved": "void",
          "references": {}
        }
      }, {
        "method": "willDismissShorthand",
        "name": "willDismiss",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted before the modal has dismissed.\nShorthand for ionModalWillDismiss."
        },
        "complexType": {
          "original": "OverlayEventDetail",
          "resolved": "OverlayEventDetail<any>",
          "references": {
            "OverlayEventDetail": {
              "location": "import",
              "path": "../../interface"
            }
          }
        }
      }, {
        "method": "didDismissShorthand",
        "name": "didDismiss",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted after the modal has dismissed.\nShorthand for ionModalDidDismiss."
        },
        "complexType": {
          "original": "OverlayEventDetail",
          "resolved": "OverlayEventDetail<any>",
          "references": {
            "OverlayEventDetail": {
              "location": "import",
              "path": "../../interface"
            }
          }
        }
      }];
  }
  static get methods() {
    return {
      "present": {
        "complexType": {
          "signature": "() => Promise<void>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            },
            "ModalPresentOptions": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Present the modal overlay after it has been created.",
          "tags": []
        }
      },
      "dismiss": {
        "complexType": {
          "signature": "(data?: any, role?: string) => Promise<boolean>",
          "parameters": [{
              "tags": [{
                  "name": "param",
                  "text": "data Any data to emit in the dismiss events."
                }],
              "text": "Any data to emit in the dismiss events."
            }, {
              "tags": [{
                  "name": "param",
                  "text": "role The role of the element that is dismissing the modal. For example, 'cancel' or 'backdrop'."
                }],
              "text": "The role of the element that is dismissing the modal. For example, 'cancel' or 'backdrop'."
            }],
          "references": {
            "Promise": {
              "location": "global"
            },
            "ModalDismissOptions": {
              "location": "global"
            }
          },
          "return": "Promise<boolean>"
        },
        "docs": {
          "text": "Dismiss the modal overlay after it has been presented.",
          "tags": [{
              "name": "param",
              "text": "data Any data to emit in the dismiss events."
            }, {
              "name": "param",
              "text": "role The role of the element that is dismissing the modal. For example, 'cancel' or 'backdrop'."
            }]
        }
      },
      "onDidDismiss": {
        "complexType": {
          "signature": "<T = any>() => Promise<OverlayEventDetail<T>>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            },
            "OverlayEventDetail": {
              "location": "import",
              "path": "../../interface"
            },
            "T": {
              "location": "global"
            }
          },
          "return": "Promise<OverlayEventDetail<T>>"
        },
        "docs": {
          "text": "Returns a promise that resolves when the modal did dismiss.",
          "tags": []
        }
      },
      "onWillDismiss": {
        "complexType": {
          "signature": "<T = any>() => Promise<OverlayEventDetail<T>>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            },
            "OverlayEventDetail": {
              "location": "import",
              "path": "../../interface"
            },
            "T": {
              "location": "global"
            }
          },
          "return": "Promise<OverlayEventDetail<T>>"
        },
        "docs": {
          "text": "Returns a promise that resolves when the modal will dismiss.",
          "tags": []
        }
      },
      "setCurrentBreakpoint": {
        "complexType": {
          "signature": "(breakpoint: number) => Promise<void>",
          "parameters": [{
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Move a sheet style modal to a specific breakpoint. The breakpoint value must\nbe a value defined in your `breakpoints` array.",
          "tags": []
        }
      },
      "getCurrentBreakpoint": {
        "complexType": {
          "signature": "() => Promise<number | undefined>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<number | undefined>"
        },
        "docs": {
          "text": "Returns the current breakpoint of a sheet style modal",
          "tags": []
        }
      }
    };
  }
  static get elementRef() { return "el"; }
  static get watchers() {
    return [{
        "propName": "isOpen",
        "methodName": "onIsOpenChange"
      }, {
        "propName": "trigger",
        "methodName": "onTriggerChange"
      }, {
        "propName": "swipeToClose",
        "methodName": "swipeToCloseChanged"
      }];
  }
}
const LIFECYCLE_MAP = {
  ionModalDidPresent: 'ionViewDidEnter',
  ionModalWillPresent: 'ionViewWillEnter',
  ionModalWillDismiss: 'ionViewWillLeave',
  ionModalDidDismiss: 'ionViewDidLeave',
};
let modalIds = 0;
