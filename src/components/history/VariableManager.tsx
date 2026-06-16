import { useState } from 'react';
import { useVariableStore } from '@/store/variableStore';
import { useCalculatorStore } from '@/store/calculatorStore';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, X } from 'lucide-react';

export default function VariableManager() {
  const { variables, setVariable, removeVariable } = useVariableStore();
  const { lastResult } = useCalculatorStore();
  const { t } = useTranslation();

  const [varName, setVarName] = useState('');
  const [varValue, setVarValue] = useState('');

  const handleAddVariable = () => {
    const name = varName.toUpperCase().trim();
    const value = varValue.trim();
    if (name && /^[A-Z]$/.test(name) && value) {
      setVariable(name, value, value);
      setVarName('');
      setVarValue('');
    }
  };

  const handleSaveLastResult = (slot: string) => {
    if (lastResult) {
      setVariable(slot, lastResult, lastResult);
    }
  };

  const variableEntries = Object.entries(variables).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-text-primary">{t('calc.variables')}</h3>
      </div>

      <div className="space-y-3 mb-4 flex-shrink-0">
        <div className="p-3 rounded-xl bg-bg-secondary border border-border">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={varName}
              onChange={(e) => setVarName(e.target.value.toUpperCase().slice(0, 1))}
              placeholder="A-Z"
              maxLength={1}
              className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-bg-tertiary border border-border text-text-primary font-mono text-sm outline-none focus:border-accent transition-colors uppercase"
            />
            <input
              type="text"
              value={varValue}
              onChange={(e) => setVarValue(e.target.value)}
              placeholder="value"
              className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-bg-tertiary border border-border text-text-primary font-mono text-sm outline-none focus:border-accent transition-colors"
            />
            <button
              onClick={handleAddVariable}
              disabled={!varName || !varValue}
              className="px-3 py-2 rounded-lg bg-accent text-white hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="flex gap-2">
            {['A', 'B', 'C'].map((slot) => (
              <button
                key={slot}
                onClick={() => handleSaveLastResult(slot)}
                disabled={!lastResult}
                className="flex-1 px-2 py-1.5 rounded-lg bg-bg-tertiary border border-border text-text-secondary text-xs font-medium hover:border-accent hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {t('calc.ans')}→{slot}
              </button>
            ))}
          </div>
        </div>
      </div>

      {variableEntries.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-text-secondary text-sm">
          {t('calc.noVariables')}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 -mr-1">
          {variableEntries.map(([name, data]) => (
            <div
              key={name}
              className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary border border-border hover:border-accent/30 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-accent/15 text-accent font-mono font-bold text-sm">
                  {name}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-text-primary text-sm truncate">
                    {data.value}
                  </div>
                  {data.expression && data.expression !== data.value && (
                    <div className="font-mono text-text-secondary text-xs truncate mt-0.5">
                      {data.expression}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeVariable(name)}
                className="flex-shrink-0 ml-2 p-1.5 rounded-lg text-text-secondary hover:text-error hover:bg-error/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
