/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { h, Host } from '@stencil/core';
import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { ENABLE_HTML_CONTENT_DEFAULT } from '../../utils/config';
import { printIonWarning } from '../../utils/logging';
import { dismiss, eventMethod, isCancel, prepareOverlay, present, safeCall } from '../../utils/overlays';
import { sanitizeDOMString } from '../../utils/sanitization';
import { createColorClasses, getClassMap } from '../../utils/theme';
import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';
// TODO(FW-2832): types
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part button - Any button element that is displayed inside of the toast.
 * @part container - The element that wraps all child elements.
 * @part header - The header text of the toast.
 * @part message - The body text of the toast.
 * @part icon - The icon that appears next to the toast content.
 */
export class Toast {
  constructor() {
    this.customHTMLEnabled = config.get('innerHTMLTemplatesEnabled', ENABLE_HTML_CONTENT_DEFAULT);
    this.presented = false;
    /**
     * How many milliseconds to wait before hiding the toast. By default, it will show
     * until `dismiss()` is called.
     */
    this.duration = config.getNumber('toastDuration', 0);
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
      if (isCancel(role)) {
        const cancelButton = this.getButtons().find((b) => b.role === 'cancel');
        this.callButtonHandler(cancelButton);
      }
    };
  }
  connectedCallback() {
    prepareOverlay(this.el);
  }
  /**
   * Present the toast overlay after it has been created.
   */
  async present() {
    await present(this, 'toastEnter', iosEnterAnimation, mdEnterAnimation, this.position);
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
    return dismiss(this, data, role, 'toastLeave', iosLeaveAnimation, mdLeaveAnimation, this.position);
  }
  /**
   * Returns a promise that resolves when the toast did dismiss.
   */
  onDidDismiss() {
    return eventMethod(this.el, 'ionToastDidDismiss');
  }
  /**
   * Returns a promise that resolves when the toast will dismiss.
   */
  onWillDismiss() {
    return eventMethod(this.el, 'ionToastWillDismiss');
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
    if (isCancel(role)) {
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
        const rtn = await safeCall(button.handler);
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
    const mode = getIonMode(this);
    const buttonGroupsClasses = {
      'toast-button-group': true,
      [`toast-button-group-${side}`]: true,
    };
    return (h("div", { class: buttonGroupsClasses }, buttons.map((b) => (h("button", { type: "button", class: buttonClass(b), tabIndex: 0, onClick: () => this.buttonClick(b), part: "button" }, h("div", { class: "toast-button-inner" }, b.icon && (h("ion-icon", { icon: b.icon, slot: b.text === undefined ? 'icon-only' : undefined, class: "toast-button-icon" })), b.text), mode === 'md' && (h("ion-ripple-effect", { type: b.icon !== undefined && b.text === undefined ? 'unbounded' : 'bounded' })))))));
  }
  renderToastMessage() {
    const { customHTMLEnabled, message } = this;
    if (customHTMLEnabled) {
      return h("div", { class: "toast-message", part: "message", innerHTML: sanitizeDOMString(message) });
    }
    return (h("div", { class: "toast-message", part: "message" }, message));
  }
  render() {
    const { layout, el } = this;
    const allButtons = this.getButtons();
    const startButtons = allButtons.filter((b) => b.side === 'start');
    const endButtons = allButtons.filter((b) => b.side !== 'start');
    const mode = getIonMode(this);
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
      printIonWarning('This toast is using start and end buttons with the stacked toast layout. We recommend following the best practice of using either start or end buttons with the stacked toast layout.', el);
    }
    return (h(Host, Object.assign({ "aria-live": "polite", "aria-atomic": "true", role: role, tabindex: "-1" }, this.htmlAttributes, { style: {
        zIndex: `${60000 + this.overlayIndex}`,
      }, class: createColorClasses(this.color, Object.assign(Object.assign({ [mode]: true }, getClassMap(this.cssClass)), { 'overlay-hidden': true, 'toast-translucent': this.translucent })), onIonToastWillDismiss: this.dispatchCancelHandler }), h("div", { class: wrapperClass }, h("div", { class: "toast-container", part: "container" }, this.renderButtons(startButtons, 'start'), this.icon !== undefined && (h("ion-icon", { class: "toast-icon", part: "icon", icon: this.icon, lazy: false, "aria-hidden": "true" })), h("div", { class: "toast-content" }, this.header !== undefined && (h("div", { class: "toast-header", part: "header" }, this.header)), this.message !== undefined && this.renderToastMessage()), this.renderButtons(endButtons, 'end')))));
  }
  static get is() { return "ion-toast"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "ios": ["toast.ios.scss"],
      "md": ["toast.md.scss"]
    };
  }
  static get styleUrls() {
    return {
      "ios": ["toast.ios.css"],
      "md": ["toast.md.css"]
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
          "text": "Animation to use when the toast is presented."
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
          "text": "Animation to use when the toast is dismissed."
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
          "text": "How many milliseconds to wait before hiding the toast. By default, it will show\nuntil `dismiss()` is called."
        },
        "attribute": "duration",
        "reflect": false,
        "defaultValue": "config.getNumber('toastDuration', 0)"
      },
      "header": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Header to be shown in the toast."
        },
        "attribute": "header",
        "reflect": false
      },
      "layout": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "ToastLayout",
          "resolved": "\"baseline\" | \"stacked\"",
          "references": {
            "ToastLayout": {
              "location": "import",
              "path": "./toast-interface"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Defines how the message and buttons are laid out in the toast.\n'baseline': The message and the buttons will appear on the same line.\nMessage text may wrap within the message container.\n'stacked': The buttons containers and message will stack on top\nof each other. Use this if you have long text in your buttons."
        },
        "attribute": "layout",
        "reflect": false,
        "defaultValue": "'baseline'"
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
          "text": "Message to be shown in the toast.\nThis property accepts custom HTML as a string.\nDevelopers who only want to pass plain text\ncan disable the custom HTML functionality\nby setting `innerHTMLTemplatesEnabled: false` in the Ionic config."
        },
        "attribute": "message",
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
        "defaultValue": "false"
      },
      "position": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "ToastPosition",
          "resolved": "\"bottom\" | \"middle\" | \"top\"",
          "references": {
            "ToastPosition": {
              "location": "import",
              "path": "./toast-interface"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "The position of the toast on the screen."
        },
        "attribute": "position",
        "reflect": false,
        "defaultValue": "'bottom'"
      },
      "buttons": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "(ToastButton | string)[]",
          "resolved": "(string | ToastButton)[] | undefined",
          "references": {
            "ToastButton": {
              "location": "import",
              "path": "../../interface"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "An array of buttons for the toast."
        }
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
          "text": "If `true`, the toast will be translucent.\nOnly applies when the mode is `\"ios\"` and the device supports\n[`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility)."
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
          "text": "If `true`, the toast will animate."
        },
        "attribute": "animated",
        "reflect": false,
        "defaultValue": "true"
      },
      "icon": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "The name of the icon to display, or the path to a valid SVG file. See `ion-icon`.\nhttps://ionic.io/ionicons"
        },
        "attribute": "icon",
        "reflect": false
      },
      "htmlAttributes": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "ToastAttributes",
          "resolved": "undefined | { [key: string]: any; }",
          "references": {
            "ToastAttributes": {
              "location": "import",
              "path": "./toast-interface"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Additional attributes to pass to the toast."
        }
      }
    };
  }
  static get events() {
    return [{
        "method": "didPresent",
        "name": "ionToastDidPresent",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted after the toast has presented."
        },
        "complexType": {
          "original": "void",
          "resolved": "void",
          "references": {}
        }
      }, {
        "method": "willPresent",
        "name": "ionToastWillPresent",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted before the toast has presented."
        },
        "complexType": {
          "original": "void",
          "resolved": "void",
          "references": {}
        }
      }, {
        "method": "willDismiss",
        "name": "ionToastWillDismiss",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted before the toast has dismissed."
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
        "name": "ionToastDidDismiss",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted after the toast has dismissed."
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
            "ToastPresentOptions": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Present the toast overlay after it has been created.",
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
                  "text": "role The role of the element that is dismissing the toast.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the toast.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`."
                }],
              "text": "The role of the element that is dismissing the toast.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the toast.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`."
            }],
          "references": {
            "Promise": {
              "location": "global"
            },
            "ToastDismissOptions": {
              "location": "global"
            }
          },
          "return": "Promise<boolean>"
        },
        "docs": {
          "text": "Dismiss the toast overlay after it has been presented.",
          "tags": [{
              "name": "param",
              "text": "data Any data to emit in the dismiss events."
            }, {
              "name": "param",
              "text": "role The role of the element that is dismissing the toast.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the toast.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`."
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
          "text": "Returns a promise that resolves when the toast did dismiss.",
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
          "text": "Returns a promise that resolves when the toast will dismiss.",
          "tags": []
        }
      }
    };
  }
  static get elementRef() { return "el"; }
}
const buttonClass = (button) => {
  return Object.assign({ 'toast-button': true, 'toast-button-icon-only': button.icon !== undefined && button.text === undefined, [`toast-button-${button.role}`]: button.role !== undefined, 'ion-focusable': true, 'ion-activatable': true }, getClassMap(button.cssClass));
};
