import BigNumber from 'bignumber.js';

export interface ComplexNumber {
  re: BigNumber;
  im: BigNumber;
}

export function complexAdd(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return {
    re: a.re.plus(b.re),
    im: a.im.plus(b.im),
  };
}

export function complexSubtract(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return {
    re: a.re.minus(b.re),
    im: a.im.minus(b.im),
  };
}

export function complexMultiply(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return {
    re: a.re.times(b.re).minus(a.im.times(b.im)),
    im: a.re.times(b.im).plus(a.im.times(b.re)),
  };
}

export function complexDivide(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  const denom = b.re.times(b.re).plus(b.im.times(b.im));
  return {
    re: a.re.times(b.re).plus(a.im.times(b.im)).div(denom),
    im: a.im.times(b.re).minus(a.re.times(b.im)).div(denom),
  };
}

export function complexAbs(a: ComplexNumber): BigNumber {
  return a.re.times(a.re).plus(a.im.times(a.im)).sqrt();
}

export function complexArg(a: ComplexNumber, angleMode: 'rad' | 'deg'): BigNumber {
  const rad = new BigNumber(Math.atan2(a.im.toNumber(), a.re.toNumber()));
  if (angleMode === 'deg') {
    return rad.times(180).div(Math.PI);
  }
  return rad;
}

export function complexConjugate(a: ComplexNumber): ComplexNumber {
  return {
    re: a.re,
    im: a.im.negated(),
  };
}

export function formatComplex(a: ComplexNumber): string {
  const precision = 10;
  const reStr = a.re.toPrecision(precision);
  const imVal = a.im.toPrecision(precision);
  const re = new BigNumber(reStr);
  const im = new BigNumber(imVal);

  const reIsZero = re.isZero();
  const imIsZero = im.isZero();
  const imAbs = im.abs();
  const imIsOne = imAbs.isEqualTo(1);

  if (reIsZero && imIsZero) return '0';

  if (imIsZero) return re.toFormat();

  if (reIsZero) {
    if (imIsOne) {
      return im.isNegative() ? '-i' : 'i';
    }
    return im.toFormat() + 'i';
  }

  if (imIsOne) {
    return re.toFormat() + (im.isNegative() ? '-i' : '+i');
  }

  if (im.isNegative()) {
    return re.toFormat() + im.toFormat() + 'i';
  }

  return re.toFormat() + '+' + im.toFormat() + 'i';
}

export function isComplex(a: ComplexNumber): boolean {
  return !a.im.isZero();
}

export function parseComplex(s: string): ComplexNumber {
  const str = s.replace(/\s/g, '');

  if (str === 'i') return { re: new BigNumber(0), im: new BigNumber(1) };
  if (str === '-i') return { re: new BigNumber(0), im: new BigNumber(-1) };
  if (str === '+i') return { re: new BigNumber(0), im: new BigNumber(1) };

  if (!str.includes('i')) {
    return { re: new BigNumber(str), im: new BigNumber(0) };
  }

  const match = str.match(/^(.+?)((?:[+-][^+-]+)?)$/);
  if (!match) {
    return { re: new BigNumber(0), im: new BigNumber(NaN) };
  }

  let rePart = match[1];
  let imPart = match[2];

  if (imPart.includes('i')) {
    rePart = rePart.replace('i', '');
    imPart = imPart.replace('i', '');
    if (imPart === '+' || imPart === '') imPart = '1';
    if (imPart === '-') imPart = '-1';
    return { re: new BigNumber(rePart || '0'), im: new BigNumber(imPart) };
  }

  if (rePart.includes('i')) {
    rePart = rePart.replace('i', '');
    if (rePart === '' || rePart === '+') rePart = '1';
    if (rePart === '-') rePart = '-1';
    return { re: new BigNumber(imPart || '0'), im: new BigNumber(rePart) };
  }

  const lastPlus = str.lastIndexOf('+');
  const lastMinus = str.lastIndexOf('-', 1);
  const splitIdx = Math.max(lastPlus, lastMinus);

  if (splitIdx > 0) {
    const reS = str.substring(0, splitIdx);
    let imS = str.substring(splitIdx);
    imS = imS.replace('i', '');
    if (imS === '+' || imS === '') imS = '1';
    if (imS === '-') imS = '-1';
    return { re: new BigNumber(reS), im: new BigNumber(imS) };
  }

  let pureIm = str.replace('i', '');
  if (pureIm === '' || pureIm === '+') pureIm = '1';
  if (pureIm === '-') pureIm = '-1';
  return { re: new BigNumber(0), im: new BigNumber(pureIm) };
}
