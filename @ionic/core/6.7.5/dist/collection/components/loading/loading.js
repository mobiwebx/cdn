/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from '@stencil/core';
import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { ENABLE_HTML_CONTENT_DEFAULT } from '../../utils/config';
import { BACKDROP, dismiss, eventMethod, prepareOverlay, present } from '../../utils/overlays';
import { sanitizeDOMString } from '../../utils/sanitization';
import { getClassMap } from '../../utils/theme';
import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';
// TODO(FW-2832): types
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
export class Loading {
  constructor() {
    this.customHTMLEnabled = config.get('innerHTMLTemplatesEnabled', ENABLE_HTML_CONTENT_DEFAULT);
    this.presented = false;
    /**
     * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
     */
    this.keyboardClose = true;
    /**
     * Number of milliseconds to wait before dismissing the loading indicator.
     */
    this.duration = 0;
    /**
     * If `true`, the loading indicator will be dismissed when the backdrop is clicked.
     */
    this.backdropDismiss = false;
    /**
     * If `true`, a backdrop will be displayed behind the loading indicator.
     */
    this.showBackdrop = true;
    /**
     * If `true`, the loading indicator will be translucent.
     * Only applies when the mode is `"ios"` and the device supports
     * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
     */
    this.translucent = false;
    /**
     * If `true`, the loading indicator will animate.
     */
    this.animated = true;
    this.onBackdropTap = () => {
      this.dismiss(undefined, BACKDROP);
    };
  }
  connectedCallback() {
    prepareOverlay(this.el);
  }
  componentWillLoad() {
    if (this.spinner === undefined) {
      const mode = getIonMode(this);
      this.spinner = config.get('loadingSpinner', config.get('spinner', mode === 'ios' ? 'lines' : 'crescent'));
    }
  }
  /**
   * Present the loading overlay after it has been created.
   */
  async present() {
    await present(this, 'loadingEnter', iosEnterAnimation, mdEnterAnimation);
    if (this.duration > 0) {
      this.durationTimeout = setTimeout(() => this.dismiss(), this.duration + 10);
    }
  }
  /**
   * Dismiss the loading overlay after it has been presented.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the loading.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the loading.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   */
  dismiss(data, role) {
    if (this.durationTimeout) {
      clearTimeout(this.durationTimeout);
    }
    return dismiss(this, data, role, 'loadingLeave', iosLeaveAnimation, mdLeaveAnimation);
  }
  /**
   * Returns a promise that resolves when the loading did dismiss.
   */
  onDidDismiss() {
    return eventMethod(this.el, 'ionLoadingDidDismiss');
  }
  /**
   * Returns a promise that resolves when the loading will dismiss.
   */
  onWillDismiss() {
    return eventMethod(this.el, 'ionLoadingWillDismiss');
  }
  renderLoadingMessage(msgId) {
    const { customHTMLEnabled, message } = this;
    if (customHTMLEnabled) {
      return h("div", { class: "loading-content", id: msgId, innerHTML: sanitizeDOMString(message) });
    }
    return (h("div", { class: "loading-content", id: msgId }, message));
  }
  render() {
    const { message, spinner, htmlAttributes, overlayIndex } = this;
    const mode = getIonMode(this);
    const msgId = `loading-${overlayIndex}-msg`;
    /**
     * If the message is defined, use that as the label.
     * Otherwise, don't set aria-labelledby.
     */
    const ariaLabelledBy = message !== undefined ? msgId : null;
    return (h(Host, Object.assign({ role: "dialog", "aria-modal": "true", "aria-labelledby": ariaLabelledBy, tabindex: "-1" }, htmlAttributes, { style: {
        zIndex: `${40000 + this.overlayIndex}`,
      }, onIonBackdropTap: this.onBackdropTap, class: Object.assign(Object.assign({}, getClassMap(this.cssClass)), { [mode]: true, 'overlay-hidden': true, 'loading-translucent': this.translucent }) }), h("ion-backdrop", { visible: this.showBackdrop, tappable: this.backdropDismiss }), h("div", { tabindex: "0" }), h("div", { class: "loading-wrapper ion-overlay-wrapper" }, spinner && (h("div", { class: "loading-spinner" }, h("ion-spinner", { name: spinner, "aria-hidden": "true" }))), message !== undefined && this.renderLoadingMessage(msgId)), h("div", { tabindex: "0" })));
  }
  static get is() { return "ion-loading"; }
  static get encapsulation() { return "scoped"; }
  static get originalStyleUrls() {
    return {
      "ios": ["loading.ios.scss"],
      "md": ["loading.md.scss"]
    };
  }
  static get styleUrls() {
    return {
      "ios": ["loading.ios.css"],
      "md": ["loading.md.css"]
    };
  }
  static get properties() {
    return {
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
          "text": "Animation to use when the loading indicator is presented."
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
          "text": "Animation to use when the loading indicator is dismissed."
        }
      },
      "message": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string | IonicSafeString",
          "resolved": "IonicSafeString | string | undefined",
          "references": {
            "IonicSafeString": {
              "location": "import",
              "path": "../../utils/sanitization"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Optional text content to display in the loading indicator.\n\nThis property accepts custom HTML as a string.\nDevelopers who only want to pass plain text\ncan disable the custom HTML functionality\nby setting `innerHTMLTemplatesEnabled: false` in the Ionic config."
        },
        "attribute": "message",
        "reflect": false
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
          "tags": [],
          "text": "Additional classes to apply for custom CSS. If multiple classes are\nprovided they should be separated by spaces."
        },
        "attribute": "css-class",
        "reflect": false
      },
      "duration": {
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
          "text": "Number of milliseconds to wait before dismissing the loading indicator."
        },
        "attribute": "duration",
        "reflect": false,
        "defaultValue": "0"
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
          "text": "If `true`, the loading indicator will be dismissed when the backdrop is clicked."
        },
        "attribute": "backdrop-dismiss",
        "reflect": false,
        "defaultValue": "false"
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
          "text": "If `true`, a backdrop will be displayed behind the loading indicator."
        },
        "attribute": "show-backdrop",
        "reflect": false,
        "defaultValue": "true"
      },
      "spinner": {
        "type": "string",
        "mutable": true,
        "complexType": {
          "original": "SpinnerTypes | null",
          "resolved": "\"bubbles\" | \"circles\" | \"circular\" | \"crescent\" | \"dots\" | \"lines\" | \"lines-sharp\" | \"lines-sharp-small\" | \"lines-small\" | null | undefined",
          "references": {
            "SpinnerTypes": {
              "location": "import",
              "path": "../../interface"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "The name of the spinner to display."
        },
        "attribute": "spinner",
        "reflect": false
      },
      "translucent": {
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
          "text": "If `true`, the loading indicator will be translucent.\nOnly applies when the mode is `\"ios\"` and the device supports\n[`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility)."
        },
        "attribute": "translucent",
        "reflect": false,
        "defaultValue": "false"
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
          "text": "If `true`, the loading indicator will animate."
        },
        "attribute": "animated",
        "reflect": false,
        "defaultValue": "true"
      },
      "htmlAttributes": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "LoadingAttributes",
          "resolved": "undefined | { [key: string]: any; }",
          "references": {
            "LoadingAttributes": {
              "location": "import",
              "path": "../../interface"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Additional attributes to pass to the loader."
        }
      }
    };
  }
  static get events() {
    return [{
        "method": "didPresent",
        "name": "ionLoadingDidPresent",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted after the loading has presented."
        },
        "complexType": {
          "original": "void",
          "resolved": "void",
          "references": {}
        }
      }, {
        "method": "willPresent",
        "name": "ionLoadingWillPresent",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted before the loading has presented."
        },
        "complexType": {
          "original": "void",
          "resolved": "void",
          "references": {}
        }
      }, {
        "method": "willDismiss",
        "name": "ionLoadingWillDismiss",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted before the loading has dismissed."
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
        "name": "ionLoadingDidDismiss",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted after the loading has dismissed."
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
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Present the loading overlay after it has been created.",
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
                  "text": "role The role of the element that is dismissing the loading.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the loading.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`."
                }],
              "text": "The role of the element that is dismissing the loading.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the loading.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`."
            }],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<boolean>"
        },
        "docs": {
          "text": "Dismiss the loading overlay after it has been presented.",
          "tags": [{
              "name": "param",
              "text": "data Any data to emit in the dismiss events."
            }, {
              "name": "param",
              "text": "role The role of the element that is dismissing the loading.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the loading.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`."
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
          "text": "Returns a promise that resolves when the loading did dismiss.",
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
          "text": "Returns a promise that resolves when the loading will dismiss.",
          "tags": []
        }
      }
    };
  }
  static get elementRef() { return "el"; }
}
