import { useTranslation } from 'react-i18next'
import { useCalculator } from '@/hooks/useCalculator'

const complexKeys = [
  ['re', 'im', 'arg', 'conj', 'norm'],
  ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'],
  ['exp', 'abs', 'i', 'pi', 'e', '^'],
]

const numberKeys = [
  ['7', '8', '9', 'DEL', 'AC'],
  ['4', '5', '6', '*', '/'],
  ['1', '2', '3', '+', '-'],
  ['0', '.', '(', ')', '='],
]

export default function ComplexKeyboard() {
  const { t } = useTranslation()
  const { handleInsert, handleBackspace, handleClear, handleEqual, lastResult } = useCalculator()

  const handleKey = (key: string) => {
    if (key === 'DEL') {
      handleBackspace()
      return
    }
    if (key === 'AC') {
      handleClear()
      return
    }
    if (key === '=') {
      handleEqual()
      return
    }
    if (['re', 'im', 'arg', 'conj', 'norm', 'sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'exp', 'abs'].includes(key)) {
      handleInsert(`${key}(`)
      return
    }
    handleInsert(key)
  }

  const handleAns = () => {
    handleInsert(lastResult)
  }

  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-6 gap-2">
        {complexKeys.flat().map((key) => (
          <button
            key={key}
            onClick={() => handleKey(key)}
            className="h-12 rounded-xl bg-key-function text-text-primary text-sm font-medium hover:brightness-110 active:scale-95 transition-all shadow-sm border border-border"
          >
            {key}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-2">
        <button
          onClick={() => handleKey('asin(')}
          className="h-12 rounded-xl bg-key-operator text-text-primary text-sm font-medium hover:brightness-110 active:scale-95 transition-all shadow-sm border border-border"
        >
          asin
        </button>
        <button
          onClick={() => handleKey('acos(')}
          className="h-12 rounded-xl bg-key-operator text-text-primary text-sm font-medium hover:brightness-110 active:scale-95 transition-all shadow-sm border border-border"
        >
          acos
        </button>
        <button
          onClick={() => handleKey('atan(')}
          className="h-12 rounded-xl bg-key-operator text-text-primary text-sm font-medium hover:brightness-110 active:scale-95 transition-all shadow-sm border border-border"
        >
          atan
        </button>
        <button
          onClick={() => handleKey('sinh(')}
          className="h-12 rounded-xl bg-key-operator text-text-primary text-sm font-medium hover:brightness-110 active:scale-95 transition-all shadow-sm border border-border"
        >
          sinh
        </button>
        <button
          onClick={() => handleKey('cosh(')}
          className="h-12 rounded-xl bg-key-operator text-text-primary text-sm font-medium hover:brightness-110 active:scale-95 transition-all shadow-sm border border-border"
        >
          cosh
        </button>
        <button
          onClick={handleAns}
          className="h-12 rounded-xl bg-key-operator text-accent text-sm font-bold hover:brightness-110 active:scale-95 transition-all shadow-sm border border-border"
        >
          ANS
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {numberKeys.flat().map((key) => {
          let className = 'h-14 rounded-xl text-text-primary text-lg font-medium hover:brightness-110 active:scale-95 transition-all shadow-sm border border-border '
          if (key === '=') {
            className += 'bg-key-equal text-white font-bold'
          } else if (key === 'AC' || key === 'DEL') {
            className += 'bg-key-operator'
          } else if (['*', '/', '+', '-'].includes(key)) {
            className += 'bg-key-operator font-bold'
          } else {
            className += 'bg-key-bg'
          }
          return (
            <button
              key={key}
              onClick={() => handleKey(key)}
              className={className}
            >
              {key}
            </button>
          )
        })}
      </div>
    </div>
  )
}
