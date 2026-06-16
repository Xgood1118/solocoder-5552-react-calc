import { useState, useCallback, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import {
  createMatrix,
  cloneMatrix,
  matrixAdd,
  matrixSubtract,
  matrixMultiply,
  matrixTranspose,
  matrixInverse,
  matrixDeterminant,
  matrixEigenvalues,
  matrixLU,
  matrixQR,
  formatMatrix,
} from '@/engine/matrix'
import { ERROR_CODES, getErrorMessage } from '@/engine/errors'
import type { MatrixOperation, Matrix } from '@/types/matrix'
import type { MatrixResultData } from '@/components/matrix/MatrixResult'

const adjustMatrixSize = (m: Matrix, newRows: number, newCols: number): Matrix => {
  const result = createMatrix(newRows, newCols)
  const oldRows = m.length
  const oldCols = m[0]?.length ?? 0
  for (let i = 0; i < Math.min(oldRows, newRows); i++) {
    for (let j = 0; j < Math.min(oldCols, newCols); j++) {
      result[i][j] = new BigNumber(m[i][j])
    }
  }
  return result
}

export function useMatrix() {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'en' ? 'en' : 'zh') as 'zh' | 'en'

  const [rowsA, setRowsA] = useState(3)
  const [colsA, setColsA] = useState(3)
  const [dataA, setDataA] = useState<Matrix>(() => {
    const m = createMatrix(3, 3)
    m[0][0] = new BigNumber(1)
    m[1][1] = new BigNumber(1)
    m[2][2] = new BigNumber(1)
    return m
  })

  const [rowsB, setRowsB] = useState(3)
  const [colsB, setColsB] = useState(3)
  const [dataB, setDataB] = useState<Matrix>(() => {
    const m = createMatrix(3, 3)
    m[0][0] = new BigNumber(2)
    m[1][1] = new BigNumber(2)
    m[2][2] = new BigNumber(2)
    return m
  })

  const [result, setResult] = useState<MatrixResultData>(null)

  const handleRowsAChange = useCallback(
    (newRows: number) => {
      setRowsA(newRows)
      setDataA((prev) => adjustMatrixSize(prev, newRows, colsA))
    },
    [colsA]
  )

  const handleColsAChange = useCallback(
    (newCols: number) => {
      setColsA(newCols)
      setDataA((prev) => adjustMatrixSize(prev, rowsA, newCols))
    },
    [rowsA]
  )

  const handleRowsBChange = useCallback(
    (newRows: number) => {
      setRowsB(newRows)
      setDataB((prev) => adjustMatrixSize(prev, newRows, colsB))
    },
    [colsB]
  )

  const handleColsBChange = useCallback(
    (newCols: number) => {
      setColsB(newCols)
      setDataB((prev) => adjustMatrixSize(prev, rowsB, newCols))
    },
    [rowsB]
  )

  const checkDimMatch = useCallback((a: Matrix, b: Matrix, sameCols = true) => {
    if (a.length !== b.length) return false
    if (sameCols && a[0].length !== b[0].length) return false
    return true
  }, [])

  const handleOperation = useCallback(
    (op: MatrixOperation, target: 'A' | 'B') => {
      try {
        const A = cloneMatrix(dataA)
        const B = cloneMatrix(dataB)
        const source = target === 'A' ? A : B

        switch (op) {
          case 'add': {
            if (!checkDimMatch(A, B)) {
              setResult({
                type: 'error',
                message: getErrorMessage(ERROR_CODES.DIMENSION_MISMATCH, lang),
              })
              return
            }
            setResult({ type: 'matrix', value: matrixAdd(A, B) })
            break
          }
          case 'subtract': {
            if (!checkDimMatch(A, B)) {
              setResult({
                type: 'error',
                message: getErrorMessage(ERROR_CODES.DIMENSION_MISMATCH, lang),
              })
              return
            }
            setResult({ type: 'matrix', value: matrixSubtract(A, B) })
            break
          }
          case 'multiply': {
            if (A[0].length !== B.length) {
              setResult({
                type: 'error',
                message: getErrorMessage(ERROR_CODES.DIMENSION_MISMATCH, lang),
              })
              return
            }
            setResult({ type: 'matrix', value: matrixMultiply(A, B) })
            break
          }
          case 'transpose': {
            setResult({ type: 'matrix', value: matrixTranspose(source) })
            break
          }
          case 'inverse': {
            try {
              setResult({ type: 'matrix', value: matrixInverse(source) })
            } catch {
              setResult({
                type: 'error',
                message: getErrorMessage(ERROR_CODES.NOT_INVERTIBLE, lang),
              })
            }
            break
          }
          case 'determinant': {
            try {
              const det = matrixDeterminant(source)
              setResult({ type: 'scalar', value: det, label: target === 'A' ? '|A|' : '|B|' })
            } catch {
              setResult({
                type: 'error',
                message: getErrorMessage(ERROR_CODES.DIMENSION_MISMATCH, lang),
              })
            }
            break
          }
          case 'eigenvalues': {
            try {
              const vals = matrixEigenvalues(source)
              setResult({ type: 'eigenvalues', values: vals })
            } catch (e) {
              setResult({ type: 'error', message: (e as Error).message })
            }
            break
          }
          case 'lu': {
            try {
              const { L, U } = matrixLU(source)
              setResult({ type: 'lu', L, U })
            } catch {
              setResult({
                type: 'error',
                message: getErrorMessage(ERROR_CODES.DIMENSION_MISMATCH, lang),
              })
            }
            break
          }
          case 'qr': {
            try {
              const { Q, R } = matrixQR(source)
              setResult({ type: 'qr', Q, R })
            } catch (e) {
              setResult({ type: 'error', message: (e as Error).message })
            }
            break
          }
        }
      } catch (e) {
        setResult({ type: 'error', message: (e as Error).message })
      }
    },
    [dataA, dataB, lang, checkDimMatch]
  )

  const copyResult = useCallback(() => {
    if (!result) return

    let text = ''
    switch (result.type) {
      case 'matrix':
        text = formatMatrix(result.value)
        break
      case 'scalar':
        text = result.value.toString()
        break
      case 'eigenvalues':
        text = result.values.map((v) => v.toString()).join(', ')
        break
      case 'lu':
        text = `L:\n${formatMatrix(result.L)}\n\nU:\n${formatMatrix(result.U)}`
        break
      case 'qr':
        text = `Q:\n${formatMatrix(result.Q)}\n\nR:\n${formatMatrix(result.R)}`
        break
      case 'error':
        text = result.message
        break
    }

    if (text) {
      navigator.clipboard.writeText(text)
    }
  }, [result])

  const canCopy = useMemo(() => {
    return result !== null && result.type !== 'error'
  }, [result])

  return {
    matrixA: {
      rows: rowsA,
      cols: colsA,
      data: dataA,
      setData: setDataA,
      onRowsChange: handleRowsAChange,
      onColsChange: handleColsAChange,
    },
    matrixB: {
      rows: rowsB,
      cols: colsB,
      data: dataB,
      setData: setDataB,
      onRowsChange: handleRowsBChange,
      onColsChange: handleColsBChange,
    },
    result,
    handleOperation,
    copyResult,
    canCopy,
  }
}
