/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from '@stencil/core';
import { getIonMode } from '../../global/ionic-global';
import { renderHiddenInput } from '../../utils/helpers';
export class RadioGroup {
  constructor() {
    this.inputId = `ion-rg-${radioGroupIds++}`;
    this.labelId = `${this.inputId}-lbl`;
    /**
     * If `true`, the radios can be deselected.
     */
    this.allowEmptySelection = false;
    /**
     * The name of the control, which is submitted with the form data.
     */
    this.name = this.inputId;
    this.setRadioTabindex = (value) => {
      const radios = this.getRadios();
      // Get the first radio that is not disabled and the checked one
      const first = radios.find((radio) => !radio.disabled);
      const checked = radios.find((radio) => radio.value === value && !radio.disabled);
      if (!first && !checked) {
        return;
      }
      // If an enabled checked radio exists, set it to be the focusable radio
      // otherwise we default to focus the first radio
      const focusable = checked || first;
      for (const radio of radios) {
        const tabindex = radio === focusable ? 0 : -1;
        radio.setButtonTabindex(tabindex);
      }
    };
    this.onClick = (ev) => {
      ev.preventDefault();
      /**
       * The Radio Group component mandates that only one radio button
       * within the group can be selected at any given time. Since `ion-radio`
       * is a shadow DOM component, it cannot natively perform this behavior
       * using the `name` attribute.
       */
      const selectedRadio = ev.target && ev.target.closest('ion-radio');
      if (selectedRadio) {
        const currentValue = this.value;
        const newValue = selectedRadio.value;
        if (newValue !== currentValue) {
          this.value = newValue;
        }
        else if (this.allowEmptySelection) {
          this.value = undefined;
        }
      }
    };
  }
  valueChanged(value) {
    this.setRadioTabindex(value);
    this.ionChange.emit({ value });
  }
  componentDidLoad() {
    this.setRadioTabindex(this.value);
  }
  async connectedCallback() {
    // Get the list header if it exists and set the id
    // this is used to set aria-labelledby
    const header = this.el.querySelector('ion-list-header') || this.el.querySelector('ion-item-divider');
    if (header) {
      const label = (this.label = header.querySelector('ion-label'));
      if (label) {
        this.labelId = label.id = this.name + '-lbl';
      }
    }
  }
  getRadios() {
    return Array.from(this.el.querySelectorAll('ion-radio'));
  }
  onKeydown(ev) {
    // TODO(FW-2832): type
    const inSelectPopover = !!this.el.closest('ion-select-popover');
    if (ev.target && !this.el.contains(ev.target)) {
      return;
    }
    // Get all radios inside of the radio group and then
    // filter out disabled radios since we need to skip those
    const radios = this.getRadios().filter((radio) => !radio.disabled);
    // Only move the radio if the current focus is in the radio group
    if (ev.target && radios.includes(ev.target)) {
      const index = radios.findIndex((radio) => radio === ev.target);
      const current = radios[index];
      let next;
      // If hitting arrow down or arrow right, move to the next radio
      // If we're on the last radio, move to the first radio
      if (['ArrowDown', 'ArrowRight'].includes(ev.key)) {
        next = index === radios.length - 1 ? radios[0] : radios[index + 1];
      }
      // If hitting arrow up or arrow left, move to the previous radio
      // If we're on the first radio, move to the last radio
      if (['ArrowUp', 'ArrowLeft'].includes(ev.key)) {
        next = index === 0 ? radios[radios.length - 1] : radios[index - 1];
      }
      if (next && radios.includes(next)) {
        next.setFocus(ev);
        if (!inSelectPopover) {
          this.value = next.value;
        }
      }
      // Update the radio group value when a user presses the
      // space bar on top of a selected radio
      if ([' '].includes(ev.key)) {
        this.value = this.allowEmptySelection && this.value !== undefined ? undefined : current.value;
        // Prevent browsers from jumping
        // to the bottom of the screen
        ev.preventDefault();
      }
    }
  }
  render() {
    const { label, labelId, el, name, value } = this;
    const mode = getIonMode(this);
    renderHiddenInput(true, el, name, value, false);
    return h(Host, { role: "radiogroup", "aria-labelledby": label ? labelId : null, onClick: this.onClick, class: mode });
  }
  static get is() { return "ion-radio-group"; }
  static get properties() {
    return {
      "allowEmptySelection": {
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
          "text": "If `true`, the radios can be deselected."
        },
        "attribute": "allow-empty-selection",
        "reflect": false,
        "defaultValue": "false"
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
      "value": {
        "type": "any",
        "mutable": true,
        "complexType": {
          "original": "any | null",
          "resolved": "any",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "the value of the radio group."
        },
        "attribute": "value",
        "reflect": false
      }
    };
  }
  static get events() {
    return [{
        "method": "ionChange",
        "name": "ionChange",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted when the value has changed."
        },
        "complexType": {
          "original": "RadioGroupChangeEventDetail",
          "resolved": "RadioGroupChangeEventDetail<any>",
          "references": {
            "RadioGroupChangeEventDetail": {
              "location": "import",
              "path": "../../interface"
            }
          }
        }
      }];
  }
  static get elementRef() { return "el"; }
  static get watchers() {
    return [{
        "propName": "value",
        "methodName": "valueChanged"
      }];
  }
  static get listeners() {
    return [{
        "name": "keydown",
        "method": "onKeydown",
        "target": "document",
        "capture": false,
        "passive": false
      }];
  }
}
let radioGroupIds = 0;
