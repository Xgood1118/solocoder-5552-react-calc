import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserVariable } from '@/types/calculator'

interface VariableState {
  variables: Record<string, UserVariable>
  setVariable: (name: string, value: string, expression: string) => void
  removeVariable: (name: string) => void
  getVariable: (name: string) => UserVariable | undefined
  clearVariables: () => void
}

export const useVariableStore = create<VariableState>()(
  persist(
    (set, get) => ({
      variables: {},
      setVariable: (name, value, expression) =>
        set((state) => ({
          variables: {
            ...state.variables,
            [name]: { value, expression },
          },
        })),
      removeVariable: (name) =>
        set((state) => {
          const { [name]: _, ...rest } = state.variables
          return { variables: rest }
        }),
      getVariable: (name) => get().variables[name],
      clearVariables: () => set({ variables: {} }),
    }),
    {
      name: 'variable-storage',
    }
  )
)
