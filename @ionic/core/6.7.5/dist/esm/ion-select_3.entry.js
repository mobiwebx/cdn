/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { r as registerInstance, e as createEvent, h, H as Host, i as getElement, j as forceUpdate } from './index-8e692445.js';
import { b as getIonMode } from './ionic-global-c74e4951.js';
import { f as focusElement, k as findItemLabel, d as getAriaLabel, e as renderHiddenInput } from './helpers-3b390e48.js';
import { c as popoverController, b as actionSheetController, a as alertController, s as safeCall } from './overlays-58fa8e4d.js';
import { h as hostContext, g as getClassMap } from './theme-7670341c.js';
import './hardware-back-button-490df115.js';

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

const Select = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
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
  get el() { return getElement(this); }
  static get watchers() { return {
    "disabled": ["styleChanged"],
    "placeholder": ["styleChanged"],
    "isExpanded": ["styleChanged"],
    "value": ["valueChanged"]
  }; }
};
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
Select.style = {
  ios: selectIosCss,
  md: selectMdCss
};

const selectOptionCss = ":host{display:none}";

const SelectOption = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.inputId = `ion-selopt-${selectOptionIds++}`;
    /**
     * If `true`, the user cannot interact with the select option. This property does not apply when `interface="action-sheet"` as `ion-action-sheet` does not allow for disabled buttons.
     */
    this.disabled = false;
  }
  render() {
    return h(Host, { role: "option", id: this.inputId, class: getIonMode(this) });
  }
  get el() { return getElement(this); }
};
let selectOptionIds = 0;
SelectOption.style = selectOptionCss;

const selectPopoverIosCss = ".sc-ion-select-popover-ios-h ion-list.sc-ion-select-popover-ios{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}ion-list-header.sc-ion-select-popover-ios,ion-label.sc-ion-select-popover-ios{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}";

const selectPopoverMdCss = ".sc-ion-select-popover-md-h ion-list.sc-ion-select-popover-md{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}ion-list-header.sc-ion-select-popover-md,ion-label.sc-ion-select-popover-md{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}ion-list.sc-ion-select-popover-md ion-radio.sc-ion-select-popover-md{opacity:0}ion-item.sc-ion-select-popover-md{--inner-border-width:0}.item-radio-checked.sc-ion-select-popover-md{--background:rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.08);--background-focused:var(--ion-color-primary, #3880ff);--background-focused-opacity:0.2;--background-hover:var(--ion-color-primary, #3880ff);--background-hover-opacity:0.12}.item-checkbox-checked.sc-ion-select-popover-md{--background-activated:var(--ion-item-color, var(--ion-text-color, #000));--background-focused:var(--ion-item-color, var(--ion-text-color, #000));--background-hover:var(--ion-item-color, var(--ion-text-color, #000));--color:var(--ion-color-primary, #3880ff)}";

const SelectPopover = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    /**
     * An array of options for the popover
     */
    this.options = [];
  }
  onSelect(ev) {
    this.setChecked(ev);
    this.callOptionHandler(ev);
  }
  findOptionFromEvent(ev) {
    const { options } = this;
    return options.find((o) => o.value === ev.target.value);
  }
  /**
   * When an option is selected we need to get the value(s)
   * of the selected option(s) and return it in the option
   * handler
   */
  callOptionHandler(ev) {
    const option = this.findOptionFromEvent(ev);
    const values = this.getValues(ev);
    if (option === null || option === void 0 ? void 0 : option.handler) {
      safeCall(option.handler, values);
    }
  }
  /**
   * This is required when selecting a radio that is already
   * selected because it will not trigger the ionChange event
   * but we still want to close the popover
   */
  rbClick(ev) {
    this.callOptionHandler(ev);
  }
  setChecked(ev) {
    const { multiple } = this;
    const option = this.findOptionFromEvent(ev);
    // this is a popover with checkboxes (multiple value select)
    // we need to set the checked value for this option
    if (multiple && option) {
      option.checked = ev.detail.checked;
    }
  }
  getValues(ev) {
    const { multiple, options } = this;
    if (multiple) {
      // this is a popover with checkboxes (multiple value select)
      // return an array of all the checked values
      return options.filter((o) => o.checked).map((o) => o.value);
    }
    // this is a popover with radio buttons (single value select)
    // return the value that was clicked, otherwise undefined
    const option = this.findOptionFromEvent(ev);
    return option ? option.value : undefined;
  }
  renderOptions(options) {
    const { multiple } = this;
    switch (multiple) {
      case true:
        return this.renderCheckboxOptions(options);
      default:
        return this.renderRadioOptions(options);
    }
  }
  renderCheckboxOptions(options) {
    return options.map((option) => (h("ion-item", { class: getClassMap(option.cssClass) }, h("ion-checkbox", { slot: "start", value: option.value, disabled: option.disabled, checked: option.checked }), h("ion-label", null, option.text))));
  }
  renderRadioOptions(options) {
    const checked = options.filter((o) => o.checked).map((o) => o.value)[0];
    return (h("ion-radio-group", { value: checked }, options.map((option) => (h("ion-item", { class: getClassMap(option.cssClass) }, h("ion-label", null, option.text), h("ion-radio", { value: option.value, disabled: option.disabled, onClick: (ev) => this.rbClick(ev) }))))));
  }
  render() {
    const { header, message, options, subHeader } = this;
    const hasSubHeaderOrMessage = subHeader !== undefined || message !== undefined;
    return (h(Host, { class: getIonMode(this) }, h("ion-list", null, header !== undefined && h("ion-list-header", null, header), hasSubHeaderOrMessage && (h("ion-item", null, h("ion-label", { class: "ion-text-wrap" }, subHeader !== undefined && h("h3", null, subHeader), message !== undefined && h("p", null, message)))), this.renderOptions(options))));
  }
};
SelectPopover.style = {
  ios: selectPopoverIosCss,
  md: selectPopoverMdCss
};

export { Select as ion_select, SelectOption as ion_select_option, SelectPopover as ion_select_popover };
