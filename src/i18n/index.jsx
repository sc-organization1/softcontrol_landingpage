import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import uz from './uz'
import ru from './ru'
import en from './en'

export const LANGS = [
  { code: 'uz', label: 'UZ' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
]
const DICTS = { uz, ru, en }
const STORAGE_KEY = 'sc-lang'

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && DICTS[saved]) return saved
  } catch {}
  const nav = (navigator.language || '').slice(0, 2)
  return DICTS[nav] ? nav : 'uz'
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem(STORAGE_KEY, lang) } catch {}
  }, [lang])

  // t('key') returns the text in the current language, falling back to English, then to the key itself
  const t = useCallback((key) => DICTS[lang][key] ?? en[key] ?? key, [lang])
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)
