/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from '@stencil/core';
import { getIonMode } from '../../global/ionic-global';
import { addEventListener, getAriaLabel, removeEventListener } from '../../utils/helpers';
import { createColorClasses, hostContext } from '../../utils/theme';
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part container - The container for the radio mark.
 * @part mark - The checkmark or dot used to indicate the checked state.
 */
export class Radio {
  constructor() {
    this.inputId = `ion-rb-${radioButtonIds++}`;
    this.radioGroup = null;
    /**
     * If `true`, the radio is selected.
     */
    this.checked = false;
    /**
     * The tabindex of the radio button.
     * @internal
     */
    this.buttonTabindex = -1;
    /**
     * The name of the control, which is submitted with the form data.
     */
    this.name = this.inputId;
    /**
     * If `true`, the user cannot interact with the radio.
     */
    this.disabled = false;
    this.updateState = () => {
      if (this.radioGroup) {
        this.checked = this.radioGroup.value === this.value;
      }
    };
    this.onClick = () => {
      this.checked = this.nativeInput.checked;
    };
    this.onFocus = () => {
      this.ionFocus.emit();
    };
    this.onBlur = () => {
      this.ionBlur.emit();
    };
  }
  valueChanged() {
    /**
     * The new value of the radio may
     * match the radio group's value,
     * so we see if it should be checked.
     */
    this.updateState();
  }
  /** @internal */
  async setFocus(ev) {
    // TODO(FW-2832): type (using Event triggers a build error due to conflict with Stencil Event import)
    ev.stopPropagation();
    ev.preventDefault();
    this.el.focus();
  }
  /** @internal */
  async setButtonTabindex(value) {
    this.buttonTabindex = value;
  }
  connectedCallback() {
    if (this.value === undefined) {
      this.value = this.inputId;
    }
    const radioGroup = (this.radioGroup = this.el.closest('ion-radio-group'));
    if (radioGroup) {
      this.updateState();
      addEventListener(radioGroup, 'ionChange', this.updateState);
    }
  }
  disconnectedCallback() {
    const radioGroup = this.radioGroup;
    if (radioGroup) {
      removeEventListener(radioGroup, 'ionChange', this.updateState);
      this.radioGroup = null;
    }
  }
  componentWillLoad() {
    this.emitStyle();
  }
  emitStyle() {
    this.ionStyle.emit({
      'radio-checked': this.checked,
      'interactive-disabled': this.disabled,
    });
  }
  render() {
    const { inputId, disabled, checked, color, el, buttonTabindex } = this;
    const mode = getIonMode(this);
    const { label, labelId, labelText } = getAriaLabel(el, inputId);
    return (h(Host, { "aria-checked": `${checked}`, "aria-hidden": disabled ? 'true' : null, "aria-labelledby": label ? labelId : null, role: "radio", tabindex: buttonTabindex, onFocus: this.onFocus, onBlur: this.onBlur, onClick: this.onClick, class: createColorClasses(color, {
        [mode]: true,
        'in-item': hostContext('ion-item', el),
        interactive: true,
        'radio-checked': checked,
        'radio-disabled': disabled,
      }) }, h("div", { class: "radio-icon", part: "container" }, h("div", { class: "radio-inner", part: "mark" }), h("div", { class: "radio-ripple" })), h("label", { htmlFor: inputId }, labelText), h("input", { type: "radio", checked: checked, disabled: disabled, tabindex: "-1", id: inputId, ref: (nativeEl) => (this.nativeInput = nativeEl) })));
  }
  static get is() { return "ion-radio"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "ios": ["radio.ios.scss"],
      "md": ["radio.md.scss"]
    };
  }
  static get styleUrls() {
    return {
      "ios": ["radio.ios.css"],
      "md": ["radio.md.css"]
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
      "name": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "The name of the control, which is submitted with the form data."
        },
        "attribute": "name",
        "reflect": false,
        "defaultValue": "this.inputId"
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
          "text": "If `true`, the user cannot interact with the radio."
        },
        "attribute": "disabled",
        "reflect": false,
        "defaultValue": "false"
      },
      "value": {
        "type": "any",
        "mutable": false,
        "complexType": {
          "original": "any | null",
          "resolved": "any",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "the value of the radio."
        },
        "attribute": "value",
        "reflect": false
      }
    };
  }
  static get states() {
    return {
      "checked": {},
      "buttonTabindex": {}
    };
  }
  static get events() {
    return [{
        "method": "ionStyle",
        "name": "ionStyle",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [{
              "name": "internal",
              "text": undefined
            }],
          "text": "Emitted when the styles change."
        },
        "complexType": {
          "original": "StyleEventDetail",
          "resolved": "StyleEventDetail",
          "references": {
            "StyleEventDetail": {
              "location": "import",
              "path": "../../interface"
            }
          }
        }
      }, {
        "method": "ionFocus",
        "name": "ionFocus",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted when the radio button has focus."
        },
        "complexType": {
          "original": "void",
          "resolved": "void",
          "references": {}
        }
      }, {
        "method": "ionBlur",
        "name": "ionBlur",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted when the radio button loses focus."
        },
        "complexType": {
          "original": "void",
          "resolved": "void",
          "references": {}
        }
      }];
  }
  static get methods() {
    return {
      "setFocus": {
        "complexType": {
          "signature": "(ev: any) => Promise<void>",
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
          "text": "",
          "tags": [{
              "name": "internal",
              "text": undefined
            }]
        }
      },
      "setButtonTabindex": {
        "complexType": {
          "signature": "(value: number) => Promise<void>",
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
          "text": "",
          "tags": [{
              "name": "internal",
              "text": undefined
            }]
        }
      }
    };
  }
  static get elementRef() { return "el"; }
  static get watchers() {
    return [{
        "propName": "value",
        "methodName": "valueChanged"
      }, {
        "propName": "color",
        "methodName": "emitStyle"
      }, {
        "propName": "checked",
        "methodName": "emitStyle"
      }, {
        "propName": "disabled",
        "methodName": "emitStyle"
      }];
  }
}
let radioButtonIds = 0;
