import { useCalculatorStore } from '@/store/calculatorStore'
import { useTranslation } from 'react-i18next'

export default function ResultDisplay() {
  const { result, error } = useCalculatorStore()
  const { t } = useTranslation()

  return (
    <div className="flex items-end justify-between min-h-[3rem] mt-2">
      <div className="text-sm text-text-secondary">
        {error ? <span className="text-error">{error}</span> : null}
      </div>
      <div className="text-2xl md:text-3xl font-mono font-semibold text-accent">
        {result || t('calc.result')}
      </div>
    </div>
  )
}
