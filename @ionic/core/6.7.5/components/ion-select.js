/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, createEvent, h, Host, forceUpdate } from '@stencil/core/internal/client';
import { b as getIonMode } from './ionic-global.js';
import { f as focusElement, k as findItemLabel, n as getAriaLabel, e as renderHiddenInput } from './helpers.js';
import { c as popoverController, b as actionSheetController, a as alertController } from './overlays.js';
import { h as hostContext } from './theme.js';
import { d as defineCustomElement$g } from './action-sheet.js';
import { d as defineCustomElement$f } from './alert.js';
import { d as defineCustomElement$e } from './backdrop.js';
import { d as defineCustomElement$d } from './checkbox.js';
import { d as defineCustomElement$c } from './icon.js';
import { d as defineCustomElement$b } from './item.js';
import { d as defineCustomElement$a } from './label.js';
import { d as defineCustomElement$9 } from './list.js';
import { d as defineCustomElement$8 } from './list-header.js';
import { d as defineCustomElement$7 } from './note.js';
import { d as defineCustomElement$6 } from './popover.js';
import { d as defineCustomElement$5 } from './radio.js';
import { d as defineCustomElement$4 } from './radio-group.js';
import { d as defineCustomElement$3 } from './ripple-effect.js';
import { d as defineCustomElement$2 } from './select-popover.js';

// TODO(FW-2832): types
const watchForOptions = (containerEl, tagName, onChange) => {
  if (typeof MutationObserver === 'undefined') {
    return;
  }
  const mutation = new MutationObserver((mutationList) => {
    onChange(getSelectedOption(mutationList, tagName));
  });
  mutation.observe(containerEl, {
    childList: true,
    subtree: true,
  });
  return mutation;
};
const getSelectedOption = (mutationList, tagName) => {
  let newOption;
  mutationList.forEach((mut) => {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < mut.addedNodes.length; i++) {
      newOption = findCheckedOption(mut.addedNodes[i], tagName) || newOption;
    }
  });
  return newOption;
};
const findCheckedOption = (el, tagName) => {
  if (el.nodeType !== 1) {
    return undefined;
  }
  const options = el.tagName === tagName.toUpperCase() ? [el] : Array.from(el.querySelectorAll(tagName));
  return options.find((o) => o.value === el.value);
};

const selectIosCss = ":host{--placeholder-color:currentColor;--placeholder-opacity:0.33;padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);display:-ms-flexbox;display:flex;position:relative;-ms-flex-align:center;align-items:center;font-family:var(--ion-font-family, inherit);white-space:nowrap;overflow:hidden;z-index:2}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}:host(.in-item){position:static;max-width:45%}:host(.select-disabled){opacity:0.4;pointer-events:none}:host(.ion-focused) button{border:2px solid #5e9ed6}.select-placeholder{color:var(--placeholder-color);opacity:var(--placeholder-opacity)}label{left:0;top:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;position:absolute;width:100%;height:100%;border:0;background:transparent;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:none;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;opacity:0}[dir=rtl] label,:host-context([dir=rtl]) label{left:unset;right:unset;right:0}label::-moz-focus-inner{border:0}button{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;margin:0;padding:0;border:0;outline:0;clip:rect(0 0 0 0);opacity:0;overflow:hidden;-webkit-appearance:none;-moz-appearance:none}.select-icon{position:relative}.select-text{-ms-flex:1;flex:1;min-width:16px;font-size:inherit;text-overflow:ellipsis;white-space:inherit;overflow:hidden}.select-icon-inner{left:5px;top:50%;margin-top:-2px;position:absolute;width:0;height:0;border-top:5px solid;border-right:5px solid transparent;border-left:5px solid transparent;color:currentColor;pointer-events:none}[dir=rtl] .select-icon-inner,:host-context([dir=rtl]) .select-icon-inner{left:unset;right:unset;right:5px}:host{--padding-top:10px;--padding-end:10px;--padding-bottom:10px;--padding-start:20px}.select-icon{width:12px;height:18px;opacity:0.33}";

const selectMdCss = ":host{--placeholder-color:currentColor;--placeholder-opacity:0.33;padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);display:-ms-flexbox;display:flex;position:relative;-ms-flex-align:center;align-items:center;font-family:var(--ion-font-family, inherit);white-space:nowrap;overflow:hidden;z-index:2}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}:host(.in-item){position:static;max-width:45%}:host(.select-disabled){opacity:0.4;pointer-events:none}:host(.ion-focused) button{border:2px solid #5e9ed6}.select-placeholder{color:var(--placeholder-color);opacity:var(--placeholder-opacity)}label{left:0;top:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;position:absolute;width:100%;height:100%;border:0;background:transparent;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:none;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;opacity:0}[dir=rtl] label,:host-context([dir=rtl]) label{left:unset;right:unset;right:0}label::-moz-focus-inner{border:0}button{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;margin:0;padding:0;border:0;outline:0;clip:rect(0 0 0 0);opacity:0;overflow:hidden;-webkit-appearance:none;-moz-appearance:none}.select-icon{position:relative}.select-text{-ms-flex:1;flex:1;min-width:16px;font-size:inherit;text-overflow:ellipsis;white-space:inherit;overflow:hidden}.select-icon-inner{left:5px;top:50%;margin-top:-2px;position:absolute;width:0;height:0;border-top:5px solid;border-right:5px solid transparent;border-left:5px solid transparent;color:currentColor;pointer-events:none}[dir=rtl] .select-icon-inner,:host-context([dir=rtl]) .select-icon-inner{left:unset;right:unset;right:5px}:host{--padding-top:10px;--padding-end:0;--padding-bottom:10px;--padding-start:16px}.select-icon{width:19px;height:19px;-webkit-transition:-webkit-transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);transition:-webkit-transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);transition:transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);transition:transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);opacity:0.55}:host-context(.item-label-stacked) .select-icon,:host-context(.item-label-floating:not(.item-fill-outline)) .select-icon,:host-context(.item-label-floating.item-fill-outline){-webkit-transform:translate3d(0,  -9px,  0);transform:translate3d(0,  -9px,  0)}:host-context(.item-has-focus) .select-icon{-webkit-transform:rotate(180deg);transform:rotate(180deg)}:host-context(.item-has-focus.item-label-stacked) .select-icon,:host-context(.item-has-focus.item-label-floating:not(.item-fill-outline)) .select-icon{-webkit-transform:translate3d(0,  -9px,  0) rotate(180deg);transform:translate3d(0,  -9px,  0) rotate(180deg)}:host-context(ion-item.ion-focused) .select-icon,:host-context(.item-has-focus) .select-icon{color:var(--highlight-color-focused);opacity:1}";

const Select = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.ionChange = createEvent(this, "ionChange", 7);
    this.ionCancel = createEvent(this, "ionCancel", 7);
    this.ionDismiss = createEvent(this, "ionDismiss", 7);
    this.ionFocus = createEvent(this, "ionFocus", 7);
    this.ionBlur = createEvent(this, "ionBlur", 7);
    this.ionStyle = createEvent(this, "ionStyle", 7);
    this.inputId = `ion-sel-${selectIds++}`;
    this.didInit = false;
    this.isExpanded = false;
    /**
     * If `true`, the user cannot interact with the select.
     */
    this.disabled = false;
    /**
     * The text to display on the cancel button.
     */
    this.cancelText = 'Cancel';
    /**
     * The text to display on the ok button.
     */
    this.okText = 'OK';
    /**
     * The name of the control, which is submitted with the form data.
     */
    this.name = this.inputId;
    /**
     * If `true`, the select can accept multiple values.
     */
    this.multiple = false;
    /**
     * The interface the select should use: `action-sheet`, `popover` or `alert`.
     */
    this.interface = 'alert';
    /**
     * Any additional options that the `alert`, `action-sheet` or `popover` interface
     * can take. See the [ion-alert docs](./alert), the
     * [ion-action-sheet docs](./action-sheet) and the
     * [ion-popover docs](./popover) for the
     * create options for each interface.
     *
     * Note: `interfaceOptions` will not override `inputs` or `buttons` with the `alert` interface.
     */
    this.interfaceOptions = {};
    this.onClick = (ev) => {
      this.setFocus();
      this.open(ev);
    };
    this.onFocus = () => {
      this.ionFocus.emit();
    };
    this.onBlur = () => {
      this.ionBlur.emit();
    };
  }
  styleChanged() {
    this.emitStyle();
  }
  valueChanged() {
    this.emitStyle();
    // TODO: FW-1160 - Remove the `didInit` property when ionChange behavior is changed in v7.
    if (this.didInit) {
      this.ionChange.emit({
        value: this.value,
      });
    }
  }
  async connectedCallback() {
    this.updateOverlayOptions();
    this.emitStyle();
    this.mutationO = watchForOptions(this.el, 'ion-select-option', async () => {
      this.updateOverlayOptions();
      /**
       * We need to re-render the component
       * because one of the new ion-select-option
       * elements may match the value. In this case,
       * the rendered selected text should be updated.
       */
      forceUpdate(this);
    });
  }
  disconnectedCallback() {
    if (this.mutationO) {
      this.mutationO.disconnect();
      this.mutationO = undefined;
    }
  }
  componentDidLoad() {
    this.didInit = true;
  }
  /**
   * Open the select overlay. The overlay is either an alert, action sheet, or popover,
   * depending on the `interface` property on the `ion-select`.
   *
   * @param event The user interface event that called the open.
   */
  async open(event) {
    if (this.disabled || this.isExpanded) {
      return undefined;
    }
    this.isExpanded = true;
    const overlay = (this.overlay = await this.createOverlay(event));
    overlay.onDidDismiss().then(() => {
      this.overlay = undefined;
      this.isExpanded = false;
      this.ionDismiss.emit();
      this.setFocus();
    });
    await overlay.present();
    // focus selected option for popovers
    if (this.interface === 'popover') {
      let indexOfSelected = this.childOpts.map((o) => o.value).indexOf(this.value);
      indexOfSelected = indexOfSelected > -1 ? indexOfSelected : 0; // default to first option if nothing selected
      const selectedItem = overlay.querySelector(`.select-interface-option:nth-child(${indexOfSelected + 1})`);
      if (selectedItem) {
        focusElement(selectedItem);
        /**
         * Browsers such as Firefox do not
         * correctly delegate focus when manually
         * focusing an element with delegatesFocus.
         * We work around this by manually focusing
         * the interactive element.
         * ion-radio and ion-checkbox are the only
         * elements that ion-select-popover uses, so
         * we only need to worry about those two components
         * when focusing.
         */
        const interactiveEl = selectedItem.querySelector('ion-radio, ion-checkbox');
        if (interactiveEl) {
          interactiveEl.focus();
        }
      }
    }
    return overlay;
  }
  createOverlay(ev) {
    let selectInterface = this.interface;
    if (selectInterface === 'action-sheet' && this.multiple) {
      console.warn(`Select interface cannot be "${selectInterface}" with a multi-value select. Using the "alert" interface instead.`);
      selectInterface = 'alert';
    }
    if (selectInterface === 'popover' && !ev) {
      console.warn(`Select interface cannot be a "${selectInterface}" without passing an event. Using the "alert" interface instead.`);
      selectInterface = 'alert';
    }
    if (selectInterface === 'action-sheet') {
      return this.openActionSheet();
    }
    if (selectInterface === 'popover') {
      return this.openPopover(ev);
    }
    return this.openAlert();
  }
  updateOverlayOptions() {
    const overlay = this.overlay;
    if (!overlay) {
      return;
    }
    const childOpts = this.childOpts;
    const value = this.value;
    switch (this.interface) {
      case 'action-sheet':
        overlay.buttons = this.createActionSheetButtons(childOpts, value);
        break;
      case 'popover':
        const popover = overlay.querySelector('ion-select-popover');
        if (popover) {
          popover.options = this.createPopoverOptions(childOpts, value);
        }
        break;
      case 'alert':
        const inputType = this.multiple ? 'checkbox' : 'radio';
        overlay.inputs = this.createAlertInputs(childOpts, inputType, value);
        break;
    }
  }
  createActionSheetButtons(data, selectValue) {
    const actionSheetButtons = data.map((option) => {
      const value = getOptionValue(option);
      // Remove hydrated before copying over classes
      const copyClasses = Array.from(option.classList)
        .filter((cls) => cls !== 'hydrated')
        .join(' ');
      const optClass = `${OPTION_CLASS} ${copyClasses}`;
      return {
        role: isOptionSelected(selectValue, value, this.compareWith) ? 'selected' : '',
        text: option.textContent,
        cssClass: optClass,
        handler: () => {
          this.value = value;
        },
      };
    });
    // Add "cancel" button
    actionSheetButtons.push({
      text: this.cancelText,
      role: 'cancel',
      handler: () => {
        this.ionCancel.emit();
      },
    });
    return actionSheetButtons;
  }
  createAlertInputs(data, inputType, selectValue) {
    const alertInputs = data.map((option) => {
      const value = getOptionValue(option);
      // Remove hydrated before copying over classes
      const copyClasses = Array.from(option.classList)
        .filter((cls) => cls !== 'hydrated')
        .join(' ');
      const optClass = `${OPTION_CLASS} ${copyClasses}`;
      return {
        type: inputType,
        cssClass: optClass,
        label: option.textContent || '',
        value,
        checked: isOptionSelected(selectValue, value, this.compareWith),
        disabled: option.disabled,
      };
    });
    return alertInputs;
  }
  createPopoverOptions(data, selectValue) {
    const popoverOptions = data.map((option) => {
      const value = getOptionValue(option);
      // Remove hydrated before copying over classes
      const copyClasses = Array.from(option.classList)
        .filter((cls) => cls !== 'hydrated')
        .join(' ');
      const optClass = `${OPTION_CLASS} ${copyClasses}`;
      return {
        text: option.textContent || '',
        cssClass: optClass,
        value,
        checked: isOptionSelected(selectValue, value, this.compareWith),
        disabled: option.disabled,
        handler: (selected) => {
          this.value = selected;
          if (!this.multiple) {
            this.close();
          }
        },
      };
    });
    return popoverOptions;
  }
  async openPopover(ev) {
    const interfaceOptions = this.interfaceOptions;
    const mode = getIonMode(this);
    const showBackdrop = mode === 'md' ? false : true;
    const multiple = this.multiple;
    const value = this.value;
    let event = ev;
    let size = 'auto';
    const item = this.el.closest('ion-item');
    // If the select is inside of an item containing a floating
    // or stacked label then the popover should take up the
    // full width of the item when it presents
    if (item && (item.classList.contains('item-label-floating') || item.classList.contains('item-label-stacked'))) {
      event = Object.assign(Object.assign({}, ev), { detail: {
          ionShadowTarget: item,
        } });
      size = 'cover';
    }
    const popoverOpts = Object.assign(Object.assign({ mode,
      event, alignment: 'center', size,
      showBackdrop }, interfaceOptions), { component: 'ion-select-popover', cssClass: ['select-popover', interfaceOptions.cssClass], componentProps: {
        header: interfaceOptions.header,
        subHeader: interfaceOptions.subHeader,
        message: interfaceOptions.message,
        multiple,
        value,
        options: this.createPopoverOptions(this.childOpts, value),
      } });
    return popoverController.create(popoverOpts);
  }
  async openActionSheet() {
    const mode = getIonMode(this);
    const interfaceOptions = this.interfaceOptions;
    const actionSheetOpts = Object.assign(Object.assign({ mode }, interfaceOptions), { buttons: this.createActionSheetButtons(this.childOpts, this.value), cssClass: ['select-action-sheet', interfaceOptions.cssClass] });
    return actionSheetController.create(actionSheetOpts);
  }
  async openAlert() {
    const label = this.getLabel();
    const labelText = label ? label.textContent : null;
    const interfaceOptions = this.interfaceOptions;
    const inputType = this.multiple ? 'checkbox' : 'radio';
    const mode = getIonMode(this);
    const alertOpts = Object.assign(Object.assign({ mode }, interfaceOptions), { header: interfaceOptions.header ? interfaceOptions.header : labelText, inputs: this.createAlertInputs(this.childOpts, inputType, this.value), buttons: [
        {
          text: this.cancelText,
          role: 'cancel',
          handler: () => {
            this.ionCancel.emit();
          },
        },
        {
          text: this.okText,
          handler: (selectedValues) => {
            this.value = selectedValues;
          },
        },
      ], cssClass: [
        'select-alert',
        interfaceOptions.cssClass,
        this.multiple ? 'multiple-select-alert' : 'single-select-alert',
      ] });
    return alertController.create(alertOpts);
  }
  /**
   * Close the select interface.
   */
  close() {
    if (!this.overlay) {
      return Promise.resolve(false);
    }
    return this.overlay.dismiss();
  }
  getLabel() {
    return findItemLabel(this.el);
  }
  hasValue() {
    return this.getText() !== '';
  }
  get childOpts() {
    return Array.from(this.el.querySelectorAll('ion-select-option'));
  }
  getText() {
    const selectedText = this.selectedText;
    if (selectedText != null && selectedText !== '') {
      return selectedText;
    }
    return generateText(this.childOpts, this.value, this.compareWith);
  }
  setFocus() {
    if (this.focusEl) {
      this.focusEl.focus();
    }
  }
  emitStyle() {
    this.ionStyle.emit({
      interactive: true,
      'interactive-disabled': this.disabled,
      select: true,
      'select-disabled': this.disabled,
      'has-placeholder': this.placeholder !== undefined,
      'has-value': this.hasValue(),
      'has-focus': this.isExpanded,
    });
  }
  render() {
    const { disabled, el, inputId, isExpanded, name, placeholder, value } = this;
    const mode = getIonMode(this);
    const { labelText, labelId } = getAriaLabel(el, inputId);
    renderHiddenInput(true, el, name, parseValue(value), disabled);
    const displayValue = this.getText();
    let addPlaceholderClass = false;
    let selectText = displayValue;
    if (selectText === '' && placeholder !== undefined) {
      selectText = placeholder;
      addPlaceholderClass = true;
    }
    const selectTextClasses = {
      'select-text': true,
      'select-placeholder': addPlaceholderClass,
    };
    const textPart = addPlaceholderClass ? 'placeholder' : 'text';
    // If there is a label then we need to concatenate it with the
    // current value (or placeholder) and a comma so it separates
    // nicely when the screen reader announces it, otherwise just
    // announce the value / placeholder
    const displayLabel = labelText !== undefined ? (selectText !== '' ? `${selectText}, ${labelText}` : labelText) : selectText;
    return (h(Host, { onClick: this.onClick, role: "button", "aria-haspopup": "listbox", "aria-disabled": disabled ? 'true' : null, "aria-label": displayLabel, class: {
        [mode]: true,
        'in-item': hostContext('ion-item', el),
        'select-disabled': disabled,
        'select-expanded': isExpanded,
      } }, h("div", { "aria-hidden": "true", class: selectTextClasses, part: textPart }, selectText), h("div", { class: "select-icon", role: "presentation", part: "icon" }, h("div", { class: "select-icon-inner" })), h("label", { id: labelId }, displayLabel), h("button", { type: "button", disabled: disabled, id: inputId, "aria-labelledby": labelId, "aria-haspopup": "listbox", "aria-expanded": `${isExpanded}`, onFocus: this.onFocus, onBlur: this.onBlur, ref: (focusEl) => (this.focusEl = focusEl) })));
  }
  get el() { return this; }
  static get watchers() { return {
    "disabled": ["styleChanged"],
    "placeholder": ["styleChanged"],
    "isExpanded": ["styleChanged"],
    "value": ["valueChanged"]
  }; }
  static get style() { return {
    ios: selectIosCss,
    md: selectMdCss
  }; }
}, [33, "ion-select", {
    "disabled": [4],
    "cancelText": [1, "cancel-text"],
    "okText": [1, "ok-text"],
    "placeholder": [1],
    "name": [1],
    "selectedText": [1, "selected-text"],
    "multiple": [4],
    "interface": [1],
    "interfaceOptions": [8, "interface-options"],
    "compareWith": [1, "compare-with"],
    "value": [1032],
    "isExpanded": [32],
    "open": [64]
  }]);
const isOptionSelected = (currentValue, compareValue, compareWith) => {
  if (currentValue === undefined) {
    return false;
  }
  if (Array.isArray(currentValue)) {
    return currentValue.some((val) => compareOptions(val, compareValue, compareWith));
  }
  else {
    return compareOptions(currentValue, compareValue, compareWith);
  }
};
const getOptionValue = (el) => {
  const value = el.value;
  return value === undefined ? el.textContent || '' : value;
};
const parseValue = (value) => {
  if (value == null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.join(',');
  }
  return value.toString();
};
const compareOptions = (currentValue, compareValue, compareWith) => {
  if (typeof compareWith === 'function') {
    return compareWith(currentValue, compareValue);
  }
  else if (typeof compareWith === 'string') {
    return currentValue[compareWith] === compareValue[compareWith];
  }
  else {
    return Array.isArray(compareValue) ? compareValue.includes(currentValue) : currentValue === compareValue;
  }
};
const generateText = (opts, value, compareWith) => {
  if (value === undefined) {
    return '';
  }
  if (Array.isArray(value)) {
    return value
      .map((v) => textForValue(opts, v, compareWith))
      .filter((opt) => opt !== null)
      .join(', ');
  }
  else {
    return textForValue(opts, value, compareWith) || '';
  }
};
const textForValue = (opts, value, compareWith) => {
  const selectOpt = opts.find((opt) => {
    return compareOptions(value, getOptionValue(opt), compareWith);
  });
  return selectOpt ? selectOpt.textContent : null;
};
let selectIds = 0;
const OPTION_CLASS = 'select-interface-option';
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["ion-select", "ion-action-sheet", "ion-alert", "ion-backdrop", "ion-checkbox", "ion-icon", "ion-item", "ion-label", "ion-list", "ion-list-header", "ion-note", "ion-popover", "ion-radio", "ion-radio-group", "ion-ripple-effect", "ion-select-popover"];
  components.forEach(tagName => { switch (tagName) {
    case "ion-select":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, Select);
      }
      break;
    case "ion-action-sheet":
      if (!customElements.get(tagName)) {
        defineCustomElement$g();
      }
      break;
    case "ion-alert":
      if (!customElements.get(tagName)) {
        defineCustomElement$f();
      }
      break;
    case "ion-backdrop":
      if (!customElements.get(tagName)) {
        defineCustomElement$e();
      }
      break;
    case "ion-checkbox":
      if (!customElements.get(tagName)) {
        defineCustomElement$d();
      }
      break;
    case "ion-icon":
      if (!customElements.get(tagName)) {
        defineCustomElement$c();
      }
      break;
    case "ion-item":
      if (!customElements.get(tagName)) {
        defineCustomElement$b();
      }
      break;
    case "ion-label":
      if (!customElements.get(tagName)) {
        defineCustomElement$a();
      }
      break;
    case "ion-list":
      if (!customElements.get(tagName)) {
        defineCustomElement$9();
      }
      break;
    case "ion-list-header":
      if (!customElements.get(tagName)) {
        defineCustomElement$8();
      }
      break;
    case "ion-note":
      if (!customElements.get(tagName)) {
        defineCustomElement$7();
      }
      break;
    case "ion-popover":
      if (!customElements.get(tagName)) {
        defineCustomElement$6();
      }
      break;
    case "ion-radio":
      if (!customElements.get(tagName)) {
        defineCustomElement$5();
      }
      break;
    case "ion-radio-group":
      if (!customElements.get(tagName)) {
        defineCustomElement$4();
      }
      break;
    case "ion-ripple-effect":
      if (!customElements.get(tagName)) {
        defineCustomElement$3();
      }
      break;
    case "ion-select-popover":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const IonSelect = Select;
const defineCustomElement = defineCustomElement$1;

export { IonSelect, defineCustomElement };
