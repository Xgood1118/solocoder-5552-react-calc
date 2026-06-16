export type Theme = 'light' | 'dark' | 'retro' | 'bluewhite'
export type Lang = 'zh' | 'en'
export type AngleMode = 'rad' | 'deg'
export type CalcMode = 'basic' | 'complex'

export interface HistoryEntry {
  id: string
  expression: string
  result: string
  timestamp: number
}

export interface UserVariable {
  value: string
  expression: string
}
