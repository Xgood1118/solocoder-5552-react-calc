import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'

type BaseKey = 2 | 8 | 10 | 16

interface BaseConverterProps {
  converter: {
    values: Record<BaseKey, string>
    error: string
    handleInputChange: (base: BaseKey) => (e: React.ChangeEvent<HTMLInputElement>) => void
  }
}

const baseConfigs: Array<{
  key: BaseKey
  labelKey: string
  tag: string
  gradient: string
  ring: string
  placeholder: string
}> = [
  { key: 2, labelKey: 'converter.binary', tag: 'BIN', gradient: 'from-rose-500 to-rose-600', ring: 'focus:ring-rose-500', placeholder: '1010.101' },
  { key: 8, labelKey: 'converter.octal', tag: 'OCT', gradient: 'from-amber-500 to-amber-600', ring: 'focus:ring-amber-500', placeholder: '12.5' },
  { key: 10, labelKey: 'converter.decimal', tag: 'DEC', gradient: 'from-sky-500 to-sky-600', ring: 'focus:ring-sky-500', placeholder: '10.625' },
  { key: 16, labelKey: 'converter.hexadecimal', tag: 'HEX', gradient: 'from-violet-500 to-violet-600', ring: 'focus:ring-violet-500', placeholder: 'A.A' },
]

const BaseConverter: React.FC<BaseConverterProps> = ({ converter }) => {
  const { t } = useTranslation()
  const { values, error, handleInputChange } = converter

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {baseConfigs.map((cfg) => (
          <div key={cfg.key} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 text-xs font-bold text-white rounded-md bg-gradient-to-r ${cfg.gradient}`}>
                  {cfg.tag}
                </span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t(cfg.labelKey)}
                </span>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Base {cfg.key}
              </span>
            </div>
            <input
              type="text"
              value={values[cfg.key]}
              onChange={handleInputChange(cfg.key)}
              placeholder={cfg.placeholder}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="characters"
              className={`w-full px-4 py-4 text-xl font-mono text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 ${cfg.ring} focus:border-transparent transition-all`}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Supports fractional parts (e.g. 0.625 = 0.101 binary). Valid characters per base:
        </p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs font-mono">
          <span className="text-rose-600 dark:text-rose-400">BIN: 0, 1</span>
          <span className="text-amber-600 dark:text-amber-400">OCT: 0-7</span>
          <span className="text-sky-600 dark:text-sky-400">DEC: 0-9</span>
          <span className="text-violet-600 dark:text-violet-400">HEX: 0-9, A-F</span>
        </div>
      </div>
    </div>
  )
}

export default BaseConverter
