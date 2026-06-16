import { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import { AlertCircle, Copy, Check } from 'lucide-react'
import { formatMatrix } from '@/engine/matrix'

type MatrixResultData =
  | { type: 'matrix'; value: BigNumber[][] }
  | { type: 'scalar'; value: BigNumber; label?: string }
  | { type: 'eigenvalues'; values: BigNumber[] }
  | { type: 'lu'; L: BigNumber[][]; U: BigNumber[][] }
  | { type: 'qr'; Q: BigNumber[][]; R: BigNumber[][] }
  | { type: 'error'; message: string }
  | null

interface MatrixResultProps {
  result: MatrixResultData
  onCopy?: () => void
  canCopy?: boolean
}

const formatNum = (v: BigNumber): string => {
  const abs = v.abs()
  if (abs.isZero()) return '0'
  if (abs.isGreaterThan(new BigNumber('1e10')) || abs.isLessThan(new BigNumber('1e-6'))) {
    return v.toExponential(6)
  }
  const str = v.dp(8, BigNumber.ROUND_HALF_UP).toString()
  return str.replace(/\.?0+$/, '')
}

const renderMatrix = (m: BigNumber[][]) => {
  const rows = m.length
  const cols = m[0]?.length ?? 0
  return (
    <div className="inline-flex items-stretch">
      <div className="flex items-center">
        <div className="w-3 h-full border-l-4 border-t-4 border-b-4 border-gray-700 dark:border-gray-300 rounded-l-xl" />
      </div>
      <table className="mx-2 border-collapse">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: cols }).map((_, j) => (
                <td
                  key={j}
                  className="px-3 py-2 text-center font-mono text-base text-gray-800 dark:text-gray-100 min-w-[60px]"
                >
                  {formatNum(m[i][j])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center">
        <div className="w-3 h-full border-r-4 border-t-4 border-b-4 border-gray-700 dark:border-gray-300 rounded-r-xl" />
      </div>
    </div>
  )
}

const getCopyText = (result: MatrixResultData): string => {
  if (!result) return ''
  switch (result.type) {
    case 'matrix':
      return formatMatrix(result.value)
    case 'scalar':
      return result.value.toString()
    case 'eigenvalues':
      return result.values.map((v) => v.toString()).join(', ')
    case 'lu':
      return `L:\n${formatMatrix(result.L)}\n\nU:\n${formatMatrix(result.U)}`
    case 'qr':
      return `Q:\n${formatMatrix(result.Q)}\n\nR:\n${formatMatrix(result.R)}`
    case 'error':
      return result.message
    default:
      return ''
  }
}

const MatrixResult: React.FC<MatrixResultProps> = ({ result, onCopy, canCopy }) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = getCopyText(result)
    if (text) {
      navigator.clipboard.writeText(text)
      if (onCopy) {
        onCopy()
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const showCopyButton = canCopy !== undefined ? canCopy : result !== null && result.type !== 'error'

  if (!result) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 min-h-[200px] flex items-center justify-center">
        <p className="text-gray-400 dark:text-gray-500 text-lg italic">
          {t('matrix.result')}...
        </p>
      </div>
    )
  }

  if (result.type === 'error') {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 shadow-lg border border-red-200 dark:border-red-800 min-h-[200px]">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h4 className="text-red-700 dark:text-red-300 font-semibold text-lg mb-1">
              Error
            </h4>
            <p className="text-red-600 dark:text-red-400 text-base">
              {result.message}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 min-h-[200px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {t('matrix.result')}
        </h3>
        {showCopyButton && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {copied ? (
              <>
                <Check size={16} className="text-green-500" />
                <span className="text-green-500">{t('common.copied')}</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>{t('common.copy')}</span>
              </>
            )}
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-start justify-center gap-8 overflow-auto py-2">
        {result.type === 'matrix' && renderMatrix(result.value)}
        {result.type === 'scalar' && (
          <div className="text-center">
            {result.label && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {result.label}
              </div>
            )}
            <div className="text-4xl font-mono font-bold text-blue-600 dark:text-blue-400">
              {formatNum(result.value)}
            </div>
          </div>
        )}
        {result.type === 'eigenvalues' && (
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              λ₁, λ₂, ...
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {result.values.map((v, i) => (
                <div
                  key={i}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg border border-indigo-200 dark:border-indigo-700"
                >
                  <span className="text-xs text-indigo-500 dark:text-indigo-400 mr-2">λ{i + 1}</span>
                  <span className="font-mono text-lg text-gray-800 dark:text-gray-100">
                    {formatNum(v)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {result.type === 'lu' && (
          <>
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">L</div>
              {renderMatrix(result.L)}
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">U</div>
              {renderMatrix(result.U)}
            </div>
          </>
        )}
        {result.type === 'qr' && (
          <>
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">Q</div>
              {renderMatrix(result.Q)}
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">R</div>
              {renderMatrix(result.R)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MatrixResult
export type { MatrixResultData }
