/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, forceUpdate, h, readTask } from '@stencil/core';
import { getIonMode } from '../../global/ionic-global';
import { componentOnReady } from '../../utils/helpers';
import { isPlatform } from '../../utils/platform';
import { isRTL } from '../../utils/rtl';
import { createColorClasses, hostContext } from '../../utils/theme';
/**
 * @slot - Content is placed in the scrollable area if provided without a slot.
 * @slot fixed - Should be used for fixed content that should not scroll.
 *
 * @part background - The background of the content.
 * @part scroll - The scrollable container of the content.
 */
export class Content {
  constructor() {
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
  static get is() { return "ion-content"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["content.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["content.css"]
    };
  }
  static get properties() {
    return {
      "color": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "Color",
          "resolved": "\"danger\" | \"dark\" | \"light\" | \"medium\" | \"primary\" | \"secondary\" | \"success\" | \"tertiary\" | \"warning\" | string & Record<never, never> | undefined",
          "references": {
            "Color": {
              "location": "import",
              "path": "../../interface"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "The color to use from your application's color palette.\nDefault options are: `\"primary\"`, `\"secondary\"`, `\"tertiary\"`, `\"success\"`, `\"warning\"`, `\"danger\"`, `\"light\"`, `\"medium\"`, and `\"dark\"`.\nFor more information on colors, see [theming](/docs/theming/basics)."
        },
        "attribute": "color",
        "reflect": true
      },
      "fullscreen": {
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
          "text": "If `true`, the content will scroll behind the headers\nand footers. This effect can easily be seen by setting the toolbar\nto transparent."
        },
        "attribute": "fullscreen",
        "reflect": false,
        "defaultValue": "false"
      },
      "forceOverscroll": {
        "type": "boolean",
        "mutable": true,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "If `true` and the content does not cause an overflow scroll, the scroll interaction will cause a bounce.\nIf the content exceeds the bounds of ionContent, nothing will change.\nNote, the does not disable the system bounce on iOS. That is an OS level setting."
        },
        "attribute": "force-overscroll",
        "reflect": false
      },
      "scrollX": {
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
          "text": "If you want to enable the content scrolling in the X axis, set this property to `true`."
        },
        "attribute": "scroll-x",
        "reflect": false,
        "defaultValue": "false"
      },
      "scrollY": {
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
          "text": "If you want to disable the content scrolling in the Y axis, set this property to `false`."
        },
        "attribute": "scroll-y",
        "reflect": false,
        "defaultValue": "true"
      },
      "scrollEvents": {
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
          "text": "Because of performance reasons, ionScroll events are disabled by default, in order to enable them\nand start listening from (ionScroll), set this property to `true`."
        },
        "attribute": "scroll-events",
        "reflect": false,
        "defaultValue": "false"
      }
    };
  }
  static get events() {
    return [{
        "method": "ionScrollStart",
        "name": "ionScrollStart",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted when the scroll has started. This event is disabled by default.\nSet `scrollEvents` to `true` to enable."
        },
        "complexType": {
          "original": "ScrollBaseDetail",
          "resolved": "ScrollBaseDetail",
          "references": {
            "ScrollBaseDetail": {
              "location": "import",
              "path": "../../interface"
            }
          }
        }
      }, {
        "method": "ionScroll",
        "name": "ionScroll",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted while scrolling. This event is disabled by default.\nSet `scrollEvents` to `true` to enable."
        },
        "complexType": {
          "original": "ScrollDetail",
          "resolved": "ScrollDetail",
          "references": {
            "ScrollDetail": {
              "location": "import",
              "path": "../../interface"
            }
          }
        }
      }, {
        "method": "ionScrollEnd",
        "name": "ionScrollEnd",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted when the scroll has ended. This event is disabled by default.\nSet `scrollEvents` to `true` to enable."
        },
        "complexType": {
          "original": "ScrollBaseDetail",
          "resolved": "ScrollBaseDetail",
          "references": {
            "ScrollBaseDetail": {
              "location": "import",
              "path": "../../interface"
            }
          }
        }
      }];
  }
  static get methods() {
    return {
      "getScrollElement": {
        "complexType": {
          "signature": "() => Promise<HTMLElement>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            },
            "HTMLElement": {
              "location": "global"
            }
          },
          "return": "Promise<HTMLElement>"
        },
        "docs": {
          "text": "Get the element where the actual scrolling takes place.\nThis element can be used to subscribe to `scroll` events or manually modify\n`scrollTop`. However, it's recommended to use the API provided by `ion-content`:\n\ni.e. Using `ionScroll`, `ionScrollStart`, `ionScrollEnd` for scrolling events\nand `scrollToPoint()` to scroll the content into a certain point.",
          "tags": []
        }
      },
      "getBackgroundElement": {
        "complexType": {
          "signature": "() => Promise<HTMLElement>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            },
            "HTMLElement": {
              "location": "global"
            }
          },
          "return": "Promise<HTMLElement>"
        },
        "docs": {
          "text": "Returns the background content element.",
          "tags": [{
              "name": "internal",
              "text": undefined
            }]
        }
      },
      "scrollToTop": {
        "complexType": {
          "signature": "(duration?: number) => Promise<void>",
          "parameters": [{
              "tags": [{
                  "name": "param",
                  "text": "duration The amount of time to take scrolling to the top. Defaults to `0`."
                }],
              "text": "The amount of time to take scrolling to the top. Defaults to `0`."
            }],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Scroll to the top of the component.",
          "tags": [{
              "name": "param",
              "text": "duration The amount of time to take scrolling to the top. Defaults to `0`."
            }]
        }
      },
      "scrollToBottom": {
        "complexType": {
          "signature": "(duration?: number) => Promise<void>",
          "parameters": [{
              "tags": [{
                  "name": "param",
                  "text": "duration The amount of time to take scrolling to the bottom. Defaults to `0`."
                }],
              "text": "The amount of time to take scrolling to the bottom. Defaults to `0`."
            }],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Scroll to the bottom of the component.",
          "tags": [{
              "name": "param",
              "text": "duration The amount of time to take scrolling to the bottom. Defaults to `0`."
            }]
        }
      },
      "scrollByPoint": {
        "complexType": {
          "signature": "(x: number, y: number, duration: number) => Promise<void>",
          "parameters": [{
              "tags": [{
                  "name": "param",
                  "text": "x The amount to scroll by on the horizontal axis."
                }],
              "text": "The amount to scroll by on the horizontal axis."
            }, {
              "tags": [{
                  "name": "param",
                  "text": "y The amount to scroll by on the vertical axis."
                }],
              "text": "The amount to scroll by on the vertical axis."
            }, {
              "tags": [{
                  "name": "param",
                  "text": "duration The amount of time to take scrolling by that amount."
                }],
              "text": "The amount of time to take scrolling by that amount."
            }],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Scroll by a specified X/Y distance in the component.",
          "tags": [{
              "name": "param",
              "text": "x The amount to scroll by on the horizontal axis."
            }, {
              "name": "param",
              "text": "y The amount to scroll by on the vertical axis."
            }, {
              "name": "param",
              "text": "duration The amount of time to take scrolling by that amount."
            }]
        }
      },
      "scrollToPoint": {
        "complexType": {
          "signature": "(x: number | undefined | null, y: number | undefined | null, duration?: number) => Promise<void>",
          "parameters": [{
              "tags": [{
                  "name": "param",
                  "text": "x The point to scroll to on the horizontal axis."
                }],
              "text": "The point to scroll to on the horizontal axis."
            }, {
              "tags": [{
                  "name": "param",
                  "text": "y The point to scroll to on the vertical axis."
                }],
              "text": "The point to scroll to on the vertical axis."
            }, {
              "tags": [{
                  "name": "param",
                  "text": "duration The amount of time to take scrolling to that point. Defaults to `0`."
                }],
              "text": "The amount of time to take scrolling to that point. Defaults to `0`."
            }],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Scroll to a specified X/Y location in the component.",
          "tags": [{
              "name": "param",
              "text": "x The point to scroll to on the horizontal axis."
            }, {
              "name": "param",
              "text": "y The point to scroll to on the vertical axis."
            }, {
              "name": "param",
              "text": "duration The amount of time to take scrolling to that point. Defaults to `0`."
            }]
        }
      }
    };
  }
  static get elementRef() { return "el"; }
  static get listeners() {
    return [{
        "name": "appload",
        "method": "onAppLoad",
        "target": "window",
        "capture": false,
        "passive": false
      }, {
        "name": "resize",
        "method": "onResize",
        "target": "window",
        "capture": false,
        "passive": true
      }];
  }
}
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
