/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, createEvent, Build, writeTask, h, Host } from '@stencil/core/internal/client';
import { b as getIonMode } from './ionic-global.js';
import { j as debounceEvent, i as inheritAriaAttributes, d as inheritAttributes, k as findItemLabel } from './helpers.js';
import { c as createColorClasses } from './theme.js';

const textareaIosCss = ".sc-ion-textarea-ios-h{--background:initial;--color:initial;--placeholder-color:initial;--placeholder-font-style:initial;--placeholder-font-weight:initial;--placeholder-opacity:0.5;--padding-top:0;--padding-end:0;--padding-bottom:0;--padding-start:0;--border-radius:0;display:block;position:relative;-ms-flex:1;flex:1;width:100%;background:var(--background);color:var(--color);font-family:var(--ion-font-family, inherit);white-space:pre-wrap;z-index:2;-webkit-box-sizing:border-box;box-sizing:border-box}.ion-color.sc-ion-textarea-ios-h{background:initial}.ion-color.sc-ion-textarea-ios-h{color:var(--ion-color-base)}ion-item.sc-ion-textarea-ios-h,ion-item .sc-ion-textarea-ios-h{-ms-flex-item-align:baseline;align-self:baseline}ion-item.sc-ion-textarea-ios-h:not(.item-label),ion-item:not(.item-label) .sc-ion-textarea-ios-h{--padding-start:0}.textarea-wrapper.sc-ion-textarea-ios{display:grid;min-width:inherit;max-width:inherit;min-height:inherit;max-height:inherit}.textarea-wrapper.sc-ion-textarea-ios::after{white-space:pre-wrap;content:attr(data-replicated-value) \" \";visibility:hidden}.native-textarea.sc-ion-textarea-ios,.textarea-wrapper.sc-ion-textarea-ios::after{padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;grid-area:1/1/2/2;word-break:break-word}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.native-textarea.sc-ion-textarea-ios,.textarea-wrapper.sc-ion-textarea-ios::after{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}.native-textarea.sc-ion-textarea-ios{border-radius:var(--border-radius);margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;display:block;width:100%;max-width:100%;max-height:100%;border:0;outline:none;background:transparent;-webkit-box-sizing:border-box;box-sizing:border-box;resize:none;-webkit-appearance:none;-moz-appearance:none;appearance:none}.native-textarea.sc-ion-textarea-ios::-webkit-input-placeholder{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-textarea.sc-ion-textarea-ios::-moz-placeholder{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-textarea.sc-ion-textarea-ios:-ms-input-placeholder{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-textarea.sc-ion-textarea-ios::-ms-input-placeholder{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-textarea.sc-ion-textarea-ios::placeholder{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-textarea[disabled].sc-ion-textarea-ios:not(.cloned-input){opacity:0.4}.cloned-input.sc-ion-textarea-ios{left:0;top:0;position:absolute;pointer-events:none}[dir=rtl].sc-ion-textarea-ios .cloned-input.sc-ion-textarea-ios,[dir=rtl].sc-ion-textarea-ios-h .cloned-input.sc-ion-textarea-ios,[dir=rtl] .sc-ion-textarea-ios-h .cloned-input.sc-ion-textarea-ios{left:unset;right:unset;right:0}.cloned-input.sc-ion-textarea-ios:disabled{opacity:1}[auto-grow=true].sc-ion-textarea-ios-h .cloned-input.sc-ion-textarea-ios{height:100%}.item-label-floating.item-has-placeholder.sc-ion-textarea-ios-h:not(.item-has-value),.item-label-floating.item-has-placeholder:not(.item-has-value) .sc-ion-textarea-ios-h{opacity:0}.item-label-floating.item-has-placeholder.sc-ion-textarea-ios-h:not(.item-has-value).item-has-focus,.item-label-floating.item-has-placeholder:not(.item-has-value).item-has-focus .sc-ion-textarea-ios-h{-webkit-transition:opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);transition:opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);opacity:1}[auto-grow=true].sc-ion-textarea-ios-h .native-textarea.sc-ion-textarea-ios{overflow:hidden}.sc-ion-textarea-ios-h{--padding-top:10px;--padding-end:10px;--padding-bottom:10px;--padding-start:0;font-size:inherit}.item-label-stacked.sc-ion-textarea-ios-h,.item-label-stacked .sc-ion-textarea-ios-h,.item-label-floating.sc-ion-textarea-ios-h,.item-label-floating .sc-ion-textarea-ios-h{--padding-top:8px;--padding-bottom:8px;--padding-start:0px}";

const textareaMdCss = ".sc-ion-textarea-md-h{--background:initial;--color:initial;--placeholder-color:initial;--placeholder-font-style:initial;--placeholder-font-weight:initial;--placeholder-opacity:0.5;--padding-top:0;--padding-end:0;--padding-bottom:0;--padding-start:0;--border-radius:0;display:block;position:relative;-ms-flex:1;flex:1;width:100%;background:var(--background);color:var(--color);font-family:var(--ion-font-family, inherit);white-space:pre-wrap;z-index:2;-webkit-box-sizing:border-box;box-sizing:border-box}.ion-color.sc-ion-textarea-md-h{background:initial}.ion-color.sc-ion-textarea-md-h{color:var(--ion-color-base)}ion-item.sc-ion-textarea-md-h,ion-item .sc-ion-textarea-md-h{-ms-flex-item-align:baseline;align-self:baseline}ion-item.sc-ion-textarea-md-h:not(.item-label),ion-item:not(.item-label) .sc-ion-textarea-md-h{--padding-start:0}.textarea-wrapper.sc-ion-textarea-md{display:grid;min-width:inherit;max-width:inherit;min-height:inherit;max-height:inherit}.textarea-wrapper.sc-ion-textarea-md::after{white-space:pre-wrap;content:attr(data-replicated-value) \" \";visibility:hidden}.native-textarea.sc-ion-textarea-md,.textarea-wrapper.sc-ion-textarea-md::after{padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;grid-area:1/1/2/2;word-break:break-word}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.native-textarea.sc-ion-textarea-md,.textarea-wrapper.sc-ion-textarea-md::after{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}.native-textarea.sc-ion-textarea-md{border-radius:var(--border-radius);margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;display:block;width:100%;max-width:100%;max-height:100%;border:0;outline:none;background:transparent;-webkit-box-sizing:border-box;box-sizing:border-box;resize:none;-webkit-appearance:none;-moz-appearance:none;appearance:none}.native-textarea.sc-ion-textarea-md::-webkit-input-placeholder{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-textarea.sc-ion-textarea-md::-moz-placeholder{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-textarea.sc-ion-textarea-md:-ms-input-placeholder{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-textarea.sc-ion-textarea-md::-ms-input-placeholder{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-textarea.sc-ion-textarea-md::placeholder{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-textarea[disabled].sc-ion-textarea-md:not(.cloned-input){opacity:0.4}.cloned-input.sc-ion-textarea-md{left:0;top:0;position:absolute;pointer-events:none}[dir=rtl].sc-ion-textarea-md .cloned-input.sc-ion-textarea-md,[dir=rtl].sc-ion-textarea-md-h .cloned-input.sc-ion-textarea-md,[dir=rtl] .sc-ion-textarea-md-h .cloned-input.sc-ion-textarea-md{left:unset;right:unset;right:0}.cloned-input.sc-ion-textarea-md:disabled{opacity:1}[auto-grow=true].sc-ion-textarea-md-h .cloned-input.sc-ion-textarea-md{height:100%}.item-label-floating.item-has-placeholder.sc-ion-textarea-md-h:not(.item-has-value),.item-label-floating.item-has-placeholder:not(.item-has-value) .sc-ion-textarea-md-h{opacity:0}.item-label-floating.item-has-placeholder.sc-ion-textarea-md-h:not(.item-has-value).item-has-focus,.item-label-floating.item-has-placeholder:not(.item-has-value).item-has-focus .sc-ion-textarea-md-h{-webkit-transition:opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);transition:opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);opacity:1}[auto-grow=true].sc-ion-textarea-md-h .native-textarea.sc-ion-textarea-md{overflow:hidden}.sc-ion-textarea-md-h{--padding-top:10px;--padding-end:0;--padding-bottom:11px;--padding-start:8px;margin-left:0;margin-right:0;margin-top:8px;margin-bottom:0;font-size:inherit}.item-label-stacked.sc-ion-textarea-md-h,.item-label-stacked .sc-ion-textarea-md-h,.item-label-floating.sc-ion-textarea-md-h,.item-label-floating .sc-ion-textarea-md-h{--padding-top:8px;--padding-bottom:8px;--padding-start:0}";

const Textarea = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.ionChange = createEvent(this, "ionChange", 7);
    this.ionInput = createEvent(this, "ionInput", 7);
    this.ionStyle = createEvent(this, "ionStyle", 7);
    this.ionBlur = createEvent(this, "ionBlur", 7);
    this.ionFocus = createEvent(this, "ionFocus", 7);
    this.inputId = `ion-textarea-${textareaIds++}`;
    this.didBlurAfterEdit = false;
    this.inheritedAttributes = {};
    /**
     * This is required for a WebKit bug which requires us to
     * blur and focus an input to properly focus the input in
     * an item with delegatesFocus. It will no longer be needed
     * with iOS 14.
     *
     * @internal
     */
    this.fireFocusEvents = true;
    this.hasFocus = false;
    /**
     * Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user.
     * Available options: `"off"`, `"none"`, `"on"`, `"sentences"`, `"words"`, `"characters"`.
     */
    this.autocapitalize = 'none';
    /**
     * This Boolean attribute lets you specify that a form control should have input focus when the page loads.
     */
    this.autofocus = false;
    /**
     * If `true`, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.
     */
    this.clearOnEdit = false;
    /**
     * Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke. This also impacts form bindings such as `ngModel` or `v-model`.
     */
    this.debounce = 0;
    /**
     * If `true`, the user cannot interact with the textarea.
     */
    this.disabled = false;
    /**
     * The name of the control, which is submitted with the form data.
     */
    this.name = this.inputId;
    /**
     * If `true`, the user cannot modify the value.
     */
    this.readonly = false;
    /**
     * If `true`, the user must fill in a value before submitting a form.
     */
    this.required = false;
    /**
     * If `true`, the element will have its spelling and grammar checked.
     */
    this.spellcheck = false;
    /**
     * If `true`, the textarea container will grow and shrink based
     * on the contents of the textarea.
     */
    this.autoGrow = false;
    /**
     * The value of the textarea.
     */
    this.value = '';
    this.onInput = (ev) => {
      if (this.nativeInput) {
        this.value = this.nativeInput.value;
      }
      this.emitStyle();
      this.ionInput.emit(ev);
    };
    this.onFocus = (ev) => {
      this.hasFocus = true;
      this.focusChange();
      if (this.fireFocusEvents) {
        this.ionFocus.emit(ev);
      }
    };
    this.onBlur = (ev) => {
      this.hasFocus = false;
      this.focusChange();
      if (this.fireFocusEvents) {
        this.ionBlur.emit(ev);
      }
    };
    this.onKeyDown = () => {
      this.checkClearOnEdit();
    };
  }
  debounceChanged() {
    this.ionChange = debounceEvent(this.ionChange, this.debounce);
  }
  disabledChanged() {
    this.emitStyle();
  }
  /**
   * Update the native input element when the value changes
   */
  valueChanged() {
    const nativeInput = this.nativeInput;
    const value = this.getValue();
    if (nativeInput && nativeInput.value !== value) {
      nativeInput.value = value;
    }
    this.runAutoGrow();
    this.emitStyle();
    this.ionChange.emit({ value });
  }
  connectedCallback() {
    this.emitStyle();
    this.debounceChanged();
    if (Build.isBrowser) {
      document.dispatchEvent(new CustomEvent('ionInputDidLoad', {
        detail: this.el,
      }));
    }
  }
  disconnectedCallback() {
    if (Build.isBrowser) {
      document.dispatchEvent(new CustomEvent('ionInputDidUnload', {
        detail: this.el,
      }));
    }
  }
  componentWillLoad() {
    this.inheritedAttributes = Object.assign(Object.assign({}, inheritAriaAttributes(this.el)), inheritAttributes(this.el, ['data-form-type', 'title', 'tabindex']));
  }
  componentDidLoad() {
    this.runAutoGrow();
  }
  /**
   * Sets focus on the native `textarea` in `ion-textarea`. Use this method instead of the global
   * `textarea.focus()`.
   */
  async setFocus() {
    if (this.nativeInput) {
      this.nativeInput.focus();
    }
  }
  /**
   * Sets blur on the native `textarea` in `ion-textarea`. Use this method instead of the global
   * `textarea.blur()`.
   * @internal
   */
  async setBlur() {
    if (this.nativeInput) {
      this.nativeInput.blur();
    }
  }
  /**
   * Returns the native `<textarea>` element used under the hood.
   */
  getInputElement() {
    return Promise.resolve(this.nativeInput);
  }
  emitStyle() {
    this.ionStyle.emit({
      interactive: true,
      textarea: true,
      input: true,
      'interactive-disabled': this.disabled,
      'has-placeholder': this.placeholder !== undefined,
      'has-value': this.hasValue(),
      'has-focus': this.hasFocus,
    });
  }
  runAutoGrow() {
    if (this.nativeInput && this.autoGrow) {
      writeTask(() => {
        var _a;
        if (this.textareaWrapper) {
          // Replicated value is an attribute to be used in the stylesheet
          // to set the inner contents of a pseudo element.
          this.textareaWrapper.dataset.replicatedValue = (_a = this.value) !== null && _a !== void 0 ? _a : '';
        }
      });
    }
  }
  /**
   * Check if we need to clear the text input if clearOnEdit is enabled
   */
  checkClearOnEdit() {
    if (!this.clearOnEdit) {
      return;
    }
    // Did the input value change after it was blurred and edited?
    if (this.didBlurAfterEdit && this.hasValue()) {
      // Clear the input
      this.value = '';
    }
    // Reset the flag
    this.didBlurAfterEdit = false;
  }
  focusChange() {
    // If clearOnEdit is enabled and the input blurred but has a value, set a flag
    if (this.clearOnEdit && !this.hasFocus && this.hasValue()) {
      this.didBlurAfterEdit = true;
    }
    this.emitStyle();
  }
  hasValue() {
    return this.getValue() !== '';
  }
  getValue() {
    return this.value || '';
  }
  render() {
    const mode = getIonMode(this);
    const value = this.getValue();
    const labelId = this.inputId + '-lbl';
    const label = findItemLabel(this.el);
    if (label) {
      label.id = labelId;
    }
    return (h(Host, { "aria-disabled": this.disabled ? 'true' : null, class: createColorClasses(this.color, {
        [mode]: true,
      }) }, h("div", { class: "textarea-wrapper", ref: (el) => (this.textareaWrapper = el) }, h("textarea", Object.assign({ class: "native-textarea", "aria-labelledby": label ? labelId : null, ref: (el) => (this.nativeInput = el), autoCapitalize: this.autocapitalize, autoFocus: this.autofocus, enterKeyHint: this.enterkeyhint, inputMode: this.inputmode, disabled: this.disabled, maxLength: this.maxlength, minLength: this.minlength, name: this.name, placeholder: this.placeholder || '', readOnly: this.readonly, required: this.required, spellcheck: this.spellcheck, cols: this.cols, rows: this.rows, wrap: this.wrap, onInput: this.onInput, onBlur: this.onBlur, onFocus: this.onFocus, onKeyDown: this.onKeyDown }, this.inheritedAttributes), value))));
  }
  get el() { return this; }
  static get watchers() { return {
    "debounce": ["debounceChanged"],
    "disabled": ["disabledChanged"],
    "value": ["valueChanged"]
  }; }
  static get style() { return {
    ios: textareaIosCss,
    md: textareaMdCss
  }; }
}, [34, "ion-textarea", {
    "fireFocusEvents": [4, "fire-focus-events"],
    "color": [513],
    "autocapitalize": [1],
    "autofocus": [4],
    "clearOnEdit": [1028, "clear-on-edit"],
    "debounce": [2],
    "disabled": [4],
    "inputmode": [1],
    "enterkeyhint": [1],
    "maxlength": [2],
    "minlength": [2],
    "name": [1],
    "placeholder": [1],
    "readonly": [4],
    "required": [4],
    "spellcheck": [4],
    "cols": [2],
    "rows": [2],
    "wrap": [1],
    "autoGrow": [516, "auto-grow"],
    "value": [1025],
    "hasFocus": [32],
    "setFocus": [64],
    "setBlur": [64],
    "getInputElement": [64]
  }]);
let textareaIds = 0;
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["ion-textarea"];
  components.forEach(tagName => { switch (tagName) {
    case "ion-textarea":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, Textarea);
      }
      break;
  } });
}

const IonTextarea = Textarea;
const defineCustomElement = defineCustomElement$1;

export { IonTextarea, defineCustomElement };
