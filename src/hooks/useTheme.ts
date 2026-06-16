import { useCallback, useEffect, useMemo } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import type { Theme } from '@/types/calculator'

export function useTheme() {
  const { theme, setTheme } = useSettingsStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const isDark = useMemo(() => theme === 'dark', [theme])
  const isRetro = useMemo(() => theme === 'retro', [theme])
  const isBluewhite = useMemo(() => theme === 'bluewhite', [theme])

  const cycleTheme = useCallback(() => {
    const themes: Theme[] = ['light', 'dark', 'retro', 'bluewhite']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }, [theme, setTheme])

  return {
    theme,
    isDark,
    isRetro,
    isBluewhite,
    setTheme,
    cycleTheme,
  }
}
