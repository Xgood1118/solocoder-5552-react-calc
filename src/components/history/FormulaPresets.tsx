import { useCalculatorStore } from '@/store/calculatorStore';
import { useTranslation } from 'react-i18next';
import { Sigma } from 'lucide-react';

interface Preset {
  key: string;
  formula: string;
}

const presets: Preset[] = [
  { key: 'pythagorean', formula: 'a^2+b^2' },
  { key: 'quadratic', formula: '(-b+sqrt(b^2-4*a*c))/(2*a)' },
  { key: 'sphereVolume', formula: '(4/3)*pi*r^3' },
  { key: 'eulerIdentity', formula: 'e^(i*pi)+1' },
];

export default function FormulaPresets() {
  const { insertAtCursor, clearError } = useCalculatorStore();
  const { t } = useTranslation();

  const handleClick = (formula: string) => {
    clearError();
    insertAtCursor(formula);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <Sigma size={20} className="text-accent" />
        <h3 className="text-lg font-semibold text-text-primary">{t('calc.presets')}</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 -mr-1">
        {presets.map((preset) => (
          <div
            key={preset.key}
            onClick={() => handleClick(preset.formula)}
            className="p-4 rounded-xl cursor-pointer bg-bg-secondary border border-border hover:bg-bg-tertiary hover:border-accent/50 transition-all group"
          >
            <div className="font-medium text-text-primary mb-2 group-hover:text-accent transition-colors">
              {t(`preset.${preset.key}`)}
            </div>
            <div className="font-mono text-sm text-text-secondary bg-bg-tertiary rounded-lg px-3 py-2 break-all">
              {preset.formula}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
