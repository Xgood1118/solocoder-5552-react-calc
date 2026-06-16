import { useCalculatorStore } from '@/store/calculatorStore';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  if (isToday) {
    return `${h}:${m}`;
  }
  const mo = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${mo}-${d} ${h}:${m}`;
}

export default function HistoryList() {
  const { history, clearHistory, loadFromHistory } = useCalculatorStore();
  const { t } = useTranslation();

  const handleClear = () => {
    if (window.confirm(t('calc.clearHistory') + '?')) {
      clearHistory();
    }
  };

  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-text-primary">{t('calc.history')}</h3>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-error hover:bg-error/10 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            {t('calc.clear')}
          </button>
        )}
      </div>

      {sortedHistory.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-text-secondary text-sm">
          {t('calc.noHistory')}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 -mr-1">
          {sortedHistory.map((entry) => (
            <div
              key={entry.id}
              onClick={() => loadFromHistory(entry)}
              className="p-3 rounded-xl cursor-pointer bg-bg-secondary border border-border hover:bg-bg-tertiary hover:border-accent/50 transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="font-mono text-text-primary text-sm break-all flex-1">
                  {entry.expression}
                </div>
                <span className="text-xs text-text-secondary flex-shrink-0 mt-0.5">
                  {formatTimestamp(entry.timestamp)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-secondary text-xs">=</span>
                <div className="font-mono text-accent font-semibold text-base break-all">
                  {entry.result}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
