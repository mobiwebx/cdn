/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h, writeTask } from '@stencil/core';
import { caretDownSharp, caretUpSharp, chevronBack, chevronDown, chevronForward } from 'ionicons/icons';
import { getIonMode } from '../../global/ionic-global';
import { startFocusVisible } from '../../utils/focus-visible';
import { getElementRoot, raf, renderHiddenInput } from '../../utils/helpers';
import { printIonError, printIonWarning } from '../../utils/logging';
import { isRTL } from '../../utils/rtl';
import { createColorClasses } from '../../utils/theme';
import { isSameDay, warnIfValueOutOfBounds, isBefore, isAfter } from './utils/comparison';
import { generateMonths, getDaysOfMonth, getDaysOfWeek, getToday, getMonthColumnData, getDayColumnData, getYearColumnData, getTimeColumnsData, getCombinedDateColumnData, } from './utils/data';
import { formatValue, getLocalizedTime, getMonthAndDay, getMonthAndYear } from './utils/format';
import { is24Hour, isLocaleDayPeriodRTL, isMonthFirstLocale, getNumDaysInMonth } from './utils/helpers';
import { calculateHourFromAMPM, convertDataToISO, getClosestValidDate, getEndOfWeek, getNextDay, getNextMonth, getNextWeek, getNextYear, getPreviousDay, getPreviousMonth, getPreviousWeek, getPreviousYear, getStartOfWeek, validateParts, } from './utils/manipulation';
import { clampDate, convertToArrayOfNumbers, getPartsFromCalendarDay, parseAmPm, parseDate, parseMaxParts, parseMinParts, } from './utils/parse';
import { getCalendarDayState, getHighlightStyles, isDayDisabled, isMonthDisabled, isNextMonthDisabled, isPrevMonthDisabled, } from './utils/state';
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot title - The title of the datetime.
 * @slot buttons - The buttons in the datetime.
 * @slot time-label - The label for the time selector in the datetime.
 */
export class Datetime {
  constructor() {
    this.inputId = `ion-dt-${datetimeIds++}`;
    this.prevPresentation = null;
    /**
     * Duplicate reference to `activeParts` that does not trigger a re-render of the component.
     * Allows caching an instance of the `activeParts` in between render cycles.
     */
    this.activePartsClone = [];
    this.showMonthAndYear = false;
    this.activeParts = [];
    this.workingParts = {
      month: 5,
      day: 28,
      year: 2021,
      hour: 13,
      minute: 52,
      ampm: 'pm',
    };
    this.isPresented = false;
    this.isTimePopoverOpen = false;
    /**
     * The color to use from your application's color palette.
     * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
     * For more information on colors, see [theming](/docs/theming/basics).
     */
    this.color = 'primary';
    /**
     * The name of the control, which is submitted with the form data.
     */
    this.name = this.inputId;
    /**
     * If `true`, the user cannot interact with the datetime.
     */
    this.disabled = false;
    /**
     * If `true`, the datetime appears normal but is not interactive.
     */
    this.readonly = false;
    /**
     * Which values you want to select. `'date'` will show
     * a calendar picker to select the month, day, and year. `'time'`
     * will show a time picker to select the hour, minute, and (optionally)
     * AM/PM. `'date-time'` will show the date picker first and time picker second.
     * `'time-date'` will show the time picker first and date picker second.
     */
    this.presentation = 'date-time';
    /**
     * The text to display on the picker's cancel button.
     */
    this.cancelText = 'Cancel';
    /**
     * The text to display on the picker's "Done" button.
     */
    this.doneText = 'Done';
    /**
     * The text to display on the picker's "Clear" button.
     */
    this.clearText = 'Clear';
    /**
     * The locale to use for `ion-datetime`. This
     * impacts month and day name formatting.
     * The `'default'` value refers to the default
     * locale set by your device.
     */
    this.locale = 'default';
    /**
     * The first day of the week to use for `ion-datetime`. The
     * default value is `0` and represents Sunday.
     */
    this.firstDayOfWeek = 0;
    /**
     * If `true`, multiple dates can be selected at once. Only
     * applies to `presentation="date"` and `preferWheel="false"`.
     */
    this.multiple = false;
    /**
     * If `true`, a header will be shown above the calendar
     * picker. This will include both the slotted title, and
     * the selected date.
     */
    this.showDefaultTitle = false;
    /**
     * If `true`, the default "Cancel" and "OK" buttons
     * will be rendered at the bottom of the `ion-datetime`
     * component. Developers can also use the `button` slot
     * if they want to customize these buttons. If custom
     * buttons are set in the `button` slot then the
     * default buttons will not be rendered.
     */
    this.showDefaultButtons = false;
    /**
     * If `true`, a "Clear" button will be rendered alongside
     * the default "Cancel" and "OK" buttons at the bottom of the `ion-datetime`
     * component. Developers can also use the `button` slot
     * if they want to customize these buttons. If custom
     * buttons are set in the `button` slot then the
     * default buttons will not be rendered.
     */
    this.showClearButton = false;
    /**
     * If `true`, the default "Time" label will be rendered
     * for the time selector of the `ion-datetime` component.
     * Developers can also use the `time-label` slot
     * if they want to customize this label. If a custom
     * label is set in the `time-label` slot then the
     * default label will not be rendered.
     */
    this.showDefaultTimeLabel = true;
    /**
     * If `cover`, the `ion-datetime` will expand to cover the full width of its container.
     * If `fixed`, the `ion-datetime` will have a fixed width.
     */
    this.size = 'fixed';
    /**
     * If `true`, a wheel picker will be rendered instead of a calendar grid
     * where possible. If `false`, a calendar grid will be rendered instead of
     * a wheel picker where possible.
     *
     * A wheel picker can be rendered instead of a grid when `presentation` is
     * one of the following values: `'date'`, `'date-time'`, or `'time-date'`.
     *
     * A wheel picker will always be rendered regardless of
     * the `preferWheel` value when `presentation` is one of the following values:
     * `'time'`, `'month'`, `'month-year'`, or `'year'`.
     */
    this.preferWheel = false;
    /**
     * Returns the DatetimePart interface
     * to use when rendering an initial set of
     * data. This should be used when rendering an
     * interface in an environment where the `value`
     * may not be set. This function works
     * by returning the first selected date in
     * "activePartsClone" and then falling back to
     * defaultParts if no active date is selected.
     */
    this.getActivePartsWithFallback = () => {
      var _a;
      const { defaultParts } = this;
      return (_a = this.getActivePart()) !== null && _a !== void 0 ? _a : defaultParts;
    };
    this.getActivePart = () => {
      const { activePartsClone } = this;
      return Array.isArray(activePartsClone) ? activePartsClone[0] : activePartsClone;
    };
    this.closeParentOverlay = () => {
      const popoverOrModal = this.el.closest('ion-modal, ion-popover');
      if (popoverOrModal) {
        popoverOrModal.dismiss();
      }
    };
    this.setWorkingParts = (parts) => {
      this.workingParts = Object.assign({}, parts);
    };
    this.setActiveParts = (parts, removeDate = false) => {
      const { multiple, minParts, maxParts, activePartsClone } = this;
      /**
       * When setting the active parts, it is possible
       * to set invalid data. For example,
       * when updating January 31 to February,
       * February 31 does not exist. As a result
       * we need to validate the active parts and
       * ensure that we are only setting valid dates.
       * Additionally, we need to update the working parts
       * too in the event that the validated parts are different.
       */
      const validatedParts = validateParts(parts, minParts, maxParts);
      this.setWorkingParts(validatedParts);
      if (multiple) {
        /**
         * We read from activePartsClone here because valueChanged() only updates that,
         * so it's the more reliable source of truth. If we read from activeParts, then
         * if you click July 1, manually set the value to July 2, and then click July 3,
         * the new value would be [July 1, July 3], ignoring the value set.
         *
         * We can then pass the new value to activeParts (rather than activePartsClone)
         * since the clone will be updated automatically by activePartsChanged().
         */
        const activePartsArray = Array.isArray(activePartsClone) ? activePartsClone : [activePartsClone];
        if (removeDate) {
          this.activeParts = activePartsArray.filter((p) => !isSameDay(p, validatedParts));
        }
        else {
          this.activeParts = [...activePartsArray, validatedParts];
        }
      }
      else {
        this.activeParts = Object.assign({}, validatedParts);
      }
      const hasSlottedButtons = this.el.querySelector('[slot="buttons"]') !== null;
      if (hasSlottedButtons || this.showDefaultButtons) {
        return;
      }
      this.confirm();
    };
    this.initializeKeyboardListeners = () => {
      const calendarBodyRef = this.calendarBodyRef;
      if (!calendarBodyRef) {
        return;
      }
      const root = this.el.shadowRoot;
      /**
       * Get a reference to the month
       * element we are currently viewing.
       */
      const currentMonth = calendarBodyRef.querySelector('.calendar-month:nth-of-type(2)');
      /**
       * When focusing the calendar body, we want to pass focus
       * to the working day, but other days should
       * only be accessible using the arrow keys. Pressing
       * Tab should jump between bodies of selectable content.
       */
      const checkCalendarBodyFocus = (ev) => {
        var _a;
        const record = ev[0];
        /**
         * If calendar body was already focused
         * when this fired or if the calendar body
         * if not currently focused, we should not re-focus
         * the inner day.
         */
        if (((_a = record.oldValue) === null || _a === void 0 ? void 0 : _a.includes('ion-focused')) || !calendarBodyRef.classList.contains('ion-focused')) {
          return;
        }
        this.focusWorkingDay(currentMonth);
      };
      const mo = new MutationObserver(checkCalendarBodyFocus);
      mo.observe(calendarBodyRef, { attributeFilter: ['class'], attributeOldValue: true });
      this.destroyKeyboardMO = () => {
        mo === null || mo === void 0 ? void 0 : mo.disconnect();
      };
      /**
       * We must use keydown not keyup as we want
       * to prevent scrolling when using the arrow keys.
       */
      calendarBodyRef.addEventListener('keydown', (ev) => {
        const activeElement = root.activeElement;
        if (!activeElement || !activeElement.classList.contains('calendar-day')) {
          return;
        }
        const parts = getPartsFromCalendarDay(activeElement);
        let partsToFocus;
        switch (ev.key) {
          case 'ArrowDown':
            ev.preventDefault();
            partsToFocus = getNextWeek(parts);
            break;
          case 'ArrowUp':
            ev.preventDefault();
            partsToFocus = getPreviousWeek(parts);
            break;
          case 'ArrowRight':
            ev.preventDefault();
            partsToFocus = getNextDay(parts);
            break;
          case 'ArrowLeft':
            ev.preventDefault();
            partsToFocus = getPreviousDay(parts);
            break;
          case 'Home':
            ev.preventDefault();
            partsToFocus = getStartOfWeek(parts);
            break;
          case 'End':
            ev.preventDefault();
            partsToFocus = getEndOfWeek(parts);
            break;
          case 'PageUp':
            ev.preventDefault();
            partsToFocus = ev.shiftKey ? getPreviousYear(parts) : getPreviousMonth(parts);
            break;
          case 'PageDown':
            ev.preventDefault();
            partsToFocus = ev.shiftKey ? getNextYear(parts) : getNextMonth(parts);
            break;
          /**
           * Do not preventDefault here
           * as we do not want to override other
           * browser defaults such as pressing Enter/Space
           * to select a day.
           */
          default:
            return;
        }
        /**
         * If the day we want to move focus to is
         * disabled, do not do anything.
         */
        if (isDayDisabled(partsToFocus, this.minParts, this.maxParts)) {
          return;
        }
        this.setWorkingParts(Object.assign(Object.assign({}, this.workingParts), partsToFocus));
        /**
         * Give view a chance to re-render
         * then move focus to the new working day
         */
        requestAnimationFrame(() => this.focusWorkingDay(currentMonth));
      });
    };
    this.focusWorkingDay = (currentMonth) => {
      /**
       * Get the number of padding days so
       * we know how much to offset our next selector by
       * to grab the correct calenday-day element.
       */
      const padding = currentMonth.querySelectorAll('.calendar-day-padding');
      const { day } = this.workingParts;
      if (day === null) {
        return;
      }
      /**
       * Get the calendar day element
       * and focus it.
       */
      const dayEl = currentMonth.querySelector(`.calendar-day:nth-of-type(${padding.length + day})`);
      if (dayEl) {
        dayEl.focus();
      }
    };
    this.processMinParts = () => {
      const { min, defaultParts } = this;
      if (min === undefined) {
        this.minParts = undefined;
        return;
      }
      this.minParts = parseMinParts(min, defaultParts);
    };
    this.processMaxParts = () => {
      const { max, defaultParts } = this;
      if (max === undefined) {
        this.maxParts = undefined;
        return;
      }
      this.maxParts = parseMaxParts(max, defaultParts);
    };
    this.initializeCalendarListener = () => {
      const calendarBodyRef = this.calendarBodyRef;
      if (!calendarBodyRef) {
        return;
      }
      /**
       * For performance reasons, we only render 3
       * months at a time: The current month, the previous
       * month, and the next month. We have a scroll listener
       * on the calendar body to append/prepend new months.
       *
       * We can do this because Stencil is smart enough to not
       * re-create the .calendar-month containers, but rather
       * update the content within those containers.
       *
       * As an added bonus, WebKit has some troubles with
       * scroll-snap-stop: always, so not rendering all of
       * the months in a row allows us to mostly sidestep
       * that issue.
       */
      const months = calendarBodyRef.querySelectorAll('.calendar-month');
      const startMonth = months[0];
      const workingMonth = months[1];
      const endMonth = months[2];
      const mode = getIonMode(this);
      const needsiOSRubberBandFix = mode === 'ios' && typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1;
      /**
       * Before setting up the scroll listener,
       * scroll the middle month into view.
       * scrollIntoView() will scroll entire page
       * if element is not in viewport. Use scrollLeft instead.
       */
      writeTask(() => {
        calendarBodyRef.scrollLeft = startMonth.clientWidth * (isRTL(this.el) ? -1 : 1);
        const getChangedMonth = (parts) => {
          const box = calendarBodyRef.getBoundingClientRect();
          const root = this.el.shadowRoot;
          /**
           * Get the element that is in the center of the calendar body.
           * This will be an element inside of the active month.
           */
          const elementAtCenter = root.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
          /**
           * If there is no element then the
           * component may be re-rendering on a slow device.
           */
          if (!elementAtCenter)
            return;
          const month = elementAtCenter.closest('.calendar-month');
          if (!month)
            return;
          /**
           * The edge of the month must be lined up with
           * the edge of the calendar body in order for
           * the component to update. Otherwise, it
           * may be the case that the user has paused their
           * swipe or the browser has not finished snapping yet.
           * Rather than check if the x values are equal,
           * we give it a tolerance of 2px to account for
           * sub pixel rendering.
           */
          const monthBox = month.getBoundingClientRect();
          if (Math.abs(monthBox.x - box.x) > 2)
            return;
          /**
           * From here, we can determine if the start
           * month or the end month was scrolled into view.
           * If no month was changed, then we can return from
           * the scroll callback early.
           */
          if (month === startMonth) {
            return getPreviousMonth(parts);
          }
          else if (month === endMonth) {
            return getNextMonth(parts);
          }
          else {
            return;
          }
        };
        const updateActiveMonth = () => {
          if (needsiOSRubberBandFix) {
            calendarBodyRef.style.removeProperty('pointer-events');
            appliediOSRubberBandFix = false;
          }
          /**
           * If the month did not change
           * then we can return early.
           */
          const newDate = getChangedMonth(this.workingParts);
          if (!newDate)
            return;
          const { month, day, year } = newDate;
          if (isMonthDisabled({ month, year, day: null }, {
            minParts: Object.assign(Object.assign({}, this.minParts), { day: null }),
            maxParts: Object.assign(Object.assign({}, this.maxParts), { day: null }),
          })) {
            return;
          }
          /**
           * Prevent scrolling for other browsers
           * to give the DOM time to update and the container
           * time to properly snap.
           */
          calendarBodyRef.style.setProperty('overflow', 'hidden');
          /**
           * Use a writeTask here to ensure
           * that the state is updated and the
           * correct month is scrolled into view
           * in the same frame. This is not
           * typically a problem on newer devices
           * but older/slower device may have a flicker
           * if we did not do this.
           */
          writeTask(() => {
            this.setWorkingParts(Object.assign(Object.assign({}, this.workingParts), { month, day: day, year }));
            calendarBodyRef.scrollLeft = workingMonth.clientWidth * (isRTL(this.el) ? -1 : 1);
            calendarBodyRef.style.removeProperty('overflow');
          });
        };
        /**
         * When the container finishes scrolling we
         * need to update the DOM with the selected month.
         */
        let scrollTimeout;
        /**
         * We do not want to attempt to set pointer-events
         * multiple times within a single swipe gesture as
         * that adds unnecessary work to the main thread.
         */
        let appliediOSRubberBandFix = false;
        const scrollCallback = () => {
          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
          }
          /**
           * On iOS it is possible to quickly rubber band
           * the scroll area before the scroll timeout has fired.
           * This results in users reaching the end of the scrollable
           * container before the DOM has updated.
           * By setting `pointer-events: none` we can ensure that
           * subsequent swipes do not happen while the container
           * is snapping.
           */
          if (!appliediOSRubberBandFix && needsiOSRubberBandFix) {
            calendarBodyRef.style.setProperty('pointer-events', 'none');
            appliediOSRubberBandFix = true;
          }
          // Wait ~3 frames
          scrollTimeout = setTimeout(updateActiveMonth, 50);
        };
        calendarBodyRef.addEventListener('scroll', scrollCallback);
        this.destroyCalendarListener = () => {
          calendarBodyRef.removeEventListener('scroll', scrollCallback);
        };
      });
    };
    /**
     * Clean up all listeners except for the overlay
     * listener. This is so that we can re-create the listeners
     * if the datetime has been hidden/presented by a modal or popover.
     */
    this.destroyInteractionListeners = () => {
      const { destroyCalendarListener, destroyKeyboardMO } = this;
      if (destroyCalendarListener !== undefined) {
        destroyCalendarListener();
      }
      if (destroyKeyboardMO !== undefined) {
        destroyKeyboardMO();
      }
    };
    this.processValue = (value) => {
      /**
       * TODO FW-2646 remove value !== ''
       */
      const hasValue = value !== '' && value !== null && value !== undefined;
      let valueToProcess = hasValue ? parseDate(value) : this.defaultParts;
      const { minParts, maxParts, multiple } = this;
      if (!multiple && Array.isArray(value)) {
        this.value = value[0];
        valueToProcess = valueToProcess[0];
      }
      /**
       * Datetime should only warn of out of bounds values
       * if set by the user. If the `value` is undefined,
       * we will default to today's date which may be out
       * of bounds. In this case, the warning makes it look
       * like the developer did something wrong which is
       * not true.
       */
      if (hasValue) {
        warnIfValueOutOfBounds(valueToProcess, minParts, maxParts);
      }
      /**
       * If there are multiple values, pick an arbitrary one to clamp to. This way,
       * if the values are across months, we always show at least one of them. Note
       * that the values don't necessarily have to be in order.
       */
      const singleValue = Array.isArray(valueToProcess) ? valueToProcess[0] : valueToProcess;
      const { month, day, year, hour, minute, tzOffset } = clampDate(singleValue, minParts, maxParts);
      const ampm = parseAmPm(hour);
      this.setWorkingParts({
        month,
        day,
        year,
        hour,
        minute,
        tzOffset,
        ampm,
      });
      /**
       * Since `activeParts` indicates a value that
       * been explicitly selected either by the
       * user or the app, only update `activeParts`
       * if the `value` property is set.
       */
      if (hasValue) {
        if (Array.isArray(valueToProcess)) {
          this.activeParts = [...valueToProcess];
        }
        else {
          this.activeParts = {
            month,
            day,
            year,
            hour,
            minute,
            tzOffset,
            ampm,
          };
        }
      }
      else {
        /**
         * Reset the active parts if the value is not set.
         * This will clear the selected calendar day when
         * performing a clear action or using the reset() method.
         */
        this.activeParts = [];
      }
    };
    this.onFocus = () => {
      this.ionFocus.emit();
    };
    this.onBlur = () => {
      this.ionBlur.emit();
    };
    this.hasValue = () => {
      return this.value != null && this.value !== '';
    };
    this.nextMonth = () => {
      const calendarBodyRef = this.calendarBodyRef;
      if (!calendarBodyRef) {
        return;
      }
      const nextMonth = calendarBodyRef.querySelector('.calendar-month:last-of-type');
      if (!nextMonth) {
        return;
      }
      const left = nextMonth.offsetWidth * 2;
      calendarBodyRef.scrollTo({
        top: 0,
        left: left * (isRTL(this.el) ? -1 : 1),
        behavior: 'smooth',
      });
    };
    this.prevMonth = () => {
      const calendarBodyRef = this.calendarBodyRef;
      if (!calendarBodyRef) {
        return;
      }
      const prevMonth = calendarBodyRef.querySelector('.calendar-month:first-of-type');
      if (!prevMonth) {
        return;
      }
      calendarBodyRef.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    };
    this.toggleMonthAndYearView = () => {
      this.showMonthAndYear = !this.showMonthAndYear;
    };
  }
  disabledChanged() {
    this.emitStyle();
  }
  minChanged() {
    this.processMinParts();
  }
  maxChanged() {
    this.processMaxParts();
  }
  yearValuesChanged() {
    this.parsedYearValues = convertToArrayOfNumbers(this.yearValues);
  }
  monthValuesChanged() {
    this.parsedMonthValues = convertToArrayOfNumbers(this.monthValues);
  }
  dayValuesChanged() {
    this.parsedDayValues = convertToArrayOfNumbers(this.dayValues);
  }
  hourValuesChanged() {
    this.parsedHourValues = convertToArrayOfNumbers(this.hourValues);
  }
  minuteValuesChanged() {
    this.parsedMinuteValues = convertToArrayOfNumbers(this.minuteValues);
  }
  activePartsChanged() {
    this.activePartsClone = this.activeParts;
  }
  /**
   * Update the datetime value when the value changes
   */
  valueChanged() {
    const { value, minParts, maxParts, workingParts, multiple } = this;
    if (this.hasValue()) {
      if (!multiple && Array.isArray(value)) {
        this.value = value[0];
        return; // setting this.value will trigger re-run of this function
      }
      /**
       * Clones the value of the `activeParts` to the private clone, to update
       * the date display on the current render cycle without causing another render.
       *
       * This allows us to update the current value's date/time display without
       * refocusing or shifting the user's display (leaves the user in place).
       */
      const valueDateParts = parseDate(value);
      if (valueDateParts) {
        warnIfValueOutOfBounds(valueDateParts, minParts, maxParts);
        if (Array.isArray(valueDateParts)) {
          this.activePartsClone = [...valueDateParts];
        }
        else {
          const { month, day, year, hour, minute } = valueDateParts;
          const ampm = hour != null ? (hour >= 12 ? 'pm' : 'am') : undefined;
          this.activePartsClone = Object.assign(Object.assign({}, this.activeParts), { month,
            day,
            year,
            hour,
            minute,
            ampm });
          /**
           * The working parts am/pm value must be updated when the value changes, to
           * ensure the time picker hour column values are generated correctly.
           *
           * Note that we don't need to do this if valueDateParts is an array, since
           * multiple="true" does not apply to time pickers.
           */
          this.setWorkingParts(Object.assign(Object.assign({}, workingParts), { ampm }));
        }
      }
      else {
        printIonWarning(`Unable to parse date string: ${value}. Please provide a valid ISO 8601 datetime string.`);
      }
    }
    this.emitStyle();
    this.ionChange.emit({ value });
  }
  /**
   * Confirms the selected datetime value, updates the
   * `value` property, and optionally closes the popover
   * or modal that the datetime was presented in.
   */
  async confirm(closeOverlay = false) {
    const { isCalendarPicker, activeParts } = this;
    /**
     * We only update the value if the presentation is not a calendar picker.
     */
    if (activeParts !== undefined || !isCalendarPicker) {
      const activePartsIsArray = Array.isArray(activeParts);
      if (activePartsIsArray && activeParts.length === 0) {
        this.value = undefined;
      }
      else {
        /**
         * Prevent convertDataToISO from doing any
         * kind of transformation based on timezone
         * This cancels out any change it attempts to make
         *
         * Important: Take the timezone offset based on
         * the date that is currently selected, otherwise
         * there can be 1 hr difference when dealing w/ DST
         */
        if (activePartsIsArray) {
          const dates = convertDataToISO(activeParts).map((str) => new Date(str));
          for (let i = 0; i < dates.length; i++) {
            activeParts[i].tzOffset = dates[i].getTimezoneOffset() * -1;
          }
        }
        else {
          const date = new Date(convertDataToISO(activeParts));
          activeParts.tzOffset = date.getTimezoneOffset() * -1;
        }
        this.value = convertDataToISO(activeParts);
      }
    }
    if (closeOverlay) {
      this.closeParentOverlay();
    }
  }
  /**
   * Resets the internal state of the datetime but does not update the value.
   * Passing a valid ISO-8601 string will reset the state of the component to the provided date.
   * If no value is provided, the internal state will be reset to the clamped value of the min, max and today.
   */
  async reset(startDate) {
    this.processValue(startDate);
  }
  /**
   * Emits the ionCancel event and
   * optionally closes the popover
   * or modal that the datetime was
   * presented in.
   */
  async cancel(closeOverlay = false) {
    this.ionCancel.emit();
    if (closeOverlay) {
      this.closeParentOverlay();
    }
  }
  get isCalendarPicker() {
    const { presentation } = this;
    return presentation === 'date' || presentation === 'date-time' || presentation === 'time-date';
  }
  connectedCallback() {
    this.clearFocusVisible = startFocusVisible(this.el).destroy;
  }
  disconnectedCallback() {
    if (this.clearFocusVisible) {
      this.clearFocusVisible();
      this.clearFocusVisible = undefined;
    }
  }
  initializeListeners() {
    this.initializeCalendarListener();
    this.initializeKeyboardListeners();
  }
  componentDidLoad() {
    /**
     * If a scrollable element is hidden using `display: none`,
     * it will not have a scroll height meaning we cannot scroll elements
     * into view. As a result, we will need to wait for the datetime to become
     * visible if used inside of a modal or a popover otherwise the scrollable
     * areas will not have the correct values snapped into place.
     */
    const visibleCallback = (entries) => {
      const ev = entries[0];
      if (!ev.isIntersecting) {
        return;
      }
      this.initializeListeners();
      /**
       * TODO FW-2793: Datetime needs a frame to ensure that it
       * can properly scroll contents into view. As a result
       * we hide the scrollable content until after that frame
       * so users do not see the content quickly shifting. The downside
       * is that the content will pop into view a frame after. Maybe there
       * is a better way to handle this?
       */
      writeTask(() => {
        this.el.classList.add('datetime-ready');
      });
    };
    const visibleIO = new IntersectionObserver(visibleCallback, { threshold: 0.01 });
    /**
     * Use raf to avoid a race condition between the component loading and
     * its display animation starting (such as when shown in a modal). This
     * could cause the datetime to start at a visibility of 0, erroneously
     * triggering the `hiddenIO` observer below.
     */
    raf(() => visibleIO === null || visibleIO === void 0 ? void 0 : visibleIO.observe(this.el));
    /**
     * We need to clean up listeners when the datetime is hidden
     * in a popover/modal so that we can properly scroll containers
     * back into view if they are re-presented. When the datetime is hidden
     * the scroll areas have scroll widths/heights of 0px, so any snapping
     * we did originally has been lost.
     */
    const hiddenCallback = (entries) => {
      const ev = entries[0];
      if (ev.isIntersecting) {
        return;
      }
      this.destroyInteractionListeners();
      /**
       * When datetime is hidden, we need to make sure that
       * the month/year picker is closed. Otherwise,
       * it will be open when the datetime re-appears
       * and the scroll area of the calendar grid will be 0.
       * As a result, the wrong month will be shown.
       */
      this.showMonthAndYear = false;
      writeTask(() => {
        this.el.classList.remove('datetime-ready');
      });
    };
    const hiddenIO = new IntersectionObserver(hiddenCallback, { threshold: 0 });
    raf(() => hiddenIO === null || hiddenIO === void 0 ? void 0 : hiddenIO.observe(this.el));
    /**
     * Datetime uses Ionic components that emit
     * ionFocus and ionBlur. These events are
     * composed meaning they will cross
     * the shadow dom boundary. We need to
     * stop propagation on these events otherwise
     * developers will see 2 ionFocus or 2 ionBlur
     * events at a time.
     */
    const root = getElementRoot(this.el);
    root.addEventListener('ionFocus', (ev) => ev.stopPropagation());
    root.addEventListener('ionBlur', (ev) => ev.stopPropagation());
  }
  /**
   * When the presentation is changed, all calendar content is recreated,
   * so we need to re-init behavior with the new elements.
   */
  componentDidRender() {
    const { presentation, prevPresentation, calendarBodyRef, minParts, preferWheel } = this;
    /**
     * TODO(FW-2165)
     * Remove this when https://bugs.webkit.org/show_bug.cgi?id=235960 is fixed.
     * When using `min`, we add `scroll-snap-align: none`
     * to the disabled month so that users cannot scroll to it.
     * This triggers a bug in WebKit where the scroll position is reset.
     * Since the month change logic is handled by a scroll listener,
     * this causes the month to change leading to `scroll-snap-align`
     * changing again, thus changing the scroll position again and causing
     * an infinite loop.
     * This issue only applies to the calendar grid, so we can disable
     * it if the calendar grid is not being used.
     */
    const hasCalendarGrid = !preferWheel && ['date-time', 'time-date', 'date'].includes(presentation);
    if (minParts !== undefined && hasCalendarGrid && calendarBodyRef) {
      const workingMonth = calendarBodyRef.querySelector('.calendar-month:nth-of-type(1)');
      if (workingMonth) {
        calendarBodyRef.scrollLeft = workingMonth.clientWidth * (isRTL(this.el) ? -1 : 1);
      }
    }
    if (prevPresentation === null) {
      this.prevPresentation = presentation;
      return;
    }
    if (presentation === prevPresentation) {
      return;
    }
    this.prevPresentation = presentation;
    this.destroyInteractionListeners();
    this.initializeListeners();
    /**
     * The month/year picker from the date interface
     * should be closed as it is not available in non-date
     * interfaces.
     */
    this.showMonthAndYear = false;
    raf(() => {
      this.ionRender.emit();
    });
  }
  componentWillLoad() {
    const { el, highlightedDates, multiple, presentation, preferWheel } = this;
    if (multiple) {
      if (presentation !== 'date') {
        printIonWarning('Multiple date selection is only supported for presentation="date".', el);
      }
      if (preferWheel) {
        printIonWarning('Multiple date selection is not supported with preferWheel="true".', el);
      }
    }
    if (highlightedDates !== undefined) {
      if (presentation !== 'date' && presentation !== 'date-time' && presentation !== 'time-date') {
        printIonWarning('The highlightedDates property is only supported with the date, date-time, and time-date presentations.', el);
      }
      if (preferWheel) {
        printIonWarning('The highlightedDates property is not supported with preferWheel="true".', el);
      }
    }
    this.processMinParts();
    this.processMaxParts();
    const hourValues = (this.parsedHourValues = convertToArrayOfNumbers(this.hourValues));
    const minuteValues = (this.parsedMinuteValues = convertToArrayOfNumbers(this.minuteValues));
    const monthValues = (this.parsedMonthValues = convertToArrayOfNumbers(this.monthValues));
    const yearValues = (this.parsedYearValues = convertToArrayOfNumbers(this.yearValues));
    const dayValues = (this.parsedDayValues = convertToArrayOfNumbers(this.dayValues));
    const todayParts = (this.todayParts = parseDate(getToday()));
    this.defaultParts = getClosestValidDate(todayParts, monthValues, dayValues, yearValues, hourValues, minuteValues);
    this.processValue(this.value);
    this.emitStyle();
  }
  emitStyle() {
    this.ionStyle.emit({
      interactive: true,
      datetime: true,
      'interactive-disabled': this.disabled,
    });
  }
  /**
   * Universal render methods
   * These are pieces of datetime that
   * are rendered independently of presentation.
   */
  renderFooter() {
    const { showDefaultButtons, showClearButton } = this;
    const hasSlottedButtons = this.el.querySelector('[slot="buttons"]') !== null;
    if (!hasSlottedButtons && !showDefaultButtons && !showClearButton) {
      return;
    }
    const clearButtonClick = () => {
      this.reset();
      this.value = undefined;
    };
    /**
     * By default we render two buttons:
     * Cancel - Dismisses the datetime and
     * does not update the `value` prop.
     * OK - Dismisses the datetime and
     * updates the `value` prop.
     */
    return (h("div", { class: "datetime-footer" }, h("div", { class: "datetime-buttons" }, h("div", { class: {
        ['datetime-action-buttons']: true,
        ['has-clear-button']: this.showClearButton,
      } }, h("slot", { name: "buttons" }, h("ion-buttons", null, showDefaultButtons && (h("ion-button", { id: "cancel-button", color: this.color, onClick: () => this.cancel(true) }, this.cancelText)), h("div", null, showClearButton && (h("ion-button", { id: "clear-button", color: this.color, onClick: () => clearButtonClick() }, this.clearText)), showDefaultButtons && (h("ion-button", { id: "confirm-button", color: this.color, onClick: () => this.confirm(true) }, this.doneText)))))))));
  }
  /**
   * Wheel picker render methods
   */
  renderWheelPicker(forcePresentation = this.presentation) {
    /**
     * If presentation="time-date" we switch the
     * order of the render array here instead of
     * manually reordering each date/time picker
     * column with CSS. This allows for additional
     * flexibility if we need to render subsets
     * of the date/time data or do additional ordering
     * within the child render functions.
     */
    const renderArray = forcePresentation === 'time-date'
      ? [this.renderTimePickerColumns(forcePresentation), this.renderDatePickerColumns(forcePresentation)]
      : [this.renderDatePickerColumns(forcePresentation), this.renderTimePickerColumns(forcePresentation)];
    return h("ion-picker-internal", null, renderArray);
  }
  renderDatePickerColumns(forcePresentation) {
    return forcePresentation === 'date-time' || forcePresentation === 'time-date'
      ? this.renderCombinedDatePickerColumn()
      : this.renderIndividualDatePickerColumns(forcePresentation);
  }
  renderCombinedDatePickerColumn() {
    const { defaultParts, workingParts, locale, minParts, maxParts, todayParts, isDateEnabled } = this;
    const activePart = this.getActivePartsWithFallback();
    /**
     * By default, generate a range of 3 months:
     * Previous month, current month, and next month
     */
    const monthsToRender = generateMonths(workingParts);
    const lastMonth = monthsToRender[monthsToRender.length - 1];
    /**
     * Ensure that users can select the entire window of dates.
     */
    monthsToRender[0].day = 1;
    lastMonth.day = getNumDaysInMonth(lastMonth.month, lastMonth.year);
    /**
     * Narrow the dates rendered based on min/max dates (if any).
     * The `min` date is used if the min is after the generated min month.
     * The `max` date is used if the max is before the generated max month.
     * This ensures that the sliding window always stays at 3 months
     * but still allows future dates to be lazily rendered based on any min/max
     * constraints.
     */
    const min = minParts !== undefined && isAfter(minParts, monthsToRender[0]) ? minParts : monthsToRender[0];
    const max = maxParts !== undefined && isBefore(maxParts, lastMonth) ? maxParts : lastMonth;
    const result = getCombinedDateColumnData(locale, todayParts, min, max, this.parsedDayValues, this.parsedMonthValues);
    let items = result.items;
    const parts = result.parts;
    if (isDateEnabled) {
      items = items.map((itemObject, index) => {
        const referenceParts = parts[index];
        let disabled;
        try {
          /**
           * The `isDateEnabled` implementation is try-catch wrapped
           * to prevent exceptions in the user's function from
           * interrupting the calendar rendering.
           */
          disabled = !isDateEnabled(convertDataToISO(referenceParts));
        }
        catch (e) {
          printIonError('Exception thrown from provided `isDateEnabled` function. Please check your function and try again.', e);
        }
        return Object.assign(Object.assign({}, itemObject), { disabled });
      });
    }
    /**
     * If we have selected a day already, then default the column
     * to that value. Otherwise, set it to the default date.
     */
    const todayString = workingParts.day !== null
      ? `${workingParts.year}-${workingParts.month}-${workingParts.day}`
      : `${defaultParts.year}-${defaultParts.month}-${defaultParts.day}`;
    return (h("ion-picker-column-internal", { class: "date-column", color: this.color, items: items, value: todayString, onIonChange: (ev) => {
        // TODO(FW-1823) Remove this when iOS 14 support is dropped.
        // Due to a Safari 14 issue we need to destroy
        // the scroll listener before we update state
        // and trigger a re-render.
        if (this.destroyCalendarListener) {
          this.destroyCalendarListener();
        }
        const { value } = ev.detail;
        const findPart = parts.find(({ month, day, year }) => value === `${year}-${month}-${day}`);
        this.setWorkingParts(Object.assign(Object.assign({}, workingParts), findPart));
        this.setActiveParts(Object.assign(Object.assign({}, activePart), findPart));
        // We can re-attach the scroll listener after
        // the working parts have been updated.
        this.initializeCalendarListener();
        ev.stopPropagation();
      } }));
  }
  renderIndividualDatePickerColumns(forcePresentation) {
    const { workingParts, isDateEnabled } = this;
    const shouldRenderMonths = forcePresentation !== 'year' && forcePresentation !== 'time';
    const months = shouldRenderMonths
      ? getMonthColumnData(this.locale, workingParts, this.minParts, this.maxParts, this.parsedMonthValues)
      : [];
    const shouldRenderDays = forcePresentation === 'date';
    let days = shouldRenderDays
      ? getDayColumnData(this.locale, workingParts, this.minParts, this.maxParts, this.parsedDayValues)
      : [];
    if (isDateEnabled) {
      days = days.map((dayObject) => {
        const { value } = dayObject;
        const valueNum = typeof value === 'string' ? parseInt(value) : value;
        const referenceParts = {
          month: workingParts.month,
          day: valueNum,
          year: workingParts.year,
        };
        let disabled;
        try {
          /**
           * The `isDateEnabled` implementation is try-catch wrapped
           * to prevent exceptions in the user's function from
           * interrupting the calendar rendering.
           */
          disabled = !isDateEnabled(convertDataToISO(referenceParts));
        }
        catch (e) {
          printIonError('Exception thrown from provided `isDateEnabled` function. Please check your function and try again.', e);
        }
        return Object.assign(Object.assign({}, dayObject), { disabled });
      });
    }
    const shouldRenderYears = forcePresentation !== 'month' && forcePresentation !== 'time';
    const years = shouldRenderYears
      ? getYearColumnData(this.locale, this.defaultParts, this.minParts, this.maxParts, this.parsedYearValues)
      : [];
    /**
     * Certain locales show the day before the month.
     */
    const showMonthFirst = isMonthFirstLocale(this.locale, { month: 'numeric', day: 'numeric' });
    let renderArray = [];
    if (showMonthFirst) {
      renderArray = [
        this.renderMonthPickerColumn(months),
        this.renderDayPickerColumn(days),
        this.renderYearPickerColumn(years),
      ];
    }
    else {
      renderArray = [
        this.renderDayPickerColumn(days),
        this.renderMonthPickerColumn(months),
        this.renderYearPickerColumn(years),
      ];
    }
    return renderArray;
  }
  renderDayPickerColumn(days) {
    var _a;
    if (days.length === 0) {
      return [];
    }
    const { workingParts } = this;
    const activePart = this.getActivePartsWithFallback();
    return (h("ion-picker-column-internal", { class: "day-column", color: this.color, items: days, value: (_a = (workingParts.day !== null ? workingParts.day : this.defaultParts.day)) !== null && _a !== void 0 ? _a : undefined, onIonChange: (ev) => {
        // TODO(FW-1823) Remove this when iOS 14 support is dropped.
        // Due to a Safari 14 issue we need to destroy
        // the scroll listener before we update state
        // and trigger a re-render.
        if (this.destroyCalendarListener) {
          this.destroyCalendarListener();
        }
        this.setWorkingParts(Object.assign(Object.assign({}, workingParts), { day: ev.detail.value }));
        this.setActiveParts(Object.assign(Object.assign({}, activePart), { day: ev.detail.value }));
        // We can re-attach the scroll listener after
        // the working parts have been updated.
        this.initializeCalendarListener();
        ev.stopPropagation();
      } }));
  }
  renderMonthPickerColumn(months) {
    if (months.length === 0) {
      return [];
    }
    const { workingParts } = this;
    const activePart = this.getActivePartsWithFallback();
    return (h("ion-picker-column-internal", { class: "month-column", color: this.color, items: months, value: workingParts.month, onIonChange: (ev) => {
        // TODO(FW-1823) Remove this when iOS 14 support is dropped.
        // Due to a Safari 14 issue we need to destroy
        // the scroll listener before we update state
        // and trigger a re-render.
        if (this.destroyCalendarListener) {
          this.destroyCalendarListener();
        }
        this.setWorkingParts(Object.assign(Object.assign({}, workingParts), { month: ev.detail.value }));
        this.setActiveParts(Object.assign(Object.assign({}, activePart), { month: ev.detail.value }));
        // We can re-attach the scroll listener after
        // the working parts have been updated.
        this.initializeCalendarListener();
        ev.stopPropagation();
      } }));
  }
  renderYearPickerColumn(years) {
    if (years.length === 0) {
      return [];
    }
    const { workingParts } = this;
    const activePart = this.getActivePartsWithFallback();
    return (h("ion-picker-column-internal", { class: "year-column", color: this.color, items: years, value: workingParts.year, onIonChange: (ev) => {
        // TODO(FW-1823) Remove this when iOS 14 support is dropped.
        // Due to a Safari 14 issue we need to destroy
        // the scroll listener before we update state
        // and trigger a re-render.
        if (this.destroyCalendarListener) {
          this.destroyCalendarListener();
        }
        this.setWorkingParts(Object.assign(Object.assign({}, workingParts), { year: ev.detail.value }));
        this.setActiveParts(Object.assign(Object.assign({}, activePart), { year: ev.detail.value }));
        // We can re-attach the scroll listener after
        // the working parts have been updated.
        this.initializeCalendarListener();
        ev.stopPropagation();
      } }));
  }
  renderTimePickerColumns(forcePresentation) {
    if (['date', 'month', 'month-year', 'year'].includes(forcePresentation)) {
      return [];
    }
    /**
     * If a user has not selected a date,
     * then we should show all times. If the
     * user has selected a date (even if it has
     * not been confirmed yet), we should apply
     * the max and min restrictions so that the
     * time picker shows values that are
     * appropriate for the selected date.
     */
    const activePart = this.getActivePart();
    const userHasSelectedDate = activePart !== undefined;
    const { hoursData, minutesData, dayPeriodData } = getTimeColumnsData(this.locale, this.workingParts, this.hourCycle, userHasSelectedDate ? this.minParts : undefined, userHasSelectedDate ? this.maxParts : undefined, this.parsedHourValues, this.parsedMinuteValues);
    return [
      this.renderHourPickerColumn(hoursData),
      this.renderMinutePickerColumn(minutesData),
      this.renderDayPeriodPickerColumn(dayPeriodData),
    ];
  }
  renderHourPickerColumn(hoursData) {
    const { workingParts } = this;
    if (hoursData.length === 0)
      return [];
    const activePart = this.getActivePartsWithFallback();
    return (h("ion-picker-column-internal", { color: this.color, value: activePart.hour, items: hoursData, numericInput: true, onIonChange: (ev) => {
        this.setWorkingParts(Object.assign(Object.assign({}, workingParts), { hour: ev.detail.value }));
        this.setActiveParts(Object.assign(Object.assign({}, activePart), { hour: ev.detail.value }));
        ev.stopPropagation();
      } }));
  }
  renderMinutePickerColumn(minutesData) {
    const { workingParts } = this;
    if (minutesData.length === 0)
      return [];
    const activePart = this.getActivePartsWithFallback();
    return (h("ion-picker-column-internal", { color: this.color, value: activePart.minute, items: minutesData, numericInput: true, onIonChange: (ev) => {
        this.setWorkingParts(Object.assign(Object.assign({}, workingParts), { minute: ev.detail.value }));
        this.setActiveParts(Object.assign(Object.assign({}, activePart), { minute: ev.detail.value }));
        ev.stopPropagation();
      } }));
  }
  renderDayPeriodPickerColumn(dayPeriodData) {
    const { workingParts } = this;
    if (dayPeriodData.length === 0) {
      return [];
    }
    const activePart = this.getActivePartsWithFallback();
    const isDayPeriodRTL = isLocaleDayPeriodRTL(this.locale);
    return (h("ion-picker-column-internal", { style: isDayPeriodRTL ? { order: '-1' } : {}, color: this.color, value: activePart.ampm, items: dayPeriodData, onIonChange: (ev) => {
        const hour = calculateHourFromAMPM(workingParts, ev.detail.value);
        this.setWorkingParts(Object.assign(Object.assign({}, workingParts), { ampm: ev.detail.value, hour }));
        this.setActiveParts(Object.assign(Object.assign({}, activePart), { ampm: ev.detail.value, hour }));
        ev.stopPropagation();
      } }));
  }
  renderWheelView(forcePresentation) {
    const { locale } = this;
    const showMonthFirst = isMonthFirstLocale(locale);
    const columnOrder = showMonthFirst ? 'month-first' : 'year-first';
    return (h("div", { class: {
        [`wheel-order-${columnOrder}`]: true,
      } }, this.renderWheelPicker(forcePresentation)));
  }
  /**
   * Grid Render Methods
   */
  renderCalendarHeader(mode) {
    const expandedIcon = mode === 'ios' ? chevronDown : caretUpSharp;
    const collapsedIcon = mode === 'ios' ? chevronForward : caretDownSharp;
    const prevMonthDisabled = isPrevMonthDisabled(this.workingParts, this.minParts, this.maxParts);
    const nextMonthDisabled = isNextMonthDisabled(this.workingParts, this.maxParts);
    // don't use the inheritAttributes util because it removes dir from the host, and we still need that
    const hostDir = this.el.getAttribute('dir') || undefined;
    return (h("div", { class: "calendar-header" }, h("div", { class: "calendar-action-buttons" }, h("div", { class: "calendar-month-year" }, h("ion-item", { button: true, detail: false, lines: "none", onClick: () => this.toggleMonthAndYearView() }, h("ion-label", null, getMonthAndYear(this.locale, this.workingParts), h("ion-icon", { "aria-hidden": "true", icon: this.showMonthAndYear ? expandedIcon : collapsedIcon, lazy: false, flipRtl: true })))), h("div", { class: "calendar-next-prev" }, h("ion-buttons", null, h("ion-button", { "aria-label": "previous month", disabled: prevMonthDisabled, onClick: () => this.prevMonth() }, h("ion-icon", { dir: hostDir, "aria-hidden": "true", slot: "icon-only", icon: chevronBack, lazy: false, flipRtl: true })), h("ion-button", { "aria-label": "next month", disabled: nextMonthDisabled, onClick: () => this.nextMonth() }, h("ion-icon", { dir: hostDir, "aria-hidden": "true", slot: "icon-only", icon: chevronForward, lazy: false, flipRtl: true }))))), h("div", { class: "calendar-days-of-week", "aria-hidden": "true" }, getDaysOfWeek(this.locale, mode, this.firstDayOfWeek % 7).map((d) => {
      return h("div", { class: "day-of-week" }, d);
    }))));
  }
  renderMonth(month, year) {
    const yearAllowed = this.parsedYearValues === undefined || this.parsedYearValues.includes(year);
    const monthAllowed = this.parsedMonthValues === undefined || this.parsedMonthValues.includes(month);
    const isCalMonthDisabled = !yearAllowed || !monthAllowed;
    const swipeDisabled = isMonthDisabled({
      month,
      year,
      day: null,
    }, {
      // The day is not used when checking if a month is disabled.
      // Users should be able to access the min or max month, even if the
      // min/max date is out of bounds (e.g. min is set to Feb 15, Feb should not be disabled).
      minParts: Object.assign(Object.assign({}, this.minParts), { day: null }),
      maxParts: Object.assign(Object.assign({}, this.maxParts), { day: null }),
    });
    // The working month should never have swipe disabled.
    // Otherwise the CSS scroll snap will not work and the user
    // can free-scroll the calendar.
    const isWorkingMonth = this.workingParts.month === month && this.workingParts.year === year;
    const activePart = this.getActivePartsWithFallback();
    return (h("div", { "aria-hidden": !isWorkingMonth ? 'true' : null, class: {
        'calendar-month': true,
        // Prevents scroll snap swipe gestures for months outside of the min/max bounds
        'calendar-month-disabled': !isWorkingMonth && swipeDisabled,
      } }, h("div", { class: "calendar-month-grid" }, getDaysOfMonth(month, year, this.firstDayOfWeek % 7).map((dateObject, index) => {
      const { day, dayOfWeek } = dateObject;
      const { el, highlightedDates, isDateEnabled, multiple } = this;
      const referenceParts = { month, day, year };
      const isCalendarPadding = day === null;
      const { isActive, isToday, ariaLabel, ariaSelected, disabled, text } = getCalendarDayState(this.locale, referenceParts, this.activePartsClone, this.todayParts, this.minParts, this.maxParts, this.parsedDayValues);
      const dateIsoString = convertDataToISO(referenceParts);
      let isCalDayDisabled = isCalMonthDisabled || disabled;
      if (!isCalDayDisabled && isDateEnabled !== undefined) {
        try {
          /**
           * The `isDateEnabled` implementation is try-catch wrapped
           * to prevent exceptions in the user's function from
           * interrupting the calendar rendering.
           */
          isCalDayDisabled = !isDateEnabled(dateIsoString);
        }
        catch (e) {
          printIonError('Exception thrown from provided `isDateEnabled` function. Please check your function and try again.', el, e);
        }
      }
      let dateStyle = undefined;
      /**
       * Custom highlight styles should not override the style for selected dates,
       * nor apply to "filler days" at the start of the grid.
       */
      if (highlightedDates !== undefined && !isActive && day !== null) {
        dateStyle = getHighlightStyles(highlightedDates, dateIsoString, el);
      }
      return (h("button", { tabindex: "-1", "data-day": day, "data-month": month, "data-year": year, "data-index": index, "data-day-of-week": dayOfWeek, disabled: isCalDayDisabled, class: {
          'calendar-day-padding': isCalendarPadding,
          'calendar-day': true,
          'calendar-day-active': isActive,
          'calendar-day-today': isToday,
        }, style: dateStyle && {
          color: dateStyle.textColor,
        }, "aria-hidden": isCalendarPadding ? 'true' : null, "aria-selected": ariaSelected, "aria-label": ariaLabel, onClick: () => {
          if (isCalendarPadding) {
            return;
          }
          this.setWorkingParts(Object.assign(Object.assign({}, this.workingParts), { month,
            day,
            year }));
          // multiple only needs date info, so we can wipe out other fields like time
          if (multiple) {
            this.setActiveParts({
              month,
              day,
              year,
            }, isActive);
          }
          else {
            this.setActiveParts(Object.assign(Object.assign({}, activePart), { month,
              day,
              year }));
          }
        } }, h("div", { class: "calendar-day-highlight", style: {
          backgroundColor: dateStyle === null || dateStyle === void 0 ? void 0 : dateStyle.backgroundColor,
        } }), text));
    }))));
  }
  renderCalendarBody() {
    return (h("div", { class: "calendar-body ion-focusable", ref: (el) => (this.calendarBodyRef = el), tabindex: "0" }, generateMonths(this.workingParts).map(({ month, year }) => {
      return this.renderMonth(month, year);
    })));
  }
  renderCalendar(mode) {
    return (h("div", { class: "datetime-calendar", key: "datetime-calendar" }, this.renderCalendarHeader(mode), this.renderCalendarBody()));
  }
  renderTimeLabel() {
    const hasSlottedTimeLabel = this.el.querySelector('[slot="time-label"]') !== null;
    if (!hasSlottedTimeLabel && !this.showDefaultTimeLabel) {
      return;
    }
    return h("slot", { name: "time-label" }, "Time");
  }
  renderTimeOverlay() {
    const use24Hour = is24Hour(this.locale, this.hourCycle);
    const activePart = this.getActivePartsWithFallback();
    return [
      h("div", { class: "time-header" }, this.renderTimeLabel()),
      h("button", { class: {
          'time-body': true,
          'time-body-active': this.isTimePopoverOpen,
        }, "aria-expanded": "false", "aria-haspopup": "true", onClick: async (ev) => {
          const { popoverRef } = this;
          if (popoverRef) {
            this.isTimePopoverOpen = true;
            popoverRef.present(new CustomEvent('ionShadowTarget', {
              detail: {
                ionShadowTarget: ev.target,
              },
            }));
            await popoverRef.onWillDismiss();
            this.isTimePopoverOpen = false;
          }
        } }, getLocalizedTime(this.locale, activePart, use24Hour)),
      h("ion-popover", { alignment: "center", translucent: true, overlayIndex: 1, arrow: false, onWillPresent: (ev) => {
          /**
           * Intersection Observers do not consistently fire between Blink and Webkit
           * when toggling the visibility of the popover and trying to scroll the picker
           * column to the correct time value.
           *
           * This will correctly scroll the element position to the correct time value,
           * before the popover is fully presented.
           */
          const cols = ev.target.querySelectorAll('ion-picker-column-internal');
          // TODO (FW-615): Potentially remove this when intersection observers are fixed in picker column
          cols.forEach((col) => col.scrollActiveItemIntoView());
        }, style: {
          '--offset-y': '-10px',
          '--min-width': 'fit-content',
        },
        // Allow native browser keyboard events to support up/down/home/end key
        // navigation within the time picker.
        keyboardEvents: true, ref: (el) => (this.popoverRef = el) }, this.renderWheelPicker('time')),
    ];
  }
  getHeaderSelectedDateText() {
    const { activeParts, multiple, titleSelectedDatesFormatter } = this;
    const isArray = Array.isArray(activeParts);
    let headerText;
    if (multiple && isArray && activeParts.length !== 1) {
      headerText = `${activeParts.length} days`; // default/fallback for multiple selection
      if (titleSelectedDatesFormatter !== undefined) {
        try {
          headerText = titleSelectedDatesFormatter(convertDataToISO(activeParts));
        }
        catch (e) {
          printIonError('Exception in provided `titleSelectedDatesFormatter`: ', e);
        }
      }
    }
    else {
      // for exactly 1 day selected (multiple set or not), show a formatted version of that
      headerText = getMonthAndDay(this.locale, this.getActivePartsWithFallback());
    }
    return headerText;
  }
  renderHeader(showExpandedHeader = true) {
    const hasSlottedTitle = this.el.querySelector('[slot="title"]') !== null;
    if (!hasSlottedTitle && !this.showDefaultTitle) {
      return;
    }
    return (h("div", { class: "datetime-header" }, h("div", { class: "datetime-title" }, h("slot", { name: "title" }, "Select Date")), showExpandedHeader && h("div", { class: "datetime-selected-date" }, this.getHeaderSelectedDateText())));
  }
  /**
   * Render time picker inside of datetime.
   * Do not pass color prop to segment on
   * iOS mode. MD segment has been customized and
   * should take on the color prop, but iOS
   * should just be the default segment.
   */
  renderTime() {
    const { presentation } = this;
    const timeOnlyPresentation = presentation === 'time';
    return (h("div", { class: "datetime-time" }, timeOnlyPresentation ? this.renderWheelPicker() : this.renderTimeOverlay()));
  }
  /**
   * Renders the month/year picker that is
   * displayed on the calendar grid.
   * The .datetime-year class has additional
   * styles that let us show/hide the
   * picker when the user clicks on the
   * toggle in the calendar header.
   */
  renderCalendarViewMonthYearPicker() {
    return h("div", { class: "datetime-year" }, this.renderWheelView('month-year'));
  }
  /**
   * Render entry point
   * All presentation types are rendered from here.
   */
  renderDatetime(mode) {
    const { presentation, preferWheel } = this;
    /**
     * Certain presentation types have separate grid and wheel displays.
     * If preferWheel is true then we should show a wheel picker instead.
     */
    const hasWheelVariant = presentation === 'date' || presentation === 'date-time' || presentation === 'time-date';
    if (preferWheel && hasWheelVariant) {
      return [this.renderHeader(false), this.renderWheelView(), this.renderFooter()];
    }
    switch (presentation) {
      case 'date-time':
        return [
          this.renderHeader(),
          this.renderCalendar(mode),
          this.renderCalendarViewMonthYearPicker(),
          this.renderTime(),
          this.renderFooter(),
        ];
      case 'time-date':
        return [
          this.renderHeader(),
          this.renderTime(),
          this.renderCalendar(mode),
          this.renderCalendarViewMonthYearPicker(),
          this.renderFooter(),
        ];
      case 'time':
        return [this.renderHeader(false), this.renderTime(), this.renderFooter()];
      case 'month':
      case 'month-year':
      case 'year':
        return [this.renderHeader(false), this.renderWheelView(), this.renderFooter()];
      default:
        return [
          this.renderHeader(),
          this.renderCalendar(mode),
          this.renderCalendarViewMonthYearPicker(),
          this.renderFooter(),
        ];
    }
  }
  render() {
    const { name, value, disabled, el, color, isPresented, readonly, showMonthAndYear, preferWheel, presentation, size, } = this;
    const mode = getIonMode(this);
    const isMonthAndYearPresentation = presentation === 'year' || presentation === 'month' || presentation === 'month-year';
    const shouldShowMonthAndYear = showMonthAndYear || isMonthAndYearPresentation;
    const monthYearPickerOpen = showMonthAndYear && !isMonthAndYearPresentation;
    const hasDatePresentation = presentation === 'date' || presentation === 'date-time' || presentation === 'time-date';
    const hasWheelVariant = hasDatePresentation && preferWheel;
    const hasGrid = hasDatePresentation && !preferWheel;
    renderHiddenInput(true, el, name, formatValue(value), disabled);
    return (h(Host, { "aria-disabled": disabled ? 'true' : null, onFocus: this.onFocus, onBlur: this.onBlur, class: Object.assign({}, createColorClasses(color, {
        [mode]: true,
        ['datetime-presented']: isPresented,
        ['datetime-readonly']: readonly,
        ['datetime-disabled']: disabled,
        'show-month-and-year': shouldShowMonthAndYear,
        'month-year-picker-open': monthYearPickerOpen,
        [`datetime-presentation-${presentation}`]: true,
        [`datetime-size-${size}`]: true,
        [`datetime-prefer-wheel`]: hasWheelVariant,
        [`datetime-grid`]: hasGrid,
      })) }, this.renderDatetime(mode)));
  }
  static get is() { return "ion-datetime"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "ios": ["datetime.ios.scss"],
      "md": ["datetime.md.scss"]
    };
  }
  static get styleUrls() {
    return {
      "ios": ["datetime.ios.css"],
      "md": ["datetime.md.css"]
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
        "reflect": false,
        "defaultValue": "'primary'"
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
          "text": "If `true`, the user cannot interact with the datetime."
        },
        "attribute": "disabled",
        "reflect": false,
        "defaultValue": "false"
      },
      "readonly": {
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
          "text": "If `true`, the datetime appears normal but is not interactive."
        },
        "attribute": "readonly",
        "reflect": false,
        "defaultValue": "false"
      },
      "isDateEnabled": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "(dateIsoString: string) => boolean",
          "resolved": "((dateIsoString: string) => boolean) | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Returns if an individual date (calendar day) is enabled or disabled.\n\nIf `true`, the day will be enabled/interactive.\nIf `false`, the day will be disabled/non-interactive.\n\nThe function accepts an ISO 8601 date string of a given day.\nBy default, all days are enabled. Developers can use this function\nto write custom logic to disable certain days.\n\nThe function is called for each rendered calendar day, for the previous, current and next month.\nCustom implementations should be optimized for performance to avoid jank."
        }
      },
      "min": {
        "type": "string",
        "mutable": true,
        "complexType": {
          "original": "string",
          "resolved": "string | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "The minimum datetime allowed. Value must be a date string\nfollowing the\n[ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime),\nsuch as `1996-12-19`. The format does not have to be specific to an exact\ndatetime. For example, the minimum could just be the year, such as `1994`.\nDefaults to the beginning of the year, 100 years ago from today."
        },
        "attribute": "min",
        "reflect": false
      },
      "max": {
        "type": "string",
        "mutable": true,
        "complexType": {
          "original": "string",
          "resolved": "string | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "The maximum datetime allowed. Value must be a date string\nfollowing the\n[ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime),\n`1996-12-19`. The format does not have to be specific to an exact\ndatetime. For example, the maximum could just be the year, such as `1994`.\nDefaults to the end of this year."
        },
        "attribute": "max",
        "reflect": false
      },
      "presentation": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "DatetimePresentation",
          "resolved": "\"date\" | \"date-time\" | \"month\" | \"month-year\" | \"time\" | \"time-date\" | \"year\"",
          "references": {
            "DatetimePresentation": {
              "location": "import",
              "path": "./datetime-interface"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Which values you want to select. `'date'` will show\na calendar picker to select the month, day, and year. `'time'`\nwill show a time picker to select the hour, minute, and (optionally)\nAM/PM. `'date-time'` will show the date picker first and time picker second.\n`'time-date'` will show the time picker first and date picker second."
        },
        "attribute": "presentation",
        "reflect": false,
        "defaultValue": "'date-time'"
      },
      "cancelText": {
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
          "text": "The text to display on the picker's cancel button."
        },
        "attribute": "cancel-text",
        "reflect": false,
        "defaultValue": "'Cancel'"
      },
      "doneText": {
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
          "text": "The text to display on the picker's \"Done\" button."
        },
        "attribute": "done-text",
        "reflect": false,
        "defaultValue": "'Done'"
      },
      "clearText": {
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
          "text": "The text to display on the picker's \"Clear\" button."
        },
        "attribute": "clear-text",
        "reflect": false,
        "defaultValue": "'Clear'"
      },
      "yearValues": {
        "type": "any",
        "mutable": false,
        "complexType": {
          "original": "number[] | number | string",
          "resolved": "number | number[] | string | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Values used to create the list of selectable years. By default\nthe year values range between the `min` and `max` datetime inputs. However, to\ncontrol exactly which years to display, the `yearValues` input can take a number, an array\nof numbers, or string of comma separated numbers. For example, to show upcoming and\nrecent leap years, then this input's value would be `yearValues=\"2024,2020,2016,2012,2008\"`."
        },
        "attribute": "year-values",
        "reflect": false
      },
      "monthValues": {
        "type": "any",
        "mutable": false,
        "complexType": {
          "original": "number[] | number | string",
          "resolved": "number | number[] | string | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Values used to create the list of selectable months. By default\nthe month values range from `1` to `12`. However, to control exactly which months to\ndisplay, the `monthValues` input can take a number, an array of numbers, or a string of\ncomma separated numbers. For example, if only summer months should be shown, then this\ninput value would be `monthValues=\"6,7,8\"`. Note that month numbers do *not* have a\nzero-based index, meaning January's value is `1`, and December's is `12`."
        },
        "attribute": "month-values",
        "reflect": false
      },
      "dayValues": {
        "type": "any",
        "mutable": false,
        "complexType": {
          "original": "number[] | number | string",
          "resolved": "number | number[] | string | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Values used to create the list of selectable days. By default\nevery day is shown for the given month. However, to control exactly which days of\nthe month to display, the `dayValues` input can take a number, an array of numbers, or\na string of comma separated numbers. Note that even if the array days have an invalid\nnumber for the selected month, like `31` in February, it will correctly not show\ndays which are not valid for the selected month."
        },
        "attribute": "day-values",
        "reflect": false
      },
      "hourValues": {
        "type": "any",
        "mutable": false,
        "complexType": {
          "original": "number[] | number | string",
          "resolved": "number | number[] | string | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Values used to create the list of selectable hours. By default\nthe hour values range from `0` to `23` for 24-hour, or `1` to `12` for 12-hour. However,\nto control exactly which hours to display, the `hourValues` input can take a number, an\narray of numbers, or a string of comma separated numbers."
        },
        "attribute": "hour-values",
        "reflect": false
      },
      "minuteValues": {
        "type": "any",
        "mutable": false,
        "complexType": {
          "original": "number[] | number | string",
          "resolved": "number | number[] | string | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Values used to create the list of selectable minutes. By default\nthe minutes range from `0` to `59`. However, to control exactly which minutes to display,\nthe `minuteValues` input can take a number, an array of numbers, or a string of comma\nseparated numbers. For example, if the minute selections should only be every 15 minutes,\nthen this input value would be `minuteValues=\"0,15,30,45\"`."
        },
        "attribute": "minute-values",
        "reflect": false
      },
      "locale": {
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
          "text": "The locale to use for `ion-datetime`. This\nimpacts month and day name formatting.\nThe `'default'` value refers to the default\nlocale set by your device."
        },
        "attribute": "locale",
        "reflect": false,
        "defaultValue": "'default'"
      },
      "firstDayOfWeek": {
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
          "text": "The first day of the week to use for `ion-datetime`. The\ndefault value is `0` and represents Sunday."
        },
        "attribute": "first-day-of-week",
        "reflect": false,
        "defaultValue": "0"
      },
      "titleSelectedDatesFormatter": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "TitleSelectedDatesFormatter",
          "resolved": "((selectedDates: string[]) => string) | undefined",
          "references": {
            "TitleSelectedDatesFormatter": {
              "location": "import",
              "path": "./datetime-interface"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "A callback used to format the header text that shows how many\ndates are selected. Only used if there are 0 or more than 1\nselected (i.e. unused for exactly 1). By default, the header\ntext is set to \"numberOfDates days\"."
        }
      },
      "multiple": {
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
          "text": "If `true`, multiple dates can be selected at once. Only\napplies to `presentation=\"date\"` and `preferWheel=\"false\"`."
        },
        "attribute": "multiple",
        "reflect": false,
        "defaultValue": "false"
      },
      "highlightedDates": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "DatetimeHighlight[] | DatetimeHighlightCallback",
          "resolved": "((dateIsoString: string) => DatetimeHighlightStyle | undefined) | DatetimeHighlight[] | undefined",
          "references": {
            "DatetimeHighlight": {
              "location": "import",
              "path": "./datetime-interface"
            },
            "DatetimeHighlightCallback": {
              "location": "import",
              "path": "./datetime-interface"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Used to apply custom text and background colors to specific dates.\n\nCan be either an array of objects containing ISO strings and colors,\nor a callback that receives an ISO string and returns the colors.\n\nOnly applies to the `date`, `date-time`, and `time-date` presentations,\nwith `preferWheel=\"false\"`."
        }
      },
      "value": {
        "type": "string",
        "mutable": true,
        "complexType": {
          "original": "string | string[] | null",
          "resolved": "null | string | string[] | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "The value of the datetime as a valid ISO 8601 datetime string.\nShould be an array of strings if `multiple=\"true\"`."
        },
        "attribute": "value",
        "reflect": false
      },
      "showDefaultTitle": {
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
          "text": "If `true`, a header will be shown above the calendar\npicker. This will include both the slotted title, and\nthe selected date."
        },
        "attribute": "show-default-title",
        "reflect": false,
        "defaultValue": "false"
      },
      "showDefaultButtons": {
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
          "text": "If `true`, the default \"Cancel\" and \"OK\" buttons\nwill be rendered at the bottom of the `ion-datetime`\ncomponent. Developers can also use the `button` slot\nif they want to customize these buttons. If custom\nbuttons are set in the `button` slot then the\ndefault buttons will not be rendered."
        },
        "attribute": "show-default-buttons",
        "reflect": false,
        "defaultValue": "false"
      },
      "showClearButton": {
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
          "text": "If `true`, a \"Clear\" button will be rendered alongside\nthe default \"Cancel\" and \"OK\" buttons at the bottom of the `ion-datetime`\ncomponent. Developers can also use the `button` slot\nif they want to customize these buttons. If custom\nbuttons are set in the `button` slot then the\ndefault buttons will not be rendered."
        },
        "attribute": "show-clear-button",
        "reflect": false,
        "defaultValue": "false"
      },
      "showDefaultTimeLabel": {
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
          "text": "If `true`, the default \"Time\" label will be rendered\nfor the time selector of the `ion-datetime` component.\nDevelopers can also use the `time-label` slot\nif they want to customize this label. If a custom\nlabel is set in the `time-label` slot then the\ndefault label will not be rendered."
        },
        "attribute": "show-default-time-label",
        "reflect": false,
        "defaultValue": "true"
      },
      "hourCycle": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "'h23' | 'h12'",
          "resolved": "\"h12\" | \"h23\" | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "The hour cycle of the `ion-datetime`. If no value is set, this is\nspecified by the current locale."
        },
        "attribute": "hour-cycle",
        "reflect": false
      },
      "size": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "'cover' | 'fixed'",
          "resolved": "\"cover\" | \"fixed\"",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "If `cover`, the `ion-datetime` will expand to cover the full width of its container.\nIf `fixed`, the `ion-datetime` will have a fixed width."
        },
        "attribute": "size",
        "reflect": false,
        "defaultValue": "'fixed'"
      },
      "preferWheel": {
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
          "text": "If `true`, a wheel picker will be rendered instead of a calendar grid\nwhere possible. If `false`, a calendar grid will be rendered instead of\na wheel picker where possible.\n\nA wheel picker can be rendered instead of a grid when `presentation` is\none of the following values: `'date'`, `'date-time'`, or `'time-date'`.\n\nA wheel picker will always be rendered regardless of\nthe `preferWheel` value when `presentation` is one of the following values:\n`'time'`, `'month'`, `'month-year'`, or `'year'`."
        },
        "attribute": "prefer-wheel",
        "reflect": false,
        "defaultValue": "false"
      }
    };
  }
  static get states() {
    return {
      "showMonthAndYear": {},
      "activeParts": {},
      "workingParts": {},
      "isPresented": {},
      "isTimePopoverOpen": {}
    };
  }
  static get events() {
    return [{
        "method": "ionCancel",
        "name": "ionCancel",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted when the datetime selection was cancelled."
        },
        "complexType": {
          "original": "void",
          "resolved": "void",
          "references": {}
        }
      }, {
        "method": "ionChange",
        "name": "ionChange",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted when the value (selected date) has changed."
        },
        "complexType": {
          "original": "DatetimeChangeEventDetail",
          "resolved": "DatetimeChangeEventDetail",
          "references": {
            "DatetimeChangeEventDetail": {
              "location": "import",
              "path": "./datetime-interface"
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
          "text": "Emitted when the datetime has focus."
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
          "text": "Emitted when the datetime loses focus."
        },
        "complexType": {
          "original": "void",
          "resolved": "void",
          "references": {}
        }
      }, {
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
        "method": "ionRender",
        "name": "ionRender",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [{
              "name": "internal",
              "text": undefined
            }],
          "text": "Emitted when componentDidRender is fired."
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
      "confirm": {
        "complexType": {
          "signature": "(closeOverlay?: boolean) => Promise<void>",
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
          "text": "Confirms the selected datetime value, updates the\n`value` property, and optionally closes the popover\nor modal that the datetime was presented in.",
          "tags": []
        }
      },
      "reset": {
        "complexType": {
          "signature": "(startDate?: string) => Promise<void>",
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
          "text": "Resets the internal state of the datetime but does not update the value.\nPassing a valid ISO-8601 string will reset the state of the component to the provided date.\nIf no value is provided, the internal state will be reset to the clamped value of the min, max and today.",
          "tags": []
        }
      },
      "cancel": {
        "complexType": {
          "signature": "(closeOverlay?: boolean) => Promise<void>",
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
          "text": "Emits the ionCancel event and\noptionally closes the popover\nor modal that the datetime was\npresented in.",
          "tags": []
        }
      }
    };
  }
  static get elementRef() { return "el"; }
  static get watchers() {
    return [{
        "propName": "disabled",
        "methodName": "disabledChanged"
      }, {
        "propName": "min",
        "methodName": "minChanged"
      }, {
        "propName": "max",
        "methodName": "maxChanged"
      }, {
        "propName": "yearValues",
        "methodName": "yearValuesChanged"
      }, {
        "propName": "monthValues",
        "methodName": "monthValuesChanged"
      }, {
        "propName": "dayValues",
        "methodName": "dayValuesChanged"
      }, {
        "propName": "hourValues",
        "methodName": "hourValuesChanged"
      }, {
        "propName": "minuteValues",
        "methodName": "minuteValuesChanged"
      }, {
        "propName": "activeParts",
        "methodName": "activePartsChanged"
      }, {
        "propName": "value",
        "methodName": "valueChanged"
      }];
  }
}
let datetimeIds = 0;
