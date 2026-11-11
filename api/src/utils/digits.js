const PERSIAN = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC = '٠١٢٣٤٥٦٧٨٩';

/** Converts Persian / Arabic digits to English ones. */
export const normalizeDigits = (value) =>
  typeof value === 'string'
    ? value
        .replace(/[۰-۹]/g, (d) => String(PERSIAN.indexOf(d)))
        .replace(/[٠-٩]/g, (d) => String(ARABIC.indexOf(d)))
    : value;
