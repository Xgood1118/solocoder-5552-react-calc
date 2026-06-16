import { useSettingsStore } from '@/store/settingsStore';
import { useTranslation } from 'react-i18next';
import type { CalcMode } from '@/types/calculator';

export default function ModeSwitch() {
  const { calcMode, setCalcMode } = useSettingsStore();
  const { t } = useTranslation();

  const modes: { key: CalcMode; label: string }[] = [
    { key: 'basic', label: t('app.basic') },
    { key: 'complex', label: t('app.complex') },
  ];

  return (
    <div className="inline-flex rounded-xl p-1 bg-bg-secondary border border-border">
      {modes.map((mode) => (
        <button
          key={mode.key}
          onClick={() => setCalcMode(mode.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            calcMode === mode.key
              ? 'bg-accent text-white shadow-md'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
