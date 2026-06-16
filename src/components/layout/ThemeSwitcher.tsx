import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/types/calculator';

const themeConfigs: { key: Theme; label: string; colors: string[] }[] = [
  { key: 'light', label: 'Light', colors: ['#F5F5F0', '#D97706', '#FFFFFF'] },
  { key: 'dark', label: 'Dark', colors: ['#1A1A2E', '#F59E0B', '#252542'] },
  { key: 'retro', label: 'Retro', colors: ['#2D4A2D', '#66FF66', '#0D1A0D'] },
  { key: 'bluewhite', label: 'Blue', colors: ['#FFFFFF', '#0066CC', '#F0F4F8'] },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {themeConfigs.map((config) => (
        <button
          key={config.key}
          onClick={() => setTheme(config.key)}
          title={config.label}
          className={`
            relative w-8 h-8 rounded-full border-2 transition-all duration-200
            hover:scale-110
            ${theme === config.key ? 'border-accent scale-110 ring-2 ring-accent/30' : 'border-border'}
          `}
          style={{ background: `linear-gradient(135deg, ${config.colors[0]} 0%, ${config.colors[1]} 50%, ${config.colors[2]} 100%)` }}
        >
          {theme === config.key && (
            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow">
              ✓
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
