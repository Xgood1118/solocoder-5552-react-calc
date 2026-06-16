import BigNumber from 'bignumber.js'
import { parse } from './parser'

BigNumber.config({
  EXPONENTIAL_AT: [-20, 20],
  RANGE: 500,
})
import type {
  ASTNode,
  NumberNode,
  ImagUnitNode,
  BinOpNode,
  UnOpNode,
  FactorialNode,
  AbsNode,
  FuncCallNode,
  ConstantNode,
  VariableNode,
  AnsNode,
} from './parser'
import type { AngleMode } from '@/types/calculator'
import type { ComplexNumber } from '@/types/complex'
import { getConstant, PI } from './constants'
import { ERROR_CODES, CalcError } from './errors'
import { parseComplex } from './complex'

type Value = BigNumber | ComplexNumber

function isComplex(v: Value): v is ComplexNumber {
  return typeof v === 'object' && v !== null && 're' in v && 'im' in v
}

function toComplex(v: Value): ComplexNumber {
  if (isComplex(v)) return v
  return { re: v, im: new BigNumber(0) }
}

function bnSin(x: BigNumber): BigNumber {
  return new BigNumber(Math.sin(x.toNumber()))
}

function bnCos(x: BigNumber): BigNumber {
  return new BigNumber(Math.cos(x.toNumber()))
}

function bnTan(x: BigNumber): BigNumber {
  return new BigNumber(Math.tan(x.toNumber()))
}

function bnAsin(x: BigNumber): BigNumber {
  return new BigNumber(Math.asin(x.toNumber()))
}

function bnAcos(x: BigNumber): BigNumber {
  return new BigNumber(Math.acos(x.toNumber()))
}

function bnAtan(x: BigNumber): BigNumber {
  return new BigNumber(Math.atan(x.toNumber()))
}

function bnAtan2(y: BigNumber, x: BigNumber): BigNumber {
  return new BigNumber(Math.atan2(y.toNumber(), x.toNumber()))
}

function bnExp(x: BigNumber): BigNumber {
  return new BigNumber(Math.exp(x.toNumber()))
}

function bnLn(x: BigNumber): BigNumber {
  return new BigNumber(Math.log(x.toNumber()))
}

function bnLog10(x: BigNumber): BigNumber {
  return new BigNumber(Math.log10(x.toNumber()))
}

function bnSqrt(x: BigNumber): BigNumber {
  return x.sqrt()
}

function bnSinh(x: BigNumber): BigNumber {
  return new BigNumber(Math.sinh(x.toNumber()))
}

function bnCosh(x: BigNumber): BigNumber {
  return new BigNumber(Math.cosh(x.toNumber()))
}

function add(a: Value, b: Value): Value {
  const ac = toComplex(a)
  const bc = toComplex(b)
  const result: ComplexNumber = {
    re: ac.re.plus(bc.re),
    im: ac.im.plus(bc.im),
  }
  return simplify(result)
}

function sub(a: Value, b: Value): Value {
  const ac = toComplex(a)
  const bc = toComplex(b)
  const result: ComplexNumber = {
    re: ac.re.minus(bc.re),
    im: ac.im.minus(bc.im),
  }
  return simplify(result)
}

function mul(a: Value, b: Value): Value {
  const ac = toComplex(a)
  const bc = toComplex(b)
  const result: ComplexNumber = {
    re: ac.re.times(bc.re).minus(ac.im.times(bc.im)),
    im: ac.re.times(bc.im).plus(ac.im.times(bc.re)),
  }
  return simplify(result)
}

function div(a: Value, b: Value): Value {
  const ac = toComplex(a)
  const bc = toComplex(b)
  const denom = bc.re.times(bc.re).plus(bc.im.times(bc.im))
  if (denom.isZero()) {
    throw new CalcError(ERROR_CODES.DIVISION_BY_ZERO)
  }
  const result: ComplexNumber = {
    re: ac.re.times(bc.re).plus(ac.im.times(bc.im)).dividedBy(denom),
    im: ac.im.times(bc.re).minus(ac.re.times(bc.im)).dividedBy(denom),
  }
  return simplify(result)
}

function mod(a: Value, b: Value): Value {
  if (isComplex(a) || isComplex(b)) {
    throw new CalcError(ERROR_CODES.DOMAIN_ERROR)
  }
  return a.modulo(b)
}

function power(base: Value, exp: Value): Value {
  if (isComplex(exp)) {
    const bc = toComplex(base)
    const r = bnSqrt(bc.re.times(bc.re).plus(bc.im.times(bc.im)))
    const theta = bnAtan2(bc.im, bc.re)
    const lnR = bnLn(r)
    const expC = exp
    const a = lnR.times(expC.re).minus(theta.times(expC.im))
    const b = lnR.times(expC.im).plus(theta.times(expC.re))
    const ea = bnExp(a)
    const result: ComplexNumber = {
      re: ea.times(bnCos(b)),
      im: ea.times(bnSin(b)),
    }
    return simplify(result)
  }

  if (isComplex(base)) {
    return power(base, toComplex(exp))
  }

  if (base.isNegative() && !exp.isInteger()) {
    const bc = toComplex(base)
    const ec = toComplex(exp)
    return power(bc, ec)
  }

  if (base.isZero() && exp.isNegative()) {
    throw new CalcError(ERROR_CODES.DIVISION_BY_ZERO)
  }

  return base.pow(exp)
}

function negate(v: Value): Value {
  if (isComplex(v)) {
    return simplify({ re: v.re.negated(), im: v.im.negated() })
  }
  return v.negated()
}

function factorial(n: BigNumber): BigNumber {
  if (!n.isInteger() || n.isNegative()) {
    throw new CalcError(ERROR_CODES.DOMAIN_ERROR)
  }
  let result = new BigNumber(1)
  const num = n.toNumber()
  for (let i = 2; i <= num; i++) {
    result = result.times(i)
  }
  return result
}

function combination(n: BigNumber, k: BigNumber): BigNumber {
  if (!n.isInteger() || !k.isInteger() || n.isNegative() || k.isNegative() || n.isLessThan(k)) {
    throw new CalcError(ERROR_CODES.DOMAIN_ERROR)
  }
  return factorial(n).dividedBy(factorial(k).times(factorial(n.minus(k))))
}

function permutation(n: BigNumber, k: BigNumber): BigNumber {
  if (!n.isInteger() || !k.isInteger() || n.isNegative() || k.isNegative() || n.isLessThan(k)) {
    throw new CalcError(ERROR_CODES.DOMAIN_ERROR)
  }
  return factorial(n).dividedBy(factorial(n.minus(k)))
}

function sin(x: Value, angleMode: AngleMode): Value {
  if (isComplex(x)) {
    const a = x.re
    const b = x.im
    return simplify({
      re: bnSin(a).times(bnCosh(b)),
      im: bnCos(a).times(bnSinh(b)),
    })
  }
  const v = toRadians(x, angleMode)
  return bnSin(v)
}

function cos(x: Value, angleMode: AngleMode): Value {
  if (isComplex(x)) {
    const a = x.re
    const b = x.im
    return simplify({
      re: bnCos(a).times(bnCosh(b)),
      im: bnSin(a).times(bnSinh(b)).negated(),
    })
  }
  const v = toRadians(x, angleMode)
  return bnCos(v)
}

function tan(x: Value, angleMode: AngleMode): Value {
  const s = sin(x, angleMode)
  const c = cos(x, angleMode)
  return div(s, c)
}

function sinh(x: Value): Value {
  if (isComplex(x)) {
    const a = x.re
    const b = x.im
    return simplify({
      re: bnSinh(a).times(bnCos(b)),
      im: bnCosh(a).times(bnSin(b)),
    })
  }
  return bnSinh(x)
}

function cosh(x: Value): Value {
  if (isComplex(x)) {
    const a = x.re
    const b = x.im
    return simplify({
      re: bnCosh(a).times(bnCos(b)),
      im: bnSinh(a).times(bnSin(b)),
    })
  }
  return bnCosh(x)
}

function tanh(x: Value): Value {
  const s = sinh(x)
  const c = cosh(x)
  return div(s, c)
}

function asin(x: Value, angleMode: AngleMode): Value {
  if (isComplex(x)) {
    const negOne: ComplexNumber = { re: new BigNumber(-1), im: new BigNumber(0) }
    const xSq = mul(x, x)
    const oneMinusXsq = add(negOne, xSq)
    const sqrtTerm = complexPow(toComplex(oneMinusXsq), { re: new BigNumber('0.5'), im: new BigNumber(0) })
    const ix = toComplex(x)
    const term = mul({ re: new BigNumber(0), im: new BigNumber(1) }, add(ix, sqrtTerm))
    return complexLn(toComplex(term))
  }
  if (x.abs().isGreaterThan(1)) {
    const ix: ComplexNumber = { re: x, im: new BigNumber(0) }
    const one: ComplexNumber = { re: new BigNumber(1), im: new BigNumber(0) }
    return complexLn(
      toComplex(
        add(
          mul({ re: new BigNumber(0), im: new BigNumber(1) }, ix),
          complexPow(
            toComplex(sub(one, mul(ix, ix))),
            { re: new BigNumber('0.5'), im: new BigNumber(0) }
          )
        )
      )
    )
  }
  const result = bnAsin(x)
  return fromRadians(result, angleMode)
}

function acos(x: Value, angleMode: AngleMode): Value {
  if (isComplex(x) || x.abs().isGreaterThan(1)) {
    const halfPi = PI.dividedBy(2)
    const asinVal = asin(x, 'rad')
    if (isComplex(asinVal)) {
      return simplify({
        re: halfPi.minus(asinVal.re),
        im: asinVal.im.negated(),
      })
    }
    return fromRadians(halfPi.minus(asinVal), angleMode)
  }
  const result = bnAcos(x)
  return fromRadians(result, angleMode)
}

function atan(x: Value, angleMode: AngleMode): Value {
  if (isComplex(x)) {
    const i: ComplexNumber = { re: new BigNumber(0), im: new BigNumber(1) }
    const ix = mul(i, x)
    const one: ComplexNumber = { re: new BigNumber(1), im: new BigNumber(0) }
    const numerator = add(one, ix)
    const denominator = sub(one, ix)
    const ratio = div(numerator, denominator)
    const lnVal = complexLn(toComplex(ratio))
    const half: ComplexNumber = { re: new BigNumber('0.5'), im: new BigNumber(0) }
    const negI: ComplexNumber = { re: new BigNumber(0), im: new BigNumber(-1) }
    return mul(mul(negI, half), lnVal)
  }
  const result = bnAtan(x)
  return fromRadians(result, angleMode)
}

function naturalLog(x: Value): Value {
  if (isComplex(x)) {
    return complexLn(x)
  }
  if (x.isNegative() || x.isZero()) {
    return complexLn({ re: x, im: new BigNumber(0) })
  }
  return bnLn(x)
}

function commonLog(x: Value): Value {
  if (isComplex(x) || x.isNegative() || x.isZero()) {
    const lnVal = naturalLog(x)
    if (isComplex(lnVal)) {
      return simplify({
        re: lnVal.re.dividedBy(bnLn(new BigNumber(10))),
        im: lnVal.im.dividedBy(bnLn(new BigNumber(10))),
      })
    }
    return lnVal.dividedBy(bnLn(new BigNumber(10)))
  }
  return bnLog10(x)
}

function logBase(base: Value, x: Value): Value {
  const lnX = naturalLog(x)
  const lnBase = naturalLog(base)
  return div(lnX, lnBase)
}

function exp(x: Value): Value {
  if (isComplex(x)) {
    const ea = bnExp(x.re)
    return simplify({
      re: ea.times(bnCos(x.im)),
      im: ea.times(bnSin(x.im)),
    })
  }
  return bnExp(x)
}

function squareRoot(x: Value): Value {
  return power(x, new BigNumber('0.5'))
}

function nthRoot(n: Value, x: Value): Value {
  const exponent = div(new BigNumber(1), n)
  return power(x, exponent)
}

function absVal(v: Value): Value {
  if (isComplex(v)) {
    return bnSqrt(v.re.times(v.re).plus(v.im.times(v.im)))
  }
  return v.abs()
}

function floor(v: Value): Value {
  if (isComplex(v)) {
    return simplify({
      re: v.re.integerValue(BigNumber.ROUND_FLOOR),
      im: v.im.integerValue(BigNumber.ROUND_FLOOR),
    })
  }
  return v.integerValue(BigNumber.ROUND_FLOOR)
}

function ceil(v: Value): Value {
  if (isComplex(v)) {
    return simplify({
      re: v.re.integerValue(BigNumber.ROUND_CEIL),
      im: v.im.integerValue(BigNumber.ROUND_CEIL),
    })
  }
  return v.integerValue(BigNumber.ROUND_CEIL)
}

function round(v: Value): Value {
  if (isComplex(v)) {
    return simplify({
      re: v.re.integerValue(BigNumber.ROUND_HALF_UP),
      im: v.im.integerValue(BigNumber.ROUND_HALF_UP),
    })
  }
  return v.integerValue(BigNumber.ROUND_HALF_UP)
}

function toRadians(x: BigNumber, mode: AngleMode): BigNumber {
  if (mode === 'deg') {
    return x.times(PI).dividedBy(180)
  }
  return x
}

function fromRadians(x: BigNumber, mode: AngleMode): BigNumber {
  if (mode === 'deg') {
    return x.times(180).dividedBy(PI)
  }
  return x
}

function simplify(v: ComplexNumber): Value {
  const EPSILON = new BigNumber('1e-12')
  let re = v.re
  let im = v.im
  const maxAbs = BigNumber.max(re.abs(), im.abs())
  const relEps = BigNumber.max(maxAbs.times(EPSILON), EPSILON)
  if (im.abs().isLessThan(relEps)) {
    im = new BigNumber(0)
  }
  if (re.abs().isLessThan(relEps) && !im.isZero()) {
    re = new BigNumber(0)
  }
  if (im.isZero()) return re
  return { re, im }
}

function complexLn(z: ComplexNumber): ComplexNumber {
  const r = bnSqrt(z.re.times(z.re).plus(z.im.times(z.im)))
  let theta = bnAtan2(z.im, z.re)
  if (z.re.isNegative() && z.im.isZero()) {
    theta = PI
  }
  return {
    re: bnLn(r),
    im: theta,
  }
}

function complexPow(z: ComplexNumber, w: ComplexNumber): ComplexNumber {
  const r = bnSqrt(z.re.times(z.re).plus(z.im.times(z.im)))
  let theta = bnAtan2(z.im, z.re)
  if (z.re.isNegative() && z.im.isZero()) theta = PI
  const lnR = bnLn(r)
  const a = lnR.times(w.re).minus(theta.times(w.im))
  const b = lnR.times(w.im).plus(theta.times(w.re))
  const ea = bnExp(a)
  return {
    re: ea.times(bnCos(b)),
    im: ea.times(bnSin(b)),
  }
}

interface EvalContext {
  angleMode: AngleMode
  ans: string
  variables: Record<string, string>
}

export function evaluate(node: ASTNode, ctx: EvalContext): Value {
  switch (node.type) {
    case 'Number': {
      const n = node as NumberNode
      return n.value
    }
    case 'ImagUnit': {
      return { re: new BigNumber(0), im: new BigNumber(1) }
    }
    case 'BinOp': {
      const n = node as BinOpNode
      const left = evaluate(n.left, ctx)
      const right = evaluate(n.right, ctx)
      switch (n.op) {
        case '+': return add(left, right)
        case '-': return sub(left, right)
        case '*': return mul(left, right)
        case '/': return div(left, right)
        case '%': return mod(left, right)
        case '^': return power(left, right)
      }
      break
    }
    case 'UnOp': {
      const n = node as UnOpNode
      const operand = evaluate(n.operand, ctx)
      if (n.op === '-') return negate(operand)
      return operand
    }
    case 'Factorial': {
      const n = node as FactorialNode
      const operand = evaluate(n.operand, ctx)
      if (isComplex(operand)) {
        throw new CalcError(ERROR_CODES.DOMAIN_ERROR)
      }
      return factorial(operand)
    }
    case 'Abs': {
      const n = node as AbsNode
      const operand = evaluate(n.operand, ctx)
      return absVal(operand)
    }
    case 'FuncCall': {
      const n = node as FuncCallNode
      const args = n.args.map((a) => evaluate(a, ctx))

      switch (n.name) {
        case 'sin':
          return sin(args[0], ctx.angleMode)
        case 'cos':
          return cos(args[0], ctx.angleMode)
        case 'tan':
          return tan(args[0], ctx.angleMode)
        case 'asin':
          return asin(args[0], ctx.angleMode)
        case 'acos':
          return acos(args[0], ctx.angleMode)
        case 'atan':
          return atan(args[0], ctx.angleMode)
        case 'sinh':
          return sinh(args[0])
        case 'cosh':
          return cosh(args[0])
        case 'tanh':
          return tanh(args[0])
        case 'ln':
          return naturalLog(args[0])
        case 'log':
          if (args.length === 2) {
            return logBase(args[0], args[1])
          }
          return commonLog(args[0])
        case 'exp':
          return exp(args[0])
        case 'sqrt':
          return squareRoot(args[0])
        case 'nrt':
          return nthRoot(args[0], args[1])
        case 'abs':
          return absVal(args[0])
        case 'floor':
          return floor(args[0])
        case 'ceil':
          return ceil(args[0])
        case 'round':
          return round(args[0])
        case 'mod':
          return mod(args[0], args[1])
        case 'C': {
          if (isComplex(args[0]) || isComplex(args[1])) {
            throw new CalcError(ERROR_CODES.DOMAIN_ERROR)
          }
          return combination(args[0] as BigNumber, args[1] as BigNumber)
        }
        case 'P': {
          if (isComplex(args[0]) || isComplex(args[1])) {
            throw new CalcError(ERROR_CODES.DOMAIN_ERROR)
          }
          return permutation(args[0] as BigNumber, args[1] as BigNumber)
        }
        case 'fact': {
          if (isComplex(args[0])) {
            throw new CalcError(ERROR_CODES.DOMAIN_ERROR)
          }
          return factorial(args[0] as BigNumber)
        }
        default:
          throw new CalcError(ERROR_CODES.INVALID_EXPRESSION)
      }
    }
    case 'Constant': {
      const n = node as ConstantNode
      const c = getConstant(n.name)
      if (!c) throw new CalcError(ERROR_CODES.INVALID_EXPRESSION)
      return c
    }
    case 'Variable': {
      const n = node as VariableNode
      const v = ctx.variables[n.name]
      if (v !== undefined) {
        try {
          return new BigNumber(v)
        } catch {
          throw new CalcError(ERROR_CODES.INVALID_EXPRESSION)
        }
      }
      throw new CalcError(ERROR_CODES.INVALID_EXPRESSION)
    }
    case 'Ans': {
      if (!ctx.ans) throw new CalcError(ERROR_CODES.INVALID_EXPRESSION)
      try {
        if (ctx.ans.includes('i') || ctx.ans.includes('+') || ctx.ans.includes('-')) {
          const c = parseComplex(ctx.ans)
          return c
        }
        return new BigNumber(ctx.ans)
      } catch {
        throw new CalcError(ERROR_CODES.INVALID_EXPRESSION)
      }
    }
  }
  throw new CalcError(ERROR_CODES.INVALID_EXPRESSION)
}

export function valueToString(v: Value): string {
  if (isComplex(v)) {
    return formatComplexString(v)
  }
  return formatReal(v)
}

function formatReal(n: BigNumber): string {
  if (n.isNaN()) return 'NaN'
  if (!n.isFinite()) return n.isNegative() ? '-∞' : '∞'

  const abs = n.abs()

  if (abs.isZero()) return '0'

  if (abs.isGreaterThanOrEqualTo('1e15') || abs.isLessThan('1e-10')) {
    return n.toExponential(10).replace(/\.?0+e/, 'e')
  }

  const dp = 12
  const rounded = n.decimalPlaces(dp, BigNumber.ROUND_HALF_UP)
  let s = rounded.toFixed(dp)

  if (s.includes('.')) {
    s = s.replace(/0+$/, '').replace(/\.$/, '')
  }

  if (s === '-0') s = '0'
  return s
}

function formatComplexString(c: ComplexNumber): string {
  const reStr = formatReal(c.re)
  const imStr = formatReal(c.im.abs())

  if (c.im.isZero()) return reStr
  if (c.re.isZero()) {
    if (c.im.eq(1)) return 'i'
    if (c.im.eq(-1)) return '-i'
    return c.im.isNegative() ? '-' + imStr + 'i' : imStr + 'i'
  }

  const sign = c.im.isNegative() ? '-' : '+'
  const imPart = c.im.abs().eq(1) ? 'i' : imStr + 'i'
  return `${reStr}${sign}${imPart}`
}

export interface CalcResult {
  value: string
  isComplex: boolean
  complexRe?: string
  complexIm?: string
}

export function calc(
  expression: string,
  ctx: EvalContext
): CalcResult {
  const node = parse(expression)
  const result = evaluate(node, ctx)
  const s = valueToString(result)
  if (isComplex(result)) {
    return {
      value: s,
      isComplex: true,
      complexRe: formatReal(result.re),
      complexIm: formatReal(result.im),
    }
  }
  return {
    value: s,
    isComplex: false,
  }
}
