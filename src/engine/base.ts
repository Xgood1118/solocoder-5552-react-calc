import BigNumber from 'bignumber.js';

const DIGITS = '0123456789ABCDEF';
const MAX_FRAC_DIGITS = 20;

export function isValidInBase(value: string, base: number): boolean {
  if (base < 2 || base > 16) return false;
  const validChars = DIGITS.slice(0, base);
  const s = value.replace('.', '');
  if (s === '') return false;
  for (const ch of s) {
    if (!validChars.includes(ch.toUpperCase())) return false;
  }
  return true;
}

export function convertBase(
  value: string,
  fromBase: 2 | 8 | 10 | 16,
  toBase: 2 | 8 | 10 | 16
): string {
  if (!isValidInBase(value, fromBase)) {
    throw new Error(`Invalid value "${value}" for base ${fromBase}`);
  }

  const dotIdx = value.indexOf('.');
  let intPart = dotIdx >= 0 ? value.substring(0, dotIdx) : value;
  let fracPart = dotIdx >= 0 ? value.substring(dotIdx + 1) : '';

  if (intPart === '' || intPart === '-') intPart += '0';

  const negative = intPart.startsWith('-');
  if (negative) intPart = intPart.substring(1);

  const decInt = intPart
    .split('')
    .reduce((acc, ch) => acc.times(fromBase).plus(DIGITS.indexOf(ch.toUpperCase())), new BigNumber(0));

  let decFrac = new BigNumber(0);
  if (fracPart) {
    for (let i = 0; i < fracPart.length; i++) {
      const digitVal = DIGITS.indexOf(fracPart[i].toUpperCase());
      decFrac = decFrac.plus(new BigNumber(digitVal).div(new BigNumber(fromBase).pow(i + 1)));
    }
  }

  const intResult = convertIntegerPart(decInt, toBase);
  const fracResult = convertFractionalPart(decFrac, toBase);

  let result = intResult;
  if (fracResult) {
    result += '.' + fracResult;
  }

  if (negative && result !== '0') {
    result = '-' + result;
  }

  return result;
}

function convertIntegerPart(decInt: BigNumber, toBase: number): string {
  if (decInt.isZero()) return '0';

  let n = decInt;
  let result = '';
  while (n.isGreaterThan(0)) {
    const remainder = n.mod(toBase).toNumber();
    result = DIGITS[remainder] + result;
    n = n.minus(remainder).div(toBase).dp(0, BigNumber.ROUND_DOWN);
  }
  return result;
}

function convertFractionalPart(decFrac: BigNumber, toBase: number): string {
  if (decFrac.isZero()) return '';

  let frac = decFrac;
  let result = '';
  let count = 0;

  while (!frac.isZero() && count < MAX_FRAC_DIGITS) {
    frac = frac.times(toBase);
    const intPart = frac.dp(0, BigNumber.ROUND_DOWN).toNumber();
    result += DIGITS[intPart];
    frac = frac.minus(intPart);
    count++;
  }

  return result;
}
