/**
 * Zenbakiak europako formatuan bistaratu (koma hamartarretarako).
 * Adibidez: 0.25 → "0,25", 1000 → "1000", 3.14159 → "3,14159"
 */
export const formatNumber = (num, decimals) => {
  if (num === '' || num === undefined || num === null) return '';
  if (typeof num === 'string') return num.replace('.', ',');
  if (typeof num !== 'number' || isNaN(num)) return '';
  if (decimals !== undefined) {
    return num.toFixed(decimals).replace('.', ',');
  }
  if (Number.isInteger(num)) return num.toString();
  return parseFloat(num.toFixed(6)).toString().replace('.', ',');
};
