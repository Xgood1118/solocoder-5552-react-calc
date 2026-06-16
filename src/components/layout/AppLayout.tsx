import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calculator, Grid3x3, ArrowRightLeft } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { useEffect } from 'react';
import i18n from '@/i18n';

export default function AppLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const { theme, setLang, lang, setTheme } = useSettingsStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const navItems = [
    { path: '/', icon: Calculator, label: t('app.basic') },
    { path: '/matrix', icon: Grid3x3, label: t('app.matrix') },
    { path: '/converter', icon: ArrowRightLeft, label: t('app.converter') },
  ];

  const themes: { key: 'light' | 'dark' | 'retro' | 'bluewhite'; label: string }[] = [
    { key: 'light', label: t('theme.light') },
    { key: 'dark', label: t('theme.dark') },
    { key: 'retro', label: t('theme.retro') },
    { key: 'bluewhite', label: t('theme.bluewhite') },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-accent">
              <Calculator size={24} />
              <span className="hidden sm:inline">{t('app.title')}</span>
            </Link>

            <nav className="flex items-center gap-1 bg-bg-secondary rounded-xl p-1 border border-border">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as 'zh' | 'en')}
                className="px-3 py-2 rounded-lg bg-bg-secondary border border-border text-text-primary text-sm outline-none focus:border-accent transition-colors"
              >
                <option value="zh">中文</option>
                <option value="en">EN</option>
              </select>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'retro' | 'bluewhite')}
                className="px-3 py-2 rounded-lg bg-bg-secondary border border-border text-text-primary text-sm outline-none focus:border-accent transition-colors"
              >
                {themes.map((th) => (
                  <option key={th.key} value={th.key}>{th.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
