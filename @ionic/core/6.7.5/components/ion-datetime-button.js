/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { b as getIonMode } from './ionic-global.js';
import { a as addEventListener, c as componentOnReady } from './helpers.js';
import { p as printIonError } from './index7.js';
import { c as createColorClasses } from './theme.js';
import { q as parseDate, t as getToday, J as is24Hour, S as getLocalizedDateTime, F as getMonthAndYear, K as getLocalizedTime, T as getMonthDayAndYear } from './data.js';
import { d as defineCustomElement$2 } from './ripple-effect.js';

const iosDatetimeButtonCss = ":host{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}:host button{border-radius:8px;padding-left:12px;padding-right:12px;padding-top:6px;padding-bottom:6px;margin-left:2px;margin-right:2px;margin-top:0px;margin-bottom:0px;position:relative;-webkit-transition:150ms color ease-in-out;transition:150ms color ease-in-out;border:none;background:var(--ion-color-step-300, #edeef0);color:var(--ion-text-color, #000);font-family:inherit;font-size:inherit;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;overflow:hidden}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host button{padding-left:unset;padding-right:unset;-webkit-padding-start:12px;padding-inline-start:12px;-webkit-padding-end:12px;padding-inline-end:12px}}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host button{margin-left:unset;margin-right:unset;-webkit-margin-start:2px;margin-inline-start:2px;-webkit-margin-end:2px;margin-inline-end:2px}}:host(.time-active) #time-button,:host(.date-active) #date-button{color:var(--ion-color-base)}:host(.datetime-button-disabled){pointer-events:none}:host(.datetime-button-disabled) button{opacity:0.4}";

const mdDatetimeButtonCss = ":host{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}:host button{border-radius:8px;padding-left:12px;padding-right:12px;padding-top:6px;padding-bottom:6px;margin-left:2px;margin-right:2px;margin-top:0px;margin-bottom:0px;position:relative;-webkit-transition:150ms color ease-in-out;transition:150ms color ease-in-out;border:none;background:var(--ion-color-step-300, #edeef0);color:var(--ion-text-color, #000);font-family:inherit;font-size:inherit;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;overflow:hidden}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host button{padding-left:unset;padding-right:unset;-webkit-padding-start:12px;padding-inline-start:12px;-webkit-padding-end:12px;padding-inline-end:12px}}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host button{margin-left:unset;margin-right:unset;-webkit-margin-start:2px;margin-inline-start:2px;-webkit-margin-end:2px;margin-inline-end:2px}}:host(.time-active) #time-button,:host(.date-active) #date-button{color:var(--ion-color-base)}:host(.datetime-button-disabled){pointer-events:none}:host(.datetime-button-disabled) button{opacity:0.4}";

const DatetimeButton = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.datetimeEl = null;
    this.overlayEl = null;
    this.datetimePresentation = 'date-time';
    this.datetimeActive = false;
    /**
     * The color to use from your application's color palette.
     * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
     * For more information on colors, see [theming](/docs/theming/basics).
     */
    this.color = 'primary';
    /**
     * If `true`, the user cannot interact with the button.
     */
    this.disabled = false;
    /**
     * Accepts one or more string values and converts
     * them to DatetimeParts. This is done so datetime-button
     * can work with an array internally and not need
     * to keep checking if the datetime value is `string` or `string[]`.
     */
    this.getParsedDateValues = (value) => {
      // TODO FW-2646 Remove value === ''
      if (value === '' || value === undefined || value === null) {
        return [];
      }
      if (Array.isArray(value)) {
        return value;
      }
      return [value];
    };
    /**
     * Check the value property on the linked
     * ion-datetime and then format it according
     * to the locale specified on ion-datetime.
     */
    this.setDateTimeText = () => {
      const { datetimeEl, datetimePresentation } = this;
      if (!datetimeEl) {
        return;
      }
      const { value, locale, hourCycle, preferWheel, multiple, titleSelectedDatesFormatter } = datetimeEl;
      const parsedValues = this.getParsedDateValues(value);
      /**
       * Both ion-datetime and ion-datetime-button default
       * to today's date and time if no value is set.
       */
      const parsedDatetimes = parseDate(parsedValues.length > 0 ? parsedValues : [getToday()]);
      /**
       * If developers incorrectly use multiple="true"
       * with non "date" datetimes, then just select
       * the first value so the interface does
       * not appear broken. Datetime will provide a
       * warning in the console.
       */
      const firstParsedDatetime = parsedDatetimes[0];
      const use24Hour = is24Hour(locale, hourCycle);
      // TODO(FW-1865) - Remove once FW-1831 is fixed.
      parsedDatetimes.forEach((parsedDatetime) => {
        parsedDatetime.tzOffset = undefined;
      });
      this.dateText = this.timeText = undefined;
      switch (datetimePresentation) {
        case 'date-time':
        case 'time-date':
          const dateText = getMonthDayAndYear(locale, firstParsedDatetime);
          const timeText = getLocalizedTime(locale, firstParsedDatetime, use24Hour);
          if (preferWheel) {
            this.dateText = `${dateText} ${timeText}`;
          }
          else {
            this.dateText = dateText;
            this.timeText = timeText;
          }
          break;
        case 'date':
          if (multiple && parsedValues.length !== 1) {
            let headerText = `${parsedValues.length} days`; // default/fallback for multiple selection
            if (titleSelectedDatesFormatter !== undefined) {
              try {
                headerText = titleSelectedDatesFormatter(parsedValues);
              }
              catch (e) {
                printIonError('Exception in provided `titleSelectedDatesFormatter`: ', e);
              }
            }
            this.dateText = headerText;
          }
          else {
            this.dateText = getMonthDayAndYear(locale, firstParsedDatetime);
          }
          break;
        case 'time':
          this.timeText = getLocalizedTime(locale, firstParsedDatetime, use24Hour);
          break;
        case 'month-year':
          this.dateText = getMonthAndYear(locale, firstParsedDatetime);
          break;
        case 'month':
          this.dateText = getLocalizedDateTime(locale, firstParsedDatetime, { month: 'long' });
          break;
        case 'year':
          this.dateText = getLocalizedDateTime(locale, firstParsedDatetime, { year: 'numeric' });
          break;
      }
    };
    /**
     * Waits for the ion-datetime to re-render.
     * This is needed in order to correctly position
     * a popover relative to the trigger element.
     */
    this.waitForDatetimeChanges = async () => {
      const { datetimeEl } = this;
      if (!datetimeEl) {
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        addEventListener(datetimeEl, 'ionRender', resolve, { once: true });
      });
    };
    this.handleDateClick = async (ev) => {
      const { datetimeEl, datetimePresentation } = this;
      if (!datetimeEl) {
        return;
      }
      let needsPresentationChange = false;
      /**
       * When clicking the date button,
       * we need to make sure that only a date
       * picker is displayed. For presentation styles
       * that display content other than a date picker,
       * we need to update the presentation style.
       */
      switch (datetimePresentation) {
        case 'date-time':
        case 'time-date':
          const needsChange = datetimeEl.presentation !== 'date';
          /**
           * The date+time wheel picker
           * shows date and time together,
           * so do not adjust the presentation
           * in that case.
           */
          if (!datetimeEl.preferWheel && needsChange) {
            datetimeEl.presentation = 'date';
            needsPresentationChange = true;
          }
          break;
      }
      /**
       * Track which button was clicked
       * so that it can have the correct
       * activated styles applied when
       * the modal/popover containing
       * the datetime is opened.
       */
      this.selectedButton = 'date';
      this.presentOverlay(ev, needsPresentationChange, this.dateTargetEl);
    };
    this.handleTimeClick = (ev) => {
      const { datetimeEl, datetimePresentation } = this;
      if (!datetimeEl) {
        return;
      }
      let needsPresentationChange = false;
      /**
       * When clicking the time button,
       * we need to make sure that only a time
       * picker is displayed. For presentation styles
       * that display content other than a time picker,
       * we need to update the presentation style.
       */
      switch (datetimePresentation) {
        case 'date-time':
        case 'time-date':
          const needsChange = datetimeEl.presentation !== 'time';
          if (needsChange) {
            datetimeEl.presentation = 'time';
            needsPresentationChange = true;
          }
          break;
      }
      /**
       * Track which button was clicked
       * so that it can have the correct
       * activated styles applied when
       * the modal/popover containing
       * the datetime is opened.
       */
      this.selectedButton = 'time';
      this.presentOverlay(ev, needsPresentationChange, this.timeTargetEl);
    };
    /**
     * If the datetime is presented in an
     * overlay, the datetime and overlay
     * should be appropriately sized.
     * These classes provide default sizing values
     * that developers can customize.
     * The goal is to provide an overlay that is
     * reasonably sized with a datetime that
     * fills the entire container.
     */
    this.presentOverlay = async (ev, needsPresentationChange, triggerEl) => {
      const { overlayEl } = this;
      if (!overlayEl) {
        return;
      }
      if (overlayEl.tagName === 'ION-POPOVER') {
        /**
         * When the presentation on datetime changes,
         * we need to wait for the component to re-render
         * otherwise the computed width/height of the
         * popover content will be wrong, causing
         * the popover to not align with the trigger element.
         */
        if (needsPresentationChange) {
          await this.waitForDatetimeChanges();
        }
        /**
         * We pass the trigger button element
         * so that the popover aligns with the individual
         * button that was clicked, not the component container.
         */
        overlayEl.present(Object.assign(Object.assign({}, ev), { detail: {
            ionShadowTarget: triggerEl,
          } }));
      }
      else {
        overlayEl.present();
      }
    };
  }
  async componentWillLoad() {
    const { datetime } = this;
    if (!datetime) {
      printIonError('An ID associated with an ion-datetime instance is required for ion-datetime-button to function properly.', this.el);
      return;
    }
    const datetimeEl = (this.datetimeEl = document.getElementById(datetime));
    if (!datetimeEl) {
      printIonError(`No ion-datetime instance found for ID '${datetime}'.`, this.el);
      return;
    }
    /**
     * Since the datetime can be used in any context (overlays, accordion, etc)
     * we track when it is visible to determine when it is active.
     * This informs which button is highlighted as well as the
     * aria-expanded state.
     */
    const io = new IntersectionObserver((entries) => {
      const ev = entries[0];
      this.datetimeActive = ev.isIntersecting;
    }, {
      threshold: 0.01,
    });
    io.observe(datetimeEl);
    /**
     * Get a reference to any modal/popover
     * the datetime is being used in so we can
     * correctly size it when it is presented.
     */
    const overlayEl = (this.overlayEl = datetimeEl.closest('ion-modal, ion-popover'));
    /**
     * The .ion-datetime-button-overlay class contains
     * styles that allow any modal/popover to be
     * sized according to the dimensions of the datetime.
     * If developers want a smaller/larger overlay all they need
     * to do is change the width/height of the datetime.
     * Additionally, this lets us avoid having to set
     * explicit widths on each variant of datetime.
     */
    if (overlayEl) {
      overlayEl.classList.add('ion-datetime-button-overlay');
    }
    componentOnReady(datetimeEl, () => {
      const datetimePresentation = (this.datetimePresentation = datetimeEl.presentation || 'date-time');
      /**
       * Set the initial display
       * in the rendered buttons.
       *
       * From there, we need to listen
       * for ionChange to be emitted
       * from datetime so we know when
       * to re-render the displayed
       * text in the buttons.
       */
      this.setDateTimeText();
      addEventListener(datetimeEl, 'ionChange', this.setDateTimeText);
      /**
       * Configure the initial selected button
       * in the event that the datetime is displayed
       * without clicking one of the datetime buttons.
       * For example, a datetime could be expanded
       * in an accordion. In this case users only
       * need to click the accordion header to show
       * the datetime.
       */
      switch (datetimePresentation) {
        case 'date-time':
        case 'date':
        case 'month-year':
        case 'month':
        case 'year':
          this.selectedButton = 'date';
          break;
        case 'time-date':
        case 'time':
          this.selectedButton = 'time';
          break;
      }
    });
  }
  render() {
    const { color, dateText, timeText, selectedButton, datetimeActive, disabled } = this;
    const mode = getIonMode(this);
    return (h(Host, { class: createColorClasses(color, {
        [mode]: true,
        [`${selectedButton}-active`]: datetimeActive,
        ['datetime-button-disabled']: disabled,
      }) }, dateText && (h("button", { class: "ion-activatable", id: "date-button", "aria-expanded": datetimeActive ? 'true' : 'false', onClick: this.handleDateClick, disabled: disabled, part: "native", ref: (el) => (this.dateTargetEl = el) }, h("slot", { name: "date-target" }, dateText), mode === 'md' && h("ion-ripple-effect", null))), timeText && (h("button", { class: "ion-activatable", id: "time-button", "aria-expanded": datetimeActive ? 'true' : 'false', onClick: this.handleTimeClick, disabled: disabled, part: "native", ref: (el) => (this.timeTargetEl = el) }, h("slot", { name: "time-target" }, timeText), mode === 'md' && h("ion-ripple-effect", null)))));
  }
  get el() { return this; }
  static get style() { return {
    ios: iosDatetimeButtonCss,
    md: mdDatetimeButtonCss
  }; }
}, [33, "ion-datetime-button", {
    "color": [513],
    "disabled": [516],
    "datetime": [1],
    "datetimePresentation": [32],
    "dateText": [32],
    "timeText": [32],
    "datetimeActive": [32],
    "selectedButton": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["ion-datetime-button", "ion-ripple-effect"];
  components.forEach(tagName => { switch (tagName) {
    case "ion-datetime-button":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, DatetimeButton);
      }
      break;
    case "ion-ripple-effect":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const IonDatetimeButton = DatetimeButton;
const defineCustomElement = defineCustomElement$1;

export { IonDatetimeButton, defineCustomElement };
