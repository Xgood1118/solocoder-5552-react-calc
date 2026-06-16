import BigNumber from 'bignumber.js'
import { ERROR_CODES, CalcError } from './errors'

export type TokenType =
  | 'NUMBER'
  | 'IMAG_UNIT'
  | 'OP_ADD'
  | 'OP_SUB'
  | 'OP_MUL'
  | 'OP_DIV'
  | 'OP_MOD'
  | 'OP_POW'
  | 'OP_FACT'
  | 'OP_ABS_OPEN'
  | 'OP_ABS_CLOSE'
  | 'LPAREN'
  | 'RPAREN'
  | 'COMMA'
  | 'FUNC'
  | 'CONSTANT'
  | 'VARIABLE'
  | 'ANS'
  | 'EOF'

export interface Token {
  type: TokenType
  value: string
  position: number
  funcName?: string
}

export type NodeType =
  | 'Number'
  | 'ImagUnit'
  | 'BinOp'
  | 'UnOp'
  | 'Factorial'
  | 'Abs'
  | 'FuncCall'
  | 'Constant'
  | 'Variable'
  | 'Ans'

export interface ASTNode {
  type: NodeType
  [key: string]: unknown
}

export interface NumberNode extends ASTNode {
  type: 'Number'
  value: BigNumber
}

export interface ImagUnitNode extends ASTNode {
  type: 'ImagUnit'
}

export interface BinOpNode extends ASTNode {
  type: 'BinOp'
  op: '+' | '-' | '*' | '/' | '%' | '^'
  left: ASTNode
  right: ASTNode
}

export interface UnOpNode extends ASTNode {
  type: 'UnOp'
  op: '+' | '-'
  operand: ASTNode
}

export interface FactorialNode extends ASTNode {
  type: 'Factorial'
  operand: ASTNode
}

export interface AbsNode extends ASTNode {
  type: 'Abs'
  operand: ASTNode
}

export interface FuncCallNode extends ASTNode {
  type: 'FuncCall'
  name: string
  args: ASTNode[]
}

export interface ConstantNode extends ASTNode {
  type: 'Constant'
  name: string
}

export interface VariableNode extends ASTNode {
  type: 'Variable'
  name: string
}

export interface AnsNode extends ASTNode {
  type: 'Ans'
}

const FUNCTION_NAMES = [
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'sinh',
  'cosh',
  'tanh',
  'ln',
  'log',
  'exp',
  'sqrt',
  'nrt',
  'abs',
  'floor',
  'ceil',
  'round',
  'mod',
  'C',
  'P',
  'fact',
]

const CONSTANT_NAMES = ['pi', 'e', 'phi', 'g', 'c', 'h', 'π', 'φ', 'PI', 'E', 'PHI', 'G', 'H']

export function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  const len = input.length

  while (i < len) {
    const ch = input[i]

    if (ch === ' ' || ch === '\t' || ch === '\n') {
      i++
      continue
    }

    if (/[0-9.]/.test(ch)) {
      let numStr = ''
      const start = i
      while (i < len && /[0-9.]/.test(input[i])) {
        numStr += input[i]
        i++
      }
      if (i < len && (input[i] === 'e' || input[i] === 'E')) {
        numStr += input[i]
        i++
        if (i < len && (input[i] === '+' || input[i] === '-')) {
          numStr += input[i]
          i++
        }
        while (i < len && /[0-9]/.test(input[i])) {
          numStr += input[i]
          i++
        }
      }
      try {
        new BigNumber(numStr)
      } catch {
        throw new CalcError(ERROR_CODES.INVALID_EXPRESSION)
      }
      tokens.push({ type: 'NUMBER', value: numStr, position: start })
      continue
    }

    if (ch === '|') {
      let lastAbs: Token | undefined
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].type === 'OP_ABS_OPEN' || tokens[j].type === 'OP_ABS_CLOSE') {
          lastAbs = tokens[j]
          break
        }
      }
      if (!lastAbs || lastAbs.type === 'OP_ABS_CLOSE') {
        tokens.push({ type: 'OP_ABS_OPEN', value: '|', position: i })
      } else {
        tokens.push({ type: 'OP_ABS_CLOSE', value: '|', position: i })
      }
      i++
      continue
    }

    if (/[a-zA-Z]/.test(ch)) {
      let word = ''
      const start = i
      while (i < len && /[a-zA-Z]/.test(input[i])) {
        word += input[i]
        i++
      }

      if (word === 'i' || word === 'I' || word === 'j') {
        tokens.push({ type: 'IMAG_UNIT', value: 'i', position: start })
      } else if (word === 'Ans' || word === 'ans' || word === 'ANS') {
        tokens.push({ type: 'ANS', value: 'Ans', position: start })
      } else if (CONSTANT_NAMES.includes(word)) {
        tokens.push({ type: 'CONSTANT', value: word, position: start })
      } else if (FUNCTION_NAMES.includes(word)) {
        tokens.push({ type: 'FUNC', value: word, position: start, funcName: word })
      } else if (word.length === 1 && word >= 'A' && word <= 'Z') {
        tokens.push({ type: 'VARIABLE', value: word, position: start })
      } else {
        throw new CalcError(ERROR_CODES.INVALID_EXPRESSION)
      }
      continue
    }

    switch (ch) {
      case '+':
        tokens.push({ type: 'OP_ADD', value: '+', position: i })
        break
      case '−':
      case '-':
        tokens.push({ type: 'OP_SUB', value: '-', position: i })
        break
      case '×':
      case '*':
        tokens.push({ type: 'OP_MUL', value: '*', position: i })
        break
      case '÷':
      case '/':
        tokens.push({ type: 'OP_DIV', value: '/', position: i })
        break
      case '%':
        tokens.push({ type: 'OP_MOD', value: '%', position: i })
        break
      case '^':
        tokens.push({ type: 'OP_POW', value: '^', position: i })
        break
      case '!':
        tokens.push({ type: 'OP_FACT', value: '!', position: i })
        break
      case '(':
        tokens.push({ type: 'LPAREN', value: '(', position: i })
        break
      case ')':
        tokens.push({ type: 'RPAREN', value: ')', position: i })
        break
      case ',':
        tokens.push({ type: 'COMMA', value: ',', position: i })
        break
      default:
        throw new CalcError(ERROR_CODES.INVALID_EXPRESSION)
    }
    i++
  }

  tokens.push({ type: 'EOF', value: '', position: i })
  return insertImplicitMultiplication(tokens)
}

function insertImplicitMultiplication(tokens: Token[]): Token[] {
  const result: Token[] = []
  for (let i = 0; i < tokens.length; i++) {
    const curr = tokens[i]
    const prev = result[result.length - 1]

    if (prev) {
      const needMul =
        (prev.type === 'NUMBER' &&
          (curr.type === 'LPAREN' ||
            curr.type === 'FUNC' ||
            curr.type === 'CONSTANT' ||
            curr.type === 'VARIABLE' ||
            curr.type === 'IMAG_UNIT' ||
            curr.type === 'OP_ABS_OPEN')) ||
        (prev.type === 'RPAREN' &&
          (curr.type === 'LPAREN' ||
            curr.type === 'NUMBER' ||
            curr.type === 'FUNC' ||
            curr.type === 'CONSTANT' ||
            curr.type === 'VARIABLE' ||
            curr.type === 'IMAG_UNIT' ||
            curr.type === 'OP_ABS_OPEN')) ||
        (prev.type === 'OP_ABS_CLOSE' &&
          (curr.type === 'LPAREN' ||
            curr.type === 'NUMBER' ||
            curr.type === 'FUNC' ||
            curr.type === 'CONSTANT' ||
            curr.type === 'VARIABLE' ||
            curr.type === 'IMAG_UNIT' ||
            curr.type === 'OP_ABS_OPEN')) ||
        ((prev.type === 'CONSTANT' || prev.type === 'VARIABLE' || prev.type === 'IMAG_UNIT') &&
          (curr.type === 'LPAREN' ||
            curr.type === 'NUMBER' ||
            curr.type === 'CONSTANT' ||
            curr.type === 'VARIABLE' ||
            curr.type === 'IMAG_UNIT' ||
            curr.type === 'OP_ABS_OPEN')) ||
        (prev.type === 'OP_FACT' &&
          (curr.type === 'LPAREN' ||
            curr.type === 'NUMBER' ||
            curr.type === 'FUNC' ||
            curr.type === 'CONSTANT' ||
            curr.type === 'VARIABLE' ||
            curr.type === 'IMAG_UNIT' ||
            curr.type === 'OP_ABS_OPEN'))

      if (needMul && curr.type !== 'EOF') {
        result.push({ type: 'OP_MUL', value: '*', position: curr.position })
      }
    }
    result.push(curr)
  }
  return result
}

class Parser {
  private tokens: Token[]
  private pos: number = 0

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  private peek(offset = 0): Token {
    return this.tokens[this.pos + offset] ?? this.tokens[this.tokens.length - 1]
  }

  private consume(type: TokenType): Token {
    const tok = this.peek()
    if (tok.type !== type) {
      throw new CalcError(ERROR_CODES.INVALID_EXPRESSION)
    }
    this.pos++
    return tok
  }

  parse(): ASTNode {
    const node = this.parseAddSub()
    if (this.peek().type !== 'EOF') {
      throw new CalcError(ERROR_CODES.INVALID_EXPRESSION)
    }
    return node
  }

  private parseAddSub(): ASTNode {
    let left = this.parseMulDiv()

    while (this.peek().type === 'OP_ADD' || this.peek().type === 'OP_SUB') {
      const op = this.peek().type === 'OP_ADD' ? '+' : '-'
      this.pos++
      const right = this.parseMulDiv()
      left = { type: 'BinOp', op, left, right }
    }

    return left
  }

  private parseMulDiv(): ASTNode {
    let left = this.parseUnary()

    while (
      this.peek().type === 'OP_MUL' ||
      this.peek().type === 'OP_DIV' ||
      this.peek().type === 'OP_MOD'
    ) {
      const tok = this.peek()
      let op: '+' | '-' | '*' | '/' | '%' | '^'
      if (tok.type === 'OP_MUL') op = '*'
      else if (tok.type === 'OP_DIV') op = '/'
      else op = '%'
      this.pos++
      const right = this.parseUnary()
      left = { type: 'BinOp', op, left, right }
    }

    return left
  }

  private parseUnary(): ASTNode {
    if (this.peek().type === 'OP_ADD') {
      this.pos++
      const operand = this.parseUnary()
      return { type: 'UnOp', op: '+', operand }
    }
    if (this.peek().type === 'OP_SUB') {
      this.pos++
      const operand = this.parseUnary()
      return { type: 'UnOp', op: '-', operand }
    }
    return this.parseFactorial()
  }

  private parseFactorial(): ASTNode {
    let operand = this.parsePower()

    while (this.peek().type === 'OP_FACT') {
      this.pos++
      operand = { type: 'Factorial', operand }
    }

    return operand
  }

  private parsePower(): ASTNode {
    const base = this.parseAbs()

    if (this.peek().type === 'OP_POW') {
      this.pos++
      const exp = this.parseUnary()
      return { type: 'BinOp', op: '^', left: base, right: exp }
    }

    return base
  }

  private parseAbs(): ASTNode {
    if (this.peek().type === 'OP_ABS_OPEN') {
      this.pos++
      const operand = this.parseAddSub()
      this.consume('OP_ABS_CLOSE')
      return { type: 'Abs', operand }
    }
    return this.parsePrimary()
  }

  private parsePrimary(): ASTNode {
    const tok = this.peek()

    switch (tok.type) {
      case 'NUMBER': {
        this.pos++
        return { type: 'Number', value: new BigNumber(tok.value) }
      }
      case 'IMAG_UNIT': {
        this.pos++
        return { type: 'ImagUnit' }
      }
      case 'LPAREN': {
        this.pos++
        const node = this.parseAddSub()
        this.consume('RPAREN')
        return node
      }
      case 'FUNC': {
        this.pos++
        const name = tok.funcName!
        this.consume('LPAREN')
        const args: ASTNode[] = []
        if (this.peek().type !== 'RPAREN') {
          args.push(this.parseAddSub())
          while (this.peek().type === 'COMMA') {
            this.pos++
            args.push(this.parseAddSub())
          }
        }
        this.consume('RPAREN')
        return { type: 'FuncCall', name, args }
      }
      case 'CONSTANT': {
        this.pos++
        return { type: 'Constant', name: tok.value }
      }
      case 'VARIABLE': {
        this.pos++
        return { type: 'Variable', name: tok.value }
      }
      case 'ANS': {
        this.pos++
        return { type: 'Ans' }
      }
      default:
        throw new CalcError(ERROR_CODES.INVALID_EXPRESSION)
    }
  }
}

export function parse(input: string): ASTNode {
  const tokens = tokenize(input)
  const parser = new Parser(tokens)
  return parser.parse()
}
