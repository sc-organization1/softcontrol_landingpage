import { useCallback, useEffect, useState } from 'react'

// The saved theme is applied before first paint by the small script in index.html
const STORAGE_KEY = 'sc-theme'
const BAR_COLOR = { light: '#16233B', dark: '#0A101C' }
const FADE_MS = 500 // a little longer than the 0.45s fade in index.css

function savedTheme() {
  try {
    const theme = localStorage.getItem(STORAGE_KEY)
    return theme === 'dark' || theme === 'light' ? theme : null
  } catch {
    return null
  }
}

const systemQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

/** Follows the visitor's system setting until they choose a theme with the toggle */
export function useTheme() {
  const [theme, setTheme] = useState(() => savedTheme() ?? (systemQuery().matches ? 'dark' : 'light'))

  useEffect(() => {
    const query = systemQuery()
    const onChange = () => { if (!savedTheme()) setTheme(query.matches ? 'dark' : 'light') }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BAR_COLOR[theme])
  }, [theme])

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const root = document.documentElement
    root.classList.add('theme-fade')
    clearTimeout(window.__scThemeFade)
    window.__scThemeFade = setTimeout(() => root.classList.remove('theme-fade'), FADE_MS)
    root.dataset.theme = next
    try { localStorage.setItem(STORAGE_KEY, next) } catch {}
    setTheme(next)
  }, [theme])

  return { theme, toggle }
}
