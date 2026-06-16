import { useTranslation } from 'react-i18next'
import type { MatrixOperation } from '@/types/matrix'

interface MatrixOperationsProps {
  onOperation: (op: MatrixOperation, target: 'A' | 'B') => void
}

const MatrixOperations: React.FC<MatrixOperationsProps> = ({ onOperation }) => {
  const { t } = useTranslation()

  const binaryOps = [
    { key: 'add' as const, label: 'A+B', display: t('matrix.add') },
    { key: 'subtract' as const, label: 'A−B', display: t('matrix.subtract') },
    { key: 'multiply' as const, label: 'A×B', display: t('matrix.multiply') },
  ]

  const unaryOps = [
    { key: 'transpose' as const, label: 'Aᵀ', display: t('matrix.transpose') },
    { key: 'inverse' as const, label: 'A⁻¹', display: t('matrix.inverse') },
    { key: 'determinant' as const, label: '|A|', display: t('matrix.determinant') },
    { key: 'eigenvalues' as const, label: 'λ', display: t('matrix.eigenvalues') },
    { key: 'lu' as const, label: 'LU', display: t('matrix.luDecomposition') },
    { key: 'qr' as const, label: 'QR', display: t('matrix.qrDecomposition') },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col gap-4 h-full">
      <div>
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">
          Binary
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {binaryOps.map((op) => (
            <button
              key={op.key}
              onClick={() => onOperation(op.key, 'A')}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              title={op.display}
            >
              <span className="text-xl font-mono">{op.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">
          Unary (A)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {unaryOps.slice(0, 4).map((op) => (
            <button
              key={op.key}
              onClick={() => onOperation(op.key, 'A')}
              className="py-3 px-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              title={op.display}
            >
              <span className="text-lg font-mono">{op.label}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {unaryOps.slice(4).map((op) => (
            <button
              key={op.key}
              onClick={() => onOperation(op.key, 'A')}
              className="py-3 px-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              title={op.display}
            >
              <span className="text-lg font-mono">{op.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">
          Unary (B)
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onOperation('transpose', 'B')}
            className="py-2.5 px-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
            title={t('matrix.transpose')}
          >
            <span className="font-mono">Bᵀ</span>
          </button>
          <button
            onClick={() => onOperation('inverse', 'B')}
            className="py-2.5 px-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
            title={t('matrix.inverse')}
          >
            <span className="font-mono">B⁻¹</span>
          </button>
          <button
            onClick={() => onOperation('determinant', 'B')}
            className="py-2.5 px-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
            title={t('matrix.determinant')}
          >
            <span className="font-mono">|B|</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MatrixOperations
