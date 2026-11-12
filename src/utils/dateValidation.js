// ─── Date Validation Utilities ───

/**
 * Normalizes a day/month pair into { day: number, month: number }
 * Accepts various formats: "14", "November", "Nov", "11", etc.
 */

const MONTH_NAMES = {
  january: 1, jan: 1,
  february: 2, feb: 2,
  march: 3, mar: 3,
  april: 4, apr: 4,
  may: 5,
  june: 6, jun: 6,
  july: 7, jul: 7,
  august: 8, aug: 8,
  september: 9, sep: 9, sept: 9,
  october: 10, oct: 10,
  november: 11, nov: 11,
  december: 12, dec: 12,
};

/**
 * Parse month from string — handles numbers and names.
 * @param {string} val
 * @returns {number|null}
 */
export function parseMonth(val) {
  if (!val) return null;
  const trimmed = val.trim().toLowerCase();

  // Try numeric
  const num = parseInt(trimmed, 10);
  if (!isNaN(num) && num >= 1 && num <= 12) return num;

  // Try name
  if (MONTH_NAMES[trimmed] !== undefined) return MONTH_NAMES[trimmed];

  return null;
}

/**
 * Parse day from string.
 * @param {string} val
 * @returns {number|null}
 */
export function parseDay(val) {
  if (!val) return null;
  const num = parseInt(val.trim(), 10);
  if (!isNaN(num) && num >= 1 && num <= 31) return num;
  return null;
}

/**
 * Validate birthday against 14 November.
 * Handles combined strings like "14/11", "14 Nov", "14 November".
 * @param {string|number} day
 * @param {string|number} month
 * @returns {boolean}
 */
export function validateBirthday(day, month) {
  const parsedDay = typeof day === 'number' ? day : parseDay(String(day));
  const parsedMonth = typeof month === 'number' ? month : parseMonth(String(month));

  if (parsedDay === null || parsedMonth === null) return false;
  return parsedDay === 14 && parsedMonth === 11;
}

/**
 * Try to parse a combined single-field input like "14/11" or "14 November".
 * Returns { day, month } or null.
 * @param {string} combined
 */
export function parseCombined(combined) {
  if (!combined) return null;
  const str = combined.trim();

  // Try "DD/MM" or "DD-MM" or "DD MM"
  const slashMatch = str.match(/^(\d{1,2})[\/\-\s](\S+)$/);
  if (slashMatch) {
    const d = parseDay(slashMatch[1]);
    const m = parseMonth(slashMatch[2]);
    if (d && m) return { day: d, month: m };
  }

  // Try just two numbers with separator
  const twoNum = str.match(/^(\d{1,2})\s*[\/\-,\s]\s*(\d{1,2})$/);
  if (twoNum) {
    const d = parseDay(twoNum[1]);
    const m = parseMonth(twoNum[2]);
    if (d && m) return { day: d, month: m };
  }

  return null;
}
