/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from '@stencil/core';
import { arrowDown, caretBackSharp } from 'ionicons/icons';
import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { ENABLE_HTML_CONTENT_DEFAULT } from '../../utils/config';
import { isPlatform } from '../../utils/platform';
import { sanitizeDOMString } from '../../utils/sanitization';
import { SPINNERS } from '../spinner/spinner-configs';
export class RefresherContent {
  constructor() {
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
  static get is() { return "ion-refresher-content"; }
  static get properties() {
    return {
      "pullingIcon": {
        "type": "string",
        "mutable": true,
        "complexType": {
          "original": "SpinnerTypes | string | null",
          "resolved": "null | string | undefined",
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
          "text": "A static icon or a spinner to display when you begin to pull down.\nA spinner name can be provided to gradually show tick marks\nwhen pulling down on iOS devices."
        },
        "attribute": "pulling-icon",
        "reflect": false
      },
      "pullingText": {
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
          "text": "The text you want to display when you begin to pull down.\n`pullingText` can accept either plaintext or HTML as a string.\nTo display characters normally reserved for HTML, they\nmust be escaped. For example `<Ionic>` would become\n`&lt;Ionic&gt;`\n\nFor more information: [Security Documentation](https://ionicframework.com/docs/faq/security)\n\nThis property accepts custom HTML as a string.\nDevelopers who only want to pass plain text\ncan disable the custom HTML functionality\nby setting `innerHTMLTemplatesEnabled: false` in the Ionic config."
        },
        "attribute": "pulling-text",
        "reflect": false
      },
      "refreshingSpinner": {
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
          "text": "An animated SVG spinner that shows when refreshing begins"
        },
        "attribute": "refreshing-spinner",
        "reflect": false
      },
      "refreshingText": {
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
          "text": "The text you want to display when performing a refresh.\n`refreshingText` can accept either plaintext or HTML as a string.\nTo display characters normally reserved for HTML, they\nmust be escaped. For example `<Ionic>` would become\n`&lt;Ionic&gt;`\n\nFor more information: [Security Documentation](https://ionicframework.com/docs/faq/security)\n\nThis property accepts custom HTML as a string.\nDevelopers who only want to pass plain text\ncan disable the custom HTML functionality\nby setting `innerHTMLTemplatesEnabled: false` in the Ionic config."
        },
        "attribute": "refreshing-text",
        "reflect": false
      }
    };
  }
  static get elementRef() { return "el"; }
}
