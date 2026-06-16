import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './zh.json'
import en from './en.json'

const savedLang = (() => {
  try {
    const raw = localStorage.getItem('settings-storage')
    if (raw) {
      const parsed = JSON.parse(raw)
      return parsed?.state?.lang ?? 'zh'
    }
  } catch {}
  return 'zh'
})()

i18n.use(initReactI18next).init({
  resources: {
    zh: { translation: zh },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: 'zh',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
