import { useTranslation } from 'react-i18next'
import MatrixEditor from '@/components/matrix/MatrixEditor'
import MatrixOperations from '@/components/matrix/MatrixOperations'
import MatrixResult from '@/components/matrix/MatrixResult'
import { useMatrix } from '@/hooks/useMatrix'

const MatrixPage: React.FC = () => {
  const { t } = useTranslation()
  const { matrixA, matrixB, result, handleOperation, copyResult, canCopy } = useMatrix()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center">
          {t('app.matrix')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-6">
          <MatrixEditor
            rows={matrixA.rows}
            cols={matrixA.cols}
            data={matrixA.data}
            onDataChange={matrixA.setData}
            onRowsChange={matrixA.onRowsChange}
            onColsChange={matrixA.onColsChange}
            label={t('matrix.matrixA')}
          />

          <div className="flex lg:min-w-[180px]">
            <MatrixOperations onOperation={handleOperation} />
          </div>

          <MatrixEditor
            rows={matrixB.rows}
            cols={matrixB.cols}
            data={matrixB.data}
            onDataChange={matrixB.setData}
            onRowsChange={matrixB.onRowsChange}
            onColsChange={matrixB.onColsChange}
            label={t('matrix.matrixB')}
          />
        </div>

        <MatrixResult result={result} onCopy={copyResult} canCopy={canCopy} />
      </div>
    </div>
  )
}

export default MatrixPage
