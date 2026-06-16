import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '@/store/settingsStore'
import { useCalculator } from '@/hooks/useCalculator'
import ExpressionInput from '@/components/calculator/ExpressionInput'
import ScientificKeyboard from '@/components/calculator/ScientificKeyboard'
import ComplexKeyboard from '@/components/calculator/ComplexKeyboard'
import ModeSwitch from '@/components/calculator/ModeSwitch'
import ResultDisplay from '@/components/calculator/ResultDisplay'
import HistoryList from '@/components/history/HistoryList'
import FormulaPresets from '@/components/history/FormulaPresets'
import VariableManager from '@/components/history/VariableManager'
import { History, Book, Variable, ChevronRight, ChevronLeft, Clock } from 'lucide-react'
import type { CalcMode } from '@/types/calculator'

type SidebarTab = 'history' | 'presets' | 'variables'

export default function CalculatorPage() {
  const { calcMode } = useSettingsStore()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<SidebarTab>('history')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { handleKeyPress } = useCalculator()
  const currentCalcMode = calcMode as CalcMode

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyPress(e.key)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyPress])

  const tabs: { key: SidebarTab; icon: typeof History; label: string }[] = [
    { key: 'history', icon: History, label: t('calc.history') },
    { key: 'presets', icon: Book, label: t('calc.presets') },
    { key: 'variables', icon: Variable, label: t('calc.variables') },
  ]

  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden">
      <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <ModeSwitch />
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Clock size={16} />
              <span>{useSettingsStore.getState().angleMode.toUpperCase()}</span>
            </div>
          </div>

          <ExpressionInput />
          <ResultDisplay />
          {currentCalcMode === 'basic' ? <ScientificKeyboard /> : <ComplexKeyboard />}
        </div>
      </div>

      <div
        className={`flex-shrink-0 border-l border-border bg-bg-secondary/50 flex flex-col transition-all duration-300 overflow-hidden ${
          sidebarOpen ? 'w-[320px]' : 'w-12'
        }`}
      >
        <div className="flex items-center justify-between p-3 border-b border-border flex-shrink-0">
          {sidebarOpen ? (
            <div className="flex items-center gap-1 bg-bg-tertiary rounded-lg p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-2 py-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key)
                      setSidebarOpen(true)
                    }}
                    className={`p-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                    }`}
                    title={tab.label}
                  >
                    <Icon size={18} />
                  </button>
                )
              })}
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex-shrink-0 p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
          >
            {sidebarOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {sidebarOpen && (
          <div className="flex-1 overflow-hidden p-4">
            {activeTab === 'history' && <HistoryList />}
            {activeTab === 'presets' && <FormulaPresets />}
            {activeTab === 'variables' && <VariableManager />}
          </div>
        )}
      </div>
    </div>
  )
}
