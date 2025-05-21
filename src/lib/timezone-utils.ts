/**
 * Utility functions for handling Manila timezone (UTC+8)
 */

export const TIMEZONE = "Asia/Manila";

/**
 * Converts a local date to Manila timezone
 * @param date The date to convert (defaults to current time)
 * @returns A date object representing the time in Manila timezone
 */
export const getManilaNow = (date = new Date()): Date => {
  const manilaOffset = 8 * 60; // Manila is UTC+8 (8 hours * 60 minutes)
  const localOffset = date.getTimezoneOffset();
  const totalOffsetMinutes = manilaOffset + localOffset;

  const manilaTime = new Date(date.getTime() + totalOffsetMinutes * 60000);
  return manilaTime;
};

/**
 * Formats a date according to Manila timezone
 * @param date The date to format
 * @param options Formatting options
 * @returns Formatted date string in Manila timezone
 */
export const formatInManilaTimezone = (
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }
): string => {
  return date.toLocaleString("en-US", {
    ...options,
    timeZone: TIMEZONE,
  });
};

/**
 * Extracts the hour component of a date in Manila timezone
 * @param date The date to extract from
 * @returns Hour in 12-hour format (1-12)
 */
export const getManilaHour = (date: Date): number => {
  const manilaDate = new Date(
    date.toLocaleString("en-US", { timeZone: TIMEZONE })
  );
  const hour = manilaDate.getHours() % 12;
  return hour === 0 ? 12 : hour;
};

/**
 * Extracts the minute component of a date in Manila timezone
 * @param date The date to extract from
 * @returns Minutes (0-59)
 */
export const getManilaMinute = (date: Date): number => {
  const manilaDate = new Date(
    date.toLocaleString("en-US", { timeZone: TIMEZONE })
  );
  return manilaDate.getMinutes();
};

/**
 * Determines if a date is in the AM or PM in Manila timezone
 * @param date The date to check
 * @returns 'AM' or 'PM'
 */
export const getManilaAMPM = (date: Date): "AM" | "PM" => {
  const manilaDate = new Date(
    date.toLocaleString("en-US", { timeZone: TIMEZONE })
  );
  return manilaDate.getHours() >= 12 ? "PM" : "AM";
};

/**
 * Converts a Date object to an ISO string representation in Manila timezone
 * This preserves the Manila time when stored in the database
 * @param date The date to convert
 * @returns ISO string representing the Manila time
 */
export const toManilaISOString = (date: Date): string => {
  const manilaDateString = date.toLocaleString("en-US", { timeZone: TIMEZONE });
  return new Date(manilaDateString).toISOString();
};
