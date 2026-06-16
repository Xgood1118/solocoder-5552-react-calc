import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme, Lang, AngleMode, CalcMode } from '@/types/calculator'

interface SettingsState {
  theme: Theme
  lang: Lang
  angleMode: AngleMode
  calcMode: CalcMode
  setTheme: (theme: Theme) => void
  setLang: (lang: Lang) => void
  setAngleMode: (mode: AngleMode) => void
  setCalcMode: (mode: CalcMode) => void
  toggleAngleMode: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      lang: 'zh',
      angleMode: 'rad',
      calcMode: 'basic',
      setTheme: (theme) => set({ theme }),
      setLang: (lang) => set({ lang }),
      setAngleMode: (angleMode) => set({ angleMode }),
      setCalcMode: (calcMode) => set({ calcMode }),
      toggleAngleMode: () =>
        set((state) => ({
          angleMode: state.angleMode === 'rad' ? 'deg' : 'rad',
        })),
    }),
    {
      name: 'settings-storage',
    }
  )
)
