import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import {
  complexAdd,
  complexSubtract,
  complexMultiply,
  complexDivide,
  complexAbs,
  complexArg,
  complexConjugate,
  parseComplex,
  formatComplex,
} from '@/engine/complex'
import type { ComplexNumber } from '@/types/complex'
import type { AngleMode } from '@/types/calculator'

export function useComplex(angleMode: AngleMode = 'rad') {
  const add = useCallback(
    (a: ComplexNumber | string, b: ComplexNumber | string): ComplexNumber => {
      const numA = typeof a === 'string' ? parseComplex(a) : a
      const numB = typeof b === 'string' ? parseComplex(b) : b
      return complexAdd(numA, numB)
    },
    []
  )

  const subtract = useCallback(
    (a: ComplexNumber | string, b: ComplexNumber | string): ComplexNumber => {
      const numA = typeof a === 'string' ? parseComplex(a) : a
      const numB = typeof b === 'string' ? parseComplex(b) : b
      return complexSubtract(numA, numB)
    },
    []
  )

  const multiply = useCallback(
    (a: ComplexNumber | string, b: ComplexNumber | string): ComplexNumber => {
      const numA = typeof a === 'string' ? parseComplex(a) : a
      const numB = typeof b === 'string' ? parseComplex(b) : b
      return complexMultiply(numA, numB)
    },
    []
  )

  const divide = useCallback(
    (a: ComplexNumber | string, b: ComplexNumber | string): ComplexNumber => {
      const numA = typeof a === 'string' ? parseComplex(a) : a
      const numB = typeof b === 'string' ? parseComplex(b) : b
      return complexDivide(numA, numB)
    },
    []
  )

  const abs = useCallback((a: ComplexNumber | string): BigNumber => {
    const num = typeof a === 'string' ? parseComplex(a) : a
    return complexAbs(num)
  }, [])

  const arg = useCallback(
    (a: ComplexNumber | string, mode?: AngleMode): BigNumber => {
      const num = typeof a === 'string' ? parseComplex(a) : a
      return complexArg(num, mode || angleMode)
    },
    [angleMode]
  )

  const conjugate = useCallback((a: ComplexNumber | string): ComplexNumber => {
    const num = typeof a === 'string' ? parseComplex(a) : a
    return complexConjugate(num)
  }, [])

  const format = useCallback((a: ComplexNumber): string => {
    return formatComplex(a)
  }, [])

  const parse = useCallback((s: string): ComplexNumber => {
    return parseComplex(s)
  }, [])

  return {
    add,
    subtract,
    multiply,
    divide,
    abs,
    arg,
    conjugate,
    format,
    parse,
  }
}
