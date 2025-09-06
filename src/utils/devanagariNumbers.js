/**
 * Utility functions for converting English numbers to Devanagari numbers
 */

const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

/**
 * Convert English number to Devanagari number
 * @param {number|string} num - The number to convert
 * @returns {string} - Devanagari representation of the number
 */
export function toDevanagariNumber(num) {
  if (num === null || num === undefined) return '';
  
  const numStr = num.toString();
  return numStr.replace(/\d/g, (digit) => devanagariDigits[parseInt(digit)]);
}

/**
 * Convert Devanagari number back to English number
 * @param {string} devanagariNum - The Devanagari number string
 * @returns {number} - English representation of the number
 */
export function fromDevanagariNumber(devanagariNum) {
  if (!devanagariNum) return 0;
  
  let result = '';
  for (let char of devanagariNum) {
    const index = devanagariDigits.indexOf(char);
    if (index !== -1) {
      result += index.toString();
    }
  }
  return parseInt(result) || 0;
}

/**
 * Format a number with Devanagari digits and add appropriate styling
 * @param {number|string} num - The number to format
 * @param {string} className - CSS class to apply
 * @returns {string} - HTML string with Devanagari number
 */
export function formatDevanagariNumber(num, className = 'devanagari-number') {
  const devanagariNum = toDevanagariNumber(num);
  return `<span class="${className}">${devanagariNum}</span>`;
}
