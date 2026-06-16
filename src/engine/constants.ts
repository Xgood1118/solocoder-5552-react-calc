import BigNumber from 'bignumber.js'

export const PI = new BigNumber('3.14159265358979323846264338327950288419716939937510')
export const E = new BigNumber('2.71828182845904523536028747135266249775724709369995')
export const PHI = new BigNumber('1.61803398874989484820458683436563811772030917980576')
export const G = new BigNumber('9.80665')
export const C = new BigNumber('299792458')
export const H = new BigNumber('6.62607015e-34')

export const CONSTANTS: Record<string, BigNumber> = {
  pi: PI,
  PI: PI,
  π: PI,
  e: E,
  E: E,
  phi: PHI,
  PHI: PHI,
  φ: PHI,
  g: G,
  G: G,
  c: C,
  h: H,
}

export function getConstant(key: string): BigNumber | undefined {
  return CONSTANTS[key]
}
