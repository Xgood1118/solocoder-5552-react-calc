import { useTranslation } from 'react-i18next'
import { ArrowLeftRight } from 'lucide-react'
import type { UnitDef } from '@/types/units'

interface UnitConverterProps {
  converter: {
    units: UnitDef[]
    leftValue: string
    leftUnit: string
    rightValue: string
    rightUnit: string
    isTemperature: boolean
    handleLeftValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleRightValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleLeftUnitChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    handleRightUnitChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    swapUnits: () => void
  }
}

const UnitConverter: React.FC<UnitConverterProps> = ({ converter }) => {
  const { t } = useTranslation()
  const {
    units,
    leftValue,
    leftUnit,
    rightValue,
    rightUnit,
    isTemperature,
    handleLeftValueChange,
    handleRightValueChange,
    handleLeftUnitChange,
    handleRightUnitChange,
    swapUnits,
  } = converter

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-start md:items-center">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
            {t('converter.from')}
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={leftValue}
            onChange={handleLeftValueChange}
            placeholder="0"
            className="w-full px-4 py-4 text-2xl font-mono text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <select
            value={leftUnit}
            onChange={handleLeftUnitChange}
            className="w-full px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
          >
            {units.map((u) => (
              <option key={u.symbol} value={u.symbol}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="flex md:flex-col justify-center py-2">
          <button
            onClick={swapUnits}
            className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 active:scale-95"
            title="Swap"
          >
            <ArrowLeftRight size={24} />
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
            {t('converter.to')}
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={rightValue}
            onChange={handleRightValueChange}
            placeholder="0"
            className="w-full px-4 py-4 text-2xl font-mono text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          <select
            value={rightUnit}
            onChange={handleRightUnitChange}
            className="w-full px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
          >
            {units.map((u) => (
              <option key={u.symbol} value={u.symbol}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {isTemperature && (
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            Note: Temperature conversion uses non-linear formulas (offset + scaling)
          </p>
        </div>
      )}
    </div>
  )
}

export default UnitConverter
