import type { ComponentInterface, EventEmitter } from '../../stencil-public-runtime';
import type { Color, StyleEventDetail } from '../../interface';
import type { DatetimePresentation, DatetimeChangeEventDetail, DatetimeParts, TitleSelectedDatesFormatter, DatetimeHighlight, DatetimeHighlightCallback } from './datetime-interface';
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot title - The title of the datetime.
 * @slot buttons - The buttons in the datetime.
 * @slot time-label - The label for the time selector in the datetime.
 */
export declare class Datetime implements ComponentInterface {
  private inputId;
  private calendarBodyRef?;
  private popoverRef?;
  private clearFocusVisible?;
  private parsedMinuteValues?;
  private parsedHourValues?;
  private parsedMonthValues?;
  private parsedYearValues?;
  private parsedDayValues?;
  private destroyCalendarListener?;
  private destroyKeyboardMO?;
  private minParts?;
  private maxParts?;
  private todayParts;
  private defaultParts;
  private prevPresentation;
  /**
   * Duplicate reference to `activeParts` that does not trigger a re-render of the component.
   * Allows caching an instance of the `activeParts` in between render cycles.
   */
  private activePartsClone;
  showMonthAndYear: boolean;
  activeParts: DatetimeParts | DatetimeParts[];
  workingParts: DatetimeParts;
  el: HTMLIonDatetimeElement;
  isPresented: boolean;
  isTimePopoverOpen: boolean;
  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  color?: Color;
  /**
   * The name of the control, which is submitted with the form data.
   */
  name: string;
  /**
   * If `true`, the user cannot interact with the datetime.
   */
  disabled: boolean;
  /**
   * If `true`, the datetime appears normal but is not interactive.
   */
  readonly: boolean;
  /**
   * Returns if an individual date (calendar day) is enabled or disabled.
   *
   * If `true`, the day will be enabled/interactive.
   * If `false`, the day will be disabled/non-interactive.
   *
   * The function accepts an ISO 8601 date string of a given day.
   * By default, all days are enabled. Developers can use this function
   * to write custom logic to disable certain days.
   *
   * The function is called for each rendered calendar day, for the previous, current and next month.
   * Custom implementations should be optimized for performance to avoid jank.
   */
  isDateEnabled?: (dateIsoString: string) => boolean;
  protected disabledChanged(): void;
  /**
   * The minimum datetime allowed. Value must be a date string
   * following the
   * [ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime),
   * such as `1996-12-19`. The format does not have to be specific to an exact
   * datetime. For example, the minimum could just be the year, such as `1994`.
   * Defaults to the beginning of the year, 100 years ago from today.
   */
  min?: string;
  protected minChanged(): void;
  /**
   * The maximum datetime allowed. Value must be a date string
   * following the
   * [ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime),
   * `1996-12-19`. The format does not have to be specific to an exact
   * datetime. For example, the maximum could just be the year, such as `1994`.
   * Defaults to the end of this year.
   */
  max?: string;
  protected maxChanged(): void;
  /**
   * Which values you want to select. `'date'` will show
   * a calendar picker to select the month, day, and year. `'time'`
   * will show a time picker to select the hour, minute, and (optionally)
   * AM/PM. `'date-time'` will show the date picker first and time picker second.
   * `'time-date'` will show the time picker first and date picker second.
   */
  presentation: DatetimePresentation;
  /**
   * The text to display on the picker's cancel button.
   */
  cancelText: string;
  /**
   * The text to display on the picker's "Done" button.
   */
  doneText: string;
  /**
   * The text to display on the picker's "Clear" button.
   */
  clearText: string;
  /**
   * Values used to create the list of selectable years. By default
   * the year values range between the `min` and `max` datetime inputs. However, to
   * control exactly which years to display, the `yearValues` input can take a number, an array
   * of numbers, or string of comma separated numbers. For example, to show upcoming and
   * recent leap years, then this input's value would be `yearValues="2024,2020,2016,2012,2008"`.
   */
  yearValues?: number[] | number | string;
  protected yearValuesChanged(): void;
  /**
   * Values used to create the list of selectable months. By default
   * the month values range from `1` to `12`. However, to control exactly which months to
   * display, the `monthValues` input can take a number, an array of numbers, or a string of
   * comma separated numbers. For example, if only summer months should be shown, then this
   * input value would be `monthValues="6,7,8"`. Note that month numbers do *not* have a
   * zero-based index, meaning January's value is `1`, and December's is `12`.
   */
  monthValues?: number[] | number | string;
  protected monthValuesChanged(): void;
  /**
   * Values used to create the list of selectable days. By default
   * every day is shown for the given month. However, to control exactly which days of
   * the month to display, the `dayValues` input can take a number, an array of numbers, or
   * a string of comma separated numbers. Note that even if the array days have an invalid
   * number for the selected month, like `31` in February, it will correctly not show
   * days which are not valid for the selected month.
   */
  dayValues?: number[] | number | string;
  protected dayValuesChanged(): void;
  /**
   * Values used to create the list of selectable hours. By default
   * the hour values range from `0` to `23` for 24-hour, or `1` to `12` for 12-hour. However,
   * to control exactly which hours to display, the `hourValues` input can take a number, an
   * array of numbers, or a string of comma separated numbers.
   */
  hourValues?: number[] | number | string;
  protected hourValuesChanged(): void;
  /**
   * Values used to create the list of selectable minutes. By default
   * the minutes range from `0` to `59`. However, to control exactly which minutes to display,
   * the `minuteValues` input can take a number, an array of numbers, or a string of comma
   * separated numbers. For example, if the minute selections should only be every 15 minutes,
   * then this input value would be `minuteValues="0,15,30,45"`.
   */
  minuteValues?: number[] | number | string;
  protected minuteValuesChanged(): void;
  protected activePartsChanged(): void;
  /**
   * The locale to use for `ion-datetime`. This
   * impacts month and day name formatting.
   * The `'default'` value refers to the default
   * locale set by your device.
   */
  locale: string;
  /**
   * The first day of the week to use for `ion-datetime`. The
   * default value is `0` and represents Sunday.
   */
  firstDayOfWeek: number;
  /**
   * A callback used to format the header text that shows how many
   * dates are selected. Only used if there are 0 or more than 1
   * selected (i.e. unused for exactly 1). By default, the header
   * text is set to "numberOfDates days".
   */
  titleSelectedDatesFormatter?: TitleSelectedDatesFormatter;
  /**
   * If `true`, multiple dates can be selected at once. Only
   * applies to `presentation="date"` and `preferWheel="false"`.
   */
  multiple: boolean;
  /**
   * Used to apply custom text and background colors to specific dates.
   *
   * Can be either an array of objects containing ISO strings and colors,
   * or a callback that receives an ISO string and returns the colors.
   *
   * Only applies to the `date`, `date-time`, and `time-date` presentations,
   * with `preferWheel="false"`.
   */
  highlightedDates?: DatetimeHighlight[] | DatetimeHighlightCallback;
  /**
   * The value of the datetime as a valid ISO 8601 datetime string.
   * Should be an array of strings if `multiple="true"`.
   */
  value?: string | string[] | null;
  /**
   * Update the datetime value when the value changes
   */
  protected valueChanged(): void;
  /**
   * If `true`, a header will be shown above the calendar
   * picker. This will include both the slotted title, and
   * the selected date.
   */
  showDefaultTitle: boolean;
  /**
   * If `true`, the default "Cancel" and "OK" buttons
   * will be rendered at the bottom of the `ion-datetime`
   * component. Developers can also use the `button` slot
   * if they want to customize these buttons. If custom
   * buttons are set in the `button` slot then the
   * default buttons will not be rendered.
   */
  showDefaultButtons: boolean;
  /**
   * If `true`, a "Clear" button will be rendered alongside
   * the default "Cancel" and "OK" buttons at the bottom of the `ion-datetime`
   * component. Developers can also use the `button` slot
   * if they want to customize these buttons. If custom
   * buttons are set in the `button` slot then the
   * default buttons will not be rendered.
   */
  showClearButton: boolean;
  /**
   * If `true`, the default "Time" label will be rendered
   * for the time selector of the `ion-datetime` component.
   * Developers can also use the `time-label` slot
   * if they want to customize this label. If a custom
   * label is set in the `time-label` slot then the
   * default label will not be rendered.
   */
  showDefaultTimeLabel: boolean;
  /**
   * The hour cycle of the `ion-datetime`. If no value is set, this is
   * specified by the current locale.
   */
  hourCycle?: 'h23' | 'h12';
  /**
   * If `cover`, the `ion-datetime` will expand to cover the full width of its container.
   * If `fixed`, the `ion-datetime` will have a fixed width.
   */
  size: 'cover' | 'fixed';
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
  preferWheel: boolean;
  /**
   * Emitted when the datetime selection was cancelled.
   */
  ionCancel: EventEmitter<void>;
  /**
   * Emitted when the value (selected date) has changed.
   */
  ionChange: EventEmitter<DatetimeChangeEventDetail>;
  /**
   * Emitted when the datetime has focus.
   */
  ionFocus: EventEmitter<void>;
  /**
   * Emitted when the datetime loses focus.
   */
  ionBlur: EventEmitter<void>;
  /**
   * Emitted when the styles change.
   * @internal
   */
  ionStyle: EventEmitter<StyleEventDetail>;
  /**
   * Emitted when componentDidRender is fired.
   * @internal
   */
  ionRender: EventEmitter<void>;
  /**
   * Confirms the selected datetime value, updates the
   * `value` property, and optionally closes the popover
   * or modal that the datetime was presented in.
   */
  confirm(closeOverlay?: boolean): Promise<void>;
  /**
   * Resets the internal state of the datetime but does not update the value.
   * Passing a valid ISO-8601 string will reset the state of the component to the provided date.
   * If no value is provided, the internal state will be reset to the clamped value of the min, max and today.
   */
  reset(startDate?: string): Promise<void>;
  /**
   * Emits the ionCancel event and
   * optionally closes the popover
   * or modal that the datetime was
   * presented in.
   */
  cancel(closeOverlay?: boolean): Promise<void>;
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
  private getActivePartsWithFallback;
  private getActivePart;
  private closeParentOverlay;
  private setWorkingParts;
  private setActiveParts;
  private get isCalendarPicker();
  private initializeKeyboardListeners;
  private focusWorkingDay;
  private processMinParts;
  private processMaxParts;
  private initializeCalendarListener;
  connectedCallback(): void;
  disconnectedCallback(): void;
  /**
   * Clean up all listeners except for the overlay
   * listener. This is so that we can re-create the listeners
   * if the datetime has been hidden/presented by a modal or popover.
   */
  private destroyInteractionListeners;
  private initializeListeners;
  componentDidLoad(): void;
  /**
   * When the presentation is changed, all calendar content is recreated,
   * so we need to re-init behavior with the new elements.
   */
  componentDidRender(): void;
  private processValue;
  componentWillLoad(): void;
  private emitStyle;
  private onFocus;
  private onBlur;
  private hasValue;
  private nextMonth;
  private prevMonth;
  private toggleMonthAndYearView;
  /**
   * Universal render methods
   * These are pieces of datetime that
   * are rendered independently of presentation.
   */
  private renderFooter;
  /**
   * Wheel picker render methods
   */
  private renderWheelPicker;
  private renderDatePickerColumns;
  private renderCombinedDatePickerColumn;
  private renderIndividualDatePickerColumns;
  private renderDayPickerColumn;
  private renderMonthPickerColumn;
  private renderYearPickerColumn;
  private renderTimePickerColumns;
  private renderHourPickerColumn;
  private renderMinutePickerColumn;
  private renderDayPeriodPickerColumn;
  private renderWheelView;
  /**
   * Grid Render Methods
   */
  private renderCalendarHeader;
  private renderMonth;
  private renderCalendarBody;
  private renderCalendar;
  private renderTimeLabel;
  private renderTimeOverlay;
  private getHeaderSelectedDateText;
  private renderHeader;
  /**
   * Render time picker inside of datetime.
   * Do not pass color prop to segment on
   * iOS mode. MD segment has been customized and
   * should take on the color prop, but iOS
   * should just be the default segment.
   */
  private renderTime;
  /**
   * Renders the month/year picker that is
   * displayed on the calendar grid.
   * The .datetime-year class has additional
   * styles that let us show/hide the
   * picker when the user clicks on the
   * toggle in the calendar header.
   */
  private renderCalendarViewMonthYearPicker;
  /**
   * Render entry point
   * All presentation types are rendered from here.
   */
  private renderDatetime;
  render(): any;
}
