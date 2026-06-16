import { useRef, useEffect } from 'react'
import { useCalculatorStore } from '@/store/calculatorStore'
import { useTranslation } from 'react-i18next'

export default function ExpressionInput() {
  const { expression, setExpression, setCursorPosition, cursorPosition } = useCalculatorStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition)
    }
  }, [cursorPosition, expression])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpression(e.target.value)
    setCursorPosition(e.target.selectionStart ?? e.target.value.length)
  }

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    setCursorPosition(target.selectionStart ?? expression.length)
  }

  return (
    <div className="w-full rounded-2xl p-5 mb-4 bg-display-bg border border-border shadow-lg">
      <input
        ref={inputRef}
        type="text"
        value={expression}
        onChange={handleChange}
        onClick={handleClick}
        className="w-full bg-transparent outline-none text-3xl md:text-4xl font-mono text-text-primary caret-accent placeholder-text-secondary"
        placeholder={t('app.title')}
        spellCheck={false}
        autoFocus
      />
    </div>
  )
}
