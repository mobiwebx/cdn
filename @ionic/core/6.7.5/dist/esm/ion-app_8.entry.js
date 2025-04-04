/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { r as registerInstance, h, H as Host, i as getElement, e as createEvent, f as readTask, j as forceUpdate, c as writeTask } from './index-8e692445.js';
import { b as getIonMode, c as config, a as isPlatform } from './ionic-global-c74e4951.js';
import { c as componentOnReady, l as clamp, i as inheritAriaAttributes, s as shallowEqualStringMap } from './helpers-3b390e48.js';
import { i as isRTL } from './dir-e8b767a8.js';
import { c as createColorClasses, h as hostContext } from './theme-7670341c.js';
import { a as findIonContent, p as printIonContentErrorMsg, g as getScrollElement } from './index-e6d1a8be.js';
import { c as createKeyboardController } from './keyboard-controller-73af62b2.js';
import { g as getTimeGivenProgression } from './cubic-bezier-e78d1307.js';
import { a as attachComponent, d as detachComponent } from './framework-delegate-c3305a28.js';
import { t as transition } from './index-27c7e5c4.js';
import './index-c4b11676.js';
import './index-33ffec25.js';

const appCss = "html.plt-mobile ion-app{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}html.plt-mobile ion-app [contenteditable]{-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text}ion-app.force-statusbar-padding{--ion-safe-area-top:20px}";

const App = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  componentDidLoad() {
    {
      rIC(async () => {
        const isHybrid = isPlatform(window, 'hybrid');
        if (!config.getBoolean('_testing')) {
          import('./index-2061d5f6.js').then((module) => module.startTapClick(config));
        }
        if (config.getBoolean('statusTap', isHybrid)) {
          import('./status-tap-4d4674a1.js').then((module) => module.startStatusTap());
        }
        if (config.getBoolean('inputShims', needInputShims())) {
          /**
           * needInputShims() ensures that only iOS and Android
           * platforms proceed into this block.
           */
          const platform = isPlatform(window, 'ios') ? 'ios' : 'android';
          import('./input-shims-8459e7d9.js').then((module) => module.startInputShims(config, platform));
        }
        const hardwareBackButtonModule = await import('./hardware-back-button-490df115.js');
        if (config.getBoolean('hardwareBackButton', isHybrid)) {
          hardwareBackButtonModule.startHardwareBackButton();
        }
        else {
          hardwareBackButtonModule.blockHardwareBackButton();
        }
        if (typeof window !== 'undefined') {
          import('./keyboard-282b81b8.js').then((module) => module.startKeyboardAssist(window));
        }
        import('./focus-visible-bd02518b.js').then((module) => (this.focusVisible = module.startFocusVisible()));
      });
    }
  }
  /**
   * @internal
   * Used to set focus on an element that uses `ion-focusable`.
   * Do not use this if focusing the element as a result of a keyboard
   * event as the focus utility should handle this for us. This method
   * should be used when we want to programmatically focus an element as
   * a result of another user action. (Ex: We focus the first element
   * inside of a popover when the user presents it, but the popover is not always
   * presented as a result of keyboard action.)
   */
  async setFocus(elements) {
    if (this.focusVisible) {
      this.focusVisible.setFocus(elements);
    }
  }
  render() {
    const mode = getIonMode(this);
    return (h(Host, { class: {
        [mode]: true,
        'ion-page': true,
        'force-statusbar-padding': config.getBoolean('_forceStatusbarPadding'),
      } }));
  }
  get el() { return getElement(this); }
};
const needInputShims = () => {
  /**
   * iOS always needs input shims
   */
  const needsShimsIOS = isPlatform(window, 'ios') && isPlatform(window, 'mobile');
  if (needsShimsIOS) {
    return true;
  }
  /**
   * Android only needs input shims when running
   * in the browser and only if the browser is using the
   * new Chrome 108+ resize behavior: https://developer.chrome.com/blog/viewport-resize-behavior/
   */
  const isAndroidMobileWeb = isPlatform(window, 'android') && isPlatform(window, 'mobileweb');
  if (isAndroidMobileWeb) {
    return true;
  }
  return false;
};
const rIC = (callback) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback);
  }
  else {
    setTimeout(callback, 32);
  }
};
App.style = appCss;

const buttonsIosCss = ".sc-ion-buttons-ios-h{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-webkit-transform:translateZ(0);transform:translateZ(0);z-index:99}.sc-ion-buttons-ios-s ion-button{--padding-top:0;--padding-bottom:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}.sc-ion-buttons-ios-s ion-button{--padding-start:5px;--padding-end:5px;margin-left:2px;margin-right:2px;height:32px}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.sc-ion-buttons-ios-s ion-button{margin-left:unset;margin-right:unset;-webkit-margin-start:2px;margin-inline-start:2px;-webkit-margin-end:2px;margin-inline-end:2px}}.sc-ion-buttons-ios-s ion-button:not(.button-round){--border-radius:4px}.sc-ion-buttons-ios-h.ion-color.sc-ion-buttons-ios-s .button,.ion-color .sc-ion-buttons-ios-h.sc-ion-buttons-ios-s .button{--color:initial;--border-color:initial;--background-focused:var(--ion-color-contrast)}.sc-ion-buttons-ios-h.ion-color.sc-ion-buttons-ios-s .button-solid,.ion-color .sc-ion-buttons-ios-h.sc-ion-buttons-ios-s .button-solid{--background:var(--ion-color-contrast);--background-focused:#000;--background-focused-opacity:.12;--background-activated:#000;--background-activated-opacity:.12;--background-hover:var(--ion-color-base);--background-hover-opacity:0.45;--color:var(--ion-color-base);--color-focused:var(--ion-color-base)}.sc-ion-buttons-ios-h.ion-color.sc-ion-buttons-ios-s .button-clear,.ion-color .sc-ion-buttons-ios-h.sc-ion-buttons-ios-s .button-clear{--color-activated:var(--ion-color-contrast);--color-focused:var(--ion-color-contrast)}.sc-ion-buttons-ios-h.ion-color.sc-ion-buttons-ios-s .button-outline,.ion-color .sc-ion-buttons-ios-h.sc-ion-buttons-ios-s .button-outline{--color-activated:var(--ion-color-base);--color-focused:var(--ion-color-contrast);--background-activated:var(--ion-color-contrast)}.sc-ion-buttons-ios-s .button-clear,.sc-ion-buttons-ios-s .button-outline{--background-activated:transparent;--background-focused:currentColor;--background-hover:transparent}.sc-ion-buttons-ios-s .button-solid:not(.ion-color){--background-focused:#000;--background-focused-opacity:.12;--background-activated:#000;--background-activated-opacity:.12}.sc-ion-buttons-ios-s ion-icon[slot=start]{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;margin-right:0.3em;font-size:24px;line-height:0.67}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.sc-ion-buttons-ios-s ion-icon[slot=start]{margin-right:unset;-webkit-margin-end:0.3em;margin-inline-end:0.3em}}.sc-ion-buttons-ios-s ion-icon[slot=end]{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;margin-left:0.4em;font-size:24px;line-height:0.67}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.sc-ion-buttons-ios-s ion-icon[slot=end]{margin-left:unset;-webkit-margin-start:0.4em;margin-inline-start:0.4em}}.sc-ion-buttons-ios-s ion-icon[slot=icon-only]{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;font-size:28px;line-height:0.67}";

const buttonsMdCss = ".sc-ion-buttons-md-h{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-webkit-transform:translateZ(0);transform:translateZ(0);z-index:99}.sc-ion-buttons-md-s ion-button{--padding-top:0;--padding-bottom:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}.sc-ion-buttons-md-s ion-button{--padding-top:0;--padding-bottom:0;--padding-start:8px;--padding-end:8px;--box-shadow:none;margin-left:2px;margin-right:2px;height:32px}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.sc-ion-buttons-md-s ion-button{margin-left:unset;margin-right:unset;-webkit-margin-start:2px;margin-inline-start:2px;-webkit-margin-end:2px;margin-inline-end:2px}}.sc-ion-buttons-md-s ion-button:not(.button-round){--border-radius:2px}.sc-ion-buttons-md-h.ion-color.sc-ion-buttons-md-s .button,.ion-color .sc-ion-buttons-md-h.sc-ion-buttons-md-s .button{--color:initial;--color-focused:var(--ion-color-contrast);--color-hover:var(--ion-color-contrast);--background-activated:transparent;--background-focused:var(--ion-color-contrast);--background-hover:var(--ion-color-contrast)}.sc-ion-buttons-md-h.ion-color.sc-ion-buttons-md-s .button-solid,.ion-color .sc-ion-buttons-md-h.sc-ion-buttons-md-s .button-solid{--background:var(--ion-color-contrast);--background-activated:transparent;--background-focused:var(--ion-color-shade);--background-hover:var(--ion-color-base);--color:var(--ion-color-base);--color-focused:var(--ion-color-base);--color-hover:var(--ion-color-base)}.sc-ion-buttons-md-h.ion-color.sc-ion-buttons-md-s .button-outline,.ion-color .sc-ion-buttons-md-h.sc-ion-buttons-md-s .button-outline{--border-color:var(--ion-color-contrast)}.sc-ion-buttons-md-s .button-has-icon-only.button-clear{--padding-top:12px;--padding-end:12px;--padding-bottom:12px;--padding-start:12px;--border-radius:50%;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;width:48px;height:48px}.sc-ion-buttons-md-s .button{--background-hover:currentColor}.sc-ion-buttons-md-s .button-solid{--color:var(--ion-toolbar-background, var(--ion-background-color, #fff));--background:var(--ion-toolbar-color, var(--ion-text-color, #424242));--background-activated:transparent;--background-focused:currentColor}.sc-ion-buttons-md-s .button-outline{--color:initial;--background:transparent;--background-activated:transparent;--background-focused:currentColor;--background-hover:currentColor;--border-color:currentColor}.sc-ion-buttons-md-s .button-clear{--color:initial;--background:transparent;--background-activated:transparent;--background-focused:currentColor;--background-hover:currentColor}.sc-ion-buttons-md-s ion-icon[slot=start]{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;margin-right:0.3em;font-size:1.4em}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.sc-ion-buttons-md-s ion-icon[slot=start]{margin-right:unset;-webkit-margin-end:0.3em;margin-inline-end:0.3em}}.sc-ion-buttons-md-s ion-icon[slot=end]{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;margin-left:0.4em;font-size:1.4em}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.sc-ion-buttons-md-s ion-icon[slot=end]{margin-left:unset;-webkit-margin-start:0.4em;margin-inline-start:0.4em}}.sc-ion-buttons-md-s ion-icon[slot=icon-only]{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;font-size:1.8em}";

const Buttons = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    /**
     * If true, buttons will disappear when its
     * parent toolbar has fully collapsed if the toolbar
     * is not the first toolbar. If the toolbar is the
     * first toolbar, the buttons will be hidden and will
     * only be shown once all toolbars have fully collapsed.
     *
     * Only applies in `ios` mode with `collapse` set to
     * `true` on `ion-header`.
     *
     * Typically used for [Collapsible Large Titles](https://ionicframework.com/docs/api/title#collapsible-large-titles)
     */
    this.collapse = false;
  }
  render() {
    const mode = getIonMode(this);
    return (h(Host, { class: {
        [mode]: true,
        ['buttons-collapse']: this.collapse,
      } }));
  }
};
Buttons.style = {
  ios: buttonsIosCss,
  md: buttonsMdCss
};

const contentCss = ":host{--background:var(--ion-background-color, #fff);--color:var(--ion-text-color, #000);--padding-top:0px;--padding-bottom:0px;--padding-start:0px;--padding-end:0px;--keyboard-offset:0px;--offset-top:0px;--offset-bottom:0px;--overflow:auto;display:block;position:relative;-ms-flex:1;flex:1;width:100%;height:100%;margin:0 !important;padding:0 !important;font-family:var(--ion-font-family, inherit);contain:size style}:host(.ion-color) .inner-scroll{background:var(--ion-color-base);color:var(--ion-color-contrast)}:host(.outer-content){--background:var(--ion-color-step-50, #f2f2f2)}#background-content{left:0px;right:0px;top:calc(var(--offset-top) * -1);bottom:calc(var(--offset-bottom) * -1);position:absolute;background:var(--background)}.inner-scroll{left:0px;right:0px;top:calc(var(--offset-top) * -1);bottom:calc(var(--offset-bottom) * -1);padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:calc(var(--padding-top) + var(--offset-top));padding-bottom:calc(var(--padding-bottom) + var(--keyboard-offset) + var(--offset-bottom));position:absolute;color:var(--color);-webkit-box-sizing:border-box;box-sizing:border-box;overflow:hidden;-ms-touch-action:pan-x pan-y pinch-zoom;touch-action:pan-x pan-y pinch-zoom}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.inner-scroll{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}.scroll-y,.scroll-x{-webkit-overflow-scrolling:touch;z-index:0;will-change:scroll-position}.scroll-y{overflow-y:var(--overflow);overscroll-behavior-y:contain}.scroll-x{overflow-x:var(--overflow);overscroll-behavior-x:contain}.overscroll::before,.overscroll::after{position:absolute;width:1px;height:1px;content:\"\"}.overscroll::before{bottom:-1px}.overscroll::after{top:-1px}:host(.content-sizing){display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;min-height:0;contain:none}:host(.content-sizing) .inner-scroll{position:relative;top:0;bottom:0;margin-top:calc(var(--offset-top) * -1);margin-bottom:calc(var(--offset-bottom) * -1)}.transition-effect{display:none;position:absolute;width:100%;height:100vh;opacity:0;pointer-events:none}:host(.content-ltr) .transition-effect{left:-100%;}:host(.content-rtl) .transition-effect{right:-100%;}.transition-cover{position:absolute;right:0;width:100%;height:100%;background:black;opacity:0.1}.transition-shadow{display:block;position:absolute;width:10px;height:100%;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTE3MDgzRkQ5QTkyMTFFOUEwNzQ5MkJFREE1NUY2MjQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTE3MDgzRkU5QTkyMTFFOUEwNzQ5MkJFREE1NUY2MjQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMTcwODNGQjlBOTIxMUU5QTA3NDkyQkVEQTU1RjYyNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMTcwODNGQzlBOTIxMUU5QTA3NDkyQkVEQTU1RjYyNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmePEuQAAABNSURBVHjaYvz//z8DIxAwMDAwATGMhmFmPDQuOSZks0AMmoJBaQHjkPfB0Lfg/2gQjVow+HPy/yHvg9GiYjQfjMbBqAWjFgy/4hogwADYqwdzxy5BuwAAAABJRU5ErkJggg==);background-repeat:repeat-y;background-size:10px 16px}:host(.content-ltr) .transition-shadow{right:0;}:host(.content-rtl) .transition-shadow{left:0;-webkit-transform:scaleX(-1);transform:scaleX(-1)}::slotted([slot=fixed]){position:absolute;-webkit-transform:translateZ(0);transform:translateZ(0)}";

const Content = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.ionScrollStart = createEvent(this, "ionScrollStart", 7);
    this.ionScroll = createEvent(this, "ionScroll", 7);
    this.ionScrollEnd = createEvent(this, "ionScrollEnd", 7);
    this.watchDog = null;
    this.isScrolling = false;
    this.lastScroll = 0;
    this.queued = false;
    this.cTop = -1;
    this.cBottom = -1;
    this.isMainContent = true;
    this.resizeTimeout = null;
    // Detail is used in a hot loop in the scroll event, by allocating it here
    // V8 will be able to inline any read/write to it since it's a monomorphic class.
    // https://mrale.ph/blog/2015/01/11/whats-up-with-monomorphism.html
    this.detail = {
      scrollTop: 0,
      scrollLeft: 0,
      type: 'scroll',
      event: undefined,
      startX: 0,
      startY: 0,
      startTime: 0,
      currentX: 0,
      currentY: 0,
      velocityX: 0,
      velocityY: 0,
      deltaX: 0,
      deltaY: 0,
      currentTime: 0,
      data: undefined,
      isScrolling: true,
    };
    /**
     * If `true`, the content will scroll behind the headers
     * and footers. This effect can easily be seen by setting the toolbar
     * to transparent.
     */
    this.fullscreen = false;
    /**
     * If you want to enable the content scrolling in the X axis, set this property to `true`.
     */
    this.scrollX = false;
    /**
     * If you want to disable the content scrolling in the Y axis, set this property to `false`.
     */
    this.scrollY = true;
    /**
     * Because of performance reasons, ionScroll events are disabled by default, in order to enable them
     * and start listening from (ionScroll), set this property to `true`.
     */
    this.scrollEvents = false;
  }
  connectedCallback() {
    this.isMainContent = this.el.closest('ion-menu, ion-popover, ion-modal') === null;
  }
  disconnectedCallback() {
    this.onScrollEnd();
  }
  onAppLoad() {
    this.resize();
  }
  /**
   * Rotating certain devices can update
   * the safe area insets. As a result,
   * the fullscreen feature on ion-content
   * needs to be recalculated.
   *
   * We listen for "resize" because we
   * do not care what the orientation of
   * the device is. Other APIs
   * such as ScreenOrientation or
   * the deviceorientation event must have
   * permission from the user first whereas
   * the "resize" event does not.
   *
   * We also throttle the callback to minimize
   * thrashing when quickly resizing a window.
   */
  onResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
    this.resizeTimeout = setTimeout(() => {
      /**
       * Resize should only happen
       * if the content is visible.
       * When the content is hidden
       * then offsetParent will be null.
       */
      if (this.el.offsetParent === null) {
        return;
      }
      this.resize();
    }, 100);
  }
  shouldForceOverscroll() {
    const { forceOverscroll } = this;
    const mode = getIonMode(this);
    return forceOverscroll === undefined ? mode === 'ios' && isPlatform('ios') : forceOverscroll;
  }
  resize() {
    if (this.fullscreen) {
      readTask(() => this.readDimensions());
    }
    else if (this.cTop !== 0 || this.cBottom !== 0) {
      this.cTop = this.cBottom = 0;
      forceUpdate(this);
    }
  }
  readDimensions() {
    const page = getPageElement(this.el);
    const top = Math.max(this.el.offsetTop, 0);
    const bottom = Math.max(page.offsetHeight - top - this.el.offsetHeight, 0);
    const dirty = top !== this.cTop || bottom !== this.cBottom;
    if (dirty) {
      this.cTop = top;
      this.cBottom = bottom;
      forceUpdate(this);
    }
  }
  onScroll(ev) {
    const timeStamp = Date.now();
    const shouldStart = !this.isScrolling;
    this.lastScroll = timeStamp;
    if (shouldStart) {
      this.onScrollStart();
    }
    if (!this.queued && this.scrollEvents) {
      this.queued = true;
      readTask((ts) => {
        this.queued = false;
        this.detail.event = ev;
        updateScrollDetail(this.detail, this.scrollEl, ts, shouldStart);
        this.ionScroll.emit(this.detail);
      });
    }
  }
  /**
   * Get the element where the actual scrolling takes place.
   * This element can be used to subscribe to `scroll` events or manually modify
   * `scrollTop`. However, it's recommended to use the API provided by `ion-content`:
   *
   * i.e. Using `ionScroll`, `ionScrollStart`, `ionScrollEnd` for scrolling events
   * and `scrollToPoint()` to scroll the content into a certain point.
   */
  async getScrollElement() {
    /**
     * If this gets called in certain early lifecycle hooks (ex: Vue onMounted),
     * scrollEl won't be defined yet with the custom elements build, so wait for it to load in.
     */
    if (!this.scrollEl) {
      await new Promise((resolve) => componentOnReady(this.el, resolve));
    }
    return Promise.resolve(this.scrollEl);
  }
  /**
   * Returns the background content element.
   * @internal
   */
  async getBackgroundElement() {
    if (!this.backgroundContentEl) {
      await new Promise((resolve) => componentOnReady(this.el, resolve));
    }
    return Promise.resolve(this.backgroundContentEl);
  }
  /**
   * Scroll to the top of the component.
   *
   * @param duration The amount of time to take scrolling to the top. Defaults to `0`.
   */
  scrollToTop(duration = 0) {
    return this.scrollToPoint(undefined, 0, duration);
  }
  /**
   * Scroll to the bottom of the component.
   *
   * @param duration The amount of time to take scrolling to the bottom. Defaults to `0`.
   */
  async scrollToBottom(duration = 0) {
    const scrollEl = await this.getScrollElement();
    const y = scrollEl.scrollHeight - scrollEl.clientHeight;
    return this.scrollToPoint(undefined, y, duration);
  }
  /**
   * Scroll by a specified X/Y distance in the component.
   *
   * @param x The amount to scroll by on the horizontal axis.
   * @param y The amount to scroll by on the vertical axis.
   * @param duration The amount of time to take scrolling by that amount.
   */
  async scrollByPoint(x, y, duration) {
    const scrollEl = await this.getScrollElement();
    return this.scrollToPoint(x + scrollEl.scrollLeft, y + scrollEl.scrollTop, duration);
  }
  /**
   * Scroll to a specified X/Y location in the component.
   *
   * @param x The point to scroll to on the horizontal axis.
   * @param y The point to scroll to on the vertical axis.
   * @param duration The amount of time to take scrolling to that point. Defaults to `0`.
   */
  async scrollToPoint(x, y, duration = 0) {
    const el = await this.getScrollElement();
    if (duration < 32) {
      if (y != null) {
        el.scrollTop = y;
      }
      if (x != null) {
        el.scrollLeft = x;
      }
      return;
    }
    let resolve;
    let startTime = 0;
    const promise = new Promise((r) => (resolve = r));
    const fromY = el.scrollTop;
    const fromX = el.scrollLeft;
    const deltaY = y != null ? y - fromY : 0;
    const deltaX = x != null ? x - fromX : 0;
    // scroll loop
    const step = (timeStamp) => {
      const linearTime = Math.min(1, (timeStamp - startTime) / duration) - 1;
      const easedT = Math.pow(linearTime, 3) + 1;
      if (deltaY !== 0) {
        el.scrollTop = Math.floor(easedT * deltaY + fromY);
      }
      if (deltaX !== 0) {
        el.scrollLeft = Math.floor(easedT * deltaX + fromX);
      }
      if (easedT < 1) {
        // do not use DomController here
        // must use nativeRaf in order to fire in the next frame
        requestAnimationFrame(step);
      }
      else {
        resolve();
      }
    };
    // chill out for a frame first
    requestAnimationFrame((ts) => {
      startTime = ts;
      step(ts);
    });
    return promise;
  }
  onScrollStart() {
    this.isScrolling = true;
    this.ionScrollStart.emit({
      isScrolling: true,
    });
    if (this.watchDog) {
      clearInterval(this.watchDog);
    }
    // watchdog
    this.watchDog = setInterval(() => {
      if (this.lastScroll < Date.now() - 120) {
        this.onScrollEnd();
      }
    }, 100);
  }
  onScrollEnd() {
    if (this.watchDog)
      clearInterval(this.watchDog);
    this.watchDog = null;
    if (this.isScrolling) {
      this.isScrolling = false;
      this.ionScrollEnd.emit({
        isScrolling: false,
      });
    }
  }
  render() {
    const { isMainContent, scrollX, scrollY, el } = this;
    const rtl = isRTL(el) ? 'rtl' : 'ltr';
    const mode = getIonMode(this);
    const forceOverscroll = this.shouldForceOverscroll();
    const transitionShadow = mode === 'ios';
    const TagType = isMainContent ? 'main' : 'div';
    this.resize();
    return (h(Host, { class: createColorClasses(this.color, {
        [mode]: true,
        'content-sizing': hostContext('ion-popover', this.el),
        overscroll: forceOverscroll,
        [`content-${rtl}`]: true,
      }), style: {
        '--offset-top': `${this.cTop}px`,
        '--offset-bottom': `${this.cBottom}px`,
      } }, h("div", { ref: (el) => (this.backgroundContentEl = el), id: "background-content", part: "background" }), h(TagType, { class: {
        'inner-scroll': true,
        'scroll-x': scrollX,
        'scroll-y': scrollY,
        overscroll: (scrollX || scrollY) && forceOverscroll,
      }, ref: (scrollEl) => (this.scrollEl = scrollEl), onScroll: this.scrollEvents ? (ev) => this.onScroll(ev) : undefined, part: "scroll" }, h("slot", null)), transitionShadow ? (h("div", { class: "transition-effect" }, h("div", { class: "transition-cover" }), h("div", { class: "transition-shadow" }))) : null, h("slot", { name: "fixed" })));
  }
  get el() { return getElement(this); }
};
const getParentElement = (el) => {
  var _a;
  if (el.parentElement) {
    // normal element with a parent element
    return el.parentElement;
  }
  if ((_a = el.parentNode) === null || _a === void 0 ? void 0 : _a.host) {
    // shadow dom's document fragment
    return el.parentNode.host;
  }
  return null;
};
const getPageElement = (el) => {
  const tabs = el.closest('ion-tabs');
  if (tabs) {
    return tabs;
  }
  /**
   * If we're in a popover, we need to use its wrapper so we can account for space
   * between the popover and the edges of the screen. But if the popover contains
   * its own page element, we should use that instead.
   */
  const page = el.closest('ion-app, ion-page, .ion-page, page-inner, .popover-content');
  if (page) {
    return page;
  }
  return getParentElement(el);
};
// ******** DOM READ ****************
const updateScrollDetail = (detail, el, timestamp, shouldStart) => {
  const prevX = detail.currentX;
  const prevY = detail.currentY;
  const prevT = detail.currentTime;
  const currentX = el.scrollLeft;
  const currentY = el.scrollTop;
  const timeDelta = timestamp - prevT;
  if (shouldStart) {
    // remember the start positions
    detail.startTime = timestamp;
    detail.startX = currentX;
    detail.startY = currentY;
    detail.velocityX = detail.velocityY = 0;
  }
  detail.currentTime = timestamp;
  detail.currentX = detail.scrollLeft = currentX;
  detail.currentY = detail.scrollTop = currentY;
  detail.deltaX = currentX - detail.startX;
  detail.deltaY = currentY - detail.startY;
  if (timeDelta > 0 && timeDelta < 100) {
    const velocityX = (currentX - prevX) / timeDelta;
    const velocityY = (currentY - prevY) / timeDelta;
    detail.velocityX = velocityX * 0.7 + detail.velocityX * 0.3;
    detail.velocityY = velocityY * 0.7 + detail.velocityY * 0.3;
  }
};
Content.style = contentCss;

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

const Footer = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
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
  get el() { return getElement(this); }
};
Footer.style = {
  ios: footerIosCss,
  md: footerMdCss
};

const TRANSITION = 'all 0.2s ease-in-out';
const cloneElement = (tagName) => {
  const getCachedEl = document.querySelector(`${tagName}.ion-cloned-element`);
  if (getCachedEl !== null) {
    return getCachedEl;
  }
  const clonedEl = document.createElement(tagName);
  clonedEl.classList.add('ion-cloned-element');
  clonedEl.style.setProperty('display', 'none');
  document.body.appendChild(clonedEl);
  return clonedEl;
};
const createHeaderIndex = (headerEl) => {
  if (!headerEl) {
    return;
  }
  const toolbars = headerEl.querySelectorAll('ion-toolbar');
  return {
    el: headerEl,
    toolbars: Array.from(toolbars).map((toolbar) => {
      const ionTitleEl = toolbar.querySelector('ion-title');
      return {
        el: toolbar,
        background: toolbar.shadowRoot.querySelector('.toolbar-background'),
        ionTitleEl,
        innerTitleEl: ionTitleEl ? ionTitleEl.shadowRoot.querySelector('.toolbar-title') : null,
        ionButtonsEl: Array.from(toolbar.querySelectorAll('ion-buttons')),
      };
    }),
  };
};
const handleContentScroll = (scrollEl, scrollHeaderIndex, contentEl) => {
  readTask(() => {
    const scrollTop = scrollEl.scrollTop;
    const scale = clamp(1, 1 + -scrollTop / 500, 1.1);
    // Native refresher should not cause titles to scale
    const nativeRefresher = contentEl.querySelector('ion-refresher.refresher-native');
    if (nativeRefresher === null) {
      writeTask(() => {
        scaleLargeTitles(scrollHeaderIndex.toolbars, scale);
      });
    }
  });
};
const setToolbarBackgroundOpacity = (headerEl, opacity) => {
  /**
   * Fading in the backdrop opacity
   * should happen after the large title
   * has collapsed, so it is handled
   * by handleHeaderFade()
   */
  if (headerEl.collapse === 'fade') {
    return;
  }
  if (opacity === undefined) {
    headerEl.style.removeProperty('--opacity-scale');
  }
  else {
    headerEl.style.setProperty('--opacity-scale', opacity.toString());
  }
};
const handleToolbarBorderIntersection = (ev, mainHeaderIndex, scrollTop) => {
  if (!ev[0].isIntersecting) {
    return;
  }
  /**
   * There is a bug in Safari where overflow scrolling on a non-body element
   * does not always reset the scrollTop position to 0 when letting go. It will
   * set to 1 once the rubber band effect has ended. This causes the background to
   * appear slightly on certain app setups.
   *
   * Additionally, we check if user is rubber banding (scrolling is negative)
   * as this can mean they are using pull to refresh. Once the refresher starts,
   * the content is transformed which can cause the intersection observer to erroneously
   * fire here as well.
   */
  const scale = ev[0].intersectionRatio > 0.9 || scrollTop <= 0 ? 0 : ((1 - ev[0].intersectionRatio) * 100) / 75;
  setToolbarBackgroundOpacity(mainHeaderIndex.el, scale === 1 ? undefined : scale);
};
/**
 * If toolbars are intersecting, hide the scrollable toolbar content
 * and show the primary toolbar content. If the toolbars are not intersecting,
 * hide the primary toolbar content and show the scrollable toolbar content
 */
const handleToolbarIntersection = (ev, // TODO(FW-2832): type (IntersectionObserverEntry[] triggers errors which should be sorted)
mainHeaderIndex, scrollHeaderIndex, scrollEl) => {
  writeTask(() => {
    const scrollTop = scrollEl.scrollTop;
    handleToolbarBorderIntersection(ev, mainHeaderIndex, scrollTop);
    const event = ev[0];
    const intersection = event.intersectionRect;
    const intersectionArea = intersection.width * intersection.height;
    const rootArea = event.rootBounds.width * event.rootBounds.height;
    const isPageHidden = intersectionArea === 0 && rootArea === 0;
    const leftDiff = Math.abs(intersection.left - event.boundingClientRect.left);
    const rightDiff = Math.abs(intersection.right - event.boundingClientRect.right);
    const isPageTransitioning = intersectionArea > 0 && (leftDiff >= 5 || rightDiff >= 5);
    if (isPageHidden || isPageTransitioning) {
      return;
    }
    if (event.isIntersecting) {
      setHeaderActive(mainHeaderIndex, false);
      setHeaderActive(scrollHeaderIndex);
    }
    else {
      /**
       * There is a bug with IntersectionObserver on Safari
       * where `event.isIntersecting === false` when cancelling
       * a swipe to go back gesture. Checking the intersection
       * x, y, width, and height provides a workaround. This bug
       * does not happen when using Safari + Web Animations,
       * only Safari + CSS Animations.
       */
      const hasValidIntersection = (intersection.x === 0 && intersection.y === 0) || (intersection.width !== 0 && intersection.height !== 0);
      if (hasValidIntersection && scrollTop > 0) {
        setHeaderActive(mainHeaderIndex);
        setHeaderActive(scrollHeaderIndex, false);
        setToolbarBackgroundOpacity(mainHeaderIndex.el);
      }
    }
  });
};
const setHeaderActive = (headerIndex, active = true) => {
  const headerEl = headerIndex.el;
  if (active) {
    headerEl.classList.remove('header-collapse-condense-inactive');
    headerEl.removeAttribute('aria-hidden');
  }
  else {
    headerEl.classList.add('header-collapse-condense-inactive');
    headerEl.setAttribute('aria-hidden', 'true');
  }
};
const scaleLargeTitles = (toolbars = [], scale = 1, transition = false) => {
  toolbars.forEach((toolbar) => {
    const ionTitle = toolbar.ionTitleEl;
    const titleDiv = toolbar.innerTitleEl;
    if (!ionTitle || ionTitle.size !== 'large') {
      return;
    }
    titleDiv.style.transition = transition ? TRANSITION : '';
    titleDiv.style.transform = `scale3d(${scale}, ${scale}, 1)`;
  });
};
const handleHeaderFade = (scrollEl, baseEl, condenseHeader) => {
  readTask(() => {
    const scrollTop = scrollEl.scrollTop;
    const baseElHeight = baseEl.clientHeight;
    const fadeStart = condenseHeader ? condenseHeader.clientHeight : 0;
    /**
     * If we are using fade header with a condense
     * header, then the toolbar backgrounds should
     * not begin to fade in until the condense
     * header has fully collapsed.
     *
     * Additionally, the main content should not
     * overflow out of the container until the
     * condense header has fully collapsed. When
     * using just the condense header the content
     * should overflow out of the container.
     */
    if (condenseHeader !== null && scrollTop < fadeStart) {
      baseEl.style.setProperty('--opacity-scale', '0');
      scrollEl.style.setProperty('clip-path', `inset(${baseElHeight}px 0px 0px 0px)`);
      return;
    }
    const distanceToStart = scrollTop - fadeStart;
    const fadeDuration = 10;
    const scale = clamp(0, distanceToStart / fadeDuration, 1);
    writeTask(() => {
      scrollEl.style.removeProperty('clip-path');
      baseEl.style.setProperty('--opacity-scale', scale.toString());
    });
  });
};

const headerIosCss = "ion-header{display:block;position:relative;-ms-flex-order:-1;order:-1;width:100%;z-index:10}ion-header ion-toolbar:first-of-type{padding-top:var(--ion-safe-area-top, 0)}.header-ios ion-toolbar:last-of-type{--border-width:0 0 0.55px}@supports ((-webkit-backdrop-filter: blur(0)) or (backdrop-filter: blur(0))){.header-background{left:0;right:0;top:0;bottom:0;position:absolute;-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px)}.header-translucent-ios ion-toolbar{--opacity:.8}.header-collapse-condense-inactive .header-background{-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px)}}.header-ios.ion-no-border ion-toolbar:last-of-type{--border-width:0}.header-collapse-fade ion-toolbar{--opacity-scale:inherit}.header-collapse-condense{z-index:9}.header-collapse-condense ion-toolbar{position:-webkit-sticky;position:sticky;top:0}.header-collapse-condense ion-toolbar:first-of-type{padding-top:7px;z-index:1}.header-collapse-condense ion-toolbar{--background:var(--ion-background-color, #fff);z-index:0}.header-collapse-condense ion-toolbar:last-of-type{--border-width:0px}.header-collapse-condense ion-toolbar ion-searchbar{height:48px;padding-top:0px;padding-bottom:13px}.header-collapse-main{--opacity-scale:1}.header-collapse-main ion-toolbar{--opacity-scale:inherit}.header-collapse-main ion-toolbar.in-toolbar ion-title,.header-collapse-main ion-toolbar.in-toolbar ion-buttons{-webkit-transition:all 0.2s ease-in-out;transition:all 0.2s ease-in-out}.header-collapse-condense-inactive:not(.header-collapse-condense) ion-toolbar.in-toolbar ion-title,.header-collapse-condense-inactive:not(.header-collapse-condense) ion-toolbar.in-toolbar ion-buttons.buttons-collapse{opacity:0;pointer-events:none}.header-collapse-condense-inactive.header-collapse-condense ion-toolbar.in-toolbar ion-title,.header-collapse-condense-inactive.header-collapse-condense ion-toolbar.in-toolbar ion-buttons.buttons-collapse{visibility:hidden}";

const headerMdCss = "ion-header{display:block;position:relative;-ms-flex-order:-1;order:-1;width:100%;z-index:10}ion-header ion-toolbar:first-of-type{padding-top:var(--ion-safe-area-top, 0)}.header-md::after{left:0;bottom:-5px;background-position:left 0 top -2px;position:absolute;width:100%;height:5px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAHBAMAAADzDtBxAAAAD1BMVEUAAAAAAAAAAAAAAAAAAABPDueNAAAABXRSTlMUCS0gBIh/TXEAAAAaSURBVAjXYxCEAgY4UIICBmMogMsgFLtAAQCNSwXZKOdPxgAAAABJRU5ErkJggg==);background-repeat:repeat-x;content:\"\"}[dir=rtl] .header-md::after,:host-context([dir=rtl]) .header-md::after{left:unset;right:unset;right:0}[dir=rtl] .header-md::after,:host-context([dir=rtl]) .header-md::after{background-position:right 0 top -2px}.header-collapse-condense{display:none}.header-md.ion-no-border::after{display:none}";

const Header = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.inheritedAttributes = {};
    /**
     * If `true`, the header will be translucent.
     * Only applies when the mode is `"ios"` and the device supports
     * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
     *
     * Note: In order to scroll content behind the header, the `fullscreen`
     * attribute needs to be set on the content.
     */
    this.translucent = false;
    this.setupFadeHeader = async (contentEl, condenseHeader) => {
      const scrollEl = (this.scrollEl = await getScrollElement(contentEl));
      /**
       * Handle fading of toolbars on scroll
       */
      this.contentScrollCallback = () => {
        handleHeaderFade(this.scrollEl, this.el, condenseHeader);
      };
      scrollEl.addEventListener('scroll', this.contentScrollCallback);
      handleHeaderFade(this.scrollEl, this.el, condenseHeader);
    };
  }
  componentWillLoad() {
    this.inheritedAttributes = inheritAriaAttributes(this.el);
  }
  componentDidLoad() {
    this.checkCollapsibleHeader();
  }
  componentDidUpdate() {
    this.checkCollapsibleHeader();
  }
  disconnectedCallback() {
    this.destroyCollapsibleHeader();
  }
  async checkCollapsibleHeader() {
    const mode = getIonMode(this);
    if (mode !== 'ios') {
      return;
    }
    const { collapse } = this;
    const hasCondense = collapse === 'condense';
    const hasFade = collapse === 'fade';
    this.destroyCollapsibleHeader();
    if (hasCondense) {
      const pageEl = this.el.closest('ion-app,ion-page,.ion-page,page-inner');
      const contentEl = pageEl ? findIonContent(pageEl) : null;
      // Cloned elements are always needed in iOS transition
      writeTask(() => {
        const title = cloneElement('ion-title');
        title.size = 'large';
        cloneElement('ion-back-button');
      });
      await this.setupCondenseHeader(contentEl, pageEl);
    }
    else if (hasFade) {
      const pageEl = this.el.closest('ion-app,ion-page,.ion-page,page-inner');
      const contentEl = pageEl ? findIonContent(pageEl) : null;
      if (!contentEl) {
        printIonContentErrorMsg(this.el);
        return;
      }
      const condenseHeader = contentEl.querySelector('ion-header[collapse="condense"]');
      await this.setupFadeHeader(contentEl, condenseHeader);
    }
  }
  destroyCollapsibleHeader() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = undefined;
    }
    if (this.scrollEl && this.contentScrollCallback) {
      this.scrollEl.removeEventListener('scroll', this.contentScrollCallback);
      this.contentScrollCallback = undefined;
    }
    if (this.collapsibleMainHeader) {
      this.collapsibleMainHeader.classList.remove('header-collapse-main');
      this.collapsibleMainHeader = undefined;
    }
  }
  async setupCondenseHeader(contentEl, pageEl) {
    if (!contentEl || !pageEl) {
      printIonContentErrorMsg(this.el);
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }
    this.scrollEl = await getScrollElement(contentEl);
    const headers = pageEl.querySelectorAll('ion-header');
    this.collapsibleMainHeader = Array.from(headers).find((header) => header.collapse !== 'condense');
    if (!this.collapsibleMainHeader) {
      return;
    }
    const mainHeaderIndex = createHeaderIndex(this.collapsibleMainHeader);
    const scrollHeaderIndex = createHeaderIndex(this.el);
    if (!mainHeaderIndex || !scrollHeaderIndex) {
      return;
    }
    setHeaderActive(mainHeaderIndex, false);
    setToolbarBackgroundOpacity(mainHeaderIndex.el, 0);
    /**
     * Handle interaction between toolbar collapse and
     * showing/hiding content in the primary ion-header
     * as well as progressively showing/hiding the main header
     * border as the top-most toolbar collapses or expands.
     */
    const toolbarIntersection = (ev) => {
      handleToolbarIntersection(ev, mainHeaderIndex, scrollHeaderIndex, this.scrollEl);
    };
    this.intersectionObserver = new IntersectionObserver(toolbarIntersection, {
      root: contentEl,
      threshold: [0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    });
    this.intersectionObserver.observe(scrollHeaderIndex.toolbars[scrollHeaderIndex.toolbars.length - 1].el);
    /**
     * Handle scaling of large iOS titles and
     * showing/hiding border on last toolbar
     * in primary header
     */
    this.contentScrollCallback = () => {
      handleContentScroll(this.scrollEl, scrollHeaderIndex, contentEl);
    };
    this.scrollEl.addEventListener('scroll', this.contentScrollCallback);
    writeTask(() => {
      if (this.collapsibleMainHeader !== undefined) {
        this.collapsibleMainHeader.classList.add('header-collapse-main');
      }
    });
  }
  render() {
    const { translucent, inheritedAttributes } = this;
    const mode = getIonMode(this);
    const collapse = this.collapse || 'none';
    // banner role must be at top level, so remove role if inside a menu
    const roleType = hostContext('ion-menu', this.el) ? 'none' : 'banner';
    return (h(Host, Object.assign({ role: roleType, class: {
        [mode]: true,
        // Used internally for styling
        [`header-${mode}`]: true,
        [`header-translucent`]: this.translucent,
        [`header-collapse-${collapse}`]: true,
        [`header-translucent-${mode}`]: this.translucent,
      } }, inheritedAttributes), mode === 'ios' && translucent && h("div", { class: "header-background" }), h("slot", null)));
  }
  get el() { return getElement(this); }
};
Header.style = {
  ios: headerIosCss,
  md: headerMdCss
};

const routeOutletCss = ":host{left:0;right:0;top:0;bottom:0;position:absolute;contain:layout size style;overflow:hidden;z-index:0}";

const RouterOutlet = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.ionNavWillLoad = createEvent(this, "ionNavWillLoad", 7);
    this.ionNavWillChange = createEvent(this, "ionNavWillChange", 3);
    this.ionNavDidChange = createEvent(this, "ionNavDidChange", 3);
    this.gestureOrAnimationInProgress = false;
    /**
     * The mode determines which platform styles to use.
     */
    this.mode = getIonMode(this);
    /**
     * If `true`, the router-outlet should animate the transition of components.
     */
    this.animated = true;
  }
  swipeHandlerChanged() {
    if (this.gesture) {
      this.gesture.enable(this.swipeHandler !== undefined);
    }
  }
  async connectedCallback() {
    const onStart = () => {
      this.gestureOrAnimationInProgress = true;
      if (this.swipeHandler) {
        this.swipeHandler.onStart();
      }
    };
    this.gesture = (await import('./swipe-back-e35bd7d6.js')).createSwipeBackGesture(this.el, () => !this.gestureOrAnimationInProgress && !!this.swipeHandler && this.swipeHandler.canStart(), () => onStart(), (step) => { var _a; return (_a = this.ani) === null || _a === void 0 ? void 0 : _a.progressStep(step); }, (shouldComplete, step, dur) => {
      if (this.ani) {
        this.ani.onFinish(() => {
          this.gestureOrAnimationInProgress = false;
          if (this.swipeHandler) {
            this.swipeHandler.onEnd(shouldComplete);
          }
        }, { oneTimeCallback: true });
        // Account for rounding errors in JS
        let newStepValue = shouldComplete ? -0.001 : 0.001;
        /**
         * Animation will be reversed here, so need to
         * reverse the easing curve as well
         *
         * Additionally, we need to account for the time relative
         * to the new easing curve, as `stepValue` is going to be given
         * in terms of a linear curve.
         */
        if (!shouldComplete) {
          this.ani.easing('cubic-bezier(1, 0, 0.68, 0.28)');
          newStepValue += getTimeGivenProgression([0, 0], [1, 0], [0.68, 0.28], [1, 1], step)[0];
        }
        else {
          newStepValue += getTimeGivenProgression([0, 0], [0.32, 0.72], [0, 1], [1, 1], step)[0];
        }
        this.ani.progressEnd(shouldComplete ? 1 : 0, newStepValue, dur);
      }
      else {
        this.gestureOrAnimationInProgress = false;
      }
    });
    this.swipeHandlerChanged();
  }
  componentWillLoad() {
    this.ionNavWillLoad.emit();
  }
  disconnectedCallback() {
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
  }
  /** @internal */
  async commit(enteringEl, leavingEl, opts) {
    const unlock = await this.lock();
    let changed = false;
    try {
      changed = await this.transition(enteringEl, leavingEl, opts);
    }
    catch (e) {
      console.error(e);
    }
    unlock();
    return changed;
  }
  /** @internal */
  async setRouteId(id, params, direction, animation) {
    const changed = await this.setRoot(id, params, {
      duration: direction === 'root' ? 0 : undefined,
      direction: direction === 'back' ? 'back' : 'forward',
      animationBuilder: animation,
    });
    return {
      changed,
      element: this.activeEl,
    };
  }
  /** @internal */
  async getRouteId() {
    const active = this.activeEl;
    return active
      ? {
        id: active.tagName,
        element: active,
        params: this.activeParams,
      }
      : undefined;
  }
  async setRoot(component, params, opts) {
    if (this.activeComponent === component && shallowEqualStringMap(params, this.activeParams)) {
      return false;
    }
    // attach entering view to DOM
    const leavingEl = this.activeEl;
    const enteringEl = await attachComponent(this.delegate, this.el, component, ['ion-page', 'ion-page-invisible'], params);
    this.activeComponent = component;
    this.activeEl = enteringEl;
    this.activeParams = params;
    // commit animation
    await this.commit(enteringEl, leavingEl, opts);
    await detachComponent(this.delegate, leavingEl);
    return true;
  }
  async transition(enteringEl, leavingEl, opts = {}) {
    if (leavingEl === enteringEl) {
      return false;
    }
    // emit nav will change event
    this.ionNavWillChange.emit();
    const { el, mode } = this;
    const animated = this.animated && config.getBoolean('animated', true);
    const animationBuilder = opts.animationBuilder || this.animation || config.get('navAnimation');
    await transition(Object.assign(Object.assign({ mode,
      animated,
      enteringEl,
      leavingEl, baseEl: el, progressCallback: opts.progressAnimation
        ? (ani) => {
          /**
           * Because this progress callback is called asynchronously
           * it is possible for the gesture to start and end before
           * the animation is ever set. In that scenario, we should
           * immediately call progressEnd so that the transition promise
           * resolves and the gesture does not get locked up.
           */
          if (ani !== undefined && !this.gestureOrAnimationInProgress) {
            this.gestureOrAnimationInProgress = true;
            ani.onFinish(() => {
              this.gestureOrAnimationInProgress = false;
              if (this.swipeHandler) {
                this.swipeHandler.onEnd(false);
              }
            }, { oneTimeCallback: true });
            /**
             * Playing animation to beginning
             * with a duration of 0 prevents
             * any flickering when the animation
             * is later cleaned up.
             */
            ani.progressEnd(0, 0, 0);
          }
          else {
            this.ani = ani;
          }
        }
        : undefined }, opts), { animationBuilder }));
    // emit nav changed event
    this.ionNavDidChange.emit();
    return true;
  }
  async lock() {
    const p = this.waitPromise;
    let resolve;
    this.waitPromise = new Promise((r) => (resolve = r));
    if (p !== undefined) {
      await p;
    }
    return resolve;
  }
  render() {
    return h("slot", null);
  }
  get el() { return getElement(this); }
  static get watchers() { return {
    "swipeHandler": ["swipeHandlerChanged"]
  }; }
};
RouterOutlet.style = routeOutletCss;

const titleIosCss = ":host{--color:initial;display:-ms-flexbox;display:flex;-ms-flex:1;flex:1;-ms-flex-align:center;align-items:center;-webkit-transform:translateZ(0);transform:translateZ(0);color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}.toolbar-title{display:block;width:100%;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;pointer-events:auto}:host(.title-small) .toolbar-title{white-space:normal}:host{left:0;top:0;padding-left:90px;padding-right:90px;padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);position:absolute;width:100%;height:100%;-webkit-transform:translateZ(0);transform:translateZ(0);font-size:17px;font-weight:600;text-align:center;-webkit-box-sizing:border-box;box-sizing:border-box;pointer-events:none}:host-context([dir=rtl]){left:unset;right:unset;right:0}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host{padding-left:unset;padding-right:unset;-webkit-padding-start:90px;padding-inline-start:90px;-webkit-padding-end:90px;padding-inline-end:90px}}:host(.title-small){padding-left:9px;padding-right:9px;padding-top:6px;padding-bottom:16px;position:relative;font-size:13px;font-weight:normal}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host(.title-small){padding-left:unset;padding-right:unset;-webkit-padding-start:9px;padding-inline-start:9px;-webkit-padding-end:9px;padding-inline-end:9px}}:host(.title-large){padding-left:16px;padding-right:16px;padding-top:0;padding-bottom:0;-webkit-transform-origin:left center;transform-origin:left center;bottom:0;-ms-flex-align:end;align-items:flex-end;min-width:100%;padding-bottom:6px;font-size:34px;font-weight:700;text-align:start}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host(.title-large){padding-left:unset;padding-right:unset;-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px}}:host(.title-large.title-rtl){-webkit-transform-origin:right center;transform-origin:right center}:host(.title-large.ion-cloned-element){--color:var(--ion-text-color, #000)}:host(.title-large) .toolbar-title{-webkit-transform-origin:inherit;transform-origin:inherit}:host-context([dir=rtl]):host(.title-large) .toolbar-title,:host-context([dir=rtl]).title-large .toolbar-title{-webkit-transform-origin:calc(100% - inherit);transform-origin:calc(100% - inherit)}";

const titleMdCss = ":host{--color:initial;display:-ms-flexbox;display:flex;-ms-flex:1;flex:1;-ms-flex-align:center;align-items:center;-webkit-transform:translateZ(0);transform:translateZ(0);color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}.toolbar-title{display:block;width:100%;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;pointer-events:auto}:host(.title-small) .toolbar-title{white-space:normal}:host{padding-left:20px;padding-right:20px;padding-top:0;padding-bottom:0;font-size:20px;font-weight:500;letter-spacing:0.0125em}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host{padding-left:unset;padding-right:unset;-webkit-padding-start:20px;padding-inline-start:20px;-webkit-padding-end:20px;padding-inline-end:20px}}:host(.title-small){width:100%;height:100%;font-size:15px;font-weight:normal}";

const ToolbarTitle = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.ionStyle = createEvent(this, "ionStyle", 7);
  }
  sizeChanged() {
    this.emitStyle();
  }
  connectedCallback() {
    this.emitStyle();
  }
  emitStyle() {
    const size = this.getSize();
    this.ionStyle.emit({
      [`title-${size}`]: true,
    });
  }
  getSize() {
    return this.size !== undefined ? this.size : 'default';
  }
  render() {
    const mode = getIonMode(this);
    const size = this.getSize();
    return (h(Host, { class: createColorClasses(this.color, {
        [mode]: true,
        [`title-${size}`]: true,
        'title-rtl': document.dir === 'rtl',
      }) }, h("div", { class: "toolbar-title" }, h("slot", null))));
  }
  get el() { return getElement(this); }
  static get watchers() { return {
    "size": ["sizeChanged"]
  }; }
};
ToolbarTitle.style = {
  ios: titleIosCss,
  md: titleMdCss
};

const toolbarIosCss = ":host{--border-width:0;--border-style:solid;--opacity:1;--opacity-scale:1;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;padding-left:var(--ion-safe-area-left);padding-right:var(--ion-safe-area-right);display:block;position:relative;width:100%;color:var(--color);font-family:var(--ion-font-family, inherit);contain:content;z-index:10;-webkit-box-sizing:border-box;box-sizing:border-box}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--ion-safe-area-left);padding-inline-start:var(--ion-safe-area-left);-webkit-padding-end:var(--ion-safe-area-right);padding-inline-end:var(--ion-safe-area-right)}}:host(.ion-color){color:var(--ion-color-contrast)}:host(.ion-color) .toolbar-background{background:var(--ion-color-base)}.toolbar-container{padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);display:-ms-flexbox;display:flex;position:relative;-ms-flex-direction:row;flex-direction:row;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between;width:100%;min-height:var(--min-height);contain:content;overflow:hidden;z-index:10;-webkit-box-sizing:border-box;box-sizing:border-box}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.toolbar-container{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}.toolbar-background{left:0;right:0;top:0;bottom:0;position:absolute;-webkit-transform:translateZ(0);transform:translateZ(0);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);background:var(--background);contain:strict;opacity:calc(var(--opacity) * var(--opacity-scale));z-index:-1;pointer-events:none}::slotted(ion-progress-bar){left:0;right:0;bottom:0;position:absolute}:host{--background:var(--ion-toolbar-background, var(--ion-color-step-50, #f7f7f7));--color:var(--ion-toolbar-color, var(--ion-text-color, #000));--border-color:var(--ion-toolbar-border-color, var(--ion-border-color, var(--ion-color-step-150, rgba(0, 0, 0, 0.2))));--padding-top:3px;--padding-bottom:3px;--padding-start:4px;--padding-end:4px;--min-height:44px}.toolbar-content{-ms-flex:1;flex:1;-ms-flex-order:4;order:4;min-width:0}:host(.toolbar-segment) .toolbar-content{display:-ms-inline-flexbox;display:inline-flex}:host(.toolbar-searchbar) .toolbar-container{padding-top:0;padding-bottom:0}:host(.toolbar-searchbar) ::slotted(*){-ms-flex-item-align:start;align-self:start}:host(.toolbar-searchbar) ::slotted(ion-chip){margin-top:3px}:host(.toolbar-searchbar) ::slotted(ion-back-button){height:38px}::slotted(ion-buttons){min-height:38px}::slotted([slot=start]){-ms-flex-order:2;order:2}::slotted([slot=secondary]){-ms-flex-order:3;order:3}::slotted([slot=primary]){-ms-flex-order:5;order:5;text-align:end}::slotted([slot=end]){-ms-flex-order:6;order:6;text-align:end}:host(.toolbar-title-large) .toolbar-container{-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-align:start;align-items:flex-start}:host(.toolbar-title-large) .toolbar-content ion-title{-ms-flex:1;flex:1;-ms-flex-order:8;order:8;min-width:100%}";

const toolbarMdCss = ":host{--border-width:0;--border-style:solid;--opacity:1;--opacity-scale:1;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;padding-left:var(--ion-safe-area-left);padding-right:var(--ion-safe-area-right);display:block;position:relative;width:100%;color:var(--color);font-family:var(--ion-font-family, inherit);contain:content;z-index:10;-webkit-box-sizing:border-box;box-sizing:border-box}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--ion-safe-area-left);padding-inline-start:var(--ion-safe-area-left);-webkit-padding-end:var(--ion-safe-area-right);padding-inline-end:var(--ion-safe-area-right)}}:host(.ion-color){color:var(--ion-color-contrast)}:host(.ion-color) .toolbar-background{background:var(--ion-color-base)}.toolbar-container{padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);display:-ms-flexbox;display:flex;position:relative;-ms-flex-direction:row;flex-direction:row;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between;width:100%;min-height:var(--min-height);contain:content;overflow:hidden;z-index:10;-webkit-box-sizing:border-box;box-sizing:border-box}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.toolbar-container{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}.toolbar-background{left:0;right:0;top:0;bottom:0;position:absolute;-webkit-transform:translateZ(0);transform:translateZ(0);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);background:var(--background);contain:strict;opacity:calc(var(--opacity) * var(--opacity-scale));z-index:-1;pointer-events:none}::slotted(ion-progress-bar){left:0;right:0;bottom:0;position:absolute}:host{--background:var(--ion-toolbar-background, var(--ion-background-color, #fff));--color:var(--ion-toolbar-color, var(--ion-text-color, #424242));--border-color:var(--ion-toolbar-border-color, var(--ion-border-color, var(--ion-color-step-150, #c1c4cd)));--padding-top:0;--padding-bottom:0;--padding-start:0;--padding-end:0;--min-height:56px}.toolbar-content{-ms-flex:1;flex:1;-ms-flex-order:3;order:3;min-width:0;max-width:100%}::slotted(.buttons-first-slot){margin-left:4px}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){::slotted(.buttons-first-slot){margin-left:unset;-webkit-margin-start:4px;margin-inline-start:4px}}::slotted(.buttons-last-slot){margin-right:4px}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){::slotted(.buttons-last-slot){margin-right:unset;-webkit-margin-end:4px;margin-inline-end:4px}}::slotted([slot=start]){-ms-flex-order:2;order:2}::slotted([slot=secondary]){-ms-flex-order:4;order:4}::slotted([slot=primary]){-ms-flex-order:5;order:5;text-align:end}::slotted([slot=end]){-ms-flex-order:6;order:6;text-align:end}";

const Toolbar = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.childrenStyles = new Map();
  }
  componentWillLoad() {
    const buttons = Array.from(this.el.querySelectorAll('ion-buttons'));
    const firstButtons = buttons.find((button) => {
      return button.slot === 'start';
    });
    if (firstButtons) {
      firstButtons.classList.add('buttons-first-slot');
    }
    const buttonsReversed = buttons.reverse();
    const lastButtons = buttonsReversed.find((button) => button.slot === 'end') ||
      buttonsReversed.find((button) => button.slot === 'primary') ||
      buttonsReversed.find((button) => button.slot === 'secondary');
    if (lastButtons) {
      lastButtons.classList.add('buttons-last-slot');
    }
  }
  childrenStyle(ev) {
    ev.stopPropagation();
    const tagName = ev.target.tagName;
    const updatedStyles = ev.detail;
    const newStyles = {};
    const childStyles = this.childrenStyles.get(tagName) || {};
    let hasStyleChange = false;
    Object.keys(updatedStyles).forEach((key) => {
      const childKey = `toolbar-${key}`;
      const newValue = updatedStyles[key];
      if (newValue !== childStyles[childKey]) {
        hasStyleChange = true;
      }
      if (newValue) {
        newStyles[childKey] = true;
      }
    });
    if (hasStyleChange) {
      this.childrenStyles.set(tagName, newStyles);
      forceUpdate(this);
    }
  }
  render() {
    const mode = getIonMode(this);
    const childStyles = {};
    this.childrenStyles.forEach((value) => {
      Object.assign(childStyles, value);
    });
    return (h(Host, { class: Object.assign(Object.assign({}, childStyles), createColorClasses(this.color, {
        [mode]: true,
        'in-toolbar': hostContext('ion-toolbar', this.el),
      })) }, h("div", { class: "toolbar-background" }), h("div", { class: "toolbar-container" }, h("slot", { name: "start" }), h("slot", { name: "secondary" }), h("div", { class: "toolbar-content" }, h("slot", null)), h("slot", { name: "primary" }), h("slot", { name: "end" }))));
  }
  get el() { return getElement(this); }
};
Toolbar.style = {
  ios: toolbarIosCss,
  md: toolbarMdCss
};

export { App as ion_app, Buttons as ion_buttons, Content as ion_content, Footer as ion_footer, Header as ion_header, RouterOutlet as ion_router_outlet, ToolbarTitle as ion_title, Toolbar as ion_toolbar };
