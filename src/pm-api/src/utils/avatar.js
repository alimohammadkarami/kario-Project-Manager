const ZWNJ = '\u200c';
const isLatinLetter = (char) => /^[A-Za-z]$/.test(char);
const firstChar = (word) => Array.from(word)[0];

/**
 * Avatar initials = first letter of the first name + first letter of the last name.
 *   "Ali Rezaei"  -> "AR"
 *   "علی رضایی"   -> "ع‌ر"  (joined with a half-space so the letters don't connect)
 *   "علی"         -> "ع"
 */
export function buildAvatarName(fullName) {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  const first = firstChar(words[0]);
  if (words.length === 1) return first.toUpperCase();

  const last = firstChar(words[words.length - 1]);
  const separator = isLatinLetter(first) && isLatinLetter(last) ? '' : ZWNJ;
  return `${first}${separator}${last}`.toUpperCase();
}
