import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Ruler,
  Scale,
  Clock,
  Thermometer,
  Square,
  Box,
  Gauge,
  HardDrive,
  Compass,
  Activity,
  Binary,
} from 'lucide-react';

export type CategoryKey =
  | 'length'
  | 'mass'
  | 'time'
  | 'temperature'
  | 'area'
  | 'volume'
  | 'speed'
  | 'data'
  | 'angle'
  | 'pressure'
  | 'base';

interface UnitCategoryTabsProps {
  activeCategory: CategoryKey;
  onCategoryChange: (key: CategoryKey) => void;
}

const categories: Array<{
  key: CategoryKey;
  labelKey: string;
  icon: React.ComponentType<any>;
  color: string;
}> = [
  { key: 'length', labelKey: 'converter.length', icon: Ruler, color: 'from-blue-500 to-blue-600' },
  { key: 'mass', labelKey: 'converter.mass', icon: Scale, color: 'from-emerald-500 to-emerald-600' },
  { key: 'time', labelKey: 'converter.time', icon: Clock, color: 'from-amber-500 to-amber-600' },
  { key: 'temperature', labelKey: 'converter.temperature', icon: Thermometer, color: 'from-red-500 to-red-600' },
  { key: 'area', labelKey: 'converter.area', icon: Square, color: 'from-cyan-500 to-cyan-600' },
  { key: 'volume', labelKey: 'converter.volume', icon: Box, color: 'from-indigo-500 to-indigo-600' },
  { key: 'speed', labelKey: 'converter.speed', icon: Activity, color: 'from-pink-500 to-pink-600' },
  { key: 'data', labelKey: 'converter.data', icon: HardDrive, color: 'from-violet-500 to-violet-600' },
  { key: 'angle', labelKey: 'converter.angle', icon: Compass, color: 'from-teal-500 to-teal-600' },
  { key: 'pressure', labelKey: 'converter.pressure', icon: Gauge, color: 'from-orange-500 to-orange-600' },
  { key: 'base', labelKey: 'converter.baseConversion', icon: Binary, color: 'from-gray-600 to-gray-700' },
];

const UnitCategoryTabs: React.FC<UnitCategoryTabsProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onCategoryChange(cat.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-md transform scale-105`
                  : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm whitespace-nowrap">{t(cat.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UnitCategoryTabs;
