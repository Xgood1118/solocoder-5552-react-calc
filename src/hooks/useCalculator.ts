import { useCallback, useMemo } from 'react'
import { useCalculatorStore } from '@/store/calculatorStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useVariableStore } from '@/store/variableStore'
import { calc } from '@/engine/evaluator'
import { CalcError, ERROR_CODES, getErrorMessage } from '@/engine/errors'
import type { HistoryEntry } from '@/types/calculator'

const OPERATORS = ['+', '-', '*', '/', '×', '÷', '^', '%', '!', '|', '(', ')', ',', '.']
const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

export function useCalculator() {
  const {
    expression,
    cursorPosition,
    result,
    lastResult,
    error,
    setExpression,
    setCursorPosition,
    setResult,
    setLastResult,
    addHistory,
    setError,
    clearError,
    backspace,
    insertAtCursor,
  } = useCalculatorStore()

  const { angleMode, lang, calcMode } = useSettingsStore()
  const { variables, setVariable } = useVariableStore()

  const variableMap = useMemo(() => {
    const map: Record<string, string> = {}
    Object.entries(variables).forEach(([k, v]) => {
      map[k] = v.value
    })
    return map
  }, [variables])

  const calculate = useCallback(() => {
    if (!expression.trim()) {
      setError(lang === 'zh' ? '请先输入表达式' : 'Please enter an expression')
      return
    }

    try {
      const ctx = {
        angleMode,
        ans: lastResult,
        variables: variableMap,
      }
      const calcResult = calc(expression, ctx)
      const resultStr = calcResult.value

      setResult(resultStr)
      setLastResult(resultStr)
      clearError()

      const entry: HistoryEntry = {
        id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
        expression,
        result: resultStr,
        timestamp: Date.now(),
      }
      addHistory(entry)
    } catch (e) {
      if (e instanceof CalcError) {
        setError(e.getMessage(lang))
      } else if (e instanceof Error) {
        setError(lang === 'zh' ? '计算错误: ' + e.message : 'Calculation error: ' + e.message)
      } else {
        setError(getErrorMessage(ERROR_CODES.INVALID_EXPRESSION, lang))
      }
    }
  }, [expression, angleMode, lastResult, variableMap, lang, setResult, setLastResult, clearError, addHistory, setError])

  const handleEqual = useCallback(() => {
    calculate()
  }, [calculate])

  const handleClear = useCallback(() => {
    setExpression('')
    setCursorPosition(0)
    setResult('')
    clearError()
  }, [setExpression, setCursorPosition, setResult, clearError])

  const handleBackspace = useCallback(() => {
    if (error) clearError()
    backspace()
  }, [error, clearError, backspace])

  const handleInsert = useCallback(
    (text: string) => {
      if (error) clearError()
      insertAtCursor(text)
    },
    [error, clearError, insertAtCursor]
  )

  const handleMoveCursorLeft = useCallback(() => {
    if (cursorPosition > 0) {
      setCursorPosition(cursorPosition - 1)
    }
  }, [cursorPosition, setCursorPosition])

  const handleMoveCursorRight = useCallback(() => {
    if (cursorPosition < expression.length) {
      setCursorPosition(cursorPosition + 1)
    }
  }, [cursorPosition, expression.length, setCursorPosition])

  const handleKeyPress = useCallback(
    (key: string) => {
      if (error) clearError()

      const lowerKey = key.toLowerCase()

      if (key === 'Enter' || key === '=') {
        handleEqual()
        return
      }

      if (key === 'Backspace') {
        handleBackspace()
        return
      }

      if (key === 'Delete' || key === 'Escape') {
        handleClear()
        return
      }

      if (key === 'ArrowLeft') {
        handleMoveCursorLeft()
        return
      }

      if (key === 'ArrowRight') {
        handleMoveCursorRight()
        return
      }

      if (NUMBERS.includes(key) || OPERATORS.includes(key)) {
        handleInsert(key)
        return
      }

      if (lowerKey === 'ans') {
        handleInsert('Ans')
        return
      }

      if (lowerKey === 'pi' || key === 'π') {
        handleInsert('π')
        return
      }

      if (lowerKey === 'e') {
        handleInsert('e')
        return
      }

      if (key.length === 1 && /[a-zA-Z]/.test(key)) {
        handleInsert(key)
      }
    },
    [error, clearError, handleEqual, handleBackspace, handleClear, handleMoveCursorLeft, handleMoveCursorRight, handleInsert]
  )

  const assignToVariable = useCallback(
    (name: string) => {
      if (!lastResult) {
        setError(lang === 'zh' ? '没有可赋值的结果' : 'No result to assign')
        return
      }
      setVariable(name, lastResult, lastResult)
    },
    [lastResult, lang, setVariable, setError]
  )

  return {
    expression,
    cursorPosition,
    result,
    lastResult,
    error,
    angleMode,
    calcMode,
    calculate,
    handleKeyPress,
    handleEqual,
    handleClear,
    handleBackspace,
    handleInsert,
    handleMoveCursorLeft,
    handleMoveCursorRight,
    assignToVariable,
  }
}
