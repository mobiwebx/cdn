/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Build, Host, h } from '@stencil/core';
import { getIonMode } from '../../global/ionic-global';
// TODO(FW-2832): types
const SPLIT_PANE_MAIN = 'split-pane-main';
const SPLIT_PANE_SIDE = 'split-pane-side';
const QUERY = {
  xs: '(min-width: 0px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  never: '',
};
export class SplitPane {
  constructor() {
    this.visible = false;
    /**
     * If `true`, the split pane will be hidden.
     */
    this.disabled = false;
    /**
     * When the split-pane should be shown.
     * Can be a CSS media query expression, or a shortcut expression.
     * Can also be a boolean expression.
     */
    this.when = QUERY['lg'];
  }
  visibleChanged(visible) {
    const detail = { visible, isPane: this.isPane.bind(this) };
    this.ionSplitPaneVisible.emit(detail);
  }
  async connectedCallback() {
    // TODO: connectedCallback is fired in CE build
    // before WC is defined. This needs to be fixed in Stencil.
    if (typeof customElements !== 'undefined' && customElements != null) {
      await customElements.whenDefined('ion-split-pane');
    }
    this.styleChildren();
    this.updateState();
  }
  disconnectedCallback() {
    if (this.rmL) {
      this.rmL();
      this.rmL = undefined;
    }
  }
  updateState() {
    if (!Build.isBrowser) {
      return;
    }
    if (this.rmL) {
      this.rmL();
      this.rmL = undefined;
    }
    // Check if the split-pane is disabled
    if (this.disabled) {
      this.visible = false;
      return;
    }
    // When query is a boolean
    const query = this.when;
    if (typeof query === 'boolean') {
      this.visible = query;
      return;
    }
    // When query is a string, let's find first if it is a shortcut
    const mediaQuery = QUERY[query] || query;
    // Media query is empty or null, we hide it
    if (mediaQuery.length === 0) {
      this.visible = false;
      return;
    }
    if (window.matchMedia) {
      // Listen on media query
      const callback = (q) => {
        this.visible = q.matches;
      };
      const mediaList = window.matchMedia(mediaQuery);
      mediaList.addListener(callback);
      this.rmL = () => mediaList.removeListener(callback);
      this.visible = mediaList.matches;
    }
  }
  isPane(element) {
    if (!this.visible) {
      return false;
    }
    return element.parentElement === this.el && element.classList.contains(SPLIT_PANE_SIDE);
  }
  styleChildren() {
    if (!Build.isBrowser) {
      return;
    }
    const contentId = this.contentId;
    const children = this.el.children;
    const nu = this.el.childElementCount;
    let foundMain = false;
    for (let i = 0; i < nu; i++) {
      const child = children[i];
      const isMain = contentId !== undefined && child.id === contentId;
      if (isMain) {
        if (foundMain) {
          console.warn('split pane cannot have more than one main node');
          return;
        }
        foundMain = true;
      }
      setPaneClass(child, isMain);
    }
    if (!foundMain) {
      console.warn('split pane does not have a specified main node');
    }
  }
  render() {
    const mode = getIonMode(this);
    return (h(Host, { class: {
        [mode]: true,
        // Used internally for styling
        [`split-pane-${mode}`]: true,
        'split-pane-visible': this.visible,
      } }, h("slot", null)));
  }
  static get is() { return "ion-split-pane"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "ios": ["split-pane.ios.scss"],
      "md": ["split-pane.md.scss"]
    };
  }
  static get styleUrls() {
    return {
      "ios": ["split-pane.ios.css"],
      "md": ["split-pane.md.css"]
    };
  }
  static get properties() {
    return {
      "contentId": {
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
          "text": "The `id` of the main content. When using\na router this is typically `ion-router-outlet`.\nWhen not using a router, this is typically\nyour main view's `ion-content`. This is not the\nid of the `ion-content` inside of your `ion-menu`."
        },
        "attribute": "content-id",
        "reflect": true
      },
      "disabled": {
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
          "text": "If `true`, the split pane will be hidden."
        },
        "attribute": "disabled",
        "reflect": false,
        "defaultValue": "false"
      },
      "when": {
        "type": "any",
        "mutable": false,
        "complexType": {
          "original": "string | boolean",
          "resolved": "boolean | string",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "When the split-pane should be shown.\nCan be a CSS media query expression, or a shortcut expression.\nCan also be a boolean expression."
        },
        "attribute": "when",
        "reflect": false,
        "defaultValue": "QUERY['lg']"
      }
    };
  }
  static get states() {
    return {
      "visible": {}
    };
  }
  static get events() {
    return [{
        "method": "ionSplitPaneVisible",
        "name": "ionSplitPaneVisible",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Expression to be called when the split-pane visibility has changed"
        },
        "complexType": {
          "original": "{ visible: boolean }",
          "resolved": "{ visible: boolean; }",
          "references": {}
        }
      }];
  }
  static get elementRef() { return "el"; }
  static get watchers() {
    return [{
        "propName": "visible",
        "methodName": "visibleChanged"
      }, {
        "propName": "disabled",
        "methodName": "updateState"
      }, {
        "propName": "when",
        "methodName": "updateState"
      }];
  }
}
const setPaneClass = (el, isMain) => {
  let toAdd;
  let toRemove;
  if (isMain) {
    toAdd = SPLIT_PANE_MAIN;
    toRemove = SPLIT_PANE_SIDE;
  }
  else {
    toAdd = SPLIT_PANE_SIDE;
    toRemove = SPLIT_PANE_MAIN;
  }
  const classList = el.classList;
  classList.add(toAdd);
  classList.remove(toRemove);
};
