/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { convertDataToISO } from './manipulation';
const getFormattedDayPeriod = (dayPeriod) => {
  if (dayPeriod === undefined) {
    return '';
  }
  return dayPeriod.toUpperCase();
};
export const getLocalizedTime = (locale, refParts, use24Hour) => {
  const timeParts = {
    hour: refParts.hour,
    minute: refParts.minute,
  };
  if (timeParts.hour === undefined || timeParts.minute === undefined) {
    return 'Invalid Time';
  }
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'UTC',
    /**
     * We use hourCycle here instead of hour12 due to:
     * https://bugs.chromium.org/p/chromium/issues/detail?id=1347316&q=hour12&can=2
     */
    hourCycle: use24Hour ? 'h23' : 'h12',
  }).format(new Date(convertDataToISO(Object.assign(Object.assign({
    /**
     * JS uses a simplified ISO 8601 format which allows for
     * date-only formats and date-time formats, but not
     * time-only formats: https://tc39.es/ecma262/#sec-date-time-string-format
     * As a result, developers who only pass a time will get
     * an "Invalid Date" error. To account for this, we make sure that
     * year/day/month values are set when passing to new Date().
     * The Intl.DateTimeFormat call above only uses the hour/minute
     * values, so passing these date values should have no impact
     * on the time output.
     */
    year: 2023, day: 1, month: 1
  }, timeParts), {
    // TODO: FW-1831 will remove the need to manually set the tzOffset to undefined
    tzOffset: undefined
  }))));
};
/**
 * Adds padding to a time value so
 * that it is always 2 digits.
 */
export const addTimePadding = (value) => {
  const valueToString = value.toString();
  if (valueToString.length > 1) {
    return valueToString;
  }
  return `0${valueToString}`;
};
/**
 * Formats 24 hour times so that
 * it always has 2 digits. For
 * 12 hour times it ensures that
 * hour 0 is formatted as '12'.
 */
export const getFormattedHour = (hour, use24Hour) => {
  if (use24Hour) {
    return addTimePadding(hour);
  }
  /**
   * If using 12 hour
   * format, make sure hour
   * 0 is formatted as '12'.
   */
  if (hour === 0) {
    return '12';
  }
  return hour.toString();
};
/**
 * Generates an aria-label to be read by screen readers
 * given a local, a date, and whether or not that date is
 * today's date.
 */
export const generateDayAriaLabel = (locale, today, refParts) => {
  if (refParts.day === null) {
    return null;
  }
  /**
   * MM/DD/YYYY will return midnight in the user's timezone.
   */
  const date = new Date(`${refParts.month}/${refParts.day}/${refParts.year} GMT+0000`);
  const labelString = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
  /**
   * If date is today, prepend "Today" so screen readers indicate
   * that the date is today.
   */
  return today ? `Today, ${labelString}` : labelString;
};
/**
 * Gets the day of the week, month, and day
 * Used for the header in MD mode.
 */
export const getMonthAndDay = (locale, refParts) => {
  const date = new Date(`${refParts.month}/${refParts.day}/${refParts.year} GMT+0000`);
  return new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(date);
};
/**
 * Given a locale and a date object,
 * return a formatted string that includes
 * the month name and full year.
 * Example: May 2021
 */
export const getMonthAndYear = (locale, refParts) => {
  const date = new Date(`${refParts.month}/${refParts.day}/${refParts.year} GMT+0000`);
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
};
/**
 * Given a locale and a date object,
 * return a formatted string that includes
 * the short month, numeric day, and full year.
 * Example: Apr 22, 2021
 */
export const getMonthDayAndYear = (locale, refParts) => {
  return getLocalizedDateTime(locale, refParts, { month: 'short', day: 'numeric', year: 'numeric' });
};
/**
 * Given a locale and a date object,
 * return a formatted string that includes
 * the numeric day.
 * Note: Some languages will add literal characters
 * to the end. This function removes those literals.
 * Example: 29
 */
export const getDay = (locale, refParts) => {
  return getLocalizedDateTimeParts(locale, refParts, { day: 'numeric' }).find((obj) => obj.type === 'day').value;
};
/**
 * Given a locale and a date object,
 * return a formatted string that includes
 * the numeric year.
 * Example: 2022
 */
export const getYear = (locale, refParts) => {
  return getLocalizedDateTime(locale, refParts, { year: 'numeric' });
};
const getNormalizedDate = (refParts) => {
  const timeString = refParts.hour !== undefined && refParts.minute !== undefined ? ` ${refParts.hour}:${refParts.minute}` : '';
  return new Date(`${refParts.month}/${refParts.day}/${refParts.year}${timeString} GMT+0000`);
};
/**
 * Given a locale, DatetimeParts, and options
 * format the DatetimeParts according to the options
 * and locale combination. This returns a string. If
 * you want an array of the individual pieces
 * that make up the localized date string, use
 * getLocalizedDateTimeParts.
 */
export const getLocalizedDateTime = (locale, refParts, options) => {
  const date = getNormalizedDate(refParts);
  return getDateTimeFormat(locale, options).format(date);
};
/**
 * Given a locale, DatetimeParts, and options
 * format the DatetimeParts according to the options
 * and locale combination. This returns an array of
 * each piece of the date.
 */
export const getLocalizedDateTimeParts = (locale, refParts, options) => {
  const date = getNormalizedDate(refParts);
  return getDateTimeFormat(locale, options).formatToParts(date);
};
/**
 * Wrapper function for Intl.DateTimeFormat.
 * Allows developers to apply an allowed format to DatetimeParts.
 * This function also has built in safeguards for older browser bugs
 * with Intl.DateTimeFormat.
 */
const getDateTimeFormat = (locale, options) => {
  return new Intl.DateTimeFormat(locale, Object.assign(Object.assign({}, options), { timeZone: 'UTC' }));
};
/**
 * Gets a localized version of "Today"
 * Falls back to "Today" in English for
 * browsers that do not support RelativeTimeFormat.
 */
export const getTodayLabel = (locale) => {
  if ('RelativeTimeFormat' in Intl) {
    const label = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(0, 'day');
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
  else {
    return 'Today';
  }
};
/**
 * When calling toISOString(), the browser
 * will convert the date to UTC time by either adding
 * or subtracting the time zone offset.
 * To work around this, we need to either add
 * or subtract the time zone offset to the Date
 * object prior to calling toISOString().
 * This allows us to get an ISO string
 * that is in the user's time zone.
 *
 * Example:
 * Time zone offset is 240
 * Meaning: The browser needs to add 240 minutes
 * to the Date object to get UTC time.
 * What Ionic does: We subtract 240 minutes
 * from the Date object. The browser then adds
 * 240 minutes in toISOString(). The result
 * is a time that is in the user's time zone
 * and not UTC.
 *
 * Note: Some timezones include minute adjustments
 * such as 30 or 45 minutes. This is why we use setMinutes
 * instead of setHours.
 * Example: India Standard Time
 * Timezone offset: -330 = -5.5 hours.
 *
 * List of timezones with 30 and 45 minute timezones:
 * https://www.timeanddate.com/time/time-zones-interesting.html
 */
export const removeDateTzOffset = (date) => {
  const tzOffset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - tzOffset);
  return date;
};
const DATE_AM = removeDateTzOffset(new Date('2022T01:00'));
const DATE_PM = removeDateTzOffset(new Date('2022T13:00'));
/**
 * Formats the locale's string representation of the day period (am/pm) for a given
 * ref parts day period.
 *
 * @param locale The locale to format the day period in.
 * @param value The date string, in ISO format.
 * @returns The localized day period (am/pm) representation of the given value.
 */
export const getLocalizedDayPeriod = (locale, dayPeriod) => {
  const date = dayPeriod === 'am' ? DATE_AM : DATE_PM;
  const localizedDayPeriod = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    timeZone: 'UTC',
  })
    .formatToParts(date)
    .find((part) => part.type === 'dayPeriod');
  if (localizedDayPeriod) {
    return localizedDayPeriod.value;
  }
  return getFormattedDayPeriod(dayPeriod);
};
/**
 * Formats the datetime's value to a string, for use in the native input.
 *
 * @param value The value to format, either an ISO string or an array thereof.
 */
export const formatValue = (value) => {
  return Array.isArray(value) ? value.join(',') : value;
};
