import { useState, useMemo, useCallback, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getUnitsByCategory, convertUnit } from '@/engine/units'
import { convertBase, isValidInBase } from '@/engine/base'
import type { UnitCategoryKey } from '@/types/units'
import type { UnitDef } from '@/types/units'

type BaseKey = 2 | 8 | 10 | 16

const formatOutput = (v: BigNumber): string => {
  if (v.isNaN() || !v.isFinite()) return ''
  const abs = v.abs()
  if (abs.isZero()) return '0'
  if (abs.isGreaterThan(new BigNumber('1e15')) || (abs.isLessThan(new BigNumber('1e-8')) && !abs.isZero())) {
    return v.toExponential(10)
  }
  const str = v.dp(12, BigNumber.ROUND_HALF_UP).toString()
  return str.replace(/\.?0+$/, '')
}

export function useConverter(categoryKey: UnitCategoryKey | 'base') {
  const units = useMemo(() => {
    if (categoryKey === 'base') return []
    return getUnitsByCategory(categoryKey)
  }, [categoryKey])

  const [leftValue, setLeftValue] = useState<string>('1')
  const [leftUnit, setLeftUnit] = useState<string>('')
  const [rightValue, setRightValue] = useState<string>('')
  const [rightUnit, setRightUnit] = useState<string>('')

  useEffect(() => {
    if (categoryKey === 'base') return
    const unitList = getUnitsByCategory(categoryKey)
    if (unitList.length === 0) return
    const newLeftUnit = unitList[0].symbol
    const newRightUnit = unitList[1]?.symbol ?? unitList[0].symbol
    setLeftUnit(newLeftUnit)
    setRightUnit(newRightUnit)
    try {
      const val = new BigNumber('1')
      const result = convertUnit(val, newLeftUnit, newRightUnit, categoryKey as UnitCategoryKey)
      setLeftValue('1')
      setRightValue(formatOutput(result))
    } catch {
      setLeftValue('1')
      setRightValue('')
    }
  }, [categoryKey])

  const [baseValues, setBaseValues] = useState<Record<BaseKey, string>>({
    2: '1010',
    8: '12',
    10: '10',
    16: 'A',
  })
  const [baseError, setBaseError] = useState<string>('')

  const isTemperature = categoryKey === 'temperature'
  const isBaseMode = categoryKey === 'base'

  const convertFromLeft = useCallback(
    (valStr: string, from: string, to: string) => {
      if (!valStr || valStr === '-' || valStr === '.') {
        setRightValue('')
        return
      }
      try {
        const val = new BigNumber(valStr)
        if (val.isNaN()) {
          setRightValue('')
          return
        }
        const result = convertUnit(val, from, to, categoryKey as UnitCategoryKey)
        setRightValue(formatOutput(result))
      } catch {
        setRightValue('')
      }
    },
    [categoryKey]
  )

  const convertFromRight = useCallback(
    (valStr: string, from: string, to: string) => {
      if (!valStr || valStr === '-' || valStr === '.') {
        setLeftValue('')
        return
      }
      try {
        const val = new BigNumber(valStr)
        if (val.isNaN()) {
          setLeftValue('')
          return
        }
        const result = convertUnit(val, from, to, categoryKey as UnitCategoryKey)
        setLeftValue(formatOutput(result))
      } catch {
        setLeftValue('')
      }
    },
    [categoryKey]
  )

  const handleLeftValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value
      if (v === '' || /^-?\d*\.?\d*$/.test(v)) {
        setLeftValue(v)
        convertFromLeft(v, leftUnit, rightUnit)
      }
    },
    [leftUnit, rightUnit, convertFromLeft]
  )

  const handleRightValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value
      if (v === '' || /^-?\d*\.?\d*$/.test(v)) {
        setRightValue(v)
        convertFromRight(v, rightUnit, leftUnit)
      }
    },
    [leftUnit, rightUnit, convertFromRight]
  )

  const handleLeftUnitChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newUnit = e.target.value
      setLeftUnit(newUnit)
      convertFromLeft(leftValue, newUnit, rightUnit)
    },
    [leftValue, rightUnit, convertFromLeft]
  )

  const handleRightUnitChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newUnit = e.target.value
      setRightUnit(newUnit)
      convertFromLeft(leftValue, leftUnit, newUnit)
    },
    [leftValue, leftUnit, convertFromLeft]
  )

  const swapUnits = useCallback(() => {
    const lu = leftUnit
    const lv = leftValue
    setLeftUnit(rightUnit)
    setRightUnit(lu)
    setLeftValue(rightValue)
    setRightValue(lv)
  }, [leftUnit, leftValue, rightUnit, rightValue])

  const updateAllBases = useCallback(
    (sourceBase: BaseKey, value: string) => {
      setBaseError('')
      const trimmed = value.trim()

      if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') {
        const newValues: Record<BaseKey, string> = { ...baseValues }
        newValues[sourceBase] = value
        ;(Object.keys(newValues) as unknown as BaseKey[]).forEach((b) => {
          if (b !== sourceBase) newValues[b] = ''
        })
        setBaseValues(newValues)
        return
      }

      if (!isValidInBase(trimmed, sourceBase)) {
        setBaseError(`Invalid input for base ${sourceBase}`)
        const newValues: Record<BaseKey, string> = { ...baseValues }
        newValues[sourceBase] = value
        setBaseValues(newValues)
        return
      }

      try {
        const newValues: Record<BaseKey, string> = { ...baseValues }
        newValues[sourceBase] = value.toUpperCase()
        ;(Object.keys(newValues) as unknown as BaseKey[]).forEach((b) => {
          if (b !== sourceBase) {
            newValues[b] = convertBase(trimmed, sourceBase, b)
          }
        })
        setBaseValues(newValues)
      } catch (e) {
        setBaseError((e as Error).message)
      }
    },
    [baseValues]
  )

  const handleBaseInputChange = useCallback(
    (base: BaseKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      updateAllBases(base, val)
    },
    [updateAllBases]
  )

  return {
    unit: {
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
    },
    base: {
      values: baseValues,
      error: baseError,
      handleInputChange: handleBaseInputChange,
    },
    isBaseMode,
  }
}
