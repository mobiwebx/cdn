/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from '@stencil/core';
import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { ENABLE_HTML_CONTENT_DEFAULT } from '../../utils/config';
import { sanitizeDOMString } from '../../utils/sanitization';
export class InfiniteScrollContent {
  constructor() {
    this.customHTMLEnabled = config.get('innerHTMLTemplatesEnabled', ENABLE_HTML_CONTENT_DEFAULT);
  }
  componentDidLoad() {
    if (this.loadingSpinner === undefined) {
      const mode = getIonMode(this);
      this.loadingSpinner = config.get('infiniteLoadingSpinner', config.get('spinner', mode === 'ios' ? 'lines' : 'crescent'));
    }
  }
  renderLoadingText() {
    const { customHTMLEnabled, loadingText } = this;
    if (customHTMLEnabled) {
      return h("div", { class: "infinite-loading-text", innerHTML: sanitizeDOMString(loadingText) });
    }
    return h("div", { class: "infinite-loading-text" }, this.loadingText);
  }
  render() {
    const mode = getIonMode(this);
    return (h(Host, { class: {
        [mode]: true,
        // Used internally for styling
        [`infinite-scroll-content-${mode}`]: true,
      } }, h("div", { class: "infinite-loading" }, this.loadingSpinner && (h("div", { class: "infinite-loading-spinner" }, h("ion-spinner", { name: this.loadingSpinner }))), this.loadingText !== undefined && this.renderLoadingText())));
  }
  static get is() { return "ion-infinite-scroll-content"; }
  static get originalStyleUrls() {
    return {
      "ios": ["infinite-scroll-content.ios.scss"],
      "md": ["infinite-scroll-content.md.scss"]
    };
  }
  static get styleUrls() {
    return {
      "ios": ["infinite-scroll-content.ios.css"],
      "md": ["infinite-scroll-content.md.css"]
    };
  }
  static get properties() {
    return {
      "loadingSpinner": {
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
          "text": "An animated SVG spinner that shows while loading."
        },
        "attribute": "loading-spinner",
        "reflect": false
      },
      "loadingText": {
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
          "text": "Optional text to display while loading.\n`loadingText` can accept either plaintext or HTML as a string.\nTo display characters normally reserved for HTML, they\nmust be escaped. For example `<Ionic>` would become\n`&lt;Ionic&gt;`\n\nFor more information: [Security Documentation](https://ionicframework.com/docs/faq/security)\n\nThis property accepts custom HTML as a string.\nDevelopers who only want to pass plain text\ncan disable the custom HTML functionality\nby setting `innerHTMLTemplatesEnabled: false` in the Ionic config."
        },
        "attribute": "loading-text",
        "reflect": false
      }
    };
  }
}
