import { useRef, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { Plus, Minus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Matrix } from '@/types/matrix'

interface MatrixEditorProps {
  rows: number
  cols: number
  data: Matrix
  onDataChange: (data: Matrix) => void
  onRowsChange: (rows: number) => void
  onColsChange: (cols: number) => void
  label: string
}

const MatrixEditor: React.FC<MatrixEditorProps> = ({
  rows,
  cols,
  data,
  onDataChange,
  onRowsChange,
  onColsChange,
  label,
}) => {
  const { t } = useTranslation()
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([])

  useEffect(() => {
    inputRefs.current = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null)
    )
  }, [rows, cols])

  const handleCellChange = (row: number, col: number, value: string) => {
    const newData = data.map((r) => r.map((v) => new BigNumber(v)))
    if (value === '' || value === '-') {
      newData[row][col] = new BigNumber(0)
    } else {
      const num = new BigNumber(value)
      if (!num.isNaN()) {
        newData[row][col] = num
      }
    }
    onDataChange(newData)
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    let nextRow = row
    let nextCol = col

    switch (e.key) {
      case 'Tab':
        if (e.shiftKey) {
          if (col > 0) {
            nextCol = col - 1
          } else if (row > 0) {
            nextRow = row - 1
            nextCol = cols - 1
          }
        } else {
          if (col < cols - 1) {
            nextCol = col + 1
          } else if (row < rows - 1) {
            nextRow = row + 1
            nextCol = 0
          }
        }
        break
      case 'ArrowUp':
        if (row > 0) {
          nextRow = row - 1
          e.preventDefault()
        }
        break
      case 'ArrowDown':
        if (row < rows - 1) {
          nextRow = row + 1
          e.preventDefault()
        }
        break
      case 'ArrowLeft':
        if (col > 0 && (e.currentTarget.selectionStart === 0 || e.currentTarget.selectionStart === null)) {
          nextCol = col - 1
          e.preventDefault()
        }
        break
      case 'ArrowRight':
        if (col < cols - 1 && e.currentTarget.selectionStart === e.currentTarget.value.length) {
          nextCol = col + 1
          e.preventDefault()
        }
        break
      default:
        return
    }

    if (nextRow !== row || nextCol !== col) {
      e.preventDefault()
      const nextInput = inputRefs.current[nextRow]?.[nextCol]
      if (nextInput) {
        nextInput.focus()
        nextInput.select()
      }
    }
  }

  const adjustRows = (delta: number) => {
    const newRows = Math.max(1, Math.min(10, rows + delta))
    onRowsChange(newRows)
  }

  const adjustCols = (delta: number) => {
    const newCols = Math.max(1, Math.min(10, cols + delta))
    onColsChange(newCols)
  }

  const formatValue = (v: BigNumber) => {
    if (v.isZero()) return ''
    const str = v.toString()
    return str === '0' ? '' : str
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{label}</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">{t('matrix.rows')}: {rows}</span>
            <button
              onClick={() => adjustRows(-1)}
              disabled={rows <= 1}
              className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={16} className="text-gray-700 dark:text-gray-200" />
            </button>
            <button
              onClick={() => adjustRows(1)}
              disabled={rows >= 10}
              className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={16} className="text-gray-700 dark:text-gray-200" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">{t('matrix.cols')}: {cols}</span>
            <button
              onClick={() => adjustCols(-1)}
              disabled={cols <= 1}
              className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={16} className="text-gray-700 dark:text-gray-200" />
            </button>
            <button
              onClick={() => adjustCols(1)}
              disabled={cols >= 10}
              className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={16} className="text-gray-700 dark:text-gray-200" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="w-8 h-8"></th>
              {Array.from({ length: cols }).map((_, j) => (
                <th
                  key={j}
                  className="w-16 h-8 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {j + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                <td className="w-8 h-10 text-center text-xs font-medium text-gray-500 dark:text-gray-400 align-middle">
                  {i + 1}
                </td>
                {Array.from({ length: cols }).map((_, j) => (
                  <td key={j} className="p-0.5">
                    <input
                      ref={(el) => {
                        if (!inputRefs.current[i]) inputRefs.current[i] = []
                        inputRefs.current[i][j] = el
                      }}
                      type="text"
                      inputMode="decimal"
                      value={formatValue(data[i]?.[j] ?? new BigNumber(0))}
                      onChange={(e) => handleCellChange(i, j, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, i, j)}
                      onFocus={(e) => e.target.select()}
                      className="w-16 h-10 text-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MatrixEditor
