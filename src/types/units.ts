import type BigNumber from 'bignumber.js'

export type UnitCategoryKey =
  | 'length'
  | 'mass'
  | 'time'
  | 'temperature'
  | 'area'
  | 'volume'
  | 'speed'
  | 'data'
  | 'angle'
  | 'pressure'

export interface UnitDef {
  name: string
  nameEn: string
  symbol: string
  toBase: (v: BigNumber) => BigNumber
  fromBase: (v: BigNumber) => BigNumber
}

export interface BaseConversionResult {
  integer: string
  fraction: string
  full: string
}
