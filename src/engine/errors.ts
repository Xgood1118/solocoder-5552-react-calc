export const ERROR_CODES = {
  DIVISION_BY_ZERO: 'DIVISION_BY_ZERO',
  INVALID_EXPRESSION: 'INVALID_EXPRESSION',
  DOMAIN_ERROR: 'DOMAIN_ERROR',
  OVERFLOW_ERROR: 'OVERFLOW_ERROR',
  NOT_INVERTIBLE: 'NOT_INVERTIBLE',
  DIMENSION_MISMATCH: 'DIMENSION_MISMATCH',
  INVALID_BASE: 'INVALID_BASE',
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

export const ERROR_MESSAGES_ZH: Record<ErrorCode, string> = {
  [ERROR_CODES.DIVISION_BY_ZERO]: '未定义',
  [ERROR_CODES.INVALID_EXPRESSION]: '输入有误',
  [ERROR_CODES.DOMAIN_ERROR]: '定义域错误',
  [ERROR_CODES.OVERFLOW_ERROR]: '溢出',
  [ERROR_CODES.NOT_INVERTIBLE]: '矩阵不可逆',
  [ERROR_CODES.DIMENSION_MISMATCH]: '矩阵维度不匹配',
  [ERROR_CODES.INVALID_BASE]: '进制格式错误',
}

export const ERROR_MESSAGES_EN: Record<ErrorCode, string> = {
  [ERROR_CODES.DIVISION_BY_ZERO]: 'Undefined',
  [ERROR_CODES.INVALID_EXPRESSION]: 'Invalid expression',
  [ERROR_CODES.DOMAIN_ERROR]: 'Domain error',
  [ERROR_CODES.OVERFLOW_ERROR]: 'Overflow',
  [ERROR_CODES.NOT_INVERTIBLE]: 'Matrix not invertible',
  [ERROR_CODES.DIMENSION_MISMATCH]: 'Dimension mismatch',
  [ERROR_CODES.INVALID_BASE]: 'Invalid base format',
}

export class CalcError extends Error {
  code: ErrorCode

  constructor(code: ErrorCode, lang: 'zh' | 'en' = 'zh') {
    const messages = lang === 'zh' ? ERROR_MESSAGES_ZH : ERROR_MESSAGES_EN
    super(messages[code])
    this.code = code
    this.name = 'CalcError'
  }

  getMessage(lang: 'zh' | 'en' = 'zh'): string {
    const messages = lang === 'zh' ? ERROR_MESSAGES_ZH : ERROR_MESSAGES_EN
    return messages[this.code]
  }
}

export function getErrorMessage(code: ErrorCode, lang: 'zh' | 'en' = 'zh'): string {
  const messages = lang === 'zh' ? ERROR_MESSAGES_ZH : ERROR_MESSAGES_EN
  return messages[code]
}
