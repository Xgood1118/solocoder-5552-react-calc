import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { HistoryEntry } from '@/types/calculator'

interface CalculatorState {
  expression: string
  cursorPosition: number
  result: string
  lastResult: string
  history: HistoryEntry[]
  error: string | null
  setExpression: (expression: string) => void
  setCursorPosition: (position: number) => void
  setResult: (result: string) => void
  setLastResult: (result: string) => void
  addHistory: (entry: HistoryEntry) => void
  clearHistory: () => void
  loadFromHistory: (entry: HistoryEntry) => void
  setError: (error: string) => void
  clearError: () => void
  backspace: () => void
  insertAtCursor: (text: string) => void
}

const MAX_HISTORY = 100

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      expression: '',
      cursorPosition: 0,
      result: '',
      lastResult: '',
      history: [],
      error: null,
      setExpression: (expression) => set({ expression }),
      setCursorPosition: (cursorPosition) => set({ cursorPosition }),
      setResult: (result) => set({ result }),
      setLastResult: (lastResult) => set({ lastResult }),
      addHistory: (entry) =>
        set((state) => ({
          history: [entry, ...state.history].slice(0, MAX_HISTORY),
        })),
      clearHistory: () => set({ history: [] }),
      loadFromHistory: (entry) =>
        set({
          expression: entry.expression,
          result: entry.result,
          cursorPosition: entry.expression.length,
          error: null,
        }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      backspace: () =>
        set((state) => {
          if (state.cursorPosition <= 0) return state
          const newExpression =
            state.expression.slice(0, state.cursorPosition - 1) +
            state.expression.slice(state.cursorPosition)
          return {
            expression: newExpression,
            cursorPosition: state.cursorPosition - 1,
          }
        }),
      insertAtCursor: (text) =>
        set((state) => {
          const newExpression =
            state.expression.slice(0, state.cursorPosition) +
            text +
            state.expression.slice(state.cursorPosition)
          return {
            expression: newExpression,
            cursorPosition: state.cursorPosition + text.length,
          }
        }),
    }),
    {
      name: 'calculator-storage',
      partialize: (state) => ({
        history: state.history,
        lastResult: state.lastResult,
      }),
    }
  )
)
